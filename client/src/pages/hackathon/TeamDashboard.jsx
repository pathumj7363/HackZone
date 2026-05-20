import React, { useEffect, useState } from 'react';
import { getMyTeamApi } from '../../api/team.api';
import { Link } from 'react-router-dom';

export default function TeamDashboard() {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyTeamApi()
      .then(data => { setTeam(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!team) return (
    <div style={{ padding: '2rem' }}>
      <h2>My Team</h2>
      <p>You are not in a team yet.</p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/teams/create"><button>Create Team</button></Link>
        <Link to="/teams/join"><button>Join Team</button></Link>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Team Dashboard: {team.name}</h2>
      <p><strong>Join Code:</strong> {team.code}</p>
      <div style={{ marginTop: '1rem' }}>
        <h3>Members</h3>
        <ul>
          {team.members.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/submit"><button>Submit Project</button></Link>
      </div>
    </div>
  );
}
