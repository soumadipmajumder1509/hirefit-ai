import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Target } from 'lucide-react';

export default function AuthGuard({ children }) {
  const { user, loading, isFirebaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
        >
          <Target className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm" style={{ color: '#475569' }}>Loading…</p>
      </div>
    );
  }

  if (!isFirebaseConfigured || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
