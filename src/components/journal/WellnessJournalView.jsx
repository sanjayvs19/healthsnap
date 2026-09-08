import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  FileEdit,
  Smile,
  Clock,
  Sliders,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Tag
} from 'lucide-react';

export default function WellnessJournalView() {
  const { journalEntries, addJournalEntry } = useWellness();

  // Form State
  const [feeling, setFeeling] = useState('Good');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState('Mild');
  const [duration, setDuration] = useState('1–3 hours');
  const [notes, setNotes] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const feelingOptions = [
    { label: 'Great', emoji: '😄', color: '#10b981' },
    { label: 'Good', emoji: '🙂', color: '#06b6d4' },
    { label: 'Okay', emoji: '😐', color: '#3b82f6' },
    { label: 'Tired', emoji: '🥱', color: '#f59e0b' },
    { label: 'Stressed', emoji: '😰', color: '#ec4899' },
    { label: 'Low energy', emoji: '🔋', color: '#ef4444' }
  ];

  const severityLevels = ['Mild', 'Moderate', 'High'];

  const durationOptions = [
    'Less than 1 hour',
    '1–3 hours',
    '3–6 hours',
    'More than 6 hours'
  ];

  const symptomSuggestions = [
    'Headache for 2 hours',
    'Mild eye strain from screens',
    'Shoulder & neck tension',
    'Fullness after lunch',
    'Restless afternoon fatigue'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedObj = feelingOptions.find(f => f.label === feeling);

    addJournalEntry({
      feeling,
      feelingEmoji: selectedObj ? selectedObj.emoji : '🙂',
      symptoms: symptoms || 'Routine wellness check-in',
      severity,
      duration,
      notes: notes || 'No extra notes'
    });

    setSuccessMessage(true);
    setSymptoms('');
    setNotes('');

    setTimeout(() => {
      setSuccessMessage(false);
    }, 4000);
  };

  const getSeverityBadgeClass = (sev) => {
    if (sev === 'High') return 'badge-tag' + ' ' + 'badge-amber';
    if (sev === 'Moderate') return 'badge-tag' + ' ' + 'badge-blue';
    return 'badge-tag' + ' ' + 'badge-emerald';
  };

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
          <FileEdit size={16} />
          <span>Subjective Wellness Tracking</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
          Log Wellness
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
          Record your daily feelings, symptoms, and observations to help AI spot patterns.
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '24px',
          color: 'var(--primary-dark)',
          fontWeight: 600,
          fontSize: '0.92rem',
          animation: 'fadeInUp 0.3s ease-out'
        }}>
          <CheckCircle2 size={20} color="var(--primary)" />
          <span>Wellness entry added successfully. AI insights updated.</span>
        </div>
      )}

      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '28px',
        alignItems: 'start'
      }}>
        {/* Left Column: Interactive Form */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
            New Wellness Record
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* 1. How are you feeling? */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '10px' }}>
                How are you feeling?
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}>
                {feelingOptions.map((opt) => {
                  const isSelected = feeling === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setFeeling(opt.label)}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--border-subtle)',
                        background: isSelected ? `${opt.color}15` : 'var(--bg-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span style={{ fontSize: '1.6rem' }}>{opt.emoji}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Symptoms / Wellness Notes */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Symptoms / Wellness Notes
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Headache for 2 hours, afternoon fatigue..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />

              {/* Quick Suggestion Chips */}
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick fill:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {symptomSuggestions.slice(0, 3).map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setSymptoms(sug)}
                      style={{
                        fontSize: '0.72rem',
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      + {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Severity Interactive Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Severity
                </label>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: '999px',
                  background: severity === 'High' ? '#fee2e2' : severity === 'Moderate' ? '#fef3c7' : '#d1fae5',
                  color: severity === 'High' ? '#b91c1c' : severity === 'Moderate' ? '#b45309' : '#047857'
                }}>
                  {severity}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={severityLevels.indexOf(severity)}
                onChange={(e) => setSeverity(severityLevels[parseInt(e.target.value)])}
                style={{
                  width: '100%',
                  accentColor: severity === 'High' ? '#ef4444' : severity === 'Moderate' ? '#f59e0b' : 'var(--primary)',
                  cursor: 'pointer'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>Mild</span>
                <span>Moderate</span>
                <span>High</span>
              </div>
            </div>

            {/* 4. Duration Dropdown */}
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '8px' }}>
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {durationOptions.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>

            {/* Save Entry Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: '6px' }}
            >
              <Plus size={18} />
              <span>Save Entry</span>
            </button>
          </form>
        </div>

        {/* Right Column: Historical Journal Log */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Recent Journal Entries
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {journalEntries.length} entries recorded
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '520px', overflowY: 'auto' }}>
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  background: 'var(--bg-app)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px',
                  transition: 'transform var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{entry.feelingEmoji || '🙂'}</span>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      Feeling {entry.feeling}
                    </strong>
                  </div>
                  <span className={getSeverityBadgeClass(entry.severity)}>
                    {entry.severity}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                  "{entry.symptoms}"
                </p>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} />
                    <span>Duration: {entry.duration}</span>
                  </div>
                  <span>•</span>
                  <span>{entry.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
