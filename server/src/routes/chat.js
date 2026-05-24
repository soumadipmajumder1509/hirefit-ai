const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { connect } = require('../db');
const Analysis = require('../models/Analysis');
const ChatMessage = require('../models/ChatMessage');
const { chatAboutAnalysis } = require('../services/geminiService');

// GET /api/chat/:analysisId — fetch history
router.get('/:analysisId', requireAuth, async (req, res) => {
  try {
    await connect();
    const analysis = await Analysis.findOne({ _id: req.params.analysisId, userId: req.user.uid }).lean();
    if (!analysis) return res.status(403).json({ error: 'Access denied.' });

    const messages = await ChatMessage.find({ analysisId: req.params.analysisId })
      .sort({ createdAt: 1 })
      .lean();

    res.json(messages.map(m => ({ id: m._id, role: m.role, content: m.content, createdAt: m.createdAt })));
  } catch (err) {
    console.error('Chat fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history.' });
  }
});

// POST /api/chat/:analysisId — send message
router.post('/:analysisId', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' });

    await connect();
    const analysis = await Analysis.findOne({ _id: req.params.analysisId, userId: req.user.uid }).lean();
    if (!analysis) return res.status(403).json({ error: 'Access denied.' });

    const history = await ChatMessage.find({ analysisId: req.params.analysisId })
      .sort({ createdAt: 1 })
      .limit(20)
      .lean();

    await ChatMessage.create({ analysisId: req.params.analysisId, role: 'user', content: message.trim() });

    const aiResponse = await chatAboutAnalysis(
      { score: analysis.score, ...analysis.analysis },
      history.map(h => ({ role: h.role, content: h.content })),
      message.trim()
    );

    const saved = await ChatMessage.create({ analysisId: req.params.analysisId, role: 'assistant', content: aiResponse });

    res.json({ id: saved._id, role: 'assistant', content: aiResponse, createdAt: saved.createdAt });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message || 'Chat failed. Please try again.' });
  }
});

module.exports = router;
