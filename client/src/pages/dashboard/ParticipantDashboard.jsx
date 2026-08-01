import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getMyRegisteredHackathonsApi } from '../../api/hackathon.api';
import { getMySubmissionsApi } from '../../api/submission.api';
import { getAnnouncementsByHackathonApi } from '../../api/announcement.api';
import { toast } from 'react-toastify';

import { formatDate } from '../../utils/date';

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [registeredHackathons, setRegisteredHackathons] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);

  const loadData = () => {
    getMyRegisteredHackathonsApi()
      .then(data => {
        const hacks = Array.isArray(data) ? data : (data?.data || []);
        setRegisteredHackathons(hacks);
        if (hacks.length > 0) {
          setSelectedHackathonId(hacks[0].id);
        }
      })
      .catch(() => setRegisteredHackathons([]));

    getMySubmissionsApi()
      .then(data => setSubmissions(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => setSubmissions([]));
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedHackathonId) {
      setLoadingAnnouncements(true);
      getAnnouncementsByHackathonApi(selectedHackathonId)
        .then(data => {
          // Only show published announcements to participants
          const allAnnouncements = Array.isArray(data) ? data : (data?.data || []);
          setAnnouncements(allAnnouncements.filter(a => a.status === 'published' && (a.audience === 'all' || a.audience === 'participants')));
        })
        .catch(() => setAnnouncements([]))
        .finally(() => setLoadingAnnouncements(false));
    } else {
      setAnnouncements([]);
    }
  }, [selectedHackathonId]);



  // Derived KPI Stats
  const activeHackathonsCount = registeredHackathons.length;
  const submissionsCount = submissions.length;
  const newAnnouncementsCount = announcements.length; // Simplified for now

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', background: 'var(--hz-bg)' }}>
      {/* ── Dynamic Gradient Hero ── */}
      <div style={{
        position: 'relative', padding: '4rem 0', marginBottom: '3rem', overflow: 'hidden',
        borderBottom: '1px solid var(--hz-border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--hz-surface)', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-50%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        </div>
        <div className="hz-container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              Overview
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Welcome back, <span style={{ color: 'var(--hz-primary)', fontWeight: '700' }}>{user?.name || 'Participant'}</span>! Let's build something amazing.
            </p>
          </div>
          <Link to="/hackathons" style={{ textDecoration: 'none' }}>
            <button style={{
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Find Hackathons
            </button>
          </Link>
        </div>
      </div>

      <div className="hz-container">

        {/* Top KPIs - Bento Style */}
        <div className="row g-4" style={{ marginBottom: '2.5rem' }}>
          <div className="col-12 col-md-4">
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1, marginBottom: '0.25rem' }}>{activeHackathonsCount}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Hackathons</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1, marginBottom: '0.25rem' }}>{submissionsCount}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projects Submitted</div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.05) 100%)', 
              border: '1px solid rgba(245,158,11,0.2)', 
              borderRadius: '20px', 
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              backdropFilter: 'blur(10px)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'default'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, boxShadow: '0 8px 16px rgba(245,158,11,0.25)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1, marginBottom: '0.25rem' }}>{newAnnouncementsCount}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hackathon Updates</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="row g-4">
          
          {/* Left Column (Primary Content) */}
          <div className="col-12 col-lg-8" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* My Hackathons */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--hz-text)' }}>My Hackathons</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {registeredHackathons.length === 0 ? (
                  <div style={{ padding: '3rem', borderRadius: '20px', border: '1px dashed var(--hz-border)', textAlign: 'center', background: 'var(--hz-surface)' }}>
                    <EmptyState
                      title="No Hackathons Yet"
                      description="You haven't joined any hackathons. Explore the hackathons page to get started."
                    />
                  </div>
                ) : (
                  registeredHackathons.map(hackathon => (
                    <div key={hackathon.id} style={{ 
                      display: 'flex', 
                      background: 'var(--hz-surface)', 
                      borderRadius: '20px', 
                      overflow: 'hidden', 
                      border: '1px solid var(--hz-border)',
                      boxShadow: 'var(--hz-shadow-sm)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)';
                      e.currentTarget.style.borderColor = 'var(--hz-primary)';
                    }} onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)';
                      e.currentTarget.style.borderColor = 'var(--hz-border)';
                    }}>
                      {/* Image Thumbnail */}
                      <div style={{ 
                        width: '140px', 
                        background: `url(${hackathon.image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`,
                        position: 'relative'
                      }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, var(--hz-surface))' }}></div>
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: 'var(--hz-text)' }}>{hackathon.title || 'Untitled Hackathon'}</h3>
                          <Badge variant={
                            hackathon.registrationStatus === 'approved' ? 'success' :
                              hackathon.registrationStatus === 'rejected' ? 'danger' : 'warning'
                          } style={{ borderRadius: '8px', padding: '0.35rem 0.75rem', fontWeight: '600' }}>
                            {hackathon.registrationStatus === 'approved' ? 'Project Approved' :
                              hackathon.registrationStatus === 'rejected' ? 'Project Rejected' : 'Pending Approval'}
                          </Badge>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          {hackathon.teamName ? (
                            <span>Registered as team: <strong style={{ color: 'var(--hz-text)' }}>{hackathon.teamName}</strong></span>
                          ) : (
                            <span>Registered as: <strong style={{ color: 'var(--hz-text)' }}>Solo Participant</strong></span>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <Link to={`/hackathons/${hackathon.id}`} style={{ textDecoration: 'none' }}>
                            <Button variant="outline" style={{ borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: '600' }}>
                              View Details
                            </Button>
                          </Link>
                          {hackathon.registrationStatus === 'approved' && (
                            <Link to="/submit" style={{ textDecoration: 'none' }}>
                              <Button variant="primary" style={{ borderRadius: '10px', padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: '600', boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}>
                                Submit Project
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* My Submissions */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: 'var(--hz-text)' }}>Recent Submissions</h2>
                <Link to="/submissions" style={{ textDecoration: 'none', color: 'var(--hz-primary)', fontSize: '0.9rem', fontWeight: '600' }}>
                  View All &rarr;
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {submissions.length === 0 ? (
                  <div style={{ padding: '3rem', borderRadius: '20px', border: '1px dashed var(--hz-border)', textAlign: 'center', background: 'var(--hz-surface)' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hz-primary)' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><polyline points="9 15 12 12 15 15"></polyline></svg>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--hz-text)', marginBottom: '0.5rem' }}>No Submissions Yet</h3>
                    <p style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>You haven't submitted any projects. Time to build!</p>
                    <Link to="/submit" style={{ textDecoration: 'none' }}>
                      <Button variant="primary" style={{ borderRadius: '10px', padding: '0.5rem 1.25rem' }}>Submit Project</Button>
                    </Link>
                  </div>
                ) : (
                  submissions.map(sub => {
                    const dateString = formatDate(sub.created_at || sub.createdAt || sub.submittedAt || sub.submitted_at || sub.created_date);
                    return (
                      <div key={sub.id} style={{ 
                        background: 'var(--hz-surface)', 
                        border: '1px solid var(--hz-border)', 
                        borderRadius: '16px', 
                        padding: '1.5rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1.5rem',
                        transition: 'transform 0.2s',
                        cursor: 'default'
                      }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'var(--hz-text)' }}>{sub.title || 'Untitled Project'}</h4>
                            <Badge variant={sub.status === 'rejected' ? 'danger' : 'success'} style={{ borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                              {sub.status || 'Submitted'}
                            </Badge>
                          </div>
                          <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                              {dateString}
                            </span>
                            <span>•</span>
                            <span style={{ fontWeight: '500', color: 'var(--hz-text)' }}>{sub.hackathonName || sub.hackathonTitle || sub.hackathon || 'Hackathon'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          {sub.githubRepo && (
                            <a href={sub.githubRepo} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Button variant="outline" style={{ borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                GitHub
                              </Button>
                            </a>
                          )}
                          {sub.demoVideoUrl && (
                            <a href={sub.demoVideoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Button variant="outline" style={{ borderRadius: '8px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                                Demo
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>

          {/* Right Column (Secondary / Feed) */}
          <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Announcements Glassmorphic Widget */}
            <section style={{ 
              background: 'var(--hz-surface)', 
              borderRadius: '24px', 
              border: '1px solid var(--hz-border)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--hz-shadow-sm)'
            }}>
              <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--hz-border)', background: 'rgba(99,102,241,0.03)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: '0 0 1rem 0', color: 'var(--hz-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  Announcements
                </h2>
                <select 
                  value={selectedHackathonId} 
                  onChange={(e) => setSelectedHackathonId(e.target.value)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '12px', 
                    border: '1px solid var(--hz-border)', 
                    background: 'var(--hz-bg)', 
                    color: 'var(--hz-text)', 
                    width: '100%', 
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    appearance: 'none',
                    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem top 50%',
                    backgroundSize: '0.65rem auto'
                  }}
                >
                  {registeredHackathons.length === 0 && <option value="">No hackathons</option>}
                  {registeredHackathons.map(h => (
                    <option key={h.id} value={h.id}>{h.title || 'Untitled Hackathon'}</option>
                  ))}
                </select>
              </div>

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto' }}>
                {loadingAnnouncements ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                    <div style={{ width: '24px', height: '24px', border: '2px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                    Loading...
                  </div>
                ) : announcements.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--hz-text-muted)', margin: 0, fontSize: '0.9rem' }}>No announcements at this time. You're all caught up!</p>
                  </div>
                ) : (
                  announcements.map(ann => (
                    <div key={ann.id} style={{ 
                      padding: '1.25rem', 
                      background: 'var(--hz-bg)', 
                      borderRadius: '16px', 
                      border: '1px solid var(--hz-border)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Priority indicator line */}
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: ann.priority === 'high' ? '#ef4444' : 'var(--hz-primary)' }}></div>
                      
                      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: 'var(--hz-text)' }}>{ann.title}</h4>
                        {ann.priority === 'high' && (
                          <span style={{ fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>Important</span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', margin: '0 0 0.75rem 0', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                        {ann.content}
                      </p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '500' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {formatDate(ann.created_at)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Explore CTA Widget */}
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
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: '0 0 0.75rem 0', color: 'white' }}>Find Your Next Challenge</h3>
                <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.5 }}>Discover top-tier hackathons and collaborate with global talent.</p>
                <Link to="/hackathons" style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    background: 'white', 
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
                    Explore Events
                  </button>
                </Link>
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
