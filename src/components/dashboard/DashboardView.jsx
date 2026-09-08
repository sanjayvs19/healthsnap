import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import CircularProgress from '../common/CircularProgress';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Activity as ActivityIcon,
  Moon,
  Utensils,
  Smile,
  Camera,
  Mic,
  FileEdit,
  LineChart,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function DashboardView() {
  const {
    user,
    wellnessScore,
    activity,
    sleep,
    foodLogs,
    journalEntries,
    setActiveView
  } = useWellness();

  const quickActions = [
    {
      id: 'snap',
      title: '📸 Snap Food',
      subtitle: 'Analyze your meal',
      desc: 'Capture food photo for instant nutrient awareness',
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      target: 'snap'
    },
    {
      id: 'speak',
      title: '🎤 Speak',
      subtitle: 'Tell HealthSnap how you feel',
      desc: 'Describe symptoms or state using voice AI',
      color: '#06b6d4',
      bgGlow: 'rgba(6, 182, 212, 0.15)',
      target: 'speak'
    },
    {
      id: 'journal',
      title: '📝 Log Wellness',
      subtitle: 'Record symptoms or habits',
      desc: 'Track energy levels, notes, and duration',
      color: '#8b5cf6',
      bgGlow: 'rgba(139, 92, 246, 0.15)',
      target: 'journal'
    },
    {
      id: 'trends',
      title: '📊 View Progress',
      subtitle: 'See your wellness trends',
      desc: 'Explore 7-day, 30-day, and 3-month curves',
      color: '#3b82f6',
      bgGlow: 'rgba(59, 130, 246, 0.15)',
      target: 'trends'
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Non-clinical medical disclaimer */}
      <DisclaimerBanner compact={true} />

      {/* Greeting Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '4px',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Good morning, {user.name.split(' ')[0]}! 👋</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
            Let's check your wellness today and review your continuous signals.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          padding: '8px 16px',
          borderRadius: '999px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <Sparkles size={16} color="var(--primary)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
            {journalEntries.length + foodLogs.length} signals integrated today
          </span>
        </div>
      </div>

      {/* Main Grid: Wellness Score Hero & 4 Core Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Today's Wellness Score Hero Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, var(--primary) 0%, #06b6d4 100%)'
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Core Gauge
            </span>
            <span style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <TrendingUp size={14} color="var(--primary)" /> {wellnessScore.trend}
            </span>
          </div>

          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
            Today's Wellness Score
          </h3>

          <CircularProgress
            score={wellnessScore.score}
            max={wellnessScore.max}
            size={180}
            strokeWidth={12}
            status={wellnessScore.status}
          />

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginTop: '20px',
            marginBottom: '16px',
            lineHeight: 1.5
          }}>
            Overall index calculated from your activity, rest consistency, meal logs, and daily voice reflections.
          </p>

          <button
            onClick={() => setActiveView('insights')}
            className="btn-outline-primary"
            style={{ width: '100%', fontSize: '0.86rem', padding: '10px' }}
          >
            <Sparkles size={16} />
            <span>View AI Signal Breakdown</span>
          </button>
        </div>

        {/* 4 Core Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          {/* Activity Card */}
          <div
            onClick={() => setActiveView('activity')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <ActivityIcon size={20} />
              </div>
              <span className="badge-tag badge-emerald">{activity.percentAchieved}%</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Activity</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 4px' }}>
              {activity.steps.toLocaleString()} steps
            </h4>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Goal: {activity.goal.toLocaleString()} • {activity.distanceKm} km
            </div>
          </div>

          {/* Sleep Card */}
          <div
            onClick={() => setActiveView('sleep')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--secondary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)'
              }}>
                <Moon size={20} />
              </div>
              <span className="badge-tag badge-blue">{sleep.quality}</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sleep</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 4px' }}>
              {sleep.lastNightDuration}
            </h4>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Target: {sleep.goalDuration}
            </div>
          </div>

          {/* Food Card */}
          <div
            onClick={() => setActiveView('snap')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-purple)'
              }}>
                <Utensils size={20} />
              </div>
              <span className="badge-tag badge-emerald">Balanced</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Food</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 4px' }}>
              Balanced
            </h4>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {foodLogs.length} meals logged today
            </div>
          </div>

          {/* Wellness Card */}
          <div
            onClick={() => setActiveView('journal')}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#f59e0b'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-amber)'
              }}>
                <Smile size={20} />
              </div>
              <span className="badge-tag badge-amber">Good</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Wellness</span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 4px' }}>
              Good
            </h4>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Based on recent inputs
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Quick Actions (Four Large Interactive Cards) */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Quick Actions</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
              Input daily signals or review your progress with a single tap
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {quickActions.map((action) => (
            <div
              key={action.id}
              onClick={() => setActiveView(action.target)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '22px',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = action.color;
                e.currentTarget.style.boxShadow = `0 10px 20px -5px ${action.bgGlow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '4px' }}>
                  {action.title}
                </h4>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  "{action.subtitle}"
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {action.desc}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: action.color,
                fontWeight: 600,
                fontSize: '0.82rem',
                marginTop: '18px'
              }}>
                <span>Open {action.target}</span>
                <ArrowRight size={15} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Wellness Observation of the Day & Live Synthesizer Hook */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '750px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--primary)',
              textTransform: 'uppercase'
            }}>
              <span>Live AI Pattern Observation</span>
              <span>•</span>
              <span>Sleep + Activity</span>
            </div>
            <h4 style={{ fontSize: '1.05rem', margin: '4px 0 4px' }}>
              Your activity has been lower on days when your sleep duration is below your usual level.
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              On nights under 6.5 hours of rest, next-day active minutes drop by 22%. Consider winding down 30 minutes earlier.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('insights')}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          <span>Explore All Patterns</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
