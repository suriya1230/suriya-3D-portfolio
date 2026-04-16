'use client';
import { motion } from 'framer-motion';

export default function AboutSection({ about }) {
  if (!about) return null;

  const stats = [
    { val: '1+', label: 'Years Exp.' },
    { val: '10+', label: 'Projects' },
    { val: '5+', label: 'Certifications' },
  ];

  return (
    <section id="about" className="cm-section" style={{ padding: '7rem 64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>

          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="cm-num" style={{ marginBottom: 20 }}>01 — About</div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 300, fontSize: 'clamp(2.4rem, 4vw, 3.8rem)', color: 'hsl(0 0% 96%)', lineHeight: 1.1, marginBottom: 36, letterSpacing: '-0.02em' }}>
              Building<br/>
              <span style={{ color: 'hsl(119 99% 46%)' }}>AI systems</span><br/>
              that matter.
            </h2>

            {
  (about?.photoUrl || "/images/profile.jpg") ? (
    <div style={{
  position: 'relative',
  width: '320px',
  height: '320px',
  margin: '0 auto 40px',
}}>

  {/* 🔥 GLOW BACKGROUND */}
  <div style={{
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    background: 'radial-gradient(circle, hsl(119 99% 46% / 0.5), transparent 70%)',
    filter: 'blur(30px)',
    zIndex: 0,
  }} />

  {/* 🔥 IMAGE (CENTERED INSIDE SAME BOX) */}
  <img
    src={about?.photoUrl || "/images/profile.jpeg"}
    alt={about?.name || "Suriya"}
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid hsl(119 99% 46%)',
      boxShadow: '0 0 25px hsl(119 99% 46% / 0.6)',
      zIndex: 1,
    }}
  />

</div>
  ) : (
    <div
      style={{
        width: '100%',
        aspectRatio: '4/3',
        background: 'hsl(0 0% 12%)',
        border: '1px solid hsl(0 0% 20%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        marginBottom: 28
      }}
    >
      <span
        style={{
          fontSize: '5rem',
          opacity: 0.08,
          color: 'hsl(119 99% 46%)'
        }}
      >
        ◈
      </span>
    </div>
  )
}

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['AI Engineering', 'ML Research', 'Full-Stack', 'Data Analytics'].map(t => (
                <span key={t} className="cm-tag">{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} style={{ paddingTop: 60 }}>
            <p style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.0rem', fontWeight: 300, color: 'hsl(0 0% 60%)', lineHeight: 1.85, marginBottom: 40 }}>
              {about.bio || 'AI Engineer and Researcher building intelligent systems that learn, adapt, and solve real-world problems.'}
            </p>

            <div style={{ height: 1, background: 'hsl(0 0% 20%)', marginBottom: 40 }}/>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 48 }}>
              {stats.map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.8rem', fontWeight: 700, color: 'hsl(119 99% 46%)', marginBottom: 4, lineHeight: 1 }}>{s.val}</div>
                  <div className="cm-mono" style={{ fontSize: '0.65rem' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '10px 18px', border: '1px solid hsl(0 0% 20%)', borderRadius: 4 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'hsl(119 99% 46%)', boxShadow: '0 0 10px hsl(119 99% 46%)' }}/>
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '0.68rem', color: 'hsl(0 0% 60%)', letterSpacing: '0.1em' }}>Available for new projects</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({ label }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <span className="cm-num">{label}</span>
      <div style={{ height: 1, marginTop: 12, marginBottom: 4, background: 'linear-gradient(to right, hsl(119 99% 46% / 0.3), transparent)' }}/>
    </motion.div>
  );
}