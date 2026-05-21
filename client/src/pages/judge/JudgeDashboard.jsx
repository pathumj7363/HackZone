import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getAssignedProjectsApi } from '../../api/evaluation.api';
import { Button, Card, Badge, LoadingSpinner } from '../../components/ui';

export default function JudgeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRubric, setShowRubric] = useState(false);

  useEffect(() => {
    getAssignedProjectsApi().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const pendingCount = projects.filter(p => p.status === 'Pending' || p.status === 'Not Started').length;
  const completedCount = projects.filter(p => p.status === 'Completed').length;
  const avgTime = "8m";
  
  const topProjects = projects.filter(p => p.status !== 'Completed').slice(0, 3).concat(
    projects.filter(p => p.status === 'Completed').slice(0, 1)
  );

  return (
    <div className="hz-page hz-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="hz-heading-1" style={{ marginBottom: '0.5rem' }}>Judge Panel</h1>
        <p className="hz-text-secondary" style={{ fontSize: '1.125rem' }}>
          Welcome back, {user?.name || 'Sarah'}. You have {pendingCount} evaluations remaining for today's track.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>Pending Evaluations</p>
            <h2 className="hz-heading-1">{pendingCount}</h2>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '50%' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><circle cx="15.5" cy="15.5" r="2.5"></circle><path d="M15.5 13v2.5l1.5 1.5"></path></svg>
          </div>
        </Card>
        
        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>Completed</p>
            <h2 className="hz-heading-1">{completedCount}</h2>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--hz-success-bg)', color: 'var(--hz-success-text)', borderRadius: '50%' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </Card>

        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>Avg. Time per Review</p>
            <h2 className="hz-heading-1">{avgTime}</h2>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--hz-warning-bg)', color: 'var(--hz-warning-text)', borderRadius: '50%' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </Card>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 className="hz-heading-2">Assigned Projects</h2>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
             <Button variant="outline" size="sm" onClick={() => navigate('/judge/projects')}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem'}}><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
               Filter
             </Button>
             <Button variant="outline" size="sm" onClick={() => navigate('/judge/projects')}>
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '0.5rem'}}><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
               Sort
             </Button>
          </div>
        </div>

        {loading ? (
          <div className="hz-spinner-wrap--centered"><LoadingSpinner size="lg" /></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topProjects.map(p => {
              const calculateScore = (evalData) => {
                 if (!evalData) return 0;
                 return (evalData.innovation || 0) + (evalData.technicalExecution || 0) + (evalData.marketReadiness || 0) + (evalData.presentation || 0);
              };
              const score = p.evaluation ? calculateScore(p.evaluation) : 0;
              const maxScore = 40;
              const scaledScore = Math.round((score / maxScore) * 100);

              return (
                <Card key={p.id} padding hover style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 className="hz-heading-3" style={{ margin: 0 }}>{p.title}</h3>
                      {p.dueText && p.status !== 'Completed' && (
                        <Badge variant="warning">{p.dueText}</Badge>
                      )}
                      {p.status === 'Completed' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      )}
                    </div>
                    <p className="hz-text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                      {p.teamName} &bull; {p.hackathon}
                    </p>
                    {p.status !== 'Completed' && (
                      <p className="hz-text-muted" style={{ fontSize: '0.875rem', margin: 0, maxWidth: '800px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '2rem' }}>
                    {p.status === 'Completed' ? (
                      <Badge variant="success" style={{ padding: '0.4rem 0.75rem' }}>Score: {scaledScore}/100</Badge>
                    ) : (
                      <Badge variant={p.status === 'In Progress' ? 'primary' : 'neutral'}>{p.status}</Badge>
                    )}
                    
                    <Button 
                      variant={p.status === 'Completed' ? 'outline' : 'primary'} 
                      onClick={() => navigate(`/judge/evaluate/${p.id}`)}
                      style={{ minWidth: '160px' }}
                    >
                      {p.status === 'Completed' ? 'View Review' : p.status === 'In Progress' ? 'Resume Evaluation' : 'Evaluate'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Judging Guidelines Card */}
        <Card style={{ background: 'linear-gradient(135deg, #3b2bc0 0%, #2b1f8c 100%)', color: 'white', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', right: '-5%', top: '-10%', opacity: 0.1, pointerEvents: 'none' }}>
            <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div style={{ padding: '2.5rem', position: 'relative', zIndex: 1 }}>
            <h2 className="hz-heading-2" style={{ color: 'white', marginBottom: '1rem' }}>Judging Guidelines</h2>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '500px', marginBottom: '2rem' }}>
              Remember to evaluate projects based on Innovation, Technical Execution, and Market Readiness. Check the updated rubric for AI-specific criteria.
            </p>
            <Button onClick={() => setShowRubric(true)} style={{ background: 'white', color: 'var(--hz-primary)', border: 'none' }}>
              View Rubric
            </Button>
          </div>
        </Card>

        {/* Upcoming Deadlines Card */}
        <Card padding>
          <h3 className="hz-heading-3" style={{ marginBottom: '1.5rem' }}>Upcoming Deadlines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hz-danger)', marginTop: '6px' }}></div>
              <div>
                <p style={{ fontWeight: 500, margin: '0 0 0.25rem 0' }}>Final Scores Due</p>
                <p className="hz-text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>Today, 6:00 PM</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hz-primary)', marginTop: '6px' }}></div>
              <div>
                <p style={{ fontWeight: 500, margin: '0 0 0.25rem 0' }}>Closing Ceremony</p>
                <p className="hz-text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>Tomorrow, 10:00 AM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showRubric && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15, 23, 42, 0.6)' }}>
          <Card padding style={{ width: '100%', maxWidth: '600px', position: 'relative' }}>
            <button 
              onClick={() => setShowRubric(false)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="hz-heading-2" style={{ marginBottom: '1.5rem' }}>Scoring Rubric</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Innovation (1-10)</h4>
                <p className="hz-text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>How unique and creative is the solution? Does it solve the problem in a novel way?</p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Technical Execution (1-10)</h4>
                <p className="hz-text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Is the code robust? Does the prototype work smoothly? Are best practices followed?</p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Market Readiness (1-10)</h4>
                <p className="hz-text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>Is there a clear target audience? How viable is this product in the real world?</p>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Presentation (1-10)</h4>
                <p className="hz-text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>How effectively did the team communicate their vision, demo, and value proposition?</p>
              </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
               <Button onClick={() => setShowRubric(false)}>Understood</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
