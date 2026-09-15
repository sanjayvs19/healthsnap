import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import CircularProgress from '../common/CircularProgress';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Camera,
  Mic,
  Smile,
  Activity,
  Moon,
  Utensils,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Plus,
  AlertCircle
} from 'lucide-react';

export default function DashboardView() {
  const {
    user,
    wellnessScore,
    activity,
    sleep,
    foodLogs,
    journalEntries,
    setActiveView,
    authMode
  } = useWellness();

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = (user?.name || 'Friend').split(' ')[0];

  // Check if real user has any data today
  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysMeals = (foodLogs || []).filter(f => f.date === todayStr || !f.date);
  const todaysCheckins = (journalEntries || []).filter(j => j.date === todayStr || !j.date);
  const hasSteps = activity?.steps > 0;
  const hasSleep = Boolean(sleep?.lastNightDuration && sleep.lastNightDuration !== 'Not recorded');

  const hasAnyDataToday = hasSteps || hasSleep || todaysMeals.length > 0 || todaysCheckins.length > 0;

  // 5 Large Action Cards requested
  const actionCards = [
    {
      id: 'snap',
      icon: Camera,
      title: 'Snap Food',
      desc: 'Take a photo of your meal',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      target: 'snap'
    },
    {
      id: 'speak',
      icon: Mic,
      title: 'Talk to HealthSnap',
      desc: "Tell us how you're feeling",
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.1)',
      target: 'speak'
    },
    {
      id: 'journal',
      icon: Smile,
      title: 'Daily Check-in',
      desc: 'Record how you feel today',
      color: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)',
      target: 'journal'
    },
    {
      id: 'activity',
      icon: Activity,
      title: 'Activity',
      desc: 'Track your movement',
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
      target: 'activity'
    },
    {
      id: 'sleep',
      icon: Moon,
      title: 'Sleep',
      desc: 'Track your sleep',
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)',
      target: 'sleep'
    }
  ];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Greeting Banner */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          margin: '0 0 6px 0',
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>{getGreeting()}, {firstName}! 👋</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', margin: 0, fontWeight: 500 }}>
          Your Wellness Today
        </p>
      </div>

      {/* 5 Large Action Cards */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '14px'
        }}>
          Quick Actions
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '14px'
        }}>
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setActiveView(card.target)}
                className="action-card"
                style={{
                  minHeight: '130px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '18px 20px',
                  borderRadius: 'var(--radius-xl)'
                }}
              >
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: card.bg,
                  color: card.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px'
                }}>
                  <Icon size={22} strokeWidth={2.2} />
                </div>

                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                    {card.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today Progress Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}>
            Today's Progress
          </div>

          <button
            onClick={() => setActiveView('track')}
            style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <span>Open Track Hub</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* If user has no data today */}
        {!hasAnyDataToday && authMode === 'backend' ? (
          <div className="empty-state-card">
            <AlertCircle size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
              No data yet
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
              You haven't logged any movement, sleep, meals, or check-ins today. Start tracking to build your personal wellness profile.
            </p>
            <button
              onClick={() => setActiveView('track')}
              className="btn-primary"
              style={{ padding: '10px 22px' }}
            >
              <Plus size={16} />
              <span>Start Tracking</span>
            </button>
          </div>
        ) : (
          /* Grid of Today's actual metrics */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {/* Steps Card */}
            <div
              onClick={() => setActiveView('activity')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="var(--primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Steps</span>
                </div>
                {activity?.percentAchieved && (
                  <span className="badge-tag badge-emerald">{activity.percentAchieved}%</span>
                )}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>
                {activity?.steps ? activity.steps.toLocaleString() : 'No data yet'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Goal: {activity?.goal?.toLocaleString() || 8000} steps
              </div>
            </div>

            {/* Sleep Card */}
            <div
              onClick={() => setActiveView('sleep')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Moon size={18} color="#8b5cf6" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sleep</span>
                </div>
                {sleep?.quality && (
                  <span className="badge-tag badge-blue">{sleep.quality}</span>
                )}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>
                {sleep?.lastNightDuration || 'No data yet'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Target: 7–8 hours
              </div>
            </div>

            {/* Meals Card */}
            <div
              onClick={() => setActiveView('snap')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Utensils size={18} color="#f59e0b" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Meals</span>
                </div>
                <span className="badge-tag badge-amber">{todaysMeals.length} logged</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>
                {todaysMeals.length > 0 ? `${todaysMeals.length} Meals` : 'No data yet'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {todaysMeals[0] ? `Latest: ${todaysMeals[0].name}` : 'Tap to log your food'}
              </div>
            </div>

            {/* Daily Mood / Check-in */}
            <div
              onClick={() => setActiveView('journal')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smile size={18} color="#ec4899" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Feeling</span>
                </div>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0' }}>
                {todaysCheckins[0] ? `${todaysCheckins[0].feeling} ${todaysCheckins[0].feelingEmoji || ''}` : 'No data yet'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {todaysCheckins[0] ? (todaysCheckins[0].symptoms || 'Routine check-in') : 'Tap to record how you feel'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wellness Score Card */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CircularProgress
            score={wellnessScore?.score || 78}
            max={wellnessScore?.max || 100}
            size={90}
            strokeWidth={8}
            status={wellnessScore?.status || 'Good'}
          />
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Wellness Index
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '2px 0 4px 0' }}>
              {wellnessScore?.score || 78}/100 &bull; {wellnessScore?.status || 'Good'}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Synthesized from your activity, rest consistency, and logged entries.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('insights')}
          className="btn-outline-primary"
          style={{ padding: '10px 18px', fontSize: '0.86rem' }}
        >
          <Sparkles size={16} />
          <span>View AI Insights</span>
        </button>
      </div>
    </div>
  );
}
