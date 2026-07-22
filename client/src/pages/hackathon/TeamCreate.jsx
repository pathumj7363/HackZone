import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeamApi } from '../../api/team.api';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'HZ-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function TeamCreate() {
  const [inviteCode, setInviteCode] = useState(() => generateCode());
  const [form, setForm] = useState({
    name: '',
    description: '',
    maxMembers: 4,
    isPublic: true
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleRegenerateCode = () => {
    const newCode = generateCode();
    setInviteCode(newCode);
    toast.info("Generated new invite code!");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Team name is required");
      return;
    }
    setLoading(true);
    try {
      await createTeamApi({ 
        name: form.name.trim(), 
        description: form.description, 
        isPublic: form.isPublic,
        maxCapacity: form.maxMembers,
        inviteCode: inviteCode,
        hackathonId: 'general'
      });
      toast.success("Team created successfully!");
      navigate('/teams/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.error || "Failed to create team");
      setLoading(false);
    }
  };

  const setField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const togglePublic = () => setForm(prev => ({ ...prev, isPublic: !prev.isPublic }));

  // Helper styles for the toggle
  const toggleStyle = {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: form.isPublic ? 'var(--hz-primary)' : 'var(--hz-border)',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  };

  const toggleKnobStyle = {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: '#fff',
    position: 'absolute',
    top: '2px',
    left: form.isPublic ? '22px' : '2px',
    transition: 'left 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };

  return (
    <div className="hz-page" style={{ minHeight: 'calc(100vh - 64px - 64px)' }}>
      <div className="hz-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1rem' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)' }}>
            Create your team
          </h1>
          <p style={{ margin: 0, fontSize: 'var(--hz-font-size-base)', color: 'var(--hz-text-secondary)' }}>
            Gather your allies and start building something incredible.
          </p>
        </div>

        {/* Form Card */}
        <div style={{ width: '100%', maxWidth: '600px' }}>
          <Card padding style={{ padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <Input
                id="name"
                name="name"
                label="Team Name"
                placeholder="Neural Knights"
                value={form.name}
                onChange={setField('name')}
                helperText="Make it memorable. You can change this later."
                required
              />

              <TextArea
                id="description"
                name="description"
                label="Team Description"
                placeholder="Building the next generation of neural network visualizations for collaborative research environments."
                value={form.description}
                onChange={setField('description')}
                rows={3}
              />

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <Input
                    type="number"
                    id="maxMembers"
                    name="maxMembers"
                    label="Max Members"
                    value={form.maxMembers}
                    onChange={setField('maxMembers')}
                    helperText="Recommended limit: 4-6 members."
                    min="1"
                    max="10"
                  />
                </div>
                <div className="col-12 col-md-6">
                  {/* Custom input for unique invite code preview */}
                  <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <label style={{ fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', margin: 0 }}>
                        Auto-Generated Code
                      </label>
                      <button
                        type="button"
                        onClick={handleRegenerateCode}
                        style={{ background: 'none', border: 'none', color: 'var(--hz-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}
                      >
                        🔄 Refresh
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        readOnly
                        value={inviteCode}
                        className="hz-input"
                        style={{ background: 'var(--hz-surface)', color: 'var(--hz-primary)', fontWeight: 'bold', letterSpacing: '0.05em', paddingRight: '2.5rem' }}
                      />
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--hz-primary)', display: 'flex', alignItems: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                    </div>
                    <p style={{ marginTop: '0.35rem', fontSize: '11px', color: 'var(--hz-text-muted)', fontStyle: 'italic' }}>
                      Unique invite code generated for your team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Public Team Toggle Section */}
              <div style={{
                background: 'var(--hz-surface)',
                borderRadius: '8px',
                padding: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ color: 'var(--hz-primary)', marginTop: '2px' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--hz-font-size-base)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', marginBottom: '0.25rem' }}>
                        Public Team
                      </div>
                      <div style={{ fontSize: 'var(--hz-font-size-sm)', color: 'var(--hz-text-secondary)' }}>
                        Discoverable in the global directory (Join Team section).
                      </div>
                    </div>
                  </div>
                  <div style={toggleStyle} onClick={togglePublic}>
                    <div style={toggleKnobStyle} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ color: 'var(--hz-text-secondary)', marginTop: '2px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </div>
                  <div style={{ fontSize: 'var(--hz-font-size-sm)', color: 'var(--hz-text-secondary)' }}>
                    {form.isPublic ? 'Visible in Browse Open Teams and searchable by name or code.' : 'Private teams require a direct invite code to join.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem',
                marginTop: '1rem', paddingTop: '1.5rem',
                borderTop: '1px solid var(--hz-border)'
              }}>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--hz-text-secondary)',
                    fontWeight: 'var(--hz-font-weight-medium)', fontSize: 'var(--hz-font-size-sm)',
                    cursor: 'pointer', transition: 'color 0.2s', padding: '0.5rem'
                  }}
                >
                  Cancel
                </button>
                <Button variant="primary" type="submit" disabled={loading || !form.name.trim()}>
                  {loading ? 'Creating...' : 'Create team'}
                </Button>
              </div>

            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

