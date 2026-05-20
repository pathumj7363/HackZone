import React, { useEffect, useState } from 'react';
import { getAllSubmissionsApi } from '../../api/submission.api';

export default function AssignJudges() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSubmissionsApi().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Assign Judges</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map(p => (
            <li key={p.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{p.title} (Team: {p.teamName})</h3>
              <div style={{ marginTop: '0.5rem' }}>
                <select defaultValue="">
                  <option value="" disabled>Select Judge to Assign</option>
                  <option value="j1">Judge John</option>
                  <option value="j2">Judge Jane</option>
                </select>
                <button style={{ marginLeft: '1rem' }}>Assign</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
