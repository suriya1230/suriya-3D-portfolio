// components/admin/AdminSidebar.js
'use client';

const ICONS = {
  analytics: '◎',
  about: '◈',
  education: '⬡',
  projects: '◻',
  certificates: '◉',
  skills: '△',
  achievements: '★',
};

export default function AdminSidebar({ sections, active, onSelect, onLogout, user }) {
  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40"
      style={{
        background: 'rgba(5,5,8,0.97)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/5">
        <div
          className="text-2xl font-light gold-text mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Suriya CMS
        </div>
        <div className="text-xs text-white/25" style={{ fontFamily: 'var(--font-mono)' }}>
          Admin Dashboard
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
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
            onClick={() => onSelect(section)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200"
            style={{
              background: active === section ? 'rgba(201,168,76,0.1)' : 'transparent',
              border: `1px solid ${active === section ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
              color: active === section ? 'var(--gold-light)' : 'rgba(255,255,255,0.4)',
            }}
          >
            <span className="text-base w-5 text-center">{ICONS[section] || '◻'}</span>
            <span
              className="text-sm capitalize"
              style={{ fontFamily: 'var(--font-body)' }}
            >
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
  );
}
