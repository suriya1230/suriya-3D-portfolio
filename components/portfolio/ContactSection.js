// components/portfolio/ContactSection.js
'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchRTDB } from '@/lib/rtdb';
import { useResponsive } from '@/hooks/useResponsive';

export default function ContactSection() {
  const { isMobile } = useResponsive();
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    fetchRTDB('contact').then(d => { if (d?.length) setContacts(d); }).catch(() => {});
  }, []);
  const fallback = [
    { title: 'ssuriyas380@gmail.com', subtitle: 'Email', link: 'mailto:ssuriyas380@gmail.com' },
    { title: '+91 9360830989', subtitle: 'Phone / WhatsApp', link: 'tel:+919360830989' },
    { title: 'github.com/suriya1230', subtitle: 'GitHub', link: 'https://github.com/suriya1230' },
    { title: 'LinkedIn Profile', subtitle: 'LinkedIn', link: 'https://www.linkedin.com/in/suriya-s-768b91282' },
  ];
  const items = contacts.length ? contacts : fallback;

  return (
    <section id="contact" className="cm-section" style={{ padding: isMobile ? '4rem 20px' : '7rem 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="cm-num" style={{ marginBottom: 16 }}>07 — Contact</div>
        <motion.h2 className="cm-display"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: isMobile ? 'clamp(2.4rem, 12vw, 3.5rem)' : 'clamp(3rem, 7vw, 7rem)', marginBottom: isMobile ? 36 : 60, lineHeight: 1 }}>
          Let's work<br /><span style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.25)' }}>together.</span>
        </motion.h2>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: isMobile ? 36 : 64 }}>
          {items.map((item, i) => {
            const href = item.link || item.url || item.href || '';
            const isExt = href.startsWith('http');
            return (
              <motion.a key={i} href={href} target={isExt ? '_blank' : undefined} rel="noreferrer"
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="cm-contact-row" style={{ padding: isMobile ? '16px 0' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 20 }}>
                  <span className="cm-num" style={{ minWidth: isMobile ? 20 : 24 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: isMobile ? '0.88rem' : '1.05rem', color: '#f0ebe0', marginBottom: 2 }}>
                      {item.title || item.name}
                    </div>
                    <div className="cm-mono" style={{ fontSize: '0.62rem' }}>{item.subtitle || item.description || ''}</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                  {isExt ? '↗' : '→'}
                </span>
              </motion.a>
            );
          })}
        </div>

        <div style={{
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between', gap: isMobile ? 6 : 0,
          paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <span className="cm-display" style={{ fontSize: isMobile ? '1.4rem' : '1.8rem' }}>Suriya</span>
          <span className="cm-mono" style={{ fontSize: '0.62rem' }}>Crafted with precision · {new Date().getFullYear()}</span>
          <span className="cm-mono" style={{ fontSize: '0.62rem' }}>Chennai, India</span>
        </div>
      </div>
    </section>
  );
}
