import { useState } from 'react';
import './App.css';
import FarmSetup from './components/FarmSetup';
import Dashboard from './components/Dashboard';
import { Leaf, Home, LayoutDashboard } from 'lucide-react';

function App() {
  const [view, setView] = useState('farm-setup'); // 'farm-setup' | 'dashboard'
  const [selectedFarmId, setSelectedFarmId] = useState(null);

  function handleFarmSelect(farmId) {
    setSelectedFarmId(farmId);
    setView('dashboard');
  }

  function handleBack() {
    setView('farm-setup');
    setSelectedFarmId(null);
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-section">
            <div className="logo" onClick={() => setView('farm-setup')}>
              <Leaf className="logo-icon" size={32} />
              <span className="logo-text">Kisan Nighaban</span>
            </div>
            <p className="tagline">Climate Risk Guardian for Pakistan's Farmers</p>
          </div>
          <nav className="app-nav">
            <button
              className={`nav-tab ${view === 'farm-setup' ? 'active' : ''}`}
              onClick={() => setView('farm-setup')}
            >
              <Home size={18} /> Farm Setup
            </button>
            <button
              className={`nav-tab ${view === 'dashboard' ? 'active' : ''}`}
              onClick={() => selectedFarmId && setView('dashboard')}
              disabled={!selectedFarmId}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {view === 'farm-setup' && <FarmSetup onFarmSaved={handleFarmSelect} />}
        {view === 'dashboard' && selectedFarmId && (
          <Dashboard farmId={selectedFarmId} onBack={handleBack} />
        )}
      </main>

      <footer className="app-footer">
        <p>Kisan Nighaban — Protecting Pakistan's Harvests from Climate Change</p>
      </footer>
    </div>
  );
}

export default App;
