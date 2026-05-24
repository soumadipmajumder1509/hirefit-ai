import { useState } from 'react';
import { FileText, Link2, AlignLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FileUpload from './FileUpload';
import { scrapeJob } from '../api';

const TABS = [
  { id: 'text', icon: AlignLeft, label: 'Paste Text' },
  { id: 'url',  icon: Link2,     label: 'Job URL' },
  { id: 'file', icon: FileText,  label: 'Upload File' },
];

export default function JobInput({ value, onChange, onFile, jobFile }) {
  const [tab, setTab]               = useState('text');
  const [url, setUrl]               = useState('');
  const [scraping, setScraping]     = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState(null);

  async function handleScrape() {
    if (!url.trim()) return;
    setScraping(true);
    setScrapeStatus(null);
    try {
      const result = await scrapeJob(url.trim());
      onChange(result.text);
      setScrapeStatus({ type: 'success', msg: 'Job description extracted successfully!' });
    } catch (err) {
      setScrapeStatus({ type: 'error', msg: err.response?.data?.error || 'Failed to scrape. Try pasting manually.' });
    } finally {
      setScraping(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {TABS.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
            style={tab === id
              ? { background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }
              : { color: '#64748b' }}
            onMouseEnter={e => { if (tab !== id) e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={e => { if (tab !== id) e.currentTarget.style.color = '#64748b'; }}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'text' && (
          <motion.div key="text" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <textarea value={value} onChange={e => onChange(e.target.value)}
              placeholder="Paste the full job description here…"
              rows={10} className="input resize-none font-mono text-sm leading-relaxed" />
            <p className="text-xs mt-1.5" style={{ color: '#334155' }}>{value.length} characters</p>
          </motion.div>
        )}

        {tab === 'url' && (
          <motion.div key="url" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="space-y-3">
            <div className="flex gap-2">
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://company.com/jobs/software-engineer"
                className="input flex-1"
                onKeyDown={e => e.key === 'Enter' && handleScrape()} />
              <button onClick={handleScrape} disabled={scraping || !url.trim()} className="btn-primary gap-2 whitespace-nowrap">
                {scraping
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Scraping…</>
                  : <><Link2 className="w-4 h-4" /> Scrape</>}
              </button>
            </div>

            <AnimatePresence>
              {scrapeStatus && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 p-3 rounded-xl text-sm"
                  style={scrapeStatus.type === 'success'
                    ? { background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }
                    : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  {scrapeStatus.type === 'success'
                    ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                  {scrapeStatus.msg}
                </motion.div>
              )}
            </AnimatePresence>

            {value && (
              <div className="card p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#475569' }}>Extracted Preview</p>
                <p className="text-sm line-clamp-4 leading-relaxed" style={{ color: '#94a3b8' }}>{value}</p>
                <p className="text-xs" style={{ color: '#334155' }}>{value.length} characters</p>
              </div>
            )}

            <p className="text-xs" style={{ color: '#334155' }}>
              Works with Greenhouse, Lever, Workday, Indeed, and most career pages. LinkedIn requires manual copy-paste.
            </p>
          </motion.div>
        )}

        {tab === 'file' && (
          <motion.div key="file" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <FileUpload file={jobFile} onFile={onFile} label="Upload job description" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
