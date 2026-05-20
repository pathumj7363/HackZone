import React, { useEffect, useState } from 'react';
import { getHackathonsApi } from '../../api/hackathon.api';
import { Link } from 'react-router-dom';

export default function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHackathonsApi().then(data => {
      setHackathons(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Hackathons</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {hackathons.map(h => (
            <li key={h.id} style={{ padding: '1rem', border: '1px solid #ccc', marginBottom: '1rem' }}>
              <h3>{h.title}</h3>
              <p>Status: {h.status}</p>
              <Link to={`/hackathons/${h.id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
