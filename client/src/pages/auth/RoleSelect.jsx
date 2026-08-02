import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';

const roles = [
  {
    id: 'participant',
    label: 'Participant',
    description: 'Join hackathons, form teams, build projects and compete for prizes.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: '#06b6d4',
  },
  {
    id: 'organizer',
    label: 'Organizer',
    description: 'Host hackathons, manage teams, assign judges and track submissions.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    color: '#22c55e',
  },
  {
    id: 'judge',
    label: 'Judge',
    description: 'Evaluate submissions, provide feedback and score projects fairly.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: '#8b5cf6',
  },
];

export default function RoleSelect() {
  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (roleId) => {
    setSelectedRole(roleId);
    setTimeout(() => {
      navigate(`/register?role=${roleId}`);
    }, 400);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#020202',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap');
        
        .hz-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
          z-index: 0;
          pointer-events: none;
        }
        
        .hz-bg-glow {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(34,197,94,0.05) 50%, transparent 70%);
          filter: blur(50px);
          z-index: 0;
          pointer-events: none;
        }

        .role-card {
          all: unset;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          padding: 2.5rem 1.5rem;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          width: 100%;
        }

        .role-card:hover {
          background: rgba(255, 255, 255, 0.04);
          transform: translateY(-4px);
        }

        .role-icon-box {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }

        @keyframes selectPulse {
          0% { box-shadow: 0 0 0 0 var(--pulse-color); transform: scale(0.98); }
          50% { box-shadow: 0 0 0 15px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; transform: scale(1); }
        }
      `}</style>

      {/* ── Background Elements ── */}
      <div className="hz-bg-grid"></div>
      <div className="hz-bg-glow"></div>

      {/* ── Header Area ── */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '880px', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            position: 'absolute', left: 0, 
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
            color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', 
            padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }} 
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo width={200} />
        </Link>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1, maxWidth: '500px' }}>
        <h2 style={{ fontFamily: 'Chakra Petch', fontSize: '2.5rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
          Select Your Path
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#94a3b8', lineHeight: '1.6' }}>
          Choose how you want to experience HackZone. Your journey begins here.
        </p>
      </div>

      {/* ── Role Cards Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '920px',
        marginBottom: '3rem',
        position: 'relative',
        zIndex: 1
      }}>
        {roles.map((role) => {
          const isHovered = hoveredRole === role.id;
          const isSelected = selectedRole === role.id;
          
          return (
            <button
              key={role.id}
              className="role-card"
              onClick={() => handleSelect(role.id)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{
                borderColor: isSelected ? role.color : isHovered ? `rgba(${parseInt(role.color.slice(1,3),16)},${parseInt(role.color.slice(3,5),16)},${parseInt(role.color.slice(5,7),16)}, 0.4)` : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isSelected ? `0 0 20px rgba(${parseInt(role.color.slice(1,3),16)},${parseInt(role.color.slice(3,5),16)},${parseInt(role.color.slice(5,7),16)}, 0.3)` : 'none',
                '--pulse-color': `rgba(${parseInt(role.color.slice(1,3),16)},${parseInt(role.color.slice(3,5),16)},${parseInt(role.color.slice(5,7),16)}, 0.6)`,
                animation: isSelected ? 'selectPulse 0.4s ease-out' : 'none'
              }}
            >
              {/* Highlight bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%', width: '4px',
                background: role.color,
                opacity: isHovered || isSelected ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }} />

              <div className="role-icon-box" style={{
                background: `rgba(${parseInt(role.color.slice(1,3),16)},${parseInt(role.color.slice(3,5),16)},${parseInt(role.color.slice(5,7),16)}, 0.1)`,
                color: role.color,
                boxShadow: isHovered ? `0 0 15px rgba(${parseInt(role.color.slice(1,3),16)},${parseInt(role.color.slice(3,5),16)},${parseInt(role.color.slice(5,7),16)}, 0.3)` : 'none'
              }}>
                {role.icon}
              </div>

              <h3 style={{
                margin: '0 0 0.75rem',
                fontFamily: 'Chakra Petch',
                fontSize: '1.4rem',
                fontWeight: 700,
                color: '#fff',
                transition: 'color 0.3s ease'
              }}>
                {role.label}
              </h3>

              <p style={{
                margin: 0,
                fontSize: '0.95rem',
                color: '#94a3b8',
                lineHeight: '1.6',
              }}>
                {role.description}
              </p>

              {/* Checkmark when selected */}
              {isSelected && (
                <div style={{
                  position: 'absolute', top: '1.5rem', right: '1.5rem',
                  color: role.color,
                  animation: 'hz-fade-up 0.2s ease-out'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: '1rem', color: '#94a3b8', position: 'relative', zIndex: 1 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>

    </div>
  );
}
