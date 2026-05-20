import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getHackathonDetailApi } from '../../api/hackathon.api';

export default function HackathonDetail() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHackathonDetailApi(id).then(data => {
      setHackathon(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
  if (!hackathon) return <div style={{ padding: '2rem' }}>Hackathon not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{hackathon.title}</h2>
      <p>Status: {hackathon.status}</p>
      <p>Participants: {hackathon.participants}</p>
      <p>{hackathon.description}</p>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <Link to="/teams/create"><button>Create Team</button></Link>
        <Link to="/teams/join"><button>Join Team</button></Link>
      </div>
    </div>
  );
}
