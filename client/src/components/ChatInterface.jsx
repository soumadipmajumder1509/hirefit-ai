import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getChatHistory, sendChatMessage } from '../api';

const STARTERS = [
  'How can I improve my chances for this role?',
  'Which missing skills should I prioritise first?',
  'How should I reword my experience section?',
  'What projects would strengthen my profile?',
];

export default function ChatInterface({ analysisId, analysis }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [sending, setSending]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const endRef   = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!analysisId) return;
    setLoading(true);
    getChatHistory(analysisId)
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [analysisId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(text) {
    const msg = (text || input).trim();
    if (!msg || sending) return;
    setInput('');
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    setMessages(prev => [...prev, { id: tempId, role: 'user', content: msg }]);

    try {
      const response = await sendChatMessage(analysisId, msg);
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        { id: tempId, role: 'user', content: msg },
        response,
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        { id: tempId, role: 'user', content: msg },
        { id: `err-${Date.now()}`, role: 'assistant', content: `Sorry, something went wrong. ${err.response?.data?.error || 'Please try again.'}` },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#7c3aed' }} />
    </div>
  );

  return (
    <div className="flex flex-col h-[560px]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">

        {/* Welcome state */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 30px rgba(124,58,237,0.35)' }}>
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">HireFit AI Career Coach</p>
              <p className="text-sm mt-1 max-w-sm" style={{ color: '#475569' }}>
                Ask me anything about your results — I'll give specific, actionable advice.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTERS.map(s => (
                <button key={s} onClick={() => handleSend(s)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl transition-all duration-150"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; e.currentTarget.style.color = '#94a3b8'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#64748b'; }}>
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? '' : ''
              }`}
                style={msg.role === 'user'
                  ? { background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {msg.role === 'user'
                  ? <User className="w-4 h-4 text-white" />
                  : <Bot className="w-4 h-4" style={{ color: '#a78bfa' }} />}
              </div>

              {/* Bubble */}
              <div className={`relative max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' ? 'rounded-br-sm chat-bubble-user' : 'rounded-bl-sm chat-bubble-ai'
              }`}
                style={msg.role === 'user'
                  ? { background: 'rgba(109,40,217,0.7)', color: '#ede9fe', border: '1px solid rgba(139,92,246,0.3)' }
                  : { background: 'rgba(10,15,44,0.9)', color: '#cbd5e1', border: '1px solid rgba(99,102,241,0.15)' }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {sending && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Bot className="w-4 h-4" style={{ color: '#a78bfa' }} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm"
              style={{ background: 'rgba(10,15,44,0.9)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div className="flex gap-1.5 items-center h-4">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#475569', animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t pt-4" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
        <div className="flex gap-2">
          <input ref={inputRef} type="text" value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about your analysis…"
            className="input flex-1" disabled={sending} />
          <button onClick={() => handleSend()} disabled={!input.trim() || sending}
            className="btn-primary px-4 py-3 aspect-square flex items-center justify-center">
            {sending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
