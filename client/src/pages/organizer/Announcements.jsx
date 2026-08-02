import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', animation: 'fadeIn 0.5s ease' }}>
      {/* Top KPI Row */}
      <div className="row g-4">
        {/* KPI 1 */}
        <div className="col-12 col-md-4">
          <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(168,85,247,0.1) 100%)', border: '1px solid rgba(99,102,241,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--hz-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total Announcements</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{loadingAnnouncements ? '-' : announcements.length}</div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="col-12 col-md-4">
          <div style={{ padding: '2rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(20,184,166,0.1) 100%)', border: '1px solid rgba(16,185,129,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: 'rgba(16,185,129,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Published</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{loadingAnnouncements ? '-' : announcements.filter(a => a.status === 'published').length}</div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="col-12 col-md-4">
          <div style={{ padding: '2rem', borderRadius: '24px', background: announcements.filter(a => a.status === 'draft').length > 0 ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(239,68,68,0.1) 100%)' : 'linear-gradient(135deg, rgba(100,116,139,0.1) 0%, rgba(71,85,105,0.1) 100%)', border: announcements.filter(a => a.status === 'draft').length > 0 ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(100,116,139,0.2)', position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '100px', height: '100px', background: announcements.filter(a => a.status === 'draft').length > 0 ? 'rgba(239,68,68,0.2)' : 'rgba(100,116,139,0.2)', borderRadius: '50%', filter: 'blur(30px)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: announcements.filter(a => a.status === 'draft').length > 0 ? '#f59e0b' : '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Drafts</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={announcements.filter(a => a.status === 'draft').length > 0 ? '#f59e0b' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1, color: 'var(--hz-text)' }}>{loadingAnnouncements ? '-' : announcements.filter(a => a.status === 'draft').length}</div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--hz-border)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Recent Updates
            <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700' }}>{filteredAnnouncements.length} Total</span>
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '250px' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)', pointerEvents: 'none', zIndex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input
                type="text"
                placeholder="Search announcements..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="hz-input"
                style={{ width: '100%', padding: '0.75rem 1.25rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none' }}
              />
            </div>
            <select 
              value={filterAudience} 
              onChange={(e) => setFilterAudience(e.target.value)}
              className="hz-input"
              style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid var(--hz-border)', minWidth: '160px', background: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none', appearance: 'none' }}
            >
              <option value="all">All Audiences</option>
              <option value="participants">Participants</option>
              <option value="judges">Judges</option>
            </select>
          </div>
        </div>

        {/* Announcements List */}
        {loadingAnnouncements ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
            Loading announcements...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--hz-bg)', border: '1px dashed var(--hz-border)', borderRadius: '24px' }}>
            <div style={{ width: '64px', height: '64px', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '32px', height: '32px' }}><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No announcements found</h3>
            <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1.1rem' }}>{announcements.length === 0 ? 'Create your first announcement to notify users.' : 'Try adjusting your search or filters.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredAnnouncements.map(announcement => (
              <div key={announcement.id} style={{
                background: announcement.status === 'draft' ? 'var(--hz-bg)' : 'var(--hz-bg)',
                border: announcement.status === 'draft' ? '1px dashed var(--hz-border)' : '1px solid var(--hz-border)',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.2s',
                opacity: announcement.status === 'draft' ? 0.7 : 1
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = 'var(--hz-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = announcement.status === 'draft' ? 'var(--hz-border)' : 'var(--hz-border)'; e.currentTarget.style.borderStyle = announcement.status === 'draft' ? 'dashed' : 'solid'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)' }}>{announcement.title}</h3>
                    {getStatusBadge(announcement.status)}
                    {getPriorityBadge(announcement.priority)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button variant="ghost" size="sm" onClick={() => openForm(announcement)}>Edit</Button>
                    {announcement.status === 'draft' ? (
                      <Button variant="outline" size="sm" style={{ color: '#166534', borderColor: '#bbf7d0' }} onClick={() => handleAction(announcement.id, 'publish')}>Publish</Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleAction(announcement.id, 'draft')}>Move to Draft</Button>
                    )}
                    <Button variant="ghost" size="sm" style={{ color: '#ef4444' }} onClick={() => handleAction(announcement.id, 'delete')}>Delete</Button>
                  </div>
                </div>
                
                <div style={{ color: 'var(--hz-text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                  {announcement.content}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
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
      </div>
    </div>
  );

  const renderFormView = () => (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
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
              <select name="audience" value={formData.audience} onChange={handleFormChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none' }}>
                <option value="all">All Users (Participants & Judges)</option>
                <option value="participants">Participants Only</option>
                <option value="judges">Judges Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--hz-text)' }}>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleFormChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none' }}>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--hz-text)' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleFormChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)', outline: 'none' }}>
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
    <div className="hz-page" style={{ paddingBottom: '4rem', minHeight: '100vh' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {message.text && (
        <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000, background: message.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '1rem 2rem', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: '600', animation: 'fadeIn 0.3s ease' }}>
          {message.text}
        </div>
      )}

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
              {view === 'list' ? 'Announcements' : (selectedAnnouncement ? 'Edit Announcement' : 'New Announcement')}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              {view === 'list' ? 'Broadcast messages and updates to your hackathon attendees.' : 'Draft a new message to send to your community.'}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
            {view === 'list' ? (
              <>
                <Button onClick={() => openForm(null)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'var(--hz-primary)', color: '#fff', border: 'none',
                  borderRadius: '12px', padding: '0.85rem 1.5rem',
                  fontSize: '1rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.4)', transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.6)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.4)'; }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  New Announcement
                </Button>
                <div style={{ position: 'relative', width: '250px' }}>
                  <select
                    value={selectedHackathonId}
                    onChange={(e) => setSelectedHackathonId(e.target.value)}
                    className="hz-input"
                    disabled={loadingHackathons}
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
                    {hackathons.length > 0 ? (
                      hackathons.map(h => (
                      <option key={h.id} value={h.id} style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>{h.title}</option>
                      ))
                    ) : (
                      <option value="" style={{ color: 'var(--hz-text)', backgroundColor: 'var(--hz-bg)' }}>No events found</option>
                    )}
                  </select>
                  <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </>
            ) : (
              <Button type="button" variant="ghost" onClick={() => setView('list')} style={{ fontWeight: '500', padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'var(--hz-surface)', border: '1px solid var(--hz-border)' }}>
                &larr; Back to List
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        {view === 'list' && renderListView()}
        {view === 'form' && renderFormView()}
      </div>
    </div>
  );
}
