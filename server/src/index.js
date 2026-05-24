// Node.js 18 polyfill — File global was added in Node 20; undici needs it
if (!global.File) global.File = require('buffer').File;

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const analyzeRoutes = require('./routes/analyze');
const chatRoutes    = require('./routes/chat');
const scrapeRoutes  = require('./routes/scrape');

const app  = express();
const PORT = process.env.PORT || 3001;

// Allow both local dev and any deployed frontend URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/analyze', analyzeRoutes);
app.use('/api/chat',    chatRoutes);
app.use('/api/scrape',  scrapeRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Local dev
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Vercel serverless export
module.exports = app;
