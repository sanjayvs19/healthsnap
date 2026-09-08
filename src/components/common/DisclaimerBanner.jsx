import React, { useState } from 'react';
import { AlertCircle, X, ShieldCheck } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed && compact) return null;

  if (compact) {
    return (
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        margin: '0 0 16px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--primary)" />
          <span>
            <strong>Health Awareness Only:</strong> HealthSnap does not provide medical diagnosis or treatment. Always consult a qualified physician.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          title="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <aside aria-label="Medical Disclaimer" style={{
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      borderRadius: 'var(--radius-lg)',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      margin: '0 0 24px 0'
    }}>
      <div style={{
        background: 'rgba(16, 185, 129, 0.15)',
        padding: '10px',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <ShieldCheck size={24} color="var(--primary)" />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Wellness & Health Habit Tracking Prototype</span>
          <span style={{
            fontSize: '0.7rem',
            background: 'var(--primary)',
            color: '#fff',
            padding: '1px 8px',
            borderRadius: '999px',
            fontWeight: 600
          }}>
            NON-CLINICAL
          </span>
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
          HealthSnap is built for <strong>personal health awareness and healthy habit improvement</strong> only. It is <strong>not a medical diagnosis, clinical treatment, or prescription tool</strong>. If you experience persistent symptoms, always speak with a certified healthcare professional.
        </p>
      </div>
    </aside>
  );
}
