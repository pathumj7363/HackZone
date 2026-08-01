import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHackathonDetailApi, registerHackathonApi } from '../../api/hackathon.api';
import { getMyTeamApi } from '../../api/team.api';
import { toast } from 'react-toastify';
import './HackathonRegistration.css'; // We will create this next

export default function HackathonRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [regType, setRegType] = useState('');
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [idea, setIdea] = useState('');
  const [proposal, setProposal] = useState(null);

  // Team State
  const [myTeam, setMyTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(false);

  useEffect(() => {
    fetchHackathon();
  }, [id]);

  useEffect(() => {
    if (regType === 'team') {
      fetchMyTeam();
    }
  }, [regType]);

  const fetchHackathon = async () => {
    try {
      const data = await getHackathonDetailApi(id);
      setHackathon(data);
    } catch (err) {
      toast.error('Failed to load hackathon details.');
      navigate('/hackathons');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTeam = async () => {
    setTeamLoading(true);
    try {
      const team = await getMyTeamApi();
      setMyTeam(team);
    } catch (err) {
      // It's okay if they don't have a team, but API might return 404
      setMyTeam(null);
    } finally {
      setTeamLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !regType) {
      toast.error('Please select a registration type');
      return;
    }
    if (step === 1 && regType === 'team' && !myTeam) {
      toast.error('You must be in a team to register as a team.');
      return;
    }
    if (step === 2 && regType === 'solo') {
      if (!role || !experienceLevel || !githubUrl) {
        toast.error('Please fill all fields');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProposal(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!idea || !proposal) {
      toast.error('Please provide project idea and proposal document.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('hackathonId', id);
      formData.append('regType', regType);
      formData.append('idea', idea);
      formData.append('proposal', proposal);

      if (regType === 'team') {
        formData.append('teamId', myTeam.id);
      } else {
        formData.append('role', role);
        formData.append('experienceLevel', experienceLevel);
        formData.append('githubUrl', githubUrl);
      }

      await registerHackathonApi(formData);
      setStep(4); // Success step
    } catch (err) {
      toast.error(err?.error || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="registration-container d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-header">
        <button className="btn btn-outline-light back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h2 className="text-white m-0">Register for {hackathon?.title}</h2>
      </div>

      <div className="registration-content">
        {step < 4 && (
          <div className="progress-container mb-5">
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-primary" 
                role="progressbar" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            <div className="d-flex justify-content-between mt-2 text-white-50 small">
              <span>Type</span>
              <span>Details</span>
              <span>Project</span>
            </div>
          </div>
        )}

        <div className="form-card">
          {step === 1 && (
            <div className="step-content slide-in">
              <h3 className="mb-4 text-center">How would you like to participate?</h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <div 
                    className={`selection-card ${regType === 'solo' ? 'active' : ''}`}
                    onClick={() => setRegType('solo')}
                  >
                    <div className="card-icon">👤</div>
                    <h4>Solo</h4>
                    <p>I want to participate by myself</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div 
                    className={`selection-card ${regType === 'team' ? 'active' : ''}`}
                    onClick={() => setRegType('team')}
                  >
                    <div className="card-icon">👥</div>
                    <h4>Team</h4>
                    <p>I am participating with a team</p>
                  </div>
                </div>
              </div>
              
              {regType === 'team' && (
                <div className="team-status mt-4">
                  {teamLoading ? (
                    <p className="text-info">Checking team status...</p>
                  ) : myTeam ? (
                    <div className="alert alert-success bg-success bg-opacity-10 border-success text-success">
                      Found your team: <strong>{myTeam.name}</strong>
                    </div>
                  ) : (
                    <div className="alert alert-warning bg-warning bg-opacity-10 border-warning text-warning">
                      You are not part of any team. Please <a href="/teams/create" className="text-warning fw-bold text-decoration-underline">create or join a team</a> first.
                    </div>
                  )}
                </div>
              )}

              <div className="text-end mt-5">
                <button 
                  className="btn btn-primary px-5 py-2 fw-bold rounded-pill"
                  onClick={nextStep}
                  disabled={regType === 'team' && !myTeam}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-content slide-in">
              <h3 className="mb-4">
                {regType === 'solo' ? 'Your Details' : 'Team Details'}
              </h3>
              
              {regType === 'solo' ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Primary Role</label>
                    <select 
                      className="form-select bg-dark text-white border-secondary"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Select a role</option>
                      <option value="Frontend Developer">Frontend Developer</option>
                      <option value="Backend Developer">Backend Developer</option>
                      <option value="Fullstack Developer">Fullstack Developer</option>
                      <option value="Designer">UI/UX Designer</option>
                      <option value="Data Scientist">Data Scientist</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Experience Level / Education</label>
                    <input 
                      type="text" 
                      className="form-control bg-dark text-white border-secondary" 
                      placeholder="e.g. Undergraduate, 2 YOE"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">GitHub / Portfolio URL</label>
                    <input 
                      type="url" 
                      className="form-control bg-dark text-white border-secondary" 
                      placeholder="https://github.com/username"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="team-details-preview">
                  <p className="mb-2">You are registering with:</p>
                  <div className="p-3 bg-dark border border-secondary rounded mb-3">
                    <h4 className="text-primary">{myTeam?.name}</h4>
                    <p className="text-white-50 m-0 mb-2">{myTeam?.description}</p>
                    <small className="text-muted">Invite Code: {myTeam?.invite_code}</small>
                  </div>
                  <p className="text-info small">
                    Make sure all your team members have joined your team before the hackathon starts.
                  </p>
                </div>
              )}

              <div className="d-flex justify-content-between mt-5">
                <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={prevStep}>Back</button>
                <button className="btn btn-primary px-5 py-2 fw-bold rounded-pill" onClick={nextStep}>Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-content slide-in">
              <h3 className="mb-4">Project Proposal</h3>
              
              <div className="mb-4">
                <label className="form-label">Project Idea / Summary</label>
                <textarea 
                  className="form-control bg-dark text-white border-secondary" 
                  rows="4"
                  placeholder="Briefly describe what you plan to build..."
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label">Proposal Document (PDF)</label>
                <input 
                  type="file" 
                  className="form-control bg-dark text-white border-secondary" 
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <small className="text-muted mt-1 d-block">Upload a detailed proposal or presentation document.</small>
              </div>

              <div className="d-flex justify-content-between mt-5">
                <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={prevStep} disabled={submitting}>Back</button>
                <button 
                  className="btn btn-success px-5 py-2 fw-bold rounded-pill" 
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-content text-center py-5 slide-in">
              <div className="success-icon mb-4">🎉</div>
              <h2 className="text-success mb-3">Registration Submitted!</h2>
              <p className="text-white fs-5 mb-4">
                Your registration has been successfully received. 
                Approval or rejection will be informed within <strong>24 hours</strong>.
              </p>
              <button 
                className="btn btn-primary px-5 py-2 fw-bold rounded-pill"
                onClick={() => navigate(`/hackathons/${id}`)}
              >
                Return to Hackathon
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
