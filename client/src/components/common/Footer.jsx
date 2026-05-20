import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--hz-surface)', borderTop: '1px solid var(--hz-border)', padding: '4rem 0 2rem', marginTop: 'auto', width: '100%' }}>
      <div className="hz-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h2 style={{ color: 'var(--hz-primary)', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>HackZone</h2>
          <p className="hz-text-muted" style={{ lineHeight: '1.6', maxWidth: '400px' }}>
            The ultimate platform to host, participate, and evaluate hackathons globally. Built for developers, by developers.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--hz-text)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/hackathons" className="hz-text-muted" style={{ textDecoration: 'none' }}>Browse Hackathons</Link></li>
              <li><Link to="/register/role-select" className="hz-text-muted" style={{ textDecoration: 'none' }}>Create an Account</Link></li>
              <li><Link to="/login" className="hz-text-muted" style={{ textDecoration: 'none' }}>Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ marginBottom: '1rem', color: 'var(--hz-text)' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="#" className="hz-text-muted" style={{ textDecoration: 'none' }}>Documentation</a></li>
              <li><a href="#" className="hz-text-muted" style={{ textDecoration: 'none' }}>Help Center</a></li>
              <li><a href="#" className="hz-text-muted" style={{ textDecoration: 'none' }}>Blog</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="hz-container" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--hz-border)', textAlign: 'center' }}>
        <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)' }}>
          © {new Date().getFullYear()} HackZone. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
