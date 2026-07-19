import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHackathonDetailApi, registerHackathonApi } from '../../api/hackathon.api';
import { getMyTeamApi } from '../../api/team.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

// Utility for timeline dots
const TimelineDot = ({ color }) => (
  <div style={{
    width: '12px', height: '12px', borderRadius: '50%',
    background: color, border: '2px solid var(--hz-bg)',
    position: 'relative', zIndex: 1
  }} />
);

export default function HackathonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [regType, setRegType] = useState('solo'); // 'solo' or 'team'
  const [role, setRole] = useState('Developer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [githubUrl, setGithubUrl] = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    getHackathonDetailApi(id).then(data => {
      setHackathon(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Failed to fetch hackathon detail:", err);
      setLoading(false);
    });
    
    getMyTeamApi().then(data => setMyTeam(data)).catch(() => setMyTeam(null));
  }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      const payload = { 
        hackathonId: id,
        regType,
        role,
        experienceLevel,
        githubUrl
      };
      if (regType === 'team' && myTeam) {
        payload.teamId = myTeam.id;
      }
      await registerHackathonApi(payload);
      toast.success('Successfully registered for the hackathon!');
      setShowModal(false);
      navigate('/dashboard'); // Go to participant dashboard
    } catch (err) {
      toast.error('Failed to register. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="hz-page" style={{ padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 0' }}>
          <div className="hz-spinner hz-spinner--lg"></div>
        </div>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="hz-page">
        <div className="hz-container" style={{ padding: '4rem 0', textAlign: 'center' }}>
          <h2 className="hz-heading-2">Hackathon not found</h2>
        </div>
      </div>
    );
  }

  const title = hackathon.title || "Untitled Hackathon";
  const dateRange = hackathon.dateRange || "";
  const organizer = "Organizer"; // Add organizer name fetch later if needed
  const image = hackathon.image || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80';
  const displayStatus = hackathon.status || "COMING SOON";
  const description = hackathon.description || "No description provided.";
  const location = hackathon.location || "TBA";
  const theme = hackathon.theme || "Open Ended";
  const prizePool = hackathon.prizePool || "TBA";
  const participantCount = hackathon.participants || "0 teams";

  // Dynamic Rules
  let rules = ["All code must be original.", "Projects must align with the theme.", "A demonstration is required for submission."];
  if (hackathon.rules && typeof hackathon.rules === 'string') {
    rules = hackathon.rules.split('\n').filter(r => r.trim() !== '');
  } else if (Array.isArray(hackathon.rules)) {
    rules = hackathon.rules;
  }

  // Dynamic Prizes
  let prizesList = hackathon.prizes && Array.isArray(hackathon.prizes) && hackathon.prizes.length > 0 
    ? hackathon.prizes 
    : [
        { place: 'Grand Prize Pool', amount: prizePool, icon: '🏆', color: '#fef3c7', iconColor: '#d97706', desc: 'Total prize distribution' }
      ];

  // Dynamic Milestones
  const startObj = new Date(hackathon.startDate || Date.now());
  const endObj = new Date(hackathon.endDate || Date.now());
  const winnersObj = new Date(endObj.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days after end
  
  const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' • ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });

  const milestones = [
    { title: 'Registration & Hacking Begins', date: formatDate(startObj), color: '#10b981' },
    { title: 'Submission Deadline', date: formatDate(endObj), color: '#3b82f6' },
    { title: 'Winners Announced', date: formatDate(winnersObj), color: '#cbd5e1' },
  ];

  // Dynamic Checklist
  const checklist = [
    { label: 'Register for Event', status: 'Done', done: true },
    { label: 'Team Formation', status: `By ${startObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, color: '#ef4444' },
    { label: 'Final Submission', status: endObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
  ];

  return (
    <div className="hz-page" style={{ padding: 0, paddingBottom: '4rem' }}>

      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '340px',
        background: '#0f172a',
        backgroundImage: `url("${image}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        paddingBottom: '2.5rem'
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.9) 100%)'
        }
      } />

        <div className="hz-container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Tags row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              background: 'rgba(255,255,255,0.9)',
              color: '#047857',
              padding: '0.3rem 0.75rem', borderRadius: '999px',
              fontSize: '11px', fontWeight: 'var(--hz-font-weight-bold)'
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              {displayStatus}
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              color: 'rgba(255,255,255,0.85)',
              fontSize: 'var(--hz-font-size-sm)',
              fontWeight: 'var(--hz-font-weight-medium)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {dateRange}
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'var(--hz-font-weight-bold)',
            color: '#fff',
            margin: '0 0 1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.1
          }}>
            {title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.9)' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: '#8b5cf6', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 'bold'
            }}>
              AF
            </div>
            <span style={{ fontSize: 'var(--hz-font-size-sm)' }}>
              Organized by <strong>{organizer}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ marginTop: '2rem' }}>
        <div className="row g-4">

          {/* ── Left Column (Main Content) ────────────────────────────────────── */}
          <div className="col-12 col-lg-8">
            <Card padding style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 1rem' }}>
                About this Hackathon
              </h2>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <span className="hz-badge hz-badge--info">📍 {location}</span>
                <span className="hz-badge hz-badge--warning">💡 {theme}</span>
              </div>
              <p style={{ fontSize: 'var(--hz-font-size-sm)', color: 'var(--hz-text-secondary)', lineHeight: '1.6', marginBottom: '2rem', whiteSpace: 'pre-wrap' }}>
                {description}
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid var(--hz-border)', margin: '0 0 1.5rem' }} />

              <h3 style={{ fontSize: '1.125rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 1.25rem' }}>
                Official Rules
              </h3>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rules.map((rule, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ flexShrink: 0, color: 'var(--hz-primary)', marginTop: '2px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: 'var(--hz-font-size-sm)', color: 'var(--hz-text-secondary)', lineHeight: '1.5' }}>
                      {rule.text || rule}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Prizes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {prizesList.map((prize, i) => (
                <Card key={i} padding style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: prize.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', marginBottom: '1rem'
                  }}>
                    {prize.icon}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 0.5rem' }}>
                    {prize.place}
                  </h4>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-primary)', marginBottom: '0.5rem' }}>
                    {prize.amount}
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--hz-text-muted)', margin: 0 }}>
                    {prize.desc}
                  </p>
                </Card>
              ))}
            </div>

            {/* Key Milestones */}
            <Card padding>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 1.5rem' }}>
                Key Milestones
              </h3>

              <div style={{ position: 'relative', paddingLeft: '1rem' }}>
                {/* Vertical Line */}
                <div style={{ position: 'absolute', left: '16px', top: '8px', bottom: '8px', width: '2px', background: 'var(--hz-border)' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {milestones.map((milestone, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative' }}>
                      <div style={{ marginTop: '4px' }}>
                        <TimelineDot color={milestone.color} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 0.25rem' }}>
                          {milestone.title}
                        </h4>
                        <p style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', margin: 0 }}>
                          {milestone.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* ── Right Column (Sidebar) ────────────────────────────────────────── */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">

            {/* Registration Action Card */}
            <Card padding style={{ textAlign: 'center' }}>
              <Button variant="primary" style={{ width: '100%', padding: '0.75rem', fontSize: 'var(--hz-font-size-base)', marginBottom: '0.75rem' }} onClick={() => setShowModal(true)}>
                Register for Hackathon
              </Button>

              <Link to="/teams/create" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.25rem' }}>
                <Button variant="outline" style={{ width: '100%', padding: '0.75rem', fontSize: 'var(--hz-font-size-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                  Create a Team
                </Button>
              </Link>

              <p style={{ fontSize: '11px', color: 'var(--hz-text-muted)', margin: 0 }}>
                {participantCount} registered
              </p>
            </Card>

            {/* Deadline Checklist */}
            <Card padding>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 1.25rem' }}>
                Deadline Checklist
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {checklist.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {item.done ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      ) : (
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--hz-border)' }} />
                      )}
                      <span style={{ fontSize: 'var(--hz-font-size-sm)', color: 'var(--hz-text)', fontWeight: 'var(--hz-font-weight-medium)' }}>
                        {item.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 'var(--hz-font-weight-bold)', color: item.color || 'var(--hz-text-muted)' }}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Organizer Info */}
            <div style={{ background: '#f8fafc', borderRadius: 'var(--hz-radius)', padding: '1.25rem', border: '1px solid var(--hz-border)' }}>
              <div style={{ fontSize: '10px', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                ORGANIZED BY
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  background: '#0f172a', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 20h.01"></path>
                    <path d="M7 20v-4"></path>
                    <path d="M12 20v-8"></path>
                    <path d="M17 20V8"></path>
                    <path d="M22 4v16"></path>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)' }}>
                    {organizer}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--hz-text-muted)' }}>
                    Platform Organizer
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--hz-text-secondary)', lineHeight: '1.5', margin: 0 }}>
                Hosted on the HackZone Platform. Contact organizers through the official Discord server.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--hz-bg)', borderRadius: 'var(--hz-radius)',
            width: '100%', maxWidth: '500px', padding: '2rem',
            boxShadow: 'var(--hz-shadow-lg)', position: 'relative'
          }}>
            <h2 className="hz-heading-3 hz-mb-4">Register for Hackathon</h2>
            
            <div className="hz-mb-4">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>
                Registration Type
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="regType" value="solo" checked={regType === 'solo'} onChange={() => setRegType('solo')} />
                  Solo Participant
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input type="radio" name="regType" value="team" checked={regType === 'team'} onChange={() => setRegType('team')} />
                  Register as Team
                </label>
              </div>
            </div>

              {regType === 'team' && (
                <div className="hz-mb-4">
                  {myTeam ? (
                    <div style={{ padding: '1rem', background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', borderRadius: 'var(--hz-radius-sm)' }}>
                      <p style={{ margin: 0, fontWeight: 'var(--hz-font-weight-bold)' }}>{myTeam.name}</p>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--hz-text-muted)' }}>{myTeam.members?.length || 0} Members</p>
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--hz-radius-sm)' }}>
                      You are not in a team. Please create or join a team first, or register as a solo participant.
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>Your Role</label>
                <select className="hz-input" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)' }}>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>Experience Level</label>
                <select className="hz-input" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)' }}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>GitHub / Portfolio URL</label>
                <input type="url" className="hz-input" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/yourusername" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)', color: 'var(--hz-text)' }} />
              </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={registering}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRegister} disabled={registering || (regType === 'team' && !myTeam)}>
                {registering ? 'Registering...' : 'Confirm Registration'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
