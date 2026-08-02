import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getSubmissionReportApi } from '../../api/evaluation.api';
import { LoadingSpinner } from '../../components/ui';

export default function OrganizerSubmissionPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const submission = location.state?.submission;

  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    if (!submission) {
      // If no submission in state, we should ideally fetch it, but for now just go back.
      navigate('/organizer/dashboard');
      return;
    }

    getSubmissionReportApi(id)
      .then(data => {
        setEvaluations(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch report:', err);
        setLoading(false);
      });
  }, [id, submission, navigate]);

  if (!submission) return null;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--hz-bg)' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // --- STYLING ---
  const pageStyle = {
    background: 'var(--hz-bg)',
    minHeight: '100vh',
    color: 'var(--hz-text)',
    fontFamily: '"Inter", sans-serif',
    paddingBottom: '120px'
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  };

  const sectionLabelStyle = {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--hz-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  };

  const parsedTechStack = typeof submission.techStack === 'string' 
    ? submission.techStack.split(',').map(t => t.trim()).filter(Boolean) 
    : (submission.techStack || []);

  const submitterName = submission.teamId ? submission.teamName : submission.participantName;

  // Calculate overall average score
  let totalScore = 0;
  let scoreCount = 0;
  evaluations.forEach(evalRecord => {
    let parsedScores = [];
    if (evalRecord.dynamicScores) {
      try {
        parsedScores = typeof evalRecord.dynamicScores === 'string' ? JSON.parse(evalRecord.dynamicScores) : evalRecord.dynamicScores;
      } catch(e){}
    } else if (evalRecord.innovationScore) {
      parsedScores = [
        { criteria: 'Innovation', score: evalRecord.innovationScore },
        { criteria: 'Technical', score: evalRecord.technicalComplexityScore },
        { criteria: 'Design', score: evalRecord.designScore },
        { criteria: 'Usability', score: evalRecord.usabilityScore }
      ];
    }
    
    parsedScores.forEach(sc => {
      const val = Number(sc.score);
      if (!isNaN(val)) {
        totalScore += val;
        scoreCount++;
      }
    });
  });
  const overallAverage = scoreCount > 0 ? Math.round(totalScore / scoreCount) : null;

  return (
    <div style={pageStyle}>
      {/* Navbar / Top Back Button */}
      <div style={{ borderBottom: '1px solid var(--hz-border)', position: 'sticky', top: 0, background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--hz-text-muted)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back to Submissions
          </button>
        </div>
      </div>

      <div style={containerStyle}>
        
        {/* --- HEADER --- */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.2 }}>
            {submission.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--hz-text-secondary)', fontSize: '0.95rem' }}>
            <span>By <strong>{submitterName}</strong></span>
            <span style={{ color: 'var(--hz-border)' }}>|</span>
            <span>{submission.teamId ? 'TEAM' : 'SOLO'} PROJECT</span>
          </div>
        </div>

        {/* --- PROJECT CONTENT --- */}
        <div style={{ marginBottom: '3rem', background: 'var(--hz-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={sectionLabelStyle}>Description</div>
            <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--hz-text)', whiteSpace: 'pre-line' }}>
              {submission.description || 'No description provided.'}
            </p>
          </div>

          {parsedTechStack.length > 0 && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={sectionLabelStyle}>Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {parsedTechStack.map((tech, idx) => (
                  <span key={idx} style={{ padding: '0.4rem 0.8rem', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--hz-text)' }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {submission.notes && (
            <div style={{ marginBottom: '2.5rem', padding: '1.5rem', background: 'var(--hz-bg)', borderLeft: '3px solid var(--hz-border)', borderRadius: '0 8px 8px 0' }}>
              <div style={sectionLabelStyle}>Participant Notes</div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--hz-text-secondary)', whiteSpace: 'pre-line' }}>
                {submission.notes}
              </p>
            </div>
          )}

          {/* Links Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {submission.githubRepo && (
              <a href={submission.githubRepo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--hz-text)', textDecoration: 'none', background: 'var(--hz-bg)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--hz-border)', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                Source Code
              </a>
            )}
            {submission.demoVideoUrl && (
              <a href={submission.demoVideoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#ec4899', textDecoration: 'none', background: 'rgba(236,72,153,0.05)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid rgba(236,72,153,0.3)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(236,72,153,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(236,72,153,0.05)'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                Watch Demo
              </a>
            )}
            {submission.fileUrl && (
              <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--hz-primary)', textDecoration: 'none', background: 'var(--hz-primary-light)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid transparent' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Attachment
              </a>
            )}
          </div>
        </div>

        {/* --- EVALUATION REPORT --- */}
        <div style={{ background: 'var(--hz-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', borderTop: '4px solid var(--hz-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Evaluation Report</h2>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--hz-text-secondary)' }}>
                Scores and feedback provided by assigned judges. You have view-only access.
              </p>
            </div>
            {overallAverage !== null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--hz-bg)', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Score</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--hz-text-secondary)' }}>Based on {scoreCount} areas</span>
                </div>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--hz-primary) 0%, #a855f7 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
                  {overallAverage}
                </div>
              </div>
            )}
          </div>

          {evaluations.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--hz-bg)', borderRadius: '12px', border: '1px dashed var(--hz-border)' }}>
              <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>No judges have evaluated this submission yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {evaluations.map((evalRecord, idx) => {
                let parsedScores = [];
                if (evalRecord.dynamicScores) {
                  try {
                    parsedScores = typeof evalRecord.dynamicScores === 'string' ? JSON.parse(evalRecord.dynamicScores) : evalRecord.dynamicScores;
                  } catch(e){}
                } else if (evalRecord.innovationScore) {
                  parsedScores = [
                    { criteria: 'Innovation', score: evalRecord.innovationScore },
                    { criteria: 'Technical', score: evalRecord.technicalComplexityScore },
                    { criteria: 'Design', score: evalRecord.designScore },
                    { criteria: 'Usability', score: evalRecord.usabilityScore }
                  ];
                }

                // If no scores assigned yet (just placeholder row)
                if (parsedScores.length === 0 && !evalRecord.feedback && !evalRecord.innovationScore) {
                  return (
                     <div key={idx} style={{ padding: '1.5rem', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--hz-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {evalRecord.judgeName ? evalRecord.judgeName.charAt(0) : 'J'}
                          </div>
                          <span style={{ fontWeight: 600 }}>{evalRecord.judgeName || 'Unknown Judge'}</span>
                          <span style={{ color: 'var(--hz-warning)', fontSize: '0.85rem', marginLeft: 'auto', background: 'var(--hz-warning-light)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Pending</span>
                       </div>
                       <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>This judge has not submitted their evaluation yet.</p>
                     </div>
                  );
                }

                return (
                  <div key={idx} style={{ padding: '1.5rem', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hz-border)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                        {evalRecord.judgeName ? evalRecord.judgeName.charAt(0) : 'J'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{evalRecord.judgeName || 'Unknown Judge'}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>{evalRecord.judgeEmail}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {parsedScores.map((sc, sidx) => (
                        <div key={sidx} style={{ background: 'var(--hz-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--hz-border)', paddingBottom: '1rem' }}>
                            <div style={{ fontSize: '1.1rem', color: 'var(--hz-text)', fontWeight: 800 }}>{sc.criteria}</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--hz-text-muted)', marginRight: '0.5rem' }}>AREA AVERAGE</span>
                              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--hz-primary)' }}>{sc.score}</span>
                              <span style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)', fontWeight: 500 }}>/ 100</span>
                            </div>
                          </div>
                          
                          {sc.metrics && sc.metrics.length > 0 && (
                            <div style={{ marginBottom: '1.5rem' }}>
                              <div style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.75rem' }}>Evaluation Metrics</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {sc.metrics.map((m, mIdx) => (
                                  <div key={mIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--hz-bg)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--hz-border)' }}>
                                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{m.name || 'Unnamed Metric'}</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--hz-primary)' }}>{m.score} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--hz-text-muted)' }}>/ 100</span></span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {sc.feedback ? (
                            <div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>Area Feedback</div>
                              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--hz-text-secondary)', whiteSpace: 'pre-line', background: 'rgba(99,102,241,0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--hz-primary)' }}>{sc.feedback}</p>
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)', fontStyle: 'italic' }}>No feedback provided for this area.</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
