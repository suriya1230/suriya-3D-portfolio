// components/portfolio/Navbar.js
'use client';
import { useState, useEffect } from 'react';
import { fetchRTDB } from '@/lib/rtdb';
import { useResponsive } from '@/hooks/useResponsive';

const NAV_LINKS = [
  { label: 'About',     href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Projects',  href: '#projects' },
  { label: 'Skills',    href: '#skills' },
  { label: 'Contact',   href: '#contact' },
];

export default function Navbar() {
  const { isMobile } = useResponsive();
  const [scrolled, setScrolled]   = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close menu when switching to desktop
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);

  useEffect(() => {
    fetchRTDB('about').then(data => {
      const item = Array.isArray(data) ? data[0] : data;
      const url = item?.resumeUrl || item?.resume || item?.cvUrl || '';
      if (url) setResumeUrl(url);
    }).catch(() => {});
  }, []);

  const navBg     = scrolled ? 'rgba(10,10,10,0.96)' : 'transparent';
  const navBorder = scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent';
  const blur      = scrolled ? 'blur(24px)' : 'none';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 16px' : '0 40px',
        height: isMobile ? 56 : 64,
        background: navBg, borderBottom: navBorder,
        backdropFilter: blur, WebkitBackdropFilter: blur,
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        {/* Logo */}
        <a href="#top" style={{
          fontFamily: "'Sora', sans-serif", fontSize: isMobile ? '0.95rem' : '1.1rem',
          fontWeight: 700, color: 'hsl(0 0% 96%)', textDecoration: 'none', letterSpacing: '-0.01em',
        }}>SURIYA</a>

        {/* Desktop center links */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: 32 }}>
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="cm-nav-link">{l.label}</a>
            ))}
          </div>
        )}

        {/* Desktop right buttons */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" style={{
                fontFamily: "'Sora', sans-serif", fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                padding: '0 18px', borderRadius: 6, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', height: 36,
                color: 'hsl(119 99% 46%)', background: 'hsl(119 99% 46% / 0.1)',
                border: '1px solid hsl(119 99% 46% / 0.4)', transition: 'all 0.2s',
              }}>↓ Resume</a>
            )}
            <a href="#contact" style={{
              fontFamily: "'Sora', sans-serif", fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0 18px', borderRadius: 6, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', height: 36,
              color: 'hsl(0 0% 96%)', background: 'hsl(0 0% 18%)', border: '1px solid transparent',
              transition: 'all 0.2s',
            }}>Hire Me</a>
            <a href="/" style={{
              fontFamily: "'Sora', sans-serif", fontSize: '0.68rem', fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0 16px', borderRadius: 6, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', height: 36,
              color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s',
            }}>← Exit</a>
          </div>
        )}

        {/* Mobile right — exit + hamburger */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <a href="/" style={{
              fontFamily: "'Sora', sans-serif", fontSize: '0.65rem', fontWeight: 600,
              padding: '7px 12px', borderRadius: 6, textDecoration: 'none',
              color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>← Exit</a>
            <button onClick={() => setMenuOpen(p => !p)} style={{
              width: 38, height: 38, borderRadius: 8,
              background: menuOpen ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {menuOpen ? '×' : '☰'}
            </button>
          </div>
        )}
      </nav>

      {/* Mobile drawer menu */}
      {isMobile && menuOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, zIndex: 49,
          background: 'rgba(8,8,8,0.98)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        }}>
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '14px 20px',
              fontFamily: "'Sora', sans-serif", fontSize: '0.9rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              letterSpacing: '0.02em',
            }}>{l.label}</a>
          ))}
          {/* Mobile CTA row */}
          <div style={{ display: 'flex', gap: 10, padding: '12px 16px 16px' }}>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)} style={{
                flex: 1, padding: '11px 0', textAlign: 'center', borderRadius: 8,
                fontFamily: "'Sora', sans-serif", fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
                color: 'hsl(119 99% 46%)', background: 'hsl(119 99% 46% / 0.1)',
                border: '1px solid hsl(119 99% 46% / 0.35)',
              }}>↓ Resume</a>
            )}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{
              flex: 1, padding: '11px 0', textAlign: 'center', borderRadius: 8,
              fontFamily: "'Sora', sans-serif", fontSize: '0.72rem', fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none',
              color: 'hsl(0 0% 96%)', background: 'hsl(0 0% 20%)',
            }}>Hire Me</a>
          </div>
        </div>
      )}
    </>
  );
}
