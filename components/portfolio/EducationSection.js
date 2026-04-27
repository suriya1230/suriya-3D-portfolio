// components/portfolio/EducationSection.js
'use client';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

export default function EducationSection({ education }) {
  const { isMobile } = useResponsive();
  if (!education?.length) return null;
  return (
    <section id="education" className="cm-section" style={{ padding: isMobile ? '4rem 20px' : '7rem 64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="cm-num" style={{ marginBottom: 16 }}>02 — Education</div>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 300,
          fontSize: isMobile ? 'clamp(2rem, 9vw, 2.6rem)' : 'clamp(2.4rem, 4.5vw, 3.8rem)',
          color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 40,
        }}>
          Academic<br /><span style={{ color: 'hsl(0 0% 40%)', fontStyle: 'italic' }}>Background</span>
        </h2>
        <div style={{ borderTop: '1px solid hsl(0 0% 18%)' }}>
          {education.map((edu, i) => (
            <motion.div key={edu.id || i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', alignItems: 'flex-start',
                padding: isMobile ? '20px 0' : '28px 0',
                borderBottom: '1px solid hsl(0 0% 15%)', gap: isMobile ? 8 : 40,
              }}>
              <div style={{ flex: 1 }}>
                <div className="cm-num" style={{ marginBottom: 8 }}>{String(i + 1).padStart(2, '0')}</div>
                <h3 style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: isMobile ? '1.1rem' : '1.45rem',
                  fontWeight: 400, color: 'hsl(0 0% 90%)', marginBottom: 6, letterSpacing: '-0.01em',
                }}>{edu.title || edu.degree}</h3>
                <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.85rem', fontWeight: 300, color: 'hsl(0 0% 40%)' }}>
                  {edu.institution}
                </p>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right', flexShrink: 0 }}>
                {edu.year && <div className="cm-mono" style={{ marginBottom: 6 }}>{edu.year}</div>}
                {edu.gpa && <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.75rem', color: 'hsl(119 99% 46% / 0.8)', fontWeight: 500 }}>GPA {edu.gpa}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
