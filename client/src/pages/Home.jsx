import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import bgImage from '../assets/home-bg.png';

const ROLES = ['Developers', 'Designers', 'Innovators', 'AI'];

export default function Home() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const handleTyping = () => {
      const fullText = ROLES[currentRoleIndex];
      
      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setTypingSpeed(50);
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setTypingSpeed(150);
      }

      if (!isDeleting && currentText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % ROLES.length);
        setTypingSpeed(500);
      } else {
        timer = setTimeout(handleTyping, typingSpeed);
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentRoleIndex, typingSpeed]);

  return (
    <div className="hz-page" style={{ paddingTop: 0 }}>
      {/* Hero Section */}
      <section 
        style={{ 
          position: 'relative',
          padding: '6rem 0',
          borderBottom: '1px solid var(--hz-border)',
          overflow: 'hidden'
        }}
        className="px-3"
      >
        {/* Blurred Background Layer */}
        <div 
          style={{
            position: 'absolute',
            top: -20, // Negative offsets to prevent blurred edges from showing white
            left: -20,
            right: -20,
            bottom: -20,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            opacity: 0.3,
            zIndex: 0
          }}
        />
        {/* Gradient Overlay for better text readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(var(--hz-primary-rgb, 108, 92, 231), 0.2) 0%, var(--hz-bg) 100%)',
            zIndex: 0
          }}
        />
        <div className="hz-container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Badge variant="primary" className="hz-mb-4" style={{ padding: '0.4rem 1rem', fontSize: 'var(--hz-font-size-sm)' }}>
            v1.0 is Live 🚀
          </Badge>
          <h1 className="hz-heading-1" style={{ marginBottom: '1.5rem', color: 'var(--hz-text)' }}>
            Build the Future with <span style={{ color: 'var(--hz-primary)' }}>{currentText}</span>
            <style>{`
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
              }
            `}</style>
            <span style={{ color: 'var(--hz-primary)', animation: 'blink 1s step-end infinite' }}>|</span>
          </h1>
          <p className="hz-text-secondary" style={{ fontSize: 'var(--hz-font-size-xl)', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 'var(--hz-line-height-relaxed)' }}>
            The ultimate platform to host, participate, and evaluate hackathons. Unleash your creativity and collaborate with developers globally.
          </p>
          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center" style={{ gap: '1rem' }}>
            <Link to="/register/role-select" style={{ width: '100%', maxWidth: '280px' }} className="d-block w-sm-auto">
              <Button variant="primary" size="lg" style={{ width: '100%' }}>Get Started</Button>
            </Link>
            <Link to="/hackathons" style={{ width: '100%', maxWidth: '280px' }} className="d-block w-sm-auto">
              <Button variant="outline" size="lg" style={{ width: '100%' }}>Browse Hackathons</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="hz-container" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 className="hz-heading-2 hz-mb-2">Everything You Need</h2>
          <p className="hz-text-muted">A streamlined experience for every role in the hackathon ecosystem.</p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <Card padding hover style={{ borderTop: '4px solid var(--hz-info)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Badge variant="info" className="hz-mb-4">Participants</Badge>
                <h3 className="hz-heading-3 hz-mb-2">Join & Build</h3>
                <p className="hz-text-muted hz-mb-6" style={{ fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.6' }}>
                  Discover exciting hackathons, form dynamic teams with other developers, and seamlessly submit your projects to win prizes.
                </p>
              </div>
              <Link to="/register?role=participant" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Join Now</Button>
              </Link>
            </Card>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Card padding hover style={{ borderTop: '4px solid var(--hz-success)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Badge variant="success" className="hz-mb-4">Organizers</Badge>
                <h3 className="hz-heading-3 hz-mb-2">Host & Manage</h3>
                <p className="hz-text-muted hz-mb-6" style={{ fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.6' }}>
                  Create hackathons, track registrations, manage teams, and assign judges with a powerful, zero-friction dashboard.
                </p>
              </div>
              <Link to="/register?role=organizer" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Host Event</Button>
              </Link>
            </Card>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Card padding hover style={{ borderTop: '4px solid var(--hz-warning)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Badge variant="warning" className="hz-mb-4">Judges</Badge>
                <h3 className="hz-heading-3 hz-mb-2">Evaluate & Score</h3>
                <p className="hz-text-muted hz-mb-6" style={{ fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.6' }}>
                  Review assigned submissions efficiently with our integrated grading portal and provide detailed feedback to participants.
                </p>
              </div>
              <Link to="/register?role=judge" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }}>Start Judging</Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hz-container px-3" style={{ paddingBottom: '5rem' }}>
        <Card padding style={{ 
          background: 'var(--hz-text)', 
          color: 'var(--hz-text-inverse)',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          borderRadius: 'var(--hz-radius-lg)'
        }}>
          <h2 className="hz-heading-2 hz-mb-4" style={{ color: 'var(--hz-text-inverse)' }}>Ready to start hacking?</h2>
          <p style={{ color: 'var(--hz-text-muted)', fontSize: 'var(--hz-font-size-lg)', marginBottom: '2.5rem' }}>
            Join thousands of developers building the next big thing.
          </p>
          <Link to="/register/role-select" style={{ textDecoration: 'none', display: 'inline-block', width: '100%', maxWidth: '320px' }}>
            <Button variant="primary" size="lg" style={{ background: 'var(--hz-primary-light)', color: 'var(--hz-primary)', borderColor: 'var(--hz-primary-light)', width: '100%' }}>
              Create Your Free Account
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
