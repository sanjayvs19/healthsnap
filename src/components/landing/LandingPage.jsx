import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import {
  HeartPulse,
  Camera,
  Mic,
  BrainCircuit,
  LineChart,
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Play,
  Sun,
  Moon,
  Activity,
  Footprints
} from 'lucide-react';
import AuthModal from './AuthModal';

export default function LandingPage() {
  const { setActiveView, setIsAuth, theme, toggleTheme } = useWellness();
  const [authOpen, setAuthOpen] = useState(false);

  const handleLaunchApp = () => {
    setIsAuth(true);
    setActiveView('dashboard');
  };

  const workflowSteps = [
    {
      step: '01',
      title: 'Snap',
      icon: Camera,
      color: '#10b981',
      desc: 'Use your camera to capture food & visual wellness markers'
    },
    {
      step: '02',
      title: 'Speak',
      icon: Mic,
      color: '#06b6d4',
      desc: 'Describe how you feel or log symptoms naturally with your voice'
    },
    {
      step: '03',
      title: 'AI Analyze',
      icon: BrainCircuit,
      color: '#8b5cf6',
      desc: 'Multimodal AI merges food, voice, sleep & steps to spot patterns'
    },
    {
      step: '04',
      title: 'Track',
      icon: LineChart,
      color: '#3b82f6',
      desc: 'Monitor health score trends, recovery cycles, and habit consistency'
    },
    {
      step: '05',
      title: 'Guidance',
      icon: Compass,
      color: '#f59e0b',
      desc: 'Receive simple, personalized recommendations built for your routine'
    }
  ];

  const features = [
    {
      title: 'Snap Food & Nutrition',
      icon: Camera,
      tag: 'Computer Vision',
      desc: 'Instantly identify ingredients, portion balances, and macronutrient breakdowns simply by taking a quick photo of your plate.',
      targetView: 'snap',
      color: 'var(--primary)'
    },
    {
      title: 'Speak Your Wellness',
      icon: Mic,
      tag: 'Voice AI',
      desc: 'Feeling tired or noticed a headache? Just speak to HealthSnap. AI transcribes and organizes your observations into clear wellness signals.',
      targetView: 'speak',
      color: 'var(--secondary)'
    },
    {
      title: 'AI Pattern Synthesis',
      icon: BrainCircuit,
      tag: 'Core Intelligence',
      desc: 'Connect the dots between your sleep quality, meal choices, and activity levels. Identify what fuels your energy and what drains it.',
      targetView: 'insights',
      color: 'var(--accent-purple)'
    },
    {
      title: 'Holistic Trend Tracking',
      icon: LineChart,
      tag: 'Analytics',
      desc: 'Understand your wellness journey across 7-day, 30-day, and 3-month lenses with high-fidelity interactive progress metrics.',
      targetView: 'trends',
      color: 'var(--accent-blue)'
    },
    {
      title: 'Personalized Daily Guidance',
      icon: Compass,
      tag: 'Actionable Habits',
      desc: 'Receive non-clinical, practical recommendations: bedtime reminders, hydration milestones, and micro-walks tailored to your daily rhythms.',
      targetView: 'guidance',
      color: 'var(--accent-amber)'
    },
    {
      title: 'Edge AI & Strict Privacy',
      icon: ShieldCheck,
      tag: 'Data Safety',
      desc: 'Your wellness records belong to you. HealthSnap simulates on-device processing to ensure your health observations stay strictly private.',
      targetView: 'profile',
      color: 'var(--primary)'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', color: 'var(--text-main)' }}>
      {/* Landing Navigation Header */}
      <header style={{
        height: '76px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--primary) 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
              Health<span style={{ color: 'var(--primary)' }}>Snap</span>
            </h1>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI Wellness Companion
            </span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="#workflow" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Workflow
          </a>
          <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Features
          </a>
          <a href="#ethics" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
            Safety & Ethics
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              color: 'var(--text-main)'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
          </button>

          <button
            onClick={() => setAuthOpen(true)}
            className="btn-secondary"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            Sign In
          </button>

          <button
            onClick={handleLaunchApp}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.88rem' }}
          >
            <Sparkles size={16} />
            <span>Launch Demo</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '70px 24px 80px',
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '48px',
        alignItems: 'center'
      }}>
        {/* Left Hero Copy */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '20px'
          }}>
            <Sparkles size={16} />
            <span>AI-Powered Personal Wellness Prototype</span>
          </div>

          <h2 style={{
            fontSize: '3.4rem',
            lineHeight: 1.1,
            fontWeight: 800,
            marginBottom: '16px',
            letterSpacing: '-0.03em'
          }}>
            Health<span className="gradient-text">Snap</span>
            <span style={{ display: 'block', fontSize: '2.1rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '8px' }}>
              Your AI-powered wellness companion
            </span>
          </h2>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            maxWidth: '540px'
          }}>
            Understand your everyday wellness patterns, build healthier habits, and stay aware of changes over time with simple photo & voice capture.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
            <button
              onClick={handleLaunchApp}
              className="btn-primary"
              style={{ padding: '14px 30px', fontSize: '1.05rem' }}
            >
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#features"
              className="btn-secondary"
              style={{ padding: '14px 28px', fontSize: '1.05rem', textDecoration: 'none' }}
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Non-medical trust note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)'
          }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span>For wellness tracking and habit improvement only. Non-diagnostic.</span>
          </div>
        </div>

        {/* Right Interactive Dashboard Mockup Card */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: '-20px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 80%)',
            filter: 'blur(30px)',
            zIndex: 0
          }} />

          <div style={{
            position: 'relative',
            zIndex: 1,
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-xl)'
          }}>
            {/* Mockup Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid var(--divider)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Live Companion Preview
                </span>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Today's Wellness Status</h3>
              </div>
              <span className="badge-tag badge-emerald">Optimal 78/100</span>
            </div>

            {/* Score Showcase */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
              padding: '20px',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                border: '6px solid var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: 'var(--primary)',
                background: 'var(--bg-surface)'
              }}>
                78
              </div>
              <div>
                <h4 style={{ fontSize: '0.98rem', marginBottom: '2px' }}>Great Recovery & Consistency</h4>
                <p style={{ fontSize: '0.82rem', margin: 0 }}>
                  Sleep (6h 30m) & 6,420 steps logged. +4 pts higher than last week.
                </p>
              </div>
            </div>

            {/* Mini Quick Action Previews */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div
                onClick={() => { setIsAuth(true); setActiveView('snap'); }}
                style={{
                  padding: '14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px' }}>
                  <Camera size={20} color="var(--primary)" />
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Snap Food</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>AI Photo Scan</span>
                </div>
              </div>

              <div
                onClick={() => { setIsAuth(true); setActiveView('speak'); }}
                style={{
                  padding: '14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '10px' }}>
                  <Mic size={20} color="var(--secondary)" />
                </div>
                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Speak Log</strong>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Voice AI Cues</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BrainCircuit size={18} color="var(--accent-purple)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Pattern: Sleep quality correlates with 24% higher stamina
                </span>
              </div>
              <button
                onClick={handleLaunchApp}
                style={{ fontSize: '0.78rem', color: 'var(--accent-purple)', fontWeight: 700 }}
              >
                Explore ➔
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" style={{
        padding: '70px 24px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            The HealthSnap Architecture
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', marginBottom: '14px' }}>
            Snap ➔ Speak ➔ AI Analyze ➔ Track ➔ Guidance
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 48px' }}>
            A continuous wellness loop that translates everyday smartphone interactions into actionable healthy habits.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '20px'
          }}>
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  style={{
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '24px 20px',
                    textAlign: 'left',
                    position: 'relative',
                    transition: 'all var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = step.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: `${step.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: step.color
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      {step.step}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Cards Showcase */}
      <section id="features" style={{ padding: '80px 24px', maxWidth: '1240px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            All-In-One Companion
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '8px', marginBottom: '14px' }}>
            Built For Intuitive Daily Health Awareness
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Interact with your smartphone naturally and let simulated intelligence translate signals into lifestyle insights.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                onClick={() => {
                  setIsAuth(true);
                  setActiveView(feat.targetView);
                }}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: feat.color
                    }}>
                      <Icon size={22} />
                    </div>
                    <span className="badge-tag badge-emerald">{feat.tag}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {feat.desc}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  marginTop: '20px'
                }}>
                  <span>Try this feature</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety, Privacy & Ethical Non-Clinical Guarantee */}
      <section id="ethics" style={{
        padding: '60px 24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.06) 100%)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 6px 18px rgba(16, 185, 129, 0.35)'
          }}>
            <ShieldCheck size={30} />
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>
            Your Wellness. Your Data. Non-Clinical Ethics.
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            HealthSnap is strictly engineered for <strong>habit improvement, lifestyle tracking, and early self-awareness</strong>. We do not diagnose diseases, prescribe pharmaceutical regimens, or substitute for licensed medical practitioners. If you have serious health concerns, our app always recommends seeking prompt clinical evaluation.
          </p>

          <button
            onClick={handleLaunchApp}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <span>Launch HealthSnap Prototype</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '30px 24px',
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--divider)',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div>
          HealthSnap – AI Wellness Companion Prototype • College Project Demonstration
        </div>
        <div style={{ marginTop: '6px' }}>
          Powered by React, Simulated Edge AI & Modern Responsive Design • Health Awareness & Tracking Only
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}
