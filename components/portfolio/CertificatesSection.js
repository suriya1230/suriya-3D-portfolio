// components/portfolio/CertificatesSection.js
'use client';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

export default function CertificatesSection({ certificates }) {
  const { isMobile } = useResponsive();
  if (!certificates?.length) return null;
  return (
    <section id="certificates" className="cm-section" style={{ padding: isMobile ? '4rem 20px' : '7rem 64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="cm-num" style={{ marginBottom: 16 }}>04 — Certificates</div>
        <h2 style={{
          fontFamily: "'Sora', sans-serif", fontWeight: 300,
          fontSize: isMobile ? 'clamp(2rem, 9vw, 2.6rem)' : 'clamp(2.4rem, 4.5vw, 3.8rem)',
          color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 40,
        }}>
          Credentials &amp;<br /><span style={{ color: 'hsl(0 0% 40%)', fontStyle: 'italic' }}>Achievements</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 1, border: '1px solid hsl(0 0% 18%)',
        }}>
          {certificates.map((cert, i) => (
            <motion.div key={cert.id || i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                padding: isMobile ? '16px 14px' : '28px 24px',
                border: '1px solid hsl(0 0% 15%)', background: 'hsl(0 0% 9%)',
                transition: 'background 0.3s, border-color 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'hsl(0 0% 12%)'; e.currentTarget.style.borderColor = 'hsl(119 99% 46% / 0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'hsl(0 0% 9%)'; e.currentTarget.style.borderColor = 'hsl(0 0% 15%)'; }}>
              <div className="cm-num" style={{ marginBottom: 10 }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: isMobile ? '0.82rem' : '0.95rem', fontWeight: 500, color: 'hsl(0 0% 88%)', marginBottom: 6, lineHeight: 1.4 }}>
                {cert.title || cert.name}
              </h3>
              <div className="cm-mono" style={{ fontSize: '0.6rem' }}>{cert.issuer || cert.subtitle || ''}</div>
              {(cert.year || cert.date) && (
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.6rem', marginTop: 8, color: 'hsl(119 99% 46% / 0.6)', fontWeight: 500 }}>
                  {cert.year || cert.date}
                </div>
              )}
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" style={{
                  display: 'inline-block', marginTop: 8,
                  fontFamily: "'Sora', sans-serif", fontSize: '0.6rem', fontWeight: 600,
                  color: 'hsl(119 99% 46%)', textDecoration: 'none',
                }}>View ↗</a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
