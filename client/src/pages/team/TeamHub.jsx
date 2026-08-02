import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  getMyTeamApi, getAllTeamsApi, getMyInvitesApi, 
  respondToInviteApi, inviteUserApi, createTeamApi, 
  joinTeamApi, leaveTeamApi 
} from '../../api/team.api';
import { searchUsersApi } from '../../api/user.api';

// --- UI Components (Inline for portability, usually would use shared) ---
const Card = ({ children, padding, style }) => (
  <div style={{
    background: 'var(--hz-surface)', border: '1px solid var(--hz-border)',
    borderRadius: '16px', padding: padding ? '1.5rem' : 0,
    boxShadow: 'var(--hz-shadow-sm)', ...style
  }}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', onClick, disabled, style, type='button' }) => {
  const base = {
    padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem',
    fontWeight: '600', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all 0.2s', opacity: disabled ? 0.6 : 1,
    ...style
  };
  const variants = {
    primary: { background: 'var(--hz-primary)', color: '#fff', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' },
    outline: { background: 'transparent', color: 'var(--hz-text)', border: '1px solid var(--hz-border)' },
    danger: { background: '#ef4444', color: '#fff' }
  };
  return <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
};

// --- Autocomplete User Search Component ---
const UserSearchInvite = ({ teamId, onInviteSent }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        try {
          const res = await searchUsersApi(query);
          setResults(res || []);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleInvite = async (email) => {
    try {
      await inviteUserApi({ teamId, email });
      toast.success(`Invite sent to ${email}`);
      setQuery('');
      setShowDropdown(false);
      if (onInviteSent) onInviteSent();
    } catch (err) {
      toast.error(err.error || 'Failed to send invite');
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{
          flex: 1,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--hz-bg)', border: '1px solid var(--hz-border)',
          borderRadius: '12px', padding: '0.6rem 1rem'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Type username or email to invite..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={(e) => { if (results.length > 0) setShowDropdown(true); e.target.style.outline = 'none'; }}
            style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', width: '100%', color: 'var(--hz-text)' }}
          />
          {loading && <div className="hz-spinner" style={{ width: '16px', height: '16px' }} />}
        </div>
        <Button 
          variant="primary" 
          disabled={loading || !query.trim()} 
          onClick={() => handleInvite(query.trim())}
        >
          Invite
        </Button>
      </div>

      {showDropdown && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
          background: 'var(--hz-surface)', border: '1px solid var(--hz-border)',
          borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxHeight: '250px', overflowY: 'auto', zIndex: 50
        }}>
          {results.map(u => (
            <div key={u.id} style={{
              padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderBottom: '1px solid var(--hz-border)', cursor: 'pointer', transition: 'background 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hz-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: 'var(--hz-text)', fontSize: '0.9rem' }}>{u.name}</p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--hz-text-muted)' }}>{u.email}</p>
              </div>
              <Button variant="primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleInvite(u.email)}>
                Invite
              </Button>
            </div>
          ))}
        </div>
      )}
      {showDropdown && query.length >= 2 && results.length === 0 && !loading && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
          background: 'var(--hz-surface)', border: '1px solid var(--hz-border)',
          borderRadius: '12px', padding: '1rem', textAlign: 'center', zIndex: 50
        }}>
          <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>No users found.</p>
        </div>
      )}
    </div>
  );
};

