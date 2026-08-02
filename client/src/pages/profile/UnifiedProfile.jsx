import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { ThemeContext } from '../../context/ThemeContext';
import { getMyProfileApi, getPublicProfileApi, updateParticipantProfileApi, updateJudgeProfileApi, updateOrganizerProfileApi, uploadProfilePictureApi } from '../../api/user.api';
import { toast } from 'react-toastify';

export default function UnifiedProfile() {
  const { id } = useParams();
  const { user, updateAuthUser } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);
  
  const isOwnProfile = !id || id === user?.id;
  const targetId = id || user?.id;
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Form State for editing
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    githubUrl: '',
    linkedInUrl: '',
    occupation: '',
    expertiseTags: '',
    organizationName: '',
    websiteUrl: ''
  });

  useEffect(() => {
    if (!targetId) {
      if (!user) navigate('/');
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        let data;
        if (isOwnProfile) {
          data = await getMyProfileApi();
        } else {
          data = await getPublicProfileApi(targetId);
        }
        setProfile(data);
        
        // Initialize form data
        setFormData({
          bio: data.bio || '',
          skills: data.skills ? (Array.isArray(data.skills) ? data.skills.join(', ') : data.skills) : '',
          githubUrl: data.githubUrl || '',
          linkedInUrl: data.linkedInUrl || '',
          occupation: data.occupation || '',
          expertiseTags: data.expertiseTags ? (Array.isArray(data.expertiseTags) ? data.expertiseTags.join(', ') : data.expertiseTags) : '',
          organizationName: data.organizationName || '',
          websiteUrl: data.websiteUrl || ''
        });

        // Prompt to edit if empty and is own profile
        if (isOwnProfile) {
          const isEmpty = 
            (data.role === 'participant' && !data.skills) || 
            (data.role === 'judge' && !data.expertiseTags) || 
            (data.role === 'organizer' && !data.organizationName);
          if (isEmpty) {
            setIsEditMode(true);
            toast.info("Welcome! Please complete your profile information.");
          }
        }
      } catch (err) {
        toast.error('Failed to load profile.');
        if (!isOwnProfile) navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [targetId, isOwnProfile, user, navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarClick = () => {
    if (isOwnProfile && !uploadingAvatar) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploadingAvatar(true);
    try {
      const result = await uploadProfilePictureApi(file);
      const newAvatarUrl = `http://localhost:5000${result.profilePicture}`;
      
      // Update local state
      setProfile(prev => ({ ...prev, profilePicture: newAvatarUrl }));
      updateAuthUser({ ...user, profilePicture: newAvatarUrl });
      toast.success('Profile picture updated!');
    } catch (err) {
      toast.error('Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
      e.target.value = null; // reset
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (profile.role === 'participant') {
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
        await updateParticipantProfileApi({ ...formData, skills: skillsArray });
        setProfile(prev => ({ ...prev, ...formData, skills: skillsArray }));
      } else if (profile.role === 'judge') {
        const tagsArray = formData.expertiseTags.split(',').map(s => s.trim()).filter(s => s);
        await updateJudgeProfileApi({ ...formData, expertiseTags: tagsArray });
        setProfile(prev => ({ ...prev, ...formData, expertiseTags: tagsArray }));
      } else if (profile.role === 'organizer') {
        await updateOrganizerProfileApi({ ...formData, isVerified: profile.isVerified });
        setProfile(prev => ({ ...prev, ...formData }));
      }
      toast.success('Profile saved successfully!');
      setIsEditMode(false);
    } catch (error) {
      toast.error('Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>Loading profile...</div>;
  }

  if (!profile) return null;

  const bg = isDark ? 'rgba(30, 41, 59, 0.5)' : '#ffffff';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const inputBg = isDark ? 'rgba(15, 23, 42, 0.6)' : '#f8fafc';
  const textClr = isDark ? '#f8fafc' : '#0f172a';
  const metaClr = isDark ? '#94a3b8' : '#64748b';

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
    border: `1px solid ${border}`, background: inputBg, color: 'inherit',
    fontSize: '0.95rem', transition: 'all 0.2s', outline: 'none', boxSizing: 'border-box'
  };

  const getAvatarUrl = () => {
    if (profile.profilePicture) {
      if (profile.profilePicture.startsWith('http')) return profile.profilePicture;
      return `http://localhost:5000${profile.profilePicture}`;
    }
    return null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{isOwnProfile ? 'My Profile' : 'User Profile'}</h1>
          <p style={{ color: metaClr, margin: 0, textTransform: 'capitalize' }}>{profile.role}</p>
        </div>
        {isOwnProfile && (
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            style={{ 
              background: isEditMode ? 'transparent' : 'var(--hz-primary)', 
              color: isEditMode ? metaClr : '#fff', 
              border: isEditMode ? `1px solid ${border}` : 'none', 
              padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' 
            }}
          >
            {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        )}
      </div>

      <div style={{ 
        background: bg, border: `1px solid ${border}`, borderRadius: '24px', 
        padding: '2.5rem', backdropFilter: 'blur(16px)',
        boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.2)' : '0 10px 30px rgba(0,0,0,0.05)'
      }}>
        {/* Header & Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: `1px dashed ${border}` }}>
          <div 
            onClick={handleAvatarClick}
            style={{ 
              width: '100px', height: '100px', borderRadius: '50%', 
              background: avatarUrl ? `url(${avatarUrl}) center/cover no-repeat` : 'linear-gradient(135deg, var(--hz-primary) 0%, #8b5cf6 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              color: '#fff', fontSize: '2.5rem', fontWeight: 'bold',
              cursor: isOwnProfile ? 'pointer' : 'default',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(99,102,241,0.3)'
            }}
            onMouseEnter={e => {
              if (isOwnProfile && !avatarUrl) e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={e => {
              if (isOwnProfile && !avatarUrl) e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {!avatarUrl && (profile.name || 'U').charAt(0).toUpperCase()}
            
            {isOwnProfile && (
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)',
                color: 'white', fontSize: '0.75rem', textAlign: 'center', padding: '4px 0',
                opacity: 0, transition: 'opacity 0.2s', 
                ...(uploadingAvatar ? { opacity: 1, background: 'var(--hz-primary)' } : {})
              }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = uploadingAvatar ? 1 : 0}>
                {uploadingAvatar ? 'Uploading...' : 'Upload'}
              </div>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
          
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: 800 }}>{profile.name}</h2>
            {isOwnProfile && <div style={{ color: metaClr, fontSize: '0.95rem' }}>{profile.email}</div>}
          </div>
        </div>

        {/* Content */}
        {isEditMode ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Participant Fields */}
            {profile.role === 'participant' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>Bio</label>
                  <textarea name="bio" placeholder="Tell us about yourself..." rows={4} value={formData.bio} onChange={handleChange} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>Skills (comma separated)</label>
                  <input name="skills" placeholder="e.g. React, Node.js, Python" value={formData.skills} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>GitHub URL</label>
                    <input name="githubUrl" placeholder="https://github.com/..." value={formData.githubUrl} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>LinkedIn URL</label>
                    <input name="linkedInUrl" placeholder="https://linkedin.com/in/..." value={formData.linkedInUrl} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
              </>
            )}

            {/* Judge Fields */}
            {profile.role === 'judge' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>Occupation / Title</label>
                  <input name="occupation" placeholder="e.g. Senior Software Engineer" value={formData.occupation} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>Expertise Tags (comma separated)</label>
                  <input name="expertiseTags" placeholder="e.g. React, AI, UI/UX" value={formData.expertiseTags} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>LinkedIn URL</label>
                  <input name="linkedInUrl" placeholder="https://linkedin.com/in/..." value={formData.linkedInUrl} onChange={handleChange} style={inputStyle} />
                </div>
              </>
            )}

            {/* Organizer Fields */}
            {profile.role === 'organizer' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>Organization Name</label>
                  <input name="organizationName" placeholder="e.g. Acme Hackathons" value={formData.organizationName} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: metaClr }}>Website URL</label>
                  <input name="websiteUrl" placeholder="https://www.your-org.com" value={formData.websiteUrl} onChange={handleChange} style={inputStyle} />
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: `1px solid ${border}` }}>
              <button type="submit" disabled={saving} style={{ background: 'var(--hz-primary)', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {profile.role === 'participant' && (
              <>
                {profile.bio && (
                  <div>
                    <h3 style={{ fontSize: '0.85rem', color: metaClr, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Bio</h3>
                    <p style={{ color: textClr, lineHeight: 1.6, margin: 0 }}>{profile.bio}</p>
                  </div>
                )}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.85rem', color: metaClr, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Skills</h3>
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
                    <h3 style={{ fontSize: '0.85rem', color: metaClr, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Occupation</h3>
                    <p style={{ color: textClr, fontSize: '1.1rem', fontWeight: 500, margin: 0 }}>{profile.occupation}</p>
                  </div>
                )}
                {profile.expertiseTags && profile.expertiseTags.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '0.85rem', color: metaClr, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Expertise</h3>
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
                    <h3 style={{ fontSize: '0.85rem', color: metaClr, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Organization</h3>
                    <p style={{ color: textClr, fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
                      {profile.organizationName}
                      {profile.isVerified && <span style={{ color: '#10b981', marginLeft: '0.5rem' }}>✓ Verified</span>}
                    </p>
                  </div>
                )}
                {profile.websiteUrl && (
                  <div>
                    <h3 style={{ fontSize: '0.85rem', color: metaClr, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Website</h3>
                    <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--hz-primary)', textDecoration: 'none', fontWeight: 500 }}>{profile.websiteUrl}</a>
                  </div>
                )}
              </>
            )}

            {(profile.githubUrl || profile.linkedInUrl) && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: metaClr, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.color=metaClr}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </a>
                )}
                {profile.linkedInUrl && (
                  <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: metaClr, transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color='var(--hz-primary)'} onMouseLeave={e => e.currentTarget.style.color=metaClr}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
