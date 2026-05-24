import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/"       element={<HomePage />} />
            <Route path="/login"  element={<LoginPage />} />

            {/* Protected */}
            <Route path="/analyze"      element={<AuthGuard><AnalyzePage /></AuthGuard>} />
            <Route path="/results/:id"  element={<AuthGuard><ResultsPage /></AuthGuard>} />
            <Route path="/history"      element={<AuthGuard><HistoryPage /></AuthGuard>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t py-4 text-center text-xs" style={{ borderColor: 'rgba(99,102,241,0.1)', color: '#334155' }}>
          Made with <span style={{ color: '#7c3aed' }}>♥</span> by{' '}
          <span className="font-semibold" style={{ color: '#64748b' }}>Soumadip Majumder (IIT BHU)</span>
        </footer>
      </div>
    </AuthProvider>
  );
}
