// components/ui/ModeSelector.js
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ModeSelector({ visitor, onSelect }) {
  const [hovered, setHovered] = useState(null);

  const modes = [
    {
      id: 'manual',
      label: 'Manual Mode',
      subtitle: 'Classic Portfolio',
      description: 'Browse the portfolio at your own pace. Navigate sections freely — About, Projects, Skills, and more.',
      icon: '⬡',
      tag: 'Standard',
      color: 'rgba(255,255,255,0.08)',
      accentColor: 'rgba(255,255,255,0.5)',
    },
    {
      id: 'agentic',
      label: 'Agentic Mode',
      subtitle: '3D Cinematic AI Experience',
      description: 'Let Jarvis — my AI agent — guide you through a cinematic 3D world. Immersive. Unforgettable.',
      icon: '◈',
      tag: 'AI-Powered',
      color: 'rgba(201,168,76,0.06)',
      accentColor: 'var(--gold)',
      recommended: true,
    },
  ];

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-6 relative">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="text-xs tracking-[0.35em] uppercase mb-4 text-white/30" style={{ fontFamily: 'var(--font-mono)' }}>
            Welcome back
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-4" style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}>
            Hello, <span className="gold-text">{visitor.name || 'Visitor'}</span>
          </h1>
          <p className="text-white/40 text-lg">
            {visitor.company ? `from ${visitor.company} — ` : ''}
            How would you like to experience this portfolio?
          </p>
        </motion.div>

        {/* Mode cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {modes.map((mode, i) => (
            <motion.div
              key={mode.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              onMouseEnter={() => setHovered(mode.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(mode.id)}
              className="relative cursor-pointer rounded-2xl p-8 transition-all duration-500"
              style={{
                background: hovered === mode.id ? (mode.id === 'agentic' ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.06)') : mode.color,
                border: `1px solid ${hovered === mode.id ? mode.accentColor : 'rgba(255,255,255,0.07)'}`,
                transform: hovered === mode.id ? 'translateY(-4px)' : 'none',
                boxShadow: hovered === mode.id && mode.id === 'agentic' ? '0 20px 60px rgba(201,168,76,0.15)' : '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              {mode.recommended && (
                <div
                  className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full"
                  style={{
                    background: 'rgba(201,168,76,0.15)',
                    border: '1px solid rgba(201,168,76,0.3)',
                    color: 'var(--gold)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                  }}
                >
                  RECOMMENDED
                </div>
              )}

              <div
                className="text-5xl mb-5 transition-transform duration-300"
                style={{
                  color: mode.accentColor,
                  transform: hovered === mode.id ? 'scale(1.1)' : 'scale(1)',
                  display: 'inline-block',
                }}
              >
                {mode.icon}
              </div>

              <div className="mb-1">
                <div className="text-xs tracking-widest uppercase mb-2" style={{ color: mode.accentColor, fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}>
                  {mode.tag}
                </div>
                <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}>
                  {mode.label}
                </h2>
                <div className="text-sm mb-4" style={{ color: mode.accentColor }}>
                  {mode.subtitle}
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div
                className="mt-6 flex items-center gap-2 text-sm font-medium transition-all duration-300"
                style={{ color: hovered === mode.id ? mode.accentColor : 'rgba(255,255,255,0.25)' }}
              >
                <span>{hovered === mode.id ? 'Click to enter' : 'Choose this mode'}</span>
                <span className="transition-transform duration-300" style={{ transform: hovered === mode.id ? 'translateX(4px)' : 'none' }}>→</span>
              </div>

              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-8 right-8 h-px transition-opacity duration-300"
                style={{
                  background: `linear-gradient(to right, transparent, ${mode.accentColor}, transparent)`,
                  opacity: hovered === mode.id ? 1 : 0,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
