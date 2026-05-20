import React, { useState } from 'react';
import { createHackathonApi } from '../../api/hackathon.api';

export default function ManageHackathon() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await createHackathonApi({ title, description });
    setMessage('Hackathon created successfully!');
    setTitle('');
    setDescription('');
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Manage Hackathons</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Hackathon Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows={5}
          required 
        />
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create Hackathon'}</button>
      </form>
    </div>
  );
}
