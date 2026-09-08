import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Sparkles,
  BrainCircuit,
  Camera,
  Mic,
  Activity,
  Moon,
  FileEdit,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Info,
  CheckCircle2,
  ChevronRight,
  Zap
} from 'lucide-react';

export default function AIInsightsView() {
  const { patterns, setActiveView, showToast } = useWellness();

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [activePatternId, setActivePatternId] = useState(patterns[0]?.id);

  const inputSignals = [
    { id: 'food', name: 'Food Vision', icon: Camera, color: '#10b981', sample: 'High protein + greens' },
    { id: 'voice', name: 'Voice Cues', icon: Mic, color: '#06b6d4', sample: 'Tired tone, 2 logs' },
    { id: 'activity', name: 'Movement', icon: Activity, color: '#3b82f6', sample: '6,420 steps today' },
    { id: 'sleep', name: 'Circadian', icon: Moon, color: '#8b5cf6', sample: '6h 30m avg duration' },
    { id: 'journal', name: 'Subjective', icon: FileEdit, color: '#f59e0b', sample: 'Afternoon screen strain' }
  ];

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      showToast("🧠 Live multimodal signals re-synthesized into 4 patterns!");
    }, 1800);
  };

  const selectedPattern = patterns.find(p => p.id === activePatternId) || patterns[0];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent-purple)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            <BrainCircuit size={16} />
            <span>Multimodal Signal Synthesizer</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
            AI Wellness Insights
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
            HealthSnap combines your recent wellness signals to identify patterns.
          </p>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={isSynthesizing}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
          }}
        >
          <RefreshCw size={16} className={isSynthesizing ? 'animate-spin' : ''} />
          <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize Live Signals'}</span>
        </button>
      </div>

      {/* Visual AI Analysis Section: Inputs connecting to AI Pattern Analysis */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 24px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
            Cross-Signal Correlation Architecture
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '4px 0 0' }}>
            5 Continuous Input Streams Converging into HealthSnap AI
          </h3>
        </div>

        {/* Input Signals Nodes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px',
          marginBottom: '28px'
        }}>
          {inputSignals.map((sig) => {
            const Icon = sig.icon;
            return (
              <div
                key={sig.id}
                style={{
                  background: 'var(--bg-app)',
                  border: `1px solid ${sig.color}40`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: `${sig.color}15`,
                  color: sig.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px'
                }}>
                  <Icon size={20} />
                </div>
                <strong style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-main)' }}>
                  {sig.name}
                </strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {sig.sample}
                </span>
              </div>
            );
          })}
        </div>

        {/* Convergence Central AI Engine Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.12) 50%, rgba(16, 185, 129, 0.12) 100%)',
          border: '1.5px solid rgba(139, 92, 246, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
              animation: isSynthesizing ? 'pulseGlow 1s infinite' : 'none'
            }}>
              <BrainCircuit size={28} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                AI Pattern Analysis
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Multi-factor cross-correlation active: {patterns.length} lifestyle patterns detected this week.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-tag badge-emerald">Real-Time Ingestion</span>
            <span className="badge-tag badge-blue">Non-Diagnostic</span>
          </div>
        </div>
      </div>

      {/* Detected Patterns Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Detected Wellness Patterns</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Actionable lifestyle observations derived from multi-signal convergence
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {patterns.map((pattern, idx) => {
            const isSelected = pattern.id === selectedPattern.id;

            return (
              <div
                key={pattern.id}
                onClick={() => setActivePatternId(pattern.id)}
                style={{
                  background: 'var(--bg-surface)',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '22px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{pattern.signalIcons.join(' + ')}</span>
                      <span className="badge-tag badge-emerald">
                        Pattern {idx + 1}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Correlation: {pattern.correlation}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.08rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>
                    {pattern.title}
                  </h4>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                    "{pattern.summary}"
                  </p>

                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-subtle)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    lineHeight: 1.45
                  }}>
                    {pattern.detail}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--divider)'
                }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {pattern.tags.map((t) => (
                      <span key={t} style={{
                        fontSize: '0.7rem',
                        background: 'var(--bg-app)',
                        border: '1px solid var(--border-subtle)',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        color: 'var(--text-secondary)'
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveView('guidance');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--primary)'
                    }}
                  >
                    <span>Action ➔</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
