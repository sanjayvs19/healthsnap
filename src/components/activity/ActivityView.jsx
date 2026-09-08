import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Activity,
  Footprints,
  Flame,
  Clock,
  Compass,
  TrendingUp,
  Plus,
  CheckCircle2,
  Award
} from 'lucide-react';

export default function ActivityView() {
  const { activity, logQuickSteps } = useWellness();
  const [hoveredDay, setHoveredDay] = useState(null);

  const maxStepsInWeek = Math.max(...activity.weeklyData.map(d => d.steps), 10000);

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
          <Activity size={16} />
          <span>Movement & Aerobic Signals</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
          Activity Tracking
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Monitor your steps, distance, active minutes, and weekly movement consistency.
        </p>
      </div>

      {/* Goal Progress Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 18px rgba(16, 185, 129, 0.4)'
          }}>
            <Footprints size={32} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-tag badge-emerald">{activity.percentAchieved}% Completed</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Daily Target: {activity.goal.toLocaleString()}</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '4px 0 2px' }}>
              You're {activity.percentAchieved}% toward your daily activity goal.
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              Just {(activity.goal - activity.steps > 0 ? activity.goal - activity.steps : 0).toLocaleString()} more steps to achieve your target today!
            </p>
          </div>
        </div>

        {/* Quick simulator logger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => logQuickSteps(500)}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            +500 Steps
          </button>
          <button
            onClick={() => logQuickSteps(1000)}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <Plus size={15} />
            <span>+1,000 Steps (Walk)</span>
          </button>
        </div>
      </div>

      {/* 4 Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Steps */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Steps</span>
            <Footprints size={18} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
            {activity.steps.toLocaleString()}
          </h3>
          <div style={{
            height: '6px',
            background: 'var(--bg-subtle)',
            borderRadius: '999px',
            margin: '12px 0 6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (activity.steps / activity.goal) * 100)}%`,
              height: '100%',
              background: 'var(--primary)',
              borderRadius: '999px',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Daily Goal: {activity.goal.toLocaleString()} steps</span>
        </div>

        {/* Active Minutes */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Active Minutes</span>
            <Clock size={18} color="var(--secondary)" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--secondary)' }}>
            {activity.activeMinutes} min
          </h3>
          <div style={{
            height: '6px',
            background: 'var(--bg-subtle)',
            borderRadius: '999px',
            margin: '12px 0 6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (activity.activeMinutes / activity.activeGoal) * 100)}%`,
              height: '100%',
              background: 'var(--secondary)',
              borderRadius: '999px',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: {activity.activeGoal} active min</span>
        </div>

        {/* Distance */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Distance</span>
            <Compass size={18} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#8b5cf6' }}>
            {activity.distanceKm} km
          </h3>
          <div style={{
            height: '6px',
            background: 'var(--bg-subtle)',
            borderRadius: '999px',
            margin: '12px 0 6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (activity.distanceKm / 6) * 100)}%`,
              height: '100%',
              background: '#8b5cf6',
              borderRadius: '999px',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated outdoor + indoor</span>
        </div>

        {/* Calories Burned */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Calories Burned</span>
            <Flame size={18} color="#f59e0b" />
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#f59e0b' }}>
            {activity.caloriesBurned} kcal
          </h3>
          <div style={{
            height: '6px',
            background: 'var(--bg-subtle)',
            borderRadius: '999px',
            margin: '12px 0 6px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min(100, (activity.caloriesBurned / 500) * 100)}%`,
              height: '100%',
              background: '#f59e0b',
              borderRadius: '999px',
              transition: 'width 0.8s ease'
            }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active movement expenditure</span>
        </div>
      </div>

      {/* Weekly Activity Interactive Bar Chart */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Weekly Activity Breakdown
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Hover over bars to inspect daily steps and active minutes
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: 'var(--primary)' }} />
              <span>Goal Met (&ge; 8,000)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#93c5fd' }} />
              <span>In Progress</span>
            </div>
          </div>
        </div>

        {/* SVG / Flex Bar Chart */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: '240px',
          padding: '16px 8px 0',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          {activity.weeklyData.map((dayData) => {
            const barHeightPercent = Math.round((dayData.steps / maxStepsInWeek) * 100);
            const isGoalMet = dayData.steps >= activity.goal;
            const isHovered = hoveredDay === dayData.day;

            return (
              <div
                key={dayData.day}
                onMouseEnter={() => setHoveredDay(dayData.day)}
                onMouseLeave={() => setHoveredDay(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  justifyContent: 'flex-end',
                  cursor: 'pointer',
                  position: 'relative'
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
                    {dayData.steps.toLocaleString()} steps ({dayData.activeMin}m)
                  </div>
                )}

                {/* Animated Bar */}
                <div style={{
                  width: '42px',
                  maxWidth: '70%',
                  height: `${barHeightPercent}%`,
                  borderRadius: '8px 8px 0 0',
                  background: isGoalMet
                    ? 'linear-gradient(180deg, var(--primary) 0%, #059669 100%)'
                    : 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)',
                  boxShadow: isHovered ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'none',
                  transform: isHovered ? 'scaleY(1.03)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }} />

                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: isHovered ? 700 : 500,
                  color: isHovered ? 'var(--primary)' : 'var(--text-secondary)',
                  marginTop: '10px'
                }}>
                  {dayData.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
