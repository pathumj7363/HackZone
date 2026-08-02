import React, { useState, useEffect, useContext } from 'react';
import { getPublicProfileApi } from '../../api/user.api';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

export default function PublicProfileModal({ userId, onClose }) {
  const { isDark } = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getPublicProfileApi(userId);
        setProfile(data);
      } catch (err) {
        toast.error('Failed to load profile');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchProfile();
  }, [userId, onClose]);

  const bg = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)';
  const textClr = isDark ? '#f8fafc' : '#0f172a';
  const metaClr = isDark ? '#94a3b8' : '#64748b';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
      padding: '1rem'
    }}>
      <div style={{
        background: bg,
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        position: 'relative',
        boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.6)' : '0 20px 40px rgba(0,0,0,0.15)',
        border: `1px solid ${border}`,
        animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: 'none', color: metaClr,
          cursor: 'pointer', padding: '0.5rem', borderRadius: '50%',
          transition: 'all 0.2s',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--hz-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : profile ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--hz-primary) 0%, #8b5cf6 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '2.5rem', fontWeight: 800,
              boxShadow: '0 10px 25px rgba(99,102,241,0.4)',
              marginBottom: '1.5rem'
            }}>
              {(profile.name || 'U').charAt(0).toUpperCase()}
            </div>
            
            <h3 style={{ margin: '0 0 0.25rem 0', color: textClr, fontSize: '1.5rem', fontWeight: 800 }}>{profile.name}</h3>
            <span style={{ 
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', 
              color: metaClr, padding: '0.25rem 0.75rem', borderRadius: '20px', 
              fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize',
              marginBottom: '2rem'
            }}>
              {profile.role}
            </span>

            <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {profile.role === 'participant' && (
                <>
                  {profile.bio && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metaClr, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Bio</div>
                      <div style={{ color: textClr, fontSize: '0.95rem', lineHeight: 1.6 }}>{profile.bio}</div>
                    </div>
                  )}
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metaClr, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Skills</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {profile.skills.map((skill, i) => (
                          <span key={i} style={{ background: 'var(--hz-primary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500 }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {profile.role === 'judge' && (
                <>
                  {profile.occupation && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metaClr, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Occupation</div>
                      <div style={{ color: textClr, fontSize: '1rem', fontWeight: 500 }}>{profile.occupation}</div>
                    </div>
                  )}
                  {profile.expertiseTags && profile.expertiseTags.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metaClr, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Expertise</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {profile.expertiseTags.map((tag, i) => (
                          <span key={i} style={{ background: 'var(--hz-primary)', color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {profile.role === 'organizer' && (
                <>
                  {profile.organizationName && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metaClr, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Organization</div>
                      <div style={{ color: textClr, fontSize: '1.1rem', fontWeight: 600 }}>
                        {profile.organizationName}
                        {profile.isVerified ? <span style={{ marginLeft: '0.5rem', color: '#10b981' }}>✓ Verified</span> : null}
                      </div>
                    </div>
                  )}
                  {profile.websiteUrl && (
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: metaClr, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Website</div>
                      <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--hz-primary)', textDecoration: 'none', fontWeight: 500 }}>{profile.websiteUrl}</a>
                    </div>
                  )}
                </>
              )}

              {/* Social Links */}
              {(profile.githubUrl || profile.linkedInUrl) && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', paddingTop: '1.5rem', borderTop: `1px solid ${border}` }}>
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: textClr, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.color = textClr}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </a>
                  )}
                  {profile.linkedInUrl && (
                    <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: textClr, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.color = textClr}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: metaClr }}>Profile not found</div>
        )}
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
