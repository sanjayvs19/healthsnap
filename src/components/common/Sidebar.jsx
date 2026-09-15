import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  Home,
  ClipboardList,
  BarChart3,
  DownloadCloud,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { activeView, setActiveView, wellnessScore, authMode } = useWellness();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'track', label: 'Track', icon: ClipboardList },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: DownloadCloud },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Map sub-views back to active main category
  const getActiveTab = () => {
    if (['dashboard'].includes(activeView)) return 'dashboard';
    if (['track', 'snap', 'speak', 'journal', 'activity', 'sleep'].includes(activeView)) return 'track';
    if (['progress', 'trends', 'insights'].includes(activeView)) return 'progress';
    if (['reports'].includes(activeView)) return 'reports';
    if (['profile'].includes(activeView)) return 'profile';
    return 'dashboard';
  };

  const currentTab = getActiveTab();

  return (
    <aside style={{
      width: '250px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0,
      minHeight: 'calc(100vh - 70px)'
    }}>
      {/* Navigation List */}
      <div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 14px 12px'
        }}>
          Navigation
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.98rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#ffffff' : 'var(--text-main)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                  border: 'none',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--bg-subtle)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
              >
                <Icon
                  size={20}
                  color={isActive ? '#ffffff' : 'currentColor'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Widget: Clean, un-cluttered */}
      <div style={{
        padding: '16px',
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Session
          </span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            color: authMode === 'backend' ? 'var(--primary)' : '#d97706',
            background: authMode === 'backend' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            padding: '2px 8px',
            borderRadius: '999px'
          }}>
            {authMode === 'backend' ? 'Real Account' : 'Demo Mode'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={14} color="var(--primary)" />
          <span>General wellness only</span>
        </div>
      </div>
    </aside>
  );
}
