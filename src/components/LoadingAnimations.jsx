import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Advanced loading skeletons with shimmer effect
 */
export function ShimmerSkeleton({
  lines = 3,
  height = '1rem',
  className = '',
  width = '100%',
  rounded = true,
}) {
  return (
    <div className={`shimmer-skeleton ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`shimmer-line ${rounded ? 'rounded' : ''}`}
          style={{
            height,
            width: i === lines - 1 && lines > 1 ? '75%' : width,
            marginBottom: i === lines - 1 ? 0 : '0.5rem',
          }}
        />
      ))}

      <style jsx>{`
        .shimmer-skeleton {
          animation: shimmer-pulse 1.5s ease-in-out infinite;
        }

        .shimmer-line {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          background-color: var(--bs-secondary-bg);
          background-size: 200px 100%;
          background-repeat: no-repeat;
          animation: shimmer 2s infinite linear;
        }

        .shimmer-line.rounded {
          border-radius: 0.25rem;
        }

        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }

        @keyframes shimmer-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Card skeleton with shimmer effect
 */
export function CardShimmer({ showImage = true, showButton = true, className = '' }) {
  return (
    <div className={`card ${className}`}>
      {showImage && <div className="card-img-top shimmer-line" style={{ height: '200px' }} />}
      <div className="card-body">
        <ShimmerSkeleton lines={1} height="1.5rem" className="mb-3" />
        <ShimmerSkeleton lines={3} height="1rem" className="mb-3" />
        {showButton && <ShimmerSkeleton lines={1} height="2.5rem" width="40%" />}
      </div>
    </div>
  );
}

/**
 * Advanced loading spinner with multiple variants
 */
export function LoadingSpinner({
  variant = 'dots',
  size = 'medium',
  color = 'primary',
  text = '',
  className = '',
}) {
  const sizeClasses = {
    small: 'spinner-sm',
    medium: 'spinner-md',
    large: 'spinner-lg',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`loading-dots ${sizeClasses[size]} ${colorClasses[color]}`}>
            <div className="dot1"></div>
            <div className="dot2"></div>
            <div className="dot3"></div>
          </div>
        );

      case 'pulse':
        return (
          <div className={`loading-pulse ${sizeClasses[size]} ${colorClasses[color]}`}>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
          </div>
        );

      case 'wave':
        return (
          <div className={`loading-wave ${sizeClasses[size]} ${colorClasses[color]}`}>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        );

      default:
        return (
          <div
            className={`spinner-border ${sizeClasses[size]} ${colorClasses[color]}`}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        );
    }
  };

  return (
    <div className={`loading-spinner text-center ${className}`}>
      {renderSpinner()}
      {text && <div className="mt-2 text-muted small">{text}</div>}

      <style jsx>{`
        .spinner-sm {
          --size: 1rem;
        }
        .spinner-md {
          --size: 2rem;
        }
        .spinner-lg {
          --size: 3rem;
        }

        .loading-dots {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .loading-dots div {
          width: calc(var(--size) * 0.25);
          height: calc(var(--size) * 0.25);
          background-color: currentColor;
          border-radius: 50%;
          animation: dots-bounce 1.4s ease-in-out infinite both;
        }

        .loading-dots .dot1 {
          animation-delay: -0.32s;
        }
        .loading-dots .dot2 {
          animation-delay: -0.16s;
        }

        @keyframes dots-bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .loading-pulse {
          position: relative;
          width: var(--size);
          height: var(--size);
          display: inline-block;
        }

        .pulse-ring {
          border: 2px solid currentColor;
          border-radius: 50%;
          height: 100%;
          width: 100%;
          position: absolute;
          left: 0;
          top: 0;
          animation: pulse-scale 2s infinite ease-in-out;
        }

        .pulse-ring:nth-child(2) {
          animation-delay: 0.5s;
        }
        .pulse-ring:nth-child(3) {
          animation-delay: 1s;
        }

        @keyframes pulse-scale {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        .loading-wave {
          display: inline-flex;
          align-items: center;
          gap: 0.125rem;
        }

        .wave-bar {
          width: calc(var(--size) * 0.1);
          height: var(--size);
          background-color: currentColor;
          animation: wave-stretch 1.2s infinite ease-in-out;
        }

        .wave-bar:nth-child(1) {
          animation-delay: -1.2s;
        }
        .wave-bar:nth-child(2) {
          animation-delay: -1.1s;
        }
        .wave-bar:nth-child(3) {
          animation-delay: -1s;
        }
        .wave-bar:nth-child(4) {
          animation-delay: -0.9s;
        }
        .wave-bar:nth-child(5) {
          animation-delay: -0.8s;
        }

        @keyframes wave-stretch {
          0%,
          40%,
          100% {
            transform: scaleY(0.4);
          }
          20% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Progress circle with percentage
 */
export function ProgressCircle({
  percentage = 0,
  size = 100,
  strokeWidth = 8,
  color = '#007bff',
  backgroundColor = '#e9ecef',
  showPercentage = true,
  animated = true,
  className = '',
}) {
  const [displayPercentage, setDisplayPercentage] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayPercentage / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setInterval(() => {
        setDisplayPercentage((prev) => {
          if (prev < percentage) {
            return Math.min(prev + 1, percentage);
          }
          return prev;
        });
      }, 20);

      return () => clearInterval(timer);
    } else {
      setDisplayPercentage(percentage);
    }
  }, [percentage, animated]);

  return (
    <div className={`progress-circle ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="progress-circle-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: animated ? 'stroke-dashoffset 0.5s ease' : 'none',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
        />
      </svg>
      {showPercentage && (
        <div
          className="progress-circle-text position-absolute top-50 start-50 translate-middle fw-bold"
          style={{ fontSize: `${size * 0.15}px` }}
        >
          {Math.round(displayPercentage)}%
        </div>
      )}
    </div>
  );
}

/**
 * Typewriter effect with customizable speed
 */
export function TypewriterEffect({
  text = '',
  speed = 50,
  delay = 0,
  cursor = true,
  onComplete,
  className = '',
}) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText('');
    setIsComplete(false);

    const timer = setTimeout(() => {
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsComplete(true);
          onComplete?.();
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete]);

  return (
    <span className={`typewriter-text ${className}`}>
      {displayText}
      {cursor && (
        <span
          className="typewriter-cursor"
          style={{
            animation: isComplete ? 'none' : 'blink 1s infinite',
            opacity: isComplete ? 0 : 1,
          }}
        >
          |
        </span>
      )}

      <style jsx>{`
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}

/**
 * Page transition loader
 */
export function PageLoader({ isLoading, progress = 0 }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <>
          {/* Overlay */}
          <motion.div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: 'rgba(var(--bs-body-bg-rgb), 0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center">
              <LoadingSpinner variant="pulse" size="large" />
              <div className="mt-3">
                <ProgressCircle
                  percentage={progress}
                  size={60}
                  strokeWidth={4}
                  showPercentage={false}
                />
              </div>
              <p className="mt-3 text-muted">Loading...</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
