import { useEffect, useRef } from 'react';

/**
 * Adds subtle magnetic effect to elements on hover
 * Elements move slightly toward cursor position
 * Disabled on touch/mobile — no hover interaction
 */
export function useMagnetic(strength = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip on touch/mobile devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      element.style.setProperty('--mouse-x', `${deltaX}px`);
      element.style.setProperty('--mouse-y', `${deltaY}px`);
    };

    const handleMouseLeave = () => {
      element.style.setProperty('--mouse-x', '0px');
      element.style.setProperty('--mouse-y', '0px');
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}
