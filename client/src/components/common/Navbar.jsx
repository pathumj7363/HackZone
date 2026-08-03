import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import NotificationBell from './NotificationBell';
import Logo from './Logo';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const executeLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/');
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'participant') return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return `/${user.role}`;
  };

  /* ── colour tokens ── */
  const bg = isDark ? (scrolled ? 'rgba(2, 2, 2, 0.85)' : 'rgba(2, 2, 2, 0.5)') : (scrolled ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)');
  const border = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)';
  const linkClr = isDark ? '#94a3b8' : 'var(--hz-text-secondary)';
  const linkActive = isDark ? '#06b6d4' : 'var(--hz-primary)';
  const metaClr = isDark ? '#e2e8f0' : 'var(--hz-text)';
  const divClr = isDark ? 'rgba(255,255,255,0.08)' : 'var(--hz-border)';

  /* ── inline NavLink ── */
  const NavLink = ({ to, children }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          color: active ? linkActive : linkClr,
          padding: '0.4rem 0.8rem',
          borderRadius: '12px',
          background: active ? (isDark ? 'rgba(6,182,212,0.1)' : 'rgba(99,102,241,0.08)') : 'transparent',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={e => {
          if (!active) {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
            e.currentTarget.style.color = linkActive;
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = linkClr;
          }
        }}
      >
        {children}
      </Link>
    );
  };

  const renderCenterLinks = () => {
    if (!user || user.role === 'admin') return null;

    let links = [];
    switch (user.role) {
      case 'participant':
        links = [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/hackathons', label: 'Hackathons' },
          { to: '/teams', label: 'Team Hub' },
          { to: '/submissions', label: 'Submissions' },
          { to: '/participant/scoreboard', label: 'Scoreboard' },
        ];
        break;
      case 'organizer':
        links = [
          { to: '/organizer', label: 'Dashboard' },
          { to: '/organizer/hackathon', label: 'Hackathons' },
          { to: '/organizer/submissions', label: 'Submissions' },
          { to: '/organizer/judges', label: 'Judges' },
          { to: '/organizer/announce', label: 'Announcements' },
          { to: '/organizer/scoreboard', label: 'Scoreboard' },
        ];
        break;
      case 'judge':
        links = [
          { to: '/judge', label: 'Dashboard' },
          { to: '/judge/projects', label: 'Assigned Projects' },
        ];
        break;
      default: break;
    }

    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)}
      </div>
    );
  };

  /* ── right-side content ── */
  const renderRight = () => {
    if (!user) {
      return (
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <button 
            onClick={toggleTheme}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: metaClr, padding: '0.5rem', borderRadius: '12px',
              transition: 'all 0.2s',
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>
          <Link
            to="/login"
            style={{ textDecoration: 'none', color: linkClr, fontWeight: 600, fontSize: '0.95rem', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = linkActive)}
            onMouseLeave={e => (e.currentTarget.style.color = linkClr)}
          >
            Sign In
          </Link>
          <Link to="/register/role-select" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
                color: '#000',
                border: 'none',
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(6,182,212,0.2)',
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.transform = 'translateY(-2px)'; 
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(34,197,94,0.3)';
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.transform = 'none'; 
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(6,182,212,0.2)';
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      );
    }

    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const avatarUrl = user.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${backendUrl}${user.profilePicture}`) : null;

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        <NotificationBell />
        <button 
          onClick={toggleTheme}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: metaClr, padding: '0.5rem', borderRadius: '12px',
            transition: 'all 0.2s',
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)'}
        >
          {isDark ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
          )}
        </button>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
              padding: '0.35rem 0.5rem 0.35rem 0.35rem', borderRadius: '24px',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}
          >
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#000', fontWeight: 'bold', fontSize: '0.9rem',
              boxShadow: '0 2px 8px rgba(34,197,94,0.3)'
            }}>
              {!avatarUrl && (user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={metaClr} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          {dropdownOpen && (
            <div style={{ 
              position: 'absolute', top: 'calc(100% + 10px)', right: 0, 
              background: isDark ? 'rgba(15, 15, 15, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${border}`,
              borderRadius: '16px',
              padding: '0.5rem',
              minWidth: '180px',
              boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.5)' : '0 10px 40px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', gap: '0.25rem',
              zIndex: 100,
              animation: 'slideDown 0.2s ease-out forwards',
              transformOrigin: 'top right'
            }}>
              <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: metaClr, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name || 'User'}</div>
                <div style={{ fontSize: '0.75rem', color: linkClr, textTransform: 'capitalize' }}>{user.role}</div>
              </div>
              <div style={{ height: '1px', background: border, margin: '0 0 0.25rem 0' }} />
              
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', textDecoration: 'none', color: metaClr, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Profile
              </Link>
              <Link to="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', textDecoration: 'none', color: metaClr, borderRadius: '10px', fontSize: '0.9rem', fontWeight: 500, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setDropdownOpen(false)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Settings
              </Link>
              
              <div style={{ height: '1px', background: border, margin: '0.25rem 0' }} />
              <button onClick={() => { setDropdownOpen(false); setShowLogoutConfirm(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.75rem', background: 'none', border: 'none', color: '#ef4444', textAlign: 'left', cursor: 'pointer', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 600, width: '100%', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .hz-desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .hz-mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0.5rem;
        }
        @media (max-width: 768px) {
          .hz-desktop-nav {
            display: none !important;
          }
          .hz-mobile-menu-toggle {
            display: flex !important;
          }
        }
      `}</style>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          height: 'var(--hz-navbar-height, 72px)',
          background: bg,
          borderBottom: `1px solid ${scrolled ? border : 'transparent'}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: scrolled ? (isDark ? '0 4px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.05)') : 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Logo */}
        <Link
          to={getHomeLink()}
          style={{ textDecoration: 'none', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Logo width={160} />
        </Link>

        {/* Desktop Nav */}
        <div className="hz-desktop-nav">
          {renderCenterLinks()}
          <div style={{ width: '1px', height: '24px', background: divClr }} />
          {renderRight()}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="hz-mobile-menu-toggle" 
          style={{ color: metaClr }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 'var(--hz-navbar-height, 60px)', left: 0, right: 0, bottom: 0,
          background: bg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          zIndex: 40, display: 'flex', flexDirection: 'column', padding: '2rem',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }} onClick={() => setMobileMenuOpen(false)}>
            {renderCenterLinks()}
            <div style={{ height: '1px', width: '100%', background: divClr, margin: '1rem 0' }} />
            {renderRight()}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
          padding: '1rem'
        }}>
          <div style={{
            background: isDark ? 'rgba(15, 15, 15, 0.95)' : 'var(--hz-surface)', border: `1px solid ${border}`,
            borderRadius: '24px', padding: '2.5rem 2rem', width: '100%', maxWidth: '420px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)',
              color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.75rem', color: metaClr }}>Sign Out</h3>
            <p style={{ color: linkClr, fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: '1.5' }}>
              Are you sure you want to sign out of your account?
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowLogoutConfirm(false)} 
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: `1px solid ${border}`, color: metaClr, borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Cancel
              </button>
              <button 
                onClick={executeLogout} 
                style={{ flex: 1, padding: '0.75rem', background: '#ef4444', border: 'none', color: 'white', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(239,68,68,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
