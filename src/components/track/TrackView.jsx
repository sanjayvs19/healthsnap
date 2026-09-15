import React from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  ClipboardList,
  Utensils,
  Camera,
  Activity,
  Moon,
  Smile,
  Mic,
  ArrowRight,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';

export default function TrackView() {
  const { setActiveView, activity, sleep, foodLogs, journalEntries } = useWellness();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysMeals = (foodLogs || []).filter(f => f.date === todayStr || !f.date);
  const latestMeal = todaysMeals[0] || (foodLogs && foodLogs[0]);
  const latestCheckin = journalEntries && journalEntries[0];

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
          <ClipboardList size={16} />
          <span>Daily Wellness Logging</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.02em' }}>
          Track Your Routine
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Simple and intuitive tools to record your meals, movements, sleep, and daily feelings.
        </p>
      </div>

      {/* 4 Core Tracking Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* 1. Food / Nutrition */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}>
                <Camera size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Food & Meals</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Photo or manual scan</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Take a photo of your plate or pick a meal to analyze balanced nutrients, protein, and calories.
            </p>

            {/* Clear Result */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Latest Log</span>
              {latestMeal ? (
                <div style={{ marginTop: '4px', fontWeight: 600 }}>
                  🍽️ {latestMeal.name} &bull; {latestMeal.calories} kcal
                </div>
              ) : (
                <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>No meals logged yet today</div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveView('snap')}
            className="btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
          >
            <Camera size={18} />
            <span>Snap or Log Meal</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 2. Activity / Steps */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--secondary)'
              }}>
                <Activity size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Activity & Movement</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily steps & walking</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Keep track of your physical movement, active minutes, and step targets to stay energized.
            </p>

            {/* Clear Result */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Today's Progress</span>
              <div style={{ marginTop: '4px', fontWeight: 600 }}>
                🏃 {activity?.steps ? activity.steps.toLocaleString() : 0} / {activity?.goal?.toLocaleString() || 8000} steps ({activity?.percentAchieved || 0}%)
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('activity')}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
          >
            <Activity size={18} color="var(--primary)" />
            <span>View & Log Movement</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 3. Sleep & Rest */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6'
              }}>
                <Moon size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Sleep & Rest</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Circadian recovery</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Review your nightly restorative rest cycles and consistency to optimize daytime alertness.
            </p>

            {/* Clear Result */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Last Night</span>
              <div style={{ marginTop: '4px', fontWeight: 600 }}>
                😴 {sleep?.lastNightDuration || 'Not recorded'} &bull; Quality: {sleep?.quality || 'Good'}
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('sleep')}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
          >
            <Moon size={18} color="#8b5cf6" />
            <span>Track Sleep</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* 4. Daily Check-in */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706'
              }}>
                <Smile size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Daily Check-in</h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Symptoms & feelings</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Speak or write down how you feel today, noting energy levels, screen fatigue, or minor symptoms.
            </p>

            {/* Clear Result */}
            <div style={{
              padding: '12px 14px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '18px'
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>Today's Check-in</span>
              {latestCheckin ? (
                <div style={{ marginTop: '4px', fontWeight: 600 }}>
                  Feeling: {latestCheckin.feeling} {latestCheckin.feelingEmoji || ''} &bull; {latestCheckin.symptoms || 'Routine check-in'}
                </div>
              ) : (
                <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>No check-in completed today</div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveView('journal')}
            className="btn-secondary"
            style={{ width: '100%', padding: '12px', fontSize: '0.92rem' }}
          >
            <Smile size={18} color="#d97706" />
            <span>Start Daily Check-in</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
