import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  HeartPulse,
  Bell,
  Sun,
  Moon,
  Home,
  User,
  Shield,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

export default function Header({ onMobileMenuToggle }) {
  const {
    user,
    notifications,
    theme,
    toggleTheme,
    activeView,
    setActiveView,
    setIsAuth,
    authMode
  } = useWellness();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header style={{
      height: '70px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      {/* Left: Brand Logo & Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={() => setActiveView('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
          }}>
            <HeartPulse size={22} strokeWidth={2.4} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: '800',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)'
            }}>
              Health<span style={{ color: 'var(--primary)' }}>Snap</span>
            </div>
            <div style={{
              fontSize: '0.68rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}>
              AI Wellness Companion
            </div>
          </div>
        </button>

        {/* Live Active Status Badge */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--primary)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }} className="desktop-status-pill">
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--primary)',
            animation: 'pulseGlow 2s infinite'
          }} />
          <span>Simulated Edge AI Active</span>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Landing Page Preview Switcher */}
        <button
          onClick={() => setActiveView('landing')}
          className="btn-secondary"
          style={{
            padding: '7px 14px',
            fontSize: '0.82rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          title="Return to Product Landing Page"
        >
          <Home size={15} />
          <span className="hide-on-mobile">Landing Page</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-main)',
            position: 'relative'
          }}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-main)',
              position: 'relative'
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                minWidth: '18px',
                height: '18px',
                borderRadius: '999px',
                background: '#ef4444',
                color: '#fff',
                fontSize: '0.68rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                border: '2px solid var(--bg-surface)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* User Profile Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveView('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              padding: '5px 12px 5px 6px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '999px'
            }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--primary)'
              }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.name.split(' ')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', color: authMode === 'backend' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                {authMode === 'backend' ? 'Verified Account' : 'Demo User'}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-status-pill {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
