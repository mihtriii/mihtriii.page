import React, { useEffect, useRef, useState } from 'react';

// Lightweight animated particle background with theme-aware color
export default function Particles({ density = 40, speed = 0.25, disableOnMobile = true }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const particlesRef = useRef([]);
  const activeRef = useRef(true);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 767.98px)');
    const compute = () => {
      const shouldDisable = (mqReduce.matches) || (disableOnMobile && mqMobile.matches);
      setEnabled(!shouldDisable);
    };
    compute();
    const onChange = () => compute();
    mqReduce.addEventListener?.('change', onChange);
    mqMobile.addEventListener?.('change', onChange);
    window.addEventListener('orientationchange', compute);
    return () => {
      mqReduce.removeEventListener?.('change', onChange);
      mqMobile.removeEventListener?.('change', onChange);
      window.removeEventListener('orientationchange', compute);
    };
  }, [disableOnMobile]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = (canvas.width = Math.max(1, canvas.offsetWidth) * dpr);
    let h = (canvas.height = Math.max(1, canvas.offsetHeight) * dpr);

    const computeColor = () => {
      const cs = getComputedStyle(document.documentElement);
      const c = cs.getPropertyValue('--particles-color')?.trim();
      return c && c.length > 0 ? c : 'rgba(201, 122, 64, 0.55)';
    };
    let color = computeColor();

    const handleTheme = () => { color = computeColor(); };
    const mo = new MutationObserver(handleTheme);
    mo.observe(document.documentElement, { attributes: true });

    // Respect reduced motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const count = reduceMotion ? Math.max(10, Math.floor(density / 2)) : density;
    const spd = reduceMotion ? speed * 0.6 : speed;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * spd,
      vy: (Math.random() - 0.5) * spd,
      r: Math.random() * 1.5 + 0.5,
    }));
    particlesRef.current = particles;

    const resize = () => {
      w = canvas.width = Math.max(1, canvas.offsetWidth) * dpr;
      h = canvas.height = Math.max(1, canvas.offsetHeight) * dpr;
    };
    const onResize = () => {
      resize();
    };
    window.addEventListener('resize', onResize);

    // Pause when not visible
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        activeRef.current = e.isIntersecting;
      });
    });
    io.observe(canvas);

    const onVisibility = () => {
      activeRef.current = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const step = () => {
      if (activeRef.current) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = color;
        for (const p of particlesRef.current) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    step();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      io.disconnect();
      mo.disconnect();
    };
  }, [density, speed, enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />;
}
