import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHackathonsApi } from '../../api/hackathon.api';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

// Utility for badge variant matching the design
const getStatusVariant = (status) => {
  switch (status.toUpperCase()) {
    case 'REGISTERING': return 'success';
    case 'IN PROGRESS': return 'primary';
    case 'ENDED': return 'danger';
    case 'COMING SOON': return 'neutral';
    default: return 'neutral';
  }
};

export default function HackathonList() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reset scroll on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getHackathonsApi().then(data => {
      setHackathons(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="hz-page">
      <div className="hz-container">
        
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--hz-space-6)' }}>
          <h1 className="hz-heading-2" style={{ marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>
            Explore Hackathons
          </h1>
          <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-base)' }}>
            Discover the world's most innovative challenges and join global teams of builders.
          </p>
        </div>

        {/* Filters Bar */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          gap: '1rem',
          padding: '0.75rem', 
          background: 'var(--hz-bg)', 
          border: '1px solid var(--hz-border)', 
          borderRadius: 'var(--hz-radius)', 
          marginBottom: 'var(--hz-space-8)'
        }}>
          {/* Search Input */}
          <div style={{ 
            flex: '1 1 300px', 
            position: 'relative', 
            display: 'flex', 
            alignItems: 'center',
            background: 'var(--hz-surface)',
            borderRadius: 'var(--hz-radius-full)',
            padding: '0.5rem 1rem'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search hackathons, themes, or tech stacks..." 
              style={{ 
                border: 'none', 
                background: 'transparent', 
                outline: 'none', 
                width: '100%', 
                fontSize: 'var(--hz-font-size-sm)',
                color: 'var(--hz-text)'
              }} 
            />
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button style={{ 
              background: 'var(--hz-primary)', 
              color: 'var(--hz-text-inverse)', 
              border: 'none', 
              borderRadius: 'var(--hz-radius-full)', 
              padding: '0.5rem 1.25rem', 
              fontSize: 'var(--hz-font-size-sm)', 
              fontWeight: 'var(--hz-font-weight-medium)',
              cursor: 'pointer'
            }}>All</button>
            <button style={{ 
              background: 'var(--hz-surface)', 
              color: 'var(--hz-text-secondary)', 
              border: 'none', 
              borderRadius: 'var(--hz-radius-full)', 
              padding: '0.5rem 1.25rem', 
              fontSize: 'var(--hz-font-size-sm)', 
              fontWeight: 'var(--hz-font-weight-medium)',
              cursor: 'pointer'
            }}>Upcoming</button>
            <button style={{ 
              background: 'var(--hz-surface)', 
              color: 'var(--hz-text-secondary)', 
              border: 'none', 
              borderRadius: 'var(--hz-radius-full)', 
              padding: '0.5rem 1.25rem', 
              fontSize: 'var(--hz-font-size-sm)', 
              fontWeight: 'var(--hz-font-weight-medium)',
              cursor: 'pointer'
            }}>Active</button>
            <button style={{ 
              background: 'var(--hz-surface)', 
              color: 'var(--hz-text-secondary)', 
              border: 'none', 
              borderRadius: 'var(--hz-radius-full)', 
              padding: '0.5rem 1.25rem', 
              fontSize: 'var(--hz-font-size-sm)', 
              fontWeight: 'var(--hz-font-weight-medium)',
              cursor: 'pointer'
            }}>Ended</button>
          </div>

          {/* Sort Dropdown */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid var(--hz-border)', 
              borderRadius: 'var(--hz-radius-sm)', 
              padding: '0.5rem 0.75rem',
              fontSize: 'var(--hz-font-size-sm)',
              color: 'var(--hz-text)',
              cursor: 'pointer',
              background: 'var(--hz-bg)'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', color: 'var(--hz-text-muted)' }}>
                <line x1="21" y1="10" x2="3" y2="10"></line>
                <line x1="21" y1="6" x2="3" y2="6"></line>
                <line x1="21" y1="14" x2="3" y2="14"></line>
                <line x1="21" y1="18" x2="3" y2="18"></line>
              </svg>
              <span>Sort by: <strong>Popularity</strong></span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem', color: 'var(--hz-text-muted)' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Hackathon Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <div className="hz-spinner hz-spinner--lg"></div>
          </div>
        ) : (
          <>
            <div className="row g-4">
              {hackathons.map(h => (
                <div key={h.id} className="col-12 col-md-6 col-lg-4">
                  <Card padding={false} hover className="d-flex flex-column h-100" style={{ overflow: 'hidden', borderRadius: '16px' }}>
                    
                    {/* Image Header */}
                    <div style={{ height: '180px', position: 'relative', background: 'var(--hz-surface)' }}>
                      <img 
                        src={h.image} 
                        alt={h.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      {/* Dark gradient overlay for text legibility if needed, but the design shows clear images. */}
                      <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 50%)'
                      }}></div>
                      
                      {/* Status Badge */}
                      <Badge 
                        variant={getStatusVariant(h.status)} 
                        style={{ 
                          position: 'absolute', 
                          top: '12px', 
                          right: '12px',
                          textTransform: 'uppercase',
                          fontWeight: 'var(--hz-font-weight-bold)',
                          letterSpacing: '0.05em',
                          padding: '0.35rem 0.75rem',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {h.status}
                      </Badge>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ 
                        margin: '0 0 1rem', 
                        fontSize: 'var(--hz-font-size-lg)', 
                        fontWeight: 'var(--hz-font-weight-medium)',
                        color: 'var(--hz-text)'
                      }}>
                        {h.title}
                      </h3>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: 'auto' }}>
                        {/* Date */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)', fontSize: 'var(--hz-font-size-sm)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>{h.dateRange}</span>
                        </div>
                        
                        {/* Location */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)', fontSize: 'var(--hz-font-size-sm)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{h.location}</span>
                        </div>
                        
                        {/* Participants */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-secondary)', fontSize: 'var(--hz-font-size-sm)' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                          </svg>
                          <span>{h.participants}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div style={{ 
                      padding: '1rem 1.25rem', 
                      borderTop: '1px solid var(--hz-border)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: '#ffffff'
                    }}>
                      
                      {/* Avatar Stack Mock */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid #fff', zIndex: 3 }}>
                          JD
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#64748b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid #fff', marginLeft: '-8px', zIndex: 2 }}>
                          AS
                        </div>
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#b45309', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', border: '2px solid #fff', marginLeft: '-8px', zIndex: 1 }}>
                          {h.avatarCount}
                        </div>
                      </div>
                      
                      <Link to={`/hackathons/${h.id}`} style={{ textDecoration: 'none' }}>
                        <Button variant="primary" style={{ padding: '0.4rem 1rem', fontSize: 'var(--hz-font-size-sm)' }}>
                          View details
                        </Button>
                      </Link>
                    </div>

                  </Card>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <Button variant="outline" style={{ padding: '0.625rem 1.5rem', background: '#ffffff' }}>
                Load more hackathons
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.5rem' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
