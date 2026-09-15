import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Moon,
  Utensils,
  Sparkles,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export default function ProgressView() {
  const { wellnessScore, activity, sleep, foodLogs } = useWellness();
  const [period, setPeriod] = useState('week'); // 'today', 'week', 'month'

  const weeklySteps = activity?.weeklyData || [
    { day: "Mon", steps: 7800 },
    { day: "Tue", steps: 6200 },
    { day: "Wed", steps: 8400 },
    { day: "Thu", steps: 5900 },
    { day: "Fri", steps: 7100 },
    { day: "Sat", steps: 9200 },
    { day: "Sun", steps: 6420 }
  ];

  const weeklySleep = sleep?.weeklyData || [
    { day: "Mon", hours: 7.2 },
    { day: "Tue", hours: 6.7 },
    { day: "Wed", hours: 7.5 },
    { day: "Thu", hours: 6.3 },
    { day: "Fri", hours: 6.8 },
    { day: "Sat", hours: 8.0 },
    { day: "Sun", hours: 6.5 }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
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
            <BarChart3 size={16} />
            <span>Progress & Habits</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            Wellness Progress
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Simple, clear views of your habit trajectory over time.
          </p>
        </div>

        {/* Period Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-surface)', padding: '4px', borderRadius: '999px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setPeriod('today')}
            className={`filter-pill ${period === 'today' ? 'active' : ''}`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod('week')}
            className={`filter-pill ${period === 'week' ? 'active' : ''}`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`filter-pill ${period === 'month' ? 'active' : ''}`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Grid of Clean Visual Progress Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* 1. Activity Chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Activity Movement</h3>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
              {activity?.steps ? activity.steps.toLocaleString() : 0} steps today
            </span>
          </div>

          {/* Simple Clean Bar Chart */}
          <div style={{ height: '110px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '10px 0 6px' }}>
            {weeklySteps.map((s, idx) => {
              const heightPct = Math.min(100, Math.max(12, (s.steps / 10000) * 100));
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '28px',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, var(--primary) 0%, #06b6d4 100%)',
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>{s.day}</span>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '14px 0 0 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            💬 <em>"Your activity was higher this week. Most active on Wednesday and Saturday."</em>
          </p>
        </div>

        {/* 2. Sleep Consistency Chart */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Moon size={18} color="#8b5cf6" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Sleep Duration</h3>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#8b5cf6' }}>
              {sleep?.lastNightDuration || '6h 30m'}
            </span>
          </div>

          {/* Simple Clean Sleep Bar Chart */}
          <div style={{ height: '110px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '10px 0 6px' }}>
            {weeklySleep.map((s, idx) => {
              const heightPct = Math.min(100, Math.max(12, (s.hours / 9) * 100));
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '28px',
                    height: `${heightPct}%`,
                    background: 'linear-gradient(180deg, #8b5cf6 0%, #3b82f6 100%)',
                    borderRadius: '4px 4px 0 0'
                  }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '6px' }}>{s.day}</span>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '14px 0 0 0', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            💬 <em>"Your sleep was most consistent over the weekend. Target 7 hours on weeknights."</em>
          </p>
        </div>

        {/* 3. Food Tracking Consistency */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Utensils size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Food Tracking</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>
                {(foodLogs || []).length} Meals
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Recorded with nutrient breakdowns</span>
            </div>
            <span className="badge-tag badge-amber">Healthy Protein Habit</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            💬 <em>"You consistently record balanced morning meals. Consider tracking afternoon snacks."</em>
          </p>
        </div>

        {/* 4. Tracking Consistency & Wellness */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Tracking Consistency</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                6 of 7 Days
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Continuous awareness streak</span>
            </div>
            <span className="badge-tag badge-emerald">86% Consistency</span>
          </div>

          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
            💬 <em>"Great consistency this week! Habit tracking is strongest in morning hours."</em>
          </p>
        </div>
      </div>
    </div>
  );
}
