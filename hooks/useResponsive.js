// hooks/useResponsive.js
'use client';
import { useState, useEffect } from 'react';

/**
 * Returns { isMobile } — true when viewport < 768px.
 * Updates automatically on resize. No button, no toggle.
 */
export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // rAF-throttled: this hook is mounted by many components at once, so an
    // unthrottled resize listener means every one of them recomputes on every tick.
    let ticking = false;
    const check = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsMobile(window.innerWidth < 768);
        ticking = false;
      });
    };
    setIsMobile(window.innerWidth < 768); // run on mount, unthrottled
    window.addEventListener('resize', check, { passive: true });
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile };
}
