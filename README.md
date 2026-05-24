# ResuMatch — AI Resume Analyser & Job Match Platform

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **AI**: Google Gemini 1.5 Flash (free tier)

## Setup

### 1. PostgreSQL
```bash
psql -U postgres -c "CREATE DATABASE resume_analyzer;"
psql -U postgres -d resume_analyzer -f server/database.sql
```

### 2. Server environment
```bash
cp server/.env.example server/.env
# Edit server/.env and fill in:
#   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/resume_analyzer
#   GEMINI_API_KEY=your_key_from_https://aistudio.google.com/app/apikey
```

### 3. Install & run
```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install

# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

App runs at **http://localhost:5173**

## Features
- Upload resume (PDF, DOCX, TXT)
- Add job description via text, file upload, or URL scraping
- AI-powered match score (0–100) with breakdown
- Skill gap analysis — matched, missing, and bonus skills
- Prioritised improvement suggestions per resume section
- Interactive AI career coach chat (stored per analysis)
- Analysis history page
