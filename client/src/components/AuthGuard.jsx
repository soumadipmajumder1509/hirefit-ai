import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ children }) {
  const { user, loading, isFirebaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <img src="/logo.png" alt="HireFit AI" className="w-14 h-14 rounded-2xl object-cover animate-pulse"
          style={{ boxShadow: '0 0 30px rgba(124,58,237,0.4)' }} />
        <p className="text-sm" style={{ color: '#475569' }}>Loading…</p>
      </div>
    );
  }

  if (!isFirebaseConfigured || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
