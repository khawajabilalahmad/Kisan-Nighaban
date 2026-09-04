import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import GrowingNature from '../components/GrowingNature';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null);
  const [isSent, setIsSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (!email) {
      setAlert({ type: 'error', title: 'Error', message: 'Please enter your email address.' });
      return;
    }
    
    // Simulate API call
    setAlert({ type: 'success', title: 'Reset Link Sent', message: 'Check your email for reset instructions.' });
    setIsSent(true);
  };

  return (
    <div dir="ltr" className="flex-1 flex flex-col relative font-sans py-8">

      {alert && (
        <Alert 
          type={alert.type} 
          title={alert.title} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      <div className="px-6 relative z-10 w-full max-w-sm mx-auto my-auto">
        <div className="text-center mb-4">
          <div className="w-64 h-40 mx-auto flex items-center justify-center">
            <img src="/logo.png" alt="Kisan Nighaban Logo" className="w-full h-full object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300 tracking-tight">Recover Access</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">We'll help you get back to your farm.</p>
        </div>

        {/* Glassmorphism Form Card */}
        <form onSubmit={handleReset} className="bg-white/70 dark:bg-black/50 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/50 dark:border-white/10 flex flex-col gap-5 relative overflow-hidden">
          {/* Subtle inner highlight */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/20"></div>

          {!isSent ? (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner"
                  placeholder="kisan@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSent}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl p-4 mt-2 hover:shadow-lg hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all active:translate-y-0"
              >
                Send Reset Link
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">✓</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Check your inbox</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                We've sent password reset instructions to your email.
              </p>
            </div>
          )}
          
          <p className="text-center mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
            Remember your password? <Link to="/login" className="font-bold text-primary hover:text-primary-dark ml-1">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
