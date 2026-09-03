import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import './i18n'
import BackgroundCanvas from './components/BackgroundCanvas'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Register Service Worker
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="77060615579-smoqj80q0hm9pj38s7fagmu4op2fle6l.apps.googleusercontent.com">
        <AuthProvider>
          <LanguageProvider>
            <BackgroundCanvas>
              <App />
            </BackgroundCanvas>
          </LanguageProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
