import React, { useEffect, useState, useContext } from 'react';
import { getMyTeamApi, leaveTeamApi, updateTeamGithubApi } from '../../api/team.api';
import { getHackathonDetailApi } from '../../api/hackathon.api';
import { getMySubmissionsApi } from '../../api/submission.api';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import TeamManager from '../../components/team/TeamManager';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

// Avatar color palette for generated avatars
const AVATAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b', '#ec4899'];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.toString().trim().split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.toString().slice(0, 2).toUpperCase();
}

function Avatar({ name, size = 40, index = 0 }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: AVATAR_COLORS[index % AVATAR_COLORS.length],
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size < 36 ? '11px' : 'var(--hz-font-size-sm)',
      fontWeight: 'var(--hz-font-weight-bold)',
      border: '2.5px solid var(--hz-bg)',
      flexShrink: 0,
      userSelect: 'none',
    }}>
      {getInitials(name)}
    </div>
  );
}

export default function TeamDashboard() {
  const { user } = useContext(AuthContext);
  const [team, setTeam] = useState(null);
  const [hackathon, setHackathon] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [tempGithubRepo, setTempGithubRepo] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const teamData = await getMyTeamApi();
        setTeam(teamData);
        if (teamData?.hackathonId && teamData.hackathonId !== 'general') {
          const [hackData, subData] = await Promise.all([
            getHackathonDetailApi(teamData.hackathonId).catch(() => null),
            getMySubmissionsApi().catch(() => [])
          ]);
          setHackathon(hackData);
          setSubmissions(subData || []);
        }
      } catch (err) {
        console.error("Failed to load team dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLeaveTeamConfirm = async () => {
    try {
      await leaveTeamApi();
      toast.success("You have left the team.");
      setTeam(null);
      setIsLeaveModalOpen(false);
    } catch (err) {
      toast.error("Failed to leave team.");
    }
  };

  const handleSetGithubClick = (e) => {
    e.preventDefault();
    if (!user || team.leaderId !== user.id) {
      if (team.githubRepo) {
        window.open(team.githubRepo.startsWith('http') ? team.githubRepo : `https://${team.githubRepo}`, '_blank');
      }
      return;
    }
    setTempGithubRepo(team.githubRepo || '');
    setIsGithubModalOpen(true);
  };

  const handleSetGithubSubmit = async () => {
    try {
      await updateTeamGithubApi(team.id, tempGithubRepo);
      setTeam({ ...team, githubRepo: tempGithubRepo });
      toast.success("GitHub repository updated!");
      setIsGithubModalOpen(false);
    } catch (err) {
      toast.error("Failed to update repository.");
    }
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="hz-page">
        <div className="hz-container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="hz-spinner hz-spinner--lg"></div>
        </div>
      </div>
    );
  }

  // ── No Team ───────────────────────────────────────────────────────────────
  if (!team) {
    return (
      <div className="hz-page">
        <div className="hz-container">
          <div style={{ marginBottom: 'var(--hz-space-6)' }}>
            <h1 className="hz-heading-2" style={{ marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>
              My Team
            </h1>
            <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-base)' }}>
              You are not part of a team yet.
            </p>
          </div>
          <Card padding style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'var(--hz-primary-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h2 className="hz-heading-3" style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)', marginBottom: '0.5rem' }}>
              No Team Yet
            </h2>
            <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', maxWidth: '360px', margin: '0 auto 2rem' }}>
              Collaborate with others and compete together. Create your team or join one using an invite code.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/teams/create" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Create Team</Button>
              </Link>
              <Link to="/teams/join" style={{ textDecoration: 'none' }}>
                <Button variant="outline">Join Team</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const members = Array.isArray(team.members) ? team.members : [];
  const getMemberName = (m, i) => typeof m === 'object' ? (m.name || m.email || `Member ${i + 1}`) : m;
  const getMemberRole = (m, i) => typeof m === 'object' && m.role ? m.role : (i === 0 ? 'Captain' : 'Member');
  
  const hasSubmitted = submissions.length > 0;
  const latestSubmission = hasSubmitted ? submissions[0] : null;
  const progress = hasSubmitted ? 100 : (team.githubRepo ? 65 : 25);

  // ── Full Dashboard ────────────────────────────────────────────────────────
  return (
    <div className="hz-page">
      <div className="hz-container">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div style={{ marginBottom: '1.75rem' }}>

          {/* "TEAM WORKSPACE" label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span style={{
              fontSize: 'var(--hz-font-size-xs)',
              fontWeight: 'var(--hz-font-weight-bold)',
              color: 'var(--hz-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Team Workspace
            </span>
          </div>

          {/* Team name */}
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 'var(--hz-font-weight-bold)',
            color: 'var(--hz-text)',
            margin: '0 0 0.875rem',
            letterSpacing: '-0.02em'
          }}>
            {team.name}
          </h1>

          {/* Avatar stack + action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Avatar stack */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {members.slice(0, 3).map((m, i) => (
                <div key={i} style={{ marginLeft: i === 0 ? 0 : '-10px', zIndex: 3 - i, position: 'relative' }}>
                  <Avatar name={getMemberName(m, i)} size={36} index={i} />
                </div>
              ))}
              {members.length > 3 && (
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--hz-surface)',
                  border: '2.5px solid var(--hz-bg)',
                  color: 'var(--hz-text-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 'var(--hz-font-weight-bold)',
                  marginLeft: '-10px', zIndex: 0
                }}>
                  +{members.length - 3}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/teams/join" style={{ textDecoration: 'none' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'transparent',
                  border: '1px solid var(--hz-border)',
                  borderRadius: 'var(--hz-radius-sm)',
                  padding: '0.5rem 1rem',
                  fontSize: 'var(--hz-font-size-sm)',
                  fontWeight: 'var(--hz-font-weight-medium)',
                  color: 'var(--hz-text)',
                  cursor: 'pointer',
                  transition: 'background var(--hz-transition)'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--hz-surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                  Invite
                </button>
              </Link>
              <button onClick={() => setIsLeaveModalOpen(true)} style={{
                background: 'transparent',
                border: 'none',
                padding: '0.5rem 0',
                fontSize: 'var(--hz-font-size-sm)',
                fontWeight: 'var(--hz-font-weight-medium)',
                color: '#ef4444',
                cursor: 'pointer'
              }}>
                Leave Team
              </button>
            </div>
          </div>
        </div>

        {/* ── Two-column row: Project Status + Project Links ────────── */}
        <div className="row g-4" style={{ marginBottom: '1.5rem' }}>

          {/* Project Status Card */}
          <div className="col-12 col-lg-8">
            <Card padding style={{ height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{
                    fontSize: 'var(--hz-font-size-xl)',
                    fontWeight: 'var(--hz-font-weight-bold)',
                    color: 'var(--hz-text)',
                    margin: '0 0 0.25rem'
                  }}>
                    {hackathon ? hackathon.title : 'General Team'}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <span style={{ 
                      fontSize: 'var(--hz-font-size-sm)', 
                      fontWeight: 'var(--hz-font-weight-medium)', 
                      color: hasSubmitted ? '#10b981' : 'var(--hz-text-secondary)'
                    }}>
                      {hasSubmitted ? 'Project Submitted' : 'Drafting Project'}
                    </span>
                    {hasSubmitted && (
                      <span className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-xs)' }}>
                        • Submitted on {new Date(latestSubmission.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {!hasSubmitted && (
                  <Link to="/submit" style={{ textDecoration: 'none' }}>
                    <button style={{
                      background: 'var(--hz-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 'var(--hz-radius-sm)',
                      padding: '0.625rem 1.5rem',
                      fontSize: 'var(--hz-font-size-sm)',
                      fontWeight: 'var(--hz-font-weight-bold)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'opacity var(--hz-transition)'
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      Submit Project
                    </button>
                  </Link>
                )}
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-medium)', color: 'var(--hz-text-secondary)' }}>
                    Submission Progress
                  </span>
                  <span style={{ fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-primary)' }}>
                    {progress}%
                  </span>
                </div>
                <div style={{
                  height: '8px', borderRadius: '999px',
                  background: 'var(--hz-surface)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, var(--hz-primary) 0%, #6d28d9 100%)',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Team Assembled', done: members.length > 0 },
                  { label: 'GitHub Repository', done: !!team.githubRepo, suffix: 'Missing' },
                  { label: 'Final Submission', done: hasSubmitted, suffix: 'Pending' },
                ].map((tag, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    background: 'var(--hz-surface)',
                    border: '1px solid var(--hz-border)',
                    borderRadius: '999px',
                    padding: '0.25rem 0.75rem',
                    fontSize: 'var(--hz-font-size-xs)',
                    fontWeight: 'var(--hz-font-weight-medium)',
                    color: 'var(--hz-text-secondary)'
                  }}>
                    {tag.label}
                    {tag.done
                      ? <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓</span>
                      : <span style={{ color: 'var(--hz-text-muted)' }}>• {tag.suffix}</span>
                    }
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Project Links Card */}
          <div className="col-12 col-lg-4">
            <Card padding style={{ height: '100%' }}>
              <h2 style={{
                fontSize: 'var(--hz-font-size-lg)',
                fontWeight: 'var(--hz-font-weight-bold)',
                color: 'var(--hz-text)',
                margin: '0 0 1.25rem'
              }}>
                Project Links
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {/* GitHub */}
                <div onClick={handleSetGithubClick} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--hz-radius-sm)',
                    border: '1px solid var(--hz-border)',
                    background: 'var(--hz-surface)',
                    cursor: 'pointer',
                    transition: 'border-color var(--hz-transition)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: 'var(--hz-radius-sm)',
                      background: 'var(--hz-bg)', border: '1px solid var(--hz-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-semibold)', color: 'var(--hz-text)' }}>
                        GitHub Repository
                      </p>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {team.githubRepo ? team.githubRepo : 'Click to add repository link'}
                      </p>
                    </div>
                    {user && team.leaderId === user.id && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    )}
                  </div>
                </div>

                {/* Live Demo */}
                <a href="#" style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--hz-radius-sm)',
                    border: '1px solid var(--hz-border)',
                    background: 'var(--hz-surface)',
                    cursor: 'pointer',
                    transition: 'border-color var(--hz-transition)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: 'var(--hz-radius-sm)',
                      background: 'var(--hz-bg)', border: '1px solid var(--hz-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-semibold)', color: 'var(--hz-text)' }}>
                        Live Demo URL
                      </p>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        demo.hackzone.io/neural-knights
                      </p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </div>
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* ── Team Manager Component ───────────────────────────────────── */}
        <div className="hz-mb-6">
          <TeamManager />
        </div>

        {/* ── Team Discussion ───────────────────────────────────────────── */}
        <div style={{
          border: '2px dashed var(--hz-border)',
          borderRadius: 'var(--hz-radius)',
          padding: '3rem 2rem',
          textAlign: 'center',
          background: 'var(--hz-surface)'
        }}>
          {/* Icon */}
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'var(--hz-primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>

          <h2 style={{
            fontSize: 'var(--hz-font-size-xl)',
            fontWeight: 'var(--hz-font-weight-bold)',
            color: 'var(--hz-text)',
            margin: '0 0 0.5rem'
          }}>
            Team Discussion
          </h2>
          <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', margin: '0 auto 1.75rem', maxWidth: '400px', lineHeight: '1.6' }}>
            No messages yet. Start a conversation with your teammates to coordinate your project submission.
          </p>

          <button style={{
            background: 'transparent',
            border: '1.5px solid var(--hz-primary)',
            borderRadius: '999px',
            padding: '0.625rem 1.75rem',
            fontSize: 'var(--hz-font-size-sm)',
            fontWeight: 'var(--hz-font-weight-semibold)',
            color: 'var(--hz-primary)',
            cursor: 'pointer',
            transition: 'all var(--hz-transition)'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--hz-primary)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--hz-primary)'; }}
          >
            Open Team Chat
          </button>
        </div>

      </div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <Modal 
        isOpen={isLeaveModalOpen} 
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Team"
        actions={
          <>
            <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={handleLeaveTeamConfirm}>
              Yes, Leave Team
            </Button>
          </>
        }
      >
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Are you sure you want to leave <strong>{team.name}</strong>? 
          {team.leaderId === user?.id && members.length > 1 && (
            <span> The team leadership will be transferred to the next oldest member.</span>
          )}
          {team.leaderId === user?.id && members.length === 1 && (
            <span> Since you are the only member, the team will be permanently deleted.</span>
          )}
        </p>
      </Modal>

      <Modal 
        isOpen={isGithubModalOpen} 
        onClose={() => setIsGithubModalOpen(false)}
        title="GitHub Repository"
        actions={
          <>
            <Button variant="outline" onClick={() => setIsGithubModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSetGithubSubmit}>Save</Button>
          </>
        }
      >
        <p style={{ margin: '0 0 1rem 0', color: 'var(--hz-text-secondary)', fontSize: '0.9rem' }}>
          Enter the full URL to your project's GitHub repository.
        </p>
        <Input 
          type="url"
          placeholder="https://github.com/username/repo"
          value={tempGithubRepo}
          onChange={(e) => setTempGithubRepo(e.target.value)}
        />
      </Modal>

    </div>
  );
}

