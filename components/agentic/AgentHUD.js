// components/agentic/AgentHUD.js — responsive with useResponsive hook
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, memo } from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { useResponsive } from '@/hooks/useResponsive';

const PURPLE = '#7B2FFF';
const BLUE   = '#00D4FF';
const YELLOW = '#E8FF00';
const M = { fontFamily: 'var(--font-mono)' };
const D = { fontFamily: 'var(--font-display)' };

const PLACEHOLDER = {
  about:        [{ title:'Suriya S', subtitle:'Full-Stack Developer · AI Engineer', bio:'Building digital experiences at the intersection of elegant design and powerful engineering.', level:95 }],
  education:    [{ title:'B.E. Computer Science', subtitle:'Anna University · 2020–2024', year:'2024', gpa:'8.6/10', level:92 }],
  projects:     [{ title:'AI Portfolio System', subtitle:'Next.js · Three.js · Firebase', description:'Cinematic 3D portfolio with AI narration.', level:98 }, { title:'SmartFinance AI', subtitle:'React · Python · TensorFlow', description:'AI-powered personal finance tracker.', level:92 }],
  certificates: [{ title:'Google Cloud Professional', subtitle:'Google Cloud Platform', year:'2024' }, { title:'AWS Solutions Architect', subtitle:'Amazon Web Services', year:'2023' }],
  skills:       [{ title:'React & Next.js', subtitle:'Frontend Development', level:93 }, { title:'Python & AI/ML', subtitle:'TensorFlow · PyTorch', level:88 }],
  achievements: [{ title:'Smart India Hackathon — Winner', subtitle:'National Winner · 5000+ teams', year:'2023', description:'National winner among 5,000+ teams for AI drought prediction system.' }],
  contact: [
    { title: 'ssuriyas380@gmail.com', subtitle: 'Email — always open', link: 'mailto:ssuriyas380@gmail.com', icon: 'mail' },
    { title: 'github', subtitle: 'Open source projects', link: 'https://github.com/suriya1230', icon: 'github' },
    { title: '+91 9360830989', subtitle: 'Call / WhatsApp', link: 'tel:+919360830989', icon: 'phone' },
    { title: 'linkedin', subtitle: 'LinkedIn Profile', link: 'https://www.linkedin.com/in/suriya-s-768b91282', icon: 'linkedin' },
    { title: 'instagram', subtitle: 'Instagram', link: 'https://www.instagram.com/__the_mephisto?igsh=Njhqb3ZhNzBtMDUz', icon: 'instagram' },
  ],
};

const glass = (bc, extra={}) => ({
  background: 'rgba(2,1,20,0.88)', border: `1px solid ${bc}35`,
  backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
  borderRadius: 11, position: 'relative', ...extra,
});

const Brackets = memo(function Brackets({ color, size=12 }) {
  const s = `${size}px`;
  const b = { position:'absolute', width:s, height:s, borderColor:color, borderStyle:'solid', opacity:0.78 };
  return (<>
    <div style={{...b, top:0, left:0, borderWidth:'2px 0 0 2px'}} />
    <div style={{...b, top:0, right:0, borderWidth:'2px 2px 0 0'}} />
    <div style={{...b, bottom:0, left:0, borderWidth:'0 0 2px 2px'}} />
    <div style={{...b, bottom:0, right:0, borderWidth:'0 2px 2px 0'}} />
  </>);
});

const Wave = memo(function Wave({ color }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:2.5, height:24 }}>
      {[3,6,9,12,15,12,9,14,11,8,6,10,7,4].map((h,i) => (
        <div key={i} style={{ width:3, borderRadius:2, background:color, height:h*1.5, animation:`float ${0.3+i*0.05}s ease-in-out infinite`, animationDelay:`${i*0.06}s`, opacity:0.82, flexShrink:0 }} />
      ))}
    </div>
  );
});

const Ring = memo(function Ring({ color, size=40 }) {
  return <div style={{ width:size, height:size, borderRadius:'50%', border:`2.5px solid ${color}`, boxShadow:`0 0 14px ${color}55, inset 0 0 10px ${color}20`, animation:'float 3s ease-in-out infinite', flexShrink:0 }} />;
});

