// app/admin-dashboard/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChange, adminLogout } from '@/lib/auth';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CRUDPanel from '@/components/admin/CRUDPanel';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';

const SECTIONS = ['analytics', 'about', 'education', 'projects', 'certificates', 'skills', 'achievements'];

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      if (!u) {
        router.replace('/admin-login');
      } else {
        setUser(u);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await adminLogout();
    toast.success('Logged out');
    router.push('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-white/30 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <div className="hidden lg:block">
        <AdminSidebar
          sections={SECTIONS}
          active={activeSection}
          onSelect={setActiveSection}
          onLogout={handleLogout}
          user={user}
          isOpen={true}
          onClose={() => {}}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <div className="lg:hidden">
        <AdminSidebar
          sections={SECTIONS}
          active={activeSection}
          onSelect={setActiveSection}
          onLogout={handleLogout}
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-4 px-4 py-4 sticky top-0 z-20"
          style={{ background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/50 hover:text-white/80 transition-colors text-xl leading-none p-1"
            aria-label="Open menu"
          >
            ☰
          </button>
          <div>
            <span className="text-sm font-light capitalize gold-text" style={{ fontFamily: 'var(--font-display)' }}>
              {activeSection}
            </span>
            <span className="text-xs text-white/25 ml-2" style={{ fontFamily: 'var(--font-mono)' }}>
              CMS
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {activeSection === 'analytics' ? (
              <AnalyticsDashboard />
            ) : (
              <CRUDPanel section={activeSection} />
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
