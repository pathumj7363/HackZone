import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHackathonsApi } from '../../api/hackathon.api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// ── Status config ──────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  'REGISTERING': { label: 'REGISTERING', bg: '#10b981', color: '#fff' },
  'IN PROGRESS': { label: 'IN PROGRESS', bg: 'var(--hz-primary)', color: '#fff' },
  'ENDED': { label: 'ENDED', bg: '#ef4444', color: '#fff' },
  'COMING SOON': { label: 'COMING SOON', bg: '#1f2937', color: '#fff' },
};

function getStatusConfig(status) {
  return STATUS_CONFIG[(status || '').toUpperCase()] || { label: status, bg: '#64748b', color: '#fff' };
}

// ── Avatar mock stack ──────────────────────────────────────────────────────
const AVATAR_COLORS = ['#3b82f6', '#64748b', '#b45309', '#10b981', '#8b5cf6'];
const AVATAR_INITIALS = [
  ['JD', 'AS'], ['MK', 'RL'], ['BH'], ['PT'], ['HZ'], ['DF', 'DS']
];

function AvatarStack({ index, extraLabel }) {
  const pairs = AVATAR_INITIALS[index % AVATAR_INITIALS.length];
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {pairs.map((init, i) => (
        <div key={i} style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: AVATAR_COLORS[(index + i) % AVATAR_COLORS.length],
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 'bold',
          border: '2px solid var(--hz-bg)',
          marginLeft: i === 0 ? 0 : '-8px',
          zIndex: pairs.length - i,
          position: 'relative'
        }}>
          {init}
        </div>
      ))}
      {extraLabel && (
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: '#e2e8f0', color: '#64748b',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '9px', fontWeight: 'bold',
          border: '2px solid var(--hz-bg)',
          marginLeft: '-8px',
          position: 'relative', zIndex: 0
        }}>
          {extraLabel}
        </div>
      )}
    </div>
  );
}

