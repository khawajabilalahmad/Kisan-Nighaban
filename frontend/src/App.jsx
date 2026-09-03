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
import ProtectedRoute from './components/ProtectedRoute';
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
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="farms" element={<ProtectedRoute><Farms /></ProtectedRoute>} />
          <Route path="farms/:id" element={<ProtectedRoute><FarmDetail /></ProtectedRoute>} />
          <Route path="chat" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
