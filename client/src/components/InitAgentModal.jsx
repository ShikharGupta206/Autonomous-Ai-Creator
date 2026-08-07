import React, { useState } from 'react';
import { X, Bot, Shield, Cpu, BarChart2, Radio, Check } from 'lucide-react';

const PRESETS = [
  { name: 'Ada', domain: 'AI Security', icon: Shield, desc: 'Focuses on vulnerability research, prompt injection, and red teaming.' },
  { name: 'Orion', domain: 'Machine Learning Engineering', icon: Cpu, desc: 'Focuses on GPU throughput, distributed training, and vLLM optimization.' },
  { name: 'Nexus', domain: 'AI Product Analyst', icon: BarChart2, desc: 'Focuses on enterprise adoption, agent UX, and API unit economics.' },
  { name: 'Kora', domain: 'Robotics & Embodied AI', icon: Radio, desc: 'Focuses on vision-language-action models, spatial intelligence, and ROS2.' }
];

export default function InitAgentModal({ isOpen, onClose, onInitAgent }) {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [customName, setCustomName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [intervalMinutes, setIntervalMinutes] = useState(2);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const name = isCustom ? customName : selectedPreset.name;
    const domain = isCustom ? customDomain : selectedPreset.domain;

    await onInitAgent({ name, domain }, intervalMinutes);
    setSubmitting(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '28px', borderRadius: '20px', background: '#0f172a' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={24} color="#06b6d4" />
            <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Initialize Autonomous AI Agent</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Preset Selector */}
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '10px' }}>
            SELECT PERSONA ARCHETYPE:
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            {PRESETS.map((preset) => {
              const Icon = preset.icon;
              const active = !isCustom && selectedPreset.name === preset.name;
              return (
                <div
                  key={preset.name}
                  onClick={() => { setSelectedPreset(preset); setIsCustom(false); }}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid ' + (active ? '#06b6d4' : 'rgba(255, 255, 255, 0.08)'),
                    background: active ? 'rgba(6, 182, 212, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#f8fafc', fontSize: '14px' }}>
                      <Icon size={16} color={active ? '#06b6d4' : '#94a3b8'} />
                      <span>{preset.name}</span>
                    </div>
                    {active && <Check size={14} color="#06b6d4" />}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{preset.domain}</div>
                </div>
              );
            })}
          </div>

          {/* Custom Persona Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#e2e8f0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isCustom}
                onChange={(e) => setIsCustom(e.target.checked)}
                style={{ accentColor: '#06b6d4' }}
              />
              <span>Define Custom Persona & Identity</span>
            </label>

            {isCustom && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                <input
                  type="text"
                  placeholder="Persona Name (e.g. Maya)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required={isCustom}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
                <input
                  type="text"
                  placeholder="Domain (e.g. AI Ethics)"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  required={isCustom}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Autonomous Publishing Interval */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              AUTONOMOUS PUBLISHING CYCLE INTERVAL:
            </label>
            <select
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value={1} style={{ background: '#0f172a' }}>1 Minute (Fast evaluation demo mode)</option>
              <option value={2} style={{ background: '#0f172a' }}>2 Minutes (Default recommended)</option>
              <option value={5} style={{ background: '#0f172a' }}>5 Minutes</option>
              <option value={15} style={{ background: '#0f172a' }}>15 Minutes</option>
            </select>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Initializing Agent...' : 'Initialize & Start Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
