import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();
  const isDark   = location.pathname === '/';

  const bg      = isDark ? '#04060f'                  : 'var(--hz-surface)';
  const border  = isDark ? 'rgba(255,255,255,0.07)'   : 'var(--hz-border)';
  const logoClr = isDark ? '#a5b4fc'                  : 'var(--hz-primary)';
  const descClr = isDark ? 'rgba(255,255,255,0.45)'   : 'var(--hz-text-muted)';
  const headClr = isDark ? '#e2e8f0'                  : 'var(--hz-text)';
  const linkClr = isDark ? 'rgba(255,255,255,0.45)'   : 'var(--hz-text-muted)';
  const linkHov = isDark ? '#c4b5fd'                  : 'var(--hz-primary)';
  const copyClr = isDark ? 'rgba(255,255,255,0.3)'    : 'var(--hz-text-muted)';

  const FootLink = ({ to, href, children }) => {
    const base = {
      textDecoration: 'none',
      color: linkClr,
      fontSize: '0.9rem',
      transition: 'color 0.2s',
    };
    if (href) {
      return (
        <a href={href} style={base}
          onMouseEnter={e => (e.currentTarget.style.color = linkHov)}
          onMouseLeave={e => (e.currentTarget.style.color = linkClr)}
        >{children}</a>
      );
    }
    return (
      <Link to={to} style={base}
        onMouseEnter={e => (e.currentTarget.style.color = linkHov)}
        onMouseLeave={e => (e.currentTarget.style.color = linkClr)}
      >{children}</Link>
    );
  };

  return (
    <footer style={{
      background: bg,
      borderTop: `1px solid ${border}`,
      padding: '4rem 0 2rem',
      marginTop: 'auto',
      width: '100%',
      transition: 'background 0.3s',
    }}>
      <div className="hz-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem' }}>

        {/* Brand */}
        <div style={{ flex: '1 1 280px', maxWidth: '360px' }}>
          <h2 style={{ color: logoClr, margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            HackZone
          </h2>
          <p style={{ color: descClr, lineHeight: 1.65, fontSize: '0.9rem', maxWidth: '320px' }}>
            The ultimate platform to host, participate, and evaluate hackathons globally. Built for developers, by developers.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ marginBottom: '1.1rem', color: headClr, fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li><FootLink to="/hackathons">Browse Hackathons</FootLink></li>
              <li><FootLink to="/register/role-select">Create an Account</FootLink></li>
              <li><FootLink to="/login">Sign In</FootLink></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1.1rem', color: headClr, fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li><FootLink href="#">Documentation</FootLink></li>
              <li><FootLink href="#">Help Center</FootLink></li>
              <li><FootLink href="#">Blog</FootLink></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hz-container" style={{ marginTop: '3rem', paddingTop: '1.75rem', borderTop: `1px solid ${border}`, textAlign: 'center' }}>
        <p style={{ color: copyClr, fontSize: '0.82rem', margin: 0 }}>
          © {new Date().getFullYear()} HackZone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