// ── Filter pills ────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Upcoming', 'Active', 'Ended'];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [imgErrors, setImgErrors] = useState({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    getHackathonsApi()
      .then(data => {
        // Guard: ensure we always store an array even if the response shape is unexpected
        setHackathons(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[HackathonList] Failed to fetch hackathons:', err);
        setHackathons([]);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filtered = hackathons.filter(h => {
    const matchSearch = !search ||
      h.title.toLowerCase().includes(search.toLowerCase()) ||
      (h.location || '').toLowerCase().includes(search.toLowerCase());
    const s = (h.status || '').toUpperCase();
    const matchFilter =
      activeFilter === 'All' ? true :
        activeFilter === 'Upcoming' ? s === 'COMING SOON' || s === 'REGISTERING' :
          activeFilter === 'Active' ? s === 'IN PROGRESS' :
            activeFilter === 'Ended' ? s === 'ENDED' : true;
    return matchSearch && matchFilter;
  });

  return (
    <div className="hz-page">
      <div className="hz-container">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div style={{ marginBottom: 'var(--hz-space-6)' }}>
          <h1 className="hz-heading-2" style={{ marginBottom: '0.4rem', fontWeight: 'var(--hz-font-weight-medium)' }}>
            Explore Hackathons
          </h1>
          <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-base)' }}>
            Discover the world's most innovative challenges and join global teams of builders.
          </p>
        </div>

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem 1rem',
          background: 'var(--hz-bg)',
          border: '1px solid var(--hz-border)',
          borderRadius: 'var(--hz-radius)',
          marginBottom: 'var(--hz-space-8)'
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--hz-surface)',
            borderRadius: 'var(--hz-radius-full)',
            padding: '0.5rem 1rem'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search hackathons, themes, or tech stacks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                width: '100%', fontSize: 'var(--hz-font-size-sm)', color: 'var(--hz-text)'
              }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: activeFilter === f ? 'var(--hz-primary)' : 'var(--hz-surface)',
                  color: activeFilter === f ? '#fff' : 'var(--hz-text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--hz-radius-full)',
                  padding: '0.45rem 1.1rem',
                  fontSize: 'var(--hz-font-size-sm)',
                  fontWeight: 'var(--hz-font-weight-medium)',
                  cursor: 'pointer',
                  transition: 'all var(--hz-transition)'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ marginLeft: 'auto' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              border: '1px solid var(--hz-border)', borderRadius: 'var(--hz-radius-sm)',
              padding: '0.45rem 0.75rem', fontSize: 'var(--hz-font-size-sm)',
              color: 'var(--hz-text)', cursor: 'pointer', background: 'var(--hz-bg)'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
              <span>Sort by: <strong>Popularity</strong></span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        {loading ? (
          <LoadingSpinner size="lg" centered label="Loading hackathons..." />
        ) : (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-base)' }}>
                  No hackathons found matching your search.
                </p>
              </div>
            ) : (
              <div className="row g-4">
                {filtered.map((h, idx) => {
                  const sc = getStatusConfig(h.status);
                  const hasImgError = imgErrors[h.id] || !h.image;
                  const displayDateRange = h.dateRange || (h.startDate && h.endDate ? `${formatDate(h.startDate)} - ${formatDate(h.endDate)}` : (formatDate(h.startDate) || 'Date TBA'));
                  const displayLocation = h.location || 'Virtual';
                  const displayParticipants = h.participants || '0 Participants';
                  return (
                    <div key={h.id} className="col-12 col-md-6 col-lg-4">
                      <div style={{
                        background: 'var(--hz-bg)',
                        border: '1px solid var(--hz-border)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        height: '100%',
                        transition: 'box-shadow var(--hz-transition), transform var(--hz-transition)'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--hz-shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
                      >
                        {/* Image */}
                        <div style={{ height: '180px', position: 'relative', background: '#1e293b', overflow: 'hidden' }}>
                          {!hasImgError ? (
                            <img
                              src={h.image}
                              alt={h.title}
                              onError={() => setImgErrors(p => ({ ...p, [h.id]: true }))}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          ) : (
                            /* Fallback gradient if image fails */
                            <div style={{
                              width: '100%', height: '100%',
                              background: ['linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
                                'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
                                'linear-gradient(135deg,#240b36,#c31432)',
                                'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
                                'linear-gradient(135deg,#093028,#237a57)',
                                'linear-gradient(135deg,#1a2980,#26d0ce)'][idx % 6]
                            }} />
                          )}

                          {/* Dark overlay */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 60%)'
                          }} />

                          {/* Status Badge */}
                          <div style={{
                            position: 'absolute', top: '12px', right: '12px',
                            background: sc.bg,
                            color: sc.color,
                            padding: '0.3rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 'var(--hz-font-weight-bold)',
                            letterSpacing: '0.06em',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
                          }}>
                            {sc.label}
                          </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: '1.125rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{
                            margin: '0 0 0.875rem',
                            fontSize: 'var(--hz-font-size-lg)',
                            fontWeight: 'var(--hz-font-weight-semibold)',
                            color: 'var(--hz-text)'
                          }}>
                            {h.title}
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                            {/* Date */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)', fontSize: 'var(--hz-font-size-sm)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              <span>{displayDateRange}</span>
                            </div>
                            {/* Location */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)', fontSize: 'var(--hz-font-size-sm)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                              </svg>
                              <span>{displayLocation}</span>
                            </div>
                            {/* Participants */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)', fontSize: 'var(--hz-font-size-sm)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                              <span>{displayParticipants}</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer */}
                        <div style={{
                          padding: '0.875rem 1.125rem',
                          borderTop: '1px solid var(--hz-border)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: 'var(--hz-bg)'
                        }}>
                          <AvatarStack index={idx} extraLabel={h.avatarCount} />
                          <Link to={`/hackathons/${h.id}`} style={{ textDecoration: 'none' }}>
                            <button style={{
                              background: 'var(--hz-primary)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 'var(--hz-radius-sm)',
                              padding: '0.4rem 1rem',
                              fontSize: 'var(--hz-font-size-sm)',
                              fontWeight: 'var(--hz-font-weight-medium)',
                              cursor: 'pointer',
                              transition: 'opacity var(--hz-transition)'
                            }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                              View details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Load More */}
            {filtered.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <button style={{
                  background: 'var(--hz-bg)',
                  color: 'var(--hz-text)',
                  border: '1px solid var(--hz-border)',
                  borderRadius: 'var(--hz-radius-sm)',
                  padding: '0.625rem 1.75rem',
                  fontSize: 'var(--hz-font-size-sm)',
                  fontWeight: 'var(--hz-font-weight-medium)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'border-color var(--hz-transition)'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
                >
                  Load more hackathons
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
