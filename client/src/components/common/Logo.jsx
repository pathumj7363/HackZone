import React from 'react';

export default function Logo({ width = 160 }) {
  // Height is scaled based on standard aspect ratio (e.g., 3:1 for wide logos)
  // But we will use a flex container to align the beast icon and the text.
  const iconSize = Math.floor(width * 0.25);
  const fontSize = Math.floor(width * 0.16);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', userSelect: 'none' }}>
      
      {/* Modern Beast (Cybernetic Wolf) SVG */}
      <svg 
        width={iconSize} 
        height={iconSize} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' }}
      >
        <defs>
          <linearGradient id="beastGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <g stroke="url(#beastGradient)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          {/* Left Ear */}
          <polygon points="20,40 30,15 45,35" fill="rgba(6,182,212,0.1)" />
          {/* Right Ear */}
          <polygon points="80,40 70,15 55,35" fill="rgba(34,197,94,0.1)" />
          {/* Forehead */}
          <polygon points="45,35 55,35 50,60" fill="rgba(6,182,212,0.15)" />
          {/* Left Cheek */}
          <polygon points="20,40 45,35 30,65" fill="transparent" />
          {/* Right Cheek */}
          <polygon points="80,40 55,35 70,65" fill="transparent" />
          {/* Left Jaw */}
          <polygon points="30,65 50,60 50,85 35,75" fill="rgba(6,182,212,0.05)" />
          {/* Right Jaw */}
          <polygon points="70,65 50,60 50,85 65,75" fill="rgba(34,197,94,0.05)" />
          {/* Snout Details */}
          <line x1="50" y1="60" x2="50" y2="85" />
          {/* Glowing Eyes */}
          <polygon points="38,45 43,48 35,52" fill="#06b6d4" stroke="none" />
          <polygon points="62,45 57,48 65,52" fill="#22c55e" stroke="none" />
        </g>
      </svg>

      {/* Text */}
      <span style={{
        fontFamily: 'Chakra Petch, sans-serif',
        fontSize: `${fontSize}px`,
        fontWeight: 800,
        letterSpacing: '0.02em',
        background: 'linear-gradient(135deg, #06b6d4 0%, #22c55e 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textTransform: 'uppercase',
      }}>
        HackZone
      </span>
    </div>
  );
};
