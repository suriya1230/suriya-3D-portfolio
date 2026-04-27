// components/portfolio/ProjectsSection.js
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

const PROJECT_IMAGES = {
  'videomind ai': '/projects/videomind.png', 'videomind': '/projects/videomind.png',
  'loan ai': '/projects/loan_ai.png', 'loan-ai': '/projects/loan_ai.png',
  'ai cyber defense': '/projects/cyberdefence.png', 'cyber defense': '/projects/cyberdefence.png',
  'resume score checker': '/projects/resume_checker.png', 'resume checker': '/projects/resume_checker.png',
  'sentiment analysis': '/projects/sentiment_analysis.png',
};
function getProjectImage(p) {
  if (p.imageUrl) return p.imageUrl;
  const key = (p.title || '').toLowerCase();
  for (const [match, src] of Object.entries(PROJECT_IMAGES)) {
    if (key.includes(match)) return src;
  }
  return null;
}

export default function ProjectsSection({ projects }) {
  const { isMobile } = useResponsive();
  const [hovered, setHovered] = useState(null);
  if (!projects?.length) return null;

  return (
    <section id="projects" style={{ padding: isMobile ? '4rem 20px' : '7rem 64px', borderTop: '1px solid hsl(0 0% 15%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="cm-num" style={{ marginBottom: 16 }}>03 — Work</div>
            <h2 style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 300,
              fontSize: isMobile ? 'clamp(2rem, 9vw, 2.6rem)' : 'clamp(2.4rem, 4.5vw, 3.8rem)',
              color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em',
            }}>
              Selected<br /><span style={{ color: 'hsl(0 0% 40%)', fontStyle: 'italic' }}>Projects</span>
            </h2>
          </div>
          <span className="cm-num">{projects.length} projects</span>
        </div>

        <div style={{ borderTop: '1px solid hsl(0 0% 15%)' }}>
          {projects.map((p, i) => {
            const href = p.link || p.github || p.githubUrl || p.liveUrl || '';
            const isHov = hovered === i;
            const isEven = i % 2 === 1;
            const imgSrc = getProjectImage(p);

            if (isMobile) {
              return (
                <motion.div key={p.id || i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.07 }}
                  style={{ padding: '24px 0', borderBottom: '1px solid hsl(0 0% 14%)' }}>
                  {imgSrc && (
                    <div onClick={() => href && window.open(href, '_blank')}
                      style={{ width: '100%', height: 190, overflow: 'hidden', borderRadius: 10, marginBottom: 16, cursor: href ? 'pointer' : 'default' }}>
                      <img src={imgSrc} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                  <div className="cm-num" style={{ marginBottom: 8 }}>{String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.15rem', fontWeight: 500, color: 'hsl(0 0% 90%)', marginBottom: 8 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.83rem', fontWeight: 300, color: 'hsl(0 0% 45%)', lineHeight: 1.65, marginBottom: 12 }}>
                    {p.description?.length > 110 ? p.description.slice(0, 108) + '…' : p.description}
                  </p>
                  {Array.isArray(p.tags) && p.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                      {p.tags.slice(0, 4).map(t => <span key={t} className="cm-tag" style={{ fontSize: '0.6rem' }}>{t}</span>)}
                    </div>
                  )}
                  {href && (
                    <a href={href} target="_blank" rel="noreferrer" style={{
                      fontFamily: "'Sora', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                      color: 'hsl(119 99% 46%)', textDecoration: 'none', letterSpacing: '0.06em',
                    }}>View Project ↗</a>
                  )}
                </motion.div>
              );
            }

            // Desktop alternating layout
            return (
              <motion.div key={p.id || i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.07 }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid', gridTemplateColumns: isEven ? '1fr 320px' : '320px 1fr',
                  gap: 56, alignItems: 'center', padding: '44px 0',
                  borderBottom: '1px solid',
                  borderColor: isHov ? 'hsl(119 99% 46% / 0.2)' : 'hsl(0 0% 14%)',
                  transition: 'border-color 0.3s',
                }}>
                {/* Image */}
                {imgSrc ? (
                  <div onClick={() => href && window.open(href, '_blank')}
                    style={{ order: isEven ? 2 : 1, position: 'relative', overflow: 'hidden', borderRadius: 8, height: 220, cursor: href ? 'pointer' : 'default' }}>
                    <img src={imgSrc} alt={p.title} style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.5s', transform: isHov ? 'scale(1.04)' : 'scale(1)',
                    }} />
                  </div>
                ) : (
                  <div style={{
                    order: isEven ? 2 : 1, height: 220, borderRadius: 8,
                    background: 'hsl(0 0% 11%)', border: '1px solid hsl(0 0% 16%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: '3rem', opacity: 0.12 }}>{p.emoji || '◻'}</span>
                  </div>
                )}
                {/* Text */}
                <div style={{ order: isEven ? 1 : 2 }}>
                  <div className="cm-num" style={{ marginBottom: 12 }}>{String(i + 1).padStart(2, '0')}</div>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.5rem', fontWeight: 400, color: 'hsl(0 0% 90%)', marginBottom: 12, letterSpacing: '-0.02em' }}>{p.title}</h3>
                  <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.85rem', fontWeight: 300, color: 'hsl(0 0% 45%)', lineHeight: 1.75, marginBottom: 20 }}>
                    {p.description?.length > 140 ? p.description.slice(0, 138) + '…' : p.description}
                  </p>
                  {Array.isArray(p.tags) && p.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {p.tags.map(t => <span key={t} className="cm-tag">{t}</span>)}
                    </div>
                  )}
                  {href && (
                    <a href={href} target="_blank" rel="noreferrer" style={{
                      fontFamily: "'Sora', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                      color: 'hsl(119 99% 46%)', textDecoration: 'none', letterSpacing: '0.08em',
                      opacity: isHov ? 1 : 0.7, transition: 'opacity 0.2s',
                    }}>View Project ↗</a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
