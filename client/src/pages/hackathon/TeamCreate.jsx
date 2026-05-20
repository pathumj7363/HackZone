import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeamApi } from '../../api/team.api';

export default function TeamCreate() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createTeamApi({ name });
    navigate('/teams/dashboard');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create a Team</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="Team Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Team'}</button>
      </form>
    </div>
  );
}
