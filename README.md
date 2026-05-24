<div align="center">

# HireFit AI

### AI-Powered Resume Analyser & Job Match Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-hirefitai.vercel.app-6d28d9?style=for-the-badge&logo=vercel)](https://hirefitai.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-soumadipmajumder1509-181717?style=for-the-badge&logo=github)](https://github.com/soumadipmajumder1509/hirefit-ai)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_2.5-4285F4?style=for-the-badge&logo=google&logoColor=white)

**Upload your resume. Paste a job description. Get an instant AI-powered match score, skill gap analysis, and a personal career coach — all in one place.**

[**→ Try it live**](https://hirefitai.vercel.app)

</div>

---

## What It Does

HireFit AI acts like a senior recruiter + ATS system reviewing your resume in real time. In under 30 seconds it gives you:

- A **match score out of 100** with a detailed breakdown by category
- **Skill gap analysis** — which skills you have, which are missing, and bonus skills
- **Prioritised improvement suggestions** for every section of your resume
- A **personal AI career coach** you can chat with about your specific analysis
- A **history page** showing every past analysis, tied to your Google account

---

## Features

| Feature | Details |
|---|---|
| Resume Upload | PDF, DOCX, and plain text — parsed server-side, never stored as files |
| Job Description Input | Paste text, upload a file, or drop a URL — auto-scraped with Cheerio |
| AI Match Score | 0–100 score via Gemini 2.5 Flash with section-level breakdown |
| Skill Analysis | Matched skills, missing skills, bonus skills, radar chart visualisation |
| Improvement Suggestions | Per-section recommendations with priority levels (high / medium / low) |
| AI Career Coach | Persistent chat per analysis using Gemini with full conversation history |
| Analysis History | All past analyses stored in MongoDB, scoped to the signed-in user |
| Google Auth | Firebase Authentication — sign in with Google, data isolated per user |
| ATS Simulation | Evaluates keyword density, formatting signals, and section completeness |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks-based state management |
| **Vite** | Lightning-fast dev server and build tool |
| **Tailwind CSS** | Utility-first styling with a custom dark design system |
| **Framer Motion** | Page transitions and micro-animations |
| **Recharts** | Radar chart for skill visualisation |
| **Firebase SDK** | Google sign-in and ID token management |
| **Axios** | HTTP client with request interceptor for auto token injection |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **Mongoose** | MongoDB ODM with schema validation |
| **Google Gemini 2.5 Flash** | AI analysis and conversational career coach |
| **Firebase Admin SDK** | Server-side JWT verification for every protected route |
| **pdf-parse + mammoth** | PDF and DOCX text extraction |
| **Cheerio + Axios** | Web scraping job descriptions from URLs |
| **Multer** | In-memory file upload handling (no disk writes) |

### Infrastructure
| Service | Role |
|---|---|
| **Vercel** | Frontend hosting (CDN, edge deployment) |
| **Vercel Serverless** | Backend API hosting |
| **MongoDB Atlas** | Cloud database (free tier M0) |
| **Firebase** | Authentication provider |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Browser (React + Vite)              │
│                                                      │
│  AuthContext ──► Firebase Google Sign-in             │
│  Axios Interceptor ──► Auto-attach Bearer token      │
│  Pages: Home / Login / Analyze / Results / History   │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS + Bearer token
                     ▼
┌─────────────────────────────────────────────────────┐
│           Express API (Vercel Serverless)            │
│                                                      │
│  requireAuth ──► Firebase Admin verifyIdToken        │
│  /api/analyze  ──► Extract text → Gemini → MongoDB  │
│  /api/chat     ──► Fetch history → Gemini → MongoDB  │
│  /api/scrape   ──► Cheerio URL scraper               │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
           ▼                       ▼
┌──────────────────┐    ┌─────────────────────┐
│   MongoDB Atlas  │    │  Google Gemini 2.5   │
│                  │    │                      │
│  analyses        │    │  analyzeResumeVsJob  │
│  chatmessages    │    │  chatAboutAnalysis   │
└──────────────────┘    └─────────────────────┘
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free)
- A [Firebase project](https://console.firebase.google.com) with Google sign-in enabled
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free cluster

### 1. Clone & install

```bash
git clone https://github.com/soumadipmajumder1509/hirefit-ai.git
cd hirefit-ai

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure environment variables

```bash
# Server
cp server/.env.example server/.env

# Client
cp client/.env.example client/.env
```

Fill in `server/.env`:

```env
PORT=3001
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/hirefit?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173

# From Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

Fill in `client/.env`:

```env
VITE_FIREBASE_API_KEY=your_web_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run

```bash
# Terminal 1 — backend (http://localhost:3001)
cd server && npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd client && npm run dev
```

---

## API Reference

All routes except `/api/health` and `/api/scrape` require a Firebase ID token in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/analyze` | Upload resume + job description, returns AI analysis |
| `GET` | `/api/analyze` | List all analyses for the authenticated user |
| `GET` | `/api/analyze/:id` | Fetch a single analysis by ID |
| `GET` | `/api/chat/:analysisId` | Fetch chat history for an analysis |
| `POST` | `/api/chat/:analysisId` | Send a message to the AI career coach |
| `POST` | `/api/scrape` | Scrape job description from a URL |

### Example: Analyze a resume

```bash
curl -X POST https://hirefit-ai-soumadipmajumder1509s-projects.vercel.app/api/analyze \
  -H "Authorization: Bearer <firebase_id_token>" \
  -F "resume=@resume.pdf" \
  -F "jobText=We are looking for a senior React developer..."
```

### Example response

```json
{
  "id": "683c4f2a9e1234abcd567890",
  "score": 78,
  "analysis": {
    "overall_score": 78,
    "recommendation": "Strong Match",
    "summary": "Your profile aligns well with this role...",
    "skill_analysis": {
      "matched_skills": ["React", "Node.js", "TypeScript"],
      "missing_skills": ["GraphQL", "AWS"],
      "bonus_skills": ["Docker"]
    },
    "section_scores": {
      "experience": 82,
      "education": 90,
      "skills": 70,
      "overall_presentation": 75
    },
    "suggestions": [
      {
        "priority": "high",
        "section": "Skills",
        "suggestion": "Add GraphQL and AWS to your skills section..."
      }
    ]
  },
  "createdAt": "2026-05-24T21:47:00.000Z"
}
```

---

## Project Structure

```
hirefit-ai/
├── client/                     # React frontend
│   ├── src/
│   │   ├── api/index.js        # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── AuthGuard.jsx   # Protects authenticated routes
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── JobInput.jsx    # Text / file / URL input modes
│   │   │   └── ScoreCircle.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Firebase auth state provider
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AnalyzePage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── HistoryPage.jsx
│   │   ├── firebase.js         # Guarded Firebase init
│   │   └── index.css           # Design system (glassmorphism, gradients)
│   └── vite.config.js
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── auth.js         # Firebase Admin token verification
│   │   │   └── upload.js       # Multer memory storage
│   │   ├── models/
│   │   │   ├── Analysis.js     # Mongoose schema
│   │   │   └── ChatMessage.js  # Mongoose schema
│   │   ├── routes/
│   │   │   ├── analyze.js
│   │   │   ├── chat.js
│   │   │   └── scrape.js
│   │   ├── services/
│   │   │   ├── geminiService.js    # Gemini 2.5 Flash prompts
│   │   │   ├── textExtractor.js   # PDF + DOCX parsing
│   │   │   └── scraperService.js  # Cheerio job URL scraper
│   │   ├── db.js               # Mongoose lazy connection
│   │   └── index.js            # Express app entry point
│   └── vercel.json             # Vercel serverless config
│
├── .gitignore
├── railway.json
└── README.md
```

---

## Key Design Decisions

**Lazy MongoDB connection** — `db.connect()` is called inside each route handler rather than at startup. This prevents cold-start crashes in serverless environments and handles reconnection automatically.

**Firebase lazy init** — Firebase Admin SDK is initialised on the first authenticated request, not at module load. This lets the server start cleanly even if env vars are misconfigured and returns a clear error message instead of crashing.

**In-memory file handling** — Multer uses `memoryStorage()` so uploaded resumes are never written to disk. This is required for serverless deployments and also avoids any file cleanup logic.

**Per-user data isolation** — Every database query filters by `userId` (the Firebase UID), making it impossible for one user to access another's analyses or chat history.

**URL scraping with fallbacks** — The scraper uses site-specific CSS selectors for Greenhouse, Lever, Workday, Indeed, and Glassdoor before falling back to generic `<main>` / `<article>` / `<body>` extraction.

---

## Deployment

| Service | Platform | Config |
|---|---|---|
| Frontend | Vercel | Root dir: `client`, framework: Vite |
| Backend API | Vercel Serverless | Root dir: `server`, config: `server/vercel.json` |
| Database | MongoDB Atlas M0 | Free tier, network access: `0.0.0.0/0` |
| Auth | Firebase | Google sign-in, authorized domain: `hirefitai.vercel.app` |

---

## License

MIT — feel free to use, modify, and build on top of this project.

---

<div align="center">
  Built with React, Node.js, MongoDB Atlas, Google Gemini AI, and Firebase
  <br/>
  <a href="https://hirefitai.vercel.app">hirefitai.vercel.app</a>
</div>
