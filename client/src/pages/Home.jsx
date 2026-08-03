import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FeatureSection from '../components/home/InteractiveFeatures';
import { ThemeContext } from '../context/ThemeContext';
import { getHackathonsApi } from '../api/hackathon.api';

const getStatusConfig = (status) => {
  const map = {
    'REGISTERING': { label: 'REGISTERING', bg: '#10b981' },
    'IN PROGRESS': { label: 'IN PROGRESS', bg: '#06b6d4' },
    'ENDED': { label: 'ENDED', bg: '#ef4444' },
    'COMING SOON': { label: 'COMING SOON', bg: '#334155' }
  };
  return map[(status || '').toUpperCase()] || { label: status || 'UNKNOWN', bg: '#64748b' };
};

export default function Home() {
  const { isDark } = useContext(ThemeContext);

  /* Typing effect for the hero section */
  const TYPING_WORDS = ['Hack', 'Build', 'Innovate', 'Ship'];
  const [wIdx, setWIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(120);

  /* Stats Counters */
  const [devs, setDevs] = useState(0);
  const [prizes, setPrizes] = useState(0);
  const [hacks, setHacks] = useState(0);

  // Fetch Preview Hackathons
  const [hackathonsPreview, setHackathonsPreview] = useState([]);
  const [loadingHacks, setLoadingHacks] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getHackathonsApi()
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data || []);
        // Get up to 5 for the modern carousel
        setHackathonsPreview(list.slice(0, 5));
        setLoadingHacks(false);
      })
      .catch(err => {
        console.error("Failed to load hackathons preview", err);
        setLoadingHacks(false);
      });
  }, []);

  useEffect(() => {
    if (hackathonsPreview.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex(cur => (cur + 1) % hackathonsPreview.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [hackathonsPreview.length]);

  useEffect(() => {
    let t;
    const word = TYPING_WORDS[wIdx];
    if (isDeleting) {
      if (typed.length === 0) {
        setIsDeleting(false);
        setWIdx(p => (p + 1) % TYPING_WORDS.length);
        setSpeed(150);
      } else {
        t = setTimeout(() => setTyped(s => s.slice(0, -1)), 40);
      }
    } else {
      if (typed.length === word.length) {
        t = setTimeout(() => setIsDeleting(true), 2500);
      } else {
        t = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), speed);
      }
    }
    return () => clearTimeout(t);
  }, [typed, isDeleting, wIdx, speed]);

  useEffect(() => {
    const STEPS = 60, DURATION = 2000;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const ease = (step / STEPS) * (2 - step / STEPS);
      setDevs(Math.floor(ease * 15420));
      setPrizes(Math.floor(ease * 75000));
      setHacks(Math.floor(ease * 24));
      if (step >= STEPS) {
        clearInterval(id);
        setDevs(15420); setPrizes(75000); setHacks(24);
      }
    }, DURATION / STEPS);
    return () => clearInterval(id);
  }, []);

  // Theme Colors
  const bg = isDark ? '#020202' : '#f1f5f9';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#334155';
  const gridLine = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.07)';
  const gridMask = isDark ? 'radial-gradient(circle at center, black, transparent 80%)' : 'radial-gradient(circle at center, black, transparent 80%)';
  const glowStart = isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.18)';
  const glowMid = isDark ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.1)';
  const statBg = isDark ? 'rgba(255,255,255,0.02)' : '#ffffff';
  const statBorder = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)';
  const statBorderHov = isDark ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.5)';
  const ctaBg = isDark ? 'rgba(255,255,255,0.02)' : '#ffffff';
  const btnSecBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const btnSecBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';
  const btnSecHovBg = isDark ? 'rgba(255,255,255,0.08)' : '#f8fafc';

  return (
    <div style={{ background: bg, color: textMain, position: 'relative', overflow: 'hidden', minHeight: '100vh', fontFamily: 'Inter, sans-serif', transition: 'background 0.3s ease, color 0.3s ease' }}>

      {/* ── Global Styles & Animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap');
        
        .hz-home-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, ${gridLine} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLine} 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: ${gridMask};
          -webkit-mask-image: ${gridMask};
          z-index: 0;
          pointer-events: none;
          transition: background-image 0.3s ease;
        }
        
        .hz-home-glow {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, ${glowStart} 0%, ${glowMid} 40%, transparent 70%);
          filter: blur(60px);
          z-index: 0;
          pointer-events: none;
          animation: pulseGlow 8s ease-in-out infinite alternate;
          transition: background 0.3s ease;
        }

        @keyframes pulseGlow {
          0% { transform: translateX(-50%) scale(1); opacity: 0.8; }
          100% { transform: translateX(-50%) scale(1.1); opacity: 1; }
        }

        @keyframes hz-fade-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        
        .hz-hero-title {
          font-family: 'Chakra Petch', sans-serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.04em;
          margin-bottom: 1.5rem;
          color: ${textMain};
          transition: color 0.3s ease;
        }

        .hz-hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: ${textSub};
          max-width: 650px;
          margin: 0 auto 3rem;
          line-height: 1.6;
          transition: color 0.3s ease;
        }

        .hz-btn-primary {
          background: linear-gradient(135deg, #06b6d4 0%, #22c55e 100%);
          color: #000;
          border: none;
          padding: 0.875rem 2.5rem;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(6,182,212,0.4);
          position: relative;
          overflow: hidden;
        }
        
        .hz-btn-primary::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: 0.5s;
        }
        
        .hz-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(34,197,94,0.6);
        }
        
        .hz-btn-primary:hover::before {
          left: 100%;
        }

        .hz-btn-secondary {
          background: ${btnSecBg};
          color: ${textMain};
          border: 1px solid ${btnSecBorder};
          padding: 0.875rem 2.5rem;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          box-shadow: ${isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'};
        }
        
        .hz-btn-secondary:hover {
          background: ${btnSecHovBg};
          transform: translateY(-2px);
        }

        .hz-stat-card {
          background: ${statBg};
          border: 1px solid ${statBorder};
          border-radius: 12px;
          padding: 1.5rem 2rem;
          min-width: 180px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: ${isDark ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.08)'};
        }
        .hz-stat-card:hover {
          border-color: ${statBorderHov};
          transform: translateY(-4px);
          box-shadow: ${isDark ? 'none' : '0 25px 30px -5px rgba(6, 182, 212, 0.15)'};
        }
      `}</style>

      {/* ── Background Elements ── */}
      <div className="hz-home-grid"></div>
      <div className="hz-home-glow"></div>

      {/* ── Hero Section ── */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 1.5rem 8rem', textAlign: 'center' }}>

        {/* Launch Badge */}
        <div style={{ animation: 'hz-fade-up 0.8s ease-out both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: isDark ? 'rgba(6,182,212,0.1)' : '#ffffff',
            border: `1px solid ${isDark ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.2)'}`,
            color: isDark ? '#22d3ee' : '#0891b2',
            padding: '0.4rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.85rem', fontWeight: 600,
            marginBottom: '2rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(6, 182, 212, 0.1)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }}></span>
            HackZone 2.0 is Live
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="hz-hero-title" style={{ animation: 'hz-fade-up 0.8s ease-out 0.1s both' }}>
          The Modern Platform to<br />
          <span style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block',
            paddingRight: '4px'
          }}>
            {typed}
          </span>
          <span style={{ color: '#06b6d4', opacity: isDeleting ? 0.4 : 1, transition: 'opacity 0.1s' }}>|</span>
        </h1>

        <p className="hz-hero-subtitle" style={{ animation: 'hz-fade-up 0.8s ease-out 0.2s both' }}>
          Host, participate, and evaluate hackathons globally. A premium, seamless experience designed for elite developers and forward-thinking organizers.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', animation: 'hz-fade-up 0.8s ease-out 0.3s both' }}>
          <Link to="/register/role-select" style={{ textDecoration: 'none' }}>
            <button className="hz-btn-primary">Start Building</button>
          </Link>
          <Link to="/hackathons" style={{ textDecoration: 'none' }}>
            <button className="hz-btn-secondary">Explore Hackathons</button>
          </Link>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center',
          marginTop: '5rem', animation: 'hz-fade-up 0.8s ease-out 0.45s both'
        }}>
          <div className="hz-stat-card">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: textMain, marginBottom: '0.25rem' }}>{devs.toLocaleString()}+</div>
            <div style={{ fontSize: '0.9rem', color: textSub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Hackers</div>
          </div>
          <div className="hz-stat-card">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: textMain, marginBottom: '0.25rem' }}>${prizes.toLocaleString()}+</div>
            <div style={{ fontSize: '0.9rem', color: textSub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Prizes Won</div>
          </div>
          <div className="hz-stat-card">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: textMain, marginBottom: '0.25rem' }}>{hacks}+</div>
            <div style={{ fontSize: '0.9rem', color: textSub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Events</div>
          </div>
        </div>
      </section>

      {/* ── Featured Hackathons Preview ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '8rem 1.5rem', background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'Chakra Petch', fontSize: '2.5rem', fontWeight: 700, color: textMain, margin: '0 0 0.5rem' }}>Featured Hackathons</h2>
              <p style={{ color: textSub, margin: 0, fontSize: '1.1rem' }}>Discover and join the latest events hosted on HackZone.</p>
            </div>
            <Link to="/hackathons" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'transparent', color: textMain, border: `1px solid ${statBorder}`,
                padding: '0.6rem 1.5rem', borderRadius: '999px', fontSize: '0.95rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', gap: '0.5rem', height: '40px'
              }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </Link>
          </div>

          {loadingHacks ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: textSub }}>Loading latest hackathons...</div>
          ) : hackathonsPreview.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: textSub, background: statBg, borderRadius: '24px', border: `1px dashed ${statBorder}` }}>No hackathons currently available.</div>
          ) : (
            <div>
              <div style={{ position: 'relative', height: '420px', display: 'flex', justifyContent: 'center', alignItems: 'center', perspective: '1000px', overflow: 'hidden' }}>
                {hackathonsPreview.map((h, i) => {
                  const sc = getStatusConfig(h.status);
                  const image = h.image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80';
                  
                  const total = hackathonsPreview.length;
                  let offset = i - activeIndex;
                  if (offset < -Math.floor(total/2)) offset += total;
                  if (offset > Math.floor(total/2)) offset -= total;
                  
                  const isActive = offset === 0;
                  const scale = isActive ? 1 : 0.85;
                  const translateX = offset * 65; // percentage displacement
                  const zIndex = 10 - Math.abs(offset);
                  const opacity = Math.abs(offset) > 1 ? 0 : (isActive ? 1 : 0.6);
                  
                  return (
                    <div 
                      key={h._id || h.id} 
                      onClick={() => {
                        if (isActive) {
                          navigate(`/hackathons/${h._id || h.id}`);
                        } else {
                          setActiveIndex(i);
                        }
                      }}
                      style={{
                        position: 'absolute',
                        width: '350px',
                        height: '380px',
                        background: statBg, borderRadius: '24px', border: `1px solid ${isActive ? statBorderHov : statBorder}`,
                        overflow: 'hidden', display: 'flex', flexDirection: 'column',
                        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: `translateX(${translateX}%) scale(${scale})`,
                        zIndex: zIndex,
                        opacity: opacity,
                        boxShadow: isActive ? (isDark ? '0 20px 40px -10px rgba(6,182,212,0.15)' : '0 20px 40px -10px rgba(0,0,0,0.1)') : 'none',
                        cursor: 'pointer',
                        pointerEvents: opacity === 0 ? 'none' : 'auto'
                      }}
                    >
                      {/* Image Area */}
                      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${image}")`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.5s' }} className="hz-hack-img" />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />
                        
                        <div style={{
                          position: 'absolute', top: '16px', right: '16px',
                          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
                          padding: '0.35rem 0.85rem', borderRadius: '999px',
                          fontSize: '0.75rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', gap: '0.4rem'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.bg, boxShadow: `0 0 8px ${sc.bg}` }}></span>
                          {sc.label}
                        </div>
                        
                        {/* Prize Overlay */}
                        <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                          {h.prizePool || '$10,000+ Prizes'}
                        </div>
                      </div>
                      
                      {/* Body */}
                      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.3rem', fontWeight: 800, color: textMain, lineHeight: 1.3 }}>{h.title}</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: textSub, fontSize: '0.9rem', fontWeight: 500 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            {h.dateRange || 'Dates TBA'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: textSub, fontSize: '0.9rem', fontWeight: 500 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            {h.location || 'Location TBA'}
                          </div>
                        </div>
                        
                        {isActive && (
                          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#06b6d4', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', animation: 'hz-fade-up 0.3s ease-out' }}>
                            Click to View Details
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Dots */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1rem' }}>
                {hackathonsPreview.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveIndex(i)}
                    style={{
                      width: activeIndex === i ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: activeIndex === i ? '#06b6d4' : statBorder,
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Interactive Features ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '8rem 0' }}>
        <FeatureSection dark={isDark} />
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '8rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          background: ctaBg,
          border: `1px solid ${statBorder}`,
          borderRadius: '24px',
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: isDark ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.05)'
        }}>
          {/* Subtle Corner Glows inside CTA */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(6,182,212,0.15)', filter: 'blur(50px)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(34,197,94,0.15)', filter: 'blur(50px)', borderRadius: '50%' }}></div>

          <h2 style={{ fontFamily: 'Chakra Petch', fontSize: '2.5rem', fontWeight: 700, color: textMain, marginBottom: '1rem', position: 'relative', zIndex: 1, transition: 'color 0.3s ease' }}>
            Ready to shape the future?
          </h2>
          <p style={{ color: textSub, fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem', position: 'relative', zIndex: 1, transition: 'color 0.3s ease' }}>
            Join the most vibrant community of builders, designers, and creators on the internet.
          </p>
          <Link to="/register/role-select" style={{ textDecoration: 'none', position: 'relative', zIndex: 1 }}>
            <button className="hz-btn-primary">Create Free Account</button>
          </Link>
        </div>
      </section>

    </div>
  );
}

