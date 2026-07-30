import React, { useState } from 'react';
import { Server, RefreshCw, CheckCircle2, AlertCircle, Link, Cpu, ShieldCheck } from 'lucide-react';
import { getGatewayUrl, setGatewayUrl } from '../services/api';

export default function ServiceStatus({ statusInfo, onRefreshStatus }) {
  const [gatewayInput, setGatewayInput] = useState(getGatewayUrl());
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveUrl = (e) => {
    e.preventDefault();
    setGatewayUrl(gatewayInput);
    setSavedMsg(true);
    onRefreshStatus();
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const services = [
    {
      name: 'Service-Registry (Eureka Server)',
      port: 8761,
      role: 'Service Discovery & Heartbeat Monitoring',
      desc: 'Central registry where all microservices publish their network locations dynamically.',
      status: statusInfo.isOnline ? 'Online' : 'Pending',
      color: '#10b981'
    },
    {
      name: 'API-Gateway (Spring Gateway)',
      port: 8787,
      role: 'Unified Entry Point & Router',
      desc: 'Routes incoming client traffic to /question/** and /quiz/** based on path predicates.',
      status: statusInfo.isOnline ? 'Active' : 'Offline / Standard Port 8787',
      color: '#6366f1'
    },
    {
      name: 'QuestionService',
      port: 8082,
      role: 'Question Bank & Evaluation',
      desc: 'Manages CRUD operations, categorization, difficulty filtering, and score computation.',
      status: statusInfo.isOnline ? 'Registered' : 'Offline',
      color: '#8b5cf6'
    },
    {
      name: 'QuizService',
      port: 8090,
      role: 'Quiz Generation & Feign Client Orchestration',
      desc: 'Communicates with QuestionService via OpenFeign to assemble quizzes and calculate final results.',
      status: statusInfo.isOnline ? 'Registered' : 'Offline',
      color: '#ec4899'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Microservices <span className="gradient-text">Topology & Health</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Live status of backend microservices and Spring Eureka registration
          </p>
        </div>

        <button 
          onClick={onRefreshStatus} 
          className="btn btn-secondary"
        >
          <RefreshCw size={16} /> Test Live Ping
        </button>
      </div>

      {/* Gateway Connection Config Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link size={18} color="var(--accent-primary)" /> API Gateway Configuration
        </h3>

        <form onSubmit={handleSaveUrl} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              className="form-input"
              value={gatewayInput}
              onChange={(e) => setGatewayInput(e.target.value)}
              placeholder="http://localhost:8787"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Save Gateway URL
          </button>
        </form>

        {savedMsg && (
          <div style={{ marginTop: '10px', color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} /> Gateway URL updated successfully!
          </div>
        )}
      </div>

      {/* Microservices Topology Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {services.map((svc, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${svc.color}20`,
                    color: svc.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Server size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{svc.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Port: :{svc.port}</span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '999px',
                  background: statusInfo.isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: statusInfo.isOnline ? '#10b981' : '#f59e0b',
                  border: `1px solid ${statusInfo.isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                  {statusInfo.isOnline ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                  {svc.status}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: 600, marginBottom: '8px' }}>
                Role: {svc.role}
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {svc.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
