import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FeatureSection from '../components/home/InteractiveFeatures';

export default function Home() {
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

  return (
    <div style={{ background: '#020202', color: '#f8fafc', position: 'relative', overflow: 'hidden', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── Global Styles & Animations ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap');
        
        .hz-home-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at center, black, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black, transparent 80%);
          z-index: 0;
          pointer-events: none;
        }
        
        .hz-home-glow {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(34,197,94,0.05) 40%, transparent 70%);
          filter: blur(60px);
          z-index: 0;
          pointer-events: none;
          animation: pulseGlow 8s ease-in-out infinite alternate;
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
          color: #ffffff;
        }

        .hz-hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #94a3b8;
          max-width: 650px;
          margin: 0 auto 3rem;
          line-height: 1.6;
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
          background: rgba(255,255,255,0.03);
          color: #f8fafc;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.875rem 2.5rem;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .hz-btn-secondary:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .hz-stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 1.5rem 2rem;
          min-width: 180px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .hz-stat-card:hover {
          border-color: rgba(6,182,212,0.3);
          background: rgba(255,255,255,0.04);
          transform: translateY(-4px);
        }
      `}</style>

      {/* ── Background Elements ── */}
      <div className="hz-home-grid"></div>
      <div className="hz-home-glow"></div>

      {/* ── Hero Section ── */}
      <section style={{ position: 'relative', zIndex: 10, minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', textAlign: 'center' }}>
        
        {/* Launch Badge */}
        <div style={{ animation: 'hz-fade-up 0.8s ease-out both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.3)',
            color: '#22d3ee',
            padding: '0.4rem 1.25rem',
            borderRadius: '9999px',
            fontSize: '0.85rem', fontWeight: 600,
            marginBottom: '2rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
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
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{devs.toLocaleString()}+</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Hackers</div>
          </div>
          <div className="hz-stat-card">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>${prizes.toLocaleString()}+</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Prizes Won</div>
          </div>
          <div className="hz-stat-card">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>{hacks}+</div>
            <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Events</div>
          </div>
        </div>
      </section>

      {/* ── Interactive Features ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '4rem 0' }}>
        <FeatureSection dark />
      </section>

      {/* ── Bottom CTA ── */}
      <section style={{ position: 'relative', zIndex: 10, padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Corner Glows inside CTA */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(6,182,212,0.15)', filter: 'blur(50px)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(34,197,94,0.15)', filter: 'blur(50px)', borderRadius: '50%' }}></div>
          
          <h2 style={{ fontFamily: 'Chakra Petch', fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            Ready to shape the future?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem', position: 'relative', zIndex: 1 }}>
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
