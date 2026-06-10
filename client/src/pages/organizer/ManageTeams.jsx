import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTeamsApi } from '../../api/team.api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import TextArea from '../../components/ui/TextArea';

export default function ManageTeams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // view: 'list' | 'details' | 'form'
  const [view, setView] = useState('list');
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  // Search and filter state
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Form state
  const initialForm = {
    name: '',
    projectName: '',
    status: 'pending',
    members: 1,
    description: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await getAllTeamsApi();
      const augmentedData = data.map((team, index) => ({
        ...team,
        status: index === 0 ? 'pending' : (index % 3 === 0 ? 'disqualified' : 'approved'),
        projectName: index % 2 === 0 ? 'Quantum Optimizer' : 'FinAI Agent',
        avatarBg: ['#e0e7ff', '#fce7f3', '#dcfce7', '#fef3c7'][index % 4],
        avatarColor: ['#3730a3', '#9d174d', '#166534', '#92400e'][index % 4],
        submitted: index % 2 !== 0,
        description: 'Building a revolutionary AI model to solve complex data structures.',
        membersList: Array.from({ length: team.members || 3 }).map((_, i) => ({
          name: `Member ${i + 1}`,
          role: i === 0 ? 'Team Lead' : 'Developer',
          email: `member${i+1}@example.com`
        }))
      }));

      if (augmentedData.length < 5) {
        augmentedData.push(
          { id: 't3', name: 'Neural Knights', members: 3, status: 'approved', projectName: 'AI Medical Vision', avatarBg: '#e0e7ff', avatarColor: '#3730a3', submitted: true, description: 'Medical imaging AI.', membersList: [{name: 'Alice', role: 'Lead', email: 'a@test.com'}, {name: 'Bob', role: 'Dev', email: 'b@test.com'}] },
          { id: 't4', name: 'Cyber Sentinels', members: 4, status: 'pending', projectName: 'Zero Trust Auth', avatarBg: '#fce7f3', avatarColor: '#9d174d', submitted: false, description: 'Security first.', membersList: [{name: 'Charlie', role: 'Lead', email: 'c@test.com'}] },
          { id: 't5', name: 'Data Miners', members: 5, status: 'approved', projectName: 'Predictive Sales', avatarBg: '#dcfce7', avatarColor: '#166534', submitted: true, description: 'Sales predictions.', membersList: [{name: 'Dave', role: 'Lead', email: 'd@test.com'}] }
        );
      }
      setTeams(augmentedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (teamId, action) => {
    setTeams(teams.map(t => {
      if (t.id === teamId) {
        if (action === 'approve') return { ...t, status: 'approved' };
        if (action === 'disqualify') return { ...t, status: 'disqualified' };
        if (action === 'delete') return null;
      }
      return t;
    }).filter(Boolean));
    if (action === 'delete') setView('list');
  };

  const exportCSV = () => {
    alert("Exporting CSV... (Mocked Action)");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedTeam) {
      // Edit mode
      setTeams(teams.map(t => t.id === selectedTeam.id ? { ...t, ...formData } : t));
    } else {
      // Create mode
      const newTeam = {
        id: `t${Date.now()}`,
        ...formData,
        avatarBg: '#e0e7ff',
        avatarColor: '#3730a3',
        submitted: false,
        membersList: Array.from({ length: formData.members }).map((_, i) => ({
          name: `New Member ${i+1}`, role: 'Developer', email: `new${i}@example.com`
        }))
      };
      setTeams([newTeam, ...teams]);
    }
    setView('list');
  };

  const openDetails = (team) => {
    setSelectedTeam(team);
    setView('details');
  };

  const openForm = (team = null) => {
    setSelectedTeam(team);
    if (team) {
      setFormData({
        name: team.name,
        projectName: team.projectName,
        status: team.status,
        members: team.members,
        description: team.description || ''
      });
    } else {
      setFormData(initialForm);
    }
    setView('form');
  };

  const filteredTeams = teams.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge variant="success" style={{ fontWeight: '600' }}>Approved</Badge>;
      case 'pending': return <Badge variant="warning" style={{ fontWeight: '600' }}>Pending</Badge>;
      case 'disqualified': return <Badge variant="danger" style={{ fontWeight: '600' }}>Disqualified</Badge>;
      default: return <Badge variant="neutral">{status}</Badge>;
    }
  };

  // Views
  const renderListView = () => (
    <>
      {/* Top KPI Row */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>TOTAL TEAMS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : teams.length}</div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>PARTICIPANTS</span>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>{loading ? '-' : teams.reduce((acc, t) => acc + (Number(t.members) || 0), 0)}</div>
          </Card>
        </div>
        <div className="col-12 col-md-4">
          <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>PENDING APPROVALS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: teams.filter(t => t.status === 'pending').length > 0 ? '#d97706' : 'var(--hz-text)' }}>
                {loading ? '-' : teams.filter(t => t.status === 'pending').length}
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Toolbar */}
      <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', display: 'flex', gap: '1rem' }}>
          <Input 
            type="text" 
            placeholder="Search teams by name or project..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            style={{ margin: 0, padding: '0.6rem 1rem', flex: 1 }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="hz-input"
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--hz-border)', minWidth: '150px' }}
          >
            <option value="all">All Teams</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="disqualified">Disqualified</option>
          </select>
          <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
          <Button variant="primary" onClick={() => openForm(null)}>Add Team</Button>
        </div>
      </Card>

      {/* Teams List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--hz-text-muted)' }}>Loading teams...</div>
      ) : filteredTeams.length === 0 ? (
        <Card padding style={{ textAlign: 'center', padding: '4rem 2rem', border: '1px solid var(--hz-border)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: 'var(--hz-text)' }}>No teams found</h3>
          <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>Try adjusting your search or filter criteria.</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTeams.map(team => (
            <Card key={team.id} style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s', cursor: 'pointer', ':hover': { borderColor: 'var(--hz-primary)' } }} onClick={() => openDetails(team)}>
              <div style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem', backgroundColor: team.status === 'disqualified' ? '#fafafa' : 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 300px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: team.avatarBg, color: team.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: team.status === 'disqualified' ? 'var(--hz-text-muted)' : 'var(--hz-text)' }}>
                      {team.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                      <span>{team.members} Members</span>
                      <span>•</span>
                      <span>Project: {team.projectName}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '0 0 auto' }}>
                  {getStatusBadge(team.status)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 0 auto', justifyContent: 'flex-end' }}>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDetails(team); }}>View</Button>
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openForm(team); }}>Edit</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  const renderDetailsView = () => {
    if (!selectedTeam) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <Button variant="ghost" onClick={() => setView('list')} style={{ alignSelf: 'flex-start' }}>&larr; Back to Teams</Button>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', backgroundColor: selectedTeam.avatarBg, color: selectedTeam.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
                    {selectedTeam.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0' }}>{selectedTeam.name}</h2>
                    <p style={{ margin: 0, color: 'var(--hz-text-muted)' }}>Project: {selectedTeam.projectName}</p>
                  </div>
                </div>
                {getStatusBadge(selectedTeam.status)}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Team Description</h3>
              <p style={{ color: 'var(--hz-text)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{selectedTeam.description}</p>
              
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Members ({selectedTeam.members})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedTeam.membersList?.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--hz-border)', borderRadius: '8px' }}>
                    <div>
                      <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600' }}>{m.name}</p>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>{m.email}</p>
                    </div>
                    <Badge variant="neutral">{m.role}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem' }}>Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedTeam.status === 'pending' && <Button variant="primary" style={{ backgroundColor: '#166534' }} onClick={() => handleAction(selectedTeam.id, 'approve')}>Approve Team</Button>}
                {selectedTeam.status !== 'disqualified' && <Button variant="outline" style={{ color: '#b91c1c', borderColor: '#fca5a5' }} onClick={() => handleAction(selectedTeam.id, 'disqualify')}>Disqualify Team</Button>}
                <Button variant="outline" onClick={() => openForm(selectedTeam)}>Edit Team Info</Button>
                <Button variant="ghost" style={{ color: '#b91c1c' }} onClick={() => handleAction(selectedTeam.id, 'delete')}>Delete Team</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const renderFormView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Button variant="ghost" onClick={() => setView(selectedTeam ? 'details' : 'list')} style={{ alignSelf: 'flex-start' }}>&larr; Back</Button>
      <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{selectedTeam ? 'Edit Team' : 'Add New Team'}</h2>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Team Name" name="name" value={formData.name} onChange={handleFormChange} required />
          <Input label="Project Name" name="projectName" value={formData.projectName} onChange={handleFormChange} required />
          <TextArea label="Description" name="description" value={formData.description} onChange={handleFormChange} rows={3} />
          
          <div className="row g-3">
            <div className="col-6">
              <Input type="number" label="Members Count" name="members" value={formData.members} onChange={handleFormChange} min="1" max="10" />
            </div>
            <div className="col-6">
              <div className="hz-field">
                <label className="hz-label">Status</label>
                <select name="status" value={formData.status} onChange={handleFormChange} className="hz-input" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid var(--hz-border)' }}>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="disqualified">Disqualified</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button type="button" variant="outline" style={{ flex: 1 }} onClick={() => setView(selectedTeam ? 'details' : 'list')}>Cancel</Button>
            <Button type="submit" variant="primary" style={{ flex: 1 }}>Save Team</Button>
          </div>
        </form>
      </Card>
    </div>
  );

  return (
    <div className="hz-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '3rem' }}>
      <div className="hz-container">
        {/* Page Header */}
        {view === 'list' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <button type="button" onClick={() => navigate('/organizer')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em', color: 'var(--hz-text)' }}>Manage Teams</h1>
              <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1rem' }}>Comprehensive dashboard to oversee all participants.</p>
            </div>
          </div>
        )}

        {/* Content Router */}
        {view === 'list' && renderListView()}
        {view === 'details' && renderDetailsView()}
        {view === 'form' && renderFormView()}
        
      </div>
    </div>
  );
}
