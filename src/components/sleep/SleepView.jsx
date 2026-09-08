import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Moon,
  Bed,
  Sparkles,
  Clock,
  AlertCircle,
  TrendingDown,
  Sun,
  ShieldCheck
} from 'lucide-react';

export default function SleepView() {
  const { sleep } = useWellness();
  const [hoveredNight, setHoveredNight] = useState(null);

  const maxSleepHours = 9;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--secondary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          marginBottom: '6px'
        }}>
          <Moon size={16} />
          <span>Circadian & Recovery Tracking</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
          Sleep Tracking
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Understand your nightly restorative sleep cycles, duration trends, and schedule consistency.
        </p>
      </div>

      {/* Sleep Awareness Callout Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0
        }}>
          <Moon size={28} />
        </div>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--secondary)',
            textTransform: 'uppercase'
          }}>
            <span>Sleep Pattern Awareness</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '4px 0 4px' }}>
            "{sleep.awarenessMessage}"
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Establishing an 11:00 PM wind-down routine can help normalize restorative sleep cycles.
          </p>
        </div>
      </div>

      {/* 3 Overview Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px',
        marginBottom: '28px'
      }}>
        {/* Sleep Duration */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Last Night</span>
            <Clock size={18} color="var(--secondary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--secondary)' }}>
            {sleep.lastNightDuration}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Sleep Goal: {sleep.goalDuration}
          </p>
        </div>

        {/* Sleep Quality */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sleep Quality</span>
            <Sparkles size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
            {sleep.quality}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Sleep Efficiency: {sleep.efficiency}%
          </p>
        </div>

        {/* Target Consistency */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Schedule</span>
            <Bed size={18} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#8b5cf6' }}>
            11:15 PM
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Wake-up: 6:45 AM (7.5h in bed)
          </p>
        </div>
      </div>

      {/* Weekly Sleep Interactive Chart */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Weekly Sleep Duration
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Target range: 7–8 hours per night
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#06b6d4' }} />
              <span>Optimal (&ge; 7h)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#cbd5e1' }} />
              <span>Below Target</span>
            </div>
          </div>
        </div>

        {/* Weekly Sleep Bars */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '240px',
          padding: '16px 8px 0',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative'
        }}>
          {/* Target 7h guideline line */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${(7 / maxSleepHours) * 100}%`,
            borderTop: '1.5px dashed rgba(16, 185, 129, 0.5)',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <span style={{
              position: 'absolute',
              right: '8px',
              top: '-18px',
              fontSize: '0.7rem',
              color: 'var(--primary)',
              fontWeight: 700
            }}>
              7h Goal
            </span>
          </div>

          {sleep.weeklyData.map((dayData) => {
            const heightPct = Math.round((dayData.hours / maxSleepHours) * 100);
            const meetsGoal = dayData.hours >= 7.0;
            const isHovered = hoveredNight === dayData.day;

            return (
              <div
                key={dayData.day}
                onMouseEnter={() => setHoveredNight(dayData.day)}
                onMouseLeave={() => setHoveredNight(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: '-42px',
                    background: 'var(--text-main)',
                    color: 'var(--text-inverse)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-md)',
                    animation: 'fadeInUp 0.15s ease'
                  }}>
                    {dayData.day} – {dayData.duration} ({dayData.quality})
                  </div>
                )}

                <div style={{
                  width: '42px',
                  maxWidth: '70%',
                  height: `${heightPct}%`,
                  borderRadius: '8px 8px 0 0',
                  background: meetsGoal
                    ? 'linear-gradient(180deg, #06b6d4 0%, #0284c7 100%)'
                    : 'linear-gradient(180deg, #94a3b8 0%, #64748b 100%)',
                  boxShadow: isHovered ? '0 0 16px rgba(6, 182, 212, 0.4)' : 'none',
                  transform: isHovered ? 'scaleY(1.03)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />

                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: isHovered ? 700 : 500,
                  color: isHovered ? 'var(--secondary)' : 'var(--text-secondary)',
                  marginTop: '10px'
                }}>
                  {dayData.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sleep Stages Distribution */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
          Nightly Sleep Stages Breakdown
        </h4>

        {/* Multi-segment bar */}
        <div style={{
          display: 'flex',
          height: '24px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{ width: '27%', background: '#4338ca' }} title="Deep Sleep (27%)" />
          <div style={{ width: '21%', background: '#06b6d4' }} title="REM Sleep (21%)" />
          <div style={{ width: '52%', background: '#60a5fa' }} title="Light Sleep (52%)" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4338ca' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Deep Sleep</span>
            </div>
            <strong style={{ fontSize: '1.1rem' }}>{sleep.deepSleep}</strong>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>REM Sleep</span>
            </div>
            <strong style={{ fontSize: '1.1rem' }}>{sleep.remSleep}</strong>
          </div>

          <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#60a5fa' }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Light Sleep</span>
            </div>
            <strong style={{ fontSize: '1.1rem' }}>{sleep.lightSleep}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
