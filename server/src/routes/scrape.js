const express = require('express');
const router = express.Router();
const { scrapeJobDescription } = require('../services/scraperService');

// POST /api/scrape
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url?.trim()) {
      return res.status(400).json({ error: 'URL is required.' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return res.status(400).json({ error: 'Invalid URL format.' });
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).json({ error: 'Only HTTP/HTTPS URLs are supported.' });
    }

    const { text, source } = await scrapeJobDescription(url.trim());
    res.json({ text, source, url: url.trim() });
  } catch (err) {
    console.error('Scrape error:', err);
    res.status(422).json({ error: err.message || 'Failed to scrape job description.' });
  }
});

module.exports = router;
