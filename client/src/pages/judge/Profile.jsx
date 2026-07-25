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
    <div className="hz-page">
      <div className="hz-container" style={{ maxWidth: '800px', padding: '2rem 1rem' }}>
        <PageHeader 
          title="Judge Profile" 
          subtitle="Update your expertise and details to help organizers assign relevant projects." 
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
              <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Occupation / Title</label>
              <Input 
                name="occupation"
                placeholder="e.g. Senior Software Engineer" 
                value={formData.occupation} 
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="hz-text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Expertise Tags (comma separated)</label>
              <Input 
                name="expertiseTags"
                placeholder="e.g. React, AI, UX Design, Blockchain" 
                value={formData.expertiseTags} 
                onChange={handleChange}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--hz-text-muted)', marginTop: '0.25rem' }}>
                These tags help organizers find you when assigning projects.
              </p>
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
