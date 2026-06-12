import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Card, Button, Input, TextArea, PageHeader } from '../../components/ui';
import { updateParticipantProfileApi } from '../../api/participant.api';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    skills: '',
    githubUrl: '',
    linkedInUrl: '',
    bio: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
      await updateParticipantProfileApi({
        ...formData,
        skills: skillsArray
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hz-page">
      <div className="hz-container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
        <PageHeader 
          title="My Profile" 
          subtitle="Update your personal details and links." 
        />
        
        <Card padding="2rem">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Name</label>
                <Input value={user?.name || ''} disabled />
              </div>
              <div>
                <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                <Input value={user?.email || ''} disabled />
              </div>
            </div>

            <div>
              <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Skills (comma separated)</label>
              <Input 
                name="skills"
                placeholder="e.g. React, Node.js, Python" 
                value={formData.skills} 
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>GitHub URL</label>
                <Input 
                  name="githubUrl"
                  placeholder="https://github.com/username" 
                  value={formData.githubUrl} 
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>LinkedIn URL</label>
                <Input 
                  name="linkedInUrl"
                  placeholder="https://linkedin.com/in/username" 
                  value={formData.linkedInUrl} 
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Bio</label>
              <TextArea 
                name="bio"
                placeholder="Tell us about yourself..." 
                rows={4}
                value={formData.bio} 
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
