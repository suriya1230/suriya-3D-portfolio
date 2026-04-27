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
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); // run on mount
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return { isMobile };
}
