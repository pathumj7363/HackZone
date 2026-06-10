import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { loginApi } from '../../api/auth.api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset scroll to top upon page navigation
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

  return (
<<<<<<< HEAD
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--hz-surface) 0%, var(--hz-primary-light) 100%)',
      }}
      className="px-3 py-4"
    >
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '2rem', color: 'var(--hz-primary)', display: 'inline-block' }}>
            HackZone
          </Link>
        </div>

        <Card padding style={{ boxShadow: 'var(--hz-shadow-lg)', border: 'none', background: '#ffffff', borderRadius: '16px' }} className="p-3 p-sm-4">
=======
    <>
      <style>{`
        /* Override input styles for dark mode */
        .hz-login-wrapper .hz-input {
          background: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: #f8fafc !important;
        }
        .hz-login-wrapper .hz-input:focus {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(108, 99, 255, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2) !important;
        }
        .hz-login-wrapper .hz-label {
          color: #cbd5e1 !important;
          font-weight: 500 !important;
        }
      `}</style>
      <div
        className="hz-login-wrapper px-3 py-4"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: '#0f172a',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Ambient Glow */}
        <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, rgba(139,92,246,0.1) 45%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
>>>>>>> 1c360b9fc9b227910f90bd0d2eaaae114bc52ce0
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Link to="/" style={{ textDecoration: 'none', fontWeight: '900', fontSize: '2.5rem', background: 'linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', letterSpacing: '-0.03em' }}>
              HackZone
            </Link>
          </div>

<<<<<<< HEAD
          {error && <div className="hz-alert hz-alert--error hz-mb-4">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: 'var(--hz-font-size-xs)' }}>
              <p className="hz-text-muted" style={{ margin: 0 }}>Hint: Use password "password"</p>
              <a href="#" style={{ color: 'var(--hz-primary)', fontWeight: '500', textDecoration: 'none' }}>Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" disabled={loading} style={{ width: '100%', padding: '0.75rem', fontWeight: 'bold' }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <p className="hz-text-muted" style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: 'var(--hz-font-size-sm)', marginBottom: 0 }}>
              Don't have an account? <Link to="/register/role-select" style={{ color: 'var(--hz-primary)', fontWeight: '600', textDecoration: 'none' }}>Create one</Link>
            </p>
          </form>
        </Card>
=======
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 className="hz-heading-2 hz-mb-2" style={{ fontSize: '1.75rem', color: '#f8fafc' }}>Welcome Back</h2>
              <p style={{ fontSize: 'var(--hz-font-size-sm)', color: '#94a3b8' }}>
                Sign in to continue to HackZone
              </p>
            </div>

            {error && <div className="hz-alert hz-alert--error hz-mb-4" style={{ borderRadius: '6px' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', fontSize: 'var(--hz-font-size-xs)' }}>
                <a href="#" style={{ color: '#8b5cf6', fontWeight: '600', textDecoration: 'none' }}>Forgot password?</a>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '0.85rem', fontWeight: '700', fontSize: '1rem',
                  background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => { if(!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'; e.currentTarget.style.background = '#4338ca'; } }}
                onMouseLeave={e => { if(!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)'; e.currentTarget.style.background = '#4f46e5'; } }}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: 'var(--hz-font-size-sm)', marginBottom: 0, color: '#94a3b8' }}>
                  Don't have an account? <Link to="/register/role-select" style={{ color: '#8b5cf6', fontWeight: '700', textDecoration: 'none' }}>Create one</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
>>>>>>> 1c360b9fc9b227910f90bd0d2eaaae114bc52ce0
      </div>
    </>
  );
}
