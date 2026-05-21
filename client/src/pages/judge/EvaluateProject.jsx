import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProjectByIdApi, submitEvaluationApi, saveDraftEvaluationApi } from '../../api/evaluation.api';
import { Button, Card, Badge, LoadingSpinner, TextArea } from '../../components/ui';

export default function EvaluateProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [scores, setScores] = useState({
    innovation: 0,
    technicalExecution: 0,
    marketReadiness: 0,
    presentation: 0
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    getProjectByIdApi(id).then(data => {
      setProject(data);
      if (data.evaluation) {
        setScores({
          innovation: data.evaluation.innovation || 0,
          technicalExecution: data.evaluation.technicalExecution || 0,
          marketReadiness: data.evaluation.marketReadiness || 0,
          presentation: data.evaluation.presentation || 0
        });
        setFeedback(data.evaluation.feedback || '');
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      navigate('/judge/projects');
    });
  }, [id, navigate]);

  const totalScore = scores.innovation + scores.technicalExecution + scores.marketReadiness + scores.presentation;

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitEvaluationApi(id, { ...scores, feedback });
    navigate('/judge/projects');
  };

  const handleSaveDraft = async () => {
    setDrafting(true);
    await saveDraftEvaluationApi(id, { ...scores, feedback });
    navigate('/judge/projects');
  };

  if (loading) {
    return <div className="hz-page hz-container hz-spinner-wrap--centered"><LoadingSpinner size="lg" /></div>;
  }

  const SliderField = ({ label, value, onChange }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label className="hz-label" style={{ margin: 0 }}>{label}</label>
        <Badge variant="neutral" style={{ background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', fontWeight: 600, padding: '0.25rem 0.5rem' }}>
          {value}/10
        </Badge>
      </div>
      <input 
        type="range" 
        min="0" max="10" 
        value={value} 
        onChange={e => onChange(Number(e.target.value))} 
        style={{ width: '100%', accentColor: 'var(--hz-primary)', cursor: 'pointer' }}
      />
    </div>
  );

  return (
    <div className="hz-page hz-container">
      <Link to="/judge/projects" className="hz-text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="hz-heading-1" style={{ margin: 0 }}>{project.title}</h1>
            <Badge variant="primary" style={{ fontSize: '0.875rem', padding: '0.3rem 0.75rem', background: '#eef2ff', color: '#4f46e5' }}>Project #{project.id}</Badge>
          </div>
          <p className="hz-text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 500, margin: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Team: <span style={{ color: 'var(--hz-text)' }}>{project.teamName}</span>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Project Details */}
        <Card padding style={{ border: '1px solid var(--hz-border)' }}>
          <h3 className="hz-heading-3" style={{ marginBottom: '1rem' }}>Project Description</h3>
          <p className="hz-text-secondary" style={{ lineHeight: 1.6, marginBottom: '2rem' }}>
            {project.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--hz-border)', borderRadius: 'var(--hz-radius-sm)', color: 'var(--hz-text)', fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                GitHub Repository
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--hz-border)', borderRadius: 'var(--hz-radius-sm)', color: 'var(--hz-text)', fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 10.5L21 3"></path><path d="M16 3h5v5"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg>
                Live Demo
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </a>
          </div>

          <p className="hz-text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Attachments</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div 
              onClick={() => setShowImageModal(true)}
              style={{ position: 'relative', borderRadius: 'var(--hz-radius-sm)', overflow: 'hidden', cursor: 'pointer', background: '#1e293b', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem 1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Architecture Diagram
              </div>
            </div>
            <div 
              onClick={() => setShowVideoModal(true)}
              style={{ position: 'relative', borderRadius: 'var(--hz-radius-sm)', overflow: 'hidden', cursor: 'pointer', background: '#0f172a', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem 1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                Demo Video
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Evaluation Form */}
        <Card padding style={{ border: '1px solid var(--hz-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 className="hz-heading-3" style={{ margin: 0 }}>Evaluation</h3>
            <div style={{ textAlign: 'right' }}>
              <p className="hz-text-muted" style={{ fontSize: '0.75rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Total Score</p>
              <div style={{ fontSize: '1.25rem', color: 'var(--hz-text-muted)' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hz-primary)' }}>{totalScore}</span> / 40
              </div>
            </div>
          </div>

          <SliderField label="Innovation" value={scores.innovation} onChange={(val) => setScores({ ...scores, innovation: val })} />
          <SliderField label="Technical Execution" value={scores.technicalExecution} onChange={(val) => setScores({ ...scores, technicalExecution: val })} />
          <SliderField label="Market Readiness" value={scores.marketReadiness} onChange={(val) => setScores({ ...scores, marketReadiness: val })} />
          <SliderField label="Presentation" value={scores.presentation} onChange={(val) => setScores({ ...scores, presentation: val })} />

          <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Written Feedback</h4>
            <TextArea 
              placeholder="What did the team do well? Where could they improve?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ minHeight: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Score fairly and constructively.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button size="lg" onClick={handleSubmit} disabled={submitting || drafting}>
              {submitting ? 'Submitting...' : 'Submit Evaluation'}
            </Button>
            <Button variant="outline" size="lg" onClick={handleSaveDraft} disabled={submitting || drafting} style={{ background: 'var(--hz-surface)', borderColor: 'var(--hz-border)', color: 'var(--hz-text)' }}>
              {drafting ? 'Saving...' : 'Save Draft'}
            </Button>
          </div>
        </Card>

      </div>

      {/* Modals for Attachments */}
      {showImageModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)' }}>
          <div style={{ position: 'relative', width: '80%', height: '80%', background: '#1e293b', borderRadius: 'var(--hz-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => setShowImageModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <p style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>Architecture Diagram (Mock)</p>
          </div>
        </div>
      )}

      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)' }}>
          <div style={{ position: 'relative', width: '80%', height: '80%', background: 'black', borderRadius: 'var(--hz-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => setShowVideoModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', zIndex: 10 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.2)' }}>
              <div style={{ width: '30%', height: '100%', background: 'var(--hz-primary)' }}></div>
            </div>
            <p style={{ position: 'absolute', bottom: '2rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>Demo Video Player (Mock)</p>
          </div>
        </div>
      )}

    </div>
  );
}
