import React, { useEffect, useState } from 'react';
import { getMySubmissionsApi } from '../../api/submission.api';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySubmissionsApi().then(data => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Submissions</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {submissions.map(s => (
            <li key={s.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{s.title}</h3>
              <p>Hackathon ID: {s.hackathonId}</p>
              <p>Status: {s.status}</p>
              {s.score && <p>Score: {s.score}</p>}
            </li>
          ))}
          {submissions.length === 0 && <p>You have not submitted any projects yet.</p>}
        </ul>
      )}
    </div>
  );
}
