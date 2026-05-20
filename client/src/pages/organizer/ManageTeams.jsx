import React, { useEffect, useState } from 'react';
import { getAllTeamsApi } from '../../api/team.api';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTeamsApi().then(data => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Teams</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {teams.map(t => (
            <li key={t.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{t.name}</h3>
              <p>Members: {t.members}</p>
              <button>Disqualify (Mock Action)</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
