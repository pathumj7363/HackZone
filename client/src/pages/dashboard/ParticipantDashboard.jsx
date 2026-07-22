import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { respondToInviteApi, getMyInvitesApi } from '../../api/team.api';
import { getMyRegisteredHackathonsApi } from '../../api/hackathon.api';
import { toast } from 'react-toastify';

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const [teamInvites, setTeamInvites] = useState([]);

  useEffect(() => {
    getMyRegisteredHackathonsApi()
      .then(data => setRegisteredHackathons(data || []))
      .catch(() => setRegisteredHackathons([]));
      
    getMyInvitesApi()
      .then(data => setTeamInvites(data?.data || data || []))
      .catch(() => setTeamInvites([]));
  }, []);

  const handleAcceptInvite = async (id) => {
    try {
      setTeamInvites(teamInvites.filter(invite => invite.id !== id));
      toast.success("Invite accepted!");
    } catch (err) {
      toast.error("Failed to accept invite");
    }
  };

  const handleDeclineInvite = async (id) => {
    try {
      setTeamInvites(teamInvites.filter(invite => invite.id !== id));
      toast.info("Invite declined.");
    } catch (err) {
      toast.error("Failed to decline invite");
    }
  };

  return (
    <div className="hz-page">
      <div className="hz-container">
        <PageHeader
          title={`Participant Dashboard`}
          subtitle={`Welcome back, ${user?.name || 'Participant'}! Here is a quick overview of your hackathons and teams.`}
        />

        <div className="row g-4 hz-mb-8">
          {/* Registered Hackathons */}
          <div className="col-12 col-lg-8">
            <h3 className="hz-heading-3 hz-mb-4">Registered Hackathons</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {registeredHackathons.length === 0 ? (
                <EmptyState 
                  title="No Registered Hackathons" 
                  description="You haven't registered for any hackathons yet." 
                />
              ) : (
                registeredHackathons.map(hackathon => (
                  <Card key={hackathon.id} padding="1.25rem" style={{ transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'; }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '8px',
                        background: `url(${hackathon.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`,
                        flexShrink: 0,
                        border: '1px solid var(--hz-border)'
                      }} />
                      
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                          <h4 className="hz-heading-4" style={{ margin: 0, fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hackathon.title}</h4>
                          <Badge variant={
                            hackathon.registrationStatus === 'approved' ? 'success' : 
                            hackathon.registrationStatus === 'rejected' ? 'danger' : 'warning'
                          }>
                            {hackathon.registrationStatus === 'approved' ? 'Project Approved' : 
                             hackathon.registrationStatus === 'rejected' ? 'Project Rejected' : 'Pending Approval'}
                          </Badge>
                        </div>
                        
                        {hackathon.teamName ? (
                          <p className="hz-text-muted" style={{ fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>
                            Registered as team: <strong style={{ color: 'var(--hz-text)' }}>{hackathon.teamName}</strong>
                          </p>
                        ) : (
                          <p className="hz-text-muted" style={{ fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>
                            Registered as: <strong style={{ color: 'var(--hz-text)' }}>Solo Participant</strong>
                          </p>
                        )}
                        
                        <div>
                          <Link to={`/hackathons/${hackathon.id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="outline" size="sm" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Pending Invites */}
          <div className="col-12 col-lg-4">
            <h3 className="hz-heading-3 hz-mb-4">Pending Team Invites</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {teamInvites.length === 0 ? (
                <Card padding="1.5rem" style={{ textAlign: 'center', background: 'transparent', border: '1px dashed var(--hz-border)' }}>
                  <p className="hz-text-muted" style={{ margin: 0, fontSize: '0.95rem' }}>
                    You have no pending team invites at the moment.
                  </p>
                </Card>
              ) : (
                teamInvites.map(invite => (
                  <Card key={invite.id} padding="1.25rem" style={{ transition: 'box-shadow 0.2s', borderLeft: '3px solid var(--hz-primary)' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'}>
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 className="hz-heading-4" style={{ margin: '0 0 0.25rem 0', fontSize: '1.05rem' }}>{invite.teamName}</h4>
                      <p className="hz-text-muted" style={{ fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>
                        For Hackathon: <strong style={{ color: 'var(--hz-text)' }}>{invite.hackathon}</strong>
                      </p>
                      <p className="hz-text-muted" style={{ fontSize: '0.85rem', margin: 0 }}>
                        Invited by: <strong>{invite.inviter}</strong>
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button variant="primary" size="sm" style={{ flex: 1, padding: '0.4rem' }} onClick={() => handleAcceptInvite(invite.id)}>
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" style={{ flex: 1, padding: '0.4rem' }} onClick={() => handleDeclineInvite(invite.id)}>
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Team Management Actions */}
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h3 className="hz-heading-3 hz-mb-4">Team Management</h3>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <Card padding="1.5rem" style={{ transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="19" y1="8" x2="19" y2="14"></line>
                      <line x1="22" y1="11" x2="16" y2="11"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--hz-text)' }}>Create a Team</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--hz-text-muted)' }}>Generate unique code & invite allies</p>
                  </div>
                </div>
                <Link to="/teams/create" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" style={{ width: '100%', borderRadius: '8px' }}>
                    Create Team
                  </Button>
                </Link>
              </Card>
            </div>

            <div className="col-12 col-md-4">
              <Card padding="1.5rem" style={{ transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--hz-text)' }}>Join a Team</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--hz-text-muted)' }}>Search open teams or enter code</p>
                  </div>
                </div>
                <Link to="/teams/join" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" style={{ width: '100%', borderRadius: '8px' }}>
                    Browse & Join
                  </Button>
                </Link>
              </Card>
            </div>

            <div className="col-12 col-md-4">
              <Card padding="1.5rem" style={{ transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                      <line x1="8" y1="21" x2="16" y2="21"></line>
                      <line x1="12" y1="17" x2="12" y2="21"></line>
                    </svg>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--hz-text)' }}>My Workspace</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--hz-text-muted)' }}>Manage members & project tasks</p>
                  </div>
                </div>
                <Link to="/teams/dashboard" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" style={{ width: '100%', borderRadius: '8px' }}>
                    View Workspace
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Links / CTA */}
        <div style={{ marginTop: '1.5rem' }}>
          <Card padding="0" style={{ 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)', 
            border: '1px solid rgba(139, 92, 246, 0.2)',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '16px'
          }}>
            {/* Decorative background blobs */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '14px', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              
              <h4 className="hz-heading-3 hz-mb-2" style={{ fontWeight: 'var(--hz-font-weight-bold)' }}>
                Ready for your next challenge?
              </h4>
              
              <p className="hz-text-muted hz-mb-6" style={{ maxWidth: '450px', margin: '0 auto 2rem', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Join the most exciting hackathons around the globe. Browse upcoming events, form a team, and build incredible projects.
              </p>
              
              <Link to="/hackathons" style={{ textDecoration: 'none' }}>
                <Button variant="primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '999px', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}>
                  Explore Hackathons
                </Button>
              </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
