import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinTeamApi, getAllTeamsApi } from '../../api/team.api';
import { toast } from 'react-toastify';

export default function TeamJoin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState(null);
  const [search, setSearch] = useState('');
  const [teams, setTeams] = useState([]);
  const [fetchingTeams, setFetchingTeams] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { 
    window.scrollTo(0, 0); 
    loadOpenTeams();
  }, []);

  const loadOpenTeams = async () => {
    setFetchingTeams(true);
    try {
      const data = await getAllTeamsApi();
      setTeams(Array.isArray(data) ? data : (data?.data || []));
    } catch (err) {
      console.error("Error loading open teams:", err);
      setTeams([]);
    } finally {
      setFetchingTeams(false);
    }
  };

  const handleJoinByCode = async (inviteCodeToUse) => {
    const codeToJoin = inviteCodeToUse || code;
    if (!codeToJoin.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinTeamApi(codeToJoin.trim());
      toast.success('Successfully joined the team!');
      navigate('/teams/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Invalid team code';
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  };

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    handleJoinByCode();
  };

  const handleJoinCardClick = async (team) => {
    setJoiningId(team.id);
    try {
      await joinTeamApi(team.inviteCode || team.id);
      toast.success(`Successfully joined ${team.name}!`);
      navigate('/teams/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || 'Failed to join team');
    } finally {
      setJoiningId(null);
    }
  };

  const query = search.trim().toLowerCase();
  const filteredTeams = teams.filter(t => {
    const isPub = t.isPublic === undefined || t.isPublic === null || t.isPublic === 1 || t.isPublic === true;
    if (!isPub) return false;
    if (!query) return true;
    const nameMatch = t.name && t.name.toLowerCase().includes(query);
    const codeMatch = t.inviteCode && t.inviteCode.toLowerCase().includes(query);
    return nameMatch || codeMatch;
  });

  return (
    <div className="hz-page">
      <div className="hz-container">
        
        {/* Page Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="hz-heading-1" style={{ marginBottom: '0.5rem' }}>Join a Team</h1>
          <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-lg)' }}>
            Connect with fellow builders, browse public teams, or join using an invite code.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          
          {/* Left Column */}
          <div style={{ flex: '1 1 320px', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Invite Code Card */}
            <div className="hz-card hz-card--padding">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--hz-primary)', display: 'flex', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"></path>
                  </svg>
                </div>
                <h3 className="hz-heading-3" style={{ margin: 0 }}>Have an invite code?</h3>
              </div>
              
              <form onSubmit={handleJoinSubmit}>
                <input
                  type="text"
                  className="hz-input"
                  placeholder="EX: HZ-A3B9X7"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  style={{ marginBottom: '1rem', background: 'var(--hz-surface)', padding: '0.875rem 1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                {error && <div className="hz-field-error" style={{ marginBottom: '1rem' }}>{error}</div>}
                
                <button 
                  type="submit" 
                  className="hz-btn hz-btn-primary" 
                  style={{ width: '100%', marginBottom: '1rem', padding: '0.875rem' }}
                  disabled={loading || !code.trim()}
                >
                  {loading ? 'Joining...' : 'Join Team'}
                </button>
              </form>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-muted)', fontSize: '0.75rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Unique code shared by team captains.
              </div>
            </div>

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
              
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  className="hz-input" 
                  placeholder="Search by name or invite code..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px', background: 'var(--hz-surface)', borderRadius: '999px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {fetchingTeams ? (
              <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div className="hz-spinner hz-spinner--md" style={{ margin: '0 auto 1rem' }}></div>
                <p className="hz-text-muted">Loading open public teams...</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {filteredTeams.map(team => {
                  const memberCount = team.membersCount || (Array.isArray(team.members) ? team.members.length : 1);
                  const maxCapacity = team.maxCapacity || team.max || 4;

                  return (
                    <div key={team.id} className="hz-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--hz-text)' }}>{team.name}</h4>
                        <span className="hz-badge hz-badge--success" style={{ fontSize: '0.65rem', letterSpacing: '0.05em' }}>
                          RECRUITING
                        </span>
                      </div>
                      
                      {team.inviteCode && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--hz-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600', fontFamily: 'monospace' }}>
                            Code: {team.inviteCode}
                          </span>
                        </div>
                      )}

                      <p style={{ margin: '0 0 1.25rem', fontSize: '0.875rem', color: 'var(--hz-text-secondary)', flex: 1, lineHeight: '1.5' }}>
                        {team.description || team.desc || 'No description provided.'}
                      </p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--hz-text-secondary)', fontWeight: '500' }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          {memberCount}/{maxCapacity} members
                        </div>
                        
                        <button 
                          className="hz-btn hz-btn-primary hz-btn--sm" 
                          style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', borderRadius: '6px' }}
                          onClick={() => handleJoinCardClick(team)}
                          disabled={joiningId === team.id || memberCount >= maxCapacity}
                        >
                          {joiningId === team.id ? 'Joining...' : (memberCount >= maxCapacity ? 'Full' : 'Join Team')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!fetchingTeams && filteredTeams.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                {search ? `No open teams found matching "${search}"` : 'No public open teams available yet. Create one!'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

