import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for open teams
const OPEN_TEAMS = [
  { id: 1, name: 'Neural Knights', desc: 'AI-driven logistics automation platform.', members: 3, max: 4 },
  { id: 2, name: 'Cyber Sentinels', desc: 'Zero-trust security protocol for IoT nodes.', members: 2, max: 4 },
  { id: 3, name: 'Web3 Wizards', desc: 'Decentralized governance for creator economies.', members: 1, max: 4 },
  { id: 4, name: 'Data Dynamos', desc: 'Real-time visualization of climate metrics.', members: 3, max: 5 },
];

export default function TeamJoin() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredTeams = OPEN_TEAMS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="hz-page">
      <div className="hz-container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="hz-heading-1" style={{ marginBottom: '0.5rem' }}>Join a Team</h1>
          <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-lg)' }}>
            Connect with fellow builders and start your hackathon journey.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column */}
          <div style={{ flex: '1 1 320px', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            

            {/* Graphic Card */}
            <div className="hz-card" style={{ 
              position: 'relative', 
              overflow: 'hidden', 
              height: '240px',
              backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '1.5rem'
            }}>
              <div style={{ 
                position: 'absolute', inset: 0, 
                background: 'linear-gradient(to top, rgba(30, 27, 75, 0.9) 0%, rgba(30, 27, 75, 0.4) 50%, rgba(30, 27, 75, 0.1) 100%)' 
              }}></div>
              
              <div style={{ position: 'relative', color: 'white' }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: '600' }}>
                  Build something legendary.
                </h4>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.5' }}>
                  Teams with 4 members are 60% more likely to ship.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="hz-card hz-card--padding" style={{ flex: '2 1 500px', minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-primary)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <h3 className="hz-heading-3" style={{ margin: 0, color: 'var(--hz-text)' }}>Browse open teams</h3>
              </div>
              
              <div style={{ position: 'relative', width: '100%', maxWidth: '240px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className="hz-input" 
                  placeholder="Search by name..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px', background: 'var(--hz-surface)', borderRadius: '999px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredTeams.map(team => (
                <div key={team.id} className="hz-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: 'var(--hz-text)' }}>{team.name}</h4>
                    <span className="hz-badge hz-badge--success" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                      RECRUITING
                    </span>
                  </div>
                  
                  <p style={{ margin: '0 0 1.5rem', fontSize: '0.875rem', color: 'var(--hz-text-secondary)', flex: 1, lineHeight: '1.5' }}>
                    {team.desc}
                  </p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--hz-text-secondary)', fontWeight: '500' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      {team.members}/{team.max} members
                    </div>
                    
                    <button className="hz-btn hz-btn-outline hz-btn--sm" style={{ padding: '0.5rem 1rem' }}>
                      Request to join
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTeams.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                No teams found matching "{search}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
