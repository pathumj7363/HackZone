import React, { useState } from 'react';

// Mock list
const initialUsers = [
  { id: '1', email: 'user1@test.com', role: 'participant' },
  { id: '2', email: 'org@test.com', role: 'organizer' },
];

export default function ManageUsers() {
  const [users, setUsers] = useState(initialUsers);

  const handleDelete = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Users</h2>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>Email</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>Role</th>
            <th style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>{u.email}</td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>{u.role}</td>
              <td style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                <button onClick={() => handleDelete(u.id)} style={{ color: 'red', cursor: 'pointer' }}>Ban</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
