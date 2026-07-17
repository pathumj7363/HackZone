import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitProjectApi } from '../../api/submission.api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';

const STEPS = ['Project Info', 'Links & Files', 'Review & Submit'];

export default function ProjectSubmission() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    techStack: '',
    repoUrl: '',
    demoUrl: '',
    videoUrl: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 0) {
      if (!form.title.trim()) newErrors.title = 'Project title is required.';
      if (!form.description.trim()) newErrors.description = 'Description is required.';
    }
    if (step === 1) {
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
      await submitProjectApi({
        title: form.title,
        description: form.description,
        techStack: form.techStack,
        repoUrl: form.repoUrl,
        demoUrl: form.demoUrl,
        videoUrl: form.videoUrl,
        notes: form.notes,
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'Submission failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="hz-page">
        <div className="hz-container">
          <div style={{ maxWidth: '560px', margin: '4rem auto', textAlign: 'center' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="hz-heading-2" style={{ fontWeight: 'var(--hz-font-weight-bold)', marginBottom: '0.5rem' }}>
              Project Submitted!
            </h1>
            <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-base)', marginBottom: '2rem' }}>
              Your project <strong style={{ color: 'var(--hz-text)' }}>{form.title}</strong> has been successfully submitted. The judges will review it shortly.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => navigate('/submissions')}>
                View My Submissions
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back to Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Stepper progress ───────────────────────────────────────────────────────
  const StepBar = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--hz-space-8)' }}>
      {STEPS.map((label, i) => {
        const isActive = i === step;
        const isDone = i < step;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: isDone ? '#10b981' : isActive ? 'var(--hz-primary)' : 'var(--hz-surface)',
                border: `2px solid ${isDone ? '#10b981' : isActive ? 'var(--hz-primary)' : 'var(--hz-border)'}`,
                color: isDone || isActive ? '#fff' : 'var(--hz-text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--hz-font-size-xs)',
                fontWeight: 'var(--hz-font-weight-bold)',
                transition: 'all 0.3s ease'
              }}>
                {isDone
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  : i + 1
                }
              </div>
              <span style={{
                fontSize: 'var(--hz-font-size-xs)',
                fontWeight: isActive ? 'var(--hz-font-weight-bold)' : 'var(--hz-font-weight-medium)',
                color: isActive ? 'var(--hz-text)' : 'var(--hz-text-muted)',
                whiteSpace: 'nowrap'
              }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: '2px', margin: '0 0.5rem',
                marginBottom: '1.2rem',
                background: i < step ? '#10b981' : 'var(--hz-border)',
                transition: 'background 0.3s ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  // ── Main Layout ─────────────────────────────────────────────────────────────
  return (
    <div className="hz-page">
      <div className="hz-container">

        {/* Page Header */}
        <div style={{ marginBottom: 'var(--hz-space-6)' }}>
          <h1 className="hz-heading-2" style={{ marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-medium)' }}>
            Submit Project
          </h1>
          <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-base)' }}>
            Complete all steps to submit your hackathon project for judging.
          </p>
        </div>

        {/* Stepper */}
        <StepBar />

        <div className="row g-4">
          {/* ── Left: Form ──────────────────────────────────────────────── */}
          <div className="col-12 col-lg-8">
            <form onSubmit={handleSubmit} noValidate>
              <Card padding>

                {/* STEP 0 — Project Info */}
                {step === 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <h2 style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 0.25rem' }}>
                        Project Information
                      </h2>
                      <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)' }}>
                        Tell us about what you built.
                      </p>
                    </div>

                    <Input
                      id="title"
                      name="title"
                      label="Project Title"
                      placeholder="e.g. Neural Knights AI Assistant"
                      value={form.title}
                      onChange={set('title')}
                      error={errors.title}
                      required
                    />

                    <TextArea
                      id="description"
                      name="description"
                      label="Project Description"
                      placeholder="Describe what your project does, the problem it solves, and the impact it creates..."
                      value={form.description}
                      onChange={set('description')}
                      error={errors.description}
                      rows={5}
                      required
                    />

                    <Input
                      id="techStack"
                      name="techStack"
                      label="Tech Stack"
                      placeholder="e.g. React, Node.js, PostgreSQL, OpenAI API"
                      value={form.techStack}
                      onChange={set('techStack')}
                      helperText="List the main technologies used in your project."
                    />
                  </div>
                )}

                {/* STEP 1 — Links & Files */}
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <h2 style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 0.25rem' }}>
                        Links &amp; Resources
                      </h2>
                      <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)' }}>
                        Provide links so judges can explore your work.
                      </p>
                    </div>

                    <Input
                      id="repoUrl"
                      name="repoUrl"
                      label="GitHub Repository"
                      placeholder="https://github.com/your-org/your-repo"
                      value={form.repoUrl}
                      onChange={set('repoUrl')}
                      error={errors.repoUrl}
                      required
                    />

                    <Input
                      id="demoUrl"
                      name="demoUrl"
                      label="Live Demo URL"
                      placeholder="https://your-demo.vercel.app"
                      value={form.demoUrl}
                      onChange={set('demoUrl')}
                      helperText="Optional — share a working link to your deployed project."
                    />

                    <Input
                      id="videoUrl"
                      name="videoUrl"
                      label="Demo Video URL"
                      placeholder="https://youtube.com/watch?v=..."
                      value={form.videoUrl}
                      onChange={set('videoUrl')}
                      helperText="Optional — a short walkthrough video (YouTube, Loom, etc.)"
                    />

                    {/* File upload area (UI only) */}
                    <div>
                      <label className="hz-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                        Attachments <span style={{ color: 'var(--hz-text-muted)', fontWeight: 'normal' }}>(optional)</span>
                      </label>
                      <div style={{
                        border: '2px dashed var(--hz-border)',
                        borderRadius: 'var(--hz-radius)',
                        padding: '2rem',
                        textAlign: 'center',
                        background: 'var(--hz-surface)',
                        cursor: 'pointer',
                        transition: 'border-color var(--hz-transition)'
                      }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}
                      >
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: 'var(--hz-primary-light)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          margin: '0 auto 0.75rem'
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </div>
                        <p style={{ margin: '0 0 0.25rem', fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-medium)', color: 'var(--hz-text)' }}>
                          Drag &amp; drop files here, or <span style={{ color: 'var(--hz-primary)', fontWeight: 'var(--hz-font-weight-bold)' }}>browse</span>
                        </p>
                        <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-xs)' }}>
                          PDF, ZIP, PNG — max 20 MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 — Review */}
                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <h2 style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 0.25rem' }}>
                        Review &amp; Submit
                      </h2>
                      <p className="hz-text-muted" style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)' }}>
                        Double-check your details before final submission.
                      </p>
                    </div>

                    {/* Summary rows */}
                    {[
                      { label: 'Project Title', value: form.title || '—' },
                      { label: 'Tech Stack', value: form.techStack || '—' },
                      { label: 'GitHub Repo', value: form.repoUrl || '—' },
                      { label: 'Live Demo', value: form.demoUrl || '—' },
                      { label: 'Demo Video', value: form.videoUrl || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        display: 'flex', gap: '1rem',
                        padding: '0.875rem',
                        borderRadius: 'var(--hz-radius-sm)',
                        background: 'var(--hz-surface)',
                        alignItems: 'flex-start'
                      }}>
                        <span style={{
                          minWidth: '130px', fontSize: 'var(--hz-font-size-xs)',
                          fontWeight: 'var(--hz-font-weight-bold)',
                          color: 'var(--hz-text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.07em',
                          paddingTop: '2px'
                        }}>{label}</span>
                        <span style={{
                          fontSize: 'var(--hz-font-size-sm)',
                          color: value === '—' ? 'var(--hz-text-muted)' : 'var(--hz-text)',
                          fontWeight: 'var(--hz-font-weight-medium)',
                          wordBreak: 'break-all'
                        }}>{value}</span>
                      </div>
                    ))}

                    {/* Description preview */}
                    <div style={{
                      padding: '0.875rem',
                      borderRadius: 'var(--hz-radius-sm)',
                      background: 'var(--hz-surface)'
                    }}>
                      <span style={{
                        display: 'block', fontSize: 'var(--hz-font-size-xs)',
                        fontWeight: 'var(--hz-font-weight-bold)',
                        color: 'var(--hz-text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.07em',
                        marginBottom: '0.5rem'
                      }}>Description</span>
                      <p style={{
                        margin: 0, fontSize: 'var(--hz-font-size-sm)',
                        color: form.description ? 'var(--hz-text)' : 'var(--hz-text-muted)',
                        lineHeight: '1.6'
                      }}>
                        {form.description || '—'}
                      </p>
                    </div>

                    <TextArea
                      id="notes"
                      name="notes"
                      label="Additional Notes to Judges"
                      placeholder="Anything extra you'd like the judges to know..."
                      value={form.notes}
                      onChange={set('notes')}
                      rows={3}
                    />

                    {errors.submit && (
                      <p className="hz-field-error" role="alert">{errors.submit}</p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: '2rem', paddingTop: '1.25rem',
                  borderTop: '1px solid var(--hz-border)'
                }}>
                  <div>
                    {step > 0 && (
                      <Button variant="outline" type="button" onClick={handleBack}>
                        ← Back
                      </Button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {step < STEPS.length - 1 ? (
                      <Button variant="primary" type="button" onClick={handleNext}>
                        Continue →
                      </Button>
                    ) : (
                      <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="hz-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>
                            Submitting...
                          </span>
                        ) : (
                          <>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.4rem' }}>
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            Submit Project
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </form>
          </div>

          {/* ── Right: Sidebar ──────────────────────────────────────────── */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">

            {/* Submission Checklist */}
            <Card padding>
              <h2 style={{ fontSize: 'var(--hz-font-size-lg)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: '0 0 1.25rem' }}>
                Submission Checklist
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {[
                  { label: 'Project title filled', done: !!form.title.trim() },
                  { label: 'Description added', done: !!form.description.trim() },
                  { label: 'GitHub repo linked', done: !!form.repoUrl.trim() },
                  { label: 'Live demo URL', done: !!form.demoUrl.trim() },
                  { label: 'Demo video provided', done: !!form.videoUrl.trim() },
                ].map(({ label, done }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      background: done ? 'rgba(16,185,129,0.12)' : 'var(--hz-surface)',
                      border: `1.5px solid ${done ? '#10b981' : 'var(--hz-border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}>
                      {done && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <span style={{
                      fontSize: 'var(--hz-font-size-sm)',
                      color: done ? 'var(--hz-text)' : 'var(--hz-text-muted)',
                      fontWeight: done ? 'var(--hz-font-weight-medium)' : 'normal',
                      textDecoration: done ? 'none' : 'none'
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tips Card */}
            <Card padding={false} style={{
              background: 'linear-gradient(135deg, var(--hz-primary) 0%, #312e81 100%)',
              border: 'none', borderRadius: 'var(--hz-radius)',
              position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--hz-shadow-md)'
            }}>
              {/* Decorative circles */}
              <div style={{ position: 'absolute', bottom: '-24px', right: '-24px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '16px', right: '-48px', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

              <div style={{ padding: 'var(--hz-space-6)', position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: 'var(--hz-font-size-lg)', fontWeight: 'var(--hz-font-weight-bold)', color: '#fff', margin: '0 0 0.75rem' }}>
                  💡 Submission Tips
                </h3>
                <ul style={{ margin: 0, padding: '0 0 0 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[
                    'Make sure your repo is public.',
                    'Include a clear README with setup steps.',
                    'Demo video should be under 3 minutes.',
                    'Double-check all links are working.',
                  ].map((tip, i) => (
                    <li key={i} style={{ color: 'rgba(255,255,255,0.85)', fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.5' }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
