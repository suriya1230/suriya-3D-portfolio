'use client';
import { useState, useEffect } from 'react';
import { fetchRTDB } from '@/lib/rtdb';

const NAV_LINKS = [
  { label: 'About',     href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects',  href: '#projects' },
  { label: 'Skills',    href: '#skills' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    fetchRTDB('about').then(data => {
      const item = Array.isArray(data) ? data[0] : data;
      const url = item?.resumeUrl || item?.resume || item?.cvUrl || item?.cv || '';
      if (url) setResumeUrl(url);
    }).catch(() => {});
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: 64,
      background: scrolled ? 'hsla(0,0%,8%,0.95)' : 'transparent',
      borderBottom: scrolled ? '1px solid hsla(0,0%,20%,0.5)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(24px)' : 'none',
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      {/* Logo */}
      <a href="#top" style={{
        fontFamily: "'Sora', sans-serif", fontSize: '1.1rem', fontWeight: 700,
        color: 'hsl(0 0% 96%)', textDecoration: 'none', letterSpacing: '-0.01em',
      }}>SURIYA</a>

      {/* Center links */}
      <div className="hidden md:flex" style={{ gap: 32 }}>
        {NAV_LINKS.map(l => (
          <a key={l.label} href={l.href} className="cm-nav-link">{l.label}</a>
        ))}
      </div>

      {/* Right buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Download Resume */}
        <a
          href={resumeUrl || '#'}
          target={resumeUrl ? '_blank' : undefined}
          rel="noreferrer"
          onClick={!resumeUrl ? e => e.preventDefault() : undefined}
          className="hidden md:inline-flex"
          style={{
           fontFamily: "'Sora', sans-serif",
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '10px 20px',        // ✅ SAME PADDING
  borderRadius: 6,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '38px',              // ✅ FIXED HEIGHT
  gap: 6,
  transition: 'all 0.2s',
  color: 'hsl(119 99% 46%)',
    background: 'hsl(119 99% 46% / 0.1)',
    border: '1px solid hsl(119 99% 46% / 0.4)',
          }}
          onMouseEnter={e => { if(resumeUrl){ e.currentTarget.style.background='hsl(119 99% 46% / 0.18)'; e.currentTarget.style.borderColor='hsl(119 99% 46% / 0.7)'; }}}
          onMouseLeave={e => { e.currentTarget.style.background='hsl(119 99% 46% / 0.1)'; e.currentTarget.style.borderColor='hsl(119 99% 46% / 0.4)'; }}
        >
          ↓ Resume
        </a>

        {/* Hire Me */}
        <a href="#contact" className="hidden md:inline-flex" style={{
          fontFamily: "'Sora', sans-serif",
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '10px 20px',        // ✅ SAME PADDING
  borderRadius: 6,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '38px',              // ✅ FIXED HEIGHT
  gap: 6,
  transition: 'all 0.2s',
  color: 'hsl(0 0% 96%)',
    background: 'hsl(0 0% 18%)',
    border: '1px solid transparent',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'hsl(0 0% 26%)'}
        onMouseLeave={e => e.currentTarget.style.background = 'hsl(0 0% 18%)'}>
          Hire Me
        </a>
          {/* EXIT BUTTON (NOW INLINE ✅) */}
  <a href="/" style={{
    fontFamily: "'Sora', sans-serif",
  fontSize: '0.68rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  padding: '10px 20px',        // ✅ SAME PADDING
  borderRadius: 6,
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '38px',              // ✅ FIXED HEIGHT
  gap: 6,
  transition: 'all 0.2s',
  color: 'hsl(119 99% 46%)',
    background: 'hsl(119 99% 46% / 0.1)',
    border: '1px solid hsl(119 99% 46% / 0.4)',
  }}>
    ← Exit
  </a>
      </div>
    </nav>
  );
}