import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import TextArea from '../../components/ui/TextArea';

export default function Announcements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    setLoading(true);
    // Mock fetching announcements
    setTimeout(() => {
      const mockData = [
        {
          id: 'a1',
          title: 'Hackathon Schedule Update',
          content: 'The opening ceremony has been moved to 10:00 AM EST. Please make sure to tune in on time!',
          date: '2026-06-03T09:00:00Z',
          audience: 'all',
          priority: 'high',
          status: 'published'
        },
        {
          id: 'a2',
          title: 'Judges Briefing Room Link',
          content: 'Here is the link to the judges briefing room for the upcoming evaluation phase: https://meet.hackzone.com/judges-brief',
          date: '2026-06-02T14:30:00Z',
          audience: 'judges',
          priority: 'normal',
          status: 'published'
        },
        {
          id: 'a3',
          title: 'New API Sponsor Added!',
          content: 'We are thrilled to announce that OpenAI has joined as an API sponsor. Participants can claim their credits now.',
          date: '2026-06-01T11:15:00Z',
          audience: 'participants',
          priority: 'normal',
          status: 'published'
        },
        {
          id: 'a4',
          title: 'Submission Guidelines Draft',
          content: 'Make sure your submission includes a 2-minute demo video and a GitHub repository link with a comprehensive README.',
          date: '2026-05-30T16:00:00Z',
          audience: 'participants',
          priority: 'normal',
          status: 'draft'
        }
      ];
      setAnnouncements(mockData);
      setLoading(false);
    }, 600);
  };

  const handleAction = (id, action) => {
    setAnnouncements(announcements.map(a => {
      if (a.id === id) {
        if (action === 'publish') return { ...a, status: 'published' };
        if (action === 'draft') return { ...a, status: 'draft' };
        if (action === 'delete') return null;
      }
      return a;
    }).filter(Boolean));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedAnnouncement) {
      // Edit mode
      setAnnouncements(announcements.map(a => a.id === selectedAnnouncement.id ? { ...a, ...formData } : a));
    } else {
      // Create mode
      const newAnnouncement = {
        id: `a${Date.now()}`,
        ...formData,
        date: new Date().toISOString()
      };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    setView('list');
  };

  const openForm = (announcement = null) => {
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

  const filteredAnnouncements = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase());
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

  // Views
  const renderListView = () => (
    <>
      {/* Top KPI Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>TOTAL ANNOUNCEMENTS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : announcements.length}</div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>PUBLISHED</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : announcements.filter(a => a.status === 'published').length}</div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>DRAFTS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: announcements.filter(a => a.status === 'draft').length > 0 ? '#d97706' : 'var(--hz-text)' }}>
                {loading ? '-' : announcements.filter(a => a.status === 'draft').length}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Toolbar */}
      <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', gap: '1rem' }}>
          <Input 
            type="text" 
            placeholder="Search announcements..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 0, padding: '0.6rem 1rem', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filterAudience} 
            onChange={(e) => setFilterAudience(e.target.value)}
            className="hz-input"
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--hz-border)', minWidth: '150px' }}
          >
            <option value="all">All Audiences</option>
            <option value="participants">Participants</option>
            <option value="judges">Judges</option>
          </select>
          <Button variant="primary" onClick={() => openForm(null)}>New Announcement</Button>
        </div>
      </Card>

      {/* Announcements List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hz-text-muted)' }}>Loading announcements...</div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card padding style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No announcements found</h3>
          <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>Try adjusting your search or filter criteria.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredAnnouncements.map(announcement => (
            <Card key={announcement.id} style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', ':hover': { borderColor: 'var(--hz-primary)' } }}>
              <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1.5rem', backgroundColor: announcement.status === 'draft' ? '#fafafa' : 'white' }}>
                
                {/* Content Section */}
                <div style={{ flex: '1 1 400px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--hz-text)' }}>
                      {announcement.title}
                    </h3>
                    {getStatusBadge(announcement.status)}
                    {getPriorityBadge(announcement.priority)}
                  </div>
                  <p style={{ fontSize: '1rem', color: 'var(--hz-text-muted)', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {announcement.content}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {formatDate(announcement.date)}
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                      Audience: {getAudienceLabel(announcement.audience)}
                    </span>
                  </div>
                </div>

                {/* Actions Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: '0 0 auto', minWidth: '120px' }}>
                  <Button variant="ghost" size="sm" onClick={() => openForm(announcement)}>Edit</Button>
                  {announcement.status === 'draft' ? (
                    <Button variant="outline" size="sm" style={{ color: '#166534', borderColor: '#bbf7d0' }} onClick={() => handleAction(announcement.id, 'publish')}>Publish</Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleAction(announcement.id, 'draft')}>Move to Draft</Button>
                  )}
                  <Button variant="ghost" size="sm" style={{ color: '#b91c1c' }} onClick={() => handleAction(announcement.id, 'delete')}>Delete</Button>
                </div>

              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  const renderFormView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Button variant="ghost" onClick={() => setView('list')} style={{ alignSelf: 'flex-start' }}>&larr; Back to Announcements</Button>
      <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}</h2>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
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
          
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="hz-field">
                <label className="hz-label">Audience</label>
                <select name="audience" value={formData.audience} onChange={handleFormChange} className="hz-input" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--hz-border)' }}>
                  <option value="all">All Users</option>
                  <option value="participants">Participants Only</option>
                  <option value="judges">Judges Only</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="hz-field">
                <label className="hz-label">Priority</label>
                <select name="priority" value={formData.priority} onChange={handleFormChange} className="hz-input" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--hz-border)' }}>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="hz-field">
                <label className="hz-label">Status</label>
                <select name="status" value={formData.status} onChange={handleFormChange} className="hz-input" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--hz-border)' }}>
                  <option value="published">Publish Now</option>
                  <option value="draft">Save as Draft</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--hz-border)' }}>
            <Button type="button" variant="outline" style={{ flex: 1 }} onClick={() => setView('list')}>Cancel</Button>
            <Button type="submit" variant="primary" style={{ flex: 1 }}>{selectedAnnouncement ? 'Save Changes' : 'Create Announcement'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );

  return (
    <div className="hz-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="hz-container">
        {/* Page Header */}
        {view === 'list' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button type="button" onClick={() => navigate('/organizer')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em', color: 'var(--hz-text)' }}>Announcements</h1>
              <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1rem' }}>Broadcast messages to participants, judges, or all users.</p>
            </div>
          </div>
        )}

        {/* Content Router */}
        {view === 'list' && renderListView()}
        {view === 'form' && renderFormView()}
        
      </div>
    </div>
  );
}
