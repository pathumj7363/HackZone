import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, EmptyState } from '../ui';
import { getMyTeamApi, inviteUserApi } from '../../api/team.api';
import { toast } from 'react-toastify';

export default function TeamManager() {
  const [team, setTeam] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    try {
      const data = await getMyTeamApi();
      setTeam(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    if (!team) {
      toast.error('You need to create or join a team first.');
      return;
    }

    setLoading(true);
    try {
      const response = await inviteUserApi({ teamId: team.id, email: inviteEmail });
      setInvites([...invites, { id: response.data?.id || Date.now(), email: inviteEmail, status: 'pending' }]);
      setInviteEmail('');
      toast.success('Invite sent!');
    } catch (err) {
      toast.error('Failed to send invite.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <Card padding="2rem">
        <h3 className="hz-heading-3 hz-mb-4">My Team</h3>
        {team ? (
          <div>
            <div className="d-flex justify-content-between align-items-start hz-mb-4">
              <div>
                <h4 className="hz-heading-4" style={{ margin: 0 }}>{team.name}</h4>
                <p className="hz-text-muted" style={{ fontSize: '0.875rem' }}>Team Code: {team.code}</p>
              </div>
              <Badge variant="primary">{team.members.length} Members</Badge>
            </div>
            
            <h5 className="hz-heading-5 hz-mb-2">Members</h5>
            <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
              {team.members.map((member, idx) => (
                <li key={idx} className="hz-text-muted">{member}</li>
              ))}
            </ul>
          </div>
        ) : (
          <EmptyState message="You are not in a team yet." />
        )}
      </Card>

      <Card padding="2rem">
        <h3 className="hz-heading-3 hz-mb-4">Invite Members</h3>
        <form onSubmit={handleInvite} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <Input 
              type="email"
              placeholder="user@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={!team}
            />
          </div>
          <Button type="submit" variant="primary" disabled={loading || !team}>
            {loading ? 'Sending...' : 'Send Invite'}
          </Button>
        </form>

        <h5 className="hz-heading-5 hz-mb-3">Sent Invites</h5>
        {invites.length === 0 ? (
          <p className="hz-text-muted" style={{ fontSize: '0.875rem' }}>No invites sent yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {invites.map(inv => (
              <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--hz-surface)', borderRadius: 'var(--hz-radius)', border: '1px solid var(--hz-border)' }}>
                <span>{inv.email}</span>
                <Badge variant={inv.status === 'pending' ? 'warning' : 'success'}>{inv.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
