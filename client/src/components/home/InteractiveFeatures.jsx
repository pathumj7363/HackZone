import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

/* ─────────────────────────────────────────────
   Tilt Card (3-D hover)
───────────────────────────────────────────── */
const TiltCard = ({ children, isActive, onClick, borderColor, dark }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left, y = e.clientY - top;
    const rX = ((y - height / 2) / (height / 2)) * -8;
    const rY = ((x - width  / 2) / (width  / 2)) *  8;
    card.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.02,1.02,1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  };

  const bg      = dark ? (isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)') : undefined;
  const border  = isActive ? `2px solid ${borderColor}` : (dark ? '2px solid rgba(255,255,255,0.08)' : '2px solid transparent');
  const shadow  = isActive ? `0 0 24px ${borderColor}45` : undefined;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease-out',
        height: '100%',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          background: bg,
          border,
          borderTop: `4px solid ${borderColor}`,
          boxShadow: shadow,
          borderRadius: '12px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
          transform: 'translateZ(30px)',
          transition: 'all 0.3s ease',
          backdropFilter: dark ? 'blur(10px)' : undefined,
          WebkitBackdropFilter: dark ? 'blur(10px)' : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Mock: Team Builder (Participant)
───────────────────────────────────────────── */
const MockTeamBuilder = ({ dark }) => {
  const [team,      setTeam]      = useState(['You']);
  const [available, setAvailable] = useState(['Alex (Frontend)', 'Sam (Backend)', 'Jordan (Design)']);

  const add = (i) => {
    if (team.length >= 4) return;
    setTeam(t => [...t, available[i]]);
    setAvailable(a => a.filter((_, idx) => idx !== i));
  };

  const cardBg   = dark ? '#0d1130' : 'var(--hz-bg)';
  const slotBg   = dark ? 'rgba(255,255,255,0.05)' : 'var(--hz-surface)';
  const slotBord = dark ? 'rgba(255,255,255,0.1)'  : 'var(--hz-border)';
  const txt      = dark ? '#e2e8f0' : 'var(--hz-text)';
  const muted    = dark ? 'rgba(255,255,255,0.45)' : 'var(--hz-text-muted)';
  const addedBg  = dark ? '#4f46e5' : 'var(--hz-info)';

  return (
    <div style={{ padding: '1.5rem', background: cardBg, borderRadius: '10px', color: txt }}>
      <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Team Builder (Max 4)</h4>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.82rem', color: muted, marginBottom: '0.75rem', fontWeight: 700 }}>Available Developers</div>
          {available.length === 0 && <div style={{ fontSize: '0.82rem', fontStyle: 'italic', color: muted }}>No more developers available</div>}
          {available.map((m, i) => (
            <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem', background: slotBg, border: `1px solid ${slotBord}`, marginBottom: '0.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>
              <span style={{ color: txt }}>{m}</span>
              <button onClick={e => { e.stopPropagation(); add(i); }} style={{ background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>+</button>
            </div>
          ))}
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.82rem', color: muted, marginBottom: '0.75rem', fontWeight: 700 }}>Your Team ({team.length}/4)</div>
          {team.map((m, i) => (
            <div key={i} style={{ padding: '0.7rem', background: addedBg, color: '#fff', marginBottom: '0.5rem', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'rgba(255,255,255,0.8)' }} />
              {m}
            </div>
          ))}
          {Array.from({ length: 4 - team.length }).map((_, i) => (
            <div key={`e${i}`} style={{ padding: '0.7rem', border: `1px dashed ${slotBord}`, color: muted, marginBottom: '0.5rem', borderRadius: '8px', fontSize: '0.875rem' }}>Empty Slot</div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Mock: Live Metrics Chart (Organizer)
───────────────────────────────────────────── */
const MockMetricsChart = ({ dark }) => {
  const [bars, setBars] = useState([20, 50, 30, 80, 60]);

  useEffect(() => {
    const id = setInterval(() => setBars(b => b.map(() => Math.floor(Math.random() * 65) + 30)), 2500);
    return () => clearInterval(id);
  }, []);

  const cardBg = dark ? '#0d1130' : 'var(--hz-bg)';
  const txt    = dark ? '#e2e8f0' : 'var(--hz-text)';
  const muted  = dark ? 'rgba(255,255,255,0.45)' : 'var(--hz-text-muted)';
  const bord   = dark ? 'rgba(255,255,255,0.12)' : 'var(--hz-border)';

  return (
    <div style={{ padding: '1.5rem', background: cardBg, borderRadius: '10px', color: txt }}>
      <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Live Hackathon Registrations</h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '1.5rem', borderBottom: `2px solid ${bord}`, paddingBottom: '0.5rem' }}>
        {bars.map((h, i) => (
          <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, #10b981, #34d399)', height: `${h}%`, transition: 'height 0.8s cubic-bezier(.4,0,.2,1)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-22px', width: '100%', textAlign: 'center', fontSize: '0.72rem', fontWeight: 700, color: muted }}>{h}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.82rem', color: muted, fontWeight: 500 }}>
        {['Mon','Tue','Wed','Thu','Fri'].map(d => <span key={d} style={{ flex: 1, textAlign: 'center' }}>{d}</span>)}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Mock: Grading Sliders (Judge)
───────────────────────────────────────────── */
const MockJudgingSlider = ({ dark }) => {
  const [scores, setScores] = useState({ innovation: 8, technicalExecution: 7, impact: 0 });
  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const cardBg = dark ? '#0d1130' : 'var(--hz-bg)';
  const txt    = dark ? '#e2e8f0' : 'var(--hz-text)';
  const muted  = dark ? 'rgba(255,255,255,0.45)' : 'var(--hz-text-muted)';
  const tagBg  = (c) => dark ? `rgba(${c},0.18)` : `rgba(${c},0.1)`;

  return (
    <div style={{ padding: '1.5rem', background: cardBg, borderRadius: '10px', color: txt }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h4 style={{ margin: '0 0 0.4rem', fontSize: '1.05rem' }}>Grading Portal</h4>
          <div style={{ fontSize: '0.82rem', color: muted }}>Project: DeFi Lending Protocol</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {[{ label:'Solidity', c:'16,185,129' }, { label:'React', c:'59,130,246' }, { label:'Web3.js', c:'139,92,246' }].map(t => (
              <span key={t.label} style={{ padding: '0.15rem 0.6rem', background: tagBg(t.c), borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: dark ? '#c4b5fd' : '#4f46e5', border: `1px solid rgba(${t.c},0.3)` }}>{t.label}</span>
            ))}
          </div>
        </div>
        <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)', whiteSpace: 'nowrap' }}>
          {total} / {Object.keys(scores).length * 10} evaluated
        </span>
      </div>

      {/* Sliders */}
      {Object.entries(scores).map(([k, v]) => (
        <div key={k} style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.45rem', fontWeight: 500 }}>
            <span style={{ color: txt, textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g,' $1')}</span>
            <span style={{ color: '#a78bfa', fontWeight: 700 }}>{v} / 10</span>
          </div>
          <input
            type="range" min="0" max="10" value={v}
            onChange={e => setScores(s => ({ ...s, [k]: +e.target.value }))}
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#7c6fff', height: '6px' }}
          />
        </div>
      ))}

      {/* Submit */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button
          onClick={e => { e.stopPropagation(); }}
          style={{
            background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
            color: '#fff', border: 'none',
            padding: '0.55rem 1.4rem', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
        >
          Submit Score →
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Feature Section
───────────────────────────────────────────── */
export default function FeatureSection({ dark = false }) {
  const [activeTab, setActiveTab] = useState('participant');

  const features = [
    {
      id: 'participant', role: 'Participants',
      badgeStyle: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.35)' },
      color: '#3b82f6',
      title: 'Join & Build',
      desc: 'Discover exciting hackathons, form dynamic teams with other developers, and seamlessly submit your projects to win prizes.',
      link: '/register?role=participant', btnText: 'Join Now',
    },
    {
      id: 'organizer', role: 'Organizers',
      badgeStyle: { background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)' },
      color: '#10b981',
      title: 'Host & Manage',
      desc: 'Create hackathons, track registrations, manage teams, and assign judges with a powerful, zero-friction dashboard.',
      link: '/register?role=organizer', btnText: 'Host Event',
    },
    {
      id: 'judge', role: 'Judges',
      badgeStyle: { background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.35)' },
      color: '#f59e0b',
      title: 'Evaluate & Score',
      desc: 'Review assigned submissions efficiently with our integrated grading portal and provide detailed feedback to participants.',
      link: '/register?role=judge', btnText: 'Start Judging',
    },
  ];

  const sectionBg  = dark ? 'transparent'               : 'transparent';
  const headingClr = dark ? '#ffffff'                    : 'var(--hz-text)';
  const subClr     = dark ? 'rgba(255,255,255,0.55)'     : 'var(--hz-text-muted)';
  const winBg      = dark ? 'rgba(255,255,255,0.03)'     : 'var(--hz-surface)';
  const winBord    = dark ? 'rgba(255,255,255,0.08)'     : 'var(--hz-border)';
  const winHead    = dark ? 'rgba(255,255,255,0.04)'     : 'rgba(0,0,0,0.06)';
  const winTxt     = dark ? 'rgba(255,255,255,0.45)'     : 'var(--hz-text-muted)';
  const descClr    = dark ? 'rgba(255,255,255,0.55)'     : 'var(--hz-text-muted)';
  const titleClr   = dark ? '#ffffff'                    : 'var(--hz-text)';
  const btnVariant = dark ? 'ghost'                      : 'outline';

  return (
    <section className="hz-container" style={{ padding: '5rem 1.5rem' }}>
      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h2 style={{ fontSize: 'clamp(1.75rem,3.5vw,2.4rem)', fontWeight: 800, color: headingClr, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Everything You Need
        </h2>
        <p style={{ fontSize: '1.05rem', color: subClr }}>
          Click a card below to explore interactive previews of the platform.
        </p>
      </div>

      {/* Role cards */}
      <div className="row g-4 justify-content-center">
        {features.map(f => (
          <div className="col-12 col-md-6 col-lg-4" key={f.id}>
            <TiltCard
              isActive={activeTab === f.id}
              onClick={() => setActiveTab(f.id)}
              borderColor={f.color}
              dark={dark}
            >
              {/* Inner content — pointer-events: none so tilt works */}
              <div style={{ pointerEvents: 'none' }}>
                <span style={{
                  ...f.badgeStyle,
                  display: 'inline-block',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}>
                  {f.role}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: titleClr, marginBottom: '0.6rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: descClr, lineHeight: 1.6, marginBottom: '1.5rem' }}>{f.desc}</p>
              </div>
              <div>
                <Link to={f.link} style={{ textDecoration: 'none', pointerEvents: 'auto' }} onClick={e => e.stopPropagation()}>
                  <button style={{
                    width: '100%',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                    background: dark ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: dark ? 'rgba(255,255,255,0.8)' : f.color,
                    border: `1.5px solid ${dark ? 'rgba(255,255,255,0.15)' : f.color}`,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.12)' : `${f.color}18`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,0.06)' : 'transparent'; }}
                  >
                    {f.btnText}
                  </button>
                </Link>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>

      {/* Interactive Preview Window */}
      <div style={{ marginTop: '3.5rem' }}>
        <div style={{
          border: `1px solid ${winBord}`,
          background: winBg,
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.15)',
          backdropFilter: dark ? 'blur(14px)' : undefined,
          WebkitBackdropFilter: dark ? 'blur(14px)' : undefined,
        }}>
          {/* Mac window chrome */}
          <div style={{
            padding: '0.75rem 1.5rem',
            borderBottom: `1px solid ${winBord}`,
            background: winHead,
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: '0.82rem', color: winTxt, marginLeft: '1rem', fontWeight: 500, letterSpacing: '0.5px' }}>
              Interactive Preview / {features.find(f => f.id === activeTab)?.role}
            </span>
          </div>
          {/* Content */}
          <div style={{ padding: '2rem' }}>
            {activeTab === 'participant' && <MockTeamBuilder dark={dark} />}
            {activeTab === 'organizer'   && <MockMetricsChart dark={dark} />}
            {activeTab === 'judge'       && <MockJudgingSlider dark={dark} />}
          </div>
        </div>
      </div>
    </section>
  );
}
