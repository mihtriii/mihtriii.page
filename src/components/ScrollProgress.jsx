import React, { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef(null);
  const raf = useRef(0);
  const pending = useRef(false);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      if (barRef.current) barRef.current.style.width = `${Math.min(100, Math.max(0, p))}%`;
      pending.current = false;
    };
    const onScroll = () => {
      if (pending.current) return;
      pending.current = true;
      raf.current = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={barRef} className="scroll-progress" aria-hidden="true" />
  );
}
