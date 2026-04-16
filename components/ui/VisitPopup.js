'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const S = {
  font: "'Sora', sans-serif",
  green: 'hsl(119 99% 46%)',
  greenBg: 'hsl(119 99% 46% / 0.1)',
  greenBorder: 'hsl(119 99% 46% / 0.35)',
  bg: 'hsl(0 0% 9%)',
  surface: 'hsl(0 0% 12%)',
  border: 'hsl(0 0% 18%)',
  text: 'hsl(0 0% 94%)',
  muted: 'hsl(0 0% 42%)',
};

export default function VisitPopup({ onSubmit, onSkip }) {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusName, setFocusName] = useState(false);
  const [focusCo, setFocusCo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onSubmit(name.trim(), company.trim());
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: S.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 16,
    }}>
      {/* subtle radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%, hsl(119 99% 46% / 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 400,
          background: S.surface,
          border: `1px solid ${S.border}`,
          borderRadius: 16,
          padding: '36px 32px 32px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Top green line */}
        <div style={{ position: 'absolute', top: 0, left: 32, right: 32, height: 1, background: `linear-gradient(to right, transparent, ${S.green}, transparent)` }}/>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: S.font, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: S.green, marginBottom: 12 }}>
            Welcome
          </div>
          <h1 style={{ fontFamily: S.font, fontSize: '1.75rem', fontWeight: 700, color: S.text, marginBottom: 8, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Before You Enter
          </h1>
          <p style={{ fontFamily: S.font, fontSize: '0.82rem', fontWeight: 300, color: S.muted, lineHeight: 1.6 }}>
            Tell me who you are — I'd love to know my visitor.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: S.font, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: S.muted, marginBottom: 8 }}>
              Your Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setFocusName(true)}
              onBlur={() => setFocusName(false)}
              placeholder="e.g. Elon Musk"
              required
              autoFocus
              style={{
                width: '100%', padding: '12px 14px',
                fontFamily: S.font, fontSize: '0.88rem', fontWeight: 400,
                color: S.text, background: 'hsl(0 0% 9%)',
                border: `1px solid ${focusName ? S.green : S.border}`,
                borderRadius: 8, outline: 'none',
                boxShadow: focusName ? `0 0 0 3px hsl(119 99% 46% / 0.12)` : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontFamily: S.font, fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: S.muted, marginBottom: 8 }}>
              Company / Organisation
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              onFocus={() => setFocusCo(true)}
              onBlur={() => setFocusCo(false)}
              placeholder="e.g. Tesla (optional)"
              style={{
                width: '100%', padding: '12px 14px',
                fontFamily: S.font, fontSize: '0.88rem', fontWeight: 400,
                color: S.text, background: 'hsl(0 0% 9%)',
                border: `1px solid ${focusCo ? S.green : S.border}`,
                borderRadius: 8, outline: 'none',
                boxShadow: focusCo ? `0 0 0 3px hsl(119 99% 46% / 0.12)` : 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              style={{
                flex: 1, padding: '13px 20px',
                fontFamily: S.font, fontSize: '0.82rem', fontWeight: 700,
                letterSpacing: '0.06em',
                background: !name.trim() ? 'hsl(119 99% 46% / 0.35)' : S.green,
                color: 'hsl(0 0% 4%)',
                border: 'none', borderRadius: 8, cursor: name.trim() ? 'pointer' : 'not-allowed',
                transition: 'filter 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { if(name.trim()) e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
              onMouseDown={e => { if(name.trim()) e.currentTarget.style.transform = 'scale(0.97)'; }}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {loading ? 'Entering...' : 'Enter Portfolio'}
            </button>
            <button
              type="button"
              onClick={onSkip}
              style={{
                padding: '13px 20px',
                fontFamily: S.font, fontSize: '0.82rem', fontWeight: 500,
                color: S.muted,
                background: 'transparent',
                border: `1px solid ${S.border}`,
                borderRadius: 8, cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'hsl(0 0% 35%)'; e.currentTarget.style.color = S.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.color = S.muted; }}
            >
              Skip
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}