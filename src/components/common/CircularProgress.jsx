import React from 'react';

export default function CircularProgress({
  score = 78,
  max = 100,
  size = 170,
  strokeWidth = 11,
  label = "Today's Wellness Score",
  status = "Good"
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(100, Math.max(0, (score / max) * 100));
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: size,
      height: size,
      margin: '0 auto'
    }}>
      <svg
        width={size}
        height={size}
        style={{
          transform: 'rotate(-90deg)',
          overflow: 'visible'
        }}
      >
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="scoreGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-subtle)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          filter="url(#scoreGlow)"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '10px'
      }}>
        <div style={{
          fontSize: '2.4rem',
          fontWeight: '800',
          fontFamily: 'var(--font-heading)',
          lineHeight: 1,
          color: 'var(--text-main)',
          display: 'flex',
          alignItems: 'baseline',
          gap: '2px'
        }}>
          <span>{score}</span>
          <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>/{max}</span>
        </div>
        <div style={{
          fontSize: '0.75rem',
          fontWeight: '600',
          color: 'var(--primary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginTop: '4px',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '2px 8px',
          borderRadius: '999px'
        }}>
          {status}
        </div>
      </div>
    </div>
  );
}
