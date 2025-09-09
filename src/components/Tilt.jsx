import React, { useRef } from 'react';
import { useAnimation } from './ThemeToggle.jsx';

export default function Tilt({ children, max = 8, glare = false, className = '' }) {
  const ref = useRef(null);
  const { enabled: animationEnabled } = useAnimation ? useAnimation() : { enabled: true };

  let ticking = false;

  const onMove = (e) => {
    if (!animationEnabled) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rx = (-dy * max).toFixed(2);
      const ry = (dx * max).toFixed(2);
      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      if (glare) {
        const gradX = (dx + 1) * 50;
        const gradY = (dy + 1) * 50;
        el.style.setProperty('--tilt-glare-x', `${gradX}%`);
        el.style.setProperty('--tilt-glare-y', `${gradY}%`);
      }
      ticking = false;
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = '';
  };

  return (
    <div
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      role="presentation"
    >
      {children}
    </div>
  );
}
