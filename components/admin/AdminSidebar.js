// components/admin/AdminSidebar.js
'use client';
import { useEffect } from 'react';

const ICONS = {
  analytics: '◎',
  about: '◈',
  education: '⬡',
  projects: '◻',
  certificates: '◉',
  skills: '△',
  achievements: '★',
};

export default function AdminSidebar({ sections, active, onSelect, onLogout, user, isOpen, onClose }) {
  // Close on outside click (mobile overlay)
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.target.classList.contains('sidebar-overlay')) onClose?.();
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [isOpen, onClose]);

  // Lock body scroll when open on mobile
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSelect = (section) => {
    onSelect(section);
    onClose?.(); // close sidebar on mobile after selecting
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="sidebar-overlay fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        />
      )}

      <aside
        className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40 transition-transform duration-300"
        style={{
          background: 'rgba(5,5,8,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          // On mobile: slide in/out. On lg+: always visible.
          transform: isOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-light gold-text mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>
                Suriya CMS
              </div>
              <div className="text-xs text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>Admin Dashboard</div>
            </div>
            {/* Close button — mobile only */}
            <button
              className="lg:hidden text-white/30 hover:text-white/60 transition-colors text-xl leading-none"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)' }}
            >
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white/70 truncate">{user?.email}</div>
              <div className="text-xs text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>Administrator</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {sections.map((section) => (
            <button
              key={section}
              onClick={() => handleSelect(section)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
              style={{
                background: active === section ? 'rgba(201,168,76,0.1)' : 'transparent',
                border: `1px solid ${active === section ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
                color: active === section ? 'var(--gold-light)' : 'rgba(255,255,255,0.4)',
              }}
            >
              <span className="text-base w-5 text-center">{ICONS[section] || '◻'}</span>
              <span className="text-sm capitalize" style={{ fontFamily: 'var(--font-body)' }}>
                {section}
              </span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            <span>↗</span> View Portfolio
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/30 hover:text-red-400 transition-colors text-sm"
          >
            <span>⏻</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
