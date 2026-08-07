import React from 'react';
import { XCircle, Award, Sliders, AlertTriangle, ExternalLink } from 'lucide-react';

export default function EditorialLog({ rejections }) {
  if (!rejections || rejections.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
        <Sliders size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>No Editorial Rejections Recorded Yet</h3>
        <p style={{ fontSize: '13px', marginTop: '4px' }}>
          When the autonomous engine evaluates live candidates, rejected topics and decision metrics will appear here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Editorial Judgment Audit Trail</h2>
          <p style={{ fontSize: '13px', color: '#94a3b8' }}>
            Transparent log of topics rejected or passed over by the agent's editorial quality engine.
          </p>
        </div>
        <span className="badge badge-amber">
          {rejections.length} Candidates Evaluated & Rejected
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rejections.map((rej) => (
          <div key={rej.id} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <XCircle size={18} color="#f43f5e" />
                <a
                  href={rej.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#f8fafc', fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <span>{rej.title}</span>
                  <ExternalLink size={12} color="#94a3b8" />
                </a>
              </div>
              <span className="badge badge-amber" style={{ fontFamily: 'var(--font-mono)' }}>
                Score: {rej.compositeScore}/100
              </span>
            </div>

            {/* Rejection Reason */}
            <div style={{ fontSize: '13px', color: '#fda4af', margin: '8px 0', background: 'rgba(244, 63, 94, 0.08)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
              {rej.reason}
            </div>

            {/* Score Breakdown Pills */}
            {rej.breakdown && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
                <span>Domain: <strong style={{ color: '#06b6d4' }}>{rej.breakdown.domain}/100</strong></span>
                <span>Novelty: <strong style={{ color: '#8b5cf6' }}>{rej.breakdown.novelty}/100</strong></span>
                <span>Substance: <strong style={{ color: '#10b981' }}>{rej.breakdown.substance}/100</strong></span>
                <span>Source: <strong>{rej.sourceName}</strong></span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
