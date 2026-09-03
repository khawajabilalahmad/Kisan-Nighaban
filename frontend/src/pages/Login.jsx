import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/Alert';
import GrowingNature from '../components/GrowingNature';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: 'error', title: 'Login Failed', message: 'Please fill in all fields.' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      login(res.access_token);
      navigate('/');
    } catch (error) {
      setAlert({ 
        type: 'error', 
        title: 'Login Failed', 
        message: error.response?.data?.detail || 'Invalid email or password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center relative font-sans">

      {alert && (
        <Alert 
          type={alert.type} 
          title={alert.title} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="px-6 relative z-10 pt-12 pb-20 w-full max-w-sm mx-auto">
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto flex items-center justify-center mb-6">
            <img src="/logo.png" alt="Kisan Nighaban Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Your farm is waiting for you.</p>
        </div>

        {/* Glassmorphism Form Card */}
        <form onSubmit={handleLogin} className="bg-white/70 dark:bg-black/50 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 dark:border-white/10 flex flex-col gap-5 relative overflow-hidden">
          {/* Subtle inner highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20"></div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
              placeholder="kisan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl p-4 mt-2 hover:shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          Don't have an account? <Link to="/signup" className="font-bold text-primary hover:text-primary-dark ml-1">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
