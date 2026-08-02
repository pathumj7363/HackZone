import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

export default function Footer() {
  const { isDark } = useContext(ThemeContext);
  const location = useLocation();

  const bg      = isDark ? '#04060f' : 'var(--hz-surface)';
  const border  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
  const descClr = isDark ? 'rgba(255,255,255,0.5)' : 'var(--hz-text-muted)';
  const headClr = isDark ? '#e2e8f0' : 'var(--hz-text)';
  const linkClr = isDark ? 'rgba(255,255,255,0.45)' : 'var(--hz-text-muted)';
  const linkHov = isDark ? '#c4b5fd' : 'var(--hz-primary)';
  const copyClr = isDark ? 'rgba(255,255,255,0.3)' : 'var(--hz-text-muted)';

  const FootLink = ({ to, href, children }) => {
    const base = {
      textDecoration: 'none',
      color: linkClr,
      fontSize: '0.95rem',
      fontWeight: 500,
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-block'
    };
    if (href) {
      return (
        <a href={href} style={base}
          onMouseEnter={e => {
            e.currentTarget.style.color = linkHov;
            e.currentTarget.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = linkClr;
            e.currentTarget.style.transform = 'none';
          }}
        >{children}</a>
      );
    }
    return (
      <Link to={to} style={base}
        onMouseEnter={e => {
          e.currentTarget.style.color = linkHov;
          e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = linkClr;
          e.currentTarget.style.transform = 'none';
        }}
      >{children}</Link>
    );
  };

  return (
    <footer style={{
      position: 'relative',
      background: bg,
      borderTop: `1px solid ${border}`,
      padding: '5rem 0 2rem',
      marginTop: 'auto',
      width: '100%',
      transition: 'background 0.3s',
      overflow: 'hidden'
    }}>
      {/* Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '-150px', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '-150px', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }}></div>

      <div className="hz-container" style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '4rem' }}>

        {/* Brand */}
        <div style={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <h2 style={{ 
            margin: '0 0 1rem', fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--hz-primary) 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            HackZone
          </h2>
          <p style={{ color: descClr, lineHeight: 1.7, fontSize: '1rem', marginBottom: '2rem' }}>
            The ultimate platform to host, participate, and evaluate hackathons globally. Built for developers, by developers.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: descClr, transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--hz-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = descClr; e.currentTarget.style.transform = 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: descClr, transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--hz-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = descClr; e.currentTarget.style.transform = 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: descClr, transition: 'all 0.2s', textDecoration: 'none' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--hz-primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = descClr; e.currentTarget.style.transform = 'none' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', flex: '1 1 auto', justifyContent: 'flex-start' }}>
          <div style={{ minWidth: '160px' }}>
            <h4 style={{ marginBottom: '1.5rem', color: headClr, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><FootLink to="/hackathons">Browse Hackathons</FootLink></li>
              <li><FootLink to="/register/role-select">Create an Account</FootLink></li>
              <li><FootLink to="/login">Sign In</FootLink></li>
              <li><FootLink href="#">Pricing (Coming Soon)</FootLink></li>
            </ul>
          </div>
          <div style={{ minWidth: '160px' }}>
            <h4 style={{ marginBottom: '1.5rem', color: headClr, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><FootLink href="#">Documentation</FootLink></li>
              <li><FootLink href="#">Help Center</FootLink></li>
              <li><FootLink href="#">Blog</FootLink></li>
              <li><FootLink href="#">Open Source</FootLink></li>
            </ul>
          </div>
          <div style={{ minWidth: '160px' }}>
            <h4 style={{ marginBottom: '1.5rem', color: headClr, fontWeight: 800, fontSize: '1rem', letterSpacing: '0.05em' }}>
              Legal
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><FootLink href="#">Privacy Policy</FootLink></li>
              <li><FootLink href="#">Terms of Service</FootLink></li>
              <li><FootLink href="#">Cookie Policy</FootLink></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="hz-container" style={{ position: 'relative', zIndex: 1, marginTop: '4rem', paddingTop: '2rem', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: copyClr, fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>
          © {new Date().getFullYear()} HackZone. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: copyClr, fontWeight: 500 }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }}></span>
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
