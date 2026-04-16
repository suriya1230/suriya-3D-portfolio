// components/agentic/AgentHUD.js
// NEON ODYSSEY HUD v9 — Big center card + fixed layout
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  Globe
} from 'lucide-react';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';


const PURPLE = '#7B2FFF';
const BLUE   = '#00D4FF';
const YELLOW = '#E8FF00';
const M = { fontFamily: 'var(--font-mono)' };
const D = { fontFamily: 'var(--font-display)' };
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

// Placeholder data when RTDB is empty
const PLACEHOLDER = {
  about:        [{ title:'Suriya S', subtitle:'Full-Stack Developer · AI Engineer', bio:'Building digital experiences at the intersection of elegant design and powerful engineering.', level:95 }],
  education:    [{ title:'B.E. Computer Science', subtitle:'Anna University · 2020–2024', year:'2024', gpa:'8.6/10', level:92 }, { title:'Higher Secondary', subtitle:'Sri Vidya Mandir HSS', year:'2020', gpa:'92.4%', level:92 }],
  projects:     [{ title:'AI Portfolio System', subtitle:'Next.js · Three.js · Firebase', description:'Cinematic 3D portfolio with AI narration.', level:98 }, { title:'SmartFinance AI', subtitle:'React · Python · TensorFlow', description:'AI-powered personal finance tracker.', level:92 }, { title:'CollabDocs Platform', subtitle:'Next.js · WebSockets · OpenAI', description:'Real-time collaborative document editor.', level:88 }, { title:'Real-time Analytics', subtitle:'Node.js · Redis · PostgreSQL', description:'High-performance analytics dashboard.', level:85 }],
  certificates: [{ title:'Google Cloud Professional', subtitle:'Google Cloud Platform', year:'2024' }, { title:'AWS Solutions Architect', subtitle:'Amazon Web Services', year:'2023' }, { title:'TensorFlow Developer', subtitle:'Google / TensorFlow', year:'2023' }, { title:'Meta Front-End Developer', subtitle:'Meta Blueprint', year:'2024' }],
  skills:       [{ title:'React & Next.js', subtitle:'Frontend Development', level:93 }, { title:'Python & AI/ML', subtitle:'TensorFlow · PyTorch', level:88 }, { title:'Node.js & Firebase', subtitle:'Backend & Cloud', level:86 }, { title:'Three.js & R3F', subtitle:'3D Web Development', level:82 }, { title:'Docker & AWS', subtitle:'DevOps & Deployment', level:78 }],
  achievements: [{ title:'Smart India Hackathon — Winner', subtitle:'National Winner · 5000+ teams', year:'2023', description:'National winner among 5,000+ teams for AI drought prediction system.' }, { title:'Google GDSC Lead', subtitle:'200+ member community', year:'2022', description:'Led college tech community.' }, { title:'IEEE Best Paper Award', subtitle:'Edge computing research', year:'2023' }, { title:'HackWithInfy Top 50', subtitle:'From 50,000+ participants', year:'2023' }],
  //contact:      [{ title:'ssuriyas380@gmail.com', subtitle:'Email — always open' }, { title:'https://github.com/suriya1230', subtitle:'Open source projects' }, { title:'+91 9360830989', subtitle:'WhatsApp / Call' }, { title:'@suriya.dev', subtitle:'Instagram · LinkedIn' }],
  contact: [
  {
    title: "ssuriyas380@gmail.com",
    subtitle: "Email — always open",
    link: "mailto:ssuriyas380@gmail.com",
    icon: "mail"
  },
  {
    title: "github",
    subtitle: "Open source projects",
    link: "https://github.com/suriya1230",
    icon: "github"
  },
  {
    title: "+91 9360830989",
    subtitle: "Call / WhatsApp",
    link: "tel:+919360830989",
    icon: "phone"
  },
  {
    title: "linkedin",
    subtitle: "LinkedIn Profile",
    link: "https://www.linkedin.com/in/suriya-s-768b91282",
    icon: "linkedin"
  },
  {
    title: "instagram",
    subtitle: "Instagram",
    link: "https://www.instagram.com/__the_mephisto?igsh=Njhqb3ZhNzBtMDUz",
    icon: "instagram"
  }
]

};


const glass = (bc, extra={}) => ({
  background: 'rgba(2,1,20,0.88)',
  border: `1px solid ${bc}35`,
  backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
  borderRadius:11, position:'relative', ...extra,
});

function Brackets({ color, size=12 }) {
  const s=`${size}px`;
  const b={position:'absolute',width:s,height:s,borderColor:color,borderStyle:'solid',opacity:0.78};
  return (<>
    <div style={{...b,top:0,left:0,borderWidth:'2px 0 0 2px'}}/>
    <div style={{...b,top:0,right:0,borderWidth:'2px 2px 0 0'}}/>
    <div style={{...b,bottom:0,left:0,borderWidth:'0 0 2px 2px'}}/>
    <div style={{...b,bottom:0,right:0,borderWidth:'0 2px 2px 0'}}/>
  </>);
}

