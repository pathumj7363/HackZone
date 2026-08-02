import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitProjectApi } from '../../api/submission.api';
import { getMyRegisteredHackathonsApi } from '../../api/hackathon.api';

const STEPS = ['Select Hackathon', 'Project Info', 'Links & Files', 'Review & Submit'];

// --- UI Helpers ---
const Input = ({ id, label, error, helperText, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--hz-text)' }}>
        {label} {props.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        background: 'var(--hz-bg)',
        border: `2px solid ${error ? '#ef4444' : focused ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
        transition: 'all 0.3s ease',
        boxShadow: focused && !error ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
        overflow: 'hidden'
      }}>
        <input 
          id={id}
          onFocus={(e) => { setFocused(true); if(props.onFocus) props.onFocus(e); }}
          onBlur={(e) => { setFocused(false); if(props.onBlur) props.onBlur(e); }}
          style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: 'transparent', outline: 'none', color: 'var(--hz-text)', fontSize: '0.95rem' }}
          {...props}
        />
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.4rem 0 0', fontWeight: '500' }}>{error}</p>}
      {!error && helperText && <p style={{ color: 'var(--hz-text-muted)', fontSize: '0.8rem', margin: '0.4rem 0 0' }}>{helperText}</p>}
    </div>
  );
};

const TextArea = ({ id, label, error, helperText, rows=4, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label htmlFor={id} style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--hz-text)' }}>
        {label} {props.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        background: 'var(--hz-bg)',
        border: `2px solid ${error ? '#ef4444' : focused ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
        transition: 'all 0.3s ease',
        boxShadow: focused && !error ? '0 0 0 4px rgba(99,102,241,0.1)' : 'none',
        overflow: 'hidden'
      }}>
        <textarea 
          id={id} rows={rows}
          onFocus={(e) => { setFocused(true); if(props.onFocus) props.onFocus(e); }}
          onBlur={(e) => { setFocused(false); if(props.onBlur) props.onBlur(e); }}
          style={{ width: '100%', padding: '0.85rem 1rem', border: 'none', background: 'transparent', outline: 'none', color: 'var(--hz-text)', fontSize: '0.95rem', resize: 'vertical' }}
          {...props}
        />
      </div>
      {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.4rem 0 0', fontWeight: '500' }}>{error}</p>}
      {!error && helperText && <p style={{ color: 'var(--hz-text-muted)', fontSize: '0.8rem', margin: '0.4rem 0 0' }}>{helperText}</p>}
    </div>
  );
};

