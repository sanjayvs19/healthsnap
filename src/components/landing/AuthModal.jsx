import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { api, tokenStorage } from '../../services/api';
import { X, Sparkles, Shield, User, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { setUser, setIsAuth, setActiveView, showToast, setAuthMode, refreshDashboardFromBackend } = useWellness();
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'demo'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      let res;
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        res = await api.auth.signup({
          full_name: name.trim(),
          email: email.trim(),
          password
        });
      } else {
        res = await api.auth.login({
          email: email.trim(),
          password
        });
      }

      // Store JWT token
      tokenStorage.set(res.access_token);

      // Update state with real user from database
      setUser(prev => ({
        ...prev,
        id: res.user.id,
        name: res.user.full_name,
        email: res.user.email,
        avatar: res.user.avatar_url || prev.avatar,
        goals: res.user.goals?.length ? res.user.goals : prev.goals,
        settings: res.user.settings && Object.keys(res.user.settings).length ? res.user.settings : prev.settings
      }));

      setAuthMode('backend');
      setIsAuth(true);
      setActiveView('dashboard');
      onClose();

      if (refreshDashboardFromBackend) {
        await refreshDashboardFromBackend();
      }

      showToast(`Welcome ${res.user.full_name}! Connected to HealthSnap.`);
    } catch (err) {
      let msg = err.message || '';
      if (msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Axios') || msg.includes('connect')) {
        setErrorMessage("Unable to connect. Please try again.");
      } else {
        setErrorMessage(msg || "Unable to connect. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoUser = () => {
    setAuthMode('demo');
    setIsAuth(true);
    setActiveView('dashboard');
    onClose();
    showToast("Entered Demo Mode. Sample wellness data is active.");
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
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '440px',
        padding: '28px',
        boxShadow: 'var(--shadow-xl)',
        position: 'relative',
        animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
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

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
          }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px 0' }}>
            HealthSnap
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
            Your personal wellness companion
          </p>
        </div>

        {/* Clear 3 Mode Selectors */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'login' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'login' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'signup' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'signup' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: mode === 'signup' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('demo'); setErrorMessage(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: mode === 'demo' ? 'var(--bg-surface)' : 'transparent',
              color: mode === 'demo' ? 'var(--primary)' : 'var(--text-secondary)',
              boxShadow: mode === 'demo' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Demo Mode
          </button>
        </div>

        {/* Demo Mode View */}
        {mode === 'demo' ? (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1.5px dashed var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px 20px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
              Try Demo Mode
            </h4>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
              Explore HealthSnap without creating an account. Explore mock food photo recognition, voice analysis, and reports instantly.
            </p>
            <button
              onClick={handleDemoUser}
              className="btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              <span>Launch Demo Mode</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* Login & Signup Form */
          <>
            {errorMessage && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                color: '#ef4444'
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'signup' && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      required={mode === 'signup'}
                      disabled={isLoading}
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
                  <Mail size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={isLoading}
                    style={{ width: '100%', padding: '11px 14px 11px 38px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    style={{ width: '100%', padding: '11px 14px 11px 38px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                )}
              </button>
            </form>
          </>
        )}

        <div style={{
          marginTop: '18px',
          paddingTop: '12px',
          borderTop: '1px solid var(--divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.74rem',
          color: 'var(--text-muted)'
        }}>
          <Shield size={14} color="var(--primary)" />
          <span>Your personal wellness data is encrypted and private</span>
        </div>
      </div>
    </div>
  );
}
