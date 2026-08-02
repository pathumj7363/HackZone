import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import { loginApi } from '../../api/auth.api';
import Logo from '../../components/common/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user, token } = await loginApi(email, password);
      login(user, token);

      if (user.role === 'participant') navigate('/dashboard');
      else if (user.role === 'organizer') navigate('/organizer');
      else if (user.role === 'judge') navigate('/judge');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bg = isDark ? '#020202' : '#f1f5f9';
  const textMain = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#334155';
  const gridLine = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.07)';
  const gridMask = 'radial-gradient(circle at center, black 20%, transparent 80%)';
  const containerBg = isDark ? 'rgba(255, 255, 255, 0.02)' : '#ffffff';
  const containerBorder = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0,0,0,0.1)';
  const containerShadow = isDark ? '0 25px 50px -12px rgba(0,0,0,0.5)' : '0 25px 50px -12px rgba(0,0,0,0.15)';
  
  const inputBg = isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc';
  const inputBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0,0,0,0.15)';
  const inputFocusBg = isDark ? 'rgba(255, 255, 255, 0.06)' : '#ffffff';

  const backBtnBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
  const backBtnBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const backBtnHovBg = isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&display=swap');
        
        .hz-bg-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, ${gridLine} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridLine} 1px, transparent 1px);
          background-size: 50px 50px;
          mask-image: ${gridMask};
          -webkit-mask-image: ${gridMask};
          z-index: 0;
          pointer-events: none;
        }

        .hz-login-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem;
          min-height: 100vh;
          background: ${bg};
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          transition: background 0.3s ease;
        }
        .hz-login-container {
          width: 100%;
          max-width: 460px;
          position: relative;
          z-index: 1;
          margin-top: 2rem;
          background: ${containerBg};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${containerBorder};
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: ${containerShadow};
          transition: all 0.3s ease;
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
          color: ${textSub};
        }
        .hz-modern-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: ${inputBg};
          border: 1px solid ${inputBorder};
          border-radius: 8px;
          color: ${textMain};
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: all 0.2s ease;
        }
        .hz-modern-input:focus {
          outline: none;
          background: ${inputFocusBg};
          border-color: #06b6d4;
          box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
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
      
      <div className="hz-login-wrapper">
        <div className="hz-bg-grid"></div>
        {/* Ambient Glow */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(34,197,94,0.05) 50%, transparent 70%)', filter: 'blur(50px)', zIndex: 0, pointerEvents: 'none' }}></div>

        <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
          {/* Header with Back Button and Logo */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '1.5rem' }}>
            <button 
              onClick={() => navigate(-1)} 
              style={{ position: 'absolute', left: 0, background: backBtnBg, border: `1px solid ${backBtnBorder}`, color: textSub, cursor: 'pointer', transition: 'all 0.2s', padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', boxShadow: isDark ? 'none' : '0 2px 4px rgba(0,0,0,0.05)' }}
              onMouseEnter={e => { e.currentTarget.style.color = textMain; e.currentTarget.style.background = backBtnHovBg }} 
              onMouseLeave={e => { e.currentTarget.style.color = textSub; e.currentTarget.style.background = backBtnBg }}
              title="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Logo width={220} />
            </Link>
          </div>

          <div className="hz-login-container">
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: 'Chakra Petch', fontSize: '2rem', fontWeight: 700, color: textMain, marginBottom: '0.5rem', transition: 'color 0.3s' }}>Welcome Back</h2>
              <p style={{ fontSize: '0.95rem', color: textSub, transition: 'color 0.3s' }}>
                Sign in to continue to HackZone
              </p>
            </div>

            {error && <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="hz-input-container">
                <label className="hz-input-label">Email Address</label>
                <input className="hz-modern-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="hz-input-container">
                <label className="hz-input-label">Password</label>
                <input className="hz-modern-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <a href="#" style={{ color: '#06b6d4', fontWeight: '600', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot password?</a>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="hz-btn-primary" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.95rem', marginBottom: 0, color: textSub }}>
                  Don't have an account? <Link to="/register/role-select" style={{ color: '#22c55e', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
