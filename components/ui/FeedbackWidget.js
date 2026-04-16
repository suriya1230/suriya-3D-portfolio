'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchRTDB, addRTDB } from '@/lib/rtdb';

const S = {
  font: "'Sora', sans-serif",
  green: 'hsl(119 99% 46%)',
  bg: 'hsl(0 0% 9%)',
  surface: 'hsl(0 0% 12%)',
  border: 'hsl(0 0% 17%)',
  text: 'hsl(0 0% 92%)',
  muted: 'hsl(0 0% 38%)',
};

function StarRating({ value, onChange, readonly = false }) {
  const [hov, setHov] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <span
          key={n}
          onClick={() => !readonly && onChange(n)}
          onMouseEnter={() => !readonly && setHov(n)}
          onMouseLeave={() => !readonly && setHov(0)}
          style={{
            fontSize: readonly ? '1rem' : '1.5rem',
            cursor: readonly ? 'default' : 'pointer',
            color: n <= (hov || value) ? S.green : 'hsl(0 0% 25%)',
            transition: 'color 0.15s, transform 0.15s',
            transform: !readonly && n <= hov ? 'scale(1.2)' : 'scale(1)',
            display: 'inline-block',
          }}
        >★</span>
      ))}
    </div>
  );
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function FeedbackWidget({ forceOpen = false, onClose }) {
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
    useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  useEffect(() => {
    if (!open) return;
    fetchRTDB('reviews').then(data => {
      const sorted = [...(Array.isArray(data) ? data : [])].sort(
        (a, b) => (b.timestamp || 0) - (a.timestamp || 0)
      );
      setReviews(sorted);
    }).catch(() => {});
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || rating === 0 || !message.trim()) {
      setError('Please fill your name, rating, and message.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const reviewData = {
        name: name.trim(),
        organization,
        rating,
        message: message.trim(),
        timestamp: Date.now(),
      };

      await addRTDB('reviews', reviewData);

      setReviews(prev => [{ id: 'new-' + Date.now(), ...reviewData }, ...prev]);
      setDone(true);
      setName(''); setEmail(''); setRating(0); setMessage('');
      setTimeout(() => setDone(false), 3500);
    } catch (err) {
      console.error('Review submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      {/* ── FLOATING BUTTON ── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.4 }}
        style={{
          position: 'fixed', bottom: 80, right: 24, zIndex: 100,
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: S.font, fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'hsl(0 0% 4%)',
          background: S.green,
          border: 'none', borderRadius: 50,
          padding: '11px 20px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px hsl(119 99% 46% / 0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        whileHover={{ scale: 1.06, boxShadow: '0 6px 28px hsl(119 99% 46% / 0.5)' }}
        whileTap={{ scale: 0.95 }}
      >
        <span style={{ fontSize: '1rem' }}>💬</span>
        Feedback
      </motion.button>

      {/* ── BACKDROP ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
  setOpen(false);
  onClose && onClose();
}}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.55)',
              zIndex: 110,
              backdropFilter: 'blur(3px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── RIGHT DRAWER ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}         // ← slides in from right
            animate={{ x: 0 }}
            exit={{ x: '100%' }}             // ← slides out to right
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,  // ← right side
              width: 400, zIndex: 120,
              background: S.bg,
              borderRight: `1px solid ${S.border}`,              // ← left border
              display: 'flex', flexDirection: 'column',
              boxShadow: '8px 0 40px rgba(0,0,0,0.5)',         // ← shadow flipped
            }}
          >
            {/* Header */}
            <div style={{ padding: '24px 24px 18px', borderBottom: `1px solid ${S.border}`, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '1.1rem' }}>💬</span>
                  <h2 style={{ fontFamily: S.font, fontSize: '1.05rem', fontWeight: 700, color: S.text, letterSpacing: '-0.01em', margin: 0 }}>
                    Feedback
                  </h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.muted, fontSize: '1.2rem', lineHeight: 1, padding: 4, borderRadius: 6, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = S.text}
                  onMouseLeave={e => e.currentTarget.style.color = S.muted}
                >
                  ✕
                </button>
              </div>
              {avgRating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: S.font, fontSize: '1.1rem', fontWeight: 700, color: S.green }}>{avgRating}</span>
                  <StarRating value={Math.round(Number(avgRating))} readonly />
                  <span style={{ fontFamily: S.font, fontSize: '0.72rem', color: S.muted }}>
                    · {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
              )}
            </div>

            {/* Past Reviews — scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {reviews.length === 0 ? (
                <div style={{ fontFamily: S.font, fontSize: '0.82rem', color: S.muted, textAlign: 'center', paddingTop: 40 }}>
                  No reviews yet. Be the first!
                </div>
              ) : (
                reviews.map((r, i) => (
                  <motion.div
                    key={r.id || i}
                    initial={{ opacity: 0, x: 12 }}   // ← enter from right now
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      padding: '14px 16px',
                      background: S.surface,
                      border: `1px solid ${S.border}`,
                      borderRadius: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: 'hsl(119 99% 46% / 0.15)',
                          border: '1px solid hsl(119 99% 46% / 0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: S.font, fontSize: '0.65rem', fontWeight: 700, color: S.green,
                        }}>
                          {(r.name || '?')[0].toUpperCase()}
                        </div>
                        <span style={{ fontFamily: S.font, fontSize: '0.82rem', fontWeight: 600, color: S.text }}>
                          {r.name || 'Anonymous'}
                        </span>
                      </div>
                      <span style={{ fontFamily: S.font, fontSize: '0.62rem', color: S.muted }}>
                        {timeAgo(r.timestamp)}
                      </span>
                    </div>
                    <StarRating value={r.rating || 0} readonly />
                    {r.message && (
                      <p style={{ fontFamily: S.font, fontSize: '0.8rem', fontWeight: 300, color: 'hsl(0 0% 55%)', lineHeight: 1.65, marginTop: 8, marginBottom: 0 }}>
                        {r.message}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: S.border, flexShrink: 0 }} />

            {/* Write a Review Form */}
            <div style={{ padding: '18px 24px 24px', flexShrink: 0, background: 'hsl(0 0% 8%)' }}>
              <div style={{ fontFamily: S.font, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: S.green, marginBottom: 14 }}>
                Write a Review
              </div>

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', padding: '20px 0', fontFamily: S.font }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎉</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: S.green }}>Thank you for your feedback!</div>
                    <div style={{ fontSize: '0.75rem', color: S.muted, marginTop: 4 }}>Your review has been submitted.</div>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} style={{ margin: 0 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                      <input
                        placeholder="Your name *"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        style={{ padding: '10px 12px', fontFamily: S.font, fontSize: '0.8rem', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 7, color: S.text, outline: 'none' }}
                        onFocus={e => e.target.style.borderColor = S.green}
                        onBlur={e => e.target.style.borderColor = S.border}
                      />
                      <select
  value={organization}
  onChange={e => setOrganization(e.target.value)}
  style={{
    padding: '10px 12px',
    fontFamily: S.font,
    fontSize: '0.8rem',
    background: S.surface,
    border: `1px solid ${S.border}`,
    borderRadius: 7,
    color: S.text,
    outline: 'none'
  }}
  onFocus={e => e.target.style.borderColor = S.green}
  onBlur={e => e.target.style.borderColor = S.border}
>
  <option value="">Select Type *</option>
  <option value="Student">Student</option>
  <option value="Working Professional">Working Professional</option>
  <option value="Company">Company</option>
</select>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: S.font, fontSize: '0.62rem', color: S.muted, marginBottom: 6, letterSpacing: '0.1em' }}>
                        YOUR RATING *
                      </div>
                      <StarRating value={rating} onChange={setRating} />
                    </div>

                    <textarea
                      placeholder="Share your thoughts about this portfolio..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: '10px 12px', fontFamily: S.font, fontSize: '0.8rem', background: S.surface, border: `1px solid ${S.border}`, borderRadius: 7, color: S.text, outline: 'none', resize: 'none', marginBottom: 10, boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = S.green}
                      onBlur={e => e.target.style.borderColor = S.border}
                    />

                    {error && (
                      <div style={{ fontFamily: S.font, fontSize: '0.72rem', color: '#ff6b6b', marginBottom: 10 }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        width: '100%', padding: '11px',
                        fontFamily: S.font, fontSize: '0.8rem', fontWeight: 700,
                        letterSpacing: '0.06em',
                        background: S.green, color: 'hsl(0 0% 4%)',
                        border: 'none', borderRadius: 7,
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.6 : 1,
                        transition: 'filter 0.2s',
                      }}
                      onMouseEnter={e => { if (!submitting) e.currentTarget.style.filter = 'brightness(1.1)'; }}
                      onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review ✓'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
