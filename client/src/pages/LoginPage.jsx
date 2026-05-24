import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Loader2, AlertCircle, CheckCircle, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BENEFITS = [
  'AI match score with full skill breakdown',
  'ATS keyword gap analysis',
  'Prioritised improvement suggestions',
  'Personal AI career coach chat',
  'Full history of all your analyses',
];

// Google G logo SVG
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function FirebaseSetupGuide() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="card-gradient-border p-8 max-w-lg w-full space-y-6"
        style={{ boxShadow: '0 0 60px rgba(109,40,217,0.12)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Terminal className="w-5 h-5" style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <h2 className="font-bold text-slate-200">Firebase Setup Required</h2>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>Add your Firebase config to enable Google sign-in</p>
          </div>
        </div>

        <div className="space-y-3 text-sm" style={{ color: '#94a3b8' }}>
          <p>Follow these steps to configure Firebase:</p>
          <ol className="space-y-2 list-decimal list-inside leading-relaxed" style={{ color: '#64748b' }}>
            <li>Go to <strong className="text-slate-300">console.firebase.google.com</strong> and create a project</li>
            <li>Enable <strong className="text-slate-300">Authentication → Google</strong> sign-in method</li>
            <li>Add a Web App and copy the config values</li>
            <li>Edit <strong className="text-slate-300">client/.env</strong> and fill in all <code className="text-violet-400">VITE_FIREBASE_*</code> values</li>
            <li>Go to <strong className="text-slate-300">Project Settings → Service Accounts → Generate private key</strong></li>
            <li>Add the 3 Firebase Admin values to <strong className="text-slate-300">server/.env</strong></li>
          </ol>
        </div>

        <div className="rounded-xl p-3 font-mono text-xs leading-relaxed"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', color: '#a78bfa' }}>
          {`# client/.env\nVITE_FIREBASE_API_KEY=AIza...\nVITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com\nVITE_FIREBASE_PROJECT_ID=your-project-id\n\n# server/.env\nFIREBASE_PROJECT_ID=your-project-id\nFIREBASE_CLIENT_EMAIL=firebase-adminsdk@...\nFIREBASE_PRIVATE_KEY="-----BEGIN RSA..."`}
        </div>

        <p className="text-xs" style={{ color: '#334155' }}>
          After filling in the values, Vite will hot-reload automatically.
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  const { user, loading, signInWithGoogle, isFirebaseConfigured } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/analyze';

  if (!isFirebaseConfigured) return <FirebaseSetupGuide />;

  const [signingIn, setSigningIn] = useState(false);
  const [error, setError]         = useState(null);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  async function handleGoogleSignIn() {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Navigation handled by AuthGuard redirect
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16 dot-grid"
      style={{ background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(109,40,217,0.2), transparent)' }}>

      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-6 items-center">

        {/* Left — benefits */}
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="hidden lg:block space-y-8 pr-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold leading-tight">
              Match smarter.<br />
              <span className="gradient-text">Get hired faster.</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: '#64748b' }}>
              HireFit AI gives you an instant AI-powered match score,
              skill gap analysis, and a personal career coach — all in one place.
            </p>
          </div>
          <ul className="space-y-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <CheckCircle className="w-3 h-3" style={{ color: '#34d399' }} />
                </div>
                <span className="text-sm" style={{ color: '#94a3b8' }}>{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Right — sign-in card */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22,1,0.36,1] }}
          className="card-gradient-border p-8 space-y-8"
          style={{ boxShadow: '0 0 60px rgba(109,40,217,0.12)' }}>

          {/* Logo */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 24px rgba(124,58,237,0.4)' }}>
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                <span className="text-white">HireFit</span>
                <span className="gradient-text"> AI</span>
              </h2>
              <p className="text-sm mt-1" style={{ color: '#475569' }}>
                Sign in to analyse your resume
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="section-divider" />

          {/* Sign in button */}
          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: '#fff',
                color: '#1f2937',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              }}
              onMouseEnter={e => { if (!signingIn) e.currentTarget.style.background = '#f9fafb'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              {signingIn
                ? <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                : <GoogleIcon />
              }
              {signingIn ? 'Signing in…' : 'Continue with Google'}
            </button>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}
          </div>

          <p className="text-xs text-center" style={{ color: '#334155' }}>
            By signing in you agree to our Terms of Service.<br />
            Your data is private — analyses are only visible to you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
