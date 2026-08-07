import React from 'react';
import { Bot, Zap, Plus, RefreshCw, Cpu } from 'lucide-react';

export default function Navbar({ agents, selectedAgentId, onSelectAgent, onOpenInitModal, onTriggerCycle, loading }) {
  const currentAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(8, 11, 18, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
        }}>
          <Bot size={22} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            AUTONOMOUS AI CREATOR
          </h1>
          <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="live-pulse"></span>
            <span>Autonomous Engine Active</span>
          </div>
        </div>
      </div>

      {/* Agent Selector & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {agents.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Cpu size={16} color="#06b6d4" />
            <select
              value={selectedAgentId || ''}
              onChange={(e) => onSelectAgent(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#f8fafc',
                fontSize: '14px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {agents.map(a => (
                <option key={a.id} value={a.id} style={{ background: '#0f172a', color: '#fff' }}>
                  {a.persona.name} ({a.persona.domain}) - {a.id}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={onTriggerCycle}
          disabled={loading || !selectedAgentId}
          className="btn-secondary"
          title="Force immediate autonomous discovery & editorial cycle"
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Trigger Cycle</span>
        </button>

        <button onClick={onOpenInitModal} className="btn-primary">
          <Plus size={16} />
          <span>Initialize Agent</span>
        </button>
      </div>
    </header>
  );
}
