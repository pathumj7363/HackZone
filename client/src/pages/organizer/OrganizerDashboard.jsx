import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function OrganizerDashboard() {
  // Reset scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="hz-page" style={{ backgroundColor: '#f8fafc' }}>
      <div className="hz-container">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em', color: 'var(--hz-text)' }}>
              Organizer Dashboard
            </h1>
            <p style={{ margin: 0, color: 'var(--hz-text-muted)', fontSize: '1rem' }}>
              Global Hackathon 2024 • Summer Series
            </p>
          </div>
          <div>
            <Button variant="primary" style={{ fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create New Hackathon
            </Button>
          </div>
        </div>

        {/* Top KPI Row */}
        <div className="row g-4 hz-mb-6">
          {/* TEAMS */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>TEAMS</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>124</span>
                <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.75rem', fontWeight: '600', padding: '2px 8px', borderRadius: '12px' }}>+12%</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Active this week</div>
            </Card>
          </div>

          {/* SUBMISSIONS */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>SUBMISSIONS</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>86</span>
                <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', fontSize: '0.75rem', fontWeight: '600', padding: '2px 8px', borderRadius: '12px' }}>42 today</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Growth last 24h</div>
            </Card>
          </div>

          {/* JUDGES */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>JUDGES</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 13.5V16.5l-4-4-4 4v-3L10 9.5Z"></path>
                  <path d="M22 10.5V13.5l-4-4-4 4v-3L18 6.5Z" style={{transform: "translate(-3px, 1px) rotate(45deg)", transformOrigin: "center"}}></path>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--hz-text)' }}>12</span>
                <span style={{ color: '#16a34a', fontSize: '0.85rem', fontWeight: '600' }}>● Active</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Panel confirmed</div>
            </Card>
          </div>

          {/* PENDING REVIEWS */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--hz-text-muted)', letterSpacing: '0.05em' }}>PENDING REVIEWS</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1, color: '#ef4444' }}>14</span>
                <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', fontWeight: '600', padding: '2px 8px', borderRadius: '12px' }}>Critical</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>Action required</div>
            </Card>
          </div>
        </div>

        {/* Main Grid (8 + 4) */}
        <div className="row g-4">
          
          {/* Left Column (8/12) */}
          <div className="col-12 col-lg-8" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Submissions Over Time */}
            <Card style={{ borderRadius: '12px', border: '1px solid var(--hz-border)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: 'var(--hz-text)' }}>Submissions Over Time</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--hz-primary)' }}></span>
                  Submissions
                </div>
              </div>
              <div style={{ height: '300px', width: '100%', position: 'relative', padding: '1.5rem' }}>
                {/* Mock Chart Area */}
                <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="2" />
                  <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="2" />
                  <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="2" />
                  <line x1="0" y1="200" x2="1000" y2="200" stroke="#f1f5f9" strokeWidth="2" />
                  
                  {/* Smooth curved line for chart */}
                  <path d="M 0,180 C 200,180 300,160 400,140 C 500,120 550,80 700,50 C 850,20 950,50 1000,60" fill="none" stroke="var(--hz-primary)" strokeWidth="4" />
                </svg>
                {/* X Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--hz-text-muted)', fontSize: '0.85rem' }}>
                  <span>June 1</span>
                  <span>June 7</span>
                  <span>June 14</span>
                  <span>June 21</span>
                  <span>Deadline</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--hz-text)' }}>Recent Activity</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Item 1 */}
                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--hz-border)', marginBottom: '1.25rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--hz-primary)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'var(--hz-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600' }}>Neural Knights</span> submitted a project: <span style={{ color: 'var(--hz-primary)', fontWeight: '600', textDecoration: 'underline' }}>Quantum Optimizer</span>
                    </div>
                    <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.85rem' }}>
                      2 hours ago • Category: AI/ML
                    </div>
                  </div>
                </div>

                {/* Item 2 */}
                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--hz-border)', marginBottom: '1.25rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#f97316' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'var(--hz-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600' }}>Sarah Jenkins</span> joined the judging panel
                    </div>
                    <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.85rem' }}>
                      5 hours ago • Specialist: Fintech
                    </div>
                  </div>
                </div>

                {/* Item 3 */}
                <div style={{ display: 'flex', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--hz-border)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#9333ea' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: 'var(--hz-text)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      New team "<span style={{ fontWeight: '600' }}>Cyber Sentinels</span>" created
                    </div>
                    <div style={{ color: 'var(--hz-text-muted)', fontSize: '0.85rem' }}>
                      Yesterday at 6:45 PM • 4 Members
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center', paddingTop: '1.25rem' }}>
                <Link to="#" style={{ color: 'var(--hz-primary)', fontWeight: '500', textDecoration: 'none' }}>View All Activity</Link>
              </div>
            </Card>

          </div>

          {/* Right Column (4/12) */}
          <div className="col-12 col-lg-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Quick Actions */}
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1.25rem 0', color: 'var(--hz-text)' }}>Quick Actions</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                {/* Manage Hackathon */}
                <Link to="/organizer/hackathon" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid var(--hz-border)', borderRadius: '8px', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>Manage Hackathon</span>
                  </div>
                </Link>

                {/* Manage Teams */}
                <Link to="/organizer/teams" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid var(--hz-border)', borderRadius: '8px', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                      <path d="M8 14h.01"></path>
                      <path d="M12 14h.01"></path>
                      <path d="M16 14h.01"></path>
                      <path d="M8 18h.01"></path>
                      <path d="M12 18h.01"></path>
                      <path d="M16 18h.01"></path>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>Manage Teams</span>
                  </div>
                </Link>

                {/* Assign Judges */}
                <Link to="/organizer/judges" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid var(--hz-border)', borderRadius: '8px', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      <polyline points="9 12 11 14 15 10"></polyline>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>Assign Judges</span>
                  </div>
                </Link>

                {/* Send Announcement */}
                <Link to="/organizer/announce" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ border: '1px solid var(--hz-border)', borderRadius: '8px', padding: '1.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', transition: 'border-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--hz-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--hz-border)'}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', textAlign: 'center' }}>Send Announcement</span>
                  </div>
                </Link>

              </div>
            </Card>

            {/* Hackathon Status */}
            <Card padding style={{ borderRadius: '12px', border: '1px solid var(--hz-border)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: 'var(--hz-text)' }}>Hackathon Status</h2>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--hz-text)' }}>
                  <span style={{ fontWeight: '500' }}>Registration Progress</span>
                  <span style={{ fontWeight: '600', color: 'var(--hz-primary)' }}>82%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', backgroundColor: 'var(--hz-primary)', borderRadius: '4px' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--hz-text)' }}>
                  <span style={{ fontWeight: '500' }}>Reviewing Completion</span>
                  <span style={{ fontWeight: '600', color: 'var(--hz-primary)' }}>45%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', backgroundColor: 'var(--hz-primary)', borderRadius: '4px' }}></div>
                </div>
              </div>
            </Card>

            {/* Need Help? Card */}
            <div style={{ backgroundColor: 'var(--hz-primary)', borderRadius: '12px', padding: '2rem 1.5rem', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(88, 80, 225, 0.2)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.75rem 0' }}>Need help?</h2>
              <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
                Our team is available 24/7 to help you manage your participants and judges.
              </p>
              <Button style={{ backgroundColor: 'white', color: 'var(--hz-primary)', fontWeight: 'bold', padding: '0.75rem 1.25rem', borderRadius: '8px', position: 'relative', zIndex: 2 }}>
                Contact Support
              </Button>
              
              {/* Background graphic */}
              <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.15 }}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
