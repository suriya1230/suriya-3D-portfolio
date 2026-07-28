// components/portfolio/HeroSection.js
'use client';
import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function HeroSection({ about }) {
  const { isMobile } = useResponsive();
  const splineAppRef = useRef(null);
  // Mount the Spline scene one idle tick after first paint instead of immediately —
  // text/layout paints instantly, the heavy WebGL scene loads a beat later.
  const [mountSpline, setMountSpline] = useState(false);

  useEffect(() => {
    if (isMobile) return;
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMountSpline(true), { timeout: 1500 })
      : setTimeout(() => setMountSpline(true), 200);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
  }, [isMobile]);

  // Pause the Spline runtime while the tab is hidden so it isn't rendering in the
  // background, and resume when the visitor comes back.
  useEffect(() => {
    const onVisibility = () => {
      const app = splineAppRef.current;
      if (!app) return;
      if (document.hidden) app.stop();
      else app.play();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);
  const name = about?.name    || 'Suriya';
  const role = about?.tagline || 'AI Engineer & Researcher';
  const bio  = about?.bio     || 'Building intelligent systems that learn, adapt, and solve real-world problems using advanced AI technologies.';
  const [firstName, ...rest] = name.split(' ');
  const lastName = rest.join(' ');

  return (
    <section id="top" style={{
      position: 'relative',
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'flex-end',
      background: 'hsl(0 0% 8%)',
      overflow: 'hidden',
    }}>
      {/* 3D Background — desktop only, mounted a beat after first paint */}
      {!isMobile && mountSpline && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: 'hsl(0 0% 8%)' }} />}>
            <Spline scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
              style={{ width: '100%', height: '100%' }}
              onLoad={(app) => { splineAppRef.current = app; if (document.hidden) app.stop(); }} />
          </Suspense>
        </div>
      )}

      {/* Mobile gradient background */}
      {isMobile && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(ellipse at 80% 10%, hsl(119 99% 46% / 0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 10% 90%, hsl(240 60% 50% / 0.06) 0%, transparent 50%),
            hsl(0 0% 8%)
          `,
        }} />
      )}

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: isMobile ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.35)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, pointerEvents: 'none',
        width: '100%',
        maxWidth: isMobile ? '100%' : 680,
        padding: isMobile ? '0 22px 56px' : '0 40px 48px',
      }}>
        {/* Role badge */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', marginBottom: 14 }}>
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: isMobile ? '0.58rem' : '0.65rem',
            fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'hsl(119 99% 46%)',
            border: '1px solid hsl(119 99% 46% / 0.35)',
            padding: '5px 14px', borderRadius: 4,
            background: 'hsl(119 99% 46% / 0.08)',
          }}>{role}</span>
        </div>

        {/* Name */}
        <h1 className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.2s',
          fontFamily: "'Sora', sans-serif",
          fontSize: isMobile ? 'clamp(3rem, 15vw, 5rem)' : 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.04em',
          color: 'hsl(0 0% 96%)', marginBottom: 8, textTransform: 'uppercase',
        }}>
          {firstName}
          {lastName && <> <span style={{ color: 'hsl(119 99% 46%)' }}>{lastName}</span></>}
        </h1>

        {/* Subheading */}
        <p className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.4s',
          fontFamily: "'Sora', sans-serif",
          fontSize: isMobile ? '1.1rem' : 'clamp(1.1rem, 2.5vw, 1.75rem)',
          fontWeight: 300, color: 'hsl(0 0% 96% / 0.8)', marginBottom: 14, lineHeight: 1.4,
        }}>Building intelligence that matters.</p>

        {/* Bio */}
        <p className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.55s',
          fontFamily: "'Sora', sans-serif",
          fontSize: isMobile ? '0.84rem' : 'clamp(0.85rem, 1.5vw, 1.05rem)',
          fontWeight: 300, color: 'hsl(0 0% 60%)',
          marginBottom: isMobile ? 24 : 28, lineHeight: 1.75, maxWidth: 500,
        }}>
          {bio.length > 160 ? bio.slice(0, 158) + '…' : bio}
        </p>

        {/* CTAs */}
        <div className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.7s',
          display: 'flex', flexWrap: 'wrap', gap: isMobile ? 10 : 12, pointerEvents: 'auto',
        }}>
          <a href="#projects" style={{
            fontFamily: "'Sora', sans-serif", fontSize: isMobile ? '0.78rem' : '0.8rem',
            fontWeight: 600, background: 'hsl(119 99% 46%)', color: 'hsl(0 0% 4%)',
            padding: isMobile ? '12px 22px' : '14px 28px', borderRadius: 4,
            textDecoration: 'none', letterSpacing: '0.06em', transition: 'filter 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>
            View My Work
          </a>
          <a href="#contact" style={{
            fontFamily: "'Sora', sans-serif", fontSize: isMobile ? '0.78rem' : '0.8rem',
            fontWeight: 600, background: '#ffffff', color: 'hsl(0 0% 8%)',
            padding: isMobile ? '12px 22px' : '14px 28px', borderRadius: 4,
            textDecoration: 'none', letterSpacing: '0.06em', transition: 'filter 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>
            Get In Touch
          </a>
        </div>

        {/* Trust line */}
        <p className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.85s',
          fontFamily: "'Sora', sans-serif", fontSize: '0.7rem', fontWeight: 300,
          color: 'hsl(0 0% 60% / 0.5)', marginTop: 20, letterSpacing: '0.06em',
        }}>
          AI Engineer · Chennai, India · Open to opportunities
        </p>
      </div>

      {/* Scroll hint — desktop only */}
      {!isMobile && (
        <div className="opacity-0 animate-fade-in" style={{
          animationDelay: '1.4s', position: 'absolute', bottom: 36, right: 48,
          zIndex: 10, display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none',
        }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(0 0% 40%)' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, hsl(0 0% 40%), transparent)' }} />
        </div>
      )}
    </section>
  );
}
