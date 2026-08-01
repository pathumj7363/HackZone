import React, { useState, useEffect } from 'react';
import './AssignJudges.css';
import { getMyHackathonsApi } from '../../api/hackathon.api';

export default function AssignJudges() {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch hackathons on mount
    getMyHackathonsApi().then((hackathonsData) => {
      setHackathons(hackathonsData || []);
      if (hackathonsData && hackathonsData.length > 0) {
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
    <div className="aj-container">
      {/* Header Area */}
      <div className="aj-header-area">
        <div className="aj-title-wrapper">
          <h1 className="aj-title">Assigned Judges</h1>
          <p className="aj-subtitle">Monitor and manage the expert panel for your events.</p>
        </div>

        <div className="aj-selector-wrapper">
          <label className="aj-selector-label">Select Hackathon</label>
          <select
            className="aj-hackathon-select"
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
          >
            {hackathons.map(h => (
              <option key={h.id} value={h.id}>{h.title}</option>
            ))}
            {hackathons.length === 0 && !loading && (
               <option value="">No events found</option>
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="aj-loader">
          <div className="aj-spinner"></div>
          <span>Loading your hackathon data...</span>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="aj-kpi-row">
            <div className="aj-kpi-card" style={{ '--kpi-color': '#6366f1', '--kpi-bg': 'rgba(99, 102, 241, 0.1)' }}>
              <div className="aj-kpi-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div className="aj-kpi-content">
                <span className="aj-kpi-value">{totalJudges}</span>
                <span className="aj-kpi-label">Total Experts</span>
              </div>
            </div>

            <div className="aj-kpi-card" style={{ '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16, 185, 129, 0.1)' }}>
              <div className="aj-kpi-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
              </div>
              <div className="aj-kpi-content">
                <span className="aj-kpi-value">{totalAreasCovered}</span>
                <span className="aj-kpi-label">Evaluation Domains</span>
              </div>
            </div>

            <div className="aj-kpi-card" style={{ '--kpi-color': judgesWithoutAreas > 0 ? '#f59e0b' : '#3b82f6', '--kpi-bg': judgesWithoutAreas > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
              <div className="aj-kpi-icon-wrapper">
                {judgesWithoutAreas > 0 ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                )}
              </div>
              <div className="aj-kpi-content">
                <span className="aj-kpi-value">{judgesWithoutAreas}</span>
                <span className="aj-kpi-label">Pending Area Assignment</span>
              </div>
            </div>
          </div>

          {/* Judges List Section */}
          <div className="aj-content-header">
            <h2 className="aj-content-title">
              Panel Members
              <span className="aj-content-badge">{filteredJudges.length} Active</span>
            </h2>
            
            <div className="aj-search-bar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input
                type="text"
                placeholder="Search by name, email, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="aj-judges-grid">
            {filteredJudges.length === 0 ? (
              <div className="aj-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                <p>{judges.length === 0 ? 'No experts have been invited to this hackathon yet.' : 'No judges match your current search criteria.'}</p>
              </div>
            ) : (
              filteredJudges.map((judge, index) => {
                const initials = judge.name 
                  ? judge.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() 
                  : '?';

                const areas = judge.evaluationAreas || [];

                return (
                  <div key={index} className="aj-judge-card">
                    <div className="aj-judge-header">
                      <div className={`aj-judge-avatar ${getAvatarClass(index)}`}>
                        {initials}
                      </div>
                      <div className="aj-judge-info">
                        <h3>{judge.name || 'Unnamed Judge'}</h3>
                        <p>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                          {judge.email}
                        </p>
                      </div>
                    </div>
                    <div className="aj-judge-body">
                      <div className="aj-areas-title">Assigned Domains</div>
                      <div className="aj-areas-list">
                        {areas.length > 0 ? (
                          areas.map(area => (
                            <span key={area} className="aj-area-pill">{area}</span>
                          ))
                        ) : (
                          <span className="aj-area-pill empty">Needs Review</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
