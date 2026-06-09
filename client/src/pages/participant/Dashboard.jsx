import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { getMyTeamApi } from '../../api/team.api';
import { getHackathonsApi } from '../../api/hackathon.api';
import { getMySubmissionsApi } from '../../api/submission.api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [hackathonsCount, setHackathonsCount] = useState(2);
  const [submissionsCount, setSubmissionsCount] = useState(1);
  const avgScore = '88%';

  // Reset scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Fetch dashboard data dynamically
    Promise.all([
      getMyTeamApi().catch(() => null),
      getHackathonsApi().catch(() => null),
      getMySubmissionsApi().catch(() => null)
    ]).then(([teamData, hackathonsData, submissionsData]) => {
      if (teamData) setTeam(teamData);
      if (hackathonsData) setHackathonsCount(hackathonsData.length);
      if (submissionsData) setSubmissionsCount(submissionsData.length);
    });
  }, []);

  const handleViewAllActivity = () => {
    toast.info("Recent activity log is up to date.");
  };

  const handleLearnMore = () => {
    toast.success("Thank you for your interest! Organizer tools will be available soon.");
  };

  // Safe formatting of the first name to prevent rendering errors
  const fullName = user?.name || 'Alex';
  const firstName = (() => {
    const namePart = fullName.split(' ')[0];
    // If name is placeholder like 'Google', fall back to email prefix
    if (namePart && namePart.toLowerCase() !== 'google') return namePart;
    if (user?.email) return user.email.split('@')[0];
    return namePart;
  })();
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  })();
  return (
    <div className="hz-page">
      <div className="hz-container">
        {/* Header Greeting */}
        <div className="hz-mb-6">
          <h1 className="hz-heading-1" style={{ fontSize: 'var(--hz-font-size-4xl)', marginBottom: '0.25rem' }}>
            {greeting} {firstName}
          </h1>
          <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-base)', margin: 0 }}>
            Here is what's happening with your hackathons today.
          </p>
        </div>

        {/* KPI Row */}
        <div className="row g-4 hz-mb-8">
          {/* Active Hackathons KPI */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding className="d-flex flex-column justify-content-between h-100" style={{ minHeight: '112px' }}>
              <div style={{ textTransform: 'uppercase', fontSize: 'var(--hz-font-size-xs)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text-muted)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                ACTIVE HACKATHONS
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span style={{ fontSize: 'var(--hz-font-size-3xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', lineHeight: '1' }}>
                  {hackathonsCount}
                </span>
                <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', whiteSpace: 'nowrap' }}>
                  +1 this month
                </span>
              </div>
            </Card>
          </div>

          {/* My Team KPI */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding className="d-flex flex-column justify-content-between h-100" style={{ minHeight: '112px' }}>
              <div style={{ textTransform: 'uppercase', fontSize: 'var(--hz-font-size-xs)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text-muted)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                MY TEAM
              </div>
              <div style={{ fontSize: 'var(--hz-font-size-2xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {team?.name || 'Alpha Bytes'}
              </div>
            </Card>
          </div>

          {/* Submissions KPI */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding className="d-flex flex-column justify-content-between h-100" style={{ minHeight: '112px' }}>
              <div style={{ textTransform: 'uppercase', fontSize: 'var(--hz-font-size-xs)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text-muted)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                SUBMISSIONS
              </div>
              <div className="d-flex align-items-baseline gap-2">
                <span style={{ fontSize: 'var(--hz-font-size-3xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', lineHeight: '1' }}>
                  {submissionsCount}
                </span>
                <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)', whiteSpace: 'nowrap' }}>
                  Pending
                </span>
              </div>
            </Card>
          </div>

          {/* Avg Score KPI */}
          <div className="col-12 col-sm-6 col-lg-3">
            <Card padding className="d-flex flex-column justify-content-between h-100" style={{ minHeight: '112px' }}>
              <div style={{ textTransform: 'uppercase', fontSize: 'var(--hz-font-size-xs)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text-muted)', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                AVG SCORE
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ fontSize: 'var(--hz-font-size-3xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text)', lineHeight: '1' }}>
                  {avgScore}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--hz-success)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
            </Card>
          </div>
        </div>

        {/* Dashboard Main Grid */}
        <div className="row g-4">
          {/* Left Column: Quick Actions */}
          <div className="col-12 col-lg-8">
            <h2 className="hz-heading-3 hz-mb-4" style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)', letterSpacing: '-0.01em' }}>
              Quick Actions
            </h2>
            <div className="row g-4">
              {/* Browse Hackathons */}
              <div className="col-12 col-sm-6">
                <Link to="/hackathons" style={{ textDecoration: 'none' }}>
                  <Card padding hover className="d-flex flex-column h-100" style={{ minHeight: '180px', transition: 'all var(--hz-transition)' }}>
                    <div className="hz-mb-4" style={{
                      background: 'var(--hz-primary-light)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                    <h3 className="hz-heading-3 hz-mb-1" style={{ fontSize: 'var(--hz-font-size-lg)', color: 'var(--hz-text)' }}>
                      Browse Hackathons
                    </h3>
                    <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', margin: 0, lineHeight: '1.45' }}>
                      Find your next challenge and join global innovators.
                    </p>
                  </Card>
                </Link>
              </div>

              {/* Create Team */}
              <div className="col-12 col-sm-6">
                <Link to="/teams/create" style={{ textDecoration: 'none' }}>
                  <Card padding hover className="d-flex flex-column h-100" style={{ minHeight: '180px', transition: 'all var(--hz-transition)' }}>
                    <div className="hz-mb-4" style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--hz-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                    </div>
                    <h3 className="hz-heading-3 hz-mb-1" style={{ fontSize: 'var(--hz-font-size-lg)', color: 'var(--hz-text)' }}>
                      Create Team
                    </h3>
                    <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', margin: 0, lineHeight: '1.45' }}>
                      Invite friends and build the ultimate dev squad.
                    </p>
                  </Card>
                </Link>
              </div>

              {/* Submit Project */}
              <div className="col-12 col-sm-6">
                <Link to="/submit" style={{ textDecoration: 'none' }}>
                  <Card padding hover className="d-flex flex-column h-100" style={{ minHeight: '180px', transition: 'all var(--hz-transition)' }}>
                    <div className="hz-mb-4" style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--hz-warning-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="12" y1="18" x2="12" y2="12"></line>
                        <polyline points="9 15 12 12 15 15"></polyline>
                      </svg>
                    </div>
                    <h3 className="hz-heading-3 hz-mb-1" style={{ fontSize: 'var(--hz-font-size-lg)', color: 'var(--hz-text)' }}>
                      Submit Project
                    </h3>
                    <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', margin: 0, lineHeight: '1.45' }}>
                      Ready to ship? Upload your final build and docs.
                    </p>
                  </Card>
                </Link>
              </div>

              {/* View Results */}
              <div className="col-12 col-sm-6">
                <Link to="/results" style={{ textDecoration: 'none' }}>
                  <Card padding hover className="d-flex flex-column h-100" style={{ minHeight: '180px', transition: 'all var(--hz-transition)' }}>
                    <div className="hz-mb-4" style={{
                      background: 'rgba(100, 116, 139, 0.1)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--hz-text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                    </div>
                    <h3 className="hz-heading-3 hz-mb-1" style={{ fontSize: 'var(--hz-font-size-lg)', color: 'var(--hz-text)' }}>
                      View Results
                    </h3>
                    <p className="hz-text-muted" style={{ fontSize: 'var(--hz-font-size-sm)', margin: 0, lineHeight: '1.45' }}>
                      Check scores, feedback, and leaderboard status.
                    </p>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Activity & Go Pro */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">
            {/* Recent Activity Card */}
            <Card padding className="d-flex flex-column justify-content-between h-100" style={{ paddingBottom: '1.25rem' }}>
              <div>
                <h2 className="hz-heading-3 hz-mb-4" style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)' }}>
                  Recent Activity
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Activity 1: Star Icon */}
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--hz-info-bg)',
                      color: 'var(--hz-info-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-medium)', color: 'var(--hz-text)', lineHeight: '1.4' }}>
                        Team <span style={{ fontWeight: 'var(--hz-font-weight-semibold)' }}>{team?.name || 'Alpha Bytes'}</span> joined Global AI Hack
                      </p>
                      <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)' }}>2 hours ago</span>
                    </div>
                  </div>

                  {/* Activity 2: Check Icon */}
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--hz-warning-bg)',
                      color: 'var(--hz-warning-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-medium)', color: 'var(--hz-text)', lineHeight: '1.4' }}>
                        Submission received for <span style={{ fontWeight: 'var(--hz-font-weight-semibold)' }}>Open Source Jam</span>
                      </p>
                      <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)' }}>Yesterday at 4:30 PM</span>
                    </div>
                  </div>

                  {/* Activity 3: Add User Icon */}
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--hz-surface)',
                      color: 'var(--hz-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-medium)', color: 'var(--hz-text)', lineHeight: '1.4' }}>
                        <span style={{ fontWeight: 'var(--hz-font-weight-semibold)' }}>Sarah Chen</span> invited you to Cloud Innovators
                      </p>
                      <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)' }}>2 days ago</span>
                    </div>
                  </div>

                  {/* Activity 4: Megaphone Icon */}
                  <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--hz-primary-light)',
                      color: 'var(--hz-primary-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                      </svg>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 'var(--hz-font-size-sm)', fontWeight: 'var(--hz-font-weight-medium)', color: 'var(--hz-text)', lineHeight: '1.4' }}>
                        New Hackathon Announcement: <span style={{ fontWeight: 'var(--hz-font-weight-semibold)' }}>Web3 Frontiers</span>
                      </p>
                      <span style={{ fontSize: 'var(--hz-font-size-xs)', color: 'var(--hz-text-muted)' }}>3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--hz-border)', paddingTop: '1rem', textAlign: 'center' }}>
                <button
                  onClick={handleViewAllActivity}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--hz-primary)',
                    fontSize: 'var(--hz-font-size-sm)',
                    fontWeight: 'var(--hz-font-weight-semibold)',
                    cursor: 'pointer',
                    transition: 'color var(--hz-transition)'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--hz-primary-hover)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--hz-primary)'}
                >
                  View All Activity
                </button>
              </div>
            </Card>

            {/* Go Pro Organizer Card */}
            <Card padding={false} style={{
              background: 'linear-gradient(135deg, var(--hz-primary) 0%, #312e81 100%)',
              color: 'var(--hz-text-inverse)',
              border: 'none',
              borderRadius: 'var(--hz-radius)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--hz-shadow-md)'
            }}>
              {/* Graphic circle elements in background */}
              <div style={{
                position: 'absolute',
                bottom: '-24px',
                right: '-24px',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                right: '-48px',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                pointerEvents: 'none'
              }} />

              <div style={{ padding: 'var(--hz-space-6)', position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: 'var(--hz-font-size-xl)', fontWeight: 'var(--hz-font-weight-bold)', color: 'var(--hz-text-inverse)', marginBottom: '0.75rem', marginTop: 0 }}>
                  Go Pro Organizer
                </h3>
                <p style={{ color: 'var(--hz-text-inverse)', fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.5', marginBottom: '1.5rem', maxWidth: '92%' }}>
                  Host your own internal company hackathons with advanced analytics and judging tools.
                </p>
                <button
                  onClick={handleLearnMore}
                  style={{
                    background: 'var(--hz-bg)',
                    color: 'var(--hz-primary)',
                    border: 'none',
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 'var(--hz-font-weight-semibold)',
                    fontSize: 'var(--hz-font-size-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--hz-transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Learn More
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

