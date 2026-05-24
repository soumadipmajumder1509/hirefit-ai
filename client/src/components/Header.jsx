import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Target, FileText, Clock, Plus, LogOut, ChevronDown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function UserMenu({ user, signOutUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (!ref.current?.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all duration-150"
        style={{ background: open ? 'rgba(255,255,255,0.06)' : 'transparent', border: '1px solid rgba(255,255,255,0.08)' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
      >
        {user.photoURL ? (
          <img src={user.photoURL} alt={user.displayName} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', color: '#fff' }}>
            {user.displayName?.[0] ?? user.email?.[0] ?? '?'}
          </div>
        )}
        <span className="text-sm font-medium text-slate-300 max-w-[100px] truncate hidden sm:block">
          {user.displayName?.split(' ')[0] ?? 'Account'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
            style={{ background: '#0d1438', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(99,102,241,0.12)' }}>
              <p className="text-sm font-semibold text-slate-200 truncate">{user.displayName ?? 'User'}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: '#475569' }}>{user.email}</p>
            </div>

            {/* Actions */}
            <div className="p-1.5">
              <Link to="/history" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm text-slate-300 transition-colors"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#e2e8f0'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#94a3b8'; }}>
                <Clock className="w-4 h-4" /> My History
              </Link>
              <button
                onClick={() => { signOutUser(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm transition-colors"
                style={{ color: '#f87171' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = ''; }}
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const { pathname } = useLocation();
  const { user, signOutUser } = useAuth();

  const navLink = (to, icon, label) => {
    const active = pathname === to;
    const Icon = icon;
    return (
      <Link to={to}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
        style={active
          ? { color: '#a78bfa', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }
          : { color: '#64748b', border: '1px solid transparent' }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = ''; }}}
      >
        <Icon className="w-3.5 h-3.5" />
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(4,7,26,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderColor: 'rgba(99,102,241,0.12)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 16px rgba(124,58,237,0.4)' }}>
            <Target className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-white">HireFit</span>
            <span className="gradient-text"> AI</span>
          </span>
        </Link>

        {/* Nav + auth */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {navLink('/analyze', FileText, 'Analyse')}
              {navLink('/history', Clock, 'History')}
              <Link to="/analyze" className="btn-primary text-sm py-2 px-3.5 flex items-center gap-1.5 ml-1">
                <Plus className="w-3.5 h-3.5" /> New
              </Link>
            </>
          )}

          {user
            ? <UserMenu user={user} signOutUser={signOutUser} />
            : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            )
          }
        </div>
      </div>
    </header>
  );
}
