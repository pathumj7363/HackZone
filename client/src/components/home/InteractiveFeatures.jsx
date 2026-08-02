import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Tilt Card (Frosted Glass Bento Box)
───────────────────────────────────────────── */
const TiltCard = ({ children, borderColor, dark }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: '100%',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        boxShadow: isHovered ? `0 30px 60px -12px rgba(0,0,0,0.8), 0 0 40px ${borderColor}40` : 'none',
        borderRadius: '24px',
        position: 'relative',
        zIndex: isHovered ? 10 : 1,
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderTop: `2px solid ${borderColor}`,
          borderRadius: '24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2.5rem',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle internal gradient glow based on borderColor */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle at center, ${borderColor}15 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0.5,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Feature Section
───────────────────────────────────────────── */
export default function FeatureSection({ dark = true }) {

  const features = [
    {
      id: 'participant', role: 'Participants',
      badgeStyle: { background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)' },
      color: '#06b6d4',
      title: 'Join & Build',
      desc: 'Discover exciting hackathons, form dynamic teams with other developers, and seamlessly submit your projects to win prizes.',
      link: '/register/role-select', btnText: 'Start Building',
    },
    {
      id: 'organizer', role: 'Organizers',
      badgeStyle: { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' },
      color: '#22c55e',
      title: 'Host & Manage',
      desc: 'Create hackathons, track registrations, manage teams, and assign judges with a powerful, zero-friction dashboard.',
      link: '/register/role-select', btnText: 'Host an Event',
    },
    {
      id: 'judge', role: 'Judges',
      badgeStyle: { background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)' },
      color: '#a855f7',
      title: 'Evaluate & Score',
      desc: 'Review assigned submissions efficiently with our integrated grading portal and provide detailed feedback to participants.',
      link: '/register/role-select', btnText: 'Begin Judging',
    },
  ];

  return (
    <section className="hz-container" style={{ padding: '8rem 1.5rem', position: 'relative' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.03) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }}></div>

      {/* Section heading */}
      <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem', textTransform: 'uppercase' }}>
          Everything You Need
        </h2>
        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore the features of our platform perfectly tailored to your role. Built for speed, designed for impact.
        </p>
      </div>

      {/* Role cards */}
      <div className="row g-5 justify-content-center" style={{ position: 'relative', zIndex: 1 }}>
        {features.map(f => (
          <div className="col-12 col-md-6 col-lg-4" key={f.id}>
            <TiltCard
              borderColor={f.color}
              dark={true}
            >
              {/* Inner content */}
              <div>
                <span style={{
                  ...f.badgeStyle,
                  display: 'inline-block',
                  padding: '0.3rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {f.role}
                </span>
                <h3 style={{ fontFamily: 'Chakra Petch, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2.5rem' }}>{f.desc}</p>
              </div>
              <div>
                <Link to={f.link} style={{ textDecoration: 'none' }}>
                  <button style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#fff',
                    border: `1px solid rgba(255,255,255,0.1)`,
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = f.color; e.currentTarget.style.color = '#000'; e.currentTarget.style.borderColor = f.color; e.currentTarget.style.boxShadow = `0 10px 25px ${f.color}60`; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {f.btnText}
                  </button>
                </Link>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>

    </section>
  );
}
