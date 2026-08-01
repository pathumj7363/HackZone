import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../../api/evaluation.api';
import { Card, Badge, LoadingSpinner, PageHeader } from '../../components/ui';

export default function JudgeLeaderboard() {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We expect a route like /judge/leaderboard/:hackathonId
    // If not provided, default to '1' or prompt user to select
    const hId = hackathonId || '1'; 
    getLeaderboard(hId).then(data => {
      setLeaderboard(data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [hackathonId]);

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', background: 'var(--hz-bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="hz-text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--hz-text-muted)'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back to Dashboard
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
                Leaderboard
              </h1>
              <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', padding: '0.4rem 1.25rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '700' }}>
                Hackathon {hackathonId || '1'}
              </span>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Real-time rankings based on aggregated judge scores.
            </p>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
              Loading leaderboard data...
            </div>
          ) : leaderboard.length === 0 ? (
            <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
              <div style={{ width: '80px', height: '80px', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', color: 'var(--hz-text-secondary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '40px', height: '40px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No Rankings Yet</h3>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>No evaluations have been submitted for this hackathon yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto', margin: '-2rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--hz-border)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', width: '100px', textAlign: 'center' }}>Rank</th>
                    <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</th>
                    <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Average Score</th>
                    <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Evaluations</th>
                    <th style={{ padding: '1.5rem', fontWeight: 700, color: 'var(--hz-text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>My Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const hasScored = entry.hasScoredByMe === 1;
                    const isTopThree = index < 3;
                    
                    let rankIcon = null;
                    if (index === 0) rankIcon = <svg width="28" height="28" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
                    else if (index === 1) rankIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="#94a3b8" stroke="#94a3b8" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
                    else if (index === 2) rankIcon = <svg width="24" height="24" viewBox="0 0 24 24" fill="#b45309" stroke="#b45309" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;

                    return (
                      <tr 
                        key={entry.submissionId} 
                        style={{ 
                          borderBottom: index === leaderboard.length - 1 ? 'none' : '1px solid var(--hz-border)',
                          background: hasScored ? 'rgba(16,185,129,0.03)' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => {
                          if (!hasScored) e.currentTarget.style.background = 'var(--hz-bg)';
                          else e.currentTarget.style.background = 'rgba(16,185,129,0.08)';
                        }}
                        onMouseLeave={e => {
                          if (!hasScored) e.currentTarget.style.background = 'transparent';
                          else e.currentTarget.style.background = 'rgba(16,185,129,0.03)';
                        }}
                      >
                        <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {rankIcon ? (
                              rankIcon
                            ) : (
                              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--hz-text-muted)' }}>{index + 1}</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isTopThree ? 'rgba(99,102,241,0.1)' : 'var(--hz-bg)', border: `1px solid ${isTopThree ? 'rgba(99,102,241,0.3)' : 'var(--hz-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isTopThree ? 'var(--hz-primary)' : 'var(--hz-text-muted)'} strokeWidth="2.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                            </div>
                            <span style={{ fontWeight: 800, color: 'var(--hz-text)', fontSize: '1.1rem' }}>
                              Submission #{entry.submissionId}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.25rem', padding: '0.5rem 1rem', background: 'var(--hz-bg)', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--hz-primary)' }}>{Number(entry.averageScore).toFixed(1)}</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)' }}>/ 10</span>
                          </div>
                        </td>
                        <td style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--hz-text-secondary)', fontWeight: 600 }}>
                          {entry.totalEvaluations} {entry.totalEvaluations === 1 ? 'judge' : 'judges'}
                        </td>
                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                          {hasScored ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              Scored
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                              Needs Review
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