const StatRow = memo(function StatRow({ label, value, color }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px 0', borderBottom:`1px solid ${color}18` }}>
      <span style={{...M, fontSize:'0.8rem', opacity:0.35, letterSpacing:'0.07em'}}>{label}</span>
      <span style={{...M, fontSize:'0.82rem', color, fontWeight:600}}>{value}</span>
    </div>
  );
});

// Isolated clock — the only piece of the HUD that needs to re-render every second.
const Clock = memo(function Clock({ style }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={style}>{time}</span>;
});

const SmallCard = memo(function SmallCard({ item, color, index }) {
  const title = item.title||item.name||item.degree||`Entry ${index+1}`;
  const sub   = item.subtitle||item.issuer||item.institution||item.category||'';
  return (
    <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:index*0.07}}
      style={{ padding:'8px 10px', borderRadius:8, marginBottom:7, background:`${color}0e`, border:`1px solid ${color}28` }}>
      <div style={{...D, fontSize:'0.98rem', color:'#eeeeff', lineHeight:1.25, marginBottom:sub?3:0}}>
        {title.length>22 ? title.slice(0,20)+'…' : title}
      </div>
      {sub && <div style={{...M, fontSize:'0.7rem', color, opacity:0.65, lineHeight:1.4}}>{sub.length>28?sub.slice(0,26)+'…':sub}</div>}
      {item.level!=null && (
        <div style={{ marginTop:5, height:2.5, borderRadius:1.5, background:'rgba(255,255,255,0.08)' }}>
          <motion.div style={{ height:'100%', borderRadius:1.5, background:`linear-gradient(to right, ${PURPLE}, ${BLUE})` }}
            initial={{width:0}} animate={{width:`${item.level}%`}} transition={{duration:1.1, delay:index*0.08}} />
        </div>
      )}
    </motion.div>
  );
});