function Wave({ color }) {
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:2.5,height:24}}>
      {[3,6,9,12,15,12,9,14,11,8,6,10,7,4].map((h,i)=>(
        <div key={i} style={{width:3,borderRadius:2,background:color,height:h*1.5,animation:`float ${0.3+i*0.05}s ease-in-out infinite`,animationDelay:`${i*0.06}s`,opacity:0.82,flexShrink:0}}/>
      ))}
    </div>
  );
}

function Ring({ color, size=40 }) {
  return (
    <div style={{width:size,height:size,borderRadius:'50%',border:`2.5px solid ${color}`,boxShadow:`0 0 14px ${color}55, inset 0 0 10px ${color}20`,animation:'float 3s ease-in-out infinite',flexShrink:0}}/>
  );
}

function StatRow({ label, value, color }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'5px 0',borderBottom:`1px solid ${color}18`}}>
      <span style={{...M,fontSize:'0.8rem',opacity:0.35,letterSpacing:'0.07em'}}>{label}</span>
      <span style={{...M,fontSize:'0.82rem',color,fontWeight:600}}>{value}</span>
    </div>
  );
}

// ── SMALL left panel card ──
function SmallCard({ item, color, index }) {
  const title = item.title||item.name||item.degree||`Entry ${index+1}`;
  const sub   = item.subtitle||item.issuer||item.institution||item.category||'';
  return (
    <motion.div
      initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:index*0.07}}
      style={{padding:'8px 10px',borderRadius:8,marginBottom:7,background:`${color}0e`,border:`1px solid ${color}28`}}
    >
      <div style={{...D,fontSize:'0.98rem',color:'#eeeeff',lineHeight:1.25,marginBottom:sub?3:0}}>
        {title.length>22?title.slice(0,20)+'…':title}
      </div>
      {sub&&<div style={{...M,fontSize:'0.7rem',color,opacity:0.65,lineHeight:1.4}}>{sub.length>28?sub.slice(0,26)+'…':sub}</div>}
      {item.level!=null&&(
        <div style={{marginTop:5,height:2.5,borderRadius:1.5,background:'rgba(255,255,255,0.08)'}}>
          <motion.div style={{height:'100%',borderRadius:1.5,background:`linear-gradient(to right, ${PURPLE}, ${BLUE})`}} initial={{width:0}} animate={{width:`${item.level}%`}} transition={{duration:1.1,delay:index*0.08}}/>
        </div>
      )}
    </motion.div>
  );
}

