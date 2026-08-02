import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignedProjectsApi } from '../../api/evaluation.api';
import { Button, Card, Badge, Input, Select, LoadingSpinner, PageHeader } from '../../components/ui';

export default function AssignedProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [hackathonFilter, setHackathonFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    getAssignedProjectsApi().then(data => {
      setProjects(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setProjects([]);
      setLoading(false);
    });
  }, []);

  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  
  const scoredProjects = projects.filter(p => p.evaluation !== null && p.status === 'Completed');
  let avgScoreDisplay = '0.0 pts';
  if (scoredProjects.length > 0) {
    const totalRaw = scoredProjects.reduce((acc, p) => {
       const evalD = p.evaluation;
       const s = (evalD.innovation||0) + (evalD.technicalExecution||0) + (evalD.marketReadiness||0) + (evalD.presentation||0);
       return acc + (s / 40) * 100;
    }, 0);
    avgScoreDisplay = (totalRaw / scoredProjects.length).toFixed(1) + ' pts';
  }

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.teamName.toLowerCase().includes(search.toLowerCase());
    const matchesHackathon = hackathonFilter ? p.hackathon === hackathonFilter : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesHackathon && matchesStatus;
  });

  const uniqueHackathons = [...new Set(projects.map(p => p.hackathon))].filter(Boolean);

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
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
              Assigned Projects
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Review and evaluate your assigned submissions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '250px' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)', pointerEvents: 'none', zIndex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text"
                placeholder="Search projects or teams..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="hz-input"
                style={{ width: '100%', padding: '0.75rem 1.25rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'var(--hz-text)', outline: 'none' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <select 
                value={hackathonFilter}
                onChange={e => setHackathonFilter(e.target.value)}
                className="hz-input"
                style={{ padding: '0.75rem 2.5rem 0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'var(--hz-text)', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
              >
                <option value="" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>All Hackathons</option>
                {uniqueHackathons.map(h => (
                  <option key={h} value={h} style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>{h}</option>
                ))}
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--hz-text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            
            <div style={{ position: 'relative' }}>
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="hz-input"
                style={{ padding: '0.75rem 2.5rem 0.75rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', color: 'var(--hz-text)', outline: 'none', appearance: 'none', WebkitAppearance: 'none' }}
              >
                <option value="" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>All Statuses</option>
                <option value="Not Started" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Not Started</option>
                <option value="Pending" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Pending</option>
                <option value="In Progress" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>In Progress</option>
                <option value="Completed" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Completed</option>
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--hz-text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        
        {/* Metric Cards Row */}
        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>EVALUATED</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                {completedProjectsCount.toString().padStart(2, '0')} <span style={{ fontSize: '1.25rem', color: 'var(--hz-text-muted)', fontWeight: 600 }}>/ {projects.length}</span>
              </div>
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.1) 100%)', border: '1px solid rgba(245,158,11,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(239,68,68,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>DEADLINE</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                2 Days <span style={{ fontSize: '1.25rem', color: 'var(--hz-text-muted)', fontWeight: 600 }}>remaining</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SCORING AVG</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{avgScoreDisplay}</div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', margin: '-2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--hz-border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                  <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team</th>
                  <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hackathon</th>
                  <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted</th>
                  <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '5rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                      Loading assigned projects...
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                      <div style={{ width: '64px', height: '64px', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', color: 'var(--hz-text-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No projects found</h3>
                      <p style={{ margin: 0 }}>Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((p, index) => {
                     let badgeVariant = 'neutral';
                     let badgeColor = 'var(--hz-text)';
                     let badgeBg = 'var(--hz-bg)';
                     if (p.status === 'Completed') {
                       badgeVariant = 'success';
                       badgeColor = '#10b981';
                       badgeBg = 'rgba(16,185,129,0.1)';
                     }
                     else if (p.status === 'In Progress') {
                       badgeVariant = 'primary';
                       badgeColor = 'var(--hz-primary)';
                       badgeBg = 'rgba(99,102,241,0.1)';
                     }

                     return (
                      <tr key={p.id} style={{ 
                        borderBottom: index === filteredProjects.length - 1 ? 'none' : '1px solid var(--hz-border)', 
                        transition: 'background 0.2s' 
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--hz-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--hz-text)', fontSize: '1.1rem' }}>{p.title}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem', color: 'var(--hz-text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{p.teamName}</td>
                        <td style={{ padding: '1.5rem', color: 'var(--hz-text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{p.hackathon}</td>
                        <td style={{ padding: '1.5rem', color: 'var(--hz-text-muted)', fontSize: '0.95rem' }}>{p.submittedAt}</td>
                        <td style={{ padding: '1.5rem' }}>
                          <span style={{ 
                            display: 'inline-flex', alignItems: 'center', padding: '0.4rem 0.8rem', 
                            borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, 
                            color: badgeColor, background: badgeBg 
                          }}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                          <Button 
                            variant="primary"
                            onClick={() => navigate(`/judge/evaluate/${p.id}`)}
                            style={{ 
                              padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.9rem',
                              background: p.status === 'Completed' ? 'var(--hz-bg)' : 'var(--hz-primary)',
                              color: p.status === 'Completed' ? 'var(--hz-text)' : '#fff',
                              border: p.status === 'Completed' ? '1px solid var(--hz-border)' : 'none'
                            }}
                          >
                            {p.status === 'Completed' ? 'View Review' : 'Evaluate'}
                          </Button>
                        </td>
                      </tr>
                     );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && (
            <div style={{ padding: '1.5rem 0 0', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--hz-border)' }}>
              <span className="hz-text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </Button>
                <Button variant="outline" size="sm" style={{ padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
