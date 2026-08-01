import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Card, Button, Input, PageHeader } from '../../components/ui';
import { updateJudgeProfile } from '../../api/judge.api';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    occupation: '',
    expertiseTags: '',
    linkedInUrl: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tagsArray = formData.expertiseTags.split(',').map(s => s.trim()).filter(s => s);
      await updateJudgeProfile({
        ...formData,
        expertiseTags: tagsArray
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0 0 0.5rem', color: 'var(--hz-text)', letterSpacing: '-0.03em' }}>
              Judge Profile
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--hz-text-secondary)', maxWidth: '600px', margin: 0 }}>
              Update your expertise and details to help organizers assign relevant projects.
            </p>
          </div>
        </div>
      </div>

      <div className="hz-container" style={{ animation: 'fadeIn 0.5s ease', maxWidth: '800px' }}>
        <div style={{ background: 'var(--hz-surface)', borderRadius: '24px', border: '1px solid var(--hz-border)', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px dashed var(--hz-border)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--hz-primary) 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800, boxShadow: '0 8px 20px rgba(99,102,241,0.3)' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'J'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 0.25rem', color: 'var(--hz-text)' }}>{user?.name || 'Judge User'}</h2>
              <p style={{ margin: 0, color: 'var(--hz-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                {user?.email || 'email@example.com'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--hz-text)' }}>Name</label>
                <div style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', color: 'var(--hz-text-muted)', cursor: 'not-allowed' }}>
                  {user?.name || ''}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--hz-text)' }}>Email</label>
                <div style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'var(--hz-bg)', border: '1px solid var(--hz-border)', color: 'var(--hz-text-muted)', cursor: 'not-allowed' }}>
                  {user?.email || ''}
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--hz-text)' }}>Occupation / Title</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <input 
                  type="text"
                  name="occupation"
                  placeholder="e.g. Senior Software Engineer" 
                  value={formData.occupation} 
                  onChange={handleChange}
                  className="hz-input"
                  style={{ width: '100%', padding: '0.85rem 1.25rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--hz-text)' }}>Expertise Tags (comma separated)</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                </div>
                <input 
                  type="text"
                  name="expertiseTags"
                  placeholder="e.g. React, AI, UX Design, Blockchain" 
                  value={formData.expertiseTags} 
                  onChange={handleChange}
                  className="hz-input"
                  style={{ width: '100%', padding: '0.85rem 1.25rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--hz-text-secondary)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                These tags help organizers find you when assigning projects.
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--hz-text)' }}>LinkedIn URL</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-text-muted)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </div>
                <input 
                  type="text"
                  name="linkedInUrl"
                  placeholder="https://linkedin.com/in/username" 
                  value={formData.linkedInUrl} 
                  onChange={handleChange}
                  className="hz-input"
                  style={{ width: '100%', padding: '0.85rem 1.25rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--hz-border)', background: 'var(--hz-bg)', color: 'var(--hz-text)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid var(--hz-border)' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  padding: '0.85rem 2rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 700,
                  background: 'linear-gradient(90deg, var(--hz-primary) 0%, #a855f7 100%)', color: 'white', border: 'none',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.3)', transition: 'all 0.2s', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.3)'; } }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                    Saving...
                  </span>
                ) : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
