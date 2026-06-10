import React, { useEffect, useRef } from 'react';

const BG = '#07091a';

export default function GlobalBackground() {
  const cvs = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const raf = useRef(null);
  const pts = useRef([]);

  useEffect(() => {
    // Force body background
    document.body.style.backgroundColor = BG;
    
    const canvas = cvs.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      pts.current = Array.from({ length: 120 }, () => ({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r:  Math.random() * 1.5 + 0.5,
      }));
    };

    resize();
    init();

    const onMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const onResize    = () => { resize(); init(); };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const p = pts.current;
      const m = mouse.current;

      p.forEach(pt => {
        // repulsion
        const dx = pt.x - m.x, dy = pt.y - m.y;
        const d  = Math.hypot(dx, dy);
        if (d < 110 && d > 0) {
          const f = (110 - d) / 110;
          pt.vx += (dx / d) * f * 0.55;
          pt.vy += (dy / d) * f * 0.55;
        }
        // speed cap
        const spd = Math.hypot(pt.vx, pt.vy);
        if (spd > 2.5) { pt.vx = (pt.vx / spd) * 2.5; pt.vy = (pt.vy / spd) * 2.5; }
        // damping + move
        pt.vx *= 0.98; pt.vy *= 0.98;
        pt.x  += pt.vx; pt.y  += pt.vy;
        // bounce
        if (pt.x < 0) { pt.x = 0; pt.vx *= -1; }
        if (pt.x > canvas.width)  { pt.x = canvas.width;  pt.vx *= -1; }
        if (pt.y < 0) { pt.y = 0; pt.vy *= -1; }
        if (pt.y > canvas.height) { pt.y = canvas.height; pt.vy *= -1; }
        // dot
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(148, 130, 255, 0.45)';
        ctx.fill();
      });

      // connections
      for (let i = 0; i < p.length; i++) {
        for (let j = i + 1; j < p.length; j++) {
          const d = Math.hypot(p[i].x - p[j].x, p[i].y - p[j].y);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p[i].x, p[i].y);
            ctx.lineTo(p[j].x, p[j].y);
            ctx.strokeStyle = `rgba(108, 86, 255, ${0.14 * (1 - d / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={cvs}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: -1, // Keep it behind everything
      }}
    />
  );
}
