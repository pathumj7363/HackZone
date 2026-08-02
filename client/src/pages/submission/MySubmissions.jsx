import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMySubmissionsApi } from '../../api/submission.api';
import { formatDate } from '../../utils/date';

// --- UI Helpers ---
const STATUS_STYLES = {
  submitted:    { bg: 'rgba(16,185,129,0.15)', text: '#10b981', border: '#10b981' },
  draft:        { bg: 'var(--hz-surface)',     text: 'var(--hz-text-secondary)', border: 'var(--hz-border)' },
  reviewed:     { bg: 'rgba(99,102,241,0.15)', text: '#6366f1', border: '#6366f1' },
  scored:       { bg: 'rgba(99,102,241,0.15)', text: '#6366f1', border: '#6366f1' },
  rejected:     { bg: 'rgba(239,68,68,0.15)',  text: '#ef4444', border: '#ef4444' },
  'under review': { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b' },
};

function StatusBadge({ status }) {
  const key = (status || 'submitted').toLowerCase();
  const styles = STATUS_STYLES[key] || STATUS_STYLES['submitted'];
  return (
    <span style={{
      background: styles.bg,
      color: styles.text,
      border: `1px solid ${styles.border}`,
      padding: '0.4rem 1rem',
      borderRadius: '999px',
      fontSize: '0.8rem',
      fontWeight: '700',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }}>
      {status || 'Submitted'}
    </span>
  );
}

const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #4f46e5 0%, var(--hz-surface-raised) 100%)',
  'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #78350f 100%)',
  'linear-gradient(135deg, #ec4899 0%, #831843 100%)',
  'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
];

