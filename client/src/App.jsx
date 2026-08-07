import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PostCard from './components/PostCard';
import EditorialLog from './components/EditorialLog';
import MemoryPanel from './components/MemoryPanel';
import InitAgentModal from './components/InitAgentModal';
import { Rss, Sliders, Database, Copy, Check, Sparkles } from 'lucide-react';

export default function App() {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [posts, setPosts] = useState([]);
  const [rejections, setRejections] = useState([]);
  const [memory, setMemory] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Fetch agent list
  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.agents && data.agents.length > 0) {
        setAgents(data.agents);
        if (!selectedAgentId) {
          setSelectedAgentId(data.agents[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  // Fetch feed, rejections, memory for active agent
  const fetchAgentData = async (agentId) => {
    if (!agentId) return;
    try {
      // 1. Fetch Feed (GET /api/agent/feed?agentId=...)
      const feedRes = await fetch(`/api/agent/feed?agentId=${agentId}`);
      const feedData = await feedRes.json();
      setPosts(feedData.posts || []);

      // 2. Fetch Rejections
      const rejRes = await fetch(`/api/agent/rejections?agentId=${agentId}`);
      const rejData = await rejRes.json();
      setRejections(rejData.rejections || []);

      // 3. Fetch Memory
      const memRes = await fetch(`/api/agent/memory?agentId=${agentId}`);
      const memData = await memRes.json();
      setMemory(memData.memory || null);
    } catch (err) {
      console.error('Error fetching agent feed/data:', err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (selectedAgentId) {
      fetchAgentData(selectedAgentId);

      // Auto poll every 10 seconds to show live posts appearing over time
      const timer = setInterval(() => {
        fetchAgentData(selectedAgentId);
      }, 10000);

      return () => clearInterval(timer);
    }
  }, [selectedAgentId]);

  // Handle agent initialization (POST /api/agent/init)
  const handleInitAgent = async (personaPayload, intervalMinutes) => {
    setLoading(true);
    try {
      const res = await fetch('/api/agent/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: personaPayload,
          intervalMinutes
        })
      });
      const data = await res.json();

      if (data.agentId) {
        await fetchAgents();
        setSelectedAgentId(data.agentId);
        await fetchAgentData(data.agentId);
      }
    } catch (err) {
      console.error('Failed to init agent:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle manual trigger cycle
  const handleTriggerCycle = async () => {
    if (!selectedAgentId) return;
    setLoading(true);
    try {
      await fetch('/api/agent/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: selectedAgentId })
      });
      await fetchAgentData(selectedAgentId);
    } catch (err) {
      console.error('Error triggering cycle:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentAgent = agents.find(a => a.id === selectedAgentId);

  const copyAgentId = () => {
    if (selectedAgentId) {
      navigator.clipboard.writeText(selectedAgentId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelectAgent={setSelectedAgentId}
        onOpenInitModal={() => setIsInitModalOpen(true)}
        onTriggerCycle={handleTriggerCycle}
        loading={loading}
      />

      <main style={{ flex: 1, maxWidth: '1000px', width: '100%', margin: '0 auto', padding: '32px 20px' }}>
        {/* Agent Info Banner */}
        {currentAgent ? (
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>
                    {currentAgent.persona.name}
                  </h2>
                  <span className="badge badge-cyan">{currentAgent.persona.domain}</span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
                  Autonomous Publishing Active • Interval: {Math.round((currentAgent.intervalMs || 120000) / 60000)} minute(s)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Evaluator Endpoint Helper */}
                <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.08)', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>GET /api/agent/feed?agentId={selectedAgentId}</span>
                  <button onClick={copyAgentId} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                    {copiedId ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', marginBottom: '28px' }}>
            <Sparkles size={36} color="#06b6d4" style={{ marginBottom: '12px' }} />
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>No Persona Agent Initialized</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '6px', marginBottom: '20px' }}>
              Initialize an autonomous AI persona agent to begin live topic discovery, editorial judgment, and continuous publishing over time.
            </p>
            <button onClick={() => setIsInitModalOpen(true)} className="btn-primary">
              Initialize Autonomous Agent
            </button>
          </div>
        )}

        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
          <button
            onClick={() => setActiveTab('feed')}
            style={{
              background: activeTab === 'feed' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
              border: '1px solid ' + (activeTab === 'feed' ? 'rgba(6, 182, 212, 0.3)' : 'transparent'),
              color: activeTab === 'feed' ? '#06b6d4' : '#94a3b8',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Rss size={16} />
            <span>Autonomous Feed ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rejections')}
            style={{
              background: activeTab === 'rejections' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
              border: '1px solid ' + (activeTab === 'rejections' ? 'rgba(245, 158, 11, 0.3)' : 'transparent'),
              color: activeTab === 'rejections' ? '#f59e0b' : '#94a3b8',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Sliders size={16} />
            <span>Editorial Board & Rejections ({rejections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            style={{
              background: activeTab === 'memory' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              border: '1px solid ' + (activeTab === 'memory' ? 'rgba(139, 92, 246, 0.3)' : 'transparent'),
              color: activeTab === 'memory' ? '#c084fc' : '#94a3b8',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Database size={16} />
            <span>Agent Memory & Telemetry</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'feed' && (
          <div>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} persona={currentAgent?.persona} />
              ))
            ) : (
              <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                <Rss size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>Feed Empty</h3>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>
                  The agent is running background topic discovery. Posts will appear automatically.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rejections' && (
          <EditorialLog rejections={rejections} />
        )}

        {activeTab === 'memory' && (
          <MemoryPanel memory={memory} persona={currentAgent?.persona} />
        )}
      </main>

      <InitAgentModal
        isOpen={isInitModalOpen}
        onClose={() => setIsInitModalOpen(false)}
        onInitAgent={handleInitAgent}
      />
    </div>
  );
}
