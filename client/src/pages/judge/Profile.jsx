import React, { useState, useEffect, useContext } from 'react';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import { getMyProfileApi, updateJudgeProfileApi } from '../../api/user.api';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const { isDark } = useContext(ThemeContext);
  const [formData, setFormData] = useState({
    occupation: '',
    expertiseTags: '',
    linkedInUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfileApi();
        setFormData({
          occupation: data.occupation || '',
          expertiseTags: data.expertiseTags ? data.expertiseTags.join(', ') : '',
          linkedInUrl: data.linkedInUrl || ''
        });
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
      const tagsArray = formData.expertiseTags.split(',').map(s => s.trim()).filter(s => s);
      await updateJudgeProfileApi({
        ...formData,
        expertiseTags: tagsArray
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
    padding: '0.75rem 1rem 0.75rem 2.75rem',
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
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Judge Profile</h1>
        <p style={{ color: 'var(--hz-text-muted)', margin: 0 }}>Update your expertise and details to help organizers assign relevant projects.</p>
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
            background: 'linear-gradient(135deg, var(--hz-primary) 0%, #a855f7 100%)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: '#fff', fontSize: '2rem', fontWeight: 'bold' 
          }}>
            {(user.name || 'J').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem', fontWeight: 700 }}>{user.name}</h2>
            <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.9rem' }}>{user.email}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--hz-text-muted)' }}>Occupation / Title</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <input 
                type="text"
                name="occupation"
                placeholder="e.g. Senior Software Engineer" 
                value={formData.occupation} 
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hz-primary)'}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--hz-text-muted)' }}>Expertise Tags (comma separated)</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              </div>
              <input 
                type="text"
                name="expertiseTags"
                placeholder="e.g. React, AI, UX Design, Blockchain" 
                value={formData.expertiseTags} 
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hz-primary)'}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--hz-text-muted)' }}>LinkedIn URL</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </div>
              <input 
                type="text"
                name="linkedInUrl"
                placeholder="https://linkedin.com/in/username" 
                value={formData.linkedInUrl} 
                onChange={handleChange}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--hz-primary)'}
                onBlur={e => e.target.style.borderColor = border}
              />
            </div>
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
