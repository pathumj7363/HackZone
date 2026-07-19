import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHackathonApi, getMyHackathonsApi } from '../../api/hackathon.api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';

export default function ManageHackathon() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [message, setMessage] = useState('');
  
  const initialForm = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxTeamSize: 4,
    prizePool: '',
    theme: '',
    status: 'draft',
    image: null
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setFetchLoading(true);
    try {
      if (typeof getMyHackathonsApi === 'function') {
        const data = await getMyHackathonsApi();
        setHackathons(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (typeof createHackathonApi === 'function') {
        await createHackathonApi({ 
          title: formData.title, 
          description: formData.description,
          location: formData.location,
          startDate: formData.startDate,
          endDate: formData.endDate,
          maxTeamSize: formData.maxTeamSize,
          prizePool: formData.prizePool,
          theme: formData.theme,
          status: formData.status
        });
      }
      setMessage('Hackathon details saved successfully!');
      setTimeout(() => {
        setMessage('');
        setView('list');
        fetchHackathons();
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessage('Error saving hackathon.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setFormData(initialForm);
    setView('form');
  };

  const renderList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--hz-text)' }}>Your Hackathons</h2>
        <Button variant="primary" onClick={openCreateForm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New
        </Button>
      </div>
      
      {fetchLoading ? (
        <p>Loading hackathons...</p>
      ) : hackathons.length === 0 ? (
        <Card padding style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ color: 'var(--hz-text-muted)', marginBottom: '1rem' }}>No hackathons found.</p>
          <Button variant="outline" onClick={openCreateForm}>Create your first Hackathon</Button>
        </Card>
      ) : (
        <div className="row g-4">
          {hackathons.map((hack) => (
            <div key={hack.id} className="col-12 col-md-6 col-lg-4">
              <Card style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--hz-border)' }}>
                <div style={{ height: '140px', backgroundColor: '#e2e8f0', backgroundImage: `url(${hack.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0, color: 'var(--hz-text)' }}>{hack.title}</h3>
                    <span className={hack.status === 'ENDED' ? 'hz-badge hz-badge--danger' : 'hz-badge hz-badge--success'}>
                      {hack.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '1rem', flex: 1 }}>
                    {hack.dateRange} • {hack.location}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={() => { setFormData({ ...initialForm, id: hack.id, title: hack.title, description: hack.description, location: hack.location, startDate: hack.startDate, endDate: hack.endDate, status: hack.dbStatus || hack.status }); setView('form'); }}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" style={{ padding: '0.5rem' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                        <line x1="18" y1="9" x2="12" y2="15"></line>
                        <line x1="12" y1="9" x2="18" y2="15"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: 'var(--hz-text)' }}>
          {formData.title ? 'Edit Hackathon' : 'Create Hackathon'}
        </h2>
        <Button type="button" variant="ghost" onClick={() => setView('list')} style={{ fontWeight: '500' }}>
          &larr; Back to List
        </Button>
      </div>

      <div className="row g-4">
        {/* Left Column (Main Form) */}
        <div className="col-12 col-lg-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--hz-primary-light)', color: 'var(--hz-primary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </span>
              Basic Details
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input label="Hackathon Title" name="title" placeholder="e.g. Global Tech Innovators 2024" value={formData.title} onChange={handleChange} required />
              <TextArea label="Description" name="description" placeholder="Provide a detailed description of your hackathon, rules, and goals..." value={formData.description} onChange={handleChange} rows={6} required />
              <Input label="Theme / Category" name="theme" placeholder="e.g. AI/ML, Fintech, Web3, Healthcare" value={formData.theme} onChange={handleChange} />
              <Input label="Location (or Online)" name="location" placeholder="e.g. San Francisco, CA or Online" value={formData.location} onChange={handleChange} required />
            </div>
          </Card>

          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--hz-primary-light)', color: 'var(--hz-primary-active)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </span>
              Schedule
            </h3>
            
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <Input type="datetime-local" label="Start Date & Time" name="startDate" value={formData.startDate} onChange={handleChange} required />
              </div>
              <div className="col-12 col-md-6">
                <Input type="datetime-local" label="End Date & Time" name="endDate" value={formData.endDate} onChange={handleChange} required />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (Sidebar Settings) */}
        <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Publish Settings</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="hz-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="hz-input" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)', color: 'var(--hz-text)' }}>
                <option value="draft">Draft (Private)</option>
                <option value="published">Published (Public)</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="button" variant="outline" style={{ flex: 1, fontWeight: '600' }} onClick={() => setView('list')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" style={{ flex: 1, fontWeight: '600' }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Details'}
              </Button>
            </div>
          </Card>

          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Logistics</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Input type="number" label="Max Team Size" name="maxTeamSize" min="1" max="10" value={formData.maxTeamSize} onChange={handleChange} />
              <Input label="Prize Pool" name="prizePool" placeholder="e.g. $10,000" value={formData.prizePool} onChange={handleChange} />
            </div>
          </Card>

          <Card padding style={{ borderRadius: '12px', border: '2px dashed var(--hz-border)', backgroundColor: 'var(--hz-bg)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem 1rem', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--hz-primary-light)', color: 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              <div>
                <span style={{ fontWeight: '600', color: 'var(--hz-primary)', display: 'block' }}>
                  {formData.image ? formData.image.name : 'Upload Event Banner'}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>1920x1080 recommended</span>
              </div>
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
          </Card>

        </div>
      </div>
    </form>
  );

  return (
    <div className="hz-page" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="hz-container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--hz-surface)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--hz-surface-raised)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--hz-surface)'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em', color: 'var(--hz-text)' }}>
              Manage Hackathons
            </h1>
            <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1rem' }}>
              Create, view, and update your hackathons.
            </p>
          </div>
        </div>

        {message && (
          <div className={message.includes('Error') ? 'hz-alert hz-alert--error hz-mb-6' : 'hz-alert hz-alert--success hz-mb-6'}>
            {message}
          </div>
        )}

        {view === 'list' ? renderList() : renderForm()}

      </div>
    </div>
  );
}
