// components/portfolio/SkillsSection.js
'use client';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';

const SKILL_META = {
  python: { icon: '🐍', color: '#3776AB', bg: '#1a2d3d' },
  tensorflow: { icon: '🔶', color: '#FF6F00', bg: '#2d1f00' },
  pytorch: { icon: '🔥', color: '#EE4C2C', bg: '#2d1008' },
  react: { icon: '⚛️', color: '#61DAFB', bg: '#0d2030' },
  next: { icon: '▲', color: '#ffffff', bg: '#1a1a1a' },
  docker: { icon: '🐳', color: '#2496ED', bg: '#0d1e30' },
  sql: { icon: '🗄️', color: '#336791', bg: '#0d1a2d' },
  langchain: { icon: '🔗', color: '#1C3C3C', bg: '#0a1f1f' },
  nlp: { icon: '💬', color: '#F7DF1E', bg: '#2d2600' },
  'computer vision': { icon: '👁️', color: '#00D4FF', bg: '#001a2d' },
  streamlit: { icon: '🌊', color: '#FF4B4B', bg: '#2d0a0a' },
  flask: { icon: '🧪', color: '#ffffff', bg: '#1a1a1a' },
  fastapi: { icon: '⚡', color: '#009688', bg: '#001f1c' },
  'power bi': { icon: '📊', color: '#F2C811', bg: '#2d2400' },
  scikit: { icon: '⚙️', color: '#F7931E', bg: '#2d1c00' },
  pandas: { icon: '🐼', color: '#150458', bg: '#0a0520' },
  numpy: { icon: '🔢', color: '#4DABCF', bg: '#0d1f2d' },
  hugging: { icon: '🤗', color: '#FFD21E', bg: '#2d2500' },
  transformers: { icon: '🤗', color: '#FFD21E', bg: '#2d2500' },
  generative: { icon: '✨', color: '#a855f7', bg: '#1a0d2d' },
  deep: { icon: '🧬', color: '#06b6d4', bg: '#001f24' },
  machine: { icon: '🤖', color: '#10b981', bg: '#001f14' },
  ai: { icon: '🤖', color: '#10b981', bg: '#001f14' },
  git: { icon: '🔀', color: '#F05032', bg: '#2d0e08' },
  data: { icon: '📊', color: '#38bdf8', bg: '#001a2d' },
};

function getSkillMeta(skill) {
  const name = (skill.name || skill.title || '').toLowerCase();
  for (const [key, meta] of Object.entries(SKILL_META)) {
    if (name.includes(key)) return meta;
  }
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#10b981', '#3b82f6'];
  const bgs = ['#0f0f2d', '#170d2d', '#2d0a1a', '#001f1c', '#2d1e00', '#001f14', '#001a2d'];
  const idx = (name.charCodeAt(0) || 0) % colors.length;
  return { icon: skill.icon || name[0]?.toUpperCase() || '?', color: colors[idx], bg: bgs[idx] };
}

export default function SkillsSection({ skills }) {
  const { isMobile } = useResponsive();
  if (!skills?.length) return null;

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="cv-auto" style={{ padding: isMobile ? '4rem 20px' : '7rem 64px', borderTop: '1px solid hsl(0 0% 15%)', background: 'hsl(0 0% 7%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: isMobile ? 32 : 56 }}>
          <div className="cm-num" style={{ marginBottom: 16 }}>05 — Skills</div>
          <h2 style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 300,
            fontSize: isMobile ? 'clamp(2rem, 9vw, 2.6rem)' : 'clamp(2.4rem, 4.5vw, 3.8rem)',
            color: 'hsl(0 0% 96%)', lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            My Professional<br /><span style={{ color: 'hsl(0 0% 35%)', fontStyle: 'italic' }}>Skills</span>
          </h2>
        </div>

        {Object.entries(grouped).map(([cat, items], catIdx) => (
          <div key={cat} style={{ marginBottom: isMobile ? 28 : 48 }}>
            {Object.keys(grouped).length > 1 && (
              <div style={{
                fontFamily: "'Sora', sans-serif", fontSize: '0.62rem', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'hsl(119 99% 46% / 0.65)', marginBottom: 16,
              }}>{cat}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(auto-fill,minmax(240px,1fr))', gap: isMobile ? 8 : 12 }}>
              {items.map((skill, i) => {
                const meta = getSkillMeta(skill);
                const name = skill.name || skill.title || '';
                return (
                  <motion.div key={skill.id || i}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, delay: (catIdx * items.length + i) * 0.04 }}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: isMobile ? 10 : 14,
                      padding: isMobile ? '10px 12px' : '14px 16px',
                      background: 'hsl(0 0% 11%)', border: '1px solid hsl(0 0% 18%)',
                      borderRadius: 10, cursor: 'default', transition: 'all 0.25s',
                      contain: 'content',
                    }}
                    whileHover={{ borderColor: meta.color + '55', backgroundColor: meta.bg }}>
                    {/* Icon */}
                    <div style={{
                      width: isMobile ? 36 : 44, height: isMobile ? 36 : 44,
                      borderRadius: isMobile ? 8 : 10, flexShrink: 0,
                      background: meta.bg, border: `1px solid ${meta.color}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isMobile ? '1.1rem' : '1.35rem',
                    }}>
                      {typeof meta.icon === 'string' && meta.icon.length <= 2
                        ? <span style={{ lineHeight: 1 }}>{meta.icon}</span>
                        : <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: meta.color }}>{(name[0] || '?').toUpperCase()}</span>}
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: isMobile ? '0.75rem' : '0.9rem',
                        fontWeight: 600, color: 'hsl(0 0% 90%)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        marginBottom: isMobile ? 2 : 3,
                      }}>{name}</div>
                      {!isMobile && (
                        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.68rem', color: 'hsl(0 0% 38%)' }}>
                          {skill.category || 'Skill'}
                        </div>
                      )}
                      {skill.level && (
                        <div style={{ marginTop: isMobile ? 4 : 6, height: 2, borderRadius: 1, background: 'hsl(0 0% 20%)' }}>
                          <motion.div style={{ height: '100%', borderRadius: 1, background: meta.color }}
                            initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.04 }} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
