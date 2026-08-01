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
    <div className="hz-page" style={{ paddingBottom: '4rem', background: 'var(--hz-bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
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
            <a href="#" onClick={(e) => { e.preventDefault(); navigate(-1); }} className="hz-text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--hz-text-muted)'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              Back to Dashboard
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, color: 'var(--hz-text)', letterSpacing: '-0.02em' }}>
                {project.submissionTitle || `Submission #${project.submissionId}`}
              </h1>
              <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--hz-primary)', padding: '0.35rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700' }}>
                Hackathon {project.hackathonId}
              </span>
            </div>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', color: 'var(--hz-text-secondary)', margin: 0, fontWeight: 500 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Submitted by <span style={{ color: 'var(--hz-text)', fontWeight: 700 }}>Team / User</span>
            </p>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease' }}>
        <div className="row g-4">

          {/* Left Column: Project Details */}
          <div className="col-12 col-lg-7">
            <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', height: '100%' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 1.5rem', color: 'var(--hz-text)' }}>Project Details</h3>
              <div style={{ background: 'var(--hz-bg)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed var(--hz-border)', marginBottom: '2.5rem' }}>
                <p style={{ color: 'var(--hz-text-secondary)', lineHeight: 1.6, margin: 0, fontSize: '1rem' }}>
                  This is the submission details area. The user would see the actual description of the project here if it were populated by the database join.
                </p>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--hz-text)' }}>Repository</h4>
              <div style={{ marginBottom: '2.5rem' }}>
                {project.githubRepo ? (
                  <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', border: '1px solid var(--hz-border)', borderRadius: '16px', background: 'var(--hz-bg)', color: 'var(--hz-text)', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--hz-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hz-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                      </div>
                      <span style={{ fontSize: '1.05rem' }}>GitHub Repository</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hz-primary)' }}>
                      <span style={{ fontSize: '0.9rem' }}>View Source</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </div>
                  </a>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', border: '1px dashed var(--hz-border)', borderRadius: '16px', background: 'var(--hz-bg)', color: 'var(--hz-text-muted)', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                      No GitHub Repo Provided
                    </div>
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--hz-text)' }}>Demo Video</h4>
              <div>
                <div
                  onClick={() => { if (project.demoVideoUrl) setShowVideoModal(true) }}
                  style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', cursor: project.demoVideoUrl ? 'pointer' : 'default', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--hz-border)', transition: 'all 0.2s', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  onMouseEnter={e => { if (project.demoVideoUrl) { e.currentTarget.style.transform = 'scale(1.02)'; } }}
                  onMouseLeave={e => { if (project.demoVideoUrl) { e.currentTarget.style.transform = 'scale(1)'; } }}
                >
                  <div style={{ width: '80px', height: '80px', background: project.demoVideoUrl ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill={project.demoVideoUrl ? "white" : "none"} stroke={project.demoVideoUrl ? "white" : "rgba(255,255,255,0.3)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: project.demoVideoUrl ? '6px' : '0' }}><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', color: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', background: project.demoVideoUrl ? 'var(--hz-primary)' : 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    </div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>{project.demoVideoUrl ? "Play Demo Video" : "No Demo Video Attached"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Evaluation Form */}
          <div className="col-12 col-lg-5">
            <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-primary)', padding: '2.5rem', boxShadow: '0 10px 40px rgba(99,102,241,0.1)', position: 'sticky', top: '2rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--hz-border)' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)' }}>Scoring Rubric</h3>
                  <p style={{ margin: 0, color: 'var(--hz-text-secondary)', fontSize: '0.9rem' }}>Evaluate the project out of 40 points.</p>
                </div>
                <div style={{ textAlign: 'right', background: 'var(--hz-bg)', padding: '0.75rem 1.25rem', borderRadius: '16px', border: '1px solid var(--hz-border)' }}>
                  <p style={{ fontSize: '0.75rem', margin: '0 0 0.25rem 0', fontWeight: 700, color: 'var(--hz-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Score</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--hz-primary)', lineHeight: 1 }}>{totalScore}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--hz-text-muted)' }}>/ 40</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <SliderField label="Innovation & Originality" value={scores.innovationScore} onChange={(val) => setScores({ ...scores, innovationScore: val })} />
                <SliderField label="Technical Complexity" value={scores.technicalComplexityScore} onChange={(val) => setScores({ ...scores, technicalComplexityScore: val })} />
                <SliderField label="Design & Architecture" value={scores.designScore} onChange={(val) => setScores({ ...scores, designScore: val })} />
                <SliderField label="Usability & Polish" value={scores.usabilityScore} onChange={(val) => setScores({ ...scores, usabilityScore: val })} />
              </div>

              <div style={{ marginBottom: '2.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--hz-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Constructive Feedback
                </h4>
                <textarea
                  placeholder="Provide detailed feedback for the team to help them improve..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="hz-input"
                  style={{ 
                    width: '100%', minHeight: '150px', padding: '1.25rem', borderRadius: '16px', 
                    border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)',
                    fontSize: '1rem', lineHeight: 1.6, outline: 'none', resize: 'vertical'
                  }}
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={submitting}
                style={{ 
                  width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: 700,
                  background: 'linear-gradient(90deg, var(--hz-primary) 0%, #a855f7 100%)', color: 'white', border: 'none',
                  boxShadow: '0 8px 25px rgba(99,102,241,0.4)', transition: 'all 0.2s', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1
                }}
                onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(99,102,241,0.5)'; } }}
                onMouseLeave={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'; } }}
              >
                {submitting ? 'Submitting Evaluation...' : 'Submit Evaluation'}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* Video Modal Placeholder */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(10px)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '1000px', aspectRatio: '16/9', background: '#000', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <button 
              onClick={() => setShowVideoModal(false)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, marginBottom: '1rem' }}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem' }}>Video Player Demo</h3>
              <p style={{ opacity: 0.7 }}>URL: {project.demoVideoUrl}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
