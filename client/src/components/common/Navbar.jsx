import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (user.role === 'participant') return '/dashboard';
    if (user.role === 'admin') return '/admin';
    return `/${user.role}`;
  };

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        style={{
          textDecoration: 'none',
          fontWeight: '500',
          fontSize: 'var(--hz-font-size-sm)',
          color: isActive ? 'var(--hz-primary)' : 'var(--hz-text-secondary)',
          transition: 'color var(--hz-transition)'
        }}
        onMouseEnter={(e) => e.target.style.color = 'var(--hz-primary)'}
        onMouseLeave={(e) => e.target.style.color = isActive ? 'var(--hz-primary)' : 'var(--hz-text-secondary)'}
      >
        {children}
      </Link>
    );
  };

  const renderLinks = () => {
    if (!user) {
      return (
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link to="/login" style={{ textDecoration: 'none', color: 'var(--hz-text-secondary)', fontWeight: '500', fontSize: 'var(--hz-font-size-sm)', transition: 'color var(--hz-transition)' }} onMouseEnter={(e) => e.target.style.color = 'var(--hz-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--hz-text-secondary)'}>
            Sign In
          </Link>
          <Link to="/register/role-select">
            <Button variant="primary" size="sm">Get Started</Button>
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
          { to: '/submissions', label: 'Submissions' }
        ];
        break;
      case 'organizer':
        links = [
          { to: '/organizer', label: 'Dashboard' },
          { to: '/organizer/hackathon', label: 'Hackathons' },
          { to: '/organizer/teams', label: 'Teams' },
          { to: '/organizer/judges', label: 'Judges' },
          { to: '/organizer/announce', label: 'Announcements' }
        ];
        break;
      case 'judge':
        links = [
          { to: '/judge', label: 'Dashboard' },
          { to: '/judge/projects', label: 'Assigned Projects' }
        ];
        break;
      case 'admin':
        links = [];
        break;
      default:
        break;
    }

    return (
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {user.role === 'admin' ? (
            <span style={{ color: 'var(--hz-text-muted)', fontWeight: '500', fontSize: 'var(--hz-font-size-sm)' }}>Admin Panel</span>
          ) : (
            links.map(l => <NavLink key={l.to} to={l.to}>{l.label}</NavLink>)
          )}
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--hz-border)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 'var(--hz-font-size-sm)', fontWeight: '500', color: 'var(--hz-text)', lineHeight: '1.2' }}>
              {user.name || user.email}
            </span>
            <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', textTransform: 'capitalize' }}>
              {user.role}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    );
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      height: 'var(--hz-navbar-height, 64px)',
      background: 'var(--hz-surface-raised)',
      borderBottom: '1px solid var(--hz-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--hz-shadow-sm)'
    }}>
      <div className="navbar-brand">
        <Link to={getHomeLink()} style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--hz-primary)' }}>
          HackZone
        </Link>
      </div>
      <div className="navbar-links">
        {renderLinks()}
      </div>
    </nav>
  );
}