export default function TeamHub() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [myTeam, setMyTeam] = useState(null);
  const [publicTeams, setPublicTeams] = useState([]);
  const [myInvites, setMyInvites] = useState([]);
  const [teamSearchQuery, setTeamSearchQuery] = useState('');
  
  // Forms
  const [createForm, setCreateForm] = useState({ name: '', description: '', isPublic: true });
  const [joinCode, setJoinCode] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [teamRes, teamsRes, invitesRes] = await Promise.all([
        getMyTeamApi().catch(() => null),
        getAllTeamsApi().catch(() => []),
        getMyInvitesApi().catch(() => ({ data: [] }))
      ]);
      setMyTeam(teamRes);
      // Ensure we always have an array
      setPublicTeams(Array.isArray(teamsRes) ? teamsRes.filter(t => t.isPublic) : []);
      setMyInvites(invitesRes?.data || []);
      
      if (!teamRes && activeTab === 'dashboard') {
        setActiveTab('explore');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeamApi(createForm);
      toast.success('Team created!');
      loadData();
      setActiveTab('dashboard');
    } catch (err) {
      toast.error(err.error || 'Failed to create team');
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    try {
      await joinTeamApi(joinCode);
      toast.success('Joined team successfully!');
      loadData();
      setActiveTab('dashboard');
    } catch (err) {
      toast.error(err.error || 'Invalid code');
    }
  };

  const handleRespondInvite = async (inviteId, status, teamId) => {
    try {
      await respondToInviteApi({ inviteId, status, teamId });
      toast.success(`Invite ${status}`);
      loadData();
      if (status === 'accepted') setActiveTab('dashboard');
    } catch (err) {
      toast.error(err.error || 'Failed to respond to invite');
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    try {
      await leaveTeamApi();
      toast.success('You have left the team.');
      setMyTeam(null);
      setActiveTab('explore');
      loadData();
    } catch (err) {
      toast.error('Failed to leave team');
    }
  };

  if (loading) {
    return <div className="hz-page"><div className="hz-container" style={{ padding: '6rem 0', textAlign: 'center' }}><div className="hz-spinner hz-spinner--lg"></div></div></div>;
  }

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem' }}>
      {/* ── Dynamic Gradient Hero ── */}
      <div style={{
        position: 'relative', padding: '4rem 0 0 0', marginBottom: '2rem', overflow: 'hidden',
        borderBottom: '1px solid var(--hz-border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--hz-surface)', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-50%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        </div>
        <div className="hz-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              Team Hub
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Manage your squad, explore teams, and collaborate.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', borderBottom: '1px solid transparent' }}>
            {[
              { id: 'dashboard', label: 'My Workspace', show: !!myTeam },
              { id: 'explore', label: 'Explore Teams', show: true },
              { id: 'create', label: 'Create/Join', show: !myTeam },
              { id: 'invites', label: `Invitations ${myInvites.length > 0 ? `(${myInvites.length})` : ''}`, show: true }
            ].filter(t => t.show).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none', border: 'none', padding: '0.75rem 0.5rem', cursor: 'pointer',
                  fontSize: '0.95rem', fontWeight: activeTab === tab.id ? '700' : '500',
                  color: activeTab === tab.id ? 'var(--hz-primary)' : 'var(--hz-text-secondary)',
                  borderBottom: activeTab === tab.id ? '2px solid var(--hz-primary)' : '2px solid transparent',
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hz-container">
        
        {/* ── Dashboard Tab ───────────────────────────────────────────── */}
        {activeTab === 'dashboard' && myTeam && (
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <Card padding>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.25rem' }}>{myTeam.name}</h2>
                    <span style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>Team Code: <strong style={{ color: 'var(--hz-text)', userSelect: 'all' }}>{myTeam.inviteCode}</strong></span>
                  </div>
                  <Button variant="danger" onClick={handleLeaveTeam} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Leave Team</Button>
                </div>

                <div style={{ background: 'var(--hz-bg)', borderRadius: '12px', padding: '1.25rem', border: '1px solid var(--hz-border)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Team Members ({myTeam.members?.length || 0})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {myTeam.members?.map((m, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--hz-surface)', borderRadius: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--hz-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {typeof m === 'string' ? m.slice(0, 2).toUpperCase() : '?'}
                        </div>
                        <span style={{ fontWeight: '500' }}>{typeof m === 'object' ? m.name : m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="col-12 col-lg-4">
              <Card padding style={{ height: '100%' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>Invite Members</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '1rem' }}>Search for users by username or email to invite them to your team.</p>
                <UserSearchInvite teamId={myTeam.id} onInviteSent={loadData} />
              </Card>
            </div>
          </div>
        )}

        {/* ── Explore Teams Tab ────────────────────────────────────────── */}
        {activeTab === 'explore' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'var(--hz-surface)', border: '1px solid var(--hz-border)',
                borderRadius: '12px', padding: '0.6rem 1rem', width: '100%', maxWidth: '400px',
                boxShadow: 'var(--hz-shadow-sm)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input 
                  type="text" 
                  placeholder="Search by team name or code..." 
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none', width: '100%', color: 'var(--hz-text)' }}
                />
              </div>
            </div>
            
            <div className="row g-4">
              {publicTeams.filter(t => 
                (t.name && t.name.toLowerCase().includes(teamSearchQuery.toLowerCase())) ||
                (t.inviteCode && t.inviteCode.toLowerCase().includes(teamSearchQuery.toLowerCase()))
              ).length === 0 ? (
                <div className="col-12 text-center" style={{ padding: '4rem 0' }}>
                  <p style={{ color: 'var(--hz-text-muted)' }}>No public teams available matching your search.</p>
                </div>
              ) : (
                publicTeams.filter(t => 
                  (t.name && t.name.toLowerCase().includes(teamSearchQuery.toLowerCase())) ||
                  (t.inviteCode && t.inviteCode.toLowerCase().includes(teamSearchQuery.toLowerCase()))
                ).map(t => (
                  <div key={t.id} className="col-12 col-md-6 col-lg-4">
                    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'pointer' }} 
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                      <div style={{ padding: '1.5rem', flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>{t.name}</h3>
                          <span style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>{t.membersCount || 1}/{t.maxCapacity || 4} Members</span>
                        </div>
                        <p style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>{t.description || 'No description provided.'}</p>
                      </div>
                      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--hz-border)', background: 'var(--hz-bg)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                        <Button variant="outline" style={{ width: '100%', background: 'var(--hz-surface)' }}>Request to Join</Button>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Create / Join Tab ────────────────────────────────────────── */}
        {activeTab === 'create' && (
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <Card padding>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Create a New Team</h2>
                <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Team Name</label>
                    <input type="text" required value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Description</label>
                    <textarea rows="3" value={createForm.description} onChange={e => setCreateForm({...createForm, description: e.target.value})} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)' }} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={createForm.isPublic} onChange={e => setCreateForm({...createForm, isPublic: e.target.checked})} />
                    <span style={{ fontSize: '0.9rem' }}>Make team public (others can see it and request to join)</span>
                  </label>
                  <Button type="submit" variant="primary">Create Team</Button>
                </form>
              </Card>
            </div>
            
            <div className="col-12 col-md-6">
              <Card padding>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Join with Code</h2>
                <form onSubmit={handleJoinTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Invite Code</label>
                    <input type="text" required placeholder="HZ-XXXXXX" value={joinCode} onChange={e => setJoinCode(e.target.value)} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)' }} />
                  </div>
                  <Button type="submit" variant="outline">Join Team</Button>
                </form>
              </Card>
            </div>
          </div>
        )}

        {/* ── Invites Tab ──────────────────────────────────────────────── */}
        {activeTab === 'invites' && (
          <Card padding>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem' }}>Pending Invitations</h2>
            {myInvites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <p style={{ color: 'var(--hz-text-muted)' }}>You have no pending invitations.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myInvites.map(inv => (
                  <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem', fontWeight: '700' }}>Team: {inv.teamName}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Invited by {inv.inviter}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => handleRespondInvite(inv.id, 'rejected', inv.teamId)}>Decline</Button>
                      <Button variant="primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }} onClick={() => handleRespondInvite(inv.id, 'accepted', inv.teamId)}>Accept</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

      </div>
    </div>
  );
}
