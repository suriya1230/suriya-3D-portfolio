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
      <AdminSidebar
        sections={SECTIONS}
        active={activeSection}
        onSelect={setActiveSection}
        onLogout={handleLogout}
        user={user}
      />

      <main className="flex-1 ml-64 p-8 overflow-y-auto min-h-screen">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeSection === 'analytics' ? (
            <AnalyticsDashboard />
          ) : (
            <CRUDPanel section={activeSection} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
