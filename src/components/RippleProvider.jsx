import React, { useEffect } from 'react';

// Adds a lightweight ripple on .btn, .mobile-link, .nav-link, .icon-btn, .tab-link
export default function RippleProvider() {
  useEffect(() => {
    const selector = '.btn, .mobile-link, .nav-link, .icon-btn, .tab-link';
    const onPointerDown = (e) => {
      const target = e.target.closest(selector);
      if (!target) return;
      // avoid right-click or disabled
      if (e.button === 2 || target.hasAttribute('disabled')) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const wave = document.createElement('span');
      wave.className = 'ripple-wave';
      wave.style.width = wave.style.height = `${size}px`;
      wave.style.left = `${x}px`;
      wave.style.top = `${y}px`;
      target.appendChild(wave);
      const remove = () => wave.remove();
      wave.addEventListener('animationend', remove);
      // Fallback remove
      setTimeout(remove, 700);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);
  return null;
}
