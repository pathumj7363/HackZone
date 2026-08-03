import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAssignedSubmissions, submitEvaluation } from '../../api/evaluation.api';
import { LoadingSpinner } from '../../components/ui';

export default function EvaluateProject() {
  const { id } = useParams(); // submissionId
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Dynamic scoring state
  const [dynamicScores, setDynamicScores] = useState([]);
  const [activeAreaIndex, setActiveAreaIndex] = useState(0);
  
  // Refs for keyboard navigation
  const scoreInputsRef = useRef([]);

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getFileUrl = (url, action) => {
    if (!url) return '#';
    let cleanUrl = url.replace('http://localhost:5000', '');
    if (cleanUrl.startsWith('http')) return cleanUrl;
    return `${backendUrl}${cleanUrl.replace('/uploads/', `/api/files/${action}/`)}`;
  };

  useEffect(() => {
    getAssignedSubmissions().then(data => {
      const foundProject = data.find(p => String(p.submissionId) === String(id));
      if (!foundProject) {
        navigate('/judge/projects');
        return;
      }
      setProject(foundProject);

      if (foundProject.dynamicScores && Array.isArray(foundProject.dynamicScores) && foundProject.dynamicScores.length > 0) {
        setDynamicScores(foundProject.dynamicScores.map(ds => ({ ...ds, feedback: ds.feedback || '', metrics: ds.metrics || [] })));
      } else if (foundProject.judgeEvaluationAreas && Array.isArray(foundProject.judgeEvaluationAreas) && foundProject.judgeEvaluationAreas.length > 0) {
        setDynamicScores(foundProject.judgeEvaluationAreas.map(area => ({ criteria: area, metrics: [], feedback: '' })));
      } else {
        setDynamicScores([{ criteria: 'Overall Impression', metrics: [], feedback: '' }]);
      }
      
      setLoading(false);
    }).catch(err => {
      console.error(err);
      navigate('/judge/projects');
    });
  }, [id, navigate]);

  const addCriteria = () => {
    setDynamicScores([...dynamicScores, { criteria: 'New Criteria', metrics: [], feedback: '' }]);
  };

  const removeCriteria = (index) => {
    const newScores = [...dynamicScores];
    newScores.splice(index, 1);
    setDynamicScores(newScores);
    if (activeAreaIndex >= newScores.length) {
      setActiveAreaIndex(Math.max(0, newScores.length - 1));
    }
  };

  const updateCriteria = (index, field, value) => {
    const newScores = [...dynamicScores];
    newScores[index][field] = value;
    setDynamicScores(newScores);
  };

  const addMetric = () => {
    const newScores = [...dynamicScores];
    if (!newScores[activeAreaIndex].metrics) newScores[activeAreaIndex].metrics = [];
    newScores[activeAreaIndex].metrics.push({ name: '', score: '' });
    setDynamicScores(newScores);
  };

  const removeMetric = (metricIndex) => {
    const newScores = [...dynamicScores];
    newScores[activeAreaIndex].metrics.splice(metricIndex, 1);
    setDynamicScores(newScores);
  };

  const updateMetric = (metricIndex, field, value) => {
    const newScores = [...dynamicScores];
    newScores[activeAreaIndex].metrics[metricIndex][field] = value;
    setDynamicScores(newScores);
  };

  const getAreaAverage = (areaObj) => {
    if (areaObj.metrics && areaObj.metrics.length > 0) {
      const sum = areaObj.metrics.reduce((acc, m) => acc + (Number(m.score) || 0), 0);
      return Math.round(sum / areaObj.metrics.length);
    }
    return Number(areaObj.score) || 0;
  };

  const calculateAverage = () => {
    if (dynamicScores.length === 0) return 0;
    const sum = dynamicScores.reduce((acc, curr) => acc + getAreaAverage(curr), 0);
    return Math.round(sum / dynamicScores.length);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Convert empty strings to 0 before saving
      const finalScores = dynamicScores.map(ds => ({ 
        ...ds, 
        score: getAreaAverage(ds),
        metrics: (ds.metrics || []).map(m => ({ ...m, score: Number(m.score) || 0 }))
      }));
      await submitEvaluation(id, project.hackathonId, { dynamicScores: finalScores, feedback: '' });
      navigate('/judge/dashboard');
    } catch (err) {
      console.error("Failed to submit:", err);
      navigate('/judge/dashboard');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--hz-bg)' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // --- STYLING ---
  const pageStyle = {
    background: 'var(--hz-bg)',
    minHeight: '100vh',
    color: 'var(--hz-text)',
    fontFamily: '"Inter", sans-serif',
    paddingBottom: '120px' // space for sticky footer
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  };

  const sectionLabelStyle = {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--hz-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    background: 'var(--hz-bg)',
    border: '1px solid var(--hz-border)',
    borderRadius: '6px',
    color: 'var(--hz-text)',
    fontSize: '1rem',
    outline: 'none',
    padding: '0.75rem 1rem',
    transition: 'all 0.2s',
    width: '100%'
  };

  const allAreasEvaluated = dynamicScores.length > 0 && dynamicScores.every(ds => ds.metrics && ds.metrics.length > 0);

  return (
    <div style={pageStyle}>
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .minimal-input:focus { border-color: var(--hz-primary) !important; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
        .row-hover:hover { background: rgba(255,255,255,0.02); }
      `}</style>
      
      {/* Navbar / Top Back Button */}
      <div style={{ borderBottom: '1px solid var(--hz-border)', position: 'sticky', top: 0, background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'transparent', border: 'none', color: 'var(--hz-text-muted)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Back
          </button>
        </div>
      </div>

      <div style={containerStyle}>
        
        {/* --- HEADER --- */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.2 }}>
            {project.submissionTitle || `Submission #${project.submissionId}`}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--hz-text-secondary)', fontSize: '0.95rem' }}>
            <span>By <strong>{project.teamName}</strong></span>
            <span style={{ color: 'var(--hz-border)' }}>|</span>
            <span>Hackathon {project.hackathonId}</span>
          </div>
        </div>

        {/* --- PROJECT CONTENT --- */}
        <div style={{ marginBottom: '3rem', background: 'var(--hz-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={sectionLabelStyle}>Description</div>
            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.7, color: 'var(--hz-text-secondary)', whiteSpace: 'pre-line' }}>
              {project.description || 'No description provided.'}
            </p>
          </div>

          {project.techStack && (
            <div style={{ marginBottom: '2.5rem' }}>
              <div style={sectionLabelStyle}>Tech Stack</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.techStack.split(',').map((tech, idx) => (
                  <span key={idx} style={{ padding: '0.25rem 0.75rem', background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--hz-text)' }}>
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.notes && (
            <div style={{ marginBottom: '2.5rem', padding: '1rem', background: 'var(--hz-surface)', borderLeft: '3px solid var(--hz-border)', borderRadius: '0 8px 8px 0' }}>
              <div style={sectionLabelStyle}>Participant Notes</div>
              <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--hz-text-secondary)', whiteSpace: 'pre-line' }}>
                {project.notes}
              </p>
            </div>
          )}

          {/* Links Row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {project.githubRepo && (
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--hz-text)', textDecoration: 'none', background: 'var(--hz-surface)', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--hz-border)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                Repository
              </a>
            )}
            {project.demoVideoUrl && (
              <button onClick={() => setShowVideoModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--hz-text)', textDecoration: 'none', background: 'var(--hz-surface)', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--hz-border)', cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                Demo Video
              </button>
            )}
            {project.fileUrl && (
              <a href={getFileUrl(project.fileUrl, 'download')} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--hz-text)', textDecoration: 'none', background: 'var(--hz-surface)', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--hz-border)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
                Attached File
              </a>
            )}
          </div>
        </div>

        {/* --- EVALUATION FORM --- */}
        <div style={{ background: 'var(--hz-surface)', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--hz-border)', borderTop: '4px solid var(--hz-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>Area-Specific Evaluation</h2>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--hz-text-secondary)' }}>Select an area from the dropdown below to provide its score and specific feedback.</p>
          </div>

          {dynamicScores.length > 0 && (
            <>
              {/* Area Selector */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={sectionLabelStyle}>Select Evaluation Area</div>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={activeAreaIndex} 
                    onChange={(e) => setActiveAreaIndex(Number(e.target.value))}
                    style={{ 
                      width: '100%', padding: '1rem', borderRadius: '8px', 
                      border: '1px solid var(--hz-primary)', background: 'var(--hz-bg)', color: 'var(--hz-text)',
                      fontSize: '1rem', fontWeight: 600, appearance: 'none', cursor: 'pointer'
                    }}
                  >
                    {dynamicScores.map((ds, idx) => (
                      <option key={idx} value={idx}>{ds.criteria}</option>
                    ))}
                  </select>
                  <svg style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>

              {/* Active Area Form */}
              <div style={{ padding: '2rem', background: 'var(--hz-bg)', borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{dynamicScores[activeAreaIndex].criteria}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--hz-surface)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--hz-primary)' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--hz-text-muted)' }}>AREA AVERAGE</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--hz-primary)' }}>{getAreaAverage(dynamicScores[activeAreaIndex])}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--hz-text-muted)' }}>/ 100</span>
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ ...sectionLabelStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span>Evaluation Metrics</span>
                    <button 
                      onClick={addMetric}
                      style={{ background: 'var(--hz-primary)', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      Add Metric
                    </button>
                  </div>

                  {!dynamicScores[activeAreaIndex].metrics || dynamicScores[activeAreaIndex].metrics.length === 0 ? (
                    <div style={{ padding: '1.5rem', textAlign: 'center', background: 'var(--hz-surface)', borderRadius: '8px', border: '1px dashed var(--hz-border)' }}>
                      <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>No metrics added yet. Click "Add Metric" to start scoring specific aspects of this area.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {dynamicScores[activeAreaIndex].metrics.map((metric, mIdx) => (
                        <div key={mIdx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={metric.name}
                            onChange={e => updateMetric(mIdx, 'name', e.target.value)}
                            placeholder="Metric Name (e.g., Code Quality)"
                            style={{ ...inputStyle, flex: 1, padding: '0.5rem 0.75rem' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <input
                              type="number"
                              min="0" max="100"
                              value={metric.score}
                              onChange={e => {
                                let val = e.target.value;
                                if (val !== '') {
                                  let num = Number(val);
                                  if (num > 100) num = 100;
                                  if (num < 0) num = 0;
                                  val = num;
                                }
                                updateMetric(mIdx, 'score', val);
                              }}
                              placeholder="0"
                              style={{ ...inputStyle, width: '70px', padding: '0.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--hz-primary)', borderColor: 'var(--hz-primary)' }}
                            />
                          </div>
                          <button 
                            onClick={() => removeMetric(mIdx)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px' }}
                            title="Remove metric"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <div style={sectionLabelStyle}>Specific Feedback for this Area</div>
                  <textarea
                    placeholder={`Provide detailed feedback on how the project performed regarding ${dynamicScores[activeAreaIndex].criteria}...`}
                    value={dynamicScores[activeAreaIndex].feedback}
                    onChange={(e) => updateCriteria(activeAreaIndex, 'feedback', e.target.value)}
                    style={{ 
                      width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '8px', 
                      border: '1px solid var(--hz-border)', background: 'var(--hz-surface)', color: 'var(--hz-text)',
                      fontSize: '0.95rem', lineHeight: 1.6, outline: 'none', resize: 'vertical',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--hz-primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--hz-border)'}
                  />
                </div>
              </div>
            </>
          )}

        </div>

      </div>

      {/* --- STICKY SUBMISSION BAR --- */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, 
        background: 'var(--hz-bg)', borderTop: '1px solid var(--hz-border)', 
        padding: '1rem 0', zIndex: 100, boxShadow: '0 -10px 40px rgba(0,0,0,0.2)' 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Average Score</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{calculateAverage()}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--hz-text-muted)' }}>/ 100</span>
            </div>
          </div>
          
          <button 
            onClick={handleSubmit} 
            disabled={submitting || !allAreasEvaluated}
            style={{ 
              background: 'var(--hz-text)', color: 'var(--hz-bg)', 
              border: 'none', borderRadius: '6px', padding: '0.75rem 2rem', 
              fontSize: '0.95rem', fontWeight: 700, cursor: (submitting || !allAreasEvaluated) ? 'not-allowed' : 'pointer',
              opacity: (submitting || !allAreasEvaluated) ? 0.5 : 1
            }}
          >
            {submitting ? 'Submitting...' : (allAreasEvaluated ? 'Submit Evaluation' : 'Evaluate All Areas First')}
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(5px)' }}>
          <div style={{ position: 'relative', width: '90%', maxWidth: '1000px', aspectRatio: '16/9', background: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button 
              onClick={() => setShowVideoModal(false)} 
              style={{ position: 'absolute', top: '-3rem', right: '0', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Close <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '1rem' }}><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              <h3>Demo Video Player</h3>
              <a href={project.demoVideoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--hz-text-muted)' }}>Open externally</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
