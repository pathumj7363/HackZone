import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import FeatureSection from '../components/home/InteractiveFeatures';

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const TYPING_WORDS = ['Develop', 'Build', 'Create', 'Innovate', 'Launch', 'Hack'];
const BG = '#0f172a';

/* ─────────────────────────────────────────────
   SVG Icons for Floating Cards
───────────────────────────────────────────── */
const IC = {
  lightning: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9z" />
    </svg>
  ),
  shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  code: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  cube: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  star: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  globe: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  chain: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  cpu: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  award: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
  rocket: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

/* ─────────────────────────────────────────────
   Floating Card Data (10 total)
───────────────────────────────────────────── */
const FLOAT_CARDS = [
  // Left side (5)
  { id: 1, icon: 'lightning', label: 'Fast', color: '#6366f1', top: '10%', left: '2%', delay: '0s', dur: '4.2s' },
  { id: 2, icon: 'shield', label: 'Secure', color: '#10b981', top: '28%', left: '7%', delay: '1.3s', dur: '5.1s' },
  { id: 3, icon: 'code', label: 'Code', color: '#3b82f6', top: '50%', left: '1%', delay: '0.6s', dur: '4.6s' },
  { id: 4, icon: 'cube', label: 'Build', color: '#8b5cf6', top: '68%', left: '8%', delay: '2.1s', dur: '3.9s' },
  { id: 5, icon: 'star', label: 'Win', color: '#f59e0b', top: '83%', left: '3%', delay: '0.9s', dur: '5.3s' },
  // Right side (5)
  { id: 6, icon: 'globe', label: 'Global', color: '#06b6d4', top: '7%', right: '3%', delay: '0.4s', dur: '4.9s' },
  { id: 7, icon: 'chain', label: 'Chain', color: '#8b5cf6', top: '25%', right: '1%', delay: '1.7s', dur: '4.3s' },
  { id: 8, icon: 'cpu', label: 'AI', color: '#10b981', top: '45%', right: '6%', delay: '0.2s', dur: '5.6s' },
  { id: 9, icon: 'award', label: 'Prize', color: '#f59e0b', top: '63%', right: '2%', delay: '1.5s', dur: '3.7s' },
  { id: 10, icon: 'rocket', label: 'Launch', color: '#ef4444', top: '79%', right: '5%', delay: '0.7s', dur: '4.5s' },
];

