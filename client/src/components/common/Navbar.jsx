import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = true;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'participant') return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return `/${user.role}`;
  };

  /* ── colour tokens ── */
  const bg = isDark ? 'rgba(7,9,26,0.82)' : 'var(--hz-surface-raised)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'var(--hz-border)';
  const logoClr = isDark ? '#a5b4fc' : 'var(--hz-primary)';
  const linkClr = isDark ? 'rgba(255,255,255,0.6)' : 'var(--hz-text-secondary)';
  const linkActive = isDark ? '#c4b5fd' : 'var(--hz-primary)';
  const metaClr = isDark ? '#e2e8f0' : 'var(--hz-text)';
  const roleClr = isDark ? 'rgba(255,255,255,0.45)' : 'var(--hz-text-muted)';
  const divClr = isDark ? 'rgba(255,255,255,0.12)' : 'var(--hz-border)';

  /* ── inline NavLink ── */
  const NavLink = ({ to, children }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: 'var(--hz-font-size-sm)',
          color: active ? linkActive : linkClr,
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = linkActive)}
        onMouseLeave={e => (e.currentTarget.style.color = active ? linkActive : linkClr)}
      >
        {children}
      </Link>
    );
  };

  /* ── right-side content ── */
  const renderRight = () => {
    if (!user) {
      return (
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link
            to="/login"
            style={{ textDecoration: 'none', color: linkClr, fontWeight: 500, fontSize: 'var(--hz-font-size-sm)', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = linkActive)}
            onMouseLeave={e => (e.currentTarget.style.color = linkClr)}
          >
            Sign In
          </Link>
          <Link to="/register/role-select" style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: isDark ? 'linear-gradient(135deg,#6c63ff,#8b5cf6)' : 'var(--hz-primary)',
                color: '#fff',
                border: 'none',
                padding: '0.48rem 1.1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: isDark ? '0 2px 12px rgba(108,99,255,0.4)' : undefined,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              Get Started
            </button>
          </Link>
        </div>
      );
    }

    let links = [];
    switch (user.role) {
      case 'participant':
        links = [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/hackathons', label: 'Hackathons' },
          { to: '/teams/dashboard', label: 'My Team' },
          { to: '/submissions', label: 'Submissions' },
        ];
        break;
      case 'organizer':
        links = [
          { to: '/organizer', label: 'Dashboard' },
          { to: '/organizer/hackathon', label: 'Hackathons' },
          { to: '/organizer/teams', label: 'Teams' },
          { to: '/organizer/judges', label: 'Judges' },
          { to: '/organizer/announce', label: 'Announcements' },
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
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user.role === 'admin'
            ? <span style={{ color: roleClr, fontWeight: 500, fontSize: 'var(--hz-font-size-sm)' }}>Admin Panel</span>
            : links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)
          }
        </div>

        <div style={{ width: '1px', height: '22px', background: divClr }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <div 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={metaClr} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          {dropdownOpen && (
            <div style={{ 
              position: 'absolute', top: '120%', right: 0, 
              background: isDark ? '#1e293b' : '#fff',
              border: `1px solid ${border}`,
              borderRadius: '8px',
              padding: '0.5rem',
              minWidth: '150px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              display: 'flex', flexDirection: 'column', gap: '0.25rem',
              zIndex: 100
            }}>
              <Link to="/profile" style={{ padding: '0.5rem', textDecoration: 'none', color: metaClr, borderRadius: '4px', fontSize: '0.875rem' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setDropdownOpen(false)}>
                Profile
              </Link>
              <Link to="/settings" style={{ padding: '0.5rem', textDecoration: 'none', color: metaClr, borderRadius: '4px', fontSize: '0.875rem' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setDropdownOpen(false)}>
                Settings
              </Link>
              <div style={{ height: '1px', background: border, margin: '0.25rem 0' }} />
              <button onClick={() => { setDropdownOpen(false); handleLogout(); }} style={{ padding: '0.5rem', background: 'none', border: 'none', color: '#ef4444', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontSize: '0.875rem', width: '100%' }} onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        height: 'var(--hz-navbar-height, 64px)',
        background: bg,
        borderBottom: `1px solid ${border}`,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: isDark ? 'blur(20px)' : undefined,
        WebkitBackdropFilter: isDark ? 'blur(20px)' : undefined,
        boxShadow: isDark ? '0 1px 30px rgba(0,0,0,0.3)' : 'var(--hz-shadow-sm)',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      {/* Logo */}
      <Link
        to={getHomeLink()}
        style={{
          textDecoration: 'none',
          fontWeight: 800,
          fontSize: '1.3rem',
          color: logoClr,
          letterSpacing: '-0.02em',
          transition: 'color 0.2s',
        }}
      >
        HackZone
      </Link>

      {/* Right side */}
      {renderRight()}
    </nav>
  );
}
