import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { registerApi } from '../../api/auth.api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const roleMeta = {
  participant: {
    label: 'Participant',
    tagline: 'Join hackathons, build projects & compete',
    color: '#3b82f6',
    bgLight: '#eff6ff',
  },
  organizer: {
    label: 'Organizer',
    tagline: 'Host & manage hackathon events',
    color: '#10b981',
    bgLight: '#ecfdf5',
  },
  judge: {
    label: 'Judge',
    tagline: 'Evaluate & score hackathon submissions',
    color: '#f59e0b',
    bgLight: '#fffbeb',
  },
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || '';
  const navigate = useNavigate();
  const { login } = useAuth();

  // Reset scroll to top upon page navigation
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Redirect to role selection if no role is provided
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

  // Role-specific fields
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
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, var(--hz-surface) 0%, var(--hz-primary-light) 100%)', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', fontSize: '2rem', color: 'var(--hz-primary)', display: 'inline-block' }}>
          HackZone
        </Link>
      </div>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Card padding style={{ boxShadow: 'var(--hz-shadow-lg)', border: 'none', background: '#ffffff', borderRadius: '16px' }}>

          {/* Role Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: meta.bgLight,
            border: `1px solid ${meta.color}20`,
          }}>
            <div>
              <div style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', fontWeight: '500', marginBottom: '2px' }}>
                Signing up as
              </div>
              <div style={{ fontSize: 'var(--hz-font-size-base)', fontWeight: '700', color: meta.color }}>
                {meta.label}
              </div>
              <div style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', marginTop: '1px' }}>
                {meta.tagline}
              </div>
            </div>
            <Link
              to="/register/role-select"
              style={{
                fontSize: 'var(--hz-font-size-xs)',
                color: meta.color,
                fontWeight: '600',
                textDecoration: 'none',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                border: `1px solid ${meta.color}40`,
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              Change
            </Link>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 className="hz-heading-2 hz-mb-1" style={{ fontSize: '1.75rem', textAlign: 'left' }}>Create an account</h2>
            <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', textAlign: 'left' }}>
              Fill in your details to join the ecosystem
            </p>
          </div>

          {error && <div className="hz-alert hz-alert--error hz-mb-4">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Input
              label="Full name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <Input
              label="Email address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            {/* Role-specific fields */}
            {role === 'organizer' && (
              <Input
                label="Organization name"
                type="text"
                placeholder="e.g. TechCorp, University of XYZ"
                value={organizationName}
                onChange={e => setOrganizationName(e.target.value)}
                required
                helperText="The name of your company or institution"
              />
            )}

            {role === 'judge' && (
              <Input
                label="Occupation"
                type="text"
                placeholder="e.g. Software Engineer, Professor, CTO"
                value={occupation}
                onChange={e => setOccupation(e.target.value)}
                required
                helperText="Your current professional role or title"
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm password"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="primary" disabled={loading} style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', fontWeight: 'bold' }}>
              {loading ? 'Creating Account...' : 'Register via Email'}
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--hz-border)' }}></div>
              <span style={{ padding: '0 1rem', color: 'var(--hz-text-muted)', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--hz-border)' }}></div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="button" variant="outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => executeOAuth('Google')} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>
              <Button type="button" variant="outline" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={() => executeOAuth('Github')} disabled={loading}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '12px', color: 'var(--hz-text-muted)' }}>
              By registering you agree to our <a href="#" style={{ color: 'var(--hz-primary)', textDecoration: 'none', fontWeight: '500' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--hz-primary)', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
            </p>

            <p className="hz-text-muted" style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: 'var(--hz-font-size-sm)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--hz-primary)', fontWeight: '500', textDecoration: 'none' }}>Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
