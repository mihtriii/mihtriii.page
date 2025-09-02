import { useEffect, useState } from 'react';

export function useScrollSpy(ids = [], options = { rootMargin: '0px 0px -50% 0px', threshold: 0.2 }) {
  const [activeId, setActiveId] = useState(ids[0] || null);
  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (elements.length === 0 || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, options);
    elements.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return activeId;
}

