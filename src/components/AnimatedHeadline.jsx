import { useRef, useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

/**
 * AnimatedHeadline - Character-by-character reveal animation
 * Inspired by React Bits SplitText component
 * Supports stagger, scroll-trigger, and various animation types
 */
export default function AnimatedHeadline({
  text = '',
  tag = 'h1',
  className = '',
  splitType = 'chars',
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  scrollTrigger = true,
  onComplete,
  gradient = false,
  gradientColors = ['#a855f7', '#d946ef', '#ec4899'],
  gradientAngle = 135,
  staggerFrom = 0,
}) {
  const elementRef = useRef(null);
  const splitRef = useRef(null);
  const animationRef = useRef(null);
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  // Disable animation on mobile/touch — render static text for perf
  const isMobile = useMemo(
    () => window.matchMedia('(max-width: 767.98px)').matches,
    []
  );

  // Initialize SplitText (skip on mobile)
  useEffect(() => {
    if (isMobile) return;
    if (elementRef.current && !splitRef.current) {
      splitRef.current = new SplitText(elementRef.current, {
        type: splitType,
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
      });
    }
    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
        splitRef.current = null;
      }
    };
  }, [splitType, text, isMobile]);

  // Run animation (skip on mobile)
  useEffect(() => {
    if (isMobile) {
      onComplete?.();
      return;
    }
    const chars = splitRef.current?.chars;
    if (!chars || !chars.length) return;

    gsap.set(chars, from);

    if (prefersReducedMotion) {
      gsap.set(chars, to);
      onComplete?.();
      return;
    }

    const targets = splitType.includes('lines') ? splitRef.current.lines :
                    splitType.includes('words') ? splitRef.current.words :
                    chars;

    const animConfig = {
      ...to,
      stagger: {
        each: delay / 1000,
        from: staggerFrom,
        ease: 'none',
      },
      duration,
      ease,
      onComplete: () => { onComplete?.(); },
    };

    if (scrollTrigger) {
      animConfig.scrollTrigger = {
        trigger: elementRef.current,
        start: 'top 85%',
        end: 'bottom 15%',
        toggleActions: 'play none none reverse',
        once: true,
        markers: false,
      };
    }

    animationRef.current = gsap.to(targets, animConfig);

    return () => {
      animationRef.current?.kill();
    };
  }, [splitType, delay, duration, ease, from, to, threshold, rootMargin, scrollTrigger, staggerFrom, onComplete, prefersReducedMotion]);

  const gradientStyle = gradient && {
    background: `linear-gradient(${gradientAngle}deg, ${gradientColors.join(', ')})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
  };

  return (
    <div
      ref={elementRef}
      className={`inline-block ${className}`}
      style={{
        textAlign,
        ...gradientStyle,
        overflow: splitType.includes('lines') ? 'hidden' : 'visible',
      }}
      aria-label={text}
    >
      {text}
    </div>
  );
}

// Helper: SplitText for words + chars combined
export function SplitWordsChars({ children, ...props }) {
  const text = typeof children === 'string' ? children : String(children);
  return <AnimatedHeadline text={text} splitType="words, chars" {...props} />;
}

// Helper: Typewriter-style reveal
export function TypewriterText({
  text = '',
  speed = 50,
  className = '',
  onComplete,
}) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, index + 1));
        setIndex(index + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [index, text, speed, onComplete]);

  return <span className={className}>{displayText}</span>;
}
