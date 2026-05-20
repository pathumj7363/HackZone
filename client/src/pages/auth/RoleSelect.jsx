import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const roles = [
  {
    id: 'participant',
    label: 'Participant',
    description: 'Join hackathons, form teams, build projects and compete for prizes.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: '#3b82f6',
    bgLight: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  {
    id: 'organizer',
    label: 'Organizer',
    description: 'Host hackathons, manage teams, assign judges and track submissions.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    color: '#10b981',
    bgLight: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  {
    id: 'judge',
    label: 'Judge',
    description: 'Evaluate submissions, provide feedback and score projects fairly.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    color: '#f59e0b',
    bgLight: '#fffbeb',
    borderColor: '#fde68a',
  },
];

export default function RoleSelect() {
  const [hoveredRole, setHoveredRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  // Reset scroll to top upon page navigation
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (roleId) => {
    setSelectedRole(roleId);
    setTimeout(() => {
      navigate(`/register?role=${roleId}`);
    }, 350);
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--hz-surface) 0%, var(--hz-primary-light) 100%)',
      }}
      className="px-3 py-5"
    >
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '2rem', color: 'var(--hz-primary)', display: 'inline-block' }}>
          HackZone
        </Link>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '500px' }} className="px-2">
        <h2 className="hz-heading-2" style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          Who are you?
        </h2>
        <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.6' }}>
          Select your role to get started. This helps us personalize your experience on HackZone.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '820px',
        marginBottom: '2.5rem',
      }}>
        {roles.map((role) => {
          const isHovered = hoveredRole === role.id;
          const isSelected = selectedRole === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => handleSelect(role.id)}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '2rem 1.25rem 1.75rem',
                borderRadius: '16px',
                background: isSelected ? role.bgLight : '#ffffff',
                border: `2px solid ${isSelected ? role.color : isHovered ? role.borderColor : 'var(--hz-border)'}`,
                boxShadow: isHovered || isSelected
                  ? `0 12px 40px rgba(0,0,0,0.1), 0 0 0 3px ${role.bgLight}`
                  : 'var(--hz-shadow-sm)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-6px)' : isSelected ? 'scale(0.97)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: isHovered || isSelected ? role.color : 'transparent',
                transition: 'background 0.3s ease',
                borderRadius: '16px 16px 0 0',
              }} />

              {/* Icon */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: role.bgLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: role.color,
                marginBottom: '1.25rem',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isHovered ? `0 4px 16px ${role.borderColor}` : 'none',
              }}>
                {role.icon}
              </div>

              {/* Title */}
              <h3 style={{
                margin: '0 0 0.5rem',
                fontSize: '1.2rem',
                fontWeight: '700',
                color: isHovered || isSelected ? role.color : 'var(--hz-text)',
                transition: 'color 0.3s ease',
              }}>
                {role.label}
              </h3>

              {/* Description */}
              <p style={{
                margin: 0,
                fontSize: 'var(--hz-font-size-sm)',
                color: 'var(--hz-text-muted)',
                lineHeight: '1.55',
              }}>
                {role.description}
              </p>

              {/* Selected indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: role.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'roleSelectPop 0.3s ease',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer link */}
      <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', textAlign: 'center' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--hz-primary)', fontWeight: '600', textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>

      {/* Keyframe animation injected inline */}
      <style>{`
        @keyframes roleSelectPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
