import React, { useEffect, useState } from 'react';

export default function EvaluationResults() {
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    window.scrollTo(0, 0); 
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="hz-page">
        <div className="hz-container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="hz-spinner hz-spinner--lg"></div>
        </div>
      </div>
    );
  }

  const score = 8.4;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 10) * circumference;

  const criteria = [
    { label: 'Innovation', score: 9.0 },
    { label: 'Technical Execution', score: 8.0 },
    { label: 'Design & UX', score: 8.5 },
    { label: 'Presentation', score: 8.0 },
  ];

  const feedback = [
    {
      name: 'Dr. Elena Vance',
      date: 'Oct 25, 2024',
      text: 'Neural Knights demonstrates a sophisticated understanding of AI implementation. The core algorithm is robust, and the way you\'ve handled data privacy within the "Neural Knights" framework is exemplary for a hackathon project.',
      avatar: 'https://i.pravatar.cc/150?u=elena'
    },
    {
      name: 'Marcus Thorne',
      date: 'Oct 25, 2024',
      text: 'The user experience of Neural Knights is surprisingly polished. While the technical stack is complex, you\'ve managed to keep the interface intuitive. I\'d love to see more focus on the onboarding flow in future iterations.',
      avatar: 'https://i.pravatar.cc/150?u=marcus'
    },
    {
      name: 'Sarah Jenkins',
      date: 'Oct 25, 2024',
      text: 'Excellent presentation skills from the team. You clearly defined the problem and how Neural Knights solves it. The live demo was seamless, which is rare under hackathon pressure. Great job on the storytelling!',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    }
  ];

  return (
    <div className="hz-page">
      <div className="hz-container" style={{ maxWidth: '800px' }}>

        {/* ── Score & Overview Card ────────────────────────────────────── */}
        <div className="hz-card hz-card--padding" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          
          {/* Circular progress */}
          <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0, margin: '0 auto' }}>
            <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--hz-border)" strokeWidth="8" />
              <circle 
                cx="50" 
                cy="50" 
                r={radius} 
                fill="none" 
                stroke="var(--hz-primary)" 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
                strokeLinecap="round" 
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--hz-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {score}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--hz-text-muted)', marginTop: '4px' }}>
                out of 10
              </span>
            </div>
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <h2 className="hz-heading-2" style={{ marginBottom: '0.5rem' }}>Project: Neural Knights</h2>
            <p className="hz-text-muted" style={{ marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.95rem' }}>
              Your project has been reviewed by our panel of industry experts. Congratulations on a strong performance!
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="hz-btn hz-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Certificate
              </button>
              <button className="hz-btn hz-btn-outline" style={{ color: 'var(--hz-primary)', borderColor: 'var(--hz-border-strong)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share Results
              </button>
            </div>
          </div>
        </div>

        {/* ── Criteria Breakdown Card ────────────────────────────────────── */}
        <div className="hz-card hz-card--padding" style={{ marginBottom: '3rem' }}>
          <h3 className="hz-heading-3" style={{ marginBottom: '1.5rem' }}>Criteria Breakdown</h3>
          
          <div>
            {criteria.map((c, idx) => (
              <div key={c.label} style={{ marginBottom: idx === criteria.length - 1 ? 0 : '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--hz-text-secondary)', fontWeight: '500' }}>{c.label}</span>
                  <span style={{ fontWeight: '700', color: 'var(--hz-text)' }}>{c.score.toFixed(1)}/10</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'var(--hz-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(c.score/10)*100}%`, 
                      height: '100%', 
                      background: 'var(--hz-success)', 
                      borderRadius: '4px',
                      transition: 'width 1s ease-in-out'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Judge Feedback Section ─────────────────────────────────────── */}
        <h3 className="hz-heading-3" style={{ marginBottom: '1.5rem' }}>Judge Feedback</h3>

        <div>
          {feedback.map((j, i) => (
            <div key={i} className="hz-card hz-card--padding" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                <img 
                  src={j.avatar} 
                  alt={j.name} 
                  style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--hz-text)', fontSize: '0.95rem' }}>{j.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--hz-text-muted)' }}>{j.date}</div>
                </div>
              </div>
              <p style={{ color: 'var(--hz-text-secondary)', lineHeight: '1.6', margin: 0, fontSize: '0.95rem' }}>
                {j.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
