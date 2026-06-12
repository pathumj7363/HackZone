import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { respondToInviteApi } from '../../api/team.api';
import { toast } from 'react-toastify';

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const [teamInvites, setTeamInvites] = useState([]);

  useEffect(() => {
    // Mock data for registered hackathons
    setRegisteredHackathons([
      { id: 1, title: 'Global AI Hackathon 2024', status: 'Active', role: 'Team Leader', teamName: 'Neural Knights' },
      { id: 2, title: 'Web3 Innovators', status: 'Upcoming', role: 'Solo Participant' }
    ]);

    // Mock data for team invites
    setTeamInvites([
      { id: 'inv1', teamName: 'Code Wizards', hackathon: 'Global AI Hackathon 2024', inviter: 'John Doe' },
      { id: 'inv2', teamName: 'Byte Me', hackathon: 'Hack for Good', inviter: 'Alice Smith' }
    ]);
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
                <EmptyState message="You haven't registered for any hackathons yet." />
              ) : (
                registeredHackathons.map(hackathon => (
                  <Card key={hackathon.id} padding="1.5rem">
                    <div className="d-flex justify-content-between align-items-start hz-mb-2">
                      <h4 className="hz-heading-4" style={{ margin: 0 }}>{hackathon.title}</h4>
                      <Badge variant={hackathon.status === 'Active' ? 'success' : 'default'}>
                        {hackathon.status}
                      </Badge>
                    </div>
                    <p className="hz-text-muted hz-mb-4" style={{ fontSize: '0.875rem' }}>
                      Role: {hackathon.role} {hackathon.teamName && `• Team: ${hackathon.teamName}`}
                    </p>
                    <Link to="/hackathons" style={{ textDecoration: 'none' }}>
                      <Button variant="outline" size="sm">View Details</Button>
                    </Link>
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
                <EmptyState message="No pending team invites." />
              ) : (
                teamInvites.map(invite => (
                  <Card key={invite.id} padding="1.5rem">
                    <h4 className="hz-heading-4" style={{ margin: 0, marginBottom: '0.25rem' }}>{invite.teamName}</h4>
                    <p className="hz-text-muted" style={{ fontSize: '0.875rem', margin: 0, marginBottom: '0.25rem' }}>
                      Hackathon: {invite.hackathon}
                    </p>
                    <p className="hz-text-muted hz-mb-4" style={{ fontSize: '0.875rem' }}>
                      Invited by: {invite.inviter}
                    </p>
                    <div className="d-flex gap-2">
                      <Button variant="primary" size="sm" className="flex-grow-1" onClick={() => handleAcceptInvite(invite.id)}>
                        Accept
                      </Button>
                      <Button variant="outline" size="sm" className="flex-grow-1" onClick={() => handleDeclineInvite(invite.id)}>
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="hz-heading-3 hz-mb-4">Discover</h3>
          <Card padding="2rem" style={{ textAlign: 'center', background: 'var(--hz-surface)', border: '1px dashed var(--hz-border)' }}>
            <h4 className="hz-heading-4 hz-mb-2">Looking for your next challenge?</h4>
            <p className="hz-text-muted hz-mb-6">Browse new and upcoming hackathons and find a team to join.</p>
            <Link to="/hackathons">
              <Button variant="primary">Browse Hackathons</Button>
            </Link>
          </Card>
        </div>

      </div>
    </div>
  );
}