const CardBody = memo(function CardBody({ sectionId, allData, color, roomInfo, isMobile }) {
  const wrapStyle = {
    flex:1, overflowY:'auto', padding: isMobile ? '12px 14px' : '16px 20px',
    background:'rgba(2,1,20,0.92)', border:`1px solid ${color}30`,
    borderTop:'none', borderBottom:'none',
    backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
  };

  if (allData.length === 0) {
    return <div style={wrapStyle}><div style={{...M, fontSize:'0.8rem', color:'rgba(255,255,255,0.3)', lineHeight:1.85}}>{roomInfo?.dialogue}</div></div>;
  }

  const ICONS = { mail:Mail, email:Mail, phone:Phone, github:FaGithub, linkedin:FaLinkedin, instagram:FaInstagram, website:Globe };

  if (sectionId === 'about') {
    const item = allData[0];
    return (
      <div style={wrapStyle}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          {item.title && <div style={{...D, fontSize: isMobile ? '1.4rem' : '1.9rem', color:'#f0f0ff', fontWeight:300, lineHeight:1.15, marginBottom:6}}>{item.title}</div>}
          {(item.subtitle||item.tagline) && <div style={{...M, fontSize:'0.78rem', color, letterSpacing:'0.12em', marginBottom:14, opacity:0.9}}>{item.subtitle||item.tagline}</div>}
          <div style={{height:1, background:`linear-gradient(to right,${color}60,transparent)`, marginBottom:14}} />
          {item.bio && <p style={{...M, fontSize: isMobile ? '0.78rem' : '0.82rem', color:'rgba(255,255,255,0.72)', lineHeight:1.9, marginBottom:14}}>{item.bio}</p>}
          <div style={{display:'flex', flexWrap:'wrap', gap:7}}>
            {item.location && <span style={{...M, fontSize:'0.68rem', padding:'4px 10px', borderRadius:100, border:`1px solid ${color}40`, color, background:`${color}0e`}}>📍 {item.location}</span>}
          </div>
        </motion.div>
      </div>
    );
  }

  if (sectionId === 'contact') {
    return (
      <div style={wrapStyle}>
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:10 }}>
          {allData.map((item, i) => {
            const label = item.title||item.name||'';
            const sub   = item.subtitle||item.description||'';
            const href  = item.link||item.url||item.href||'';
            const Icon  = ICONS[item.icon];
            const isExt = href.startsWith('http');
            return (
              <motion.a key={item.id||`ct${i}`} href={href||undefined} target={isExt?'_blank':undefined} rel={isExt?'noreferrer':undefined}
                initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                style={{ display:'block', padding:'14px 16px', borderRadius:10, background:`${color}0d`, border:`1px solid ${color}2a`, textDecoration:'none', cursor:href?'pointer':'default' }}
                whileHover={href?{background:`${color}1a`,borderColor:`${color}55`}:{}}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:5 }}>
                  {Icon && <Icon size={17} color={color} style={{filter:`drop-shadow(0 0 5px ${color})`}} />}
                  <div style={{...D, fontSize:'1.0rem', color:'#f0f0ff', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{label}</div>
                </div>
                {sub && <div style={{...M, fontSize:'0.7rem', color, opacity:0.6, paddingLeft:27}}>{sub}</div>}
                {href && <div style={{...M, fontSize:'0.7rem', color, textAlign:'right', marginTop:6, opacity:0.7}}>{isExt?'open ↗':'tap →'}</div>}
              </motion.a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:10 }}>
        {allData.map((item, i) => {
          const title = item.title||item.name||item.degree||`Entry ${i+1}`;
          const sub   = item.subtitle||item.issuer||item.institution||item.category||item.tagline||'';
          const year  = item.year||item.date||'';
          const desc  = item.description||item.bio||'';
          const gpa   = item.gpa||'';
          const href  = item.link||item.github||item.url||item.demo||'';
          const Tag   = href ? motion.a : motion.div;
          const linkProps = href ? { href, target:'_blank', rel:'noreferrer', style:{textDecoration:'none',display:'block'} } : {};
          return (
            <Tag key={item.id||`c${i}`} {...linkProps}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              whileHover={href?{background:`${color}1a`,borderColor:`${color}55`}:{}}
              style={{ ...(linkProps.style||{}), padding:'12px 14px', borderRadius:10, background:`${color}0d`, border:`1px solid ${color}2a`, cursor:href?'pointer':'default', transition:'background 0.2s, border-color 0.2s' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:8, marginBottom:4 }}>
                <div style={{...D, fontSize: isMobile ? '0.95rem' : '1.05rem', color:'#f0f0ff', lineHeight:1.3, flex:1}}>{title}</div>
                {year && <div style={{...M, fontSize:'0.65rem', color, opacity:0.85, flexShrink:0}}>{year}</div>}
              </div>
              {sub && <div style={{...M, fontSize:'0.72rem', color, opacity:0.62, marginBottom:4}}>{sub}</div>}
              {gpa && <div style={{...M, fontSize:'0.68rem', color:'rgba(255,255,255,0.4)', marginBottom:4}}>GPA: {gpa}</div>}
              {desc && <div style={{...M, fontSize:'0.7rem', color:'rgba(255,255,255,0.35)', lineHeight:1.65, marginBottom:5}}>{desc.length>100?desc.slice(0,98)+'…':desc}</div>}
              {item.level!=null && (
                <div><div style={{height:3,borderRadius:2,background:'rgba(255,255,255,0.08)'}}>
                  <motion.div style={{height:'100%',borderRadius:2,background:`linear-gradient(to right,${PURPLE},${BLUE})`}} initial={{width:0}} animate={{width:`${item.level}%`}} transition={{duration:1.2,delay:i*0.06}}/>
                </div></div>
              )}
            </Tag>
          );
        })}
      </div>
    </div>
  );
});

const BigSectionCard = memo(function BigSectionCard({ roomInfo, allData, color, onClose, resumeUrl, isMobile }) {
  const sectionId = roomInfo?.id || 'about';
  return (
    <motion.div initial={{opacity:0,y:60,scale:0.94}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40,scale:0.96}}
      transition={{duration:0.6,ease:[0.16,1,0.3,1]}}
      style={{
        position:'fixed',
        left:'50%', transform:'translateX(-50%)',
        top: isMobile ? '8vh' : 'calc(5vh + 52px)',
        bottom: isMobile ? '8vh' : 'calc(5vh + 68px)',
        width: isMobile ? '92vw' : 'min(620px, 52vw)',
        zIndex:45, display:'flex', flexDirection:'column',
      }}>
      {/* Header */}
      <div style={{ padding:'12px 18px 10px', background:`linear-gradient(135deg, rgba(2,1,20,0.96), ${color}22)`, border:`1px solid ${color}50`, borderBottom:'none', borderRadius:'14px 14px 0 0', position:'relative' }}>
        <Brackets color={color} size={10} />
        <button onClick={onClose} style={{ position:'absolute', top:10, right:14, background:'none', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.4)', borderRadius:6, padding:'2px 8px', cursor:'pointer', fontSize:'0.7rem', fontFamily:'var(--font-mono)' }}>ESC</button>
        <div style={{...M, fontSize:'0.58rem', color, letterSpacing:'0.3em', textTransform:'uppercase', marginBottom:4}}>{roomInfo?.cityZone}</div>
        <div style={{...D, fontSize: isMobile ? '1.5rem' : '2rem', color:'#f0f0ff', fontWeight:300, lineHeight:1}}>{roomInfo?.label}</div>
      </div>
      <div style={{height:2, background:`linear-gradient(to right, ${color}, ${color}44)`}} />
      <CardBody sectionId={sectionId} allData={allData} color={color} roomInfo={roomInfo} isMobile={isMobile} />
      {/* Footer */}
      <div style={{ padding:'10px 18px', background:'rgba(2,1,20,0.95)', border:`1px solid ${color}22`, borderTop:'none', borderRadius:'0 0 14px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
        <span style={{...M, fontSize:'0.62rem', color:'rgba(255,255,255,0.2)'}}>{allData.length} entries · Live</span>
        {resumeUrl && !isMobile && (
          <a href={resumeUrl} target="_blank" rel="noreferrer" style={{...M, fontSize:'0.75rem', letterSpacing:'0.1em', padding:'6px 16px', borderRadius:8, border:`1.5px solid ${color}70`, color, textDecoration:'none', background:`${color}14`, fontWeight:600 }}>
            ↓ Download Resume
          </a>
        )}
        <div style={{display:'flex',gap:5}}>{[YELLOW,BLUE,PURPLE].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c,opacity:c===color?1:0.2}}/>)}</div>
      </div>
    </motion.div>
  );
});

