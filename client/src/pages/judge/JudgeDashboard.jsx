import React from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function JudgeDashboard() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Judge Dashboard</h2>
      <p>Welcome, Judge {user?.name || user?.email}!</p>
      <div style={{ marginTop: '1rem' }}>
        <h3>Quick Actions</h3>
        <ul>
          <li><Link to="/judge/projects">View Assigned Projects</Link></li>
        </ul>
      </div>
    </div>
  );
}
