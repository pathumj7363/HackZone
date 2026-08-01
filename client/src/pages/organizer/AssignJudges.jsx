import React, { useState, useEffect } from 'react';
import './AssignJudges.css';
import { getMyHackathonsApi } from '../../api/hackathon.api';
import { getJudgesApi } from '../../api/user.api';
import { getHackathonSubmissionsApi } from '../../api/submission.api';
import { inviteJudgeApi, getHackathonInvitationsApi } from '../../api/invitation.api';
import { toast } from 'react-toastify';

export default function AssignJudges() {
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');

  const [projects, setProjects] = useState([]);
  const [judges, setJudges] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
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
      loadProjectsAndInvites(selectedHackathonId);
    } else {
      setProjects([]);
      setInvitations([]);
    }
  }, [selectedHackathonId]);

  const loadProjectsAndInvites = async (hackathonId) => {
    try {
      const [projectsData, invitesData] = await Promise.all([
        getHackathonSubmissionsApi(hackathonId),
        getHackathonInvitationsApi(hackathonId)
      ]);
      setProjects(projectsData || []);
      setInvitations(invitesData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteJudge = async (emailToInvite) => {
    if (!emailToInvite || !selectedHackathonId) {
      toast.error('Please enter an email and select a hackathon.');
      return;
    }

    try {
      await inviteJudgeApi(selectedHackathonId, emailToInvite);
      toast.success('Invitation sent successfully!');
      setInviteEmail('');
      await loadProjectsAndInvites(selectedHackathonId);
    } catch (err) {
      toast.error(err.response?.data?.error || err.error || 'Failed to send invitation');
    }
  };

  const totalAssigned = invitations.filter(i => i.status === 'accepted').length;
  const pendingCount = invitations.filter(i => i.status === 'pending').length;

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
              <span className="aj-stat-label">ACCEPTED JUDGES</span>
              <span className="aj-stat-value">{totalAssigned}</span>
            </div>
          </div>
          <div className="aj-stat-box">
            <div className="aj-stat-icon" style={{ color: '#f59e0b' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div className="aj-stat-content">
              <span className="aj-stat-label">PENDING INVITES</span>
              <span className="aj-stat-value" style={{ color: '#f59e0b' }}>{pendingCount}</span>
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
              const initials = judge.name ? judge.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';

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
                        <button className="aj-btn-outline" onClick={() => handleInviteJudge(judge.email)}>Send Invite</button>
                      </div>
                    </div>
                    <div className="aj-tags">
                      {tags.map(tag => (
                        <span key={tag} className="aj-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Sent Invitations */}
        <div className="aj-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="aj-card-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
            <h2 className="aj-card-title">Invite New Judge</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="email"
                className="aj-search-input"
                placeholder="Judge's email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                style={{ flex: 1 }}
              />
              <button className="aj-btn-outline" style={{ background: '#4f46e5', color: 'white', border: 'none' }} onClick={() => handleInviteJudge(inviteEmail)}>
                Invite
              </button>
            </div>
          </div>

          <div className="aj-card-header" style={{ marginTop: '1rem', borderTop: '1px solid var(--hz-border)', paddingTop: '1.5rem' }}>
            <h2 className="aj-card-title">Sent Invitations</h2>
          </div>

          <div className="aj-projects-wrap" style={{ flex: 1 }}>
            {invitations.length === 0 && <p className="aj-empty-text" style={{ padding: '2rem' }}>No invitations sent yet.</p>}

            {invitations.map(invite => (
              <div key={invite.id} className="aj-project-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 className="aj-project-title">{invite.judgeName || invite.email}</h3>
                  <div className="aj-project-meta">
                    <span>{invite.judgeRole || 'Email Invite'}</span>
                  </div>
                </div>
                <div>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    background: invite.status === 'accepted' ? '#10b98122' : invite.status === 'declined' ? '#ef444422' : '#f59e0b22',
                    color: invite.status === 'accepted' ? '#10b981' : invite.status === 'declined' ? '#ef4444' : '#f59e0b'
                  }}>
                    {invite.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
