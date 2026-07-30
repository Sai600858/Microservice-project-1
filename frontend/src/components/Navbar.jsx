import React from 'react';
import { LayoutDashboard, HelpCircle, Layers, Server, Sparkles, Wifi, WifiOff } from 'lucide-react';
import { isMockMode, setMockMode } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, statusInfo, onRefreshStatus }) {
  const mockActive = isMockMode();

  const handleToggleMock = (e) => {
    setMockMode(e.target.checked);
    onRefreshStatus();
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 28px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
              Quiz<span className="gradient-text">Craft</span>
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em' }}>
              MICROSERVICES ARCHITECTURE
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(17, 23, 38, 0.7)',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('quiz-player')}
            className={`btn btn-sm ${activeTab === 'quiz-player' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <HelpCircle size={16} />
            Take Quiz
          </button>

          <button
            onClick={() => setActiveTab('question-bank')}
            className={`btn btn-sm ${activeTab === 'question-bank' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Layers size={16} />
            Question Bank
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`btn btn-sm ${activeTab === 'services' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ border: 'none' }}
          >
            <Server size={16} />
            Services Status
          </button>
        </div>

        {/* Connection Status & Mock Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            background: statusInfo.isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: statusInfo.isOnline ? '#10b981' : '#f59e0b',
            border: `1px solid ${statusInfo.isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            {statusInfo.isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
            <span>{statusInfo.isOnline ? 'Gateway Connected' : (mockActive ? 'Mock Data Active' : 'Backend Offline')}</span>
          </div>

          {/* Mock Mode Switch */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            fontWeight: 500
          }}>
            <input 
              type="checkbox"
              checked={mockActive}
              onChange={handleToggleMock}
              style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            Demo Mode
          </label>
        </div>
      </div>
    </nav>
  );
}
