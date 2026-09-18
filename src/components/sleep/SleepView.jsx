import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  Moon,
  Bed,
  Sparkles,
  Clock,
  Pencil,
  Save,
  Sun,
  CheckCircle2,
  History,
  AlarmClock,
  AlertCircle,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';

const timeToMinutes = (str) => {
  const m = String(str || '').trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h === 12) h = 0;
  if (m[3].toLowerCase() === 'pm') h += 12;
  return h * 60 + min;
};

const dateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function SleepView() {
  const { sleep, logSleep, wakeNotificationsEnabled, enableWakeNotifications, disableWakeNotifications, wakeHistory, logWakeUp } = useWellness();
  const [hoveredNight, setHoveredNight] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    hours: sleep.hours,
    quality: sleep.quality,
    efficiency: sleep.efficiency,
    deepSleep: sleep.deepSleep,
    remSleep: sleep.remSleep,
    lightSleep: sleep.lightSleep,
    bedtime: sleep.bedtime || '',
    wakeUp: sleep.wakeUp || ''
  });

  const maxSleepHours = 9;

  const openEditor = () => {
    setForm({
      hours: sleep.hours,
      quality: sleep.quality,
      efficiency: sleep.efficiency,
      deepSleep: sleep.deepSleep,
      remSleep: sleep.remSleep,
      lightSleep: sleep.lightSleep,
      bedtime: sleep.bedtime || '',
      wakeUp: sleep.wakeUp || ''
    });
    setEditing(true);
  };

  const handleSaveSleep = (e) => {
    e.preventDefault();
    logSleep({
      hours: parseFloat(form.hours) || 0,
      quality: form.quality,
      efficiency: parseInt(form.efficiency, 10) || 0,
      deepSleep: form.deepSleep,
      remSleep: form.remSleep,
      lightSleep: form.lightSleep,
      bedtime: form.bedtime,
      wakeUp: form.wakeUp
    });
    setEditing(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    fontSize: '0.9rem'
  };

  const nowD = new Date();
  const todayKey = dateKey(nowD);
  const todaysWake = wakeHistory.find(e => e.date === todayKey);
  const schedMin = timeToMinutes(sleep.wakeUp);
  const curMin = nowD.getHours() * 60 + nowD.getMinutes();
  const pastScheduled = schedMin !== null && curMin >= schedMin;

  const getStatusText = (entry) => {
    if (!entry) return null;
    if (entry.missed) return { text: `Scheduled ${entry.scheduled} — not recorded`, color: 'var(--danger, #ef4444)', label: 'Missed' };
    if (entry.lateMin) return { text: `Woke at ${entry.actual} — ${entry.lateMin} min late`, color: '#f59e0b', label: 'Late' };
    if (entry.earlyMin) return { text: `Woke at ${entry.actual} — ${entry.earlyMin} min early`, color: '#06b6d4', label: 'Early' };
    if (entry.onTime) return { text: `Woke at ${entry.actual} — on time`, color: 'var(--primary)', label: 'On Time' };
    return { text: `Woke at ${entry.actual}`, color: 'var(--text-secondary)', label: 'Recorded' };
  };

  const todayStatus = getStatusText(todaysWake);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <DisclaimerBanner compact={true} />

      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 6px 0' }}>
            Sleep Tracking
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
            Understand your nightly restorative sleep cycles, duration trends, and schedule consistency.
          </p>
        </div>

        {!editing && (
          <button
            onClick={openEditor}
            className="btn-secondary"
            style={{ padding: '11px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
          >
            <Pencil size={16} />
            <span>Update Last Night</span>
          </button>
        )}
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

      {/* Wake-Up Tracking Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.07) 0%, rgba(239, 68, 68, 0.07) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px 28px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Sun size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
              Wake-Up Tracking
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Scheduled wake-up: {sleep.wakeUp || '— set in the editor above'}
            </p>
          </div>
        </div>

        {/* Today's status */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={22} color={todayStatus ? todayStatus.color : 'var(--text-muted)'} />
            <div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {todayStatus ? todayStatus.text : 'No wake-up recorded yet today'}
              </div>
              {!todayStatus && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {pastScheduled
                    ? `It's after ${sleep.wakeUp} and no wake-up has been logged yet. Use the button to record the actual time.`
                    : `The reminder will appear here at ${sleep.wakeUp} — tap "I'm Awake" when you wake up.`}
                </div>
              )}
              {todayStatus && todayStatus.label && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#fff',
                  background: todayStatus.color,
                  padding: '2px 10px',
                  borderRadius: '999px'
                }}>
                  {todayStatus.label}
                </span>
              )}
            </div>
          </div>

          {!todayStatus && pastScheduled && (
            <button
              onClick={logWakeUp}
              className="btn-primary"
              style={{ padding: '11px 16px', fontSize: '0.9rem' }}
            >
              <AlarmClock size={16} />
              <span>Record Wake-Up Now</span>
            </button>
          )}
        </div>

        {/* History */}
        {wakeHistory.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <History size={14} />
              <span>Recent Wake-Up History</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {wakeHistory.slice(0, 7).map((entry) => {
                const s = getStatusText(entry);
                return (
                  <div key={entry.date} style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px'
                  }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {entry.date}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>
                      {entry.actual || '—'}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: s.color }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
            {sleep.bedtime || '—'}
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Wake-up: {sleep.wakeUp || '—'} ({sleep.hours}h in bed)
          </p>
        </div>
      </div>

      {/* Manual Sleep Editor */}
      {editing && (
        <form
          onSubmit={handleSaveSleep}
          style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--primary)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Moon size={18} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
              Log Last Night's Sleep
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>
            Enter the details manually — they will update your dashboard and 7-day chart.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '14px'
          }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Sleep Duration (hours)
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                placeholder="e.g. 7.5"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Sleep Quality
              </label>
              <select
                value={form.quality}
                onChange={(e) => setForm({ ...form, quality: e.target.value })}
                style={inputStyle}
              >
                <option value="Optimal">Optimal</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Sleep Efficiency (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.efficiency}
                onChange={(e) => setForm({ ...form, efficiency: e.target.value })}
                placeholder="e.g. 85"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Bedtime
              </label>
              <input
                type="text"
                value={form.bedtime}
                onChange={(e) => setForm({ ...form, bedtime: e.target.value })}
                placeholder="e.g. 11:15 PM"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Wake-up Time
              </label>
              <input
                type="text"
                value={form.wakeUp}
                onChange={(e) => setForm({ ...form, wakeUp: e.target.value })}
                placeholder="e.g. 6:45 AM"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Wake-up Reminder Toggle */}
          <div style={{
            marginTop: '14px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={wakeNotificationsEnabled}
                onChange={(e) => e.target.checked ? enableWakeNotifications() : disableWakeNotifications()}
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Remind me at my wake-up time ({form.wakeUp || 'set a wake-up time above'})
              </span>
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '6px 0 0 28px', lineHeight: 1.4 }}>
              While HealthSnap is open, you'll get a reminder at your wake-up time with an "I'm Awake" button you tap manually.
              Allow browser notifications for alerts even on another tab.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginTop: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Deep Sleep
              </label>
              <input
                type="text"
                value={form.deepSleep}
                onChange={(e) => setForm({ ...form, deepSleep: e.target.value })}
                placeholder="e.g. 1h 45m"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                REM Sleep
              </label>
              <input
                type="text"
                value={form.remSleep}
                onChange={(e) => setForm({ ...form, remSleep: e.target.value })}
                placeholder="e.g. 1h 20m"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '5px', display: 'block' }}>
                Light Sleep
              </label>
              <input
                type="text"
                value={form.lightSleep}
                onChange={(e) => setForm({ ...form, lightSleep: e.target.value })}
                placeholder="e.g. 3h 25m"
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 1, padding: '11px 14px', fontSize: '0.9rem' }}
              >
                <Save size={16} />
                <span>Save Sleep</span>
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="btn-secondary"
                style={{ padding: '11px 14px', fontSize: '0.9rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

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
