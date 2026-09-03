import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronRight, Edit3 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [name, setName] = useState('Ali Khan');
  const [phone, setPhone] = useState('0300 1234567');

  const handleLogout = () => {
    // In a real app, clear tokens here
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Profile</h2>

      {/* Profile Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500 text-center relative">
        <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary transition-colors bg-white/50 dark:bg-black/20 rounded-full">
          <Edit3 size={18} />
        </button>

        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 mb-4 border-4 border-white/50 dark:border-white/10">
          <User size={40} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{name}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{phone}</p>
        
        <div className="mt-6 flex justify-center gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200 dark:border-green-800/50">Verified Farmer</span>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500 flex flex-col divide-y divide-slate-100 dark:divide-white/5">
        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors rounded-xl">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Personal Information</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
        <button onClick={() => navigate('/farms')} className="w-full flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors rounded-xl">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Manage Farms</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
        <button className="w-full flex items-center justify-between p-3 hover:bg-white/50 dark:hover:bg-white/5 transition-colors rounded-xl">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy & Security</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
      >
        <LogOut size={20} />
        <span className="font-bold">Log Out</span>
      </button>

    </div>
  );
}
