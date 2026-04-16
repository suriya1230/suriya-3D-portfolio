// app/agentic/page.js — NEON ODYSSEY intro (correct version)
'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PURPLE = '#7B2FFF';
const BLUE   = '#00D4FF';
const YELLOW = '#E8FF00';

const AgenticScene = dynamic(() => import('@/components/agentic/AgenticScene'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#02010a' }}>
      <div className="text-center">
        <div className="text-5xl font-light mb-5" style={{ fontFamily:'var(--font-display)', color:'#f0f0ff', animation:'glowPulse 2s infinite' }}>
          Initializing Jarvis...
        </div>
        <div className="flex gap-1.5 justify-center">
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:BLUE, animation:`glowPulse 0.8s ease-in-out infinite`, animationDelay:`${i*0.12}s` }} />
          ))}
        </div>
      </div>
    </div>
  ),
});

export default function AgenticPage() {
  const [started, setStarted] = useState(false);

  return (
    <div style={{ minHeight:'100vh', background:'#02010a' }}>
      <AnimatePresence>
        {!started && (
          <motion.div
            key="intro"
            exit={{ opacity:0, scale:0.98 }}
            transition={{ duration:0.8 }}
            style={{
              position:'fixed', inset:0, zIndex:50,
              display:'flex', alignItems:'center', justifyContent:'center',
              background:'#02010a',
            }}
          >
            {/* Scan lines */}
            <div style={{
              position:'absolute', inset:0, pointerEvents:'none', opacity:0.12,
              backgroundImage:`repeating-linear-gradient(0deg, transparent, transparent 3px, ${BLUE}22 3px, ${BLUE}22 4px)`,
            }} />
            {/* Moving scan beam */}
            <div style={{
              position:'absolute', top:0, left:0, right:0, height:2,
              background:`linear-gradient(to right, transparent, ${BLUE}40, transparent)`,
              animation:'scanline 5s linear infinite',
              pointerEvents:'none',
            }} />
            {/* Radial glow */}
            <div style={{
              position:'absolute', inset:0,
              background:`radial-gradient(ellipse at center, ${BLUE}08 0%, transparent 65%)`,
            }} />
            {/* Suit accent lines */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2,
              background:`linear-gradient(to right, ${PURPLE}, ${BLUE}, ${YELLOW}, ${BLUE}, ${PURPLE})`, opacity:0.7 }} />
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2,
              background:`linear-gradient(to right, ${YELLOW}, ${BLUE}, ${PURPLE}, ${BLUE}, ${YELLOW})`, opacity:0.7 }} />

            <div style={{ position:'relative', zIndex:10, textAlign:'center', maxWidth:720, width:'100%', padding:'0 24px' }}>
              {/* Status badge */}
              <motion.div
                initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:40 }}
              >
                <div style={{ width:8, height:8, borderRadius:'50%', background:BLUE, boxShadow:`0 0 12px ${BLUE}`, animation:'glowPulse 1s infinite' }} />
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', color:BLUE, letterSpacing:'0.4em', textTransform:'uppercase' }}>
                  Agent Online · Neon Odyssey Active
                </span>
              </motion.div>

              {/* JARVIS title */}
              <motion.div
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.1 }}
              >
                <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(80px, 16vw, 140px)', fontWeight:300, color:'#f0f0ff', lineHeight:1, marginBottom:16, letterSpacing:'-0.02em' }}>
                  JARVIS
                </div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'1.1rem', marginBottom:8 }}>
                  Suriya's AI Portfolio Agent
                </div>
              </motion.div>

              {/* Mission briefing */}
              <motion.div
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.45 }}
                style={{
                  background:'rgba(2,1,20,0.82)',
                  border:`1px solid ${BLUE}28`,
                  borderRadius:14, padding:'28px 32px',
                  marginBottom:32, marginTop:28,
                  textAlign:'left',
                  backdropFilter:'blur(16px)',
                }}
              >
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'0.65rem', color:BLUE, letterSpacing:'0.35em', textTransform:'uppercase', marginBottom:12 }}>
                  Mission Briefing
                </div>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'1.12rem', color:'rgba(255,255,255,0.7)', lineHeight:1.75 }}>
                  "You are seated in a{' '}
                  <span style={{ color:YELLOW }}>Ferrari SF90 XX Stradale</span>.
                  The city of{' '}
                  <span style={{ color:BLUE }}>Neon Odyssey</span>{' '}
                  stretches ahead — seven glass towers, each one a chapter of Suriya's professional life.
                  The car drives itself. At each stop, I narrate the section in full.
                  <span style={{ color:PURPLE }}> The engine does not move until I finish speaking.</span>"
                </p>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.8 }}
                style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:10, marginBottom:36 }}
              >
                {[
                  { label:'Ferrari SF90 XX', color:YELLOW },
                  { label:'Night City', color:BLUE },
                  { label:'AI Narration', color:PURPLE },
                  { label:'7 Sections', color:YELLOW },
                  { label:'Auto Drive', color:BLUE },
                  { label:'RTDB Live', color:'#22c55e' },
                ].map(tag => (
                  <span key={tag.label} style={{
                    fontFamily:'var(--font-mono)', fontSize:'0.65rem',
                    padding:'5px 14px', borderRadius:100,
                    border:`1px solid ${tag.color}40`, color:tag.color,
                    background:`${tag.color}0e`, letterSpacing:'0.08em',
                  }}>
                    {tag.label}
                  </span>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.1 }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}
              >
                <div style={{ display:'flex', gap:14, flexWrap:'wrap', justifyContent:'center' }}>
                  <button
                    onClick={() => setStarted(true)}
                    style={{
                      fontFamily:'var(--font-mono)', fontSize:'0.9rem', fontWeight:700,
                      padding:'14px 48px', borderRadius:10, border:'none', cursor:'pointer',
                      background:`linear-gradient(135deg, ${BLUE}, #0088bb)`,
                      color:'#000', letterSpacing:'0.06em',
                      boxShadow:`0 0 30px ${BLUE}35`,
                      transition:'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow=`0 0 45px ${BLUE}55`; }}
                    onMouseLeave={e => { e.target.style.transform='none'; e.target.style.boxShadow=`0 0 30px ${BLUE}35`; }}
                  >
                    START JOURNEY →
                  </button>
                  <a
                    href="/"
                    style={{
                      fontFamily:'var(--font-mono)', fontSize:'0.9rem',
                      padding:'14px 36px', borderRadius:10,
                      border:`1px solid rgba(255,255,255,0.14)`,
                      color:'rgba(255,255,255,0.45)', textDecoration:'none',
                      letterSpacing:'0.06em',
                    }}
                  >
                    ← Manual Portfolio
                  </a>
                </div>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'0.58rem', color:'rgba(255,255,255,0.15)', letterSpacing:'0.12em' }}>
                  Enable audio for Jarvis voice · Chrome recommended · Desktop preferred
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {started && <AgenticScene />}
    </div>
  );
}
