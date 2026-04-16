// app/admin-login/page.js
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { adminLogin } from '@/lib/auth';
import { onAuthChange } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      if (user) router.replace('/admin-dashboard');
      else setCheckingAuth(false);
    });
    return () => unsub();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success('Welcome back, Admin');
      router.push('/admin-dashboard');
    } catch (err) {
      toast.error('Invalid credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-white/30 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>Authenticating...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative">
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.05) 0%, transparent 65%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <div
            className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}
          >
            Restricted Access
          </div>
          <h1
            className="text-4xl font-light"
            style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}
          >
            Admin Portal
          </h1>
        </div>

        <div
          className="glass-card rounded-2xl p-8"
          style={{ boxShadow: '0 0 60px rgba(201,168,76,0.06)' }}
        >
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@suriya.dev"
                className="input-field w-full"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs text-white/40 mb-2 tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full py-3 mt-2">
              {loading ? 'Signing In...' : 'Sign In →'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="text-xs text-white/25 hover:text-white/45 transition-colors" style={{ fontFamily: 'var(--font-mono)' }}>
              ← Back to Portfolio
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
