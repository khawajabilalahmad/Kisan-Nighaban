import { useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import FarmSetup from './components/FarmSetup';
import Dashboard from './components/Dashboard';
import { Leaf, Home, LayoutDashboard, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import ResetPasswordPage from './components/ResetPasswordPage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, onRequireAuth }) {
  const { user } = useAuth();
  if (!user) {
    onRequireAuth();
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const [selectedFarmId, setSelectedFarmId] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleFarmSelect(farmId) {
    setSelectedFarmId(farmId);
    navigate('/dashboard');
  }

  function handleBack() {
    setSelectedFarmId(null);
    navigate('/farm-setup');
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const openForgotModal = () => setIsForgotModalOpen(true);

  // Active path checker
  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-section">
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
              <Leaf className="logo-icon" size={32} />
              <span className="logo-text">Kisan Nighaban</span>
            </Link>
            <p className="tagline">Climate Risk Guardian for Pakistan's Farmers</p>
          </div>
          <nav className="app-nav">
            <Link to="/" className={`nav-tab ${isActive('/') ? 'active' : ''}`}>
              <Home size={18} /> Home
            </Link>
            
            {user && (
              <>
                <Link to="/farm-setup" className={`nav-tab ${isActive('/farm-setup') ? 'active' : ''}`}>
                  <PlusCircle size={18} /> Farm Setup
                </Link>
                {selectedFarmId ? (
                  <Link to="/dashboard" className={`nav-tab ${isActive('/dashboard') ? 'active' : ''}`}>
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                ) : (
                  <button className="nav-tab" disabled>
                    <LayoutDashboard size={18} /> Dashboard
                  </button>
                )}
              </>
            )}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {user ? (
                <>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                    <UserIcon size={18} /> {user.email}
                  </span>
                  <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem 1rem', display: 'flex', gap: '0.5rem' }}>
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={openAuthModal} style={{ padding: '0.5rem 1rem' }}>
                  Login / Sign Up
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage onGetStarted={() => user ? navigate('/farm-setup') : openAuthModal()} />} />
          <Route 
            path="/farm-setup" 
            element={
              <ProtectedRoute onRequireAuth={openAuthModal}>
                <FarmSetup onFarmSaved={handleFarmSelect} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute onRequireAuth={openAuthModal}>
                {selectedFarmId ? (
                  <Dashboard farmId={selectedFarmId} onBack={handleBack} />
                ) : (
                  <Navigate to="/farm-setup" replace />
                )}
              </ProtectedRoute>
            } 
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Kisan Nighaban — Protecting Pakistan's Harvests from Climate Change</p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onForgotPassword={openForgotModal}
      />
      <ForgotPasswordModal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
      />
    </div>
  );
}

export default App;
