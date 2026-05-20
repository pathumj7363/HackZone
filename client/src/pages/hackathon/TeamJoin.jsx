import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinTeamApi } from '../../api/team.api';

export default function TeamJoin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await joinTeamApi(code);
      navigate('/teams/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Join a Team</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
        <input
          type="text"
          placeholder="Team Code (e.g. WIZ123)"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Joining...' : 'Join Team'}</button>
      </form>
    </div>
  );
}
