import React, { useState, useEffect } from 'react';
import './AssignJudges.css';

// Exact mock data matching the design
const mockJudges = [
  { id: 'j1', name: 'Dr. Elena Vance', role: 'Senior AI Research Lead at TechGen', tags: ['AI/ML', 'Ethical Tech', 'Data Science'], initials: 'EV', img: 'https://i.pravatar.cc/150?u=vance' },
  { id: 'j2', name: 'Marcus Thorne', role: 'Product Director at FinStream', tags: ['Fintech', 'UX Design'], initials: 'MT', img: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 'j3', name: 'Sarah Jenkins', role: 'Cybersecurity Consultant', tags: ['Security', 'Blockchain', 'Web3'], initials: 'SJ', img: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'j4', name: 'David Tan', role: 'Cloud Architect at SaaSify', tags: ['Cloud Ops', 'Backend'], initials: 'DT', img: null },
];

const initialProjects = [
  {
    id: 'p1',
    title: 'Global AI Innovate 2024',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    assigned: [
      { id: 'a1', name: 'Dr. Aris Thorne', initials: 'AT', img: 'https://i.pravatar.cc/150?u=aris' },
      { id: 'a2', name: 'Julianna Vargos', initials: 'JV', img: 'https://i.pravatar.cc/150?u=juli' },
      { id: 'a3', name: 'Leo Watson', initials: 'LW', img: null },
      { id: 'a4', name: 'Maya Kapoor', initials: 'MK', img: null },
    ]
  },
  {
    id: 'p2',
    title: 'Neural Knights Project',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    assigned: [
      { id: 'a5', name: 'Robert Chen', initials: 'RC', img: 'https://i.pravatar.cc/150?u=robert' },
      { id: 'a6', name: 'Emily Ross', initials: 'ER', img: 'https://i.pravatar.cc/150?u=emily' },
    ]
  },
  {
    id: 'p3',
    title: 'FinTech Frontier Hack',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M12 2a7 7 0 0 0-7 7c0 2 1 3.9 2 5.5l.5.6c.3.3.5.7.5 1.1v2.8c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-2.8c0-.4.2-.8.5-1.1l.5-.6c1-1.6 2-3.5 2-5.5a7 7 0 0 0-7-7z"></path>
      </svg>
    ),
    assigned: []
  }
];

export default function AssignJudges() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate stats
  const totalAssigned = projects.reduce((acc, p) => acc + p.assigned.length, 0);
  // Using 3 unassigned as per design, though it doesn't dynamically calculate based on any specific "required judges" pool size, we'll hardcode 3 for the demo to match the image precisely.
  const unassignedCount = 3; 

  const handleRemoveJudge = (projectId, judgeId) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return { ...p, assigned: p.assigned.filter(j => j.id !== judgeId) };
      }
      return p;
    }));
  };

  const filteredJudges = mockJudges.filter(j => 
    j.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              <span className="aj-stat-label">ASSIGNED</span>
              <span className="aj-stat-value primary">{totalAssigned} Judges</span>
            </div>
          </div>
          <div className="aj-stat-box">
            <div className="aj-stat-icon" style={{ color: '#0f172a' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            </div>
            <div className="aj-stat-content">
              <span className="aj-stat-label">UNASSIGNED</span>
              <span className="aj-stat-value">{unassignedCount} Judges</span>
            </div>
          </div>
        </div>
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
            {filteredJudges.map(judge => (
              <div key={judge.id} className="aj-judge-item">
                <div className="aj-judge-top">
                  <div className="aj-judge-info">
                    {judge.img ? (
                      <img src={judge.img} alt={judge.name} className="aj-avatar" />
                    ) : (
                      <div className="aj-avatar" style={{ background: '#e0e7ff' }}>{judge.initials}</div>
                    )}
                    <div>
                      <h3 className="aj-judge-name">{judge.name}</h3>
                      <p className="aj-judge-role">{judge.role}</p>
                    </div>
                  </div>
                  <button className="aj-btn-outline">Assign</button>
                </div>
                <div className="aj-tags">
                  {judge.tags.map(tag => (
                    <span key={tag} className="aj-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Current Assignments */}
        <div className="aj-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="aj-card-header">
            <h2 className="aj-card-title">Current Assignments</h2>
          </div>
          
          <div className="aj-projects-wrap" style={{ flex: 1 }}>
            {projects.map(project => (
              <div key={project.id} className="aj-project-section">
                <div className="aj-project-header">
                  <div className="aj-project-title-wrap">
                    <span className="aj-project-icon">{project.icon}</span>
                    <h3 className="aj-project-title">{project.title}</h3>
                  </div>
                  {project.assigned.length > 0 ? (
                    <span className="aj-project-badge assigned">{project.assigned.length} Judges Assigned</span>
                  ) : (
                    <span className="aj-project-badge unassigned">No Judges Assigned</span>
                  )}
                </div>

                {project.assigned.length > 0 ? (
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
                    <p className="aj-empty-text">Drag a judge here or click 'Assign' from the list to start evaluating this project.</p>
                    <button className="aj-btn-outline" style={{ marginTop: '0.5rem' }}>Auto-Assign Recommended</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="aj-footer">
            <button className="aj-btn-ghost">Discard Changes</button>
            <button className="aj-btn-primary">Save Assignments</button>
          </div>
        </div>

      </div>
    </div>
  );
}
