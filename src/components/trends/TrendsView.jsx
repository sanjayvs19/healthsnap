import React, { useState } from 'react';
import { useWellness } from '../../context/WellnessContext';
import { TRENDS_DATA } from '../../types/data';
import DisclaimerBanner from '../common/DisclaimerBanner';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Calendar,
  Sparkles,
  Activity,
  Moon,
  Smile,
  ShieldCheck
} from 'lucide-react';

export default function TrendsView() {
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const rawData = TRENDS_DATA[filterPeriod] || TRENDS_DATA['7d'];

  // Calculate SVG line path coordinates for Wellness Score
  const chartHeight = 180;
  const chartWidth = 700;
  const paddingX = 40;
  const minScore = 60;
  const maxScore = 90;

  const points = rawData.map((d, i) => {
    const x = paddingX + (i / (rawData.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - ((d.score - minScore) / (maxScore - minScore)) * (chartHeight - 40) - 20;
    return { ...d, x, y };
  });

  const pathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x},${chartHeight} L ${points[0].x},${chartHeight} Z`;

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
            <LineChartIcon size={16} />
            <span>Multi-Horizon Trend Analytics</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '6px' }}>
            Your Wellness Journey
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', margin: 0 }}>
            Analyze longitudinal scores, movement, rest, and subjective wellness trends.
          </p>
        </div>

        {/* Date Filter Tabs: 7 Days | 30 Days | 3 Months */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          {[
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '3m', label: '3 Months' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterPeriod(tab.key)}
              style={{
                padding: '8px 16px',
                fontSize: '0.84rem',
                fontWeight: filterPeriod === tab.key ? 700 : 500,
                color: filterPeriod === tab.key ? '#fff' : 'var(--text-secondary)',
                background: filterPeriod === tab.key ? 'var(--primary)' : 'transparent',
                borderRadius: '8px',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Your Progress Callout Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-xl)',
        padding: '22px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        marginBottom: '28px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <TrendingUp size={26} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
            Your Progress
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            "Your overall wellness score has improved compared with last week."
          </p>
        </div>
      </div>

      {/* Wellness Score Trend Interactive SVG Graph */}
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
              Wellness Score Trend ({filterPeriod === '7d' ? 'Daily' : filterPeriod === '30d' ? 'Weekly' : 'Monthly'})
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Hover over nodes to inspect recorded score points
            </p>
          </div>
          <span className="badge-tag badge-emerald">+4.2% Net Gain</span>
        </div>

        {/* SVG Chart Container */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            style={{ width: '100%', height: 'auto', minWidth: '550px', overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="trendAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[70, 75, 80, 85].map((level) => {
              const y = chartHeight - ((level - minScore) / (maxScore - minScore)) * (chartHeight - 40) - 20;
              return (
                <g key={level}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="var(--border-subtle)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x={paddingX - 10}
                    y={y + 4}
                    fontSize="10"
                    fill="var(--text-muted)"
                    textAnchor="end"
                  >
                    {level}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path d={areaD} fill="url(#trendAreaGrad)" />

            {/* Smooth Line */}
            <path
              d={pathD}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive Data Points */}
            {points.map((pt, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredPoint?.x === pt.x ? 7 : 5}
                  fill="var(--bg-surface)"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <text
                  x={pt.x}
                  y={chartHeight + 15}
                  fontSize="11"
                  fill="var(--text-secondary)"
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {pt.day || pt.period}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Active Node Inspector Banner */}
        <div style={{
          marginTop: '20px',
          padding: '14px 18px',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}>
          <div>
            <strong>Selected: {hoveredPoint ? (hoveredPoint.day || hoveredPoint.period) : 'Sunday'}</strong>
            <span style={{ color: 'var(--text-muted)', marginLeft: '10px' }}>
              Wellness Score: <strong style={{ color: 'var(--primary)' }}>{hoveredPoint ? hoveredPoint.score : 78} / 100</strong>
            </span>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            Daily factors: Sleep + Steps + Nutrition + Reflections
          </span>
        </div>
      </div>

      {/* Multi-Metric Correlation Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Activity vs Sleep Trend */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Activity size={18} color="var(--primary)" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Activity & Sleep Ratio</h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Days with over 7.5 hours of rest demonstrated an average increase of <strong>+1,650 steps</strong> and reported higher afternoon focus.
          </p>
        </div>

        {/* Mood Distribution */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Smile size={18} color="#f59e0b" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Mood & Energy Stability</h4>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            71% of daily check-ins recorded <strong>Great or Good</strong> feelings, with tiredness primarily concentrated after late screen sessions.
          </p>
        </div>
      </div>
    </div>
  );
}
