import React, { useState, useEffect } from 'react';
import { getMyHackathonsApi } from '../../api/hackathon.api';
export default function AssignJudges() {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hackathons on mount
    getMyHackathonsApi().then((data) => {
      const hackathonsData = Array.isArray(data) ? data : (data?.data || []);
      setHackathons(hackathonsData);
      if (hackathonsData.length > 0) {
        setSelectedHackathonId(hackathonsData[0].id);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const selectedHackathon = hackathons.find(h => h.id === selectedHackathonId);
  let judges = selectedHackathon?.judges || [];
  if (typeof judges === 'string') {
    try { judges = JSON.parse(judges); } catch(e) { judges = []; }
  }
  if (!Array.isArray(judges)) judges = [];

  judges = judges.map(j => {
    if (!j) return null;
    if (typeof j === 'string') {
      return { id: j, name: 'Unknown Judge', email: '', evaluationAreas: [] };
    }
    let evalAreas = j.evaluationAreas;
    if (typeof evalAreas === 'string') {
      try { evalAreas = JSON.parse(evalAreas); } catch(e) { evalAreas = [evalAreas]; }
    }
    if (!Array.isArray(evalAreas)) evalAreas = [];
    return { ...j, evaluationAreas: evalAreas };
  }).filter(Boolean);

  const safeString = (val) => (val != null ? String(val).toLowerCase() : '');
  const lowerSearch = searchTerm.toLowerCase();

  const filteredJudges = judges.filter(j => {
    if (!j) return false;
    if (safeString(j.name).includes(lowerSearch)) return true;
    if (safeString(j.email).includes(lowerSearch)) return true;
    if (Array.isArray(j.evaluationAreas)) {
      if (j.evaluationAreas.some(area => safeString(area).includes(lowerSearch))) return true;
    }
    return false;
  });

  // Calculate KPIs
  const totalJudges = judges.length;
  
  const allAreas = new Set();
  judges.forEach(j => {
    if (j.evaluationAreas) {
      j.evaluationAreas.forEach(area => allAreas.add(area));
    }
  });
  const totalAreasCovered = allAreas.size;

  const judgesWithoutAreas = judges.filter(j => !j.evaluationAreas || j.evaluationAreas.length === 0).length;

  const getAvatarClass = (index) => {
    const mod = index % 3;
    if (mod === 1) return 'aj-judge-avatar-alt';
    if (mod === 2) return 'aj-judge-avatar-alt2';
    return '';
  };

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem', background: 'var(--hz-bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              Assigned Judges
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Monitor and manage the expert panel for your events.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '250px' }}>
              <select
                value={selectedHackathonId}
                onChange={(e) => setSelectedHackathonId(e.target.value)}
                className="hz-input"
                style={{
                  padding: '0.75rem 2.5rem 0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  color: 'var(--hz-text)',
                  outline: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.2s',
                  appearance: 'none',
                  WebkitAppearance: 'none'
                }}
              >
                <option value="" disabled style={{ color: '#f8fafc', backgroundColor: '#1e293b' }}>Select Hackathon...</option>
                {hackathons.map(h => (
                  <option key={h.id} value={h.id} style={{ color: '#f8fafc', backgroundColor: '#1e293b' }}>{h.title}</option>
                ))}
                {hackathons.length === 0 && !loading && (
                   <option value="" style={{ color: '#f8fafc', backgroundColor: '#1e293b' }}>No events found</option>
                )}
              </select>
              <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            Loading your hackathon data...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* KPI Row */}
            <div className="row g-4">
              {/* KPI 1 */}
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Experts</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{totalJudges}</div>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Evaluation Domains</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{totalAreasCovered}</div>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="col-12 col-md-4">
                <div style={{ padding: '2rem', borderRadius: '24px', background: judgesWithoutAreas > 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.1) 100%)' : 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(37,99,235,0.1) 100%)', border: judgesWithoutAreas > 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(59,130,246,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: judgesWithoutAreas > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: judgesWithoutAreas > 0 ? '#f59e0b' : '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pending Area Assignment</span>
                    {judgesWithoutAreas > 0 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    )}
                  </div>
                  <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{judgesWithoutAreas}</div>
                </div>
              </div>
            </div>

            {/* Judges List Section */}
            <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              
              {/* Toolbar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--hz-border)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  Panel Members
                  <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700' }}>{filteredJudges.length} Active</span>
                </h2>
                
                <div style={{ position: 'relative', width: '100%', maxWidth: '350px' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)', pointerEvents: 'none' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search by name, email, or area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hz-input"
                    style={{ width: '100%', padding: '0.75rem 1.25rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="row g-4">
                {filteredJudges.length === 0 ? (
                  <div className="col-12">
                    <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', borderRadius: '24px' }}>
                      <div style={{ width: '64px', height: '64px', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                      </div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No judges found</h3>
                      <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1.1rem' }}>{judges.length === 0 ? 'No experts have been invited to this hackathon yet.' : 'No judges match your current search criteria.'}</p>
                    </div>
                  </div>
                ) : (
                  filteredJudges.map((judge, index) => {
                    const initials = judge.name 
                      ? String(judge.name).split(' ').slice(0, 2).map(n => n && n[0] ? n[0] : '').join('').toUpperCase() 
                      : '?';
                    const areas = judge.evaluationAreas || [];
                    
                    const bgGradient = index % 3 === 1 
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                      : index % 3 === 2 
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' 
                        : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';

                    return (
                      <div key={index} className="col-12 col-md-6 col-lg-4">
                        <div style={{
                          background: 'var(--hz-bg)',
                          borderRadius: '20px',
                          border: '1px solid var(--hz-border)',
                          padding: '1.5rem',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          cursor: 'default'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                          e.currentTarget.style.borderColor = 'var(--hz-primary)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = 'var(--hz-border)';
                        }}>
                          
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: bgGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', flexShrink: 0, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                              {initials}
                            </div>
                            <div style={{ overflow: 'hidden' }}>
                              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--hz-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{judge.name || 'Unnamed Judge'}</h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--hz-text-muted)', fontSize: '0.85rem' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{judge.email}</span>
                              </div>
                            </div>
                          </div>

                          <div style={{ marginTop: 'auto' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--hz-text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Assigned Domains</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                              {areas.length > 0 ? (
                                areas.map(area => (
                                  <span key={area} style={{ background: 'var(--hz-surface)', color: 'var(--hz-text)', border: '1px solid var(--hz-border)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                    {area}
                                  </span>
                                ))
                              ) : (
                                <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                  Needs Review
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
