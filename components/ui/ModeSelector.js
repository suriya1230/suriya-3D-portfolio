// components/ui/ModeSelector.js
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

export default function ModeSelector({ visitor, onSelect }) {
  const [hovered, setHovered] = useState(null);
  const { isMobile } = useResponsive();

  const modes = [
    {
      id: 'manual', label: 'Manual Mode', subtitle: 'Classic Portfolio',
      description: 'Browse the portfolio at your own pace. Navigate sections freely — About, Projects, Skills, and more.',
      icon: '⬡', tag: 'Standard',
      color: 'rgba(255,255,255,0.08)', accentColor: 'rgba(255,255,255,0.5)',
    },
    {
      id: 'agentic', label: 'Agentic Mode', subtitle: '3D Cinematic AI Experience',
      description: 'Let Jarvis — my AI agent — guide you through a cinematic 3D world. Immersive. Unforgettable.',
      icon: '◈', tag: 'AI-Powered',
      color: 'rgba(201,168,76,0.06)', accentColor: 'var(--gold)', recommended: true,
    },
  ];

  return (
    <div className="min-h-screen bg-void flex items-center justify-center relative"
      style={{ padding: isMobile ? '20px 16px' : '24px' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 65%)' }} />

      <div className="relative z-10 w-full" style={{ maxWidth: isMobile ? 480 : 896 }}>
        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="text-center" style={{ marginBottom: isMobile ? 32 : 56 }}>
          <div className="text-xs tracking-[0.35em] uppercase mb-3 text-white/30" style={{ fontFamily: 'var(--font-mono)' }}>
            Welcome back
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0', fontWeight: 300, fontSize: isMobile ? 'clamp(2rem, 9vw, 2.8rem)' : 'clamp(2.5rem, 6vw, 4rem)', marginBottom: 12 }}>
            Hello, <span className="gold-text">{visitor.name || 'Visitor'}</span>
          </h1>
          <p className="text-white/40" style={{ fontSize: isMobile ? '0.9rem' : '1.1rem' }}>
            {visitor.company ? `from ${visitor.company} — ` : ''}
            How would you like to experience this portfolio?
          </p>
        </motion.div>

        {/* Mode cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 14 : 24 }}>
          {modes.map((mode, i) => (
            <motion.div key={mode.id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHovered(mode.id)} onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(mode.id)}
              style={{
                position: 'relative', cursor: 'pointer', borderRadius: isMobile ? 16 : 20,
                padding: isMobile ? '24px 22px' : '32px',
                background: hovered === mode.id ? (mode.id === 'agentic' ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.06)') : mode.color,
                border: `1px solid ${hovered === mode.id ? mode.accentColor : 'rgba(255,255,255,0.07)'}`,
                transform: hovered === mode.id ? 'translateY(-3px)' : 'none',
                boxShadow: hovered === mode.id && mode.id === 'agentic' ? '0 20px 60px rgba(201,168,76,0.15)' : '0 4px 20px rgba(0,0,0,0.3)',
                transition: 'all 0.4s',
              }}>
              {mode.recommended && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: '0.6rem', padding: '4px 10px', borderRadius: 100,
                  background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                  color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em',
                }}>RECOMMENDED</div>
              )}
              <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', color: mode.accentColor, marginBottom: isMobile ? 14 : 20, display: 'inline-block', transition: 'transform 0.3s', transform: hovered === mode.id ? 'scale(1.1)' : 'scale(1)' }}>
                {mode.icon}
              </div>
              <div className="text-xs tracking-widest uppercase mb-2" style={{ color: mode.accentColor, fontFamily: 'var(--font-mono)', fontSize: '0.62rem' }}>{mode.tag}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0', fontSize: isMobile ? '1.4rem' : '1.7rem', fontWeight: 500, marginBottom: 4 }}>{mode.label}</h2>
              <div style={{ fontSize: '0.85rem', color: mode.accentColor, marginBottom: 10 }}>{mode.subtitle}</div>
              <p style={{ fontSize: isMobile ? '0.82rem' : '0.9rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.65 }}>{mode.description}</p>
              <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 500, color: hovered === mode.id ? mode.accentColor : 'rgba(255,255,255,0.25)', transition: 'color 0.3s' }}>
                <span>{hovered === mode.id ? 'Tap to enter' : 'Choose this mode'}</span>
                <span style={{ transform: hovered === mode.id ? 'translateX(4px)' : 'none', transition: 'transform 0.3s' }}>→</span>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(to right, transparent, ${mode.accentColor}, transparent)`, opacity: hovered === mode.id ? 1 : 0, transition: 'opacity 0.3s' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
