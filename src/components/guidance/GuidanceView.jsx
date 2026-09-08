import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Compass,
  Moon,
  Footprints,
  Salad,
  Droplets,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Flame
} from 'lucide-react';

export default function GuidanceView() {
  const { guidance, toggleGuidanceHabit, logQuickSteps, showToast, setActiveView } = useWellness();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Moon':
        return <Moon size={22} color="#06b6d4" />;
      case 'Footprints':
        return <Footprints size={22} color="var(--primary)" />;
      case 'Salad':
        return <Salad size={22} color="#8b5cf6" />;
      default:
        return <Droplets size={22} color="#3b82f6" />;
    }
  };

  const handleAction = (item) => {
    if (item.title === 'Stay Active') {
      logQuickSteps(1000);
      toggleGuidanceHabit(item.id);
    } else if (item.title === 'Stay Hydrated') {
      showToast("💧 +250ml water intake logged! Keep hydrated.");
      toggleGuidanceHabit(item.id);
    } else if (item.title === 'Balanced Meals') {
      setActiveView('snap');
    } else {
      toggleGuidanceHabit(item.id);
    }
  };

  const completedCount = guidance.filter(g => g.completed).length;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--accent-amber)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Compass size={16} />
          <span>Actionable Healthy Habits</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
          Personalized Guidance
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Receive simple, non-clinical recommendations based on your personal patterns.
        </p>
      </div>

      {/* Daily Progress Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--accent-amber)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}>
            <Sparkles size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              {completedCount} of {guidance.length} Guidance Goals Completed Today
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Micro-habits compound into significant long-term wellness improvements.
            </p>
          </div>
        </div>

        <div style={{
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--primary)',
          background: 'var(--bg-surface)',
          padding: '8px 16px',
          borderRadius: '999px',
          border: '1px solid var(--border-subtle)'
        }}>
          Current Streak: 5 Days Active 🔥
        </div>
      </div>

      {/* Recommended For You Cards Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '18px' }}>
          Recommended For You
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {guidance.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'var(--bg-surface)',
                border: item.completed ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                boxShadow: item.completed ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-normal)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'var(--bg-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getIcon(item.icon)}
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleGuidanceHabit(item.id)}
                    style={{ color: item.completed ? 'var(--primary)' : 'var(--text-muted)' }}
                    title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={24} color="var(--primary)" />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 16px 0' }}>
                  "{item.description}"
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid var(--divider)'
              }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Streak: {item.streak}
                </span>

                <button
                  onClick={() => handleAction(item)}
                  className={item.completed ? 'btn-secondary' : 'btn-primary'}
                  style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                >
                  {item.completed ? '✓ Completed' : item.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