function ProjectIcon({ index }) {
  return (
    <div style={{
      width: '54px', height: '54px',
      borderRadius: '16px',
      background: PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    </div>
  );
}

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterOpen, setFilterOpen]   = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    getMySubmissionsApi()
      .then(data => {
        setSubmissions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load submissions", err);
        setSubmissions([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="hz-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hz-spinner hz-spinner--lg"></div>
      </div>
    );
  }

  return (
    <div className="hz-page" style={{ paddingBottom: '5rem' }}>
      {/* ── Dynamic Gradient Hero ── */}
      <div style={{
        position: 'relative', padding: '4rem 0', marginBottom: '3rem', overflow: 'hidden',
        borderBottom: '1px solid var(--hz-border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--hz-surface)', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-40%', right: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', left: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)' }}></div>
        </div>
        <div className="hz-container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              My Submissions
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '500px', margin: 0 }}>
              Track your hackathon projects, view judges' feedback, and manage your portfolio of innovation.
            </p>
          </div>
          <div>
            <button
              onClick={() => navigate('/submit')}
              style={{
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Submission
            </button>
          </div>
        </div>
      </div>

      <div className="hz-container">
        
        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
          
          {/* Active Filter Chip */}
          {selectedFilter !== 'All' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--hz-primary)', border: '1px solid var(--hz-primary)',
              color: '#fff', padding: '0.4rem 1rem', borderRadius: '999px',
              fontSize: '0.9rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(99,102,241,0.3)'
            }}>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {selectedFilter}
              </span>
              <button 
                onClick={() => setSelectedFilter('All')}
                style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                title="Clear Filter"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          )}

          <button
            onClick={() => setFilterOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: filterOpen ? 'var(--hz-primary-light)' : 'var(--hz-surface)', 
              border: `1px solid ${filterOpen || selectedFilter !== 'All' ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
              borderRadius: '12px', padding: '0.6rem 1.25rem',
              fontSize: '0.9rem', fontWeight: '600', color: filterOpen || selectedFilter !== 'All' ? 'var(--hz-primary)' : 'var(--hz-text)',
              cursor: 'pointer', transition: 'all 0.2s', boxShadow: 'var(--hz-shadow-sm)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
              <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
              <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line>
            </svg>
            Filter By Hackathon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: filterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {filterOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, zIndex: 10,
              background: 'var(--hz-surface)', border: '1px solid var(--hz-border)',
              borderRadius: '12px', padding: '0.5rem', minWidth: '220px',
              boxShadow: 'var(--hz-shadow-lg)', display: 'flex', flexDirection: 'column', gap: '0.25rem'
            }}>
              {['All', ...new Set(submissions.map(s => s.hackathonName || s.hackathon || (s.hackathonId ? `Hackathon #${s.hackathonId}` : 'Unknown')))].map(hName => (
                <button
                  key={hName}
                  onClick={() => { setSelectedFilter(hName); setFilterOpen(false); }}
                  style={{
                    background: selectedFilter === hName ? 'var(--hz-primary)' : 'transparent',
                    color: selectedFilter === hName ? '#fff' : 'var(--hz-text)',
                    border: 'none', padding: '0.6rem 1rem', borderRadius: '8px',
                    textAlign: 'left', fontSize: '0.9rem', fontWeight: selectedFilter === hName ? '700' : '500',
                    cursor: 'pointer', transition: 'background 0.2s',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}
                  onMouseEnter={e => { if (selectedFilter !== hName) e.currentTarget.style.background = 'var(--hz-bg)'; }}
                  onMouseLeave={e => { if (selectedFilter !== hName) e.currentTarget.style.background = 'transparent'; }}
                >
                  {hName}
                </button>
              ))}
            </div>
          )}
        </div>

        {submissions.length === 0 ? (
          /* ── Empty State ── */
          <div style={{
            background: 'var(--hz-surface)',
            border: '2px dashed var(--hz-border)',
            borderRadius: '24px',
            padding: '5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--hz-shadow-sm)'
          }}>
            <div style={{
              width: '100px', height: '100px', margin: '0 auto 2rem',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(16,185,129,0.1) 100%)',
              borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(99,102,241,0.2)'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <polyline points="9 15 12 12 15 15"></polyline>
              </svg>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--hz-text)', margin: '0 0 1rem' }}>
              No Submissions Yet
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-muted)', maxWidth: '450px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
              You haven't submitted any projects yet. Time to unleash your creativity and build something awesome!
            </p>
            <button onClick={() => navigate('/submit')} style={{
              background: 'var(--hz-primary)', color: '#fff', border: 'none',
              borderRadius: '12px', padding: '0.85rem 2.5rem',
              fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(99,102,241,0.4)', transition: 'all 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              Submit Your First Project
            </button>
          </div>
        ) : (
          /* ── Submissions List ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {(selectedFilter === 'All' ? submissions : submissions.filter(s => (s.hackathonName || s.hackathon || (s.hackathonId ? `Hackathon #${s.hackathonId}` : 'Unknown')) === selectedFilter)).map((s, i) => (
              <div key={s.id || i} style={{
                background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', borderRadius: '20px',
                padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'pointer',
                boxShadow: 'var(--hz-shadow-sm)'
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--hz-shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--hz-primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--hz-border)';
                }}
              >
                
                {/* Project Icon */}
                <div style={{ flexShrink: 0 }}>
                  <ProjectIcon index={i} />
                </div>

                {/* Project Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.title || 'Untitled Project'}
                    </h3>
                    <StatusBadge status={s.status} />
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)', margin: '0 0 0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.subtitle || s.description || 'No description provided.'}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.hackathonName || s.hackathon || (s.hackathonId ? `Hackathon #${s.hackathonId}` : '—')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-muted)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>
                        {s.updated || formatDate(s.submittedAt || s.created_at || s.createdAt || s.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div style={{ flexShrink: 0, paddingLeft: '1rem', borderLeft: '1px solid var(--hz-border)' }}>
                  <button style={{
                    background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', color: 'var(--hz-primary)', fontSize: '0.9rem', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.6rem 1.2rem', borderRadius: '10px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--hz-primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--hz-bg)'; e.currentTarget.style.color = 'var(--hz-primary)'; }}
                  >
                    View Details
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
