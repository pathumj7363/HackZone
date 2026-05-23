import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMySubmissionsApi } from '../../api/submission.api';

// ── Status badge styles ────────────────────────────────────────────────────
const STATUS_STYLES = {
  submitted:    { background: 'var(--hz-primary)', color: '#fff',                    border: 'none' },
  draft:        { background: 'transparent',        color: 'var(--hz-text-secondary)', border: '1.5px solid var(--hz-border)' },
  reviewed:     { background: 'transparent',        color: '#10b981',                 border: '1.5px solid #10b981' },
  scored:       { background: 'transparent',        color: '#10b981',                 border: '1.5px solid #10b981' },
  rejected:     { background: 'transparent',        color: '#ef4444',                 border: '1.5px solid #ef4444' },
  'under review': { background: 'transparent',      color: '#f59e0b',                 border: '1.5px solid #f59e0b' },
};

function StatusBadge({ status }) {
  const key = (status || 'submitted').toLowerCase();
  const styles = STATUS_STYLES[key] || STATUS_STYLES['submitted'];
  return (
    <span style={{
      ...styles,
      display: 'inline-block',
      padding: '0.3rem 0.85rem',
      borderRadius: '999px',
      fontSize: 'var(--hz-font-size-xs)',
      fontWeight: 'var(--hz-font-weight-semibold)',
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap'
    }}>
      {status || 'Submitted'}
    </span>
  );
}

// Project icon gradient per index
const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  'linear-gradient(135deg, #134e4a 0%, #0d9488 100%)',
  'linear-gradient(135deg, #3b0764 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
];

