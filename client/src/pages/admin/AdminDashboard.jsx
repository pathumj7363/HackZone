import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>System Administration</h2>
      <p>Welcome to the admin panel.</p>
      <ul>
        <li><Link to="/admin/users">Manage Users</Link></li>
      </ul>
    </div>
  );
}
