import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Farms from './pages/Farms';
import FarmDetail from './pages/FarmDetail';
import Notifications from './pages/Notifications';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
      <Toaster 
        position="bottom-center" 
        containerStyle={{ bottom: 80 }} 
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '100px',
            padding: '12px 24px',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route index element={<Dashboard />} />
          <Route path="farms" element={<Farms />} />
          <Route path="farms/:id" element={<FarmDetail />} />
          <Route path="chat" element={<Chatbot />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
