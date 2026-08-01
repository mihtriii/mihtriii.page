import React, { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * DotFieldBackground - Interactive dot grid background inspired by React Bits
 * Dots react to cursor position with bulge/physics effect
 * Adapted for portfolio theme (purple/violet gradient)
 */
export default function DotFieldBackground({
  className = '',
  dotRadius = 1.5,
  dotSpacing = 18,
  cursorRadius = 400,
  cursorForce = 0.08,
  bulgeStrength = 50,
  glowRadius = 120,
  sparkle = true,
  gradientFrom = 'rgba(139, 92, 246, 0.25)', // violet-500
  gradientTo = 'rgba(168, 85, 247, 0.15)',   // purple-500
  glowColor = '#0f0a14',
  disabled = false,
  reducedMotion = false,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 767.98px)').matches,
    []
  );

  const isDisabled = disabled || prefersReducedMotion || reducedMotion || isMobile;

  // Generate initial dot grid
  const generateDots = (width, height) => {
    const cols = Math.ceil(width / dotSpacing);
    const rows = Math.ceil(height / dotSpacing);
    const dots = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * dotSpacing + dotSpacing / 2;
        const y = row * dotSpacing + dotSpacing / 2;
        const baseRadius = dotRadius;
        const isSparkle = sparkle && Math.random() < 0.03;

        dots.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: isSparkle ? baseRadius * 1.8 : baseRadius,
          baseRadius,
          isSparkle,
          vx: 0,
          vy: 0,
          hue: 270 + Math.random() * 30, // violet to purple range
        });
      }
    }
    return dots;
  };

  const resize = () => {
    const container = containerRef.current;
    if (!container || !canvasRef.current) return;

    const { width, height } = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvasRef.current.width = width * dpr;
    canvasRef.current.height = height * dpr;
    canvasRef.current.style.width = `${width}px`;
    canvasRef.current.style.height = `${height}px`;

    const ctx = canvasRef.current.getContext('2d');
    ctx.scale(dpr, dpr);

    dotsRef.current = generateDots(width, height);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    // Draw gradient background overlay
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, gradientFrom);
    gradient.addColorStop(1, gradientTo);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw dots
    dotsRef.current.forEach((dot) => {
      // Physics-based movement toward mouse
      const dx = mouseRef.current.x - dot.x;
      const dy = mouseRef.current.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < cursorRadius && dist > 0) {
        const force = (cursorRadius - dist) / cursorRadius * cursorForce;
        const angle = Math.atan2(dy, dx);
        
        if (!isDisabled) {
          dot.vx += Math.cos(angle) * force * (dot.isSparkle ? 0.5 : 1);
          dot.vy += Math.sin(angle) * force * (dot.isSparkle ? 0.5 : 1);
        }
      }

      // Spring back to base position
      const springForce = 0.03;
      dot.vx += (dot.baseX - dot.x) * springForce;
      dot.vy += (dot.baseY - dot.y) * springForce;

      // Damping
      dot.vx *= 0.85;
      dot.vy *= 0.85;

      dot.x += dot.vx;
      dot.y += dot.vy;

      // Draw dot
      ctx.beginPath();
      const alpha = dot.isSparkle ? 0.9 : 0.45;
      const hue = dot.isSparkle ? 280 : dot.hue;
      ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${alpha})`;
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw glow at cursor position
    if (mouseRef.current.x > 0 && mouseRef.current.x < width) {
      const glow = ctx.createRadialGradient(
        mouseRef.current.x, mouseRef.current.y, 0,
        mouseRef.current.x, mouseRef.current.y, glowRadius
      );
      glow.addColorStop(0, glowColor);
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(
        mouseRef.current.x - glowRadius,
        mouseRef.current.y - glowRadius,
        glowRadius * 2,
        glowRadius * 2
      );
    }

    rafRef.current = requestAnimationFrame(draw);
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handleMouseLeave = () => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  };

  useEffect(() => {
    if (isDisabled) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    resize();
    draw();

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDisabled, dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeStrength, glowRadius, sparkle, gradientFrom, gradientTo, glowColor]);

  if (isDisabled) {
    return (
      <div
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        style={{ background: 'linear-gradient(135deg, #0f0a14 0%, #1a0f2e 100%)' }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ background: '#0f0a14' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.8 }}
      />
      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #0f0a14 100%)',
        }}
      />
    </div>
  );
}