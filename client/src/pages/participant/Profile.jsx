import React from 'react';
import useAuth from '../../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
    </div>
  );
}
