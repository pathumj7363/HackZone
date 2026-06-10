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

  return (
    <div className="hz-page hz-container">
      <PageHeader 
        title="Assigned Projects" 
        subtitle="Review and evaluate your assigned submissions."
      />

      <Card padding style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'flex-end' }}>
          <Input 
            placeholder="Search projects or teams..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'%3E%3C/line%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: '10px center' }}
          />
          <Select 
            options={[
              { label: 'All Hackathons', value: '' },
              { label: 'Global AI Innovate 2024', value: 'Global AI Innovate 2024' },
              { label: 'FinTech Frontier Hack', value: 'FinTech Frontier Hack' }
            ]}
            value={hackathonFilter}
            onChange={e => setHackathonFilter(e.target.value)}
            style={{ minWidth: '200px' }}
          />
          <Select 
            options={[
              { label: 'All Statuses', value: '' },
              { label: 'Not Started', value: 'Not Started' },
              { label: 'Pending', value: 'Pending' },
              { label: 'In Progress', value: 'In Progress' },
              { label: 'Completed', value: 'Completed' }
            ]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ minWidth: '160px' }}
          />
        </div>
      </Card>

      <Card style={{ marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--hz-border)', background: 'var(--hz-surface)', fontSize: '0.75rem', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Project</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Team</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Hackathon</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Submitted</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                    <LoadingSpinner size="md" />
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map(p => {
                   let badgeVariant = 'neutral';
                   if (p.status === 'Completed') badgeVariant = 'success';
                   else if (p.status === 'In Progress') badgeVariant = 'primary';

                   return (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--hz-border)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--hz-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                          </div>
                          <span style={{ fontWeight: 600, color: 'var(--hz-text)' }}>{p.title}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--hz-text-secondary)', fontSize: '0.875rem' }}>{p.teamName}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--hz-text-secondary)', fontSize: '0.875rem' }}>{p.hackathon}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--hz-text-secondary)', fontSize: '0.875rem' }}>{p.submittedAt}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <Badge variant={badgeVariant}>{p.status}</Badge>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => navigate(`/judge/evaluate/${p.id}`)}
                          style={{ background: 'none', border: 'none', color: 'var(--hz-primary)', fontWeight: 500, cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                          Open
                        </button>
                      </td>
                    </tr>
                   );
                })
              )}
            </tbody>
          </table>
        </div>
        {!loading && (
          <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--hz-border)', background: 'var(--hz-surface-raised)' }}>
            <span className="hz-text-muted" style={{ fontSize: '0.875rem' }}>
              Showing {filteredProjects.length} of {projects.length} projects
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="outline" size="sm" style={{ padding: '0.25rem 0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </Button>
              <Button variant="outline" size="sm" style={{ padding: '0.25rem 0.5rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>EVALUATED</p>
            <h2 className="hz-heading-2" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              {completedProjectsCount.toString().padStart(2, '0')} <span style={{ fontSize: '1rem', color: 'var(--hz-text-muted)', fontWeight: 400 }}>/ {projects.length}</span>
            </h2>
          </div>
          <div style={{ color: 'var(--hz-primary)' }}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
        </Card>

        <Card padding style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="hz-label" style={{ marginBottom: '0.25rem' }}>DEADLINE</p>
            <h2 className="hz-heading-2" style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              2 Days <span style={{ fontSize: '1rem', color: 'var(--hz-text-muted)', fontWeight: 400 }}>remaining</span>
            </h2>
          </div>
          <div style={{ color: 'var(--hz-warning)' }}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
        </Card>

        <Card padding style={{ background: 'var(--hz-primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)' }}>SCORING AVG</p>
            <h2 className="hz-heading-2" style={{ color: 'white', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              {avgScoreDisplay}
            </h2>
          </div>
          <div style={{ color: 'white' }}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          </div>
        </Card>
      </div>
    </div>
  );
}
