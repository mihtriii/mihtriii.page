import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Advanced Particle System with optimized performance
 */
export default function AdvancedParticles({
  count = 50,
  color = '#007bff',
  size = { min: 1, max: 3 },
  speed = { min: 0.1, max: 0.5 },
  opacity = { min: 0.3, max: 0.8 },
  connections = true,
  interactive = true,
  reducedMotion = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Particle class for better performance
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * (speed.max - speed.min) + speed.min;
      this.vy = (Math.random() - 0.5) * (speed.max - speed.min) + speed.min;
      this.size = Math.random() * (size.max - size.min) + size.min;
      this.opacity = Math.random() * (opacity.max - opacity.min) + opacity.min;
      this.life = 1;
    }

    update(deltaTime) {
      if (reducedMotion) return;

      this.x += this.vx * deltaTime;
      this.y += this.vy * deltaTime;

      // Bounce off edges
      if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

      // Keep particles in bounds
      this.x = Math.max(0, Math.min(this.canvas.width, this.x));
      this.y = Math.max(0, Math.min(this.canvas.height, this.y));

      // Interactive mouse effect
      if (interactive) {
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.vx += (dx / distance) * force * 0.01;
          this.vy += (dy / distance) * force * 0.01;
        }
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize particles
  const initParticles = (canvas) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(canvas));
    }
    return particles;
  };

  // Animation loop with performance optimization
  const animate = (timestamp, lastTime = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');
    const deltaTime = timestamp - lastTime;

    // Limit to 60fps for performance
    if (deltaTime < 16) {
      animationRef.current = requestAnimationFrame((t) => animate(t, lastTime));
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current.forEach((particle) => {
      particle.update(deltaTime);
      particle.draw(ctx);
    });

    // Draw connections
    if (connections && !reducedMotion) {
      drawConnections(ctx);
    }

    animationRef.current = requestAnimationFrame((t) => animate(t, timestamp));
  };

  // Draw connections between nearby particles
  const drawConnections = (ctx) => {
    const maxDistance = 100;

    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const p1 = particlesRef.current[i];
        const p2 = particlesRef.current[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  // Resize handler
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Reset particles for new canvas size
    particlesRef.current.forEach((particle) => particle.reset());
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    if (!interactive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Intersection Observer for performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  // Initialize canvas and particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    particlesRef.current = initParticles(canvas);

    window.addEventListener('resize', handleResize);

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [count, interactive]);

  // Start/stop animation based on visibility
  useEffect(() => {
    if (isVisible && !reducedMotion) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={`position-absolute top-0 start-0 w-100 h-100 ${className}`}
      style={{
        pointerEvents: interactive ? 'auto' : 'none',
        zIndex: -1,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Floating animation component
 */
export function FloatingElement({
  children,
  intensity = 1,
  duration = 3,
  delay = 0,
  className = '',
}) {
  const floatingStyle = useMemo(
    () => ({
      animation: `floating ${duration}s ease-in-out ${delay}s infinite`,
      '--floating-distance': `${10 * intensity}px`,
    }),
    [intensity, duration, delay]
  );

  return (
    <div className={`floating-element ${className}`} style={floatingStyle}>
      {children}
      <style jsx>{`
        @keyframes floating {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(var(--floating-distance, -10px));
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Glitch effect component
 */
export function GlitchText({ children, intensity = 0.5, trigger = 'hover', className = '' }) {
  const [isGlitching, setIsGlitching] = useState(false);

  const glitchStyle = useMemo(
    () => ({
      '--glitch-intensity': intensity,
      position: 'relative',
      display: 'inline-block',
    }),
    [intensity]
  );

  const handleTrigger = () => {
    if (trigger === 'hover') {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 600);
    }
  };

  useEffect(() => {
    if (trigger === 'auto') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trigger]);

  return (
    <span
      className={`glitch-text ${isGlitching ? 'glitching' : ''} ${className}`}
      style={glitchStyle}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
    >
      <span className="glitch-text-main">{children}</span>
      <span className="glitch-text-shadow" aria-hidden="true">
        {children}
      </span>
      <span className="glitch-text-shadow" aria-hidden="true">
        {children}
      </span>

      <style jsx>{`
        .glitch-text {
          position: relative;
          display: inline-block;
        }

        .glitch-text-main {
          position: relative;
          z-index: 2;
        }

        .glitch-text-shadow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          opacity: 0;
          z-index: 1;
        }

        .glitch-text.glitching .glitch-text-shadow:nth-child(2) {
          color: #ff0000;
          animation: glitch-1 0.3s infinite;
        }

        .glitch-text.glitching .glitch-text-shadow:nth-child(3) {
          color: #00ffff;
          animation: glitch-2 0.3s infinite;
        }

        @keyframes glitch-1 {
          0%,
          100% {
            transform: translate(0);
            opacity: 0;
          }
          20% {
            transform: translate(-2px, 2px);
            opacity: 0.8;
          }
          40% {
            transform: translate(-2px, -2px);
            opacity: 0.8;
          }
          60% {
            transform: translate(2px, 2px);
            opacity: 0.8;
          }
          80% {
            transform: translate(2px, -2px);
            opacity: 0.8;
          }
        }

        @keyframes glitch-2 {
          0%,
          100% {
            transform: translate(0);
            opacity: 0;
          }
          10% {
            transform: translate(2px, -2px);
            opacity: 0.6;
          }
          30% {
            transform: translate(-2px, 2px);
            opacity: 0.6;
          }
          50% {
            transform: translate(2px, 2px);
            opacity: 0.6;
          }
          70% {
            transform: translate(-2px, -2px);
            opacity: 0.6;
          }
          90% {
            transform: translate(2px, 2px);
            opacity: 0.6;
          }
        }
      `}</style>
    </span>
  );
}

/**
 * Magnetic hover effect
 */
export function MagneticElement({
  children,
  strength = 0.3,
  className = '',
  as: Component = 'div',
}) {
  const elementRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!elementRef.current || !isHovered) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    elementRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (elementRef.current) {
      elementRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  return (
    <Component
      ref={elementRef}
      className={`magnetic-element ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
        cursor: 'pointer',
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Parallax scroll effect
 */
export function ParallaxElement({ children, speed = 0.5, direction = 'vertical', className = '' }) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      if (direction === 'vertical') {
        element.style.transform = `translateY(${rate}px)`;
      } else {
        element.style.transform = `translateX(${rate}px)`;
      }
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [speed, direction]);

  return (
    <div ref={elementRef} className={`parallax-element ${className}`}>
      {children}
    </div>
  );
}