// ── CARD BODY — switched by section ──
function CardBody({ sectionId, allData, color, roomInfo }) {
  const wrapStyle = {
    flex:1, overflowY:'auto', padding:'16px 20px',
    background:'rgba(2,1,20,0.92)',
    border:`1px solid ${color}30`, borderTop:'none', borderBottom:'none',
    backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
  };

  if (allData.length === 0) {
    return (
      <div style={wrapStyle}>
        <div style={{...M, fontSize:'0.8rem', color:'rgba(255,255,255,0.3)', lineHeight:1.85}}>
          {roomInfo?.dialogue}
        </div>
      </div>
    );
  }

  if (sectionId === 'about') {
    const item     = allData[0];
    const title    = item.title    || item.name  || '';
    const subtitle = item.subtitle || item.tagline || item.category || '';
    const bio      = item.bio      || item.description || '';
    const location = item.location || '';
    const email    = item.email    || '';
    const github   = item.github   || '';
    const linkedin = item.linkedin || '';
    const extra    = item.extra    || item.note  || '';
    return (
      <div style={wrapStyle}>
        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          {title && (
            <div style={{...D,fontSize:'1.9rem',color:'#f0f0ff',fontWeight:300,lineHeight:1.15,marginBottom:6}}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{...M,fontSize:'0.78rem',color,letterSpacing:'0.12em',marginBottom:18,opacity:0.9}}>
              {subtitle}
            </div>
          )}
          <div style={{height:1,background:`linear-gradient(to right,${color}60,transparent)`,marginBottom:18}}/>
          {bio && (
            <p style={{...M,fontSize:'0.82rem',color:'rgba(255,255,255,0.72)',lineHeight:1.9,marginBottom:18,whiteSpace:'pre-line'}}>
              {bio}
            </p>
          )}
          {extra && (
            <p style={{...M,fontSize:'0.78rem',color:'rgba(255,255,255,0.45)',lineHeight:1.8,marginBottom:18}}>
              {extra}
            </p>
          )}
          <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:14}}>
            {location && (
              <span style={{...M,fontSize:'0.68rem',padding:'4px 12px',borderRadius:100,
                border:`1px solid ${color}40`,color,background:`${color}0e`}}>
                📍 {location}
              </span>
            )}
            {email && (
              <a href={`mailto:${email}`} style={{...M,fontSize:'0.68rem',padding:'4px 12px',borderRadius:100,
                border:`1px solid ${BLUE}40`,color:BLUE,background:`${BLUE}0e`,textDecoration:'none'}}>
                ✉ {email}
              </a>
            )}
            {github && (
              <a href={github.startsWith('http')?github:`https://github.com/${github}`}
                target="_blank" rel="noreferrer"
                style={{...M,fontSize:'0.68rem',padding:'4px 12px',borderRadius:100,
                border:`1px solid ${PURPLE}40`,color:PURPLE,background:`${PURPLE}0e`,textDecoration:'none'}}>
                GitHub
              </a>
            )}
            {linkedin && (
              <a href={linkedin.startsWith('http')?linkedin:`https://linkedin.com/in/${linkedin}`}
                target="_blank" rel="noreferrer"
                style={{...M,fontSize:'0.68rem',padding:'4px 12px',borderRadius:100,
                border:`1px solid ${BLUE}40`,color:BLUE,background:`${BLUE}0e`,textDecoration:'none'}}>
                LinkedIn
              </a>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (sectionId === 'contact') {
    const ICONS = {
  mail: Mail,
  email: Mail,
  phone: Phone,
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
  website: Globe,
};
    return (
      <div style={wrapStyle}>
        <div style={{display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:10}}>
          {allData.map((item, i) => {
            const label = item.title || item.name || '';
            const sub   = item.subtitle || item.description || '';
            const href  = item.link || item.url || item.href || '';
            const Icon = ICONS[item.icon];
            const isExternal = href.startsWith('http');
            return (
              <motion.a
                key={item.id||`ct${i}`}
                href={href || undefined}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                initial={{opacity:0, y:12}} animate={{opacity:1, y:0}} transition={{delay:i*0.07}}
                style={{
                  display:'block', padding:'16px 18px', borderRadius:10,
                  background:`${color}0d`, border:`1px solid ${color}2a`,
                  textDecoration:'none', cursor: href ? 'pointer' : 'default',
                  transition:'background 0.2s, border-color 0.2s',
                }}
                whileHover={href ? {background:`${color}1a`, borderColor:`${color}55`} : {}}
              >
                {/* Icon + label row */}
                <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:5}}>
                  <span style={{display:'flex', alignItems:'center'}}>
  {Icon ? <Icon size={18} color={color} style={{filter:`drop-shadow(0 0 6px ${color})`}}  strokeWidth={1.8} /> : '→'}
</span>
                  <div style={{...D, fontSize:'1.0rem', color:'#f0f0ff', lineHeight:1.3, flex:1,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                    {label}
                  </div>
                </div>
                {/* Subtitle */}
                {sub && (
                  <div style={{...M, fontSize:'0.72rem', color, opacity:0.65, paddingLeft:30}}>
                    {sub}
                  </div>
                )}
                {/* Arrow indicator if clickable */}
                {href && (
                  <div style={{...M, fontSize:'0.72rem', color: color,
                    textAlign:'right', marginTop:8, letterSpacing:'0.12em',
                    opacity:0.7, fontWeight:600}}>
                    {isExternal ? 'open ↗' : 'tap →'}
                  </div>
                )}
              </motion.a>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={wrapStyle}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        {allData.map((item, i) => {
          const title = item.title||item.name||item.degree||`Entry ${i+1}`;
          const sub   = item.subtitle||item.issuer||item.institution||item.category||item.tagline||'';
          const year  = item.year||item.date||'';
          const desc  = item.description||item.bio||'';
          const gpa   = item.gpa||'';
          const href  = item.link||item.github||item.url||item.demo||'';
          const Tag   = href ? motion.a : motion.div;
          const linkProps = href ? {
            href, target:'_blank', rel:'noreferrer',
            style:{textDecoration:'none', display:'block'},
          } : {};
          return (
            <Tag key={item.id||`c${i}`}
              {...linkProps}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              whileHover={href?{background:`${color}1a`,borderColor:`${color}55`}:{}}
              style={{
                ...(linkProps.style||{}),
                padding:'13px 14px',borderRadius:10,
                background:`${color}0d`,border:`1px solid ${color}2a`,
                cursor: href?'pointer':'default',
                transition:'background 0.2s, border-color 0.2s',
              }}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8,marginBottom:4}}>
                <div style={{...D,fontSize:'1.05rem',color:'#f0f0ff',lineHeight:1.3,flex:1}}>{title}</div>
                {year&&<div style={{...M,fontSize:'0.68rem',color,opacity:0.85,flexShrink:0,marginTop:2}}>{year}</div>}
              </div>
              {sub&&<div style={{...M,fontSize:'0.72rem',color,opacity:0.65,marginBottom:5}}>{sub}</div>}
              {gpa&&<div style={{...M,fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',marginBottom:5}}>GPA: {gpa}</div>}
              {desc&&<div style={{...M,fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',lineHeight:1.68,marginBottom:6}}>
                {desc.length>120?desc.slice(0,118)+'…':desc}
              </div>}
              {item.level!=null&&(
                <div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                    <span style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.35)'}}>Proficiency</span>
                    <span style={{...M,fontSize:'0.65rem',color}}>{item.level}%</span>
                  </div>
                  <div style={{height:3,borderRadius:2,background:'rgba(255,255,255,0.08)'}}>
                    <motion.div style={{height:'100%',borderRadius:2,background:`linear-gradient(to right,${PURPLE},${BLUE})`}}
                      initial={{width:0}} animate={{width:`${item.level}%`}} transition={{duration:1.2,delay:i*0.06}}/>
                  </div>
                </div>
              )}
              {href&&(
                <div style={{...M,fontSize:'0.62rem',color:'rgba(255,255,255,0.2)',
                  textAlign:'right',marginTop:6,letterSpacing:'0.1em'}}>
                  view on GitHub ↗
                </div>
              )}
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

// ── BIG CENTER CARD — Slides in when car stops ──
function BigSectionCard({ roomInfo, allData, color, onClose, resumeUrl }) {
  const sectionId = roomInfo?.id || 'about';

  return (
    <motion.div
      initial={{ opacity:0, y:60, scale:0.94 }}
      animate={{ opacity:1, y:0, scale:1 }}
      exit={{ opacity:0, y:40, scale:0.96 }}
      transition={{ duration:0.6, ease:[0.16,1,0.3,1] }}
      style={{
        position:'fixed',
        left:'50%', transform:'translateX(-50%)',
        top: isMobile ? '10vh' : 'calc(5vh + 52px)',
        bottom: isMobile ? '10vh' : 'calc(5vh + 68px)',
        width: isMobile ? '92vw' : 'min(620px, 52vw)',
        zIndex:45,
        display:'flex', flexDirection:'column',
      }}
    >
      {/* Card header */}
      <div style={{
        padding:'12px 20px 10px',
        background:`linear-gradient(135deg, rgba(2,1,20,0.96), ${color}22)`,
        border:`1px solid ${color}50`, borderBottom:'none',
        borderRadius:'14px 14px 0 0', position:'relative',
      }}>
        <Brackets color={color} size={11}/>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position:'absolute', top:10, right:14,
            background:'none', border:`1px solid rgba(255,255,255,0.15)`,
            color:'rgba(255,255,255,0.4)', borderRadius:6,
            padding:'2px 8px', cursor:'pointer', fontSize:'0.7rem',
            fontFamily:'var(--font-mono)', letterSpacing:'0.1em',
          }}
        >ESC</button>
        <div style={{...M, fontSize:'0.6rem', color, letterSpacing:'0.35em', textTransform:'uppercase', marginBottom:4}}>
          {roomInfo?.cityZone}
        </div>
        <div style={{...D, fontSize:'2rem', color:'#f0f0ff', fontWeight:300, lineHeight:1}}>
          {roomInfo?.label}
        </div>
      </div>

      {/* Colored top accent */}
      <div style={{height:2, background:`linear-gradient(to right, ${color}, ${color}44)`, border:`0 solid ${color}50`, borderTop:'none'}}/>

      {/* Card body — all section data */}
      <CardBody sectionId={sectionId} allData={allData} color={color} roomInfo={roomInfo} />


      {/* Footer */}
      <div style={{
        padding:'10px 20px',
        background:`rgba(2,1,20,0.95)`,
        border:`1px solid ${color}22`, borderTop:'none',
        borderRadius:'0 0 14px 14px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        gap:10,
      }}>
        <span style={{...M, fontSize:'0.65rem', color:'rgba(255,255,255,0.22)'}}>
          {allData.length} {roomInfo?.label} entries · Live from RTDB
        </span>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                ...M, fontSize:'0.78rem', letterSpacing:'0.12em',
                padding:'7px 18px', borderRadius:8,
                border:`1.5px solid ${color}70`,
                color, textDecoration:'none',
                background:`${color}14`,
                transition:'all 0.2s',
                boxShadow:`0 0 14px ${color}20`,
                fontWeight:600, whiteSpace:'nowrap',
              }}
              onMouseEnter={e=>{ e.currentTarget.style.background=`${color}28`; e.currentTarget.style.boxShadow=`0 0 24px ${color}40`; }}
              onMouseLeave={e=>{ e.currentTarget.style.background=`${color}14`; e.currentTarget.style.boxShadow=`0 0 14px ${color}20`; }}
            >
              ↓ Download Resume
            </a>
          )}
          <div style={{display:'flex',gap:5}}>
            {[YELLOW,BLUE,PURPLE].map((c,i)=>(
              <div key={i} style={{width:6,height:6,borderRadius:'50%',background:c,opacity:c===color?1:0.2}}/>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AgentHUD({
  rooms, currentRoom, onNext, onPrev, onGoTo,
  speaking, roomInfo, sectionData, isTransitioning, atmosphere,
  showBigCard, onCloseBigCard, resumeUrl, persona, switchPersona, stopVoice ,
}) {
  const [time, setTime]  = useState('');
  const [show, setShow]  = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', {hour12:false}));
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  }, []);

  useEffect(() => {
    setShow(false);
    if (!isTransitioning) { const t=setTimeout(()=>setShow(true),900); return ()=>clearTimeout(t); }
  }, [currentRoom, isTransitioning]);

  const color  = roomInfo?.color||YELLOW;
  const accentA = color===YELLOW?BLUE:YELLOW;
  const routePct = Math.round(((currentRoom+1)/rooms.length)*100);
  const sectionId = roomInfo?.id||'about';

  // Use RTDB data if available, otherwise rich placeholder
  const allData =
  sectionData && !Array.isArray(sectionData)
    ? [sectionData]   // ✅ convert object → array
    : sectionData.length > 0
    ? sectionData
    : (PLACEHOLDER[sectionId] || []);
  const leftData = allData.slice(0,3);

  return (
    <>
      {/* ══ TOP BAR ══ */}
      <div style={{position:'fixed',top:'5vh',left:0,right:0,zIndex:42,display:'flex',alignItems:'center',justifyContent:'space-between',padding: isMobile ? '6px 10px' : '8px 22px',background:'linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)'}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:9,height:9,borderRadius:'50%',background:speaking?BLUE:`${color}80`,boxShadow:speaking?`0 0 14px ${BLUE}`:'none',animation:speaking?'glowPulse 0.75s infinite':'none',transition:'all 0.3s'}}/>
          <span style={{...M,fontSize:'0.82rem',letterSpacing:'0.3em',textTransform:'uppercase',color:speaking?BLUE:'rgba(255,255,255,0.35)'}}>
            {persona==='friday'?'FRIDAY':'JARVIS'} · {isTransitioning?'EN ROUTE':speaking?'NARRATING':'STANDBY'}
          </span>
          {speaking&&<Wave color={BLUE}/>}
        </div>
        <AnimatePresence mode="wait">
          <motion.span key={currentRoom} initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            style={{...M,fontSize:'0.75rem',color,letterSpacing:'0.35em',textTransform:'uppercase',opacity:0.8}}>
            {roomInfo?.cityZone}
          </motion.span>
        </AnimatePresence>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <a
            href={resumeUrl || '#'}
            target={resumeUrl ? '_blank' : undefined}
            rel="noreferrer"
            onClick={!resumeUrl ? e => e.preventDefault() : undefined}
            style={{
              ...M, fontSize: isMobile ? '0.65rem' : '0.75rem', letterSpacing:'0.14em',
              padding: isMobile ? '6px 10px' : '5px 18px', borderRadius:8,
              border:`1.5px solid rgba(0,212,255,${resumeUrl?'0.6':'0.2'})`,
              color: resumeUrl ? '#00D4FF' : 'rgba(0,212,255,0.35)',
              textDecoration:'none',
              background: resumeUrl ? 'rgba(0,212,255,0.12)' : 'rgba(0,212,255,0.04)',
              transition:'all 0.2s',
              cursor: resumeUrl ? 'pointer' : 'not-allowed',
              boxShadow: resumeUrl ? '0 0 18px rgba(0,212,255,0.2)' : 'none',
              fontWeight: 600,
            }}
            onMouseEnter={e=>{ if(resumeUrl){ e.currentTarget.style.background='rgba(0,212,255,0.22)'; e.currentTarget.style.boxShadow='0 0 28px rgba(0,212,255,0.35)'; }}}
            onMouseLeave={e=>{ e.currentTarget.style.background=resumeUrl?'rgba(0,212,255,0.12)':'rgba(0,212,255,0.04)'; e.currentTarget.style.boxShadow=resumeUrl?'0 0 18px rgba(0,212,255,0.2)':'none'; }}
          >
            ↓ DOWNLOAD RESUME
          </a>
          <a
            href="/"
            style={{
              ...M, fontSize:'0.75rem', letterSpacing:'0.2em',
              padding:'5px 18px', borderRadius:8,
              border:'1px solid rgba(255,255,255,0.22)',
              color:'rgba(255,255,255,0.7)', textDecoration:'none',
              background:'rgba(255,255,255,0.05)',
              transition:'background 0.2s',
            }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
            onClick={(e) => {
    e.preventDefault();
    stopVoice();         // 🔥 STOP JARVIS
    window.location.href = "/";
  }}
          >
            EXIT ×
          </a>
        </div>
      </div>

      {/* ══ PROGRESS BAR ══ */}
      <div style={{position:'fixed',top:'calc(5vh + 38px)',left: isMobile ? 10 : 22,ight: isMobile ? 10 : 2,zIndex:42,display:'flex',gap:5}}>
        {rooms.map((room,i)=>(
          <button key={room.id} onClick={()=>onGoTo(i)} style={{flex:1,height:3,background:'none',border:'none',cursor:'pointer',padding:0}}>
            <div style={{height:'100%',borderRadius:2,background:i===currentRoom?room.color:i<currentRoom?'rgba(255,255,255,0.32)':'rgba(255,255,255,0.09)',boxShadow:i===currentRoom?`0 0 9px ${room.color}`:'none',transition:'all 0.4s'}}/>
          </button>
        ))}
      </div>

      {/* ══ LEFT PANEL — telemetry + mini cards ══ */}
      <div style={{position:'fixed',left:18,zIndex:40,top:'calc(5vh + 58px)',bottom:'calc(5vh + 74px)',Width:210,display: isMobile ? 'none' : 'flex',flexDirection:'column',gap:9}}>
        {/* Ring + zone */}
        <div style={{display:'flex',alignItems:'center',gap:11,paddingLeft:2}}>
          <Ring color={color} size={38}/>
          <div>
            <div style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.24)',marginBottom:1}}>ZONE</div>
            <div style={{...M,fontSize:'1.05rem',color,lineHeight:1,fontWeight:600}}>
              {String(currentRoom+1).padStart(2,'0')}/{rooms.length}
            </div>
          </div>
        </div>

        {/* System */}
        <div style={{...glass(color),padding:'11px 14px'}}>
          <Brackets color={color} size={9}/>
          <div style={{...M,fontSize:'0.68rem',color,letterSpacing:'0.28em',textTransform:'uppercase',marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${color}22`,opacity:0.9}}>SYSTEM</div>
          <StatRow label="STATUS" value={isTransitioning?'DRIVE':'PARKED'} color={color}/>
          <StatRow label="ROUTE"  value={`${routePct}%`}                   color={color}/>
          <StatRow label="SPEED"  value={isTransitioning?'MAX':'000 km/h'} color={BLUE}/>
          <StatRow label="NEON"   value="ACTIVE"                            color={YELLOW}/>
        </div>

        {/* Voice Switcher */}
        <div style={{...glass(color), padding:'14px 14px'}}>
          <Brackets color={color} size={9}/>
          <div style={{...M,fontSize:'0.68rem',color,letterSpacing:'0.28em',textTransform:'uppercase',marginBottom:12,paddingBottom:6,borderBottom:`1px solid ${color}22`,opacity:0.9}}>
            AI VOICE
          </div>

          {/* JARVIS card */}
          <div
            onClick={() => switchPersona('jarvis')}
            style={{
              padding:'12px 12px', borderRadius:9, marginBottom:8, cursor:'pointer',
              background: persona==='jarvis' ? `${BLUE}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${persona==='jarvis' ? BLUE : 'rgba(255,255,255,0.08)'}`,
              transition:'all 0.25s',
              boxShadow: persona==='jarvis' ? `0 0 18px ${BLUE}30` : 'none',
            }}
          >
            <div style={{display:'flex', alignItems:'center', gap:9, marginBottom:5}}>
              <div style={{
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                background: persona==='jarvis' ? `${BLUE}30` : 'rgba(255,255,255,0.06)',
                border:`1.5px solid ${persona==='jarvis' ? BLUE : 'rgba(255,255,255,0.15)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.75rem',
              }}>⬡</div>
              <div>
                <div style={{...M, fontSize:'0.82rem', color: persona==='jarvis' ? BLUE : 'rgba(255,255,255,0.6)', fontWeight:600, letterSpacing:'0.08em'}}>
                  JARVIS
                </div>
                <div style={{...M, fontSize:'0.6rem', color:'rgba(255,255,255,0.3)', letterSpacing:'0.05em'}}>
                  Deep · Male · Tactical
                </div>
              </div>
              {persona==='jarvis' && (
                <div style={{marginLeft:'auto', width:7, height:7, borderRadius:'50%', background:BLUE, boxShadow:`0 0 10px ${BLUE}`, animation:'glowPulse 1s infinite'}}/>
              )}
            </div>
          </div>

          {/* FRIDAY card */}
          <div
            onClick={() => switchPersona('friday')}
            style={{
              padding:'12px 12px', borderRadius:9, cursor:'pointer',
              background: persona==='friday' ? `${PURPLE}18` : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${persona==='friday' ? PURPLE : 'rgba(255,255,255,0.08)'}`,
              transition:'all 0.25s',
              boxShadow: persona==='friday' ? `0 0 18px ${PURPLE}30` : 'none',
            }}
          >
            <div style={{display:'flex', alignItems:'center', gap:9, marginBottom:5}}>
              <div style={{
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                background: persona==='friday' ? `${PURPLE}30` : 'rgba(255,255,255,0.06)',
                border:`1.5px solid ${persona==='friday' ? PURPLE : 'rgba(255,255,255,0.15)'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'0.75rem',
              }}>◈</div>
              <div>
                <div style={{...M, fontSize:'0.82rem', color: persona==='friday' ? PURPLE : 'rgba(255,255,255,0.6)', fontWeight:600, letterSpacing:'0.08em'}}>
                  FRIDAY
                </div>
                <div style={{...M, fontSize:'0.6rem', color:'rgba(255,255,255,0.3)', letterSpacing:'0.05em'}}>
                  Clear · Female · Precise
                </div>
              </div>
              {persona==='friday' && (
                <div style={{marginLeft:'auto', width:7, height:7, borderRadius:'50%', background:PURPLE, boxShadow:`0 0 10px ${PURPLE}`, animation:'glowPulse 1s infinite'}}/>
              )}
            </div>
          </div>

          {/* Active label */}
          <div style={{...M, fontSize:'0.6rem', color:'rgba(255,255,255,0.22)', textAlign:'center', marginTop:10, letterSpacing:'0.1em'}}>
            {speaking ? `${persona==='jarvis'?'JARVIS':'FRIDAY'} SPEAKING...` : 'TAP TO SWITCH VOICE'}
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — detail cards ══ */}
      <AnimatePresence mode="wait">
        {show&&!isTransitioning&&(
          <motion.div key={`rp-${currentRoom}`} initial={{opacity:0,x:22}} animate={{opacity:1,x:0}} exit={{opacity:0,x:22}} transition={{duration:0.5,ease:[0.16,1,0.3,1]}}
            style={{position:'fixed',right: isMobile ? '5%' : 18,zIndex:40,top:'calc(5vh + 58px)',bottom:'calc(5vh + 74px)',width: isMobile ? '90vw' : 280,display:'flex',flexDirection:'column'}}>
            <div style={{padding:'9px 16px 8px',background:`linear-gradient(90deg, rgba(2,1,20,0.92), ${color}1e)`,border:`1px solid ${color}48`,borderBottom:'none',borderRadius:'11px 11px 0 0',position:'relative'}}>
              <Brackets color={color} size={9}/>
              <div style={{...M,fontSize:'0.68rem',color,letterSpacing:'0.3em',textTransform:'uppercase'}}>DATA FEED · {roomInfo?.label}</div>
            </div>
            <div style={{flex:1,overflowY:'auto',padding:'11px 16px',background:'rgba(2,1,20,0.88)',border:`1px solid ${color}2e`,borderTop:`1px solid ${color}5a`,backdropFilter:'blur(22px)',WebkitBackdropFilter:'blur(22px)'}}>
              {allData.slice(0,5).map((item,i)=>{
                const title=item.title||item.name||item.degree||`Entry ${i+1}`;
                const sub=item.subtitle||item.issuer||item.institution||item.category||'';
                const year=item.year||item.date||'';
                const desc=item.description||item.bio||'';
                return (
                  <motion.div key={item.id||`rcard${i}`} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}
                    style={{padding:'10px 12px',borderRadius:9,marginBottom:8,background:`${color}0e`,border:`1px solid ${color}28`}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:6}}>
                      <div style={{...D,fontSize:'1.0rem',color:'#f0f0ff',lineHeight:1.3,flex:1}}>{title}</div>
                      {year&&<div style={{...M,fontSize:'0.68rem',color,opacity:0.82,flexShrink:0}}>{year}</div>}
                    </div>
                    {sub&&<div style={{...M,fontSize:'0.72rem',color,opacity:0.62,marginTop:3}}>{sub}</div>}
                    {desc&&<div style={{...M,fontSize:'0.7rem',color:'rgba(255,255,255,0.32)',marginTop:4,lineHeight:1.65}}>{desc.slice(0,100)}{desc.length>100?'…':''}</div>}
                    {item.level!=null&&(
                      <div style={{marginTop:6,height:2.5,borderRadius:1.5,background:'rgba(255,255,255,0.07)'}}>
                        <motion.div style={{height:'100%',borderRadius:1.5,background:`linear-gradient(to right, ${PURPLE}, ${BLUE})`}} initial={{width:0}} animate={{width:`${item.level}%`}} transition={{duration:1.2,delay:i*0.07}}/>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {allData.length>5&&<div style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.2)',textAlign:'center',paddingTop:4}}>+{allData.length-5} more entries</div>}
            </div>
            <div style={{padding:'7px 16px',background:'rgba(2,1,20,0.82)',border:`1px solid ${color}22`,borderTop:'none',borderRadius:'0 0 11px 11px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <span style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.22)'}}>LIVE DATA</span>
              <div style={{display:'flex',gap:5}}>{[YELLOW,BLUE,PURPLE].map((c,i)=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:c,opacity:c===color?1:0.2}}/>)}</div>
              <span style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.22)'}}>{time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transit right panel */}
      {isTransitioning&&(
        <div style={{position:'fixed',right:18,zIndex:40,top:'calc(5vh + 58px)',width:280,...glass(color),padding:'20px'}}>
          <Brackets color={color} size={9}/>
          <div style={{...M,fontSize:'0.75rem',color,letterSpacing:'0.42em',textTransform:'uppercase',textAlign:'center',marginBottom:12}}>IN TRANSIT</div>
          <div style={{...D,fontSize:'2rem',color:'#f0f0ff',textAlign:'center',marginBottom:14,lineHeight:1}}>{rooms[currentRoom]?.label}</div>
          <div style={{...M,fontSize:'0.7rem',color:'rgba(255,255,255,0.32)',textAlign:'center',lineHeight:1.75,marginBottom:14}}>{rooms[currentRoom]?.cityZone}</div>
          <div style={{display:'flex',justifyContent:'center',gap:6}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:color,animation:'glowPulse 0.7s ease infinite',animationDelay:`${i*0.11}s`}}/>)}</div>
        </div>
      )}

      {/* ══ BIG CENTER CARD — appears when car stops ══ */}
      <AnimatePresence>
        {showBigCard && !isTransitioning && (
          <BigSectionCard
            key={`big-${currentRoom}`}
            roomInfo={roomInfo}
            allData={allData}
            color={color}
            onClose={onCloseBigCard}
            resumeUrl={resumeUrl}
          />
        )}
      </AnimatePresence>

      {/* ══ BOTTOM — label + nav ══ */}
      <div style={{position:'fixed',bottom:'5vh',left:'50%',transform:'translateX(-50%)',zIndex:40,display:'flex',flexDirection:'column',alignItems:'center',gap:12,paddingBottom:14}}>
        <AnimatePresence mode="wait">
          <motion.div key={currentRoom} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} style={{textAlign:'center',pointerEvents:'none'}}>
            <div style={{...M,fontSize:'0.72rem',color,letterSpacing:'0.44em',textTransform:'uppercase',marginBottom:4}}>
              SECTION {String(currentRoom+1).padStart(2,'0')} / {rooms.length}
            </div>
            <div style={{...D,fontSize: isMobile ? '1.6rem' : '2.6rem',color:'#f0f0ff',fontWeight:300,lineHeight:1.1}}>{roomInfo?.label}</div>
          </motion.div>
        </AnimatePresence>

        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <button onClick={onPrev} disabled={currentRoom===0}
            style={{width: isMobile ? 40 : 46,height: isMobile ? 40 : 46,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,background:currentRoom===0?'rgba(255,255,255,0.04)':`${PURPLE}30`,border:`1.5px solid ${currentRoom===0?'rgba(255,255,255,0.08)':PURPLE+'65'}`,color:currentRoom===0?'rgba(255,255,255,0.2)':'#fff',cursor:currentRoom===0?'not-allowed':'pointer'}}>←</button>
          <div style={{display:'flex',gap:8}}>
            {rooms.map((room,i)=>(
              <button key={room.id} onClick={()=>onGoTo(i)} style={{border:'none',cursor:'pointer',padding:0,transition:'all 0.35s',width:i===currentRoom?24:8,height:8,borderRadius:i===currentRoom?5:'50%',background:i===currentRoom?room.color:'rgba(255,255,255,0.18)',boxShadow:i===currentRoom?`0 0 12px ${room.color}`:'none'}}/>
            ))}
          </div>
          <button onClick={onNext} disabled={currentRoom===rooms.length-1}
            style={{width:46,height:46,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,background:currentRoom===rooms.length-1?'rgba(255,255,255,0.04)':`${color}30`,border:`1.5px solid ${currentRoom===rooms.length-1?'rgba(255,255,255,0.08)':color+'65'}`,color:currentRoom===rooms.length-1?'rgba(255,255,255,0.2)':color,cursor:currentRoom===rooms.length-1?'not-allowed':'pointer'}}>→</button>
        </div>
      </div>

      {/* Corner micro labels */}
      <div style={{position:'fixed',top:'calc(5vh + 42px)',left:18,zIndex:38,pointerEvents:'none',display:'flex',alignItems:'center',gap:6}}>
        <div style={{width:5,height:5,background:YELLOW,opacity:0.5,transform:'rotate(45deg)'}}/>
        <span style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.18)',letterSpacing:'0.2em'}}>SURIYA.AI</span>
      </div>
      <div style={{position:'fixed',top:'calc(5vh + 42px)',right:18,zIndex:38,pointerEvents:'none',textAlign:'right'}}>
        <span style={{...M,fontSize:'0.65rem',color:'rgba(255,255,255,0.18)',letterSpacing:'0.12em'}}>{isTransitioning?'▶ MAX VELOCITY':'⏸ 000 km/h'}</span>
      </div>
      <div style={{position:'fixed',bottom:'calc(5vh + 8px)',left:18,zIndex:38,pointerEvents:'none'}}>
        <span style={{...M,fontSize:'0.62rem',color:'rgba(255,255,255,0.12)',letterSpacing:'0.12em'}}>Ferrari SF90 XX Stradale</span>
      </div>
      <div style={{position:'fixed',bottom:'calc(5vh + 8px)',right:18,zIndex:38,pointerEvents:'none',textAlign:'right'}}>
        <span style={{...M,fontSize:'0.62rem',color:'rgba(255,255,255,0.12)',letterSpacing:'0.12em'}}>NEON ODYSSEY · {time}</span>
      </div>
    </>
  );
}