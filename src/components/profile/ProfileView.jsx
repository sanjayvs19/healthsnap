import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  User,
  Mail,
  ShieldCheck,
  Download,
  Trash2,
  Moon,
  Sun,
  Bell,
  Cpu,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';

export default function ProfileView() {
  const {
    user,
    setUser,
    updateGoals,
    theme,
    toggleTheme,
    exportData,
    resetToDefaultData
  } = useWellness();

  const [confirmDelete, setConfirmDelete] = useState(false);

  const allAvailableGoals = [
    'Improve sleep',
    'Increase activity',
    'Improve food habits',
    'Maintain healthy routine'
  ];

  const handleGoalToggle = (goal) => {
    const exists = user.goals.includes(goal);
    const updated = exists
      ? user.goals.filter(g => g !== goal)
      : [...user.goals, goal];
    updateGoals(updated);
  };

  const toggleSetting = (key) => {
    setUser(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key]
      }
    }));
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <User size={16} />
          <span>Account & Security</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
          My Profile
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Manage your personal identity, wellness targets, and on-device AI privacy parameters.
        </p>
      </div>

      {/* Profile Info Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '24px'
      }}>
        <img
          src={user.avatar}
          alt={user.name}
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid var(--primary)',
            boxShadow: 'var(--shadow-glow-primary)'
          }}
        />
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
              {user.name}
            </h3>
            <span className="badge-tag badge-emerald">Active Demo User</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '4px 0 10px 0' }}>
            {user.email}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {user.goals.map((g) => (
              <span
                key={g}
                style={{
                  fontSize: '0.75rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: 'var(--primary-dark)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: 600
                }}
              >
                ✓ {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Wellness Goals & Settings */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Wellness Goals Card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
            Wellness Goals
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
            Select active priorities to tailor simulated AI guidance recommendations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allAvailableGoals.map((goal) => {
              const isChecked = user.goals.includes(goal);
              return (
                <div
                  key={goal}
                  onClick={() => handleGoalToggle(goal)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-subtle)',
                    border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {goal}
                  </span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    background: isChecked ? 'var(--primary)' : 'transparent',
                    border: isChecked ? 'none' : '2px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                  }}>
                    {isChecked && <CheckCircle2 size={16} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Settings & Toggles */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
            Settings & Preferences
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 18px 0' }}>
            Privacy parameters, notifications, and visual styling.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Dark Mode Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {theme === 'dark' ? <Moon size={18} color="var(--primary)" /> : <Sun size={18} color="#f59e0b" />}
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block' }}>Dark Mode Theme</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>High-contrast dark palette</span>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '999px',
                  background: theme === 'dark' ? 'var(--primary)' : '#cbd5e1',
                  position: 'relative',
                  padding: '2px',
                  transition: 'background 0.3s ease'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease'
                }} />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={18} color="var(--secondary)" />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block' }}>Notifications</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Daily wellness pattern reminders</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('notifications')}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '999px',
                  background: user.settings.notifications ? 'var(--primary)' : '#cbd5e1',
                  position: 'relative',
                  padding: '2px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transform: user.settings.notifications ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease'
                }} />
              </button>
            </div>

            {/* Edge AI On-Device Analysis */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Cpu size={18} color="var(--accent-purple)" />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, display: 'block' }}>On-Device AI Processing</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Keeps raw photos & audio local</span>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('edgeAi')}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '999px',
                  background: user.settings.edgeAi ? 'var(--primary)' : '#cbd5e1',
                  position: 'relative',
                  padding: '2px'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transform: user.settings.edgeAi ? 'translateX(20px)' : 'translateX(0)',
                  transition: 'transform 0.3s ease'
                }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 16: Dedicated Privacy & AI Safety Callout */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Your Wellness. Your Data.
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Strict ethical boundaries & non-diagnostic transparency
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
          "HealthSnap is designed for wellness awareness. Where possible, suitable AI processing can be performed on the device to reduce unnecessary data sharing."
        </p>

        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px'
        }}>
          <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#dc2626', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} />
            <span>Important Medical Disclaimer</span>
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            "HealthSnap does not diagnose diseases, prescribe medication, or replace professional medical advice. If you are experiencing concerning or persistent symptoms, please consult a qualified healthcare professional."
          </p>
        </div>

        <div style={{
          padding: '12px 16px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          <strong>Safety Protocol:</strong> If the system detects a potentially concerning pattern, the application will always advise: <em>"Consider speaking with a qualified healthcare professional if you are concerned about your symptoms."</em>
        </div>
      </div>

      {/* Data Management: Export & Delete */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px' }}>
          Data Portability & Controls
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
          Download your complete longitudinal wellness dataset or reset mock data to defaults.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <button
            onClick={exportData}
            className="btn-secondary"
            style={{ padding: '12px 20px', fontSize: '0.9rem' }}
          >
            <Download size={18} color="var(--primary)" />
            <span>Export My Wellness Data (JSON)</span>
          </button>

          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              <Trash2 size={18} />
              <span>Delete / Reset My Data</span>
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmDelete(false);
                }}
                style={{
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: '#ef4444',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.88rem'
                }}
              >
                Confirm Reset to Default Seed
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="btn-secondary"
                style={{ padding: '12px 14px', fontSize: '0.88rem' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
