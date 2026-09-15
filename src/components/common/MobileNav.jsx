import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Home, ClipboardList, BarChart3, DownloadCloud, User } from 'lucide-react';

export default function MobileNav() {
  const { activeView, setActiveView } = useWellness();

  const mobileItems = [
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
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '68px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      padding: '0 4px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
    }} className="mobile-only-nav">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '8px 10px',
              minWidth: '56px',
              minHeight: '48px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: isActive ? 700 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-secondary)'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @media (min-width: 901px) {
          .mobile-only-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
