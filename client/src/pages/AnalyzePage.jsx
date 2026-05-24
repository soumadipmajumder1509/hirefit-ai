import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronLeft, Loader2, Sparkles,
  FileText, BriefcaseBusiness, CheckCircle,
} from 'lucide-react';
import FileUpload from '../components/FileUpload';
import JobInput from '../components/JobInput';
import { analyzeResume } from '../api';

const STEPS = [
  { id: 1, title: 'Resume',          subtitle: 'Upload your CV',      icon: FileText },
  { id: 2, title: 'Job Description', subtitle: 'What role?',          icon: BriefcaseBusiness },
  { id: 3, title: 'Analyse',         subtitle: 'Run AI matching',     icon: Sparkles },
];

const LOADING_MESSAGES = [
  'Extracting resume content…',
  'Mapping keywords to job description…',
  'Scoring skills & experience…',
  'Generating improvement plan…',
  'Finalising your report…',
];

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resumeFile, setResumeFile] = useState(null);
  const [jobText, setJobText]       = useState('');
  const [jobFile, setJobFile]       = useState(null);
  const [jobSource, setJobSource]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [error, setError]           = useState(null);

  const canStep2 = !!resumeFile;
  const canStep3 = !!(jobText.trim().length > 30 || jobFile);

  async function handleAnalyse() {
    setLoading(true);
    setError(null);

    // Cycle loading messages
    const interval = setInterval(
      () => setLoadingMsg(p => (p + 1) % LOADING_MESSAGES.length),
      1800
    );

    try {
      const fd = new FormData();
      fd.append('resume', resumeFile);
      if (jobFile && !jobText.trim()) fd.append('jobFile', jobFile);
      if (jobText.trim()) fd.append('jobText', jobText.trim());
      if (jobSource) fd.append('jobSource', jobSource);

      const result = await analyzeResume(fd);
      clearInterval(interval);
      navigate(`/results/${result.id}`);
    } catch (err) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'Analysis failed. Please check your files and try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col dot-grid"
      style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(109,40,217,0.12), transparent)' }}>

      <div className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col gap-10">

        {/* ── Step indicator ── */}
        <div className="flex items-center justify-center">
          {STEPS.map(({ id, title, icon: Icon }, i) => (
            <div key={id} className="flex items-center">
              {/* Step bubble */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  step > id
                    ? 'bg-emerald-500/20 border border-emerald-500/30'
                    : step === id
                    ? ''
                    : 'border'
                }`}
                  style={step === id ? {
                    background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                  } : step < id ? {
                    background: 'rgba(255,255,255,0.04)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  } : {}}
                >
                  {step > id
                    ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                    : <Icon className={`w-4 h-4 ${step === id ? 'text-white' : 'text-slate-600'}`} />
                  }
                </div>
                <span className={`text-xs font-medium transition-colors ${step === id ? 'text-violet-300' : 'text-slate-600'}`}>
                  {title}
                </span>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="w-16 h-px mx-2 mb-5 transition-all duration-500"
                  style={{ background: step > id + 1 ? '#10b981' : step > id ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.06)' }} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step panels ── */}
        <AnimatePresence mode="wait">

          {/* Step 1 — Resume */}
          {step === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Upload your resume</h1>
                <p className="text-sm mt-1.5" style={{ color: '#64748b' }}>
                  We extract text automatically — PDF, DOCX, or plain TXT.
                </p>
              </div>
              <FileUpload file={resumeFile} onFile={setResumeFile} label="Drop your resume here" />
              {resumeFile && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="card p-4 space-y-2" style={{ borderColor: 'rgba(139,92,246,0.2)', background: 'rgba(109,40,217,0.06)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Tips</p>
                  <ul className="text-xs space-y-1 list-disc list-inside leading-relaxed" style={{ color: '#94a3b8' }}>
                    <li>Use a text-based PDF, not a scanned image</li>
                    <li>Ensure Experience, Skills, and Education sections exist</li>
                    <li>Remove password protection before uploading</li>
                  </ul>
                </motion.div>
              )}
              <div className="flex justify-end pt-2">
                <button onClick={() => setStep(2)} disabled={!canStep2} className="btn-primary gap-2">
                  Next: Job Description <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Job */}
          {step === 2 && (
            <motion.div key="s2"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Add the job description</h1>
                <p className="text-sm mt-1.5" style={{ color: '#64748b' }}>
                  Paste text, upload a file, or share the job URL and we'll scrape it.
                </p>
              </div>
              <JobInput
                value={jobText}
                onChange={setJobText}
                onFile={(f) => { setJobFile(f); if (f) setJobText(''); }}
                jobFile={jobFile}
              />
              <div className="flex justify-between pt-2">
                <button onClick={() => setStep(1)} className="btn-secondary gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={() => setStep(3)} disabled={!canStep3} className="btn-primary gap-2">
                  Review & Analyse <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — Confirm & run */}
          {step === 3 && (
            <motion.div key="s3"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-bold text-slate-100">Ready to analyse</h1>
                <p className="text-sm mt-1.5" style={{ color: '#64748b' }}>
                  Confirm your inputs then let the AI do the work.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                {[
                  { icon: FileText, color: '#a78bfa', accent: 'rgba(139,92,246,', label: 'Resume', value: resumeFile?.name, meta: `${(resumeFile?.size / 1024).toFixed(1)} KB` },
                  { icon: BriefcaseBusiness, color: '#38bdf8', accent: 'rgba(56,189,248,', label: 'Job Description',
                    value: jobFile ? jobFile.name : `${jobText.slice(0,80)}…`,
                    meta: jobFile ? `${(jobFile.size/1024).toFixed(1)} KB` : `${jobText.length} chars` },
                ].map(({ icon: Icon, color, accent, label, value, meta }) => (
                  <div key={label} className="card p-4 flex items-start gap-3"
                    style={{ borderColor: `${accent}0.2)`, background: `${accent}0.04)` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${accent}0.12)`, border: `1px solid ${accent}0.2)` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#475569' }}>{label}</p>
                      <p className="text-sm font-medium text-slate-200 truncate">{value}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#334155' }}>{meta}</p>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-sm px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                  {error}
                </motion.div>
              )}

              {/* Loading state */}
              <AnimatePresence>
                {loading && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="card p-5 space-y-4" style={{ borderColor: 'rgba(139,92,246,0.2)', background: 'rgba(109,40,217,0.05)' }}>
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#a78bfa' }} />
                      <AnimatePresence mode="wait">
                        <motion.p key={loadingMsg}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          className="text-sm font-medium" style={{ color: '#a78bfa' }}>
                          {LOADING_MESSAGES[loadingMsg]}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg,#7c3aed,#38bdf8)' }}
                        animate={{ width: ['0%','100%'] }}
                        transition={{ duration: 10, ease: 'linear', repeat: Infinity }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between pt-2">
                <button onClick={() => setStep(2)} disabled={loading} className="btn-secondary gap-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                <button onClick={handleAnalyse} disabled={loading} className="btn-primary gap-2 min-w-[160px]">
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Analysing…</>
                    : <><Sparkles className="w-4 h-4" /> Run AI Analysis</>
                  }
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
