import React, { useRef, useEffect } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Bell, BellRing, Lightbulb, Camera, FileText, CheckCheck, X } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveView } = useWellness();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'pattern':
        return <BellRing size={18} color="var(--primary)" />;
      case 'suggestion':
        return <Lightbulb size={18} color="var(--accent-amber)" />;
      case 'food':
        return <Camera size={18} color="var(--secondary)" />;
      default:
        return <FileText size={18} color="var(--accent-blue)" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.type === 'pattern') {
      setActiveView('insights');
    } else if (notif.type === 'suggestion') {
      setActiveView('activity');
    } else if (notif.type === 'food') {
      setActiveView('snap');
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: '10px',
        width: '360px',
        maxWidth: '92vw',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        zIndex: 100,
        overflow: 'hidden',
        animation: 'fadeInUp 0.2s ease-out'
      }}
    >
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--divider)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Notifications</h4>
          {unreadCount > 0 && (
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'var(--primary)',
              color: '#fff',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {unreadCount} new
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              style={{
                fontSize: '0.75rem',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CheckCheck size={14} /> Read all
            </button>
          )}
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '30px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No new notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              style={{
                padding: '12px 18px',
                borderBottom: '1px solid var(--divider)',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                cursor: 'pointer',
                background: notif.read ? 'transparent' : 'rgba(16, 185, 129, 0.05)',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-subtle)'}
              onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(16, 185, 129, 0.05)'}
            >
              <div style={{
                background: 'var(--bg-subtle)',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '2px'
              }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {notif.title}
                  </span>
                  {!notif.read && (
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} />
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  {notif.message}
                </p>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  {notif.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{
        padding: '10px 18px',
        background: 'var(--bg-subtle)',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        HealthSnap AI Wellness Assistant • Non-Clinical Notifications
      </div>
    </div>
  );
}
