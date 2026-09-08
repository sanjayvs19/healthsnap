import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { X, Sparkles, Shield, User, Mail, Lock, ArrowRight } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser, setIsAuth, setActiveView, showToast } = useWellness();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('Alex Morgan');
  const [email, setEmail] = useState('alex.morgan@healthsnap.ai');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: name || 'Demo User',
      email: email || 'user@healthsnap.ai'
    }));
    setIsAuth(true);
    setActiveView('dashboard');
    onClose();
    showToast(`Welcome ${name || 'User'}! HealthSnap is ready.`);
  };

  const handleDemoUser = () => {
    setIsAuth(true);
    setActiveView('dashboard');
    onClose();
    showToast("Logged in as Demo User with full sample data!");
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '440px',
        padding: '32px',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            color: '#fff',
            boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)'
          }}>
            <Sparkles size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>
            {isSignUp ? 'Create HealthSnap Account' : 'Welcome to HealthSnap'}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your personal AI wellness awareness companion
          </p>
        </div>

        {/* Demo User Fast Track Button */}
        <button
          type="button"
          onClick={handleDemoUser}
          style={{
            width: '100%',
            padding: '12px 18px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            border: '1.5px dashed var(--primary)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--primary-dark)',
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)';
          }}
        >
          <Sparkles size={18} color="var(--primary)" />
          <span>Continue as Demo User (Instant)</span>
          <ArrowRight size={16} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          margin: '16px 0',
          color: 'var(--text-muted)',
          fontSize: '0.78rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
          <span>or sign in manually</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  required
                  style={{ width: '100%', padding: '11px 14px 11px 38px', fontSize: '0.9rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@healthsnap.ai"
                required
                style={{ width: '100%', padding: '11px 14px 11px 38px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '11px 14px 11px 38px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '6px' }}
          >
            {isSignUp ? 'Sign Up & Start Tracking' : 'Sign In to HealthSnap'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '10px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <Shield size={16} color="var(--primary)" />
          <span>Local simulated authentication • No real credentials sent</span>
        </div>
      </div>
    </div>
  );
}
