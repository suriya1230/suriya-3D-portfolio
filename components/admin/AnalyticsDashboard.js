// components/admin/AnalyticsDashboard.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { fetchVisitsRTDB } from '@/lib/rtdb';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const CHART_COLORS = ['#c9a84c', '#00d4ff', '#a855f7', '#22c55e', '#f97316'];

function StatCard({ label, value, icon, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-xl p-5"
      style={{ border: `1px solid ${color}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl" style={{ filter: `drop-shadow(0 0 8px ${color})` }}>
          {icon}
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: `${color}15`, color, fontFamily: 'var(--font-mono)' }}
        >
          LIVE
        </div>
      </div>
      <div
        className="text-3xl font-light mb-1"
        style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}
      >
        {value}
      </div>
      <div className="text-xs text-white/35 tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-card px-4 py-3 rounded-lg text-sm"
      style={{ border: '1px solid rgba(201,168,76,0.2)' }}
    >
      <div className="text-white/40 mb-1 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  );
};

// Safely convert RTDB timestamp (number or Firestore Timestamp) to Date
function toDate(ts) {
  if (!ts) return new Date();
  if (typeof ts === 'number') return new Date(ts);
  if (ts.toDate) return ts.toDate(); // Firestore Timestamp
  if (ts.seconds) return new Date(ts.seconds * 1000); // Firestore-like
  return new Date(ts);
}

function formatTime(ts) {
  try {
    return toDate(ts).toLocaleString();
  } catch {
    return '—';
  }
}

export default function AnalyticsDashboard() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVisitsRTDB();
      setVisits(data);
    } catch (e) {
      console.error('Analytics load error:', e);
      setError(e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="text-white/30 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="text-red-400/70 text-sm mb-4" style={{ fontFamily: 'var(--font-mono)' }}>
          Error: {error}
        </div>
        <button
          onClick={loadData}
          className="text-xs px-4 py-2 rounded-lg"
          style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)' }}
        >
          Retry
        </button>
      </div>
    );
  }

  // ── Compute stats ──
  const total = visits.length;
  const uniqueNames = new Set(visits.map((v) => v.name).filter(Boolean)).size;
  const agenticCount = visits.filter((v) => v.mode === 'agentic').length;
  const manualCount = visits.filter((v) => v.mode === 'manual').length;

  // ── Monthly data ──
  const monthlyMap = {};
  visits.forEach((v) => {
    if (!v.timestamp) return;
    const date = toDate(v.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([month, count]) => ({ month, count }));

  // ── Mode pie data ──
  const pieData = [
    { name: 'Manual', value: manualCount },
    { name: 'Agentic', value: agenticCount },
    { name: 'Entry Only', value: Math.max(0, total - manualCount - agenticCount) },
  ].filter((d) => d.value > 0);

  // ── Company bar data ──
  const companyMap = {};
  visits.forEach((v) => {
    if (v.company && v.company.trim()) {
      const co = v.company.trim();
      companyMap[co] = (companyMap[co] || 0) + 1;
    }
  });
  const companyData = Object.entries(companyMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([company, count]) => ({ company, count }));

  // ── Recent visitors (already sorted newest-first by fetchVisitsRTDB) ──
  const recent = visits.slice(0, 15);

  const axisStyle = { fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' };
  const gridStyle = { stroke: 'rgba(255,255,255,0.04)' };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
            Analytics
          </div>
          <h1 className="text-3xl font-light" style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}>
            Visitor Insights
          </h1>
        </div>
        <button
          onClick={loadData}
          className="text-xs px-4 py-2 rounded-lg transition-all"
          style={{ border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)', background: 'rgba(201,168,76,0.06)' }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total Visits" value={total} icon="◎" color="#c9a84c" delay={0} />
        <StatCard label="Unique Visitors" value={uniqueNames} icon="◉" color="#00d4ff" delay={0.1} />
        <StatCard label="Agentic Mode" value={agenticCount} icon="◈" color="#a855f7" delay={0.2} />
        <StatCard label="Manual Mode" value={manualCount} icon="⬡" color="#22c55e" delay={0.3} />
      </div>

      {total === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="text-4xl mb-4 opacity-20">◎</div>
          <p className="text-white/30 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            No visitor data yet. Share your portfolio to start collecting analytics.
          </p>
        </div>
      ) : (
        <>
          {/* Charts row */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* Line chart */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-5 lg:col-span-2"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-xs text-white/40 mb-4" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                MONTHLY VISITORS
              </div>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid {...gridStyle} />
                    <XAxis dataKey="month" tick={axisStyle} />
                    <YAxis tick={axisStyle} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone" dataKey="count" stroke="#c9a84c"
                      strokeWidth={2} dot={{ fill: '#c9a84c', r: 4 }}
                      activeDot={{ r: 6 }} name="Visitors"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-white/20 text-sm">
                  No monthly data yet
                </div>
              )}
            </motion.div>

            {/* Pie chart */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-5"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-xs text-white/40 mb-4" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                MODE USAGE
              </div>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-48 flex items-center justify-center text-white/20 text-sm">No mode data</div>
              )}
            </motion.div>
          </div>

          {/* Company bar chart */}
          {companyData.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-5 mb-6"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-xs text-white/40 mb-4" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                VISITS BY COMPANY
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={companyData}>
                  <CartesianGrid {...gridStyle} />
                  <XAxis dataKey="company" tick={axisStyle} />
                  <YAxis tick={axisStyle} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#c9a84c" radius={[4, 4, 0, 0]} name="Visits" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Recent visitors table */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="glass-card rounded-xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
              <div className="text-xs text-white/40" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
                RECENT VISITORS
              </div>
              <div className="text-xs text-white/20" style={{ fontFamily: 'var(--font-mono)' }}>
                {recent.length} of {total}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Name', 'Company', 'Mode', 'Time'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs text-white/30 font-normal tracking-wider"
                        style={{ fontFamily: 'var(--font-mono)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((v) => (
                    <tr
                      key={v.id}
                      className="transition-colors hover:bg-white/[0.02]"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    >
                      <td className="px-5 py-3 text-white/70">{v.name || '—'}</td>
                      <td className="px-5 py-3 text-white/40">{v.company || '—'}</td>
                      <td className="px-5 py-3">
                        {v.mode ? (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: v.mode === 'agentic' ? 'rgba(168,85,247,0.15)' : 'rgba(201,168,76,0.1)',
                              color: v.mode === 'agentic' ? '#a855f7' : 'var(--gold)',
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            {v.mode}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3 text-white/30 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                        {formatTime(v.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