function AgentHUD({ rooms, currentRoom, onNext, onPrev, onGoTo, speaking, roomInfo, sectionData, isTransitioning, showBigCard, onCloseBigCard, resumeUrl, persona, switchPersona, stopVoice }) {
  const { isMobile } = useResponsive();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    if (!isTransitioning) { const t = setTimeout(()=>setShow(true),900); return ()=>clearTimeout(t); }
  }, [currentRoom, isTransitioning]);

  const color    = roomInfo?.color || YELLOW;
  const routePct = Math.round(((currentRoom+1)/rooms.length)*100);
  const sectionId = roomInfo?.id || 'about';

  const allData = sectionData && !Array.isArray(sectionData) ? [sectionData]
    : sectionData?.length > 0 ? sectionData
    : (PLACEHOLDER[sectionId] || []);

  const topPad   = isMobile ? '4vw' : '5vh';
  const btnSize  = isMobile ? 40 : 46;

  return (
    <>
      {/* ── TOP BAR ── */}
      <div style={{ position:'fixed', top:topPad, left:0, right:0, zIndex:42, display:'flex', alignItems:'center', justifyContent:'space-between', padding: isMobile ? '6px 12px' : '8px 22px', background:'linear-gradient(to bottom, rgba(0,0,0,0.92), transparent)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:speaking?BLUE:`${color}80`, boxShadow:speaking?`0 0 14px ${BLUE}`:'none', animation:speaking?'glowPulse 0.75s infinite':'none', transition:'all 0.3s' }} />
          {!isMobile && (
            <span style={{...M, fontSize:'0.82rem', letterSpacing:'0.3em', textTransform:'uppercase', color:speaking?BLUE:'rgba(255,255,255,0.35)'}}>
              {persona==='friday'?'FRIDAY':'JARVIS'} · {isTransitioning?'EN ROUTE':speaking?'NARRATING':'STANDBY'}
            </span>
          )}
          {speaking && !isMobile && <Wave color={BLUE} />}
        </div>

        {/* City zone — hidden on very small */}
        <AnimatePresence mode="wait">
          <motion.span key={currentRoom} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{...M, fontSize: isMobile ? '0.6rem' : '0.75rem', color, letterSpacing:'0.25em', textTransform:'uppercase', opacity:0.8, display: isMobile ? 'none' : 'block'}}>
            {roomInfo?.cityZone}
          </motion.span>
        </AnimatePresence>

        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer" style={{
              ...M, fontSize: isMobile ? '0.62rem' : '0.72rem', letterSpacing:'0.1em',
              padding: isMobile ? '5px 8px' : '5px 16px', borderRadius:8,
              border:`1.5px solid rgba(0,212,255,0.6)`, color:'#00D4FF', textDecoration:'none',
              background:'rgba(0,212,255,0.1)', fontWeight:600,
            }}>
              {isMobile ? '↓' : '↓ Resume'}
            </a>
          )}
          <a href="/" onClick={e=>{e.preventDefault();stopVoice();window.location.href='/';}}
            style={{...M, fontSize: isMobile ? '0.62rem' : '0.72rem', letterSpacing:'0.15em', padding: isMobile ? '5px 8px' : '5px 16px', borderRadius:8, border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.7)', textDecoration:'none', background:'rgba(255,255,255,0.05)'}}>
            {isMobile ? '×' : 'EXIT ×'}
          </a>
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <div style={{ position:'fixed', top:`calc(${topPad} + 36px)`, left: isMobile ? 12 : 22, right: isMobile ? 12 : 22, zIndex:42, display:'flex', gap:4 }}>
        {rooms.map((room,i) => (
          <button key={room.id} onClick={()=>onGoTo(i)} style={{flex:1,height:3,background:'none',border:'none',cursor:'pointer',padding:0}}>
            <div style={{ height:'100%', borderRadius:2, background:i===currentRoom?room.color:i<currentRoom?'rgba(255,255,255,0.32)':'rgba(255,255,255,0.09)', boxShadow:i===currentRoom?`0 0 9px ${room.color}`:'none', transition:'all 0.4s' }} />
          </button>
        ))}
      </div>

      {/* ── LEFT PANEL — desktop only ── */}
      {!isMobile && (
        <div style={{ position:'fixed', left:18, zIndex:40, top:'calc(5vh + 58px)', bottom:'calc(5vh + 74px)', width:210, display:'flex', flexDirection:'column', gap:9 }}>
          <div style={{ display:'flex', alignItems:'center', gap:11, paddingLeft:2 }}>
            <Ring color={color} size={38} />
            <div>
              <div style={{...M, fontSize:'0.65rem', color:'rgba(255,255,255,0.24)', marginBottom:1}}>ZONE</div>
              <div style={{...M, fontSize:'1.05rem', color, lineHeight:1, fontWeight:600}}>{String(currentRoom+1).padStart(2,'0')}/{rooms.length}</div>
            </div>
          </div>
          <div style={{...glass(color), padding:'11px 14px'}}>
            <Brackets color={color} size={9} />
            <div style={{...M, fontSize:'0.68rem', color, letterSpacing:'0.28em', textTransform:'uppercase', marginBottom:8, paddingBottom:6, borderBottom:`1px solid ${color}22`, opacity:0.9}}>SYSTEM</div>
            <StatRow label="STATUS" value={isTransitioning?'DRIVE':'PARKED'} color={color} />
            <StatRow label="ROUTE"  value={`${routePct}%`} color={color} />
            <StatRow label="SPEED"  value={isTransitioning?'MAX':'000 km/h'} color={BLUE} />
          </div>
          {/* Voice switcher */}
          <div style={{...glass(color), padding:'12px 14px'}}>
            <Brackets color={color} size={9} />
            <div style={{...M, fontSize:'0.68rem', color, letterSpacing:'0.28em', textTransform:'uppercase', marginBottom:10, paddingBottom:6, borderBottom:`1px solid ${color}22`, opacity:0.9}}>AI VOICE</div>
            {[{id:'jarvis',icon:'⬡',c:BLUE,label:'JARVIS',desc:'Deep · Male'},{id:'friday',icon:'◈',c:PURPLE,label:'FRIDAY',desc:'Clear · Female'}].map(p => (
              <div key={p.id} onClick={()=>switchPersona(p.id)} style={{ padding:'10px 12px', borderRadius:9, marginBottom:6, cursor:'pointer', background:persona===p.id?`${p.c}18`:'rgba(255,255,255,0.03)', border:`1.5px solid ${persona===p.id?p.c:'rgba(255,255,255,0.08)'}`, transition:'all 0.25s' }}>
                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:persona===p.id?`${p.c}30`:'rgba(255,255,255,0.06)', border:`1.5px solid ${persona===p.id?p.c:'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem' }}>{p.icon}</div>
                  <div>
                    <div style={{...M, fontSize:'0.8rem', color:persona===p.id?p.c:'rgba(255,255,255,0.55)', fontWeight:600}}>{p.label}</div>
                    <div style={{...M, fontSize:'0.58rem', color:'rgba(255,255,255,0.28)'}}>{p.desc}</div>
                  </div>
                  {persona===p.id && <div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:p.c,boxShadow:`0 0 10px ${p.c}`,animation:'glowPulse 1s infinite'}}/>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RIGHT PANEL — desktop only ── */}
      {!isMobile && (
        <AnimatePresence mode="wait">
          {show && !isTransitioning && (
            <motion.div key={`rp-${currentRoom}`} initial={{opacity:0,x:22}} animate={{opacity:1,x:0}} exit={{opacity:0,x:22}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
              style={{ position:'fixed', right:18, zIndex:40, top:'calc(5vh + 58px)', bottom:'calc(5vh + 74px)', width:280, display:'flex', flexDirection:'column' }}>
              <div style={{ padding:'9px 16px 8px', background:`linear-gradient(90deg, rgba(2,1,20,0.92), ${color}1e)`, border:`1px solid ${color}48`, borderBottom:'none', borderRadius:'11px 11px 0 0', position:'relative' }}>
                <Brackets color={color} size={9} />
                <div style={{...M, fontSize:'0.68rem', color, letterSpacing:'0.3em', textTransform:'uppercase'}}>DATA FEED · {roomInfo?.label}</div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:'11px 16px', background:'rgba(2,1,20,0.88)', border:`1px solid ${color}2e`, borderTop:`1px solid ${color}5a`, backdropFilter:'blur(22px)', WebkitBackdropFilter:'blur(22px)' }}>
                {allData.slice(0,5).map((item,i) => {
                  const title = item.title||item.name||item.degree||`Entry ${i+1}`;
                  const sub   = item.subtitle||item.issuer||item.institution||item.category||'';
                  const year  = item.year||item.date||'';
                  const desc  = item.description||item.bio||'';
                  return (
                    <motion.div key={item.id||`rcard${i}`} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
                      style={{ padding:'10px 12px', borderRadius:9, marginBottom:8, background:`${color}0e`, border:`1px solid ${color}28` }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:6}}>
                        <div style={{...D,fontSize:'1.0rem',color:'#f0f0ff',lineHeight:1.3,flex:1}}>{title}</div>
                        {year && <div style={{...M,fontSize:'0.65rem',color,opacity:0.82,flexShrink:0}}>{year}</div>}
                      </div>
                      {sub  && <div style={{...M,fontSize:'0.7rem',color,opacity:0.6,marginTop:3}}>{sub}</div>}
                      {desc && <div style={{...M,fontSize:'0.68rem',color:'rgba(255,255,255,0.3)',marginTop:4,lineHeight:1.65}}>{desc.slice(0,90)}{desc.length>90?'…':''}</div>}
                      {item.level!=null && <div style={{marginTop:5,height:2,borderRadius:1,background:'rgba(255,255,255,0.07)'}}><motion.div style={{height:'100%',borderRadius:1,background:`linear-gradient(to right,${PURPLE},${BLUE})`}} initial={{width:0}} animate={{width:`${item.level}%`}} transition={{duration:1.2,delay:i*0.07}}/></div>}
                    </motion.div>
                  );
                })}
              </div>
              <div style={{ padding:'7px 16px', background:'rgba(2,1,20,0.82)', border:`1px solid ${color}22`, borderTop:'none', borderRadius:'0 0 11px 11px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{...M,fontSize:'0.62rem',color:'rgba(255,255,255,0.2)'}}>LIVE DATA</span>
                <Clock style={{...M,fontSize:'0.62rem',color:'rgba(255,255,255,0.2)'}} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── BIG CARD ── */}
      <AnimatePresence>
        {showBigCard && !isTransitioning && (
          <BigSectionCard key={`big-${currentRoom}`} roomInfo={roomInfo} allData={allData} color={color} onClose={onCloseBigCard} resumeUrl={resumeUrl} isMobile={isMobile} />
        )}
      </AnimatePresence>

      {/* ── BOTTOM NAV ── */}
      <div style={{ position:'fixed', bottom: isMobile ? '3vh' : '5vh', left:'50%', transform:'translateX(-50%)', zIndex:40, display:'flex', flexDirection:'column', alignItems:'center', gap: isMobile ? 8 : 12 }}>
        <AnimatePresence mode="wait">
          <motion.div key={currentRoom} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} style={{ textAlign:'center', pointerEvents:'none' }}>
            <div style={{...M, fontSize: isMobile ? '0.6rem' : '0.72rem', color, letterSpacing:'0.4em', textTransform:'uppercase', marginBottom:3}}>
              {String(currentRoom+1).padStart(2,'0')} / {rooms.length}
            </div>
            <div style={{...D, fontSize: isMobile ? '1.3rem' : '2.6rem', color:'#f0f0ff', fontWeight:300, lineHeight:1.1}}>
              {roomInfo?.label}
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ display:'flex', alignItems:'center', gap: isMobile ? 12 : 16 }}>
          <button onClick={onPrev} disabled={currentRoom===0} style={{ width:btnSize, height:btnSize, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, background:currentRoom===0?'rgba(255,255,255,0.04)':`${PURPLE}30`, border:`1.5px solid ${currentRoom===0?'rgba(255,255,255,0.08)':PURPLE+'65'}`, color:currentRoom===0?'rgba(255,255,255,0.2)':'#fff', cursor:currentRoom===0?'not-allowed':'pointer' }}>←</button>
          <div style={{ display:'flex', gap: isMobile ? 6 : 8 }}>
            {rooms.map((room,i) => (
              <button key={room.id} onClick={()=>onGoTo(i)} style={{ border:'none', cursor:'pointer', padding:0, transition:'all 0.35s', width:i===currentRoom?20:7, height:7, borderRadius:i===currentRoom?4:'50%', background:i===currentRoom?room.color:'rgba(255,255,255,0.18)', boxShadow:i===currentRoom?`0 0 10px ${room.color}`:'none' }} />
            ))}
          </div>
          <button onClick={onNext} disabled={currentRoom===rooms.length-1} style={{ width:btnSize, height:btnSize, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, background:currentRoom===rooms.length-1?'rgba(255,255,255,0.04)':`${color}30`, border:`1.5px solid ${currentRoom===rooms.length-1?'rgba(255,255,255,0.08)':color+'65'}`, color:currentRoom===rooms.length-1?'rgba(255,255,255,0.2)':color, cursor:currentRoom===rooms.length-1?'not-allowed':'pointer' }}>→</button>
        </div>
      </div>

      {/* Corner labels — desktop only */}
      {!isMobile && (<>
        <div style={{ position:'fixed', top:'calc(5vh + 42px)', left:18, zIndex:38, pointerEvents:'none', display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:5, height:5, background:YELLOW, opacity:0.5, transform:'rotate(45deg)' }} />
          <span style={{...M, fontSize:'0.65rem', color:'rgba(255,255,255,0.18)', letterSpacing:'0.2em'}}>SURIYA.AI</span>
        </div>
        <div style={{ position:'fixed', bottom:'calc(5vh + 8px)', left:18, zIndex:38, pointerEvents:'none' }}>
          <span style={{...M, fontSize:'0.62rem', color:'rgba(255,255,255,0.12)', letterSpacing:'0.12em'}}>Ferrari SF90 XX Stradale</span>
        </div>
        <div style={{ position:'fixed', bottom:'calc(5vh + 8px)', right:18, zIndex:38, pointerEvents:'none', textAlign:'right' }}>
          <span style={{...M, fontSize:'0.62rem', color:'rgba(255,255,255,0.12)', letterSpacing:'0.12em'}}>NEON ODYSSEY · <Clock style={{ display: 'inline' }} /></span>
        </div>
      </>)}
    </>
  );
}

export default memo(AgentHUD);
