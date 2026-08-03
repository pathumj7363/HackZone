import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHackathonsApi, getScoreboardApi, publishScoreboardApi } from '../../api/hackathon.api';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

export default function OrganizerScoreboard() {
  const navigate = useNavigate();
  
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  
  const [scoreboardData, setScoreboardData] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [evaluatedProjects, setEvaluatedProjects] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getMyHackathonsApi()
      .then(data => {
        const hacks = Array.isArray(data) ? data : (data?.data || []);
        setHackathons(hacks);
        if (hacks.length > 0) {
          setSelectedHackathonId(hacks[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedHackathonId) return;
    
    setDataLoading(true);
    getScoreboardApi(selectedHackathonId)
      .then(res => {
        setScoreboardData(res.scoreboard || []);
        setTotalProjects(res.totalProjects || 0);
        setEvaluatedProjects(res.evaluatedProjects || 0);
        setIsPublished(res.isPublished || false);
        setDataLoading(false);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load scoreboard data');
        setDataLoading(false);
      });
  }, [selectedHackathonId]);

  const handlePublish = async () => {
    if (!selectedHackathonId) return;
    try {
      setPublishing(true);
      await publishScoreboardApi(selectedHackathonId);
      toast.success('Results published successfully!');
      setIsPublished(true);
      setPublishing(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to publish results');
      setPublishing(false);
    }
  };

  const isAllEvaluated = totalProjects > 0 && evaluatedProjects === totalProjects;

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
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
              Real-time Scoreboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Track evaluation progress and publish final results for your hackathons.
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--hz-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', paddingLeft: '0.5rem' }}>Select Hackathon:</span>
            <select 
              value={selectedHackathonId} 
              onChange={(e) => setSelectedHackathonId(e.target.value)}
              style={{
                padding: '0.5rem 2rem 0.5rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid var(--hz-border)', 
                backgroundColor: 'var(--hz-bg)', 
                color: 'var(--hz-text)', 
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem top 50%',
                backgroundSize: '0.65rem auto'
              }}
            >
              {!loading && hackathons.map(h => (
                <option key={h.id} value={h.id} style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)' }}>{h.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="hz-container">
        {loading ? (
           <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
             Loading hackathons...
           </div>
        ) : !selectedHackathonId ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)' }}>
            <p className="hz-text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>Please create a hackathon first to view the scoreboard.</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="row g-4 mb-5">
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Projects</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{totalProjects}</div>
                </div>
              </div>
              
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Evaluated Projects</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{evaluatedProjects}</div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: isPublished ? 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)' : 'var(--hz-surface)', border: isPublished ? '1px solid rgba(99,102,241,0.2)' : '1px solid var(--hz-border)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                  {isPublished && <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: isPublished ? 'var(--hz-primary)' : 'var(--hz-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Result Status</span>
                    {isPublished ? 
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> :
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    }
                  </div>
                  {isPublished ? (
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--hz-text)' }}>Published</div>
                  ) : (
                    <Button 
                      variant="primary" 
                      disabled={!isAllEvaluated || totalProjects === 0 || publishing} 
                      onClick={handlePublish}
                      style={{ 
                        width: '100%', 
                        opacity: (!isAllEvaluated || totalProjects === 0) ? 0.5 : 1,
                        background: (!isAllEvaluated || totalProjects === 0) ? 'var(--hz-border)' : 'var(--hz-primary)'
                      }}
                    >
                      {publishing ? 'Publishing...' : 'Publish Results'}
                    </Button>
                  )}
                  {!isPublished && totalProjects > 0 && !isAllEvaluated && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#f59e0b', fontWeight: '600' }}>
                      * Evaluate all projects to publish
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scoreboard Table */}
            <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)' }}>Leaderboard</h3>
              </div>

              {dataLoading ? (
                 <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hz-text-muted)' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                   Loading scoreboard...
                 </div>
              ) : scoreboardData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', borderRadius: '16px' }}>
                  <p className="hz-text-muted" style={{ margin: 0 }}>No submissions found for this hackathon.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '2px solid var(--hz-border)', color: 'var(--hz-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Place</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid var(--hz-border)', color: 'var(--hz-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team / Participant</th>
                        <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '2px solid var(--hz-border)', color: 'var(--hz-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Name</th>
                        <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '2px solid var(--hz-border)', color: 'var(--hz-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Final Score</th>
                        <th style={{ textAlign: 'center', padding: '1rem', borderBottom: '2px solid var(--hz-border)', color: 'var(--hz-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scoreboardData.map((row) => (
                        <tr key={row.submissionId} style={{ borderBottom: '1px solid var(--hz-border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hz-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                            <div style={{ 
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                              width: '36px', height: '36px', borderRadius: '50%', 
                              background: row.place === 1 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
                                         row.place === 2 ? 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)' :
                                         row.place === 3 ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'var(--hz-bg)',
                              color: row.place <= 3 ? '#fff' : 'var(--hz-text-muted)',
                              fontWeight: '800',
                              border: row.place > 3 ? '1px solid var(--hz-border)' : 'none',
                              boxShadow: row.place <= 3 ? '0 4px 10px rgba(0,0,0,0.1)' : 'none'
                            }}>
                              {row.place}
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 1rem', fontWeight: '700', color: 'var(--hz-text)' }}>{row.teamName}</td>
                          <td style={{ padding: '1.25rem 1rem', color: 'var(--hz-text-secondary)', fontWeight: '500' }}>{row.title}</td>
                          <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.2rem' }}>
                              <span style={{ fontSize: '1.25rem', fontWeight: '800', color: row.averageScore > 0 ? 'var(--hz-primary)' : 'var(--hz-text-muted)' }}>{row.averageScore}</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', fontWeight: '600' }}>/ 100</span>
                            </div>
                          </td>
                          <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                            <Button variant="outline" onClick={() => navigate(`/organizer/submissions/${row.submissionId}`)} style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
