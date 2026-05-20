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
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="hz-heading-2 hz-mb-2" style={{ fontSize: '1.5rem' }}>Welcome Back</h2>
            <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)' }}>
              Sign in to continue to HackZone
            </p>
          </div>

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
      </div>
    </div>
  );
}
