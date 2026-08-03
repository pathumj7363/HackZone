import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { getOrganizerStatsApi, getMyHackathonsApi } from '../../api/hackathon.api';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState(''); // '' means All Hackathons
  
  const [stats, setStats] = useState({
    totalTeams: 0,
    totalSubmissions: 0,
    activeJudges: 0,
    pendingReviews: 0,
    recentActivity: []
  });
  
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch hackathons on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    getMyHackathonsApi()
      .then(data => {
        setHackathons(Array.isArray(data) ? data : (data?.data || []));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fetch stats whenever selectedHackathonId changes
  useEffect(() => {
    setStatsLoading(true);
    getOrganizerStatsApi(selectedHackathonId || null)
      .then(data => {
        if (data) setStats(data);
        setStatsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setStatsLoading(false);
      });
  }, [selectedHackathonId]);

  // Generate Chart Data
  const chartData = stats.submissionsOverTime || [];
  let chartPath = "M 0,200 L 1000,200"; // Default flat line if no data
  let fillPath = "M 0,200 L 1000,200 Z";
  let chartLabels = [];
  
  if (chartData.length > 0) {
    const maxCount = Math.max(...chartData.map(d => d.count), 1); // Avoid div by zero
    
    // Create points
    const points = chartData.map((d, i) => {
      const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 1000 : 500;
      const y = 200 - (d.count / maxCount) * 150; // Scale between 200 (bottom) and 50 (top)
      return { x, y, label: d.date };
    });
    
    if (points.length === 1) {
      // If only one data point, draw a flat line across the middle
      chartPath = `M 0,${points[0].y} L 1000,${points[0].y}`;
      fillPath = `M 0,200 L 0,${points[0].y} L 1000,${points[0].y} L 1000,200 Z`;
      chartLabels = [points[0].label];
    } else {
      // Generate a smooth curve or polyline. We'll use straight lines for accuracy.
      const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
      chartPath = d;
      fillPath = `${d} L 1000,200 L 0,200 Z`;
      chartLabels = points.map(p => p.label);
    }
  } else {
    // Mock chart data if absolutely empty (or could just show flat)
    chartLabels = ['No Data'];
  }

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem' }}>
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
              Organizer Dashboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Manage your events, analyze real-time performance, and guide participants to success.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <Button onClick={() => navigate('/organizer/hackathon')} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--hz-primary)', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '0.85rem 1.5rem',
              fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)', transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Create New Hackathon
            </Button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--hz-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', paddingLeft: '0.5rem' }}>View Analytics For:</span>
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
                <option value="" style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)' }}>All Hackathons</option>
                {!loading && hackathons.map(h => (
                  <option key={h.id} value={h.id} style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)' }}>{h.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="hz-container">
        {/* Top KPI Row */}
        <div className="row g-4" style={{ marginBottom: '2.5rem' }}>
          {/* TEAMS */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)', 
              border: '1px solid rgba(99,102,241,0.2)', 
              borderRadius: '20px', 
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 8px 16px rgba(99,102,241,0.25)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1, marginBottom: '0.25rem' }}>{statsLoading ? '-' : stats.totalTeams}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Teams</div>
              </div>
            </div>
          </div>

          {/* SUBMISSIONS */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.05) 100%)', 
              border: '1px solid rgba(16,185,129,0.2)', 
              borderRadius: '20px', 
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 8px 16px rgba(16,185,129,0.25)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1, marginBottom: '0.25rem' }}>{statsLoading ? '-' : stats.totalSubmissions}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Projects</div>
              </div>
            </div>
          </div>

          {/* JUDGES */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(96,165,250,0.05) 100%)', 
              border: '1px solid rgba(59,130,246,0.2)', 
              borderRadius: '20px', 
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 8px 16px rgba(59,130,246,0.25)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 13.5V16.5l-4-4-4 4v-3L10 9.5Z"></path><path d="M22 10.5V13.5l-4-4-4 4v-3L18 6.5Z" style={{ transform: "translate(-3px, 1px) rotate(45deg)", transformOrigin: "center" }}></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1, marginBottom: '0.25rem' }}>{statsLoading ? '-' : stats.activeJudges}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Judges</div>
              </div>
            </div>
          </div>

          {/* PENDING REVIEWS */}
          <div className="col-12 col-sm-6 col-lg-3">
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(248,113,113,0.05) 100%)', 
              border: '1px solid rgba(239,68,68,0.2)', 
              borderRadius: '20px', 
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 8px 16px rgba(239,68,68,0.25)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444', lineHeight: 1, marginBottom: '0.25rem' }}>{statsLoading ? '-' : stats.pendingReviews}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pending Reviews</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="row g-4">
          {/* Left Column (Primary Content) */}
          <div className="col-12 col-lg-8" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Submissions Over Time Chart */}
            <section style={{ 
              background: 'var(--hz-surface)', 
              borderRadius: '24px', 
              border: '1px solid var(--hz-border)',
              overflow: 'hidden',
              boxShadow: 'var(--hz-shadow-sm)'
            }}>
              <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--hz-text)' }}>Submissions Over Time</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--hz-primary)', boxShadow: '0 0 8px var(--hz-primary)' }}></span>
                  Submissions
                </div>
              </div>
              <div style={{ height: '300px', width: '100%', position: 'relative', padding: '1.5rem' }}>
                {/* Modern Sleek Chart Area */}
                <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="var(--hz-border)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="var(--hz-border)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="var(--hz-border)" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="0" y1="200" x2="1000" y2="200" stroke="var(--hz-border)" strokeWidth="1" strokeDasharray="5,5" />

                  {/* Gradient Fill under line */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--hz-primary)" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="var(--hz-primary)" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Dynamic line and fill for chart */}
                  <path d={fillPath} fill="url(#chartGradient)" />
                  <path d={chartPath} fill="none" stroke="var(--hz-primary)" strokeWidth="4" strokeLinecap="round" />
                </svg>
                {/* X Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--hz-text-muted)', fontSize: '0.85rem', fontWeight: '500' }}>
                  {chartLabels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section style={{ 
              background: 'var(--hz-surface)', 
              borderRadius: '24px', 
              border: '1px solid var(--hz-border)',
              padding: '1.5rem',
              boxShadow: 'var(--hz-shadow-sm)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 1.5rem 0', color: 'var(--hz-text)' }}>Recent Activity</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {statsLoading ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                    <div style={{ width: '24px', height: '24px', border: '2px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    Loading activity...
                  </div>
                ) : stats.recentActivity && stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity) => (
                    <div key={activity.id} style={{ 
                      display: 'flex', gap: '1rem', padding: '1.25rem', 
                      background: 'var(--hz-bg)', borderRadius: '16px', 
                      border: '1px solid var(--hz-border)',
                      transition: 'transform 0.2s, box-shadow 0.2s' 
                    }} onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
                    }} onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'var(--hz-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--hz-primary)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                          <polyline points="14 2 14 8 20 8"></polyline>
                          <line x1="16" y1="13" x2="8" y2="13"></line>
                          <line x1="16" y1="17" x2="8" y2="17"></line>
                          <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ color: 'var(--hz-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '700' }}>{activity.teamName || 'Unknown Team'}</span> submitted a project: <span style={{ color: 'var(--hz-primary)', fontWeight: '600' }}>{activity.title}</span>
                        </div>
                        <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {new Date(activity.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', background: 'var(--hz-bg)', borderRadius: '16px', border: '1px dashed var(--hz-border)' }}>
                    <p style={{ color: 'var(--hz-text-muted)', margin: 0, fontSize: '0.9rem' }}>No recent activity to display.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Secondary / Feed) */}
          <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Quick Actions Widget */}
            <section style={{ 
              background: 'var(--hz-surface)', 
              borderRadius: '24px', 
              border: '1px solid var(--hz-border)',
              padding: '1.5rem',
              boxShadow: 'var(--hz-shadow-sm)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 1.25rem 0', color: 'var(--hz-text)' }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Manage Hackathon */}
                <Link to="/organizer/hackathon" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '16px', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', color: 'var(--hz-text)' }}>Manage Events</span>
                  </div>
                </Link>

                {/* Manage Submissions */}
                <Link to="/organizer/submissions" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '16px', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', color: 'var(--hz-text)' }}>Submissions</span>
                  </div>
                </Link>

                {/* Assign Judges */}
                <Link to="/organizer/judges" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '16px', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', color: 'var(--hz-text)' }}>Assign Judges</span>
                  </div>
                </Link>

                {/* Send Announcement */}
                <Link to="/organizer/announce" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '16px', padding: '1.25rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.transform = 'none'; }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', textAlign: 'center', color: 'var(--hz-text)' }}>Announcements</span>
                  </div>
                </Link>
              </div>
            </section>

            {/* Support CTA */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--hz-primary) 0%, #8b5cf6 100%)', 
              borderRadius: '24px', 
              padding: '2.5rem 1.5rem', 
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 12px 32px rgba(99,102,241,0.2)'
            }}>
              {/* Decorative blobs */}
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: 'white' }}>Need Help?</h3>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5 }}>Our support team is available 24/7 to help you manage your events.</p>
                <button style={{ 
                  background: 'var(--hz-surface)', 
                  color: 'var(--hz-primary)', 
                  border: 'none', 
                  padding: '0.8rem 1.5rem', 
                  borderRadius: '12px', 
                  fontWeight: '700', 
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s',
                  width: '100%'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                  Contact Support
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Global Style for Spin Animation (if not present) */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
