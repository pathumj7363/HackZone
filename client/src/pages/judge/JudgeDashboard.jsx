import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getAssignedSubmissions } from '../../api/evaluation.api';
import { Button, Card, Badge, LoadingSpinner, PageHeader } from '../../components/ui';

export default function JudgeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from real backend endpoint
    getAssignedSubmissions().then(data => {
      // data might be undefined if API fails, default to []
      setProjects(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  // Filter projects by evaluation status
  // Assuming our API returns evaluations that may or may not be completed yet.
  // Actually, getAssignedSubmissions returns the evaluations assigned. If innovationScore is not null, it's completed.
  const completedProjects = projects.filter(p => p.innovationScore != null);
  const pendingProjects = projects.filter(p => p.innovationScore == null);
  
  // Calculate total hackathons by finding unique hackathonIds
  const hackathons = [...new Set(projects.map(p => p.hackathonId))];

  return (
    <div className="hz-page hz-container">
      <PageHeader 
        title="Judge Dashboard" 
        subtitle={`Welcome back, ${user?.name || 'Judge'}. You have ${pendingProjects.length} pending reviews to complete.`}
      />

      {/* 1. Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>Pending Reviews</p>
            <h2 className="hz-heading-2">{pendingProjects.length}</h2>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--hz-warning-bg)', color: 'var(--hz-warning-text)', borderRadius: '50%' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </Card>
        
        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>Completed Reviews</p>
            <h2 className="hz-heading-2">{completedProjects.length}</h2>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--hz-success-bg)', color: 'var(--hz-success-text)', borderRadius: '50%' }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </Card>

        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>Total Hackathons Judging</p>
            <h2 className="hz-heading-2">{hackathons.length}</h2>
          </div>
          <div style={{ padding: '0.75rem', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '50%' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
        </Card>
      </div>

      {loading ? (
        <div className="hz-spinner-wrap--centered"><LoadingSpinner size="lg" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* 2. 'To-Do' List of Pending Submissions */}
          <div>
            <h3 className="hz-heading-3" style={{ marginBottom: '1.5rem' }}>Your To-Do List</h3>
            {pendingProjects.length === 0 ? (
              <Card padding style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <p className="hz-text-muted">You have no pending projects to review!</p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingProjects.map(p => (
                  <Card key={p.id} padding hover style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h4 className="hz-heading-3" style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem' }}>
                        {p.submissionTitle || `Submission #${p.submissionId}`}
                      </h4>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Badge variant="primary">Hackathon {p.hackathonId}</Badge>
                        <Badge variant="warning">Action Required</Badge>
                      </div>
                      <p className="hz-text-muted" style={{ margin: 0, fontSize: '0.875rem' }}>
                        GitHub: {p.githubRepo || 'Not provided'}
                      </p>
                    </div>
                    <div style={{ marginLeft: '1.5rem' }}>
                      <Button onClick={() => navigate(`/judge/evaluate/${p.submissionId}`)}>
                        Evaluate Project
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 3. Visual Indicators / Progress Bars */}
          <div>
            <h3 className="hz-heading-3" style={{ marginBottom: '1.5rem' }}>Hackathon Progress</h3>
            <Card padding>
              {hackathons.length === 0 ? (
                <p className="hz-text-muted" style={{ margin: 0 }}>No hackathons assigned.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {hackathons.map(hId => {
                    const hProjects = projects.filter(p => p.hackathonId === hId);
                    const hCompleted = hProjects.filter(p => p.innovationScore != null).length;
                    const hTotal = hProjects.length;
                    const progressPercent = Math.round((hCompleted / hTotal) * 100) || 0;

                    return (
                      <div key={hId}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>Hackathon {hId}</span>
                          <span className="hz-text-muted" style={{ fontSize: '0.875rem' }}>{hCompleted} / {hTotal} Evaluated</span>
                        </div>
                        {/* Progress Bar Container */}
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--hz-border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            width: `${progressPercent}%`, 
                            height: '100%', 
                            backgroundColor: progressPercent === 100 ? 'var(--hz-success)' : 'var(--hz-primary)',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

        </div>
      )}
    </div>
  );
}
