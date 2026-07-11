import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function GlobalBackground() {
  const { isDark } = useContext(ThemeContext);

  if (!isDark) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: -1,
      background: '#030513', // Ultra-dark sleek background
    }}>
      {/* Animated Glowing Orb 1: Purple */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        left: '-10%',
        width: '55vw',
        height: '55vw',
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 22s infinite ease-in-out alternate',
      }} />

      {/* Animated Glowing Orb 2: Bright Blue */}
      <div style={{
        position: 'absolute',
        bottom: '-25%',
        right: '-15%',
        width: '65vw',
        height: '65vw',
        background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(100px)',
        animation: 'float 28s infinite ease-in-out alternate-reverse',
      }} />

      {/* Animated Glowing Orb 3: Pink Accent */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        width: '45vw',
        height: '45vw',
        background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(90px)',
        animation: 'float 20s infinite ease-in-out alternate',
        transform: 'translate(-50%, -50%)'
      }} />

      {/* Subtle Cyber Grid Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)',
      }} />

      {/* Embedded Animation Styles */}
      <style>
        {`
          @keyframes float {
            0% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.05); }
            66% { transform: translate(-30px, 30px) scale(0.95); }
            100% { transform: translate(0, 0) scale(1); }
          }
        `}
      </style>
    </div>
  );
}
