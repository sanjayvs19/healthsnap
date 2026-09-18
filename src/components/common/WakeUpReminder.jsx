import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import { Sun, Check, AlarmClock } from 'lucide-react';

export default function WakeUpReminder() {
  const { wakeReminderActive, wakeReminderTime, logWakeUp, snoozeWakeUp } = useWellness();

  if (!wakeReminderActive) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9998,
      maxWidth: '520px',
      width: 'calc(100% - 32px)',
      background: 'var(--bg-surface-elevated)',
      border: '2px solid var(--primary)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3), 0 0 30px rgba(16,185,129,0.25)',
      padding: '18px 22px',
      animation: 'fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff'
        }}>
          <Sun size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 2px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Good morning! It's {wakeReminderTime}
          </h4>
          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Time to wake up and start your day. Tap the button to mark yourself awake.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
        <button
          onClick={logWakeUp}
          className="btn-primary"
          style={{ flex: 1, padding: '11px', fontSize: '0.9rem' }}
        >
          <Check size={16} />
          <span>I'm Awake</span>
        </button>
        <button
          onClick={() => snoozeWakeUp(10)}
          className="btn-secondary"
          style={{ flex: 1, padding: '11px', fontSize: '0.9rem' }}
        >
          <AlarmClock size={16} />
          <span>Snooze 10 min</span>
        </button>
      </div>
    </div>
  );
}