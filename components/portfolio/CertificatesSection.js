'use client';
import { motion } from 'framer-motion';

export default function CertificatesSection({ certificates }) {
  if (!certificates?.length) return null;
  return (
    <section id="certificates" className="cm-section" style={{ padding: '7rem 64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="cm-num" style={{ marginBottom: 16 }}>03 — Certificates</div>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 56 }}>
          Credentials &amp;<br/><span style={{ color: 'hsl(0 0% 40%)', fontStyle: 'italic' }}>Achievements</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, border: '1px solid hsl(0 0% 18%)' }}>
          {certificates.map((cert, i) => (
            <motion.div key={cert.id || i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{ padding: '28px 24px', border: '1px solid hsl(0 0% 15%)', background: 'hsl(0 0% 9%)', transition: 'background 0.3s, border-color 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'hsl(0 0% 12%)'; e.currentTarget.style.borderColor = 'hsl(119 99% 46% / 0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'hsl(0 0% 9%)'; e.currentTarget.style.borderColor = 'hsl(0 0% 15%)'; }}>
              <div className="cm-num" style={{ marginBottom: 14 }}>{String(i + 1).padStart(2, '0')}</div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.95rem', fontWeight: 500, color: 'hsl(0 0% 88%)', marginBottom: 8, lineHeight: 1.4 }}>{cert.title || cert.name}</h3>
              <div className="cm-mono" style={{ fontSize: '0.62rem' }}>{cert.issuer || cert.subtitle || ''}</div>
              {cert.year && <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.6rem', marginTop: 10, color: 'hsl(119 99% 46% / 0.6)', fontWeight: 500 }}>{cert.year}</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}