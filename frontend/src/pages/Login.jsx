import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { authAPI } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: 'error', title: t('auth.login_failed'), message: t('auth.fill_fields') });
      return;
    }
    
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      login(res.access_token);
      navigate('/');
    } catch (error) {
      let errorMsg = t('auth.invalid_credentials');
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail.map(err => `${err.loc[err.loc.length-1]}: ${err.msg}`).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMsg = error.response.data.detail;
        }
      }
      setAlert({ 
        type: 'error', 
        title: t('auth.login_failed'), 
        message: errorMsg
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await authAPI.googleLogin(credentialResponse.credential);
      login(res.access_token);
      navigate('/');
    } catch (error) {
      setAlert({ type: 'error', title: t('auth.login_failed'), message: t('auth.google_failed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="ltr" className="flex-1 flex flex-col justify-center relative font-sans">

      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full p-1 flex gap-1 shadow-sm border border-white/20 dark:border-white/10">
        <button onClick={() => changeLanguage('en')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${language === 'en' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>EN</button>
        <button onClick={() => changeLanguage('hi')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${language === 'hi' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>HI</button>
        <button onClick={() => changeLanguage('ur')} className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors urdu-font ${language === 'ur' ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10'}`}>اردو</button>
      </div>

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
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300 tracking-tight">{t('auth.welcome_back')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{t('auth.resume_journey')}</p>
        </div>

        {/* Glassmorphism Form Card */}
        <form onSubmit={handleLogin} className="bg-white/70 dark:bg-black/50 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 dark:border-white/10 flex flex-col gap-4 relative overflow-hidden">
          {/* Subtle inner highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20"></div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{t('auth.email')}</label>
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
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t('auth.password')}</label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:text-primary-dark transition-colors">{t('auth.forgot')}</Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 pr-12 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl p-4 mt-2 hover:shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? t('auth.signing_in') : t('auth.sign_in')}
          </button>
          
          <div className="flex items-center my-2 before:flex-1 before:border-t before:border-slate-200 dark:before:border-slate-700 after:flex-1 after:border-t after:border-slate-200 dark:after:border-slate-700">
            <span className="px-3 text-sm text-slate-400 font-medium">{t('auth.continue_with')}</span>
          </div>
          
          <div className="flex justify-center w-full [&>div]:w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setAlert({ type: 'error', title: 'Error', message: 'Google authentication failed' });
              }}
              shape="pill"
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </form>

        <p className="text-center mt-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          {t('auth.dont_have')} <Link to="/signup" className="font-bold text-primary hover:text-primary-dark ml-1">{t('auth.sign_up')}</Link>
        </p>
      </div>
    </div>
  );
}
