import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Announcements.css';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import TextArea from '../../components/ui/TextArea';
import { getMyHackathonsApi } from '../../api/hackathon.api';
import { 
  createAnnouncementApi, 
  getAnnouncementsByHackathonApi, 
  updateAnnouncementApi, 
  deleteAnnouncementApi 
} from '../../api/announcement.api';

export default function Announcements() {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  
  const [announcements, setAnnouncements] = useState([]);
  const [loadingHackathons, setLoadingHackathons] = useState(true);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // view: 'list' | 'form'
  const [view, setView] = useState('list');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  
  // Search and filter state
  const [search, setSearch] = useState('');
  const [filterAudience, setFilterAudience] = useState('all');

  // Form state
  const initialForm = {
    title: '',
    content: '',
    audience: 'all',
    priority: 'normal',
    status: 'published'
  };
  const [formData, setFormData] = useState(initialForm);

  // Error/Success state (simple custom toast logic)
  const [message, setMessage] = useState({ text: '', type: '' });

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getMyHackathonsApi().then(data => {
      setHackathons(data || []);
      if (data && data.length > 0) {
        setSelectedHackathonId(data[0].id);
      }
      setLoadingHackathons(false);
    }).catch(err => {
      console.error('Failed to load hackathons', err);
      setLoadingHackathons(false);
    });
  }, []);

  useEffect(() => {
    if (selectedHackathonId) {
      fetchAnnouncements(selectedHackathonId);
    } else {
      setAnnouncements([]);
    }
  }, [selectedHackathonId]);

  const fetchAnnouncements = async (hackId) => {
    setLoadingAnnouncements(true);
    try {
      const data = await getAnnouncementsByHackathonApi(hackId);
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
      showMessage('Failed to load announcements', 'error');
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === 'delete') {
        await deleteAnnouncementApi(id);
        showMessage('Announcement deleted');
      } else {
        const status = action === 'publish' ? 'published' : 'draft';
        await updateAnnouncementApi(id, { status });
        showMessage(`Announcement ${status}`);
      }
      fetchAnnouncements(selectedHackathonId);
    } catch (err) {
      console.error(err);
      showMessage('Action failed', 'error');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (selectedAnnouncement) {
        await updateAnnouncementApi(selectedAnnouncement.id, formData);
        showMessage('Announcement updated');
      } else {
        await createAnnouncementApi({ ...formData, hackathonId: selectedHackathonId });
        showMessage('Announcement created');
      }
      setView('list');
      fetchAnnouncements(selectedHackathonId);
    } catch (err) {
      console.error(err);
      showMessage('Failed to save announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openForm = (announcement = null) => {
    if (!selectedHackathonId) {
      showMessage('Please select a hackathon first', 'error');
      return;
    }
    setSelectedAnnouncement(announcement);
    if (announcement) {
      setFormData({
        title: announcement.title,
        content: announcement.content,
        audience: announcement.audience,
        priority: announcement.priority,
        status: announcement.status
      });
    } else {
      setFormData(initialForm);
    }
    setView('form');
  };

  const safeString = (val) => (val != null ? String(val).toLowerCase() : '');
  const lowerSearch = search.toLowerCase();

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = safeString(a.title).includes(lowerSearch) || safeString(a.content).includes(lowerSearch);
    const matchesFilter = filterAudience === 'all' || a.audience === filterAudience;
    return matchesSearch && matchesFilter;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return <Badge variant="danger" style={{ fontWeight: '600' }}>High Priority</Badge>;
      case 'normal': return <Badge variant="primary" style={{ fontWeight: '600' }}>Normal</Badge>;
      case 'low': return <Badge variant="neutral" style={{ fontWeight: '600' }}>Low</Badge>;
      default: return <Badge variant="neutral">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published': return <Badge variant="success" style={{ fontWeight: '600' }}>Published</Badge>;
      case 'draft': return <Badge variant="warning" style={{ fontWeight: '600' }}>Draft</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  const getAudienceLabel = (audience) => {
    switch (audience) {
      case 'all': return 'All Users';
      case 'participants': return 'Participants';
      case 'judges': return 'Judges';
      default: return audience;
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderListView = () => (
    <>
      {/* Top KPI Row */}
      <div className="an-kpi-row">
        <div className="an-kpi-card" style={{ '--kpi-color': '#6366f1', '--kpi-bg': 'rgba(99, 102, 241, 0.1)' }}>
          <div className="an-kpi-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          </div>
          <div className="an-kpi-content">
            <span className="an-kpi-value">{loadingAnnouncements ? '-' : announcements.length}</span>
            <span className="an-kpi-label">Total Announcements</span>
          </div>
        </div>

        <div className="an-kpi-card" style={{ '--kpi-color': '#10b981', '--kpi-bg': 'rgba(16, 185, 129, 0.1)' }}>
          <div className="an-kpi-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className="an-kpi-content">
            <span className="an-kpi-value">{loadingAnnouncements ? '-' : announcements.filter(a => a.status === 'published').length}</span>
            <span className="an-kpi-label">Published</span>
          </div>
        </div>

        <div className="an-kpi-card" style={{ '--kpi-color': announcements.filter(a => a.status === 'draft').length > 0 ? '#f59e0b' : '#64748b', '--kpi-bg': announcements.filter(a => a.status === 'draft').length > 0 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)' }}>
          <div className="an-kpi-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div className="an-kpi-content">
            <span className="an-kpi-value">{loadingAnnouncements ? '-' : announcements.filter(a => a.status === 'draft').length}</span>
            <span className="an-kpi-label">Drafts</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="an-toolbar">
        <div className="an-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search announcements..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterAudience} 
            onChange={(e) => setFilterAudience(e.target.value)}
            style={{ padding: '0.8rem 1.25rem', borderRadius: '12px', border: '1px solid var(--hz-border)', minWidth: '160px', background: 'var(--hz-surface)', color: 'var(--hz-text)', outline: 'none' }}
          >
            <option value="all">All Audiences</option>
            <option value="participants">Participants</option>
            <option value="judges">Judges</option>
          </select>
          <Button variant="primary" onClick={() => openForm(null)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', whiteSpace: 'nowrap' }}>+ New Announcement</Button>
        </div>
      </div>

      {/* Announcements List */}
      {loadingAnnouncements ? (
        <div className="an-loader">
          <div className="an-loader-spinner"></div>
          <div>Loading announcements...</div>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="an-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: '1rem' }}><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No announcements found</h3>
          <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>{announcements.length === 0 ? 'Create your first announcement to notify users.' : 'Try adjusting your search or filters.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className={`an-card ${announcement.status === 'draft' ? 'draft' : ''}`}>
              <div className="an-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 className="an-card-title">{announcement.title}</h3>
                  {getStatusBadge(announcement.status)}
                  {getPriorityBadge(announcement.priority)}
                </div>
                <div className="an-card-actions">
                  <Button variant="ghost" size="sm" onClick={() => openForm(announcement)}>Edit</Button>
                  {announcement.status === 'draft' ? (
                    <Button variant="outline" size="sm" style={{ color: '#166534', borderColor: '#bbf7d0' }} onClick={() => handleAction(announcement.id, 'publish')}>Publish</Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAction(announcement.id, 'draft')}>Move to Draft</Button>
                  )}
                  <Button variant="ghost" size="sm" style={{ color: '#ef4444' }} onClick={() => handleAction(announcement.id, 'delete')}>Delete</Button>
                </div>
              </div>
              
              <div className="an-card-content">{announcement.content}</div>
              
              <div className="an-card-meta">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  {formatDate(announcement.created_at)}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Audience: <strong style={{ color: 'var(--hz-text)' }}>{getAudienceLabel(announcement.audience)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderFormView = () => (
    <div className="an-form-container">
      <Button variant="ghost" onClick={() => setView('list')} style={{ alignSelf: 'flex-start', marginBottom: '1.5rem', display: 'inline-flex' }}>
        &larr; Back to Announcements
      </Button>
      <div className="an-form-card">
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: 'var(--hz-text)' }}>
          {selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
        </h2>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Input 
            label="Announcement Title" 
            name="title" 
            value={formData.title} 
            onChange={handleFormChange} 
            placeholder="e.g., Hackathon Schedule Update"
            required 
          />
          
          <TextArea 
            label="Content" 
            name="content" 
            value={formData.content} 
            onChange={handleFormChange} 
            placeholder="Write your announcement message here..."
            rows={5} 
            required
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--hz-text)' }}>Target Audience</label>
              <select name="audience" value={formData.audience} onChange={handleFormChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-surface)', color: 'var(--hz-text)', outline: 'none' }}>
                <option value="all">All Users (Participants & Judges)</option>
                <option value="participants">Participants Only</option>
                <option value="judges">Judges Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--hz-text)' }}>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleFormChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-surface)', color: 'var(--hz-text)', outline: 'none' }}>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--hz-text)' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleFormChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-surface)', color: 'var(--hz-text)', outline: 'none' }}>
                <option value="published">Publish Now</option>
                <option value="draft">Save as Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--hz-border)' }}>
            <Button type="button" variant="outline" style={{ flex: 1, padding: '0.875rem', borderRadius: '12px' }} onClick={() => setView('list')} disabled={submitting}>Cancel</Button>
            <Button type="submit" variant="primary" style={{ flex: 2, padding: '0.875rem', borderRadius: '12px' }} disabled={submitting}>
              {submitting ? 'Saving...' : (selectedAnnouncement ? 'Save Changes' : 'Create Announcement')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="an-container">
      {message.text && (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000, background: message.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: '600', animation: 'fadeIn 0.3s ease' }}>
          {message.text}
        </div>
      )}

      {/* Header Area */}
      <div className="an-header-area">
        {view === 'list' ? (
          <div className="an-title-wrapper">
            <h1 className="an-title">Announcements</h1>
            <p className="an-subtitle">Broadcast messages and updates to your hackathon attendees.</p>
          </div>
        ) : (
          <div className="an-title-wrapper">
            <h1 className="an-title" style={{ fontSize: '1.75rem' }}>Message Editor</h1>
          </div>
        )}

        <div className="an-selector-wrapper">
          <label className="an-selector-label">Select Hackathon</label>
          <select
            className="an-select"
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            disabled={view === 'form'}
          >
            {loadingHackathons ? (
              <option value="">Loading...</option>
            ) : hackathons.map(h => (
              <option key={h.id} value={h.id}>{h.title}</option>
            ))}
            {!loadingHackathons && hackathons.length === 0 && (
               <option value="">No events found</option>
            )}
          </select>
        </div>
      </div>

      {view === 'list' && renderListView()}
      {view === 'form' && renderFormView()}
    </div>
  );
}
