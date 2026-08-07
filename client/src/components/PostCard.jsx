import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Sparkles, Clock, Share2 } from 'lucide-react';

export default function PostCard({ post, persona }) {
  const [showRationale, setShowRationale] = useState(false);

  // Format relative timestamp
  const dateObj = new Date(post.createdAt);
  const timeAgo = formatTimeAgo(dateObj);

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px', position: 'relative' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(6, 182, 212, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '14px',
            color: '#06b6d4'
          }}>
            {persona?.name ? persona.name.charAt(0) : 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#f8fafc' }}>
              {persona?.name || 'Autonomous Agent'}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              {persona?.domain || 'AI Technology Persona'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
            <Clock size={13} />
            <span title={dateObj.toISOString()}>{timeAgo}</span>
          </div>
          <span className="badge badge-purple" style={{ fontFamily: 'var(--font-mono)' }}>
            ID: {post.id}
          </span>
        </div>
      </div>

      {/* Main Post Text */}
      <div style={{
        fontSize: '15px',
        lineHeight: '1.65',
        color: '#e2e8f0',
        whiteSpace: 'pre-line',
        marginBottom: '20px',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.04)'
      }}>
        {post.text}
      </div>

      {/* Sources & Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        {/* Source Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>Sources:</span>
          {(post.sources || []).map((src, idx) => (
            <a
              key={idx}
              href={src}
              target="_blank"
              rel="noreferrer"
              className="badge badge-cyan"
              style={{ textDecoration: 'none', gap: '4px' }}
            >
              <span>{extractDomainName(src)}</span>
              <ExternalLink size={11} />
            </a>
          ))}
        </div>

        {/* Rationale Toggle Button */}
        <button
          onClick={() => setShowRationale(!showRationale)}
          style={{
            background: showRationale ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: '1px solid ' + (showRationale ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255, 255, 255, 0.1)'),
            color: showRationale ? '#c084fc' : '#94a3b8',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={14} />
          <span>Publishing Rationale</span>
          {showRationale ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Publishing Rationale Collapsible Panel */}
      {showRationale && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          fontSize: '13px',
          color: '#cbd5e1',
          lineHeight: '1.6',
          whiteSpace: 'pre-line'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c084fc', fontWeight: 600, marginBottom: '8px' }}>
            <ShieldCheck size={16} />
            <span>Editorial Judgment & Rationale Breakdown</span>
          </div>
          {post.rationale}
        </div>
      )}
    </div>
  );
}

function extractDomainName(url) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace('www.', '');
  } catch {
    return 'Source';
  }
}

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
}
