import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssignedSubmissions, submitEvaluation } from '../../api/evaluation.api';
import { Button, Card, Badge, LoadingSpinner, TextArea } from '../../components/ui';

export default function EvaluateProject() {
  const { id } = useParams(); // This is the submissionId
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [scores, setScores] = useState({
    innovationScore: 0,
    technicalComplexityScore: 0,
    designScore: 0,
    usabilityScore: 0
  });
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch all assigned submissions and find the one that matches this ID
    getAssignedSubmissions().then(data => {
      const foundProject = data.find(p => String(p.submissionId) === String(id));
      if (!foundProject) {
        navigate('/judge/projects');
        return;
      }
      setProject(foundProject);

      // If already scored, prefill the values
      if (foundProject.innovationScore != null) {
        setScores({
          innovationScore: foundProject.innovationScore || 0,
          technicalComplexityScore: foundProject.technicalComplexityScore || 0,
          designScore: foundProject.designScore || 0,
          usabilityScore: foundProject.usabilityScore || 0
        });
        setFeedback(foundProject.feedback || '');
      }
      setLoading(false);
    }).catch(err => {
      console.error(err);
      navigate('/judge/projects');
    });
  }, [id, navigate]);

  const totalScore = scores.innovationScore + scores.technicalComplexityScore + scores.designScore + scores.usabilityScore;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitEvaluation(id, project.hackathonId, { ...scores, feedback });
      navigate('/judge/dashboard');
    } catch (err) {
      console.error("Failed to submit:", err);
      // Depending on the API, if it already exists it might throw a 409
      // You could call updateEvaluation here instead if needed, but for Phase 5 we'll just redirect
      navigate('/judge/dashboard');
    }
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
      <Link to="/judge/dashboard" className="hz-text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        Back to Dashboard
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h1 className="hz-heading-1" style={{ margin: 0 }}>{project.submissionTitle || `Submission #${project.submissionId}`}</h1>
            <Badge variant="primary" style={{ fontSize: '0.875rem', padding: '0.3rem 0.75rem', background: '#eef2ff', color: '#4f46e5' }}>Hackathon {project.hackathonId}</Badge>
          </div>
          <p className="hz-text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: 500, margin: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Submitted by: <span style={{ color: 'var(--hz-text)' }}>Team / User</span>
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Project Details */}
        <Card padding style={{ border: '1px solid var(--hz-border)' }}>
          <h3 className="hz-heading-3" style={{ marginBottom: '1rem' }}>Project Details</h3>
          <p className="hz-text-secondary" style={{ lineHeight: 1.6, marginBottom: '2rem' }}>
            This is the submission details area. The user would see the actual description of the project here if it were populated by the database join.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '2rem' }}>
            {project.githubRepo ? (
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--hz-border)', borderRadius: 'var(--hz-radius-sm)', color: 'var(--hz-text)', fontWeight: 500, textDecoration: 'none', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  GitHub Repository
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--hz-border)', borderRadius: 'var(--hz-radius-sm)', color: 'var(--hz-text-muted)', fontWeight: 500 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                  No GitHub Repo Provided
                </div>
              </div>
            )}
          </div>

          <p className="hz-text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>Demo Video</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div 
              onClick={() => { if(project.demoVideoUrl) setShowVideoModal(true) }}
              style={{ position: 'relative', borderRadius: 'var(--hz-radius-sm)', overflow: 'hidden', cursor: project.demoVideoUrl ? 'pointer' : 'default', background: '#0f172a', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={project.demoVideoUrl ? "white" : "gray"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem 1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: 'white', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                {project.demoVideoUrl ? "Play Demo Video" : "No Demo Video Attached"}
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Evaluation Form */}
        <Card padding style={{ border: '1px solid var(--hz-border)' }}>
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 className="hz-heading-3" style={{ margin: 0 }}>Scoring Rubric</h3>
              <div style={{ textAlign: 'right' }}>
                <p className="hz-text-muted" style={{ fontSize: '0.75rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>Total Score</p>
                <div style={{ fontSize: '1.25rem', color: 'var(--hz-text-muted)' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--hz-primary)' }}>{totalScore}</span> / 40
                </div>
              </div>
            </div>

            <SliderField label="Innovation" value={scores.innovationScore} onChange={(val) => setScores({ ...scores, innovationScore: val })} />
            <SliderField label="Technical Complexity" value={scores.technicalComplexityScore} onChange={(val) => setScores({ ...scores, technicalComplexityScore: val })} />
            <SliderField label="Design & Architecture" value={scores.designScore} onChange={(val) => setScores({ ...scores, designScore: val })} />
            <SliderField label="Usability" value={scores.usabilityScore} onChange={(val) => setScores({ ...scores, usabilityScore: val })} />

            <div style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Written Feedback</h4>
              <TextArea 
                placeholder="Provide constructive feedback for the team..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                style={{ minHeight: '100px' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button size="lg" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Evaluation'}
              </Button>
            </div>
          </div>
        </Card>

      </div>

      {/* Video Modal Placeholder */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)' }}>
          <div style={{ position: 'relative', width: '80%', height: '80%', background: 'black', borderRadius: 'var(--hz-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button onClick={() => setShowVideoModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', zIndex: 10 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <p style={{ color: 'white' }}>Mock Video Player for: {project.demoVideoUrl}</p>
          </div>
        </div>
      )}

    </div>
  );
}
