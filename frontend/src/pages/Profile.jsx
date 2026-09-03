import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, ChevronRight, Edit3, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const name = user?.full_name || 'Loading...';
  const phone = user?.mobile_number || 'Loading...';
  const email = user?.email || 'Loading...';
  
  const [expandedSection, setExpandedSection] = useState(null); // 'personal' or 'privacy'
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 pt-4 overflow-y-auto pb-24">
      <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Profile</h2>

      {/* Profile Card */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 dark:border-white/10 transition-colors duration-500 text-center relative">
        <button onClick={() => setShowEditModal(true)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-primary transition-colors bg-white/50 dark:bg-black/20 rounded-full">
          <Edit3 size={18} />
        </button>

        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/20 mb-4 border-4 border-white/50 dark:border-white/10">
          <User size={40} className="text-white" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{name}</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{phone}</p>
        
        <div className="mt-6 flex justify-center gap-2">
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200 dark:border-green-800/50 flex items-center gap-1">
            <ShieldCheck size={14} /> Verified Farmer
          </span>
        </div>
      </div>

      {/* Account Settings Menu */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-3xl shadow-sm border border-white/50 dark:border-white/10 transition-colors duration-500 flex flex-col overflow-hidden">
        
        {/* Personal Information Accordion */}
        <div className="border-b border-slate-100 dark:border-white/5">
          <button onClick={() => toggleSection('personal')} className="w-full flex items-center justify-between p-5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Personal Information</span>
            {expandedSection === 'personal' ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
          </button>
          
          {expandedSection === 'personal' && (
            <div className="p-5 pt-0 bg-white/30 dark:bg-black/20 flex flex-col space-y-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</p>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{email}</p>
              </div>
              <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 text-primary font-bold text-sm mt-2 hover:opacity-80">
                <Edit3 size={16} /> Edit Details
              </button>
            </div>
          )}
        </div>

        {/* Manage Farms Link */}
        <button onClick={() => navigate('/farms')} className="w-full flex items-center justify-between p-5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors border-b border-slate-100 dark:border-white/5">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Manage Farms</span>
          <ChevronRight size={20} className="text-slate-400" />
        </button>
        
        {/* Privacy & Security Accordion */}
        <div>
          <button onClick={() => toggleSection('privacy')} className="w-full flex items-center justify-between p-5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy & Security</span>
            {expandedSection === 'privacy' ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
          </button>

          {expandedSection === 'privacy' && (
            <div className="p-5 pt-0 bg-white/30 dark:bg-black/20 flex flex-col space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <p className="text-blue-800 dark:text-blue-200 text-sm font-medium leading-relaxed">
                  We don't share your information with anyone. Your farm data and personal details are strictly confidential.
                </p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Change Password
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
      >
        <LogOut size={20} />
        <span className="font-bold">Log Out</span>
      </button>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-0 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl relative animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 flex flex-col max-h-[75vh] mb-20 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5 shrink-0">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" defaultValue={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input type="tel" defaultValue={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            {/* Modal Footer (Fixed) */}
            <div className="p-6 pt-4 border-t border-slate-100 dark:border-white/5 shrink-0 bg-slate-50/50 dark:bg-black/20">
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  toast.success("Profile updated successfully!");
                }} 
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