function ProjectIcon({ index }) {
  return (
    <div style={{
      width: '42px', height: '42px',
      borderRadius: '10px',
      background: PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length],
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
      </svg>
    </div>
  );
}

// ── Mock enriched data (supplements the API data) ──────────────────────────
const MOCK_EXTRA = [
  { id: 's1', title: 'Neural Knights',   subtitle: 'AI-driven security mesh',      hackathon: 'Global AI Innovate 2024', status: 'Submitted', updated: '2 days ago' },
  { id: 's2', title: 'Cyber Sentinels',  subtitle: 'Decentralized Auth Protocol',  hackathon: 'Web3 Future Build',        status: 'Draft',     updated: 'Oct 12, 2024' },
  { id: 's3', title: 'Eco-Pulse',        subtitle: 'Carbon tracking dashboard',    hackathon: 'GreenTech Hack',           status: 'Reviewed',  updated: '5 days ago' },
];

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterOpen, setFilterOpen]   = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    getMySubmissionsApi()
      .then(data => {
        // Merge API data with mock extras for a richer display
        const enriched = MOCK_EXTRA.map((extra, i) => {
          const api = data.find(d => d.id === extra.id) || {};
          return { ...extra, ...api, ...extra }; // extra takes display priority
        });
        setSubmissions(enriched.length ? enriched : MOCK_EXTRA);
        setLoading(false);
      })
      .catch(() => { setSubmissions(MOCK_EXTRA); setLoading(false); });
  }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="hz-page">
        <div className="hz-container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
          <div className="hz-spinner hz-spinner--lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hz-page">
      <div className="hz-container">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
          marginBottom: 'var(--hz-space-6)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: 'var(--hz-font-weight-bold)',
              color: 'var(--hz-text)',
              margin: '0 0 0.4rem',
              letterSpacing: '-0.02em'
            }}>
              My Submissions
            </h1>
            <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-base)' }}>
              Manage your project entries and track your progress across active hackathons.
            </p>
          </div>

          {/* Filter by hackathon */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setFilterOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                background: 'var(--hz-bg)',
                border: '1px solid var(--hz-border)',
                borderRadius: 'var(--hz-radius-sm)',
                padding: '0.5rem 1rem',
                fontSize: 'var(--hz-font-size-sm)',
                fontWeight: 'var(--hz-font-weight-medium)',
                color: 'var(--hz-text)',
                cursor: 'pointer',
                transition: 'border-color var(--hz-transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
            >
              Filter by hackathon
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="15" y1="12" x2="9" y2="12"></line>
                <line x1="11" y1="18" x2="13" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Submissions Table Card ───────────────────────────────────── */}
        <div style={{
          border: '1px solid var(--hz-border)',
          borderRadius: 'var(--hz-radius)',
          background: 'var(--hz-bg)',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          {/* Table header row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1.5fr 140px 140px 130px',
            padding: '0.75rem 1.25rem',
            background: 'var(--hz-surface)',
            borderBottom: '1px solid var(--hz-border)',
          }}>
            {['PROJECT', 'HACKATHON', 'STATUS', 'UPDATED', 'ACTIONS'].map((col, i) => (
              <div key={col} style={{
                fontSize: 'var(--hz-font-size-xs)',
                fontWeight: 'var(--hz-font-weight-bold)',
                color: 'var(--hz-text-muted)',
                letterSpacing: '0.08em',
                textAlign: i >= 4 ? 'right' : 'left'
              }}>
                {col}
              </div>
            ))}
          </div>

          {/* Table rows */}
          {submissions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)' }}>
                No submissions found.
              </p>
            </div>
          ) : (
            submissions.map((s, i) => (
              <div
                key={s.id || i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 140px 140px 130px',
                  padding: '1rem 1.25rem',
                  borderBottom: i < submissions.length - 1 ? '1px solid var(--hz-border)' : 'none',
                  alignItems: 'center',
                  transition: 'background var(--hz-transition)'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--hz-surface)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Project */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
                  <ProjectIcon index={i} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      margin: '0 0 0.15rem',
                      fontSize: 'var(--hz-font-size-sm)',
                      fontWeight: 'var(--hz-font-weight-bold)',
                      color: 'var(--hz-text)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {s.title || 'Untitled Project'}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: 'var(--hz-font-size-xs)',
                      color: 'var(--hz-text-muted)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                      {s.subtitle || s.description || ''}
                    </p>
                  </div>
                </div>

                {/* Hackathon */}
                <div style={{
                  fontSize: 'var(--hz-font-size-sm)',
                  color: 'var(--hz-text-secondary)',
                  fontWeight: 'var(--hz-font-weight-medium)',
                  paddingRight: '1rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                }}>
                  {s.hackathon || (s.hackathonId ? `Hackathon #${s.hackathonId}` : '—')}
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={s.status} />
                </div>

                {/* Updated */}
                <div style={{
                  fontSize: 'var(--hz-font-size-sm)',
                  color: 'var(--hz-text-muted)',
                }}>
                  {s.updated || (s.submittedAt ? new Date(s.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—')}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button style={{
                    background: 'transparent',
                    border: '1.5px solid var(--hz-border)',
                    borderRadius: 'var(--hz-radius-sm)',
                    padding: '0.35rem 0.875rem',
                    fontSize: 'var(--hz-font-size-sm)',
                    fontWeight: 'var(--hz-font-weight-medium)',
                    color: 'var(--hz-text)',
                    cursor: 'pointer',
                    transition: 'all var(--hz-transition)'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.color = 'var(--hz-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.color = 'var(--hz-text)'; }}
                  >
                    View
                  </button>
                  <button style={{
                    background: 'var(--hz-primary)',
                    border: '1.5px solid var(--hz-primary)',
                    borderRadius: 'var(--hz-radius-sm)',
                    padding: '0.35rem 0.875rem',
                    fontSize: 'var(--hz-font-size-sm)',
                    fontWeight: 'var(--hz-font-weight-medium)',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'opacity var(--hz-transition)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── CTA / Empty Prompt (dashed box) ─────────────────────────── */}
        <div style={{
          border: '2px dashed var(--hz-border)',
          borderRadius: 'var(--hz-radius)',
          padding: '3rem 2rem',
          textAlign: 'center',
          background: 'var(--hz-surface)'
        }}>
          {/* Illustration */}
          <div style={{
            width: '180px', height: '140px',
            margin: '0 auto 1.75rem',
            background: 'linear-gradient(145deg, #d1d5db 0%, #9ca3af 100%)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Monitor illustration */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <svg width="90" height="80" viewBox="0 0 90 80" fill="none">
                {/* Monitor body */}
                <rect x="10" y="8" width="70" height="48" rx="5" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                {/* Screen */}
                <rect x="16" y="14" width="58" height="36" rx="2" fill="#e5e7eb"/>
                {/* Stand */}
                <rect x="37" y="56" width="16" height="8" rx="2" fill="rgba(255,255,255,0.8)"/>
                <rect x="28" y="64" width="34" height="4" rx="2" fill="rgba(255,255,255,0.8)"/>
                {/* Paper airplane */}
                <path d="M60 20 L72 16 L68 28 Z" fill="rgba(99,102,241,0.8)" />
                <path d="M60 20 L68 28 L64 22 Z" fill="rgba(79,70,229,0.9)" />
              </svg>
            </div>
          </div>

          <h2 style={{
            fontSize: 'var(--hz-font-size-xl)',
            fontWeight: 'var(--hz-font-weight-bold)',
            color: 'var(--hz-text)',
            margin: '0 0 0.5rem'
          }}>
            Looking to start something new?
          </h2>
          <p className="hz-text-muted" style={{
            fontSize: 'var(--hz-font-size-sm)',
            maxWidth: '400px',
            margin: '0 auto 1.75rem',
            lineHeight: '1.6'
          }}>
            Your dashboard is currently empty. Explore active hackathons and start building your next innovation today.
          </p>

          <Link to="/submit" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--hz-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--hz-radius-sm)',
              padding: '0.75rem 2rem',
              fontSize: 'var(--hz-font-size-sm)',
              fontWeight: 'var(--hz-font-weight-semibold)',
              cursor: 'pointer',
              transition: 'opacity var(--hz-transition)'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.87'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Submit your first project
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
