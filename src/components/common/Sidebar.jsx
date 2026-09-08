import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  LayoutDashboard,
  Camera,
  Mic,
  FileEdit,
  Activity,
  Moon,
  Sparkles,
  Compass,
  LineChart,
  User,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar() {
  const { activeView, setActiveView, wellnessScore } = useWellness();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'snap', label: 'Snap Food', icon: Camera, badge: 'AI' },
    { id: 'speak', label: 'Speak', icon: Mic, badge: 'Voice' },
    { id: 'journal', label: 'Log Wellness', icon: FileEdit },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'insights', label: 'AI Insights', icon: Sparkles, badge: 'Core' },
    { id: 'guidance', label: 'Guidance', icon: Compass },
    { id: 'trends', label: 'Track & Trends', icon: LineChart },
    { id: 'profile', label: 'Profile & Safety', icon: User }
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      flexShrink: 0,
      minHeight: 'calc(100vh - 70px)'
    }}>
      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '8px 12px 4px'
        }}>
          Menu
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid transparent',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-subtle)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon
                  size={19}
                  color={isActive ? 'var(--primary)' : 'currentColor'}
                  strokeWidth={isActive ? 2.4 : 1.8}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                  color: isActive ? '#fff' : 'var(--text-muted)'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Widget */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Wellness Score
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '1px 6px',
            borderRadius: '999px'
          }}>
            {wellnessScore.score}/100
          </span>
        </div>

        <div style={{
          height: '6px',
          background: 'var(--bg-subtle)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${wellnessScore.score}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--primary) 0%, #06b6d4 100%)',
            borderRadius: '999px',
            transition: 'width 0.8s ease'
          }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={13} color="var(--primary)" />
          <span>Non-diagnostic awareness</span>
        </div>
      </div>
    </aside>
  );
}
