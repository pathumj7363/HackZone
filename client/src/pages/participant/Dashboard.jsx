import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Participant Dashboard</h2>
      <p>Welcome, {user?.name || user?.email}!</p>
      <div style={{ marginTop: '1rem' }}>
        <h3>Quick Links</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><Link to="/hackathons">Browse Hackathons</Link></li>
          <li><Link to="/teams/dashboard">My Team</Link></li>
          <li><Link to="/submissions">My Submissions</Link></li>
        </ul>
      </div>
    </div>
  );
}
