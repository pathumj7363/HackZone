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
  const [filter, setFilter] = useState('all'); // for proposals
  const [submissionFilter, setSubmissionFilter] = useState('all');

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFileUrl = (url, action) => {
    if (!url) return '#';
    if (url.startsWith('http')) return url;
    return `${backendUrl}${url.replace('/uploads/', `/api/files/${action}/`)}`;
  }; // for final submissions

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
    toast.info("Exporting CSV... (Mocked Action)");
  };

  const openRegistrationDetails = (registration) => {
    setSelectedRegistration(registration);
    setView('details');
  };

  const openSubmissionDetails = (submission) => {
    navigate(`/organizer/submission/${submission.id}`, { state: { submission } });
  };

  const filteredRegistrations = registrations.filter(r => {
    const name = r.regType === 'team' ? r.teamName : r.participantName;
    const matchesSearch = name?.toLowerCase().includes(search.toLowerCase()) || r.idea?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredSubmissions = submissions.filter(s => {
    const matchesSearch = s.title?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    
    // Determine evaluation status:
    // A submission is 'evaluated' if it has judges assigned and ALL of them have evaluated.
    // If no judges assigned, or some haven't evaluated, it's 'pending'.
    const hasAssignedJudges = s.assigned && s.assigned.length > 0;
    const isEvaluated = hasAssignedJudges && s.assigned.every(j => j.hasEvaluated);
    
    let matchesFilter = true;
    if (submissionFilter === 'evaluated') {
      matchesFilter = isEvaluated;
    } else if (submissionFilter === 'pending') {
      matchesFilter = !isEvaluated;
    }

    return matchesSearch && matchesFilter;
  });

  const handleUpdateStatus = async (registrationId, newStatus) => {
    try {
      await updateRegistrationStatusApi(selectedHackathonId, registrationId, newStatus);
      toast.success(`Registration ${newStatus} successfully!`);
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
      case 'approved': return <Badge style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>Approved</Badge>;
      case 'rejected': return <Badge style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>Rejected</Badge>;
      default: return <Badge style={{ backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>Pending</Badge>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown Date';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderListView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease' }}>

      {/* 2. Top KPI Cards */}
      <div className="row g-4">
        {/* KPI 1 */}
        <div className="col-12 col-md-4">
          <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Registrations</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : registrations.length}</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="col-12 col-md-4">
          <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Participants</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : registrations.reduce((acc, r) => acc + (r.regType === 'team' ? (Number(r.teamSize) || 1) : 1), 0)}</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="col-12 col-md-4">
          <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.1) 100%)', border: '1px solid rgba(245,158,11,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(239,68,68,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Final Submissions</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : submissions.length}</div>
          </div>
        </div>
      </div>

      {/* 3. Main Content List */}
      <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>

        {/* Toolbar & Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--hz-border)' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Pill Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem', background: 'var(--hz-bg)', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
              <button
                onClick={() => { setActiveTab('proposals'); setSearch(''); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: activeTab === 'proposals' ? 'var(--hz-primary)' : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: activeTab === 'proposals' ? '#fff' : 'var(--hz-text-muted)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeTab === 'proposals' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                }}
              >
                Registrations
              </button>
              <button
                onClick={() => { setActiveTab('submissions'); setSearch(''); }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: activeTab === 'submissions' ? 'var(--hz-primary)' : 'transparent',
                  border: 'none',
                  borderRadius: '12px',
                  color: activeTab === 'submissions' ? '#fff' : 'var(--hz-text-muted)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: activeTab === 'submissions' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                }}
              >
                Final Submissions
              </button>
            </div>


            <Button variant="outline" onClick={exportCSV} style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: '600', display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--hz-surface)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)', pointerEvents: 'none', zIndex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="hz-input"
                style={{ width: '100%', padding: '0.75rem 1.25rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none' }}
              />
            </div>

            {activeTab === 'proposals' && (
              <div style={{ position: 'relative', minWidth: '150px' }}>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="hz-input"
                  style={{
                    padding: '0.75rem 2.5rem 0.75rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--hz-border)',
                    backgroundColor: 'var(--hz-bg)',
                    fontWeight: '600',
                    color: 'var(--hz-text)',
                    outline: 'none',
                    width: '100%',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>All Statuses</option>
                  <option value="pending" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Pending</option>
                  <option value="approved" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Approved</option>
                  <option value="rejected" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Rejected</option>
                </select>
                <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div style={{ position: 'relative', minWidth: '180px' }}>
                <select
                  value={submissionFilter}
                  onChange={(e) => setSubmissionFilter(e.target.value)}
                  className="hz-input"
                  style={{
                    padding: '0.75rem 2.5rem 0.75rem 1.25rem',
                    borderRadius: '12px',
                    border: '1px solid var(--hz-border)',
                    backgroundColor: 'var(--hz-bg)',
                    fontWeight: '600',
                    color: 'var(--hz-text)',
                    outline: 'none',
                    width: '100%',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>All Submissions</option>
                  <option value="pending" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Pending Evaluation</option>
                  <option value="evaluated" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Evaluated</option>
                </select>
                <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            )}
          </div>
        </div>


        {/* Content Area */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            Loading data...
          </div>
        ) : activeTab === 'proposals' ? (
          filteredRegistrations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--hz-surface)', border: '1px dashed var(--hz-border)', borderRadius: '24px' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No registrations found</h3>
              <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1.1rem' }}>Adjust your filters or wait for more participants to join.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredRegistrations.map(reg => {
                const displayName = reg.regType === 'team' ? reg.teamName : reg.participantName;
                const sizeLabel = reg.regType === 'team' ? `${reg.teamSize} Members` : 'Solo';
                const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?';
                const bgGradient = reg.regType === 'team' ? 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)' : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                const textColor = reg.regType === 'team' ? '#3730a3' : '#374151';

                return (
                  <div
                    key={reg.id}
                    onClick={() => openRegistrationDetails(reg)}
                    style={{
                      borderRadius: '12px',
                      background: 'var(--hz-surface)',
                      border: '1px solid var(--hz-border)',
                      padding: '1rem 1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--hz-bg)';
                      e.currentTarget.style.borderColor = 'var(--hz-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--hz-surface)';
                      e.currentTarget.style.borderColor = 'var(--hz-border)';
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: bgGradient, color: textColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', flexShrink: 0 }}>
                      {avatarChar}
                    </div>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--hz-text)' }}>{displayName}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                        <span>{reg.regType.toUpperCase()} • {sizeLabel}</span>
                        <span>|</span>
                        <span>Submitted: {formatDate(reg.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(reg.status)}
                    </div>
                    <div style={{ color: 'var(--hz-text-muted)', display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          // Submissions Tab Content
          filteredSubmissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--hz-surface)', border: '1px dashed var(--hz-border)', borderRadius: '24px' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No submissions found</h3>
              <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1.1rem' }}>No final projects have been submitted yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredSubmissions.map(sub => {
                const displayName = sub.title;
                const submitterName = sub.teamId ? sub.teamName : sub.participantName;
                const typeLabel = sub.teamId ? 'TEAM' : 'SOLO';
                const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?';

                return (
                  <div
                    key={sub.id}
                    onClick={() => openSubmissionDetails(sub)}
                    style={{
                      borderRadius: '12px',
                      background: 'var(--hz-surface)',
                      border: '1px solid var(--hz-border)',
                      padding: '1rem 1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--hz-bg)';
                      e.currentTarget.style.borderColor = 'var(--hz-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--hz-surface)';
                      e.currentTarget.style.borderColor = 'var(--hz-border)';
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #dcfce7 0%, #a7f3d0 100%)', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800', flexShrink: 0 }}>
                      {avatarChar}
                    </div>
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0, color: 'var(--hz-text)' }}>{displayName}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                        <span>By {submitterName} ({typeLabel})</span>
                        <span>|</span>
                        <span>Submitted: {formatDate(sub.created_at)}</span>
                      </div>
                    </div>
                    <div>
                      <Badge style={{ background: (sub.assigned && sub.assigned.length > 0 && sub.assigned.every(j => j.hasEvaluated)) ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: (sub.assigned && sub.assigned.length > 0 && sub.assigned.every(j => j.hasEvaluated)) ? '#10b981' : '#f59e0b', border: `1px solid ${(sub.assigned && sub.assigned.length > 0 && sub.assigned.every(j => j.hasEvaluated)) ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
                        {(sub.assigned && sub.assigned.length > 0 && sub.assigned.every(j => j.hasEvaluated)) ? 'Evaluated' : 'Pending Evaluation'}
                      </Badge>
                    </div>
                    <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '0.85rem', gap: '0.5rem', marginLeft: '1rem' }}>
                      View Details <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

      </div>
    </div>
  );

  const renderDetailsView = () => {
    if (activeTab === 'proposals' && selectedRegistration) {
      const r = selectedRegistration;
      const displayName = r.regType === 'team' ? r.teamName : r.participantName;
      const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?';

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>


          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--hz-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--hz-border)' }}>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--hz-primary) 0%, #818cf8 100%)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}>
                      {avatarChar}
                    </div>
                    <div>
                      <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>{displayName}</h1>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Badge style={{ background: 'var(--hz-bg)', color: 'var(--hz-text)', border: '1px solid var(--hz-border)', fontSize: '0.9rem', padding: '0.3rem 0.75rem' }}>
                          {r.regType.toUpperCase()}
                        </Badge>
                        <span style={{ color: 'var(--hz-text-muted)', fontWeight: '500' }}>Registered on {formatDate(r.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</span>
                    {getStatusBadge(r.status)}
                  </div>
                </div>


                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Project Idea / Pitch
                  </h3>
                  <div style={{ background: 'var(--hz-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', color: 'var(--hz-text)', lineHeight: '1.7', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                    {r.idea || "No idea submitted."}
                  </div>
                </div>


                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Contact & Details
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: 'var(--hz-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>Primary Contact</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--hz-text)' }}>{r.participantName}</strong>
                      <div style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)', marginTop: '0.25rem' }}>{r.participantEmail}</div>
                    </div>
                    <div style={{ background: 'var(--hz-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
                      <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>Role & Experience</span>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--hz-text)', display: 'block' }}>{r.role || 'Not specified'}</strong>
                      <div style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)', marginTop: '0.25rem' }}>{r.experienceLevel || 'Not specified'}</div>
                    </div>
                    {r.githubUrl && (
                      <div style={{ background: 'var(--hz-bg)', padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
                        <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '0.25rem', fontWeight: '600' }}>Portfolio / GitHub</span>
                        <a href={r.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--hz-primary)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', wordBreak: 'break-all' }}>
                          View Profile
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--hz-text)' }}>Approval Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {r.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'approved')}
                      style={{ width: '100%', padding: '1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#059669'}
                      onMouseLeave={e => e.currentTarget.style.background = '#10b981'}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      Approve Registration
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'rejected')}
                      style={{ width: '100%', padding: '1rem', background: 'transparent', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '12px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Reject Registration
                    </button>
                  )}
                  {r.status !== 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(r.id, 'pending')}
                      style={{ width: '100%', padding: '1rem', background: 'var(--hz-bg)', color: 'var(--hz-text)', border: '1px solid var(--hz-border)', borderRadius: '12px', fontWeight: '600', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s', marginTop: '0.5rem' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--hz-surface-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--hz-bg)'}
                    >
                      Move to Pending
                    </button>
                  )}
                </div>
              </div>

              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.25rem', color: 'var(--hz-text)' }}>Attached Documents</h3>
                {r.proposalUrl ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a href={getFileUrl(r.proposalUrl, 'preview')} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--hz-text)', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
                      >
                        <div style={{ width: '40px', height: '40px', background: 'var(--hz-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.15rem' }}>Preview Document</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Open in new tab</span>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                      </div>
                    </a>
                    <a href={getFileUrl(r.proposalUrl, 'download')} download target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--hz-text)', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
                      >
                        <div style={{ width: '40px', height: '40px', background: 'var(--hz-surface)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <strong style={{ display: 'block', fontSize: '1rem', marginBottom: '0.15rem' }}>Download File</strong>
                          <span style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Save original file format</span>
                        </div>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </div>
                    </a>
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--hz-bg)', borderRadius: '16px', border: '1px dashed var(--hz-border)', color: 'var(--hz-text-muted)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.5rem auto' }}><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                    <p style={{ margin: 0, fontWeight: '500' }}>No document uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'submissions' && selectedSubmission) {
      const s = selectedSubmission;
      const submitterName = s.teamId ? s.teamName : s.participantName;
      const typeLabel = s.teamId ? 'TEAM' : 'SOLO';

      const parsedTechStack = typeof s.techStack === 'string' ? s.techStack.split(',').map(t => t.trim()).filter(Boolean) : (s.techStack || []);


      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>


          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', padding: '2.5rem', border: '1px solid var(--hz-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--hz-border)' }}>
                  <Badge style={{ background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', border: 'none', marginBottom: '1rem', fontWeight: '700', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    {typeLabel} PROJECT
                  </Badge>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '0 0 0.5rem 0', color: 'var(--hz-text)', letterSpacing: '-0.02em' }}>{s.title}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--hz-text-muted)', fontSize: '0.95rem', marginTop: '1rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--hz-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--hz-border)' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <span>Submitted by <strong style={{ color: 'var(--hz-text)' }}>{submitterName}</strong> on {formatDate(s.created_at)}</span>
                  </div>
                </div>


                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    Full Description
                  </h3>
                  <div style={{ background: 'var(--hz-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', color: 'var(--hz-text)', lineHeight: '1.7', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                    {s.description || "No detailed description provided."}
                  </div>
                </div>

                {s.notes && (
                  <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Additional Notes
                    </h3>
                    <div style={{ background: 'var(--hz-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', color: 'var(--hz-text)', lineHeight: '1.7', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                      {s.notes}
                    </div>
                  </div>
                )}


                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                    Technology Stack
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {parsedTechStack.length > 0 ? parsedTechStack.map((tech, idx) => (
                      <div key={idx} style={{ background: 'var(--hz-surface)', border: '2px solid var(--hz-border)', color: 'var(--hz-text)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                        {tech}
                      </div>
                    )) : <span style={{ color: 'var(--hz-text-muted)' }}>No technologies specified.</span>}
                  </div>
                </div>
              </div>
            </div>


            <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', padding: '2rem', border: '1px solid var(--hz-border)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Project Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {s.githubRepo ? (
                    <a href={s.githubRepo} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: '#24292e', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#fff', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#000'}
                        onMouseLeave={e => e.currentTarget.style.background = '#24292e'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                        Source Code
                      </div>
                    </a>
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--hz-bg)', borderRadius: '12px', color: 'var(--hz-text-muted)', textAlign: 'center', border: '1px dashed var(--hz-border)', fontSize: '0.9rem' }}>No Source Code</div>
                  )}

                  {s.demoVideoUrl ? (
                    <a href={s.demoVideoUrl} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: 'transparent', border: '2px solid #ec4899', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#ec4899', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fdf2f8'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
                        Watch Demo
                      </div>
                    </a>
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--hz-bg)', borderRadius: '12px', color: 'var(--hz-text-muted)', textAlign: 'center', border: '1px dashed var(--hz-border)', fontSize: '0.9rem' }}>No Video Demo</div>
                  )}

                  {s.fileUrl ? (
                    <a href={getFileUrl(s.fileUrl, 'download')} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <div
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#fff', fontWeight: '700', cursor: 'pointer', transition: 'opacity 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download Attachment
                      </div>
                    </a>
                  ) : (
                    <div style={{ padding: '1rem', background: 'var(--hz-bg)', borderRadius: '12px', color: 'var(--hz-text-muted)', textAlign: 'center', border: '1px dashed var(--hz-border)', fontSize: '0.9rem' }}>No Attachment</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="hz-page" style={{ paddingBottom: '4rem' }}>
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
              Registrations & Submissions
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Review hackathon proposals, approve participants, and judge final projects.
            </p>
          </div>
          {view === 'list' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
              <div style={{ position: 'relative', width: '250px' }}>
                <select
                  value={selectedHackathonId}
                  onChange={handleHackathonChange}
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
                  <option value="" disabled style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>Select Hackathon...</option>
                  {hackathons.map(h => (
                    <option key={h.id} value={h.id} style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>{h.title}</option>
                  ))}
                </select>
                <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
          )}
          {view === 'details' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  setView('list');
                  setSelectedRegistration(null);
                  setSelectedSubmission(null);
                }}
                style={{
                  background: 'var(--hz-surface)',
                  border: '1px solid var(--hz-border)',
                  cursor: 'pointer',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                  color: 'var(--hz-text)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = 'var(--hz-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = 'var(--hz-border)'; }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="hz-container">
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Content Router */}
        {view === 'list' && renderListView()}
        {view === 'details' && renderDetailsView()}


      </div>
    </div>
  );
}
