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
    <div className="hz-page hz-container">
      <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="hz-text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Dashboard
      </a>

      <PageHeader 
        title={`Leaderboard - Hackathon ${hackathonId || '1'}`} 
        subtitle="Real-time rankings based on aggregated judge scores."
      />

      <Card padding style={{ border: '1px solid var(--hz-border)' }}>
        {loading ? (
          <div className="hz-spinner-wrap--centered"><LoadingSpinner size="lg" /></div>
        ) : leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p className="hz-text-muted">No evaluations have been submitted for this hackathon yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--hz-border)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--hz-text-secondary)' }}>Rank</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--hz-text-secondary)' }}>Project ID</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--hz-text-secondary)' }}>Average Score</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--hz-text-secondary)' }}>Evaluations</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--hz-text-secondary)' }}>My Status</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const hasScored = entry.hasScoredByMe === 1;
                  // If I have scored it, background is highlighted softly.
                  return (
                    <tr 
                      key={entry.submissionId} 
                      style={{ 
                        borderBottom: '1px solid var(--hz-border)',
                        background: hasScored ? 'var(--hz-primary-light)' : 'transparent',
                        transition: 'background 0.2s'
                      }}
                    >
                      <td style={{ padding: '1rem', fontWeight: 'bold', fontSize: '1.125rem', color: index < 3 ? 'var(--hz-primary)' : 'var(--hz-text)' }}>
                        #{index + 1}
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 500 }}>
                        Submission #{entry.submissionId}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{Number(entry.averageScore).toFixed(1)}</span> / 10
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--hz-text-muted)' }}>
                        {entry.totalEvaluations} judge(s)
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {hasScored ? (
                          <Badge variant="success">Scored</Badge>
                        ) : (
                          <Badge variant="warning">Needs My Review</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
