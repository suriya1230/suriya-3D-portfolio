// components/portfolio/AchievementsSection.js
'use client';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

export default function AchievementsSection({ achievements }) {
  const { isMobile } = useResponsive();
  if (!achievements?.length) return null;
  return (
    <section id="achievements" className="cm-section" style={{ padding: isMobile ? '4rem 20px' : '7rem 64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="cm-num" style={{ marginBottom: 16 }}>06 — Achievements</div>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 300,
          fontSize: isMobile ? 'clamp(2rem, 9vw, 2.6rem)' : 'clamp(2.4rem, 4.5vw, 3.8rem)',
          color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 40,
        }}>
          Recognition &amp;<br /><span style={{ color: 'hsl(0 0% 40%)', fontStyle: 'italic' }}>Research</span>
        </h2>
        <div style={{ borderTop: '1px solid hsl(0 0% 18%)' }}>
          {achievements.map((ach, i) => (
            <motion.div key={ach.id || i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '36px 1fr' : '48px 1fr auto',
                gap: isMobile ? 14 : 28, alignItems: 'start',
                padding: isMobile ? '20px 0' : '28px 0',
                borderBottom: '1px solid hsl(0 0% 15%)',
              }}>
              <div className="cm-num">{String(i + 1).padStart(2, '0')}</div>
              <div>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: isMobile ? '0.92rem' : '1.0rem', fontWeight: 500, color: 'hsl(0 0% 88%)', marginBottom: 6, lineHeight: 1.4 }}>
                  {ach.title}
                </h3>
                {(ach.description || ach.bio) && (
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: isMobile ? '0.8rem' : '0.85rem', fontWeight: 300, color: 'hsl(0 0% 40%)', lineHeight: 1.65 }}>
                    {ach.description || ach.bio}
                  </p>
                )}
                {isMobile && (
                  <div style={{ display: 'flex', gap: 14, marginTop: 8, alignItems: 'center' }}>
                    {ach.link && <a href={ach.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.72rem', color: 'hsl(119 99% 46%)', textDecoration: 'none', fontWeight: 600 }}>Read Paper ↗</a>}
                    {ach.year && <span style={{ fontSize: '0.7rem', color: 'hsl(0 0% 40%)' }}>{ach.year}</span>}
                  </div>
                )}
              </div>
              {!isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  {ach.link && <a href={ach.link} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: 'hsl(119 99% 46%)', textDecoration: 'none', fontWeight: 600 }}>Read Paper ↗</a>}
                  {ach.year && <span style={{ fontSize: '0.7rem', color: 'hsl(0 0% 40%)' }}>{ach.year}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
