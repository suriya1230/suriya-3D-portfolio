'use client';
import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function HeroSection({ about }) {
  const name   = about?.name    || 'Suriya';
  const role   = about?.tagline || 'AI Engineer & Researcher';
  const bio    = about?.bio     || 'Building intelligent systems that learn, adapt, and solve real-world problems using advanced AI technologies.';

  return (
    <section id="top" style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'flex-end',
      background: 'hsl(0 0% 8%)', overflow: 'hidden',
    }}>
      {/* ── SPLINE 3D BACKGROUND ── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Suspense fallback={<div style={{ position: 'absolute', inset: 0, background: 'hsl(0 0% 8%)' }}/>}>
          <Spline
            scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      </div>

      {/* ── DARK OVERLAY ── */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 1, pointerEvents: 'none' }}/>

      {/* ── CONTENT — bottom-left ── */}
      <div style={{
        position: 'relative', zIndex: 10, pointerEvents: 'none',
        width: '100%', maxWidth: 680,
        padding: '0 40px 48px',
      }}>
        {/* Role badge */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', marginBottom: 16 }}>
          <span style={{
            fontFamily: "'Sora', sans-serif", fontSize: '0.65rem', fontWeight: 500,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'hsl(119 99% 46%)',
            border: '1px solid hsl(119 99% 46% / 0.35)',
            padding: '5px 14px', borderRadius: 4,
            background: 'hsl(119 99% 46% / 0.08)',
          }}>
            {role}
          </span>
        </div>

        {/* HUGE NAME */}
        <h1 className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.2s',
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          color: 'hsl(0 0% 96%)',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}>
          {name.split(' ')[0]}
          {name.split(' ').length > 1 && (
            <> <span style={{ color: 'hsl(119 99% 46%)' }}>{name.split(' ').slice(1).join(' ')}</span></>
          )}
        </h1>

        {/* Subheading */}
        <p className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.4s',
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
          fontWeight: 300,
          color: 'hsl(0 0% 96% / 0.8)',
          marginBottom: 16,
          lineHeight: 1.4,
        }}>
          Building intelligence that matters.
        </p>

        {/* Description */}
        <p className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.55s',
          fontFamily: "'Sora', sans-serif",
          fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
          fontWeight: 300,
          color: 'hsl(0 0% 60%)',
          marginBottom: 28,
          lineHeight: 1.75,
          maxWidth: 500,
        }}>
          {bio.length > 180 ? bio.slice(0, 178) + '…' : bio}
        </p>

        {/* CTAs */}
        <div className="opacity-0 animate-fade-up" style={{ animationDelay: '0.7s', display: 'flex', flexWrap: 'wrap', gap: 12, pointerEvents: 'auto' }}>
          <a href="#projects" style={{
            fontFamily: "'Sora', sans-serif", fontSize: '0.8rem', fontWeight: 600,
            background: 'hsl(119 99% 46%)', color: 'hsl(0 0% 4%)',
            padding: '14px 28px', borderRadius: 4, textDecoration: 'none',
            letterSpacing: '0.06em', transition: 'filter 0.2s, transform 0.15s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            View My Work
          </a>
          <a href="#contact" style={{
            fontFamily: "'Sora', sans-serif", fontSize: '0.8rem', fontWeight: 600,
            background: '#ffffff', color: 'hsl(0 0% 8%)',
            padding: '14px 28px', borderRadius: 4, textDecoration: 'none',
            letterSpacing: '0.06em', transition: 'filter 0.2s, transform 0.15s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.filter = 'brightness(0.9)'}
          onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            Get In Touch
          </a>
        </div>

        {/* Trust line */}
        <p className="opacity-0 animate-fade-up" style={{
          animationDelay: '0.85s',
          fontFamily: "'Sora', sans-serif", fontSize: '0.72rem', fontWeight: 300,
          color: 'hsl(0 0% 60% / 0.55)',
          marginTop: 24, letterSpacing: '0.06em',
        }}>
          AI Engineer · Chennai, India · Open to opportunities
        </p>
      </div>

      {/* scroll hint */}
      <div className="opacity-0 animate-fade-in" style={{
        animationDelay: '1.4s', position: 'absolute', bottom: 36, right: 48,
        zIndex: 10, display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none',
      }}>
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'hsl(0 0% 40%)' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, hsl(0 0% 40%), transparent)' }}/>
      </div>
    </section>
  );
}