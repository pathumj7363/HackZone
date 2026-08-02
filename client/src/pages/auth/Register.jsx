import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { registerApi } from '../../api/auth.api';
import Input from '../../components/ui/Input';
import Logo from '../../components/common/Logo';

const roleMeta = {
  participant: {
    label: 'Participant',
    tagline: 'Join hackathons, build projects & compete',
    color: '#06b6d4',
  },
  organizer: {
    label: 'Organizer',
    tagline: 'Host & manage hackathon events',
    color: '#22c55e',
  },
  judge: {
    label: 'Judge',
    tagline: 'Evaluate & score hackathon submissions',
    color: '#8b5cf6',
  },
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || '';
  const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!role || !roleMeta[role]) {
    navigate('/register/role-select', { replace: true });
    return null;
  }

  const meta = roleMeta[role];

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [organizationName, setOrganizationName] = useState('');
  const [occupation, setOccupation] = useState('');

  const executeOAuth = async (provider) => {
    setError('');
    setLoading(true);
    try {
      const { user, token } = await registerApi({
        name: `${provider} User`,
        email: `mock@${provider.toLowerCase()}.com`,
        password: 'oauth',
        role,
        ...(role === 'organizer' && { organizationName }),
        ...(role === 'judge' && { occupation }),
      });
      login(user, token);

      if (user.role === 'participant') navigate('/dashboard');
      else if (user.role === 'organizer') navigate('/organizer');
      else if (user.role === 'judge') navigate('/judge');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (role === 'organizer' && !organizationName.trim()) {
      setError('Please enter your organization name');
      return;
    }
    if (role === 'judge' && !occupation.trim()) {
      setError('Please enter your occupation');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { user, token } = await registerApi({
        name, email, password, role,
        ...(role === 'organizer' && { organizationName }),
        ...(role === 'judge' && { occupation }),
      });
      login(user, token);

      if (user.role === 'participant') navigate('/dashboard');
      else if (user.role === 'organizer') navigate('/organizer');
      else if (user.role === 'judge') navigate('/judge');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap');
        
        .hz-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
          z-index: 0;
          pointer-events: none;
        }

        .hz-register-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          min-height: 100vh;
          background: #020202;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .hz-register-container {
          width: 100%;
          max-width: 900px;
          position: relative;
          z-index: 1;
          margin-top: 2rem;
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 3rem 4rem;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
        }
        .hz-split-layout {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }
        .hz-col-left, .hz-col-right {
          flex: 1;
        }
        
        .hz-divider {
          display: flex;
          align-items: center;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        
        .hz-divider::before,
        .hz-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }
        .hz-divider::before { margin-right: 1rem; }
        .hz-divider::after { margin-left: 1rem; }

        @media (min-width: 768px) {
          .hz-split-layout {
            flex-direction: row;
            align-items: center;
            gap: 0;
          }
          .hz-col-left { padding-right: 3.5rem; }
          .hz-col-right { padding-left: 3.5rem; }
          .hz-divider {
            flex-direction: column;
            align-items: center;
            height: 380px;
          }
          .hz-divider::before,
          .hz-divider::after {
            width: 1px;
            height: auto;
            background: rgba(255, 255, 255, 0.1);
            margin: 0;
          }
          .hz-divider::before { margin-bottom: 1.5rem; }
          .hz-divider::after { margin-top: 1.5rem; }
        }
        
        .hz-oauth-btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 1rem;
          width: 100%;
          height: 3.5rem;
          padding: 0 1.5rem;
          border-radius: 12px;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
        }
        .hz-oauth-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 14px rgba(0,0,0,0.2);
        }
        .hz-oauth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Modern Input Overrides */
        .hz-input-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .hz-input-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #94a3b8;
        }
        .hz-modern-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .hz-modern-input:focus {
          outline: none;
          background: rgba(255, 255, 255, 0.06);
          border-color: ${meta.color};
          box-shadow: 0 0 0 3px rgba(${parseInt(meta.color.slice(1,3),16)},${parseInt(meta.color.slice(3,5),16)},${parseInt(meta.color.slice(5,7),16)}, 0.2);
        }

        .hz-btn-primary {
          background: linear-gradient(135deg, #06b6d4 0%, #22c55e 100%);
          color: #000;
          border: none;
          padding: 0.875rem 2.5rem;
          border-radius: 8px;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .hz-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(34,197,94,0.4);
        }
        .hz-btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      <div className="hz-register-wrapper">
        <div className="hz-bg-grid"></div>
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(34,197,94,0.05) 50%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ position: 'absolute', left: 0, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', zIndex: 10 }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }} onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              title="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo width={220} />
            </Link>
          </div>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem',
            padding: '0.5rem 1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '50px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registering as</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: meta.color }}>{meta.label}</span>
            <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.2)', margin: '0 0.25rem' }}></div>
            <Link to="/register/role-select" style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '600', textDecoration: 'none' }}>Change</Link>
          </div>
        </div>

        <div className="hz-register-container">
          <div className="hz-split-layout">
            {/* Left Side: Traditional Form */}
            <div className="hz-col-left">
              <h2 style={{ fontFamily: 'Chakra Petch', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '1.5rem' }}>Create Account</h2>
              
              {error && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="hz-input-container">
                  <label className="hz-input-label">Full Name</label>
                  <input className="hz-modern-input" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="hz-input-container">
                  <label className="hz-input-label">Email Address</label>
                  <input className="hz-modern-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                {role === 'organizer' && (
                  <div className="hz-input-container">
                    <label className="hz-input-label">Organization Name</label>
                    <input className="hz-modern-input" type="text" placeholder="e.g. TechCorp, University of XYZ" value={organizationName} onChange={e => setOrganizationName(e.target.value)} required />
                  </div>
                )}

                {role === 'judge' && (
                  <div className="hz-input-container">
                    <label className="hz-input-label">Occupation</label>
                    <input className="hz-modern-input" type="text" placeholder="e.g. Software Engineer, CTO" value={occupation} onChange={e => setOccupation(e.target.value)} required />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="hz-input-container">
                    <label className="hz-input-label">Password</label>
                    <input className="hz-modern-input" type="password" placeholder="Min. 8 chars" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <div className="hz-input-container">
                    <label className="hz-input-label">Confirm Password</label>
                    <input className="hz-modern-input" type="password" placeholder="Repeat" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem' }}>
                  <button type="submit" className="hz-btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : 'Sign up securely'}
                  </button>
                </div>
              </form>
            </div>

            {/* Middle Divider */}
            <div className="hz-divider">OR</div>

            {/* Right Side: OAuth Providers */}
            <div className="hz-col-right">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <button type="button" className="hz-oauth-btn hz-oauth-github" onClick={() => executeOAuth('Github')} disabled={loading}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  Sign up with GitHub
                </button>

                <button type="button" className="hz-oauth-btn hz-oauth-google" onClick={() => executeOAuth('Google')} disabled={loading}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.95rem', marginBottom: 0, color: '#94a3b8' }}>
              Already have an account? <Link to="/login" style={{ color: '#06b6d4', fontWeight: '600', textDecoration: 'none' }}>Log in here</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
