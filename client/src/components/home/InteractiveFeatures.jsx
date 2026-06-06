import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

// 1. Tilt Card Implementation
const TiltCard = ({ children, isActive, onClick, borderColor }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth tilt angles
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease-out',
        height: '100%',
        willChange: 'transform',
        transformStyle: 'preserve-3d'
      }}
    >
      <Card
        padding
        style={{
          borderTop: `4px solid ${borderColor}`,
          border: isActive ? `2px solid ${borderColor}` : `2px solid transparent`,
          boxShadow: isActive ? `0 0 20px ${borderColor}40` : undefined,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: 'translateZ(30px)', // Inner 3d pop effect
          transition: 'all 0.3s ease'
        }}
      >
        {children}
      </Card>
    </div>
  );
};

// 2. Mock Components
const MockTeamBuilder = () => {
  const [team, setTeam] = useState(['You']);
  const [available, setAvailable] = useState(['Alex (Frontend)', 'Sam (Backend)', 'Jordan (Design)']);

  const addMember = (index) => {
    if (team.length >= 4) return;
    const member = available[index];
    setTeam([...team, member]);
    setAvailable(available.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: '1.5rem', background: 'var(--hz-bg)', borderRadius: 'var(--hz-radius-lg)', color: 'var(--hz-text)' }}>
      <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Team Builder (Max 4)</h4>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '0.75rem', fontWeight: 'bold' }}>Available Developers</div>
          {available.length === 0 && <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--hz-text-muted)' }}>No more developers available</div>}
          {available.map((m, i) => (
            <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'var(--hz-surface)', border: '1px solid var(--hz-border)', marginBottom: '0.5rem', borderRadius: 'var(--hz-radius-md)', fontSize: '0.9rem', transition: 'transform 0.2s' }}>
              <span>{m}</span>
              <button
                onClick={(e) => { e.stopPropagation(); addMember(i); }}
                style={{ background: 'var(--hz-info)', color: 'white', border: 'none', borderRadius: '4px', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
              >
                +
              </button>
            </div>
          ))}
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginBottom: '0.75rem', fontWeight: 'bold' }}>Your Team ({team.length}/4)</div>
          {team.map((m, i) => (
            <div key={i} style={{ padding: '0.75rem', background: 'var(--hz-info)', color: 'white', marginBottom: '0.5rem', borderRadius: 'var(--hz-radius-md)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'fadeInUp 0.3s ease-out' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
              {m}
            </div>
          ))}
          {Array.from({ length: 4 - team.length }).map((_, i) => (
            <div key={`empty-${i}`} style={{ padding: '0.75rem', border: '1px dashed var(--hz-border)', color: 'var(--hz-text-muted)', marginBottom: '0.5rem', borderRadius: 'var(--hz-radius-md)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Empty Slot
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MockMetricsChart = () => {
  const [bars, setBars] = useState([20, 50, 30, 80, 60]);

  useEffect(() => {
    const timer = setInterval(() => {
      setBars(bars.map(() => Math.floor(Math.random() * 70) + 30));
    }, 2500);
    return () => clearInterval(timer);
  }, [bars]);

  return (
    <div style={{ padding: '1.5rem', background: 'var(--hz-bg)', borderRadius: 'var(--hz-radius-lg)', color: 'var(--hz-text)' }}>
      <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Live Hackathon Registrations</h4>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: '180px', gap: '1.5rem', borderBottom: '2px solid var(--hz-border)', paddingBottom: '0.5rem' }}>
        {bars.map((height, i) => (
          <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--hz-success), #4ade80)', height: `${height}%`, transition: 'height 0.8s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: '6px 6px 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-25px', width: '100%', textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--hz-text-secondary)' }}>{height}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--hz-text-muted)', fontWeight: '500' }}>
        <span style={{ flex: 1, textAlign: 'center' }}>Mon</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Tue</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Wed</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Thu</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Fri</span>
      </div>
    </div>
  );
};

const MockJudgingSlider = () => {
  const [scores, setScores] = useState({ innovation: 7, technical: 8, design: 6 });

  const total = scores.innovation + scores.technical + scores.design;

  return (
    <div style={{ padding: '1.5rem', background: 'var(--hz-bg)', borderRadius: 'var(--hz-radius-lg)', color: 'var(--hz-text)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Score Project: "AI Health Monitor"</h4>
        <Badge 
          variant={total >= 25 ? "success" : total >= 15 ? "neutral" : "danger"} 
          style={{ 
            fontSize: '1rem', 
            padding: '0.5rem 1rem',
            ...(total >= 15 && total < 25 ? { backgroundColor: '#fb923c', color: 'white' } : {})
          }}
        >
          Total Score: {total}/30
        </Badge>
      </div>

      {['innovation', 'technical', 'design'].map(criteria => (
        <div key={criteria} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.5rem', textTransform: 'capitalize', fontWeight: '500' }}>
            <span>{criteria} Complexity</span>
            <span style={{ color: '#fb923c', fontWeight: 'bold' }}>{scores[criteria]} / 10</span>
          </div>
          <input
            type="range"
            min="0" max="10"
            value={scores[criteria]}
            onChange={(e) => setScores({ ...scores, [criteria]: parseInt(e.target.value) })}
            style={{
              width: '100%',
              cursor: 'pointer',
              height: '8px',
              borderRadius: '4px',
              background: 'var(--hz-border)',
              accentColor: '#fb923c'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
        <Button 
          variant="outline" 
          style={{ backgroundColor: '#fb923c', color: 'white', borderColor: '#fb923c' }} 
          onClick={(e) => { e.stopPropagation(); alert('Mock score submitted!'); }}
        >
          Submit Evaluation
        </Button>
      </div>
    </div>
  );
};

// 3. Main Feature Section
export default function FeatureSection() {
  const [activeTab, setActiveTab] = useState('participant');

  const features = [
    {
      id: 'participant',
      role: 'Participants',
      badgeVariant: 'info',
      color: 'var(--hz-info)',
      title: 'Join & Build',
      desc: 'Discover exciting hackathons, form dynamic teams with other developers, and seamlessly submit your projects to win prizes.',
      link: '/register?role=participant',
      btnText: 'Join Now'
    },
    {
      id: 'organizer',
      role: 'Organizers',
      badgeVariant: 'success',
      color: 'var(--hz-success)',
      title: 'Host & Manage',
      desc: 'Create hackathons, track registrations, manage teams, and assign judges with a powerful, zero-friction dashboard.',
      link: '/register?role=organizer',
      btnText: 'Host Event'
    },
    {
      id: 'judge',
      role: 'Judges',
      badgeVariant: 'neutral',
      badgeStyle: { backgroundColor: '#fb923c', color: 'white' },
      color: '#fb923c',
      title: 'Evaluate & Score',
      desc: 'Review assigned submissions efficiently with our integrated grading portal and provide detailed feedback to participants.',
      link: '/register?role=judge',
      btnText: 'Start Judging'
    }
  ];

  return (
    <section className="hz-container" style={{ padding: '5rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 className="hz-heading-2 hz-mb-2">Everything You Need</h2>
        <p className="hz-text-muted" style={{ fontSize: '1.1rem' }}>Click a card below to explore interactive previews of the platform.</p>
      </div>

      <div className="row g-4 justify-content-center">
        {features.map((feature) => (
          <div className="col-12 col-md-6 col-lg-4" key={feature.id}>
            <TiltCard
              isActive={activeTab === feature.id}
              onClick={() => setActiveTab(feature.id)}
              borderColor={feature.color}
            >
              <div style={{ transform: 'translateZ(20px)', pointerEvents: 'none' }}>
                <Badge variant={feature.badgeVariant} style={feature.badgeStyle} className="hz-mb-4">{feature.role}</Badge>
                <h3 className="hz-heading-3 hz-mb-2">{feature.title}</h3>
                <p className="hz-text-muted hz-mb-6" style={{ fontSize: 'var(--hz-font-size-sm)', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
              <div style={{ transform: 'translateZ(30px)' }}>
                <Link to={feature.link} style={{ textDecoration: 'none', pointerEvents: 'auto' }} onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
                    {feature.btnText}
                  </Button>
                </Link>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>

      {/* Interactive Preview Box */}
      <div style={{ marginTop: '4rem', animation: 'fadeInUp 0.5s ease-out' }}>
        <Card style={{ border: `1px solid var(--hz-border)`, background: 'var(--hz-surface)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          {/* Mac-like Window Header */}
          <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--hz-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--hz-text-muted)', marginLeft: '1rem', fontWeight: '500', letterSpacing: '0.5px' }}>
              Interactive Preview / {features.find(f => f.id === activeTab)?.role}
            </span>
          </div>

          {/* Window Content */}
          <div style={{ padding: '2.5rem' }}>
            {activeTab === 'participant' && <MockTeamBuilder />}
            {activeTab === 'organizer' && <MockMetricsChart />}
            {activeTab === 'judge' && <MockJudgingSlider />}
          </div>
        </Card>
      </div>
    </section>
  );
}
