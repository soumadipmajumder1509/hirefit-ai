import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Target, Zap, Brain, BarChart3,
  MessageSquare, Link2, Shield, CheckCircle,
  Sparkles, FileCheck, TrendingUp,
} from 'lucide-react';

/* ── animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const FEATURES = [
  { icon: Brain,        color: '#a78bfa', label: 'AI Gap Analysis',     desc: 'Gemini 2.5 identifies every missing skill, keyword, and experience gap instantly.' },
  { icon: BarChart3,    color: '#38bdf8', label: 'Match Score 0–100',   desc: 'Precise scoring across skills, experience, education, and ATS keywords.' },
  { icon: Zap,          color: '#fb923c', label: 'URL Job Scraping',    desc: 'Paste a job URL — we automatically extract the description for you.' },
  { icon: MessageSquare,color: '#34d399', label: 'AI Career Coach',     desc: 'Chat with a personal AI coach trained on your specific analysis.' },
  { icon: Shield,       color: '#f472b6', label: 'ATS Optimisation',    desc: 'Know exactly which keywords to add to pass the automated screening.' },
  { icon: TrendingUp,   color: '#818cf8', label: 'Improvement Roadmap', desc: 'Prioritised suggestions with examples for every section of your resume.' },
];

const STEPS = [
  { n: '01', title: 'Upload Resume',       desc: 'Drop your PDF or DOCX — text extracted in seconds.' },
  { n: '02', title: 'Add Job Description', desc: 'Paste text, upload a file, or share the job URL.' },
  { n: '03', title: 'Get AI Analysis',     desc: 'Instant score, skill map, and improvement plan.' },
  { n: '04', title: 'Chat & Improve',      desc: 'Ask follow-up questions and nail the application.' },
];

const STATS = [
  { value: '98%',   label: 'Accuracy rate' },
  { value: '<5s',   label: 'Analysis time' },
  { value: '50+',   label: 'Skills detected' },
  { value: '100%',  label: 'Free to use' },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-28 dot-grid hero-glow">

        {/* Floating orb accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">

          {/* Pill badge */}
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#a78bfa' }}>
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini 2.5 AI
          </motion.div>

          {/* Headline */}
          <motion.h1 {...fadeUp(0.08)} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06]">
            Get the Right Fit,<br />
            <span className="gradient-text">Every Time.</span>
          </motion.h1>

          {/* Sub */}
          <motion.p {...fadeUp(0.15)} className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: '#94a3b8' }}>
            Upload your resume + any job description. HireFit AI scores your match,
            pinpoints every gap, and coaches you to the offer — in under 5 seconds.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.22)} className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/analyze" className="btn-primary text-base px-8 py-4 gap-2">
              Analyse My Resume Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/history" className="btn-secondary text-base px-8 py-4">
              View Past Results
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div {...fadeUp(0.3)} className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="stat-pill">
                <span className="font-bold text-white">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Floating score card preview ── */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mt-16 w-full max-w-xl mx-auto"
        >
          <div className="card-gradient-border p-5 shadow-2xl"
            style={{ boxShadow: '0 0 60px rgba(109,40,217,0.2), 0 20px 60px rgba(0,0,0,0.5)' }}>

            {/* Card header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                <FileCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-200 text-sm">Senior Frontend Engineer — Stripe</p>
                <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Analysed just now</p>
              </div>
              <div className="px-3 py-1.5 rounded-full text-sm font-bold"
                style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                87 / 100
              </div>
            </div>

            {/* Score bars */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[['Skills','#a78bfa',92],['Experience','#38bdf8',80],['Education','#34d399',95],['Keywords','#fb923c',78]].map(([l,c,v]) => (
                <div key={l} className="text-center space-y-2">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${v}%` }}
                      transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: c }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: '#64748b' }}>{l}</p>
                  <p className="text-xs font-bold" style={{ color: c }}>{v}%</p>
                </div>
              ))}
            </div>

            {/* Skill badges */}
            <div className="flex flex-wrap gap-1.5">
              {['React','TypeScript','Node.js','GraphQL'].map(s => (
                <span key={s} className="badge-success">{s}</span>
              ))}
              {['AWS','Kubernetes'].map(s => (
                <span key={s} className="badge-danger">{s}</span>
              ))}
              <span className="badge-warning">Docker (partial)</span>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-20 rounded-b-2xl pointer-events-none"
            style={{ background: 'linear-gradient(to top, #04071a, transparent)' }} />
        </motion.div>
      </section>

      {/* ══════════════════════════════════ HOW IT WORKS ══════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div {...fadeUp()} className="text-center space-y-3">
            <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#7c3aed' }}>How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Four steps to a better application.</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map(({ n, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.08)}
                className="relative card-gradient-border p-6 group overflow-hidden"
              >
                {/* Step number watermark */}
                <div className="absolute -top-2 -right-1 text-7xl font-black select-none pointer-events-none transition-colors duration-300"
                  style={{ color: 'rgba(99,102,241,0.06)' }}>
                  {n}
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4 text-xs font-bold"
                  style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.25)' }}>
                  {n}
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ══════════════════════════════════ FEATURES ══════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <motion.div {...fadeUp()} className="text-center space-y-3">
            <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: '#38bdf8' }}>Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Everything to land that role.</h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: '#64748b' }}>
              A complete AI toolkit built for serious job seekers.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, color, label, desc }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.07)} className="card-hover p-6 space-y-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-200 mb-1.5">{label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider max-w-4xl mx-auto" />

      {/* ══════════════════════════════════ CTA ══════════════════════════════════ */}
      <section className="py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="relative card-gradient-border p-12 text-center space-y-7 overflow-hidden">
            {/* BG glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(109,40,217,0.15), transparent)' }} />

            <div className="relative">
              <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-6"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get hired?</h2>
              <p className="text-lg mb-8" style={{ color: '#94a3b8' }}>
                Free, instant, and brutally honest. Upload your resume and see exactly where you stand.
              </p>
              <Link to="/analyze" className="btn-primary text-base px-10 py-4 gap-2 animate-pulse-glow">
                Analyse My Resume <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
