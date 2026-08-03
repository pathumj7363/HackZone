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
  const [sortBy, setSortBy] = useState('popularity');

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

  // Filter & Sort logic
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
  }).sort((a, b) => {
    if (sortBy === 'popularity') {
      const getCount = (h) => h.participantCount || parseInt(h.participants) || 0;
      return getCount(b) - getCount(a);
    } else if (sortBy === 'date_desc') {
      return new Date(b.startDate || b.created_at || 0) - new Date(a.startDate || a.created_at || 0);
    } else if (sortBy === 'date_asc') {
      return new Date(a.startDate || a.created_at || 0) - new Date(b.startDate || b.created_at || 0);
    }
    return 0;
  });

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
        <div className="hz-container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
            Discover Hackathons
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
            Find the perfect challenge, form a brilliant team, and build something extraordinary that pushes the boundaries of technology.
          </p>
        </div>
      </div>

      <div className="hz-container">
        {/* ── Search & Filter Command Bar ───────────────────────────────── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
          padding: '0.75rem',
          background: 'var(--hz-surface)',
          border: '1px solid var(--hz-border)',
          borderRadius: '16px',
          marginBottom: '3rem',
          boxShadow: 'var(--hz-shadow-sm)'
        }}>
          {/* Search */}
          <div style={{
            flex: '1 1 300px', display: 'flex', alignItems: 'center', gap: '0.75rem',
            background: 'var(--hz-bg)',
            borderRadius: '12px',
            padding: '0.6rem 1.25rem',
            border: '1px solid var(--hz-border)'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search hackathons by name, theme, or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none', boxShadow: 'none',
                width: '100%', fontSize: '0.95rem', color: 'var(--hz-text)'
              }}
              onFocus={e => e.target.style.outline = 'none'}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--hz-bg)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: activeFilter === f ? 'var(--hz-primary)' : 'transparent',
                    color: activeFilter === f ? '#fff' : 'var(--hz-text-secondary)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.4rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: activeFilter === f ? '0 2px 8px rgba(99,102,241,0.3)' : 'none'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '0.55rem 1.25rem', 
                borderRadius: '12px', 
                border: '1px solid var(--hz-border)', 
                backgroundColor: 'var(--hz-bg)', 
                color: 'var(--hz-text)', 
                outline: 'none',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem top 50%',
                backgroundSize: '0.65rem auto',
                boxShadow: 'var(--hz-shadow-sm)'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
            >
              <option value="popularity" style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)' }}>Popularity</option>
              <option value="date_desc" style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)' }}>Newest First</option>
              <option value="date_asc" style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)' }}>Oldest First</option>
            </select>
          </div>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner size="lg" centered label="Finding hackathons..." />
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 0', background: 'var(--hz-surface)', borderRadius: '24px', border: '1px dashed var(--hz-border)' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--hz-text)', marginBottom: '0.5rem' }}>No hackathons found</h3>
                <p className="hz-text-muted" style={{ fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
                  We couldn't find any hackathons matching your search criteria. Try adjusting your filters.
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
                    <div key={h.id} className="col-12 col-md-6 col-lg-4" style={{ display: 'flex' }}>
                      <div style={{
                        background: 'var(--hz-surface)',
                        border: '1px solid var(--hz-border)',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        width: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: 'var(--hz-shadow-sm)'
                      }}
                        onMouseEnter={e => { 
                          e.currentTarget.style.transform = 'translateY(-6px)'; 
                          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.08)';
                          e.currentTarget.style.borderColor = 'var(--hz-primary)';
                          const img = e.currentTarget.querySelector('.hack-img');
                          if (img) img.style.transform = 'scale(1.08)';
                        }}
                        onMouseLeave={e => { 
                          e.currentTarget.style.transform = 'none'; 
                          e.currentTarget.style.boxShadow = 'var(--hz-shadow-sm)'; 
                          e.currentTarget.style.borderColor = 'var(--hz-border)';
                          const img = e.currentTarget.querySelector('.hack-img');
                          if (img) img.style.transform = 'scale(1)';
                        }}
                      >
                        {/* Image Container */}
                        <div style={{ height: '200px', position: 'relative', background: 'var(--hz-surface-raised)', overflow: 'hidden' }}>
                          {!hasImgError ? (
                            <img
                              className="hack-img"
                              src={h.image ? (h.image.startsWith('http') ? h.image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${h.image}`) : 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                              alt={h.title}
                              onError={() => setImgErrors(p => ({ ...p, [h.id]: true }))}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            />
                          ) : (
                            /* Fallback gradient if image fails */
                            <div className="hack-img" style={{
                              width: '100%', height: '100%',
                              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                              background: ['linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
                                'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)',
                                'linear-gradient(135deg,#240b36,#c31432)',
                                'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
                                'linear-gradient(135deg,#093028,#237a57)',
                                'linear-gradient(135deg,#1a2980,#26d0ce)'][idx % 6]
                            }} />
                          )}

                          {/* Dark overlays for text readability */}
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)' }} />

                          {/* Status Badge (Glassmorphic) */}
                          <div style={{
                            position: 'absolute', top: '16px', right: '16px',
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            letterSpacing: '0.05em',
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.bg, display: 'inline-block', boxShadow: `0 0 6px ${sc.bg}` }}></span>
                            {sc.label}
                          </div>
                          
                          {/* Prize Overlay (Optional mock) */}
                          <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: 'white', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                             $10,000+ Prizes
                          </div>
                        </div>

                        {/* Card Body */}
                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: '800', color: 'var(--hz-text)', lineHeight: 1.3 }}>
                            {h.title}
                          </h3>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                            {/* Metadata items */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--hz-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--hz-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hz-primary)' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              </div>
                              <span style={{ color: 'var(--hz-text)' }}>{displayDateRange}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--hz-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--hz-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              </div>
                              <span style={{ color: 'var(--hz-text)' }}>{displayLocation}</span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--hz-text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--hz-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                              </div>
                              <span style={{ color: 'var(--hz-text)' }}>{h.participantCount || displayParticipants || '0 Participants'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div style={{
                          padding: '1.25rem 1.5rem',
                          borderTop: '1px solid var(--hz-border)',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          background: 'var(--hz-bg)'
                        }}>
                          <AvatarStack index={idx} extraLabel={h.avatarCount || '+12'} />
                          <Link to={`/hackathons/${h.id}`} style={{ textDecoration: 'none' }}>
                            <button style={{
                              background: 'var(--hz-primary)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '0.6rem 1.25rem',
                              fontSize: '0.85rem',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              boxShadow: '0 4px 12px rgba(99,102,241,0.25)'
                            }}
                              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                            >
                              Details
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
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
                <button style={{
                  background: 'var(--hz-surface)',
                  color: 'var(--hz-text)',
                  border: '1px solid var(--hz-border)',
                  borderRadius: '12px',
                  padding: '0.85rem 2rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.2s',
                  boxShadow: 'var(--hz-shadow-sm)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.color = 'var(--hz-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.color = 'var(--hz-text)'; e.currentTarget.style.transform = 'none'; }}
                >
                  Load more hackathons
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
