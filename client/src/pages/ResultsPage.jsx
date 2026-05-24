import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Loader2, AlertCircle, CheckCircle, XCircle,
  TrendingUp, Star, Lightbulb, MessageSquare, Award,
  ChevronDown, ChevronUp, FileText, Target,
} from 'lucide-react';
import { getAnalysis } from '../api';
import ScoreCircle from '../components/ScoreCircle';
import ChatInterface from '../components/ChatInterface';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const TABS = [
  { id: 'overview',     label: 'Overview',    icon: Award },
  { id: 'skills',       label: 'Skills',      icon: Star },
  { id: 'suggestions',  label: 'Suggestions', icon: Lightbulb },
  { id: 'chat',         label: 'AI Coach',    icon: MessageSquare },
];

function PriorityBadge({ priority }) {
  return priority === 'high'
    ? <span className="badge-danger">High priority</span>
    : priority === 'medium'
    ? <span className="badge-warning">Medium</span>
    : <span className="badge-info">Low</span>;
}

function Collapsible({ title, badge, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors duration-150 hover:bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-200">{title}</span>
          {badge}
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden">
            <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(99,102,241,0.1)' }}>
              <div className="pt-4">{children}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams();
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [tab, setTab]         = useState('overview');

  useEffect(() => {
    getAnalysis(id)
      .then(setData)
      .catch(err => setError(err.response?.data?.error || 'Failed to load results.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse-glow"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
        <Target className="w-7 h-7 text-white" />
      </div>
      <p className="text-sm" style={{ color: '#64748b' }}>Loading your analysis…</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
      <AlertCircle className="w-12 h-12 mx-auto" style={{ color: '#f87171' }} />
      <p className="text-lg font-semibold">{error}</p>
      <Link to="/analyze" className="btn-primary inline-flex gap-2">
        <ArrowLeft className="w-4 h-4" /> Try Again
      </Link>
    </div>
  );

  const { analysis, score, resumeFilename, jobSource, createdAt } = data;
  const {
    match_breakdown = {},
    matched_skills = [], missing_skills = [], additional_skills = [],
    strengths = [], improvement_areas = [], resume_improvements = [],
    keywords = {}, summary, recommendation, recommendation_reason,
  } = analysis || {};

  const radarData = [
    { subject: 'Skills',     value: match_breakdown.skills_match     || 0 },
    { subject: 'Experience', value: match_breakdown.experience_match || 0 },
    { subject: 'Education',  value: match_breakdown.education_match  || 0 },
    { subject: 'Keywords',   value: match_breakdown.keywords_match   || 0 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">

      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm" style={{ color: '#475569' }}>
        <Link to="/analyze" className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
          <ArrowLeft className="w-4 h-4" /> New Analysis
        </Link>
        <span>·</span>
        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{resumeFilename}</span>
        {createdAt && <><span>·</span><span>{new Date(createdAt).toLocaleString()}</span></>}
      </div>

      {/* ── Score hero card ── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card-gradient-border p-8"
        style={{ boxShadow: '0 0 60px rgba(109,40,217,0.1)' }}>
        <div className="flex flex-col lg:flex-row items-center gap-10">

          <ScoreCircle score={score || 0} recommendation={recommendation} />

          <div className="flex-1 space-y-3 text-center lg:text-left">
            <h1 className="text-2xl font-bold text-slate-100">Your Match Report</h1>
            {jobSource && <p className="text-sm truncate max-w-sm" style={{ color: '#475569' }}>{jobSource}</p>}
            <p className="leading-relaxed max-w-lg" style={{ color: '#94a3b8' }}>{summary}</p>
            {recommendation_reason && (
              <p className="text-sm italic" style={{ color: '#475569' }}>"{recommendation_reason}"</p>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
              { label: 'Matched',     value: matched_skills.length,   color: '#34d399', bg: 'rgba(16,185,129,' },
              { label: 'Missing',     value: missing_skills.length,   color: '#f87171', bg: 'rgba(239,68,68,' },
              { label: 'Strengths',   value: strengths.length,        color: '#60a5fa', bg: 'rgba(59,130,246,' },
              { label: 'Suggestions', value: improvement_areas.length,color: '#fbbf24', bg: 'rgba(245,158,11,' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: `${bg}0.08)`, border: `1px solid ${bg}0.15)` }}>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Tab bar ── */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: 'rgba(10,15,44,0.8)', border: '1px solid rgba(99,102,241,0.12)' }}>
        {TABS.map(({ id: tid, label, icon: Icon }) => (
          <button key={tid} onClick={() => setTab(tid)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              tab === tid ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            style={tab === tid ? {
              background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              boxShadow: '0 0 20px rgba(124,58,237,0.3)',
            } : {}}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Radar */}
              <div className="card p-6">
                <h3 className="font-semibold text-slate-200 mb-5">Score Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(99,102,241,0.15)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Radar name="Match" dataKey="value" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: '#0a0f2c', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', color: '#e2e8f0' }}
                      formatter={v => [`${v}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Strengths */}
              <div className="card p-6 space-y-4">
                <h3 className="font-semibold text-slate-200">Your Strengths</h3>
                <ul className="space-y-3">
                  {strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <CheckCircle className="w-3 h-3" style={{ color: '#34d399' }} />
                      </div>
                      <span className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Score bars */}
              <div className="lg:col-span-2 card p-6 space-y-5">
                <h3 className="font-semibold text-slate-200">Detailed Scores</h3>
                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                  {Object.entries(match_breakdown).map(([key, val]) => {
                    const color = val >= 80 ? '#34d399' : val >= 60 ? '#60a5fa' : val >= 40 ? '#fbbf24' : '#f87171';
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-2">
                          <span style={{ color: '#64748b' }} className="capitalize">{key.replace(/_/g,' ')}</span>
                          <span className="font-bold" style={{ color }}>{val}%</span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${val}%` }}
                            transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
                            className="h-full rounded-full" style={{ background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SKILLS */}
          {tab === 'skills' && (
            <div className="space-y-5">
              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: '#34d399' }} />
                  <h3 className="font-semibold text-slate-200">Matched Skills</h3>
                  <span className="badge-success ml-auto">{matched_skills.length} found</span>
                </div>
                {matched_skills.length === 0
                  ? <p className="text-sm" style={{ color: '#475569' }}>None detected.</p>
                  : <div className="flex flex-wrap gap-2">{matched_skills.map(s => <span key={s} className="badge-success">{s}</span>)}</div>
                }
              </div>

              <div className="card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5" style={{ color: '#f87171' }} />
                  <h3 className="font-semibold text-slate-200">Missing Skills</h3>
                  <span className="badge-danger ml-auto">{missing_skills.length} gaps</span>
                </div>
                {missing_skills.length === 0
                  ? <p className="text-sm font-medium" style={{ color: '#34d399' }}>All required skills present!</p>
                  : <div className="flex flex-wrap gap-2">{missing_skills.map(s => <span key={s} className="badge-danger">{s}</span>)}</div>
                }
              </div>

              {additional_skills.length > 0 && (
                <div className="card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" style={{ color: '#38bdf8' }} />
                    <h3 className="font-semibold text-slate-200">Bonus Skills</h3>
                    <span className="badge-info ml-auto">not in JD</span>
                  </div>
                  <div className="flex flex-wrap gap-2">{additional_skills.map(s => <span key={s} className="badge-info">{s}</span>)}</div>
                </div>
              )}

              {(keywords.found?.length > 0 || keywords.missing?.length > 0) && (
                <div className="grid sm:grid-cols-2 gap-5">
                  {keywords.found?.length > 0 && (
                    <div className="card p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300">ATS Keywords Found</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.found.map(k => (
                          <span key={k} className="text-xs px-2 py-0.5 rounded-md"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {keywords.missing?.length > 0 && (
                    <div className="card p-5 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-300">ATS Keywords Missing</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.missing.map(k => (
                          <span key={k} className="text-xs px-2 py-0.5 rounded-md"
                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SUGGESTIONS */}
          {tab === 'suggestions' && (
            <div className="space-y-5">
              {improvement_areas.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4" style={{ color: '#fbbf24' }} /> Skill Gaps to Address
                  </h3>
                  {[...improvement_areas]
                    .sort((a,b) => ['high','medium','low'].indexOf(a.priority) - ['high','medium','low'].indexOf(b.priority))
                    .map((item, i) => (
                      <Collapsible key={i} title={item.area} badge={<PriorityBadge priority={item.priority} />} defaultOpen={i === 0}>
                        <div className="space-y-3">
                          <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{item.description}</p>
                          <div className="p-3 rounded-xl"
                            style={{ background: 'rgba(109,40,217,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                            <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#a78bfa' }}>Suggestion</p>
                            <p className="text-sm leading-relaxed" style={{ color: '#c4b5fd' }}>{item.suggestion}</p>
                          </div>
                        </div>
                      </Collapsible>
                    ))}
                </div>
              )}

              {resume_improvements.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-slate-200 flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4" style={{ color: '#60a5fa' }} /> Resume Section Improvements
                  </h3>
                  {resume_improvements.map((item, i) => (
                    <div key={i} className="card p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-200 capitalize">{item.section}</span>
                        <span className="badge-warning">Needs work</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{item.issue}</p>
                      <div className="p-3 rounded-xl"
                        style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)' }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#38bdf8' }}>How to fix</p>
                        <p className="text-sm leading-relaxed" style={{ color: '#7dd3fc' }}>{item.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {improvement_areas.length === 0 && resume_improvements.length === 0 && (
                <div className="text-center py-20 space-y-3">
                  <CheckCircle className="w-12 h-12 mx-auto" style={{ color: '#34d399' }} />
                  <p className="font-semibold text-slate-200">No major gaps — great profile!</p>
                </div>
              )}
            </div>
          )}

          {/* CHAT */}
          {tab === 'chat' && (
            <div className="card p-6">
              <ChatInterface analysisId={id} analysis={analysis} />
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
