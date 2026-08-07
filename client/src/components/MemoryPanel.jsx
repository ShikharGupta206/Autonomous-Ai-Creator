import React from 'react';
import { Database, Tag, Link2, History, Layers } from 'lucide-react';

export default function MemoryPanel({ memory, persona }) {
  const publishedTopics = memory?.publishedTopics || [];
  const concepts = memory?.concepts || [];
  const sources = memory?.sourceHistory || [];

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Agent Memory & Telemetry</h2>
        <p style={{ fontSize: '13px', color: '#94a3b8' }}>
          Long-term memory persistence preventing repetition and maintaining editorial continuity for {persona?.name || 'Agent'}.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Active Memory Concepts */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#06b6d4', marginBottom: '14px' }}>
            <Tag size={16} />
            <span>Topical Memory Concepts ({concepts.length})</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {concepts.length > 0 ? (
              concepts.map((c, i) => (
                <span key={i} className="badge badge-cyan" style={{ fontSize: '12px' }}>
                  #{c}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#64748b' }}>No concepts in memory yet.</span>
            )}
          </div>
        </div>

        {/* Source URL History */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#8b5cf6', marginBottom: '14px' }}>
            <Link2 size={16} />
            <span>Source URL History ({sources.length})</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
            {sources.length > 0 ? (
              sources.map((src, i) => (
                <a
                  key={i}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#94a3b8', fontSize: '12px', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  • {src}
                </a>
              ))
            ) : (
              <span style={{ fontSize: '13px', color: '#64748b' }}>No sources recorded in memory.</span>
            )}
          </div>
        </div>
      </div>

      {/* Published Topics Continuity Timeline */}
      <div className="glass-panel" style={{ padding: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '15px', color: '#10b981', marginBottom: '16px' }}>
          <History size={16} />
          <span>Published Topics Continuity Chain</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {publishedTopics.length > 0 ? (
            publishedTopics.map((topic, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', paddingBottom: '12px', borderBottom: idx < publishedTopics.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none' }}>
                <span className="badge badge-emerald" style={{ marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  #{publishedTopics.length - idx}
                </span>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '14px' }}>
                    {topic.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Published: {new Date(topic.publishedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <span style={{ fontSize: '13px', color: '#64748b' }}>No publication history recorded.</span>
          )}
        </div>
      </div>
    </div>
  );
}
