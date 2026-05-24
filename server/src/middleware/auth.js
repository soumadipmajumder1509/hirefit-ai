const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps.length) return;

  const projectId   = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId) {
    throw new Error('FIREBASE_PROJECT_ID is not set in server/.env');
  }

  if (clientEmail && privateKey) {
    admin.initializeApp({ credential: admin.credential.cert({ projectId, clientEmail, privateKey }) });
  } else {
    // Fallback for GCP / GOOGLE_APPLICATION_CREDENTIALS env
    admin.initializeApp({ projectId });
  }
}

async function requireAuth(req, res, next) {
  try {
    initFirebase();
  } catch (err) {
    return res.status(500).json({ error: `Firebase not configured: ${err.message}` });
  }

  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }

  const token = header.slice(7);
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email, name: decoded.name };
    next();
  } catch (err) {
    console.error('Token verification failed:', err.code);
    res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

module.exports = { requireAuth };
