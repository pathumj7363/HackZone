import React, { useState } from 'react';

export default function Announcements() {
  const [text, setText] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('Announcement posted successfully (mocked).');
    setText('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Post Announcement</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
        <textarea 
          placeholder="Type your announcement here..." 
          value={text} 
          onChange={e => setText(e.target.value)} 
          rows={5}
          required 
        />
        <button type="submit">Post Announcement</button>
      </form>
    </div>
  );
}
