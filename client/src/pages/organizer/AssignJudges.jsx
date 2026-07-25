import React, { useState, useEffect } from 'react';
import './AssignJudges.css';
import { getMyHackathonsApi } from '../../api/hackathon.api';
import { getJudgesApi } from '../../api/user.api';
import { getHackathonSubmissionsApi } from '../../api/submission.api';
import { assignJudgeApi, unassignJudgeApi } from '../../api/evaluation.api';

export default function AssignJudges() {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  
  const [projects, setProjects] = useState([]);
  const [judges, setJudges] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // To assign a judge, we need to pick a project.
  const [selectedProjectMap, setSelectedProjectMap] = useState({});

  useEffect(() => {
    // Fetch hackathons and judges on mount
    Promise.all([
      getMyHackathonsApi(),
      getJudgesApi()
    ]).then(([hackathonsData, judgesData]) => {
      setHackathons(hackathonsData || []);
      setJudges(judgesData || []);
      if (hackathonsData && hackathonsData.length > 0) {
        setSelectedHackathonId(hackathonsData[0].id);
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedHackathonId) {
      loadProjects(selectedHackathonId);
    }
  }, [selectedHackathonId]);

  const loadProjects = async (hackathonId) => {
    try {
      const data = await getHackathonSubmissionsApi(hackathonId);
      setProjects(data || []);
    } catch(err) {
      console.error(err);
    }
  };

  const handleAssignJudge = async (judgeId) => {
    const projectId = selectedProjectMap[judgeId];
    if (!projectId) {
      alert('Please select a project to assign this judge to.');
      return;
    }
    
    try {
      await assignJudgeApi(judgeId, projectId, selectedHackathonId);
      await loadProjects(selectedHackathonId); // Reload to reflect changes
      alert('Judge assigned successfully!');
    } catch(err) {
      alert(err.error || 'Failed to assign judge');
    }
  };

  const handleRemoveJudge = async (projectId, judgeId) => {
    if(!window.confirm('Are you sure you want to remove this judge?')) return;
    try {
      await unassignJudgeApi(judgeId, projectId);
      await loadProjects(selectedHackathonId);
    } catch(err) {
      alert(err.error || 'Failed to remove judge');
    }
  };

  const totalAssigned = projects.reduce((acc, p) => acc + (p.assigned?.length || 0), 0);
  const unassignedCount = judges.length > 0 ? Math.max(0, judges.length - totalAssigned) : 0; // Simple estimation

  const filteredJudges = judges.filter(j => {
    const tags = j.expertiseTags ? (typeof j.expertiseTags === 'string' ? JSON.parse(j.expertiseTags) : j.expertiseTags) : [];
    return j.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="aj-container">
      {/* Header */}
      <div className="aj-header-row">
        <div>
          <h1 className="aj-title">Assign Judges</h1>
          <p className="aj-subtitle">Manage expert assignments for project evaluations.</p>
        </div>
        
        <div className="aj-stats-card">
          <div className="aj-stat-box">
            <div className="aj-stat-icon" style={{ color: '#4f46e5' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            </div>
            <div className="aj-stat-content">
              <span className="aj-stat-label">ASSIGNMENTS</span>
              <span className="aj-stat-value primary">{totalAssigned}</span>
            </div>
          </div>
          <div className="aj-stat-box">
            <div className="aj-stat-icon" style={{ color: '#0f172a' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </div>
            <div className="aj-stat-content">
              <span className="aj-stat-label">AVAILABLE JUDGES</span>
              <span className="aj-stat-value">{judges.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <select 
          className="aj-search-input" 
          value={selectedHackathonId} 
          onChange={(e) => setSelectedHackathonId(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          {hackathons.map(h => (
            <option key={h.id} value={h.id}>{h.title}</option>
          ))}
        </select>
      </div>

      {/* Main Grid */}
      <div className="aj-main-grid">
        
        {/* Left Column: Available Judges */}
        <div className="aj-card">
          <div className="aj-card-header">
            <h2 className="aj-card-title">Available Judges</h2>
            <div className="aj-search-wrap">
              <svg className="aj-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                className="aj-search-input" 
                placeholder="Search experts..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="aj-judge-list">
            {filteredJudges.map(judge => {
              const tags = judge.expertiseTags ? (typeof judge.expertiseTags === 'string' ? JSON.parse(judge.expertiseTags) : judge.expertiseTags) : [];
              const initials = judge.name ? judge.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '?';

              return (
              <div key={judge.id} className="aj-judge-item">
                <div className="aj-judge-top">
                  <div className="aj-judge-info">
                    {judge.img ? (
                      <img src={judge.img} alt={judge.name} className="aj-avatar" />
                    ) : (
                      <div className="aj-avatar" style={{ background: '#e0e7ff' }}>{initials}</div>
                    )}
                    <div>
                      <h3 className="aj-judge-name">{judge.name}</h3>
                      <p className="aj-judge-role">{judge.occupation || 'Judge'}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <select 
                      className="aj-search-input" 
                      style={{ padding: '0.25rem', fontSize: '0.8rem' }}
                      value={selectedProjectMap[judge.id] || ''}
                      onChange={(e) => setSelectedProjectMap({...selectedProjectMap, [judge.id]: e.target.value})}
                    >
                      <option value="">Select Project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                    <button className="aj-btn-outline" onClick={() => handleAssignJudge(judge.id)}>Assign</button>
                  </div>
                </div>
                <div className="aj-tags">
                  {tags.map(tag => (
                    <span key={tag} className="aj-tag">{tag}</span>
                  ))}
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Right Column: Current Assignments */}
        <div className="aj-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="aj-card-header">
            <h2 className="aj-card-title">Current Assignments</h2>
          </div>
          
          <div className="aj-projects-wrap" style={{ flex: 1 }}>
            {projects.length === 0 && <p className="aj-empty-text" style={{padding: '2rem'}}>No projects submitted yet.</p>}
            
            {projects.map(project => (
              <div key={project.id} className="aj-project-section">
                <div className="aj-project-header">
                  <div className="aj-project-title-wrap">
                    <span className="aj-project-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </span>
                    <h3 className="aj-project-title">{project.title}</h3>
                  </div>
                  {project.assigned && project.assigned.length > 0 ? (
                    <span className="aj-project-badge assigned">{project.assigned.length} Judges Assigned</span>
                  ) : (
                    <span className="aj-project-badge unassigned">No Judges Assigned</span>
                  )}
                </div>

                {project.assigned && project.assigned.length > 0 ? (
                  <div className="aj-assigned-grid">
                    {project.assigned.map(judge => (
                      <div key={judge.id} className="aj-assigned-judge">
                        <div className="aj-assigned-judge-info">
                          {judge.img ? (
                            <img src={judge.img} alt={judge.name} className="aj-avatar small" />
                          ) : (
                            <div className="aj-avatar small" style={{ background: '#e0e7ff' }}>{judge.initials}</div>
                          )}
                          <span className="aj-assigned-judge-name">{judge.name}</span>
                        </div>
                        <button className="aj-remove-btn" onClick={() => handleRemoveJudge(project.id, judge.id)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aj-empty-dropzone">
                    <div className="aj-empty-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                    </div>
                    <p className="aj-empty-text">No judges assigned yet.</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