/* ─────────────────────────────────────────────
   Helper: hex → "r, g, b"
───────────────────────────────────────────── */
function toRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1], 16)}, ${parseInt(r[2], 16)}, ${parseInt(r[3], 16)}` : '255,255,255';
}




/* ─────────────────────────────────────────────
   Single Floating Card
───────────────────────────────────────────── */
function FloatCard({ card }) {
  const Icon = IC[card.icon];
  const rgb = toRgb(card.color);
  const pos = {};
  if (card.left) pos.left = card.left;
  if (card.right) pos.right = card.right;

  return (
    <div
      style={{
        position: 'absolute',
        top: card.top,
        ...pos,
        width: '62px',
        height: '64px',
        borderRadius: '15px',
        background: `rgba(${rgb}, 0.13)`,
        border: `1px solid rgba(${rgb}, 0.28)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: card.color,
        fontSize: '10px',
        fontWeight: 700,
        gap: '5px',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: `0 0 22px rgba(${rgb}, 0.18)`,
        animation: `hz-float ${card.dur} ease-in-out infinite`,
        animationDelay: card.delay,
        zIndex: 1,
        userSelect: 'none',
      }}
    >
      <Icon />
      <span style={{ letterSpacing: '0.3px' }}>{card.label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Home Page
───────────────────────────────────────────── */
export default function Home() {
  /* Typing effect */
  const [wIdx, setWIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(120);

  /* Counters */
  const [devs, setDevs] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [hacks, setHacks] = useState(0);



  /* ── Typing ── */
  useEffect(() => {
    let t;
    const word = TYPING_WORDS[wIdx];
    if (isDeleting) {
      if (typed.length === 0) {
        setIsDeleting(false);
        setWIdx(p => (p + 1) % TYPING_WORDS.length);
        setSpeed(400);
      } else {
        t = setTimeout(() => setTyped(s => s.slice(0, -1)), 55);
      }
    } else {
      if (typed.length === word.length) {
        t = setTimeout(() => setIsDeleting(true), 2000);
      } else {
        t = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), speed);
      }
    }
    return () => clearTimeout(t);
  }, [typed, isDeleting, wIdx, speed]);

  /* ── Counters ── */
  useEffect(() => {
    const STEPS = 60, DURATION = 2000;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const ease = (step / STEPS) * (2 - step / STEPS);
      setDevs(Math.floor(ease * 12450));
      setPrizes(Math.floor(ease * 50000));
      setHacks(Math.floor(ease * 14));
      if (step >= STEPS) {
        clearInterval(id);
        setDevs(12450); setPrizes(50000); setHacks(14);
      }
    }, DURATION / STEPS);
    return () => clearInterval(id);
  }, []);

  /* ─────────── RENDER ─────────── */
  return (
    <div style={{ background: 'transparent', position: 'relative', overflow: 'hidden' }}>

      {/* ── Global keyframes injected once ── */}
      <style>{`
        @keyframes hz-float {
          0%,100% { transform: translateY(0px) rotate(0deg);  }
          35%      { transform: translateY(-13px) rotate(1.2deg); }
          70%      { transform: translateY(-5px)  rotate(-0.8deg); }
        }
        @keyframes hz-aurora {
          0%,100% { opacity: 0.45; transform: translateX(-50%) scale(1);    }
          50%      { opacity: 0.7;  transform: translateX(-50%) scale(1.07); }
        }
        @keyframes hz-blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes hz-fade-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

      `}</style>



      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section
        style={{
          position: 'relative',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1rem',
          overflow: 'hidden',
        }}
      >
        {/* Aurora glow */}
        <div style={{
          position: 'absolute',
          top: '22%', left: '50%',
          width: '680px', height: '380px',
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.2) 0%, rgba(139,92,246,0.1) 45%, transparent 72%)',
          animation: 'hz-aurora 4.5s ease-in-out infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />

        {/* Floating blockchain icon cards */}
        {FLOAT_CARDS.map(c => <FloatCard key={c.id} card={c} />)}

        {/* Hero content */}
        <div
          className="hz-container"
          style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: '740px' }}
        >
          {/* Badge */}
          <div style={{ marginBottom: '1.75rem', animation: 'hz-fade-up 0.7s ease-out both' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(108, 99, 255, 0.14)',
              border: '1px solid rgba(108, 99, 255, 0.4)',
              color: '#a5b4fc',
              padding: '0.4rem 1.2rem',
              borderRadius: '9999px',
              fontSize: '0.85rem', fontWeight: 700,
              backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              letterSpacing: '0.3px',
            }}>
              <span style={{ fontSize: '1rem' }}>🚀</span> v1.0 is Live
            </span>
          </div>

          {/* Headline with typing effect */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginBottom: '1.5rem',
            animation: 'hz-fade-up 0.7s ease-out 0.1s both',
          }}>
            Build the Future with{' '}
            <span style={{ color: '#7c6fff' }}>{typed}</span>
            <span style={{ color: '#7c6fff', animation: 'hz-blink 1s step-end infinite', display: 'inline-block' }}>|</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '570px', margin: '0 auto 2.75rem',
            lineHeight: 1.72,
            animation: 'hz-fade-up 0.7s ease-out 0.2s both',
          }}>
            The ultimate platform to host, participate, and evaluate hackathons. Unleash your creativity and collaborate with developers globally.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center',
            marginBottom: '3.5rem',
            animation: 'hz-fade-up 0.7s ease-out 0.3s both',
          }}>
            <Link to="/register/role-select" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#4f46e5',
                  color: '#fff', border: 'none',
                  padding: '0.78rem 2.1rem', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.background = '#4338ca'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)'; e.currentTarget.style.background = '#4f46e5'; }}
              >
                Get Started
              </button>
            </Link>
            <Link to="/hackathons" style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.88)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  padding: '0.78rem 2.1rem', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
              >
                Browse Hackathons
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem',
            color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem',
            animation: 'hz-fade-up 0.7s ease-out 0.45s both',
          }}>
            {[
              { icon: '⚡', num: devs.toLocaleString(), suffix: '', rest: 'Developers Active' },
              { icon: '🏆', num: `$${prizes.toLocaleString()}`, suffix: '+', rest: 'In Prizes' },
              { icon: '🚀', num: hacks, suffix: '', rest: 'Active Hackathons' },
            ].map((s, i) => (
              <React.Fragment key={s.icon}>
                {i > 0 && (
                  <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.14)', alignSelf: 'center' }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                  <span>
                    <strong style={{ color: '#fff' }}>{s.num}{s.suffix}</strong>
                    {' '}{s.rest}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURE SECTION
      ══════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <FeatureSection dark />
      </div>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section style={{ position: 'relative', zIndex: 2, padding: '3.5rem 0 5rem' }}>
        <div className="hz-container">
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: 'clamp(2.5rem,5vw,4rem) 2rem',
            textAlign: 'center',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* subtle gradient orbs */}
            <div style={{ position: 'absolute', top: '-60px', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse,rgba(108,99,255,0.12),transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(ellipse,rgba(139,92,246,0.1),transparent 70%)', pointerEvents: 'none' }} />

            <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 800, color: '#fff', marginBottom: '0.85rem', position: 'relative', zIndex: 1 }}>
              Ready to start building?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem', marginBottom: '2.25rem', position: 'relative', zIndex: 1 }}>
              Join thousands of developers building the next big thing.
            </p>
            <Link to="/register/role-select" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
              <button
                style={{
                  background: '#4f46e5',
                  color: '#fff', border: 'none',
                  padding: '0.875rem 2.5rem', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'; e.currentTarget.style.background = '#4338ca'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.2)'; e.currentTarget.style.background = '#4f46e5'; }}
              >
                Create Your Free Account
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
