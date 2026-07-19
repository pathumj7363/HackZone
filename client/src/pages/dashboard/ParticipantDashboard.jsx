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
