import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { submitEvaluationApi } from '../../api/evaluation.api';

export default function EvaluateProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await submitEvaluationApi(id, { score: Number(score), feedback });
    navigate('/judge/projects');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Evaluate Project (ID: {id})</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <input 
          type="number" 
          placeholder="Score (0-100)" 
          value={score} 
          onChange={e => setScore(e.target.value)} 
          min="0" max="100"
          required 
        />
        <textarea 
          placeholder="Detailed Feedback" 
          value={feedback} 
          onChange={e => setFeedback(e.target.value)} 
          rows={5}
          required 
        />
        <button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Evaluation'}</button>
      </form>
    </div>
  );
}
