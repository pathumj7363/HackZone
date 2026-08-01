import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getAssignedSubmissions } from '../../api/evaluation.api';
import { getMyPendingInvitationsApi, respondToInvitationApi } from '../../api/invitation.api';
import { Button, Card, Badge, LoadingSpinner, PageHeader } from '../../components/ui';
import { toast } from 'react-toastify';

export default function JudgeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    Promise.all([
      getAssignedSubmissions(),
      getMyPendingInvitationsApi()
    ]).then(([projectsData, invitesData]) => {
      setProjects(projectsData || []);
      setInvitations(invitesData || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRespond = async (inviteId, status) => {
    try {
      await respondToInvitationApi(inviteId, status);
      toast.success(`Invitation ${status}`);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || err.error || 'Failed to respond to invitation');
    }
  };

  // Filter projects by evaluation status
  // Assuming our API returns evaluations that may or may not be completed yet.
  // Actually, getAssignedSubmissions returns the evaluations assigned. If innovationScore is not null, it's completed.
  const completedProjects = projects.filter(p => p.innovationScore != null);
  const pendingProjects = projects.filter(p => p.innovationScore == null);
  
  // Calculate total hackathons by finding unique hackathonIds
  const hackathons = [...new Set(projects.map(p => p.hackathonId))];

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', background: 'var(--hz-bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* ── Dynamic Gradient Hero ── */}
      <div style={{
        position: 'relative', padding: '4rem 0', marginBottom: '3rem', overflow: 'hidden',
        borderBottom: '1px solid var(--hz-border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--hz-surface)', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-50%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        </div>
        
        <div className="hz-container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              Judge Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Welcome back, <span style={{ color: 'var(--hz-primary)', fontWeight: '700' }}>{user?.name || 'Judge'}</span>. You have {pendingProjects.length} pending reviews to complete.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: pendingProjects.length > 0 ? '#f59e0b' : '#10b981', boxShadow: `0 0 10px ${pendingProjects.length > 0 ? '#f59e0b' : '#10b981'}` }}></div>
              <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--hz-text)' }}>Status: {pendingProjects.length > 0 ? 'Action Required' : 'All Caught Up'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        {invitations.length > 0 && (
          <div style={{ marginBottom: '3rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '24px', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f59e0b', margin: '0 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Pending Hackathon Invitations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {invitations.map(invite => (
                <div key={invite.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--hz-surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: '700', color: 'var(--hz-text)' }}>{invite.hackathonTitle || `Hackathon #${invite.hackathonId}`}</h4>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--hz-text-secondary)' }}>You have been invited to judge this hackathon.</p>
                    {invite.evaluationAreas && invite.evaluationAreas.length > 0 && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', fontWeight: '600' }}>Assigned Areas:</span>
                        {invite.evaluationAreas.map(area => (
                          <span key={area} style={{ fontSize: '0.8rem', fontWeight: '700', background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{area}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button variant="outline" onClick={() => handleRespond(invite.id, 'declined')} style={{ borderColor: 'rgba(239,68,68,0.5)', color: '#ef4444' }}>Decline</Button>
                    <Button variant="primary" onClick={() => handleRespond(invite.id, 'accepted')} style={{ background: '#f59e0b', color: '#fff', border: 'none' }}>Accept Invite</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1. Metric Cards */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.1) 100%)', border: '1px solid rgba(245,158,11,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(239,68,68,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pending Reviews</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{pendingProjects.length}</div>
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Completed Reviews</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{completedProjects.length}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Hackathons</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{hackathons.length}</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            Loading dashboard data...
          </div>
        ) : (
          <div className="row g-4">
            
            {/* 2. 'To-Do' List of Pending Submissions */}
            <div className="col-12 col-lg-8">
              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hz-border)' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)' }}>Your To-Do List</h3>
                  <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700' }}>{pendingProjects.length} Pending</span>
                </div>
                
                {pendingProjects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', borderRadius: '16px' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>All Caught Up!</h3>
                    <p className="hz-text-muted" style={{ margin: 0 }}>You have no pending projects to review.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pendingProjects.map(p => (
                      <div key={p.id} style={{ 
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
                        background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '16px', padding: '1.5rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'var(--hz-primary)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--hz-border)'; }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.15rem', fontWeight: '800', color: 'var(--hz-text)' }}>
                            {p.submissionTitle || `Submission #${p.submissionId}`}
                          </h4>
                          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>Hackathon {p.hackathonId}</span>
                            {(p.judgeEvaluationAreas || []).map(area => (
                              <span key={area} style={{ fontSize: '0.75rem', fontWeight: '600', background: 'var(--hz-surface)', color: 'var(--hz-text-secondary)', border: '1px solid var(--hz-border)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{area}</span>
                            ))}
                          </div>
                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--hz-text-muted)' }}>
                            GitHub: {p.githubRepo || 'Not provided'}
                          </p>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <Button variant="primary" onClick={() => navigate(`/judge/evaluate/${p.submissionId}`)} style={{ whiteSpace: 'nowrap' }}>
                            Evaluate Project
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Visual Indicators / Progress Bars */}
            <div className="col-12 col-lg-4">
              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 1.5rem', color: 'var(--hz-text)', paddingBottom: '1rem', borderBottom: '1px solid var(--hz-border)' }}>
                  Hackathon Progress
                </h3>
                
                {hackathons.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                     <p className="hz-text-muted" style={{ margin: 0 }}>No hackathons assigned.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {hackathons.map(hId => {
                      const hProjects = projects.filter(p => p.hackathonId === hId);
                      const hCompleted = hProjects.filter(p => p.innovationScore != null).length;
                      const hTotal = hProjects.length;
                      const progressPercent = Math.round((hCompleted / hTotal) * 100) || 0;

                      return (
                        <div key={hId}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--hz-text)' }}>Hackathon {hId}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-secondary)' }}>{hCompleted} / {hTotal} Evaluated</span>
                          </div>
                          <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--hz-bg)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--hz-border)' }}>
                            <div style={{ 
                              width: `${progressPercent}%`, 
                              height: '100%', 
                              background: progressPercent === 100 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, var(--hz-primary), #a855f7)',
                              transition: 'width 0.5s ease',
                              borderRadius: '6px'
                            }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
