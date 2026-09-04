import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Lazy loading pages for better startup performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Chatbot = lazy(() => import('./pages/Chatbot'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const Farms = lazy(() => import('./pages/Farms'));
const FarmDetail = lazy(() => import('./pages/FarmDetail'));
const Notifications = lazy(() => import('./pages/Notifications'));

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
      <Suspense fallback={<div className="flex-1 h-screen w-full flex items-center justify-center bg-sky-200 dark:bg-indigo-950">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>}>
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
      </Suspense>
    </>
  );
}
