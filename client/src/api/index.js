import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function analyzeResume(formData) {
  const { data } = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getAnalysis(id) {
  const { data } = await api.get(`/analyze/${id}`);
  return data;
}

export async function listAnalyses() {
  const { data } = await api.get('/analyze');
  return data;
}

export async function scrapeJob(url) {
  const { data } = await api.post('/scrape', { url });
  return data;
}

export async function getChatHistory(analysisId) {
  const { data } = await api.get(`/chat/${analysisId}`);
  return data;
}

export async function sendChatMessage(analysisId, message) {
  const { data } = await api.post(`/chat/${analysisId}`, { message });
  return data;
}
