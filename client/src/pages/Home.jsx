import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FeatureSection from '../components/home/InteractiveFeatures';
import bgImage from '../assets/home-bg.png';

const ROLES = ['Developers', 'Designers', 'Innovators', 'AI'];

export default function Home() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Counter states
  const [developersCount, setDevelopersCount] = useState(0);
  const [prizesCount, setPrizesCount] = useState(0);
  const [hackathonsCount, setHackathonsCount] = useState(0);

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

  useEffect(() => {
    // Animate counters
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const counterTimer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      // Ease out quad
      const easing = progress * (2 - progress);

      setDevelopersCount(Math.floor(easing * 12450));
      setPrizesCount(Math.floor(easing * 50000));
      setHackathonsCount(Math.floor(easing * 14));

      if (currentStep >= steps) {
        clearInterval(counterTimer);
        setDevelopersCount(12450);
        setPrizesCount(50000);
        setHackathonsCount(14);
      }
    }, interval);

    return () => clearInterval(counterTimer);
  }, []);

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
          <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center" style={{ gap: '1rem', marginBottom: '3rem' }}>
            <Link to="/register/role-select" style={{ width: '100%', maxWidth: '280px' }} className="d-block w-sm-auto">
              <Button variant="primary" size="lg" style={{ width: '100%' }}>Get Started</Button>
            </Link>
            <Link to="/hackathons" style={{ width: '100%', maxWidth: '280px' }} className="d-block w-sm-auto">
              <Button variant="outline" size="lg" style={{ width: '100%' }}>Browse Hackathons</Button>
            </Link>
          </div>

          {/* Social Proof Counters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            color: 'var(--hz-text-secondary)',
            fontSize: 'var(--hz-font-size-md)',
            animation: 'fadeInUp 1s ease-out 0.5s both'
          }}>
            <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>⚡</span>
              <span><strong style={{ color: 'var(--hz-text)' }}>{developersCount.toLocaleString()}</strong> Developers Active</span>
            </div>
            <div className="d-none d-md-block" style={{ width: '1px', height: '1.5rem', background: 'var(--hz-border)' }} />
            <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
              <span><strong style={{ color: 'var(--hz-text)' }}>${prizesCount.toLocaleString()}+</strong> In Prizes</span>
            </div>
            <div className="d-none d-md-block" style={{ width: '1px', height: '1.5rem', background: 'var(--hz-border)' }} />
            <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🚀</span>
              <span><strong style={{ color: 'var(--hz-text)' }}>{hackathonsCount}</strong> Active Hackathons</span>
            </div>
          </div>
        </div>
      </section>

      <FeatureSection />

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
