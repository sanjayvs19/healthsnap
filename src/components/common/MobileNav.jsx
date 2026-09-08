import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { LayoutDashboard, Camera, Mic, LineChart, User } from 'lucide-react';

export default function MobileNav() {
  const { activeView, setActiveView } = useWellness();

  const mobileItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'snap', label: 'Snap', icon: Camera },
    { id: 'speak', label: 'Speak', icon: Mic },
    { id: 'trends', label: 'Track', icon: LineChart },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      padding: '0 8px'
    }} className="mobile-only-nav">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

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
              padding: '6px 12px',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              position: 'relative'
            }}
          >
            {item.id === 'snap' ? (
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isActive ? 'var(--primary)' : 'var(--bg-subtle)',
                color: isActive ? '#fff' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive ? 'var(--shadow-glow-primary)' : 'none',
                marginTop: '-12px',
                border: '2px solid var(--bg-surface)'
              }}>
                <Icon size={20} strokeWidth={2.2} />
              </div>
            ) : (
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
            )}
            <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 600 : 400 }}>
              {item.label}
            </span>
          </button>
        );
      })}

      <style>{`
        @media (min-width: 900px) {
          .mobile-only-nav {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
