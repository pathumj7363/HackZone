import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitProjectApi } from '../../api/submission.api';

export default function SubmitProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await submitProjectApi({ title, description });
    navigate('/submissions');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Submit Project</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Project Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Project Description / Link to Repo" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          rows={5}
          required 
        />
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Project'}</button>
      </form>
    </div>
  );
}
