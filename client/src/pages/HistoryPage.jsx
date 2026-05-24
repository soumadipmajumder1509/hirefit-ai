import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, FileText, ArrowRight, Loader2, AlertCircle, Plus, Target } from 'lucide-react';
import { listAnalyses } from '../api';

const REC_STYLE = {
  strong_match:  { label: 'Strong Match',  className: 'badge-success' },
  good_match:    { label: 'Good Match',    className: 'badge-info' },
  partial_match: { label: 'Partial Match', className: 'badge-warning' },
  poor_match:    { label: 'Poor Match',    className: 'badge-danger' },
};

const scoreColor = s =>
  s >= 80 ? '#34d399' : s >= 60 ? '#60a5fa' : s >= 40 ? '#fbbf24' : '#f87171';

export default function HistoryPage() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    listAnalyses()
      .then(setItems)
      .catch(err => setError(err.response?.data?.error || 'Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#7c3aed' }} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5">
            <Clock className="w-6 h-6" style={{ color: '#a78bfa' }} />
            Analysis History
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Your past resume analyses</p>
        </div>
        <Link to="/analyze" className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> New Analysis
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* Empty state */}
      {!error && items.length === 0 && (
        <div className="text-center py-24 space-y-5">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Target className="w-8 h-8" style={{ color: '#334155' }} />
          </div>
          <div>
            <p className="font-semibold text-slate-300">No analyses yet</p>
            <p className="text-sm mt-1" style={{ color: '#475569' }}>Upload your first resume to get started.</p>
          </div>
          <Link to="/analyze" className="btn-primary inline-flex gap-2">
            Start Your First Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map((item, i) => {
          const rec = REC_STYLE[item.recommendation] || {};
          const color = scoreColor(item.score);
          return (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22,1,0.36,1] }}>
              <Link to={`/results/${item.id}`}
                className="card-hover p-5 flex items-center gap-4 group block">

                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <FileText className="w-5 h-5" style={{ color: '#475569' }} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold text-slate-200 truncate">
                    {item.resume_filename || 'Unnamed Resume'}
                  </p>
                  {item.summary && (
                    <p className="text-xs line-clamp-1 leading-relaxed" style={{ color: '#475569' }}>
                      {item.summary}
                    </p>
                  )}
                  <p className="text-xs" style={{ color: '#334155' }}>
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {rec.label && <span className={rec.className}>{rec.label}</span>}
                  <span className="text-2xl font-bold tabular-nums" style={{ color }}>{item.score}</span>
                  <ArrowRight className="w-4 h-4 transition-colors" style={{ color: '#334155' }} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