export default function ProjectSubmission() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetchingHackathons, setFetchingHackathons] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Drag & drop state
  const [dragActive, setDragActive] = useState(false);

  // Form state
  const [form, setForm] = useState({
    hackathonId: '',
    teamId: '',
    title: '',
    description: '',
    techStack: '',
    repoUrl: '',
    demoUrl: '',
    videoUrl: '',
    notes: '',
    file: null,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { 
    window.scrollTo(0, 0); 
    getMyRegisteredHackathonsApi().then(data => {
      const approved = (data || []).filter(h => h.registrationStatus === 'approved');
      setHackathons(approved);
      setFetchingHackathons(false);
    }).catch(() => setFetchingHackathons(false));
  }, []);

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.hackathonId) newErrors.hackathonId = 'Please select a hackathon.';
    }
    if (step === 1) {
      if (!form.title.trim()) newErrors.title = 'Project title is required.';
      if (!form.description.trim()) newErrors.description = 'Description is required.';
    }
    if (step === 2) {
      if (!form.repoUrl.trim()) newErrors.repoUrl = 'GitHub repository URL is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('hackathonId', form.hackathonId);
      if (form.teamId) formData.append('teamId', form.teamId);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('techStack', form.techStack);
      formData.append('repoUrl', form.repoUrl);
      formData.append('demoUrl', form.demoUrl);
      formData.append('videoUrl', form.videoUrl);
      formData.append('notes', form.notes);
      if (form.file) {
        formData.append('file', form.file);
      }

      await submitProjectApi(formData);
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Success State ---
  if (submitted) {
    return (
      <div className="hz-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '560px', width: '100%', margin: 'auto', textAlign: 'center', padding: '3rem', background: 'var(--hz-surface)', borderRadius: '24px', boxShadow: 'var(--hz-shadow-xl)', border: '1px solid var(--hz-border)' }}>
          <div style={{
            width: '88px', height: '88px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem', border: '2px solid rgba(16,185,129,0.3)'
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--hz-text)' }}>
            Submitted!
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            Your project <strong style={{ color: 'var(--hz-text)' }}>{form.title}</strong> has been successfully submitted. Time to celebrate! 🎉
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => navigate('/submissions')} style={{
              background: 'var(--hz-primary)', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(99,102,241,0.4)', transition: 'transform 0.2s'
            }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
              View My Submissions
            </button>
            <button onClick={() => navigate('/teams')} style={{
              background: 'transparent', color: 'var(--hz-text)', border: '2px solid var(--hz-border)', padding: '0.85rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s'
            }} onMouseEnter={e=>e.currentTarget.style.background='var(--hz-bg)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              Back to Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Dynamic Checklist ---
  const checklist = [
    { label: 'Hackathon selected', done: !!form.hackathonId },
    { label: 'Project title', done: !!form.title.trim() },
    { label: 'Project description', done: !!form.description.trim() },
    { label: 'GitHub repository', done: !!form.repoUrl.trim() },
  ];

  return (
    <div className="hz-page" style={{ paddingBottom: '5rem' }}>
      {/* ── Dynamic Gradient Hero ── */}
      <div style={{
        position: 'relative', padding: '4rem 0', marginBottom: '3rem', overflow: 'hidden',
        borderBottom: '1px solid var(--hz-border)'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--hz-surface)', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-50%', left: '10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
        </div>
        <div className="hz-container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
            Submit Your Project
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px' }}>
            You've built something amazing. Now it's time to share it with the world. Complete the steps below to finalize your entry.
          </p>
        </div>
      </div>

      <div className="hz-container">
        
        {/* ── Glassmorphic Animated Stepper ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', position: 'relative', background: 'var(--hz-surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--hz-border)', boxShadow: 'var(--hz-shadow-sm)' }}>
          {/* Progress line background */}
          <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '4px', background: 'var(--hz-bg)', transform: 'translateY(-50%)', borderRadius: '4px', zIndex: 1 }} />
          {/* Active progress line */}
          <div style={{ position: 'absolute', top: '50%', left: '10%', height: '4px', background: 'var(--hz-primary)', transform: 'translateY(-50%)', borderRadius: '4px', zIndex: 2, transition: 'width 0.4s ease-in-out', width: `${(step / (STEPS.length - 1)) * 80}%` }} />
          
          {STEPS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', position: 'relative', zIndex: 3, flex: 1 }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: isDone ? '#10b981' : isActive ? 'var(--hz-primary)' : 'var(--hz-surface)',
                  border: `3px solid ${isDone ? '#10b981' : isActive ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
                  color: isDone || isActive ? '#fff' : 'var(--hz-text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', fontWeight: '800',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isActive ? '0 0 20px rgba(99,102,241,0.4)' : 'none'
                }}>
                  {isDone
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    : i + 1
                  }
                </div>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '600',
                  color: isActive ? 'var(--hz-text)' : 'var(--hz-text-muted)',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.3s'
                }}>{label}</span>
              </div>
            );
          })}
        </div>

        <div className="row g-5">
          {/* ── Main Form Area ── */}
          <div className="col-12 col-lg-8">
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--hz-shadow-sm)' }}>
                
                {/* Step 0: Hackathon */}
                <div style={{ display: step === 0 ? 'block' : 'none' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--hz-text)', marginBottom: '0.5rem' }}>Select Hackathon</h2>
                  <p style={{ color: 'var(--hz-text-secondary)', marginBottom: '2rem' }}>Which hackathon are you submitting your project for?</p>
                  
                  {fetchingHackathons ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--hz-text-muted)' }}>
                      <span className="hz-spinner" style={{ marginRight: '0.75rem' }}></span> Loading...
                    </div>
                  ) : hackathons.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--hz-bg)', borderRadius: '16px', border: '1px dashed var(--hz-border)' }}>
                      <p style={{ color: 'var(--hz-text-muted)', fontSize: '1.1rem' }}>No approved hackathon registrations found.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {hackathons.map(h => {
                        const isSelected = form.hackathonId === h.id;
                        return (
                          <div key={h.id}
                            onClick={() => {
                              setForm(prev => ({ 
                                ...prev, 
                                hackathonId: isSelected ? '' : h.id, 
                                teamId: isSelected ? '' : h.teamId 
                              }));
                              if (errors.hackathonId) setErrors(prev => ({ ...prev, hackathonId: '' }));
                            }}
                            style={{
                              padding: '1.5rem', borderRadius: '16px', cursor: 'pointer',
                              border: `2px solid ${isSelected ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
                              background: isSelected ? 'rgba(99,102,241,0.1)' : 'var(--hz-surface)',
                              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                              transition: 'all 0.2s', transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                            }}
                          >
                            <div>
                              <strong style={{ display: 'block', fontSize: '1.25rem', color: isSelected ? 'var(--hz-primary)' : 'var(--hz-text)', marginBottom: '0.25rem' }}>{h.title}</strong>
                              <span style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)' }}>Submitting as: {h.regType === 'team' ? `Team (${h.teamName})` : 'Solo Participant'}</span>
                            </div>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: `2px solid ${isSelected ? 'var(--hz-primary)' : 'var(--hz-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--hz-primary)' : 'transparent' }}>
                              {isSelected && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                          </div>
                        )
                      })}
                      {errors.hackathonId && <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>{errors.hackathonId}</p>}
                    </div>
                  )}
                </div>

                {/* Step 1: Info */}
                <div style={{ display: step === 1 ? 'block' : 'none' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--hz-text)', marginBottom: '0.5rem' }}>Project Information</h2>
                  <p style={{ color: 'var(--hz-text-secondary)', marginBottom: '2rem' }}>Provide the core details of your creation.</p>
                  
                  <Input id="title" label="Project Title" placeholder="e.g. Neural Knights AI" value={form.title} onChange={set('title')} error={errors.title} required />
                  <TextArea id="description" label="Description" placeholder="Describe the problem it solves..." value={form.description} onChange={set('description')} error={errors.description} rows={5} required />
                  <Input id="techStack" label="Tech Stack" placeholder="e.g. React, Node.js" value={form.techStack} onChange={set('techStack')} helperText="List main technologies used." />
                </div>

                {/* Step 2: Links & Files */}
                <div style={{ display: step === 2 ? 'block' : 'none' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--hz-text)', marginBottom: '0.5rem' }}>Links & Resources</h2>
                  <p style={{ color: 'var(--hz-text-secondary)', marginBottom: '2rem' }}>Provide links so judges can explore your work.</p>
                  
                  <Input id="repoUrl" label="GitHub Repository" placeholder="https://github.com/org/repo" value={form.repoUrl} onChange={set('repoUrl')} error={errors.repoUrl} required />
                  <Input id="demoUrl" label="Live Demo URL" placeholder="https://demo.app" value={form.demoUrl} onChange={set('demoUrl')} helperText="Optional." />
                  <Input id="videoUrl" label="Demo Video URL" placeholder="https://youtube.com/..." value={form.videoUrl} onChange={set('videoUrl')} helperText="Optional." />
                  
                  {/* Glassmorphic Drag & Drop */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', color: 'var(--hz-text)' }}>Attachments <span style={{color: 'var(--hz-text-muted)'}}>(Optional)</span></label>
                    <label 
                      onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files && e.dataTransfer.files[0]) setForm(prev => ({...prev, file: e.dataTransfer.files[0]})); }}
                      style={{
                        display: 'block', padding: '3rem', textAlign: 'center', cursor: 'pointer',
                        background: dragActive ? 'rgba(99,102,241,0.05)' : 'var(--hz-bg)',
                        border: `2px dashed ${dragActive ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
                        borderRadius: '16px', transition: 'all 0.2s ease',
                        transform: dragActive ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <input type="file" style={{ display: 'none' }} onChange={(e) => setForm(prev => ({ ...prev, file: e.target.files[0] }))} />
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '50%', background: dragActive ? 'var(--hz-primary)' : 'var(--hz-surface)',
                        color: dragActive ? '#fff' : 'var(--hz-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem', transition: 'all 0.2s', boxShadow: dragActive ? '0 8px 20px rgba(99,102,241,0.3)' : '0 4px 10px rgba(0,0,0,0.05)'
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </div>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: '700', color: 'var(--hz-text)' }}>
                        {form.file ? form.file.name : (
                          <>Drag &amp; drop files or <span style={{ color: 'var(--hz-primary)' }}>browse</span></>
                        )}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>PDF, ZIP, PNG — max 20 MB</p>
                    </label>
                  </div>
                </div>

                {/* Step 3: Review */}
                <div style={{ display: step === 3 ? 'block' : 'none' }}>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--hz-text)', marginBottom: '0.5rem' }}>Review & Submit</h2>
                  <p style={{ color: 'var(--hz-text-secondary)', marginBottom: '2rem' }}>Double-check your details.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                      { label: 'Hackathon', value: hackathons.find(h => h.id === form.hackathonId)?.title },
                      { label: 'Project Title', value: form.title },
                      { label: 'Tech Stack', value: form.techStack },
                      { label: 'GitHub Repo', value: form.repoUrl },
                      { label: 'Live Demo', value: form.demoUrl },
                      { label: 'Demo Video', value: form.videoUrl },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', padding: '1rem', background: 'var(--hz-bg)', borderRadius: '12px', border: '1px solid var(--hz-border)', alignItems: 'center' }}>
                        <span style={{ width: '150px', fontWeight: '700', color: 'var(--hz-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                        <span style={{ fontWeight: '500', color: value ? 'var(--hz-text)' : 'var(--hz-border)', flex: 1, wordBreak: 'break-all' }}>{value || '—'}</span>
                      </div>
                    ))}
                  </div>
                  
                  <TextArea id="notes" label="Additional Notes" placeholder="Anything extra you'd like judges to know..." value={form.notes} onChange={set('notes')} rows={3} />
                  {errors.submit && <p style={{ color: '#ef4444', fontWeight: '600', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px' }}>{errors.submit}</p>}
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--hz-border)' }}>
                  <div>
                    {step > 0 && (
                      <button type="button" onClick={handleBack} style={{ background: 'transparent', border: '2px solid var(--hz-border)', padding: '0.75rem 1.5rem', borderRadius: '10px', fontWeight: '700', color: 'var(--hz-text)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.background='var(--hz-bg)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                        ← Back
                      </button>
                    )}
                  </div>
                  <div>
                    {step < STEPS.length - 1 ? (
                      <button type="button" onClick={handleNext} style={{ background: 'var(--hz-primary)', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)', transition: 'all 0.2s' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                        Continue →
                      </button>
                    ) : (
                      <button type="submit" disabled={loading} style={{ background: 'linear-gradient(135deg, var(--hz-primary) 0%, var(--hz-surface-raised) 100%)', color: '#fff', border: 'none', padding: '0.75rem 2.5rem', borderRadius: '10px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseEnter={e=>{if(!loading) e.currentTarget.style.transform='translateY(-2px)'}} onMouseLeave={e=>{if(!loading) e.currentTarget.style.transform='none'}}>
                        {loading ? <span className="hz-spinner" style={{width:'16px',height:'16px',borderWidth:'2px'}}></span> : null}
                        {loading ? 'Submitting...' : 'Submit Project!'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </form>
          </div>

          {/* ── Dynamic Sidebar ── */}
          <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', borderRadius: '24px', padding: '2rem', boxShadow: 'var(--hz-shadow-sm)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--hz-text)' }}>Checklist</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {checklist.map(({ label, done }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: done ? 'rgba(16,185,129,0.15)' : 'var(--hz-bg)',
                      border: `2px solid ${done ? '#10b981' : 'var(--hz-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease'
                    }}>
                      {done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: done ? '600' : '500', color: done ? 'var(--hz-text)' : 'var(--hz-text-muted)', transition: 'color 0.3s' }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              background: 'linear-gradient(135deg, var(--hz-bg) 0%, var(--hz-primary) 100%)', 
              borderRadius: '24px', padding: '2rem', color: '#fff', position: 'relative', overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(99,102,241,0.2)'
            }}>
              {/* Abstract decorative background */}
              <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '120px', height: '120px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Pro Tips
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <li style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>Make sure your GitHub repo is public so judges can view your code.</li>
                <li style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>Include a detailed README with setup instructions.</li>
                <li style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.9)' }}>Keep your demo video short, ideally under 3 minutes.</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
