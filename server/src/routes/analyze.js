const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAuth } = require('../middleware/auth');
const { extractText } = require('../services/textExtractor');
const { analyzeResumeVsJob } = require('../services/geminiService');
const { connect } = require('../db');
const Analysis = require('../models/Analysis');

// POST /api/analyze
router.post('/', requireAuth, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobFile', maxCount: 1 },
]), async (req, res) => {
  try {
    await connect();

    const resumeFile = req.files?.resume?.[0];
    const jobFile    = req.files?.jobFile?.[0];
    const { jobText, jobSource } = req.body;

    if (!resumeFile) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    const resumeText = await extractText(resumeFile.buffer, resumeFile.mimetype);
    if (!resumeText || resumeText.length < 50) {
      return res.status(400).json({ error: 'Could not extract text from resume. Ensure the file is not a scanned image.' });
    }

    let finalJobDescription = jobText?.trim();
    if (jobFile && !finalJobDescription) {
      finalJobDescription = await extractText(jobFile.buffer, jobFile.mimetype);
    }
    if (!finalJobDescription || finalJobDescription.length < 30) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    const analysisResult = await analyzeResumeVsJob(resumeText, finalJobDescription);

    const saved = await Analysis.create({
      userId:         req.user.uid,
      resumeFilename: resumeFile.originalname,
      resumeText,
      jobDescription: finalJobDescription,
      jobSource:      jobSource || null,
      score:          analysisResult.overall_score,
      analysis:       analysisResult,
    });

    res.json({ id: saved._id, score: saved.score, analysis: saved.analysis, createdAt: saved.createdAt });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
});

// GET /api/analyze — list user's analyses
router.get('/', requireAuth, async (req, res) => {
  try {
    await connect();
    const docs = await Analysis.find({ userId: req.user.uid })
      .select('resumeFilename jobSource score analysis createdAt')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(docs.map(d => ({
      id:             d._id,
      resumeFilename: d.resumeFilename,
      jobSource:      d.jobSource,
      score:          d.score,
      recommendation: d.analysis?.recommendation,
      summary:        d.analysis?.summary,
      createdAt:      d.createdAt,
    })));
  } catch (err) {
    console.error('List analyses error:', err);
    res.status(500).json({ error: 'Failed to list analyses.' });
  }
});

// GET /api/analyze/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    await connect();
    const doc = await Analysis.findOne({ _id: req.params.id, userId: req.user.uid }).lean();
    if (!doc) return res.status(404).json({ error: 'Analysis not found.' });

    res.json({
      id:             doc._id,
      resumeFilename: doc.resumeFilename,
      jobSource:      doc.jobSource,
      score:          doc.score,
      analysis:       doc.analysis,
      createdAt:      doc.createdAt,
    });
  } catch (err) {
    console.error('Fetch analysis error:', err);
    res.status(500).json({ error: 'Failed to fetch analysis.' });
  }
});

module.exports = router;
