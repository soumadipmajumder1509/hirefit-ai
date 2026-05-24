const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI;
let model;

function getModel() {
  if (!model) {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
}

async function analyzeResumeVsJob(resumeText, jobDescription) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const prompt = `You are an expert ATS system and career coach. Today's date is ${today}. Use this date when evaluating whether experience dates are past, current, or future. Analyze this resume against the job description and return ONLY a valid JSON object — no markdown, no code blocks, just raw JSON.

RESUME:
${resumeText.slice(0, 6000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}

Return this exact JSON structure:
{
  "overall_score": <integer 0-100>,
  "match_breakdown": {
    "skills_match": <integer 0-100>,
    "experience_match": <integer 0-100>,
    "education_match": <integer 0-100>,
    "keywords_match": <integer 0-100>
  },
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill1", "skill2"],
  "additional_skills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvement_areas": [
    {
      "area": "area name",
      "description": "what is missing or needs improvement",
      "suggestion": "specific actionable suggestion",
      "priority": "high"
    }
  ],
  "resume_improvements": [
    {
      "section": "section name",
      "issue": "what is wrong or missing",
      "suggestion": "how to improve it"
    }
  ],
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["keyword1", "keyword2"]
  },
  "summary": "2-3 sentence executive summary of the match",
  "recommendation": "strong_match",
  "recommendation_reason": "explanation"
}

Valid recommendation values: strong_match, good_match, partial_match, poor_match`;

  const m = getModel();
  const result = await m.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code fences if the model adds them despite instructions
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned invalid JSON. Please try again.');
  }
}

async function chatAboutAnalysis(analysis, chatHistory, userMessage) {
  const { score, matched_skills, missing_skills, summary, recommendation } = analysis;

  const systemContext = `You are a friendly and expert career coach. You have just analyzed a resume against a job description.

Analysis results:
- Overall Score: ${score}/100
- Recommendation: ${recommendation?.replace(/_/g, ' ')}
- Matched Skills: ${matched_skills?.join(', ') || 'none'}
- Missing Skills: ${missing_skills?.join(', ') || 'none'}
- Summary: ${summary}

Help the candidate understand their results and improve their application. Be specific, actionable, and encouraging. Keep responses concise (2-4 paragraphs max).`;

  // Build conversation parts for Gemini
  const conversationParts = chatHistory.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const m = getModel();
  const chat = m.startChat({
    history: [
      { role: 'user', parts: [{ text: systemContext }] },
      {
        role: 'model',
        parts: [
          {
            text: `I've reviewed your resume analysis. Your overall score is ${score}/100. I'm here to help you understand the results and improve your application. What would you like to know?`,
          },
        ],
      },
      ...conversationParts,
    ],
  });

  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

module.exports = { analyzeResumeVsJob, chatAboutAnalysis };
