import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createHackathonApi, getMyHackathonsApi, deleteHackathonApi, updateHackathonApi } from '../../api/hackathon.api';
import { getJudgesApi } from '../../api/user.api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';

const PREDEFINED_EVAL_AREAS = [
  "Innovation & Creativity",
  "Technical Complexity",
  "UI/UX Design",
  "Business Potential",
  "Real-World Impact",
  "Originality",
  "Feasibility",
  "Presentation / Pitch",
  "Code Quality"
];

export default function ManageHackathon() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [hackathonToDelete, setHackathonToDelete] = useState(null);
  const [availableJudges, setAvailableJudges] = useState([]);
  const [activeJudgeSearchIndex, setActiveJudgeSearchIndex] = useState(null);
  
  const initialForm = {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    maxTeamSize: 4,
    prizePool: '',
    theme: '',
    status: 'published',
    image: null,
    evaluationAreas: [],
    prizes: [{ place: '1st Place', amount: '', desc: '' }],
    organization: { name: '', email: '', website: '', description: '' },
    judges: [{ name: '', email: '', evaluationAreas: [] }]
  };
  
  const [formData, setFormData] = useState(initialForm);
  const [evalAreaInput, setEvalAreaInput] = useState('');
  const [showEvalDropdown, setShowEvalDropdown] = useState(false);
  const [activeEvalAssignDropdownIndex, setActiveEvalAssignDropdownIndex] = useState(null);

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

  const handleOrgChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, organization: { ...prev.organization, [name]: value } }));
  };

  const handleDeleteClick = (id) => {
    setHackathonToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!hackathonToDelete) return;
    setDeleteModalOpen(false);
    setFetchLoading(true);
    try {
      if (typeof deleteHackathonApi === 'function') {
        await deleteHackathonApi(hackathonToDelete);
        setMessage('Hackathon deleted successfully.');
        fetchHackathons();
      }
    } catch (err) {
      console.error(err);
      setMessage('Error deleting hackathon.');
      setFetchLoading(false);
    } finally {
      setHackathonToDelete(null);
    }
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    setFormData(prev => ({ ...prev, prizes: newPrizes }));
  };
  const addPrize = () => {
    setFormData(prev => ({ ...prev, prizes: [...prev.prizes, { place: '', amount: '', desc: '' }] }));
  };
  const removePrize = (index) => {
    const newPrizes = formData.prizes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, prizes: newPrizes }));
  };

  const handleJudgeChange = async (index, field, value) => {
    setFormData(prev => {
      const newJudges = [...prev.judges];
      newJudges[index] = { ...newJudges[index], [field]: value };
      return { ...prev, judges: newJudges };
    });

    if (field === 'name') {
      setActiveJudgeSearchIndex(index);
      try {
        const results = await getJudgesApi(value);
        setAvailableJudges(results || []);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const selectJudge = (index, judge) => {
    setFormData(prev => {
      const newJudges = [...prev.judges];
      newJudges[index] = { ...newJudges[index], name: judge.name, email: judge.email };
      return { ...prev, judges: newJudges };
    });
    setActiveJudgeSearchIndex(null);
    setAvailableJudges([]);
  };
  const addJudge = () => {
    setFormData(prev => ({ ...prev, judges: [...prev.judges, { name: '', email: '', evaluationAreas: [] }] }));
  };
  const removeJudge = (index) => {
    setFormData(prev => {
      const newJudges = prev.judges.filter((_, i) => i !== index);
      return { ...prev, judges: newJudges };
    });
  };

  const handleJudgeEvalAreaToggle = (judgeIndex, area) => {
    setFormData(prev => {
      const newJudges = [...prev.judges];
      const judgeCopy = { ...newJudges[judgeIndex] };
      const currentAreas = judgeCopy.evaluationAreas || [];
      
      if (currentAreas.includes(area)) {
        judgeCopy.evaluationAreas = currentAreas.filter(a => a !== area);
      } else {
        judgeCopy.evaluationAreas = [...currentAreas, area];
      }
      
      newJudges[judgeIndex] = judgeCopy;
      return { ...prev, judges: newJudges };
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const handleAddEvalArea = (e) => {
    if (e.key === 'Enter' && evalAreaInput.trim() !== '') {
      e.preventDefault();
      if (!formData.evaluationAreas.includes(evalAreaInput.trim())) {
        setFormData(prev => ({ ...prev, evaluationAreas: [...prev.evaluationAreas, evalAreaInput.trim()] }));
      }
      setEvalAreaInput('');
    }
  };
  
  const removeEvalArea = (areaToRemove) => {
    setFormData(prev => ({ ...prev, evaluationAreas: prev.evaluationAreas.filter(a => a !== areaToRemove) }));
    
    // Also remove this area from any judges that have it assigned
    setFormData(prev => {
      const newJudges = prev.judges.map(judge => ({
        ...judge,
        evaluationAreas: (judge.evaluationAreas || []).filter(a => a !== areaToRemove)
      }));
      return { ...prev, judges: newJudges };
    });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'prizes' || key === 'judges' || key === 'evaluationAreas') {
          payload.append(key, JSON.stringify(formData[key]));
        } else if (key === 'organization') {
          payload.append('sponsors', JSON.stringify([formData[key]]));
        } else if (formData[key] !== null && formData[key] !== undefined && formData[key] !== '') {
          payload.append(key, formData[key]);
        }
      });

      if (formData.id) {
        if (typeof updateHackathonApi === 'function') {
          await updateHackathonApi(formData.id, payload);
          setMessage('Hackathon updated successfully!');
        }
      } else {
        if (typeof createHackathonApi === 'function') {
          await createHackathonApi(payload);
          setMessage('Hackathon created & invites sent successfully!');
        }
      }
      setTimeout(() => {
        setMessage('');
        setView('list');
        fetchHackathons();
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage('Error saving hackathon.');
    } finally {
      setLoading(false);
    }
  };

  const openCreateForm = () => {
    setFormData(initialForm);
    setStep(1);
    setView('form');
  };

  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  const openEditForm = (hack) => {
    let orgData = { name: '', email: '', website: '', description: '' };
    if (hack.sponsors && Array.isArray(hack.sponsors) && hack.sponsors.length > 0) {
      orgData = { ...orgData, ...hack.sponsors[0] };
    }
    
    setFormData({
      ...initialForm,
      id: hack.id,
      title: hack.title,
      description: hack.description,
      location: hack.location,
      startDate: formatDateTimeForInput(hack.startDate),
      endDate: formatDateTimeForInput(hack.endDate),
      status: hack.dbStatus || hack.status,
      theme: hack.theme || '',
      maxTeamSize: hack.maxTeamSize || 4,
      prizePool: hack.prizePool || '',
      evaluationAreas: hack.evaluationAreas && Array.isArray(hack.evaluationAreas) ? hack.evaluationAreas : [],
      prizes: hack.prizes && Array.isArray(hack.prizes) && hack.prizes.length > 0 ? hack.prizes : initialForm.prizes,
      judges: hack.judges && Array.isArray(hack.judges) && hack.judges.length > 0 ? hack.judges : initialForm.judges,
      organization: orgData,
    });
    setStep(1);
    setView('form');
  };

  // --- RENDERS ---

  const renderList = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)' }}>Your Events</h2>
          <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>Manage your active and past hackathons</p>
        </div>
        <Button variant="primary" onClick={openCreateForm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Create Hackathon
        </Button>
      </div>
      
      {fetchLoading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--hz-text-muted)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--hz-border)', borderTopColor: 'var(--hz-primary)', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
          Loading hackathons...
        </div>
      ) : hackathons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--hz-surface)', border: '1px dashed var(--hz-border)', borderRadius: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--hz-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--hz-text-muted)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--hz-text)' }}>No Hackathons Yet</h3>
          <p style={{ color: 'var(--hz-text-muted)', marginBottom: '2rem' }}>You haven't created any hackathons. Start your first event now.</p>
          <Button variant="primary" onClick={openCreateForm} style={{ padding: '0.75rem 2rem', borderRadius: '12px' }}>Create Your First Event</Button>
        </div>
      ) : (
        <div className="row g-4">
          {hackathons.map((hack) => {
            const isEnded = hack.status === 'ENDED' || hack.dbStatus === 'completed';
            const statusColor = isEnded ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)';
            const statusTextColor = isEnded ? '#ef4444' : '#10b981';
            
            return (
              <div key={hack.id} className="col-12 col-md-6 col-lg-4">
                <Card style={{ borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid var(--hz-border)', transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' } }}>
                  <div style={{ height: '160px', backgroundColor: '#e2e8f0', backgroundImage: `url(${hack.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: statusColor, color: statusTextColor, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700', backdropFilter: 'blur(4px)', border: `1px solid ${statusTextColor}` }}>
                      {hack.status}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)' }}>{hack.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> {hack.dateRange || 'Dates TBA'}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> {hack.location || 'Online'}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                      <Button variant="outline" style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => openEditForm(hack)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        Edit
                      </Button>
                      <Button variant="outline" style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }} onClick={() => handleDeleteClick(hack.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderProgressBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem', position: 'relative' }}>
      {[1, 2, 3, 4].map((s, index) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', position: 'relative', zIndex: 2 }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '50%', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', transition: 'all 0.3s',
              background: step >= s ? 'var(--hz-primary)' : 'var(--hz-surface)',
              color: step >= s ? '#fff' : 'var(--hz-text-muted)',
              border: `2px solid ${step >= s ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
              boxShadow: step === s ? '0 0 0 4px rgba(99,102,241,0.2)' : 'none'
            }}>
              {step > s ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : s}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: step === s ? '700' : '500', color: step >= s ? 'var(--hz-text)' : 'var(--hz-text-muted)', position: 'absolute', top: '48px', whiteSpace: 'nowrap' }}>
              {s === 1 ? 'Details' : s === 2 ? 'Prizes' : s === 3 ? 'Organization' : 'Judges'}
            </span>
          </div>
          {index < 3 && (
            <div style={{ flex: 1, height: '2px', background: step > s ? 'var(--hz-primary)' : 'var(--hz-border)', margin: '0 1rem', position: 'relative', top: '-10px' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Basic Details</h3>
      <div className="row g-4">
        <div className="col-12">
          <Input label="Hackathon Title" name="title" placeholder="e.g. Global Tech Innovators 2024" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="col-12">
          <TextArea label="Description" name="description" placeholder="Provide a detailed description of your hackathon, rules, and goals..." value={formData.description} onChange={handleChange} rows={5} required />
        </div>
        <div className="col-12 col-md-6">
          <Input label="Theme / Category" name="theme" placeholder="e.g. AI/ML, Fintech, Web3, Healthcare" value={formData.theme} onChange={handleChange} />
        </div>
        <div className="col-12 col-md-6">
          <Input label="Location (or Online)" name="location" placeholder="e.g. San Francisco, CA or Online" value={formData.location} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <Input type="datetime-local" label="Start Date & Time" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <Input type="datetime-local" label="End Date & Time" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <Input type="number" label="Max Team Size" name="maxTeamSize" min="1" max="10" value={formData.maxTeamSize} onChange={handleChange} />
        </div>
        <div className="col-12 col-md-4">
          <label className="hz-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Visibility / Status</label>
          <select name="status" className="hz-input" value={formData.status} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--hz-border)', backgroundColor: 'var(--hz-bg)', color: 'var(--hz-text)' }}>
            <option value="draft">Draft (Private)</option>
            <option value="published">Published (Public)</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-12 col-md-4">
          <label className="hz-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Banner</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hz-input" style={{ width: '100%', padding: '0.65rem' }} />
        </div>
        <div className="col-12">
          <label className="hz-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Evaluation Areas (Optional)</label>
          <p style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '0.5rem' }}>Add areas that judges will evaluate (e.g. Innovation, UI/UX). Press Enter to add.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {formData.evaluationAreas.map(area => (
              <span key={area} style={{ background: 'var(--hz-primary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {area}
                <button type="button" onClick={() => removeEvalArea(area)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </span>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Input 
              name="evalAreaInput"
              placeholder="Type or select an evaluation area and press Enter" 
              value={evalAreaInput}
              onChange={(e) => {
                setEvalAreaInput(e.target.value);
                setShowEvalDropdown(true);
              }}
              onFocus={() => setShowEvalDropdown(true)}
              onBlur={() => setTimeout(() => setShowEvalDropdown(false), 200)}
              onKeyDown={handleAddEvalArea}
              style={{ paddingRight: '2.5rem' }}
            />
            <div 
              style={{ 
                position: 'absolute', right: '12px', top: '50%', 
                transform: `translateY(-50%) ${showEvalDropdown ? 'rotate(180deg)' : 'rotate(0)'}`, 
                transition: 'transform 0.3s ease', pointerEvents: 'none', 
                color: 'var(--hz-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            {showEvalDropdown && (
              <div style={{ 
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, 
                background: 'var(--hz-surface)', border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '8px', zIndex: 10, maxHeight: '150px', overflowY: 'auto',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}>
                {PREDEFINED_EVAL_AREAS
                  .filter(a => a.toLowerCase().includes(evalAreaInput.toLowerCase()) && !formData.evaluationAreas.includes(a))
                  .map(area => (
                  <div 
                    key={area}
                    style={{ padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--hz-text)' }}
                    onMouseDown={(e) => {
                      e.preventDefault(); // prevents blur event
                      setFormData(prev => ({ ...prev, evaluationAreas: [...prev.evaluationAreas, area] }));
                      setEvalAreaInput('');
                      setShowEvalDropdown(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {area}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--hz-text)' }}>Prizes & Awards</h3>
        <Input label="" name="prizePool" placeholder="Total Prize Pool (e.g. $10,000)" value={formData.prizePool} onChange={handleChange} style={{ width: '250px' }} />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {formData.prizes.map((prize, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'var(--hz-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ flex: 1 }}><Input placeholder="Place (e.g. 1st Place)" value={prize.place} onChange={(e) => handlePrizeChange(index, 'place', e.target.value)} required /></div>
            <div style={{ flex: 1 }}><Input placeholder="Amount (e.g. $5,000)" value={prize.amount} onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)} required /></div>
            <div style={{ flex: 2 }}><Input placeholder="Description" value={prize.desc} onChange={(e) => handlePrizeChange(index, 'desc', e.target.value)} /></div>
            <Button variant="ghost" onClick={() => removePrize(index)} style={{ padding: '0.75rem', color: '#ef4444' }} disabled={formData.prizes.length === 1}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={addPrize} style={{ marginTop: '1rem', borderStyle: 'dashed' }}>+ Add Another Prize</Button>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Organization Details</h3>
      <p style={{ color: 'var(--hz-text-muted)', marginBottom: '1.5rem' }}>These details will be shown to participants so they know who is organizing the event.</p>
      
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <Input label="Organization Name" name="name" placeholder="e.g. Acme Corp" value={formData.organization.name} onChange={handleOrgChange} required />
        </div>
        <div className="col-12 col-md-6">
          <Input label="Contact Email" name="email" type="email" placeholder="e.g. hello@acme.com" value={formData.organization.email} onChange={handleOrgChange} required />
        </div>
        <div className="col-12">
          <Input label="Website / Social URL" name="website" placeholder="e.g. https://acme.com" value={formData.organization.website} onChange={handleOrgChange} />
        </div>
        <div className="col-12">
          <TextArea label="About Organization" name="description" placeholder="Short bio about the organizing company or community..." value={formData.organization.description} onChange={handleOrgChange} rows={3} />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Assign Judges</h3>
      <p style={{ color: 'var(--hz-text-muted)', marginBottom: '1.5rem' }}>Invite judges to evaluate submissions. They will receive an email invitation to join the hackathon dashboard.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {formData.judges.map((judge, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--hz-bg)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', width: '100%' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Input 
                  placeholder="Search or Enter Judge Name" 
                  value={judge.name} 
                  onChange={(e) => handleJudgeChange(index, 'name', e.target.value)} 
                  onFocus={async () => {
                    setActiveJudgeSearchIndex(index);
                    try {
                      const results = await getJudgesApi(judge.name || '');
                      setAvailableJudges(results || []);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  onBlur={() => setTimeout(() => setActiveJudgeSearchIndex(null), 200)}
                  style={{ paddingRight: '2.5rem' }}
                  required 
                />
                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: `translateY(-50%) ${activeJudgeSearchIndex === index ? 'rotate(180deg)' : 'rotate(0)'}`, transition: 'transform 0.3s ease', pointerEvents: 'none', color: 'var(--hz-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
                {activeJudgeSearchIndex === index && availableJudges.length > 0 && (
                  <div style={{ 
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, 
                    background: 'var(--hz-surface)', border: '1px solid rgba(255,255,255,0.05)', 
                    borderRadius: '16px', zIndex: 50, 
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                    padding: '0.5rem', maxHeight: '250px', overflowY: 'auto',
                    backdropFilter: 'blur(16px)', animation: 'fadeIn 0.2s ease'
                  }}>
                    {availableJudges.map(avJudge => (
                      <div 
                        key={avJudge.id} 
                        style={{ 
                          padding: '0.75rem 1rem', cursor: 'pointer', borderRadius: '10px',
                          display: 'flex', flexDirection: 'column', gap: '0.25rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseDown={(e) => { e.preventDefault(); selectJudge(index, avJudge); }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontWeight: '600', color: 'var(--hz-text)', fontSize: '0.95rem' }}>{avJudge.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--hz-text-muted)' }}>{avJudge.email}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}><Input type="email" placeholder="Judge Email Address" value={judge.email} onChange={(e) => handleJudgeChange(index, 'email', e.target.value)} required /></div>
              <div style={{ flex: 1.5, position: 'relative' }}>
                <div 
                  className="hz-input" 
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', minHeight: '48px', alignItems: 'center', cursor: 'pointer', paddingRight: '2.5rem', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', borderRadius: '12px', padding: '0.5rem 2.5rem 0.5rem 0.75rem' }}
                  onClick={() => setActiveEvalAssignDropdownIndex(activeEvalAssignDropdownIndex === index ? null : index)}
                >
                  {(judge.evaluationAreas || []).length > 0 ? (
                    (judge.evaluationAreas || []).map(area => (
                      <span key={area} style={{ background: 'var(--hz-primary)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', zIndex: 2 }}>
                        {area}
                        <button type="button" onClick={(e) => { e.stopPropagation(); handleJudgeEvalAreaToggle(index, area); }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}>&times;</button>
                      </span>
                    ))
                  ) : (
                    <span style={{ color: 'var(--hz-text-muted)' }}>Select Areas...</span>
                  )}
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: `translateY(-50%) ${activeEvalAssignDropdownIndex === index ? 'rotate(180deg)' : 'rotate(0)'}`, transition: 'transform 0.3s ease', pointerEvents: 'none', color: 'var(--hz-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>

                {activeEvalAssignDropdownIndex === index && (
                  <div style={{ 
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, 
                    background: 'var(--hz-surface)', border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '8px', zIndex: 50, maxHeight: '200px', overflowY: 'auto',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                  }}>
                    {formData.evaluationAreas.length > 0 ? (
                      formData.evaluationAreas.map(area => {
                        const isAssignedToOther = formData.judges.some((otherJ, otherIdx) => otherIdx !== index && (otherJ.evaluationAreas || []).includes(area));
                        const isSelected = (judge.evaluationAreas || []).includes(area);
                        
                        if (isAssignedToOther) return null;
                        
                        return (
                          <div 
                            key={area}
                            style={{ 
                              padding: '0.65rem 1rem', cursor: 'pointer', fontSize: '0.85rem', 
                              color: isSelected ? 'var(--hz-primary)' : 'var(--hz-text)',
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleJudgeEvalAreaToggle(index, area);
                              setActiveEvalAssignDropdownIndex(null);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {area}
                            {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>No areas added in Step 1.</div>
                    )}
                  </div>
                )}
              </div>
              <Button variant="ghost" type="button" onClick={() => removeJudge(index)} style={{ padding: '0.75rem', color: '#ef4444' }} disabled={formData.judges.length === 1}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={addJudge} style={{ marginTop: '1rem', borderStyle: 'dashed' }}>+ Add Another Judge</Button>
    </div>
  );

  const renderForm = () => (
    <div style={{ animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)' }}>
            {formData.title ? 'Edit Hackathon' : 'Create New Hackathon'}
          </h2>
        </div>
        <Button type="button" variant="ghost" onClick={() => setView('list')} style={{ fontWeight: '500' }}>
          &larr; Back to Events
        </Button>
      </div>

      <Card padding style={{ borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '3rem' }}>
        {renderProgressBar()}

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
          <div style={{ minHeight: '350px' }}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--hz-border)', margin: '2rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="button" variant="outline" onClick={prevStep} style={{ visibility: step === 1 ? 'hidden' : 'visible', padding: '0.75rem 2rem' }}>
              Back
            </Button>
            
            {step < 4 ? (
              <Button type="submit" variant="primary" style={{ padding: '0.75rem 3rem', borderRadius: '12px' }}>
                Next Step &rarr;
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={handleSubmit} style={{ padding: '0.75rem 3rem', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', border: 'none' }} disabled={loading}>
                {loading ? 'Creating...' : 'Create & Send Invites'}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );

  return (
    <div className="hz-page" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="hz-container">
        {message && (
          <div className={message.includes('Error') ? 'hz-alert hz-alert--error hz-mb-6' : 'hz-alert hz-alert--success hz-mb-6'}>
            {message}
          </div>
        )}
        {view === 'list' ? renderList() : renderForm()}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }} onClick={() => setDeleteModalOpen(false)}></div>
            <div style={{ background: '#1e293b', border: '1px solid #334155', padding: '2rem', borderRadius: '16px', maxWidth: '400px', width: '90%', position: 'relative', zIndex: 1001, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'fadeIn 0.2s ease' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--hz-text)', marginBottom: '0.75rem' }}>Delete Hackathon?</h3>
              <p style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                Are you sure you want to delete this hackathon? All associated data, including registrations and submissions, will be permanently removed. <strong>This action cannot be undone.</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="primary" style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }} onClick={confirmDelete}>
                  Yes, Delete Event
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
