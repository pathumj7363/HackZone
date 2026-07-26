import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyHackathonsApi, getHackathonRegistrationsApi, updateRegistrationStatusApi } from '../../api/hackathon.api';
import { getHackathonSubmissionsApi } from '../../api/submission.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import { toast } from 'react-toastify';

export default function ManageSubmissions() {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // view: 'list' | 'details'
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('proposals'); // 'proposals' | 'submissions'
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Search and filter state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const data = await getMyHackathonsApi();
      setHackathons(data || []);
      if (data && data.length > 0) {
        setSelectedHackathonId(data[0].id);
        fetchData(data[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      setLoading(false);
    }
  };

  const fetchData = async (hackathonId) => {
    setLoading(true);
    try {
      const [regData, subData] = await Promise.all([
        getHackathonRegistrationsApi(hackathonId).catch(() => []),
        getHackathonSubmissionsApi(hackathonId).catch(() => [])
      ]);
      setRegistrations(regData || []);
      setSubmissions(subData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setRegistrations([]);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHackathonChange = (e) => {
    const id = e.target.value;
    setSelectedHackathonId(id);
    fetchData(id);
    setView('list');
  };

  const exportCSV = () => {
    alert("Exporting CSV... (Mocked Action)");
  };

  const openRegistrationDetails = (registration) => {
    setSelectedRegistration(registration);
    setView('details');
  };

  const openSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
    setView('details');
  };

  const filteredRegistrations = registrations.filter(r => {
    const name = r.regType === 'team' ? r.teamName : r.participantName;
    const matchesSearch = name?.toLowerCase().includes(search.toLowerCase()) || r.idea?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.projectName?.toLowerCase().includes(search.toLowerCase()) || s.tagline?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      await updateRegistrationStatusApi(selectedHackathonId, registrationId, newStatus);
      toast.success(`Registration ${newStatus} successfully!`);
      // Update local state
      const updated = registrations.map(r => r.id === registrationId ? { ...r, status: newStatus } : r);
      setRegistrations(updated);
      if (selectedRegistration && selectedRegistration.id === registrationId) {
        setSelectedRegistration({ ...selectedRegistration, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="warning">Pending</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown Date';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Views
  const renderListView = () => (
    <>
      {/* Top KPI Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>TOTAL REGISTRATIONS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : registrations.length}</div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>PARTICIPANTS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : registrations.reduce((acc, r) => acc + (r.regType === 'team' ? (Number(r.teamSize) || 1) : 1), 0)}</div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>FINAL SUBMISSIONS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>
                {loading ? '-' : submissions.length}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Toolbar */}
      <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', gap: '1rem' }}>
          <select 
            value={selectedHackathonId} 
            onChange={handleHackathonChange}
            className="hz-input"
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--hz-border)', minWidth: '250px' }}
          >
            {hackathons.map(h => (
              <option key={h.id} value={h.id}>{h.title}</option>
            ))}
          </select>
          <Input 
            type="text" 
            placeholder={`Search ${activeTab}...`} 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 0, padding: '0.6rem 1rem', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {activeTab === 'proposals' && (
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="hz-input"
              style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--hz-border)', minWidth: '150px' }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
          <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
        </div>
      </Card>

      {/* Modern Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--hz-border)', marginBottom: '1.5rem' }}>
        <button
          style={{
            padding: '1rem 2rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'proposals' ? '2px solid var(--hz-primary)' : '2px solid transparent',
            color: activeTab === 'proposals' ? 'var(--hz-primary)' : 'var(--hz-text-muted)',
            fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onClick={() => { setActiveTab('proposals'); setSearch(''); }}
        >
          Registrations & Proposals
        </button>
        <button
          style={{
            padding: '1rem 2rem', background: 'none', border: 'none',
            borderBottom: activeTab === 'submissions' ? '2px solid var(--hz-primary)' : '2px solid transparent',
            color: activeTab === 'submissions' ? 'var(--hz-primary)' : 'var(--hz-text-muted)',
            fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
          onClick={() => { setActiveTab('submissions'); setSearch(''); }}
        >
          Project Submissions
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hz-text-muted)' }}>Loading...</div>
      ) : activeTab === 'proposals' ? (
        filteredRegistrations.length === 0 ? (
          <Card padding style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No proposals found</h3>
            <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>No participants match your criteria.</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredRegistrations.map(reg => {
              const displayName = reg.regType === 'team' ? reg.teamName : reg.participantName;
              const sizeLabel = reg.regType === 'team' ? `${reg.teamSize} Members` : 'Solo';
              const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?';
              
              return (
                <Card key={reg.id} style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', cursor: 'pointer', ':hover': { borderColor: 'var(--hz-primary)' } }} onClick={() => openRegistrationDetails(reg)}>
                  <div style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {avatarChar}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--hz-text)' }}>
                          {displayName} <Badge variant={reg.regType === 'team' ? 'primary' : 'neutral'} style={{ marginLeft: '0.5rem' }}>{reg.regType.toUpperCase()}</Badge>
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                          <span>{sizeLabel}</span>
                          <span>•</span>
                          <span>Submitted: {formatDate(reg.createdAt)}</span>
                          {reg.proposalUrl && (
                            <>
                              <span>•</span>
                              <span style={{ color: 'var(--hz-primary)', fontWeight: 'bold' }}>📎 Proposal Attached</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '0 0 auto' }}>
                      {getStatusBadge(reg.status)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 0 auto', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openRegistrationDetails(reg); }}>View Details</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        // Submissions Tab Content
        filteredSubmissions.length === 0 ? (
          <Card padding style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No submissions found</h3>
            <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>No final projects have been submitted yet.</p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredSubmissions.map(sub => {
              const displayName = sub.projectName;
              const submitterName = sub.teamId ? sub.teamName : sub.participantName;
              const typeLabel = sub.teamId ? 'TEAM' : 'SOLO';
              const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?';
              
              return (
                <Card key={sub.id} style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', cursor: 'pointer', ':hover': { borderColor: 'var(--hz-primary)' } }} onClick={() => openSubmissionDetails(sub)}>
                  <div style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                        {avatarChar}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--hz-text)' }}>
                          {displayName} <Badge variant={sub.teamId ? 'primary' : 'neutral'} style={{ marginLeft: '0.5rem' }}>{typeLabel}</Badge>
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                          <span>By: {submitterName}</span>
                          <span>•</span>
                          <span>Submitted: {formatDate(sub.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 0 auto', justifyContent: 'flex-end' }}>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openSubmissionDetails(sub); }}>View Project</Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}
    </>
  );

  const renderDetailsView = () => {
    if (activeTab === 'proposals' && selectedRegistration) {
      const r = selectedRegistration;
      const displayName = r.regType === 'team' ? r.teamName : r.participantName;
      const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Button variant="ghost" onClick={() => { setView('list'); setSelectedRegistration(null); }} style={{ alignSelf: 'flex-start' }}>&larr; Back to Registrations</Button>
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                      {avatarChar}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{displayName}</h2>
                      <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>Registered as: <strong>{r.regType.toUpperCase()}</strong> on {formatDate(r.createdAt)}</p>
                    </div>
                  </div>
                  {getStatusBadge(r.status)}
                </div>
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Project Idea / Pitch</h3>
                <div style={{ backgroundColor: 'var(--hz-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--hz-border)', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--hz-text)', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {r.idea || "No idea submitted."}
                  </p>
                </div>
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact & Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--hz-border)' }}>
                    <span style={{ color: 'var(--hz-text-muted)' }}>Primary Contact</span>
                    <strong>{r.participantName} ({r.participantEmail})</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--hz-border)' }}>
                    <span style={{ color: 'var(--hz-text-muted)' }}>Role</span>
                    <strong>{r.role || 'Not specified'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--hz-border)' }}>
                    <span style={{ color: 'var(--hz-text-muted)' }}>Experience</span>
                    <strong>{r.experienceLevel || 'Not specified'}</strong>
                  </div>
                  {r.githubUrl && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--hz-border)' }}>
                      <span style={{ color: 'var(--hz-text-muted)' }}>GitHub / Portfolio</span>
                      <a href={r.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--hz-primary)', textDecoration: 'none', fontWeight: 'bold' }}>{r.githubUrl}</a>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Documents</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {r.proposalUrl ? (
                    <a href={r.proposalUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <Button variant="primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        View Proposal Document
                      </Button>
                    </a>
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'var(--hz-surface)', borderRadius: '8px', border: '1px solid var(--hz-border)', color: 'var(--hz-text-muted)' }}>
                      No document uploaded
                    </div>
                  )}
                </div>
              </Card>
              
              <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {r.status !== 'approved' && (
                    <Button variant="primary" style={{ backgroundColor: '#166534' }} onClick={() => handleUpdateStatus(r.id, 'approved')}>
                      Approve Registration
                    </Button>
                  )}
                  {r.status !== 'rejected' && (
                    <Button variant="outline" style={{ color: '#b91c1c', borderColor: '#fca5a5' }} onClick={() => handleUpdateStatus(r.id, 'rejected')}>
                      Reject Registration
                    </Button>
                  )}
                  {r.status !== 'pending' && (
                    <Button variant="ghost" onClick={() => handleUpdateStatus(r.id, 'pending')}>
                      Mark as Pending
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'submissions' && selectedSubmission) {
      const s = selectedSubmission;
      const submitterName = s.teamId ? s.teamName : s.participantName;
      const typeLabel = s.teamId ? 'TEAM' : 'SOLO';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Button variant="ghost" onClick={() => { setView('list'); setSelectedSubmission(null); }} style={{ alignSelf: 'flex-start' }}>&larr; Back to Submissions</Button>
          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{s.projectName}</h2>
                    <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--hz-text-muted)' }}>{s.tagline}</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                      Submitted by <strong>{submitterName}</strong> <Badge variant={s.teamId ? 'primary' : 'neutral'}>{typeLabel}</Badge> on {formatDate(s.createdAt)}
                    </p>
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Project Description</h3>
                <div style={{ backgroundColor: 'var(--hz-surface)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--hz-border)', marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--hz-text)', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                    {s.description || "No description provided."}
                  </p>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Tech Stack</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {s.techStack ? s.techStack.map((tech, idx) => (
                        <span key={idx} style={{ background: 'var(--hz-primary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          {tech}
                        </span>
                      )) : <span style={{ color: 'var(--hz-text-muted)' }}>None specified</span>}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Project Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {s.githubUrl && (
                    <a href={s.githubUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <Button variant="outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        GitHub Repository
                      </Button>
                    </a>
                  )}
                  {s.videoUrl && (
                    <a href={s.videoUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <Button variant="outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#db2777', borderColor: '#fbcfe8' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                        Demo Video
                      </Button>
                    </a>
                  )}
                  {s.liveUrl && (
                    <a href={s.liveUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <Button variant="outline" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#059669', borderColor: '#a7f3d0' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        Live Project
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hz-page" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="hz-container">
        {/* Page Header */}
        {view === 'list' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button type="button" onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--hz-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em', color: 'var(--hz-text)' }}>Registrations & Submissions</h1>
              <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1rem' }}>Review hackathon proposals and final project submissions.</p>
            </div>
          </div>
        )}

        {/* Content Router */}
        {view === 'list' && renderListView()}
        {view === 'details' && renderDetailsView()}
        
      </div>
    </div>
  );
}
