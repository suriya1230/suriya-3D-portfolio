'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { fetchRTDB } from '@/lib/rtdb';

export default function ContactSection() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchRTDB('contact').then(data => { if (data?.length) setContacts(data); }).catch(() => {});
  }, []);

  const fallback = [
    { title: 'ssuriyas380@gmail.com', subtitle: 'Email', link: 'mailto:ssuriyas380@gmail.com', icon: 'mail' },
    { title: '+91 9360830989', subtitle: 'Phone / WhatsApp', link: 'tel:+919360830989', icon: 'phone' },
    { title: 'github.com/suriya1230', subtitle: 'GitHub', link: 'https://github.com/suriya1230', icon: 'github' },
    { title: 'LinkedIn Profile', subtitle: 'LinkedIn', link: 'https://www.linkedin.com/in/suriya-s-768b91282', icon: 'linkedin' },
  ];

  const items = contacts.length ? contacts : fallback;

  return (
    <section id="contact" className="cm-section" style={{ padding: '7rem 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* header */}
        <div className="cm-num" style={{ marginBottom: 16 }}>06 — Contact</div>

        {/* large CTA heading */}
        <motion.h2 className="cm-display" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', marginBottom: 60, lineHeight: 1 }}>
          Let's work<br/>
          <span style={{ fontStyle: 'italic', color: 'rgba(240,235,224,0.25)' }}>together.</span>
        </motion.h2>

        {/* contact rows */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 64 }}>
          {items.map((item, i) => {
            const href = item.link || item.url || item.href || '';
            const isExt = href.startsWith('http');
            return (
              <motion.a key={i} href={href} target={isExt ? '_blank' : undefined} rel="noreferrer"
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="cm-contact-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <span className="cm-num" style={{ minWidth: 24 }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#f0ebe0', marginBottom: 2 }}>{item.title || item.name}</div>
                    <div className="cm-mono" style={{ fontSize: '0.65rem' }}>{item.subtitle || item.description || ''}</div>
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                  {isExt ? '↗' : '→'}
                </span>
              </motion.a>
            );
          })}
        </div>

        {/* footer strip */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="cm-display" style={{ fontSize: '1.8rem' }}>Suriya</span>
          <span className="cm-mono" style={{ fontSize: '0.62rem' }}>Crafted with precision · {new Date().getFullYear()}</span>
          <span className="cm-mono" style={{ fontSize: '0.62rem' }}>Chennai, India</span>
        </div>
      </div>
    </section>
  );
}