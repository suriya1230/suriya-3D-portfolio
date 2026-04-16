'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Static image map — matches your Firebase project titles to uploaded images
const PROJECT_IMAGES = {
  'videomind ai':        '/projects/videomind.png',
  'videomind':           '/projects/videomind.png',
  'loan ai':             '/projects/loan_ai.png',
  'loan-ai':             '/projects/loan_ai.png',
  'ai cyber defense':    '/projects/cyberdefence.png',
  'ai cyber defence':    '/projects/cyberdefence.png',
  'cyber defense':       '/projects/cyberdefence.png',
  'cyber defence':       '/projects/cyberdefence.png',
  'resume score checker':'/projects/resume_checker.png',
  'resume checker':      '/projects/resume_checker.png',
  'resume ai':           '/projects/resume_checker.png',
  'sentiment analysis':  '/projects/sentiment_analysis.png',
};

function getProjectImage(project) {
  if (project.imageUrl) return project.imageUrl;
  const key = (project.title || '').toLowerCase();
  for (const [match, src] of Object.entries(PROJECT_IMAGES)) {
    if (key.includes(match)) return src;
  }
  return null;
}

export default function ProjectsSection({ projects }) {
  const [hovered, setHovered] = useState(null);
  if (!projects?.length) return null;

  return (
    <section id="projects" style={{ padding: '7rem 64px', borderTop: '1px solid hsl(0 0% 15%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56 }}>
          <div>
            <div className="cm-num" style={{ marginBottom: 16 }}>02 — Work</div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Selected<br/><span style={{ color: 'hsl(0 0% 40%)', fontStyle: 'italic' }}>Projects</span>
            </h2>
          </div>
          <span className="cm-num">{projects.length} projects</span>
        </div>

        {/* Project rows */}
        <div style={{ borderTop: '1px solid hsl(0 0% 15%)' }}>
          {projects.map((p, i) => {
            const href = p.link || p.github || p.githubUrl || p.liveUrl || '';
            const isHov = hovered === i;
            const isEven = i % 2 === 1;
            const imgSrc = getProjectImage(p);

            return (
              <motion.div
                key={p.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '1fr 320px' : '320px 1fr',
                  gap: 56, alignItems: 'center',
                  padding: '44px 0',
                  borderBottom: '1px solid',
                  borderColor: isHov ? 'hsl(119 99% 46% / 0.2)' : 'hsl(0 0% 14%)',
                  transition: 'border-color 0.3s',
                }}>

                {/* IMAGE */}
                <div
                  onClick={() => href && window.open(href, '_blank')}
                  style={{
                    order: isEven ? 2 : 1,
                    position: 'relative', overflow: 'hidden',
                    borderRadius: 10, aspectRatio: '16/10',
                    background: 'hsl(0 0% 10%)',
                    cursor: href ? 'pointer' : 'default',
                  }}>
                  {imgSrc ? (
                    <img src={imgSrc} alt={p.title} style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
                      transform: isHov ? 'scale(1.06)' : 'scale(1)',
                    }}/>
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `hsl(0 0% ${11 + (i % 4) * 2}%)` }}>
                      <span style={{ fontFamily: "'Sora', sans-serif", fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', color: isHov ? 'hsl(119 99% 46% / 0.2)' : 'hsl(0 0% 96% / 0.07)', letterSpacing: '-0.04em', padding: '0 16px', textAlign: 'center', transition: 'color 0.4s' }}>
                        {p.title}
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', opacity: isHov ? 1 : 0, transition: 'opacity 0.35s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.68rem', fontWeight: 700, color: '#fff', letterSpacing: '0.2em', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: 3 }}>
                      {href ? 'Open Project ↗' : 'View Details →'}
                    </span>
                  </div>

                  {p.featured && (
                    <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: "'Sora', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'hsl(119 99% 46%)', background: 'hsl(119 99% 46% / 0.14)', border: '1px solid hsl(119 99% 46% / 0.45)', padding: '4px 12px', borderRadius: 4 }}>
                      Featured
                    </div>
                  )}
                </div>

                {/* TEXT */}
                <div style={{ order: isEven ? 1 : 2 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
                    <span className="cm-num" style={{ fontSize: '0.65rem', color: 'hsl(119 99% 46% / 0.7)', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: '1.3rem', letterSpacing: '-0.01em', color: isHov ? 'hsl(119 99% 46%)' : 'hsl(0 0% 93%)', transition: 'color 0.25s', lineHeight: 1.2 }}>
                      {p.title}
                    </h3>
                  </div>

                  <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: '0.88rem', color: 'hsl(0 0% 48%)', lineHeight: 1.8, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description || p.bio || 'An advanced AI system built to solve real-world problems with intelligent, scalable architecture.'}
                  </p>

                  {(p.tags || []).length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                      {(p.tags || []).slice(0, 4).map(t => (
                        <span key={t} className="cm-tag">{t}</span>
                      ))}
                    </div>
                  )}

                  {href && (
                    <a href={href} target="_blank" rel="noreferrer" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      fontFamily: "'Sora', sans-serif", fontSize: '0.75rem', fontWeight: 600,
                      color: isHov ? 'hsl(119 99% 46%)' : 'hsl(0 0% 45%)',
                      textDecoration: 'none', letterSpacing: '0.06em',
                      transition: 'color 0.25s',
                    }}>
                      View on GitHub <span>↗</span>
                    </a>
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