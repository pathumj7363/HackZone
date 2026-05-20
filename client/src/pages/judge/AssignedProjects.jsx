import React, { useEffect, useState } from 'react';
import { getAssignedProjectsApi } from '../../api/evaluation.api';
import { Link } from 'react-router-dom';

export default function AssignedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignedProjectsApi().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Assigned Projects</h2>
      {loading ? <p>Loading...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map(p => (
            <li key={p.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <h3>{p.title}</h3>
              <p>Team: {p.teamName}</p>
              <p>Status: {p.status}</p>
              <Link to={`/judge/evaluate/${p.id}`}><button>Evaluate</button></Link>
            </li>
          ))}
          {projects.length === 0 && <p>No projects assigned yet.</p>}
        </ul>
      )}
    </div>
  );
}
