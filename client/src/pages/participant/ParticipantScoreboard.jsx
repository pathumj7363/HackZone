import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyRegisteredHackathonsApi, getScoreboardApi } from '../../api/hackathon.api';
import { getMySubmissionsApi } from '../../api/submission.api';
import useAuth from '../../hooks/useAuth';

export default function ParticipantScoreboard() {
  const { user } = useAuth();
  const location = useLocation();
  const queryHackathonId = new URLSearchParams(location.search).get('hackathonId');
  
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  
  const [scoreboardData, setScoreboardData] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    Promise.all([
      getMyRegisteredHackathonsApi(),
      getMySubmissionsApi()
    ])
      .then(([hackathonsData, submissionsData]) => {
        const hacks = Array.isArray(hackathonsData) ? hackathonsData : (hackathonsData?.data || []);
        const subs = Array.isArray(submissionsData) ? submissionsData : (submissionsData?.data || []);
        
        // Filter out hackathons where the user hasn't submitted a project
        const submittedHacks = hacks.filter(h => subs.some(sub => sub.hackathonId === h.id));
        
        setHackathons(submittedHacks);
        
        if (queryHackathonId && submittedHacks.some(h => h.id === queryHackathonId)) {
          setSelectedHackathonId(queryHackathonId);
        } else if (submittedHacks.length > 0) {
          setSelectedHackathonId(submittedHacks[0].id);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedHackathonId) return;
    
    setDataLoading(true);
    getScoreboardApi(selectedHackathonId)
      .then(res => {
        setScoreboardData(res.scoreboard || []);
        setIsPublished(res.isPublished || false);
        setDataLoading(false);
      })
      .catch(err => {
        console.error(err);
        // If not published, it might throw a 403, we can handle it gracefully.
        setIsPublished(false);
        setScoreboardData([]);
        setDataLoading(false);
      });
  }, [selectedHackathonId]);

  // Calculate user's specific KPIs
  let myPlace = '-';
  let myScore = 0;
  let totalScoreSum = 0;
  
  if (scoreboardData.length > 0) {
    scoreboardData.forEach(row => totalScoreSum += row.averageScore);
    const myRow = scoreboardData.find(row => row.userId === user?.id);
    if (myRow) {
      myPlace = myRow.place;
      myScore = myRow.averageScore;
    }
  }
  
  const averageCompetitionScore = scoreboardData.length > 0 ? Math.round(totalScoreSum / scoreboardData.length) : 0;

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      {/* ── Dynamic Gradient Hero ── */}
      <div style={{
        position: 'relative', padding: '4rem 0', marginBottom: '3rem', overflow: 'hidden',
        borderBottom: '1px solid var(--hz-border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--hz-surface)', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-50%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        </div>
        
        <div className="hz-container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              Final Scoreboard
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              See how you ranked against the competition once results are published.
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--hz-bg)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', paddingLeft: '0.5rem' }}>Select Hackathon:</span>
            <select 
              value={selectedHackathonId} 
              onChange={(e) => setSelectedHackathonId(e.target.value)}
              style={{
                padding: '0.5rem 2rem 0.5rem 1rem', 
                borderRadius: '8px', 
                border: 'none', 
                background: 'var(--hz-surface)', 
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
              {!loading && hackathons.map(h => (
                <option key={h.id} value={h.id}>{h.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="hz-container">
        {loading ? (
           <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
             <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
             Loading hackathons...
           </div>
        ) : !selectedHackathonId ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)' }}>
            <p className="hz-text-muted" style={{ margin: 0, fontSize: '1.1rem' }}>You haven't registered for any hackathons yet.</p>
          </div>
        ) : dataLoading ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hz-text-muted)' }}>
             <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
             Loading scoreboard...
           </div>
        ) : !isPublished ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--hz-surface)', borderRadius: '24px', border: '1px dashed var(--hz-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '0 0 1rem', color: 'var(--hz-text)' }}>Results Pending</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '500px' }}>
              The organizer has not published the results for this hackathon yet. Check back later!
            </p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="row g-4 mb-5">
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Place</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
                  </div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1, color: myPlace <= 3 ? '#f59e0b' : 'var(--hz-text)' }}>
                    {myPlace}
                    <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--hz-text-muted)', marginLeft: '0.25rem' }}>
                      / {scoreboardData.length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Score</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1, color: 'var(--hz-text)' }}>{myScore}</div>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Avg Competition Score</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <div style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: 1, color: 'var(--hz-text)' }}>{averageCompetitionScore}</div>
                </div>
              </div>
            </div>

            {/* Scoreboard Table */}
            <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              {scoreboardData.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', borderRadius: '16px' }}>
                  <p className="hz-text-muted" style={{ margin: 0 }}>No submissions found for this hackathon.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {scoreboardData.map((row) => {
                    const isMe = row.userId === user?.id;
                    return (
                      <div key={row.submissionId} style={{ 
                        display: 'flex', alignItems: 'center', padding: '1.25rem 2rem', 
                        background: isMe ? 'rgba(99,102,241,0.1)' : 'var(--hz-bg)', 
                        border: isMe ? '2px solid var(--hz-primary)' : '1px solid var(--hz-border)', 
                        borderRadius: '16px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {isMe && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--hz-primary)' }}></div>}
                        
                        <div style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                          <div style={{ 
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                            width: '44px', height: '44px', borderRadius: '50%', 
                            background: row.place === 1 ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : 
                                       row.place === 2 ? 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)' :
                                       row.place === 3 ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : 'var(--hz-surface)',
                            color: row.place <= 3 ? '#fff' : 'var(--hz-text-muted)',
                            fontWeight: '900', fontSize: '1.2rem',
                            border: row.place > 3 ? '1px solid var(--hz-border)' : 'none',
                            boxShadow: row.place <= 3 ? '0 4px 10px rgba(0,0,0,0.15)' : 'none'
                          }}>
                            {row.place}
                          </div>
                        </div>

                        <div style={{ flex: 1, paddingLeft: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: '800', color: 'var(--hz-text)' }}>{row.teamName}</h4>
                            {isMe && <span style={{ background: 'var(--hz-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>YOU</span>}
                          </div>
                          <div style={{ color: 'var(--hz-text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>Project: {row.title}</div>
                        </div>

                        <div style={{ textAlign: 'right', paddingLeft: '2rem' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Final Score</div>
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', justifyContent: 'flex-end' }}>
                            <span style={{ fontSize: '1.75rem', fontWeight: '900', color: row.place <= 3 ? '#f59e0b' : 'var(--hz-primary)' }}>{row.averageScore}</span>
                            <span style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)', fontWeight: '600' }}>/ 100</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
