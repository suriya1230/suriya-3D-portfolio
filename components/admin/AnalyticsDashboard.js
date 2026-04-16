// components/admin/AnalyticsDashboard.js
'use client';
import { useState, useEffect } from 'react';
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
      className="glass-card rounded-xl p-6"
      style={{ border: `1px solid ${color}20` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="text-2xl"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        >
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
        className="text-4xl font-light mb-1"
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

export default function AnalyticsDashboard() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitsRTDB()
      .then(setVisits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-white/30 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
        Loading analytics...
      </div>
    );
  }

  // Compute stats
  const total = visits.length;
  const uniqueNames = new Set(visits.map((v) => v.name)).size;
  const agenticCount = visits.filter((v) => v.mode === 'agentic').length;
  const manualCount = visits.filter((v) => v.mode === 'manual').length;

  // Monthly data
  const monthlyMap = {};
  visits.forEach((v) => {
    if (!v.timestamp) return;
    const date = v.timestamp.toDate ? v.timestamp.toDate() : new Date(v.timestamp);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + 1;
  });
  const monthlyData = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-8)
    .map(([month, count]) => ({ month, count }));

  // Mode pie data
  const pieData = [
    { name: 'Manual', value: manualCount || 0 },
    { name: 'Agentic', value: agenticCount || 0 },
    { name: 'Entry Only', value: Math.max(0, total - manualCount - agenticCount) },
  ].filter((d) => d.value > 0);

  // Company bar data
  const companyMap = {};
  visits.forEach((v) => {
    if (v.company) {
      companyMap[v.company] = (companyMap[v.company] || 0) + 1;
    }
  });
  const companyData = Object.entries(companyMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([company, count]) => ({ company, count }));

  // Recent visitors
  const recent = visits.slice(0, 12);

  const axisStyle = { fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' };
  const gridStyle = { stroke: 'rgba(255,255,255,0.04)' };

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>
          Analytics
        </div>
        <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-display)', color: '#f0ebe0' }}>
          Visitor Insights
        </h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Visits" value={total} icon="◎" color="#c9a84c" delay={0} />
        <StatCard label="Unique Visitors" value={uniqueNames} icon="◉" color="#00d4ff" delay={0.1} />
        <StatCard label="Agentic Mode" value={agenticCount} icon="◈" color="#a855f7" delay={0.2} />
        <StatCard label="Manual Mode" value={manualCount} icon="⬡" color="#22c55e" delay={0.3} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Line chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6 lg:col-span-2"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="text-sm text-white/40 mb-5" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
            MONTHLY VISITORS
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="month" tick={axisStyle} />
              <YAxis tick={axisStyle} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#c9a84c"
                strokeWidth={2}
                dot={{ fill: '#c9a84c', r: 4 }}
                activeDot={{ r: 6 }}
                name="Visitors"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="text-sm text-white/40 mb-5" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
            MODE USAGE
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-white/20 text-sm">No mode data yet</div>
          )}
        </motion.div>
      </div>

      {/* Company bar chart */}
      {companyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6 mb-8"
          style={{ border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="text-sm text-white/40 mb-5" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
            VISITS BY COMPANY
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={companyData}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="company" tick={axisStyle} />
              <YAxis tick={axisStyle} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#c9a84c" radius={[4,4,0,0]} name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent visitors table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="px-6 py-4 border-b border-white/5">
          <div className="text-sm text-white/40" style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
            RECENT VISITORS
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {['Name', 'Company', 'Mode', 'Time'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs text-white/30 font-normal tracking-wider"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((v, i) => {
                const date = v.timestamp?.toDate ? v.timestamp.toDate() : new Date();
                return (
                  <tr
                    key={v.id}
                    className="transition-colors hover:bg-white/2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                  >
                    <td className="px-6 py-3 text-white/70">{v.name || '—'}</td>
                    <td className="px-6 py-3 text-white/40">{v.company || '—'}</td>
                    <td className="px-6 py-3">
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
                    <td className="px-6 py-3 text-white/30 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
                      {date.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-white/20 text-sm">
                    No visitor data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
