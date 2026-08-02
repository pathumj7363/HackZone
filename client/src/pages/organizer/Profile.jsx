import React, { useState, useEffect, useContext } from 'react';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import { getMyProfileApi, updateOrganizerProfileApi } from '../../api/user.api';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    organizationName: '',
    websiteUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfileApi();
        setFormData({
          organizationName: data.organizationName || '',
          websiteUrl: data.websiteUrl || ''
        });
        setIsVerified(data.isVerified || false);
      } catch (err) {
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateOrganizerProfileApi({
        ...formData,
        isVerified // usually set by admin, but keeping it in the payload for consistency
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const bg = isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc';

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${border}`,
    background: inputBg,
    color: 'inherit',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Organizer Profile</h1>
        <p style={{ color: 'var(--hz-text-muted)', margin: 0 }}>Update your organization details and web presence.</p>
      </div>

      <div style={{ 
        background: bg, 
        border: `1px solid ${border}`, 
        borderRadius: '24px', 
        padding: '2.5rem',
        backdropFilter: 'blur(16px)',
        boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--hz-primary) 0%, #0ea5e9 100%)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', fontSize: '2rem', fontWeight: 'bold' 
          }}>
            {(user.name || 'O').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700 }}>
              {user.name}
              {isVerified && <span style={{ marginLeft: '0.5rem', color: '#10b981', fontSize: '1rem' }}>✓</span>}
            </h2>
            <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>{user.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--hz-text-muted)' }}>Organization Name</label>
            <input 
              name="organizationName"
              placeholder="e.g. Acme Hackathons Inc." 
              value={formData.organizationName} 
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--hz-primary)'}
              onBlur={e => e.target.style.borderColor = border}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--hz-text-muted)' }}>Website URL</label>
            <input 
              name="websiteUrl"
              placeholder="https://www.your-organization.com" 
              value={formData.websiteUrl} 
              onChange={handleChange}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--hz-primary)'}
              onBlur={e => e.target.style.borderColor = border}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: `1px solid ${border}` }}>
            <button 
              type="submit" 
              disabled={saving}
              style={{ 
                background: 'var(--hz-primary)', color: '#fff', border: 'none', 
                padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 600, 
                cursor: 'pointer', transition: 'all 0.2s', opacity: saving ? 0.7 : 1 
              }}
              onMouseEnter={e => e.currentTarget.style.transform = saving ? 'none' : 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
