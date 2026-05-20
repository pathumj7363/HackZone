import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Organizer Dashboard</h2>
      <p>Welcome back, Organizer {user?.name || user?.email}!</p>
      <div style={{ marginTop: '1rem' }}>
        <h3>Quick Actions</h3>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li><Link to="/organizer/hackathon">Manage Hackathons</Link></li>
          <li><Link to="/organizer/teams">Manage Teams</Link></li>
          <li><Link to="/organizer/judges">Assign Judges</Link></li>
          <li><Link to="/organizer/announce">Post Announcements</Link></li>
        </ul>
      </div>
    </div>
  );
}
