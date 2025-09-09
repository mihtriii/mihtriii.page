import React, { useEffect, useRef, useState } from 'react';
import { useAnimation } from './ThemeToggle.jsx';

// Fire-and-forget toast with dedupe to avoid spam (same message within 1.2s)
export function toast(message, timeout = 2000) {
  try {
    const now = Date.now();
    const last = window.__toast_last || { t: 0, m: '' };
    if (message === last.m && now - last.t < 1200) return; // dedupe burst
    window.__toast_last = { t: now, m: message };
  } catch {}
  const ev = new CustomEvent('app:toast', { detail: { message, timeout } });
  window.dispatchEvent(ev);
}

export default function ToastContainer() {
  const [queue, setQueue] = useState([]);
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const hideTimer = useRef(0);
  const { enabled: animationEnabled } = useAnimation ? useAnimation() : { enabled: true };

  useEffect(() => {
    const onToast = (e) => {
      setQueue((q) => [...q, e.detail]);
    };
    window.addEventListener('app:toast', onToast);
    return () => window.removeEventListener('app:toast', onToast);
  }, []);

  useEffect(() => {
    if (visible || queue.length === 0) return;
    const { message, timeout } = queue[0];
    setMsg(message);
    setVisible(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setQueue((q) => q.slice(1));
    }, Math.max(1200, timeout || 2000));
    // absolute safety auto-hide after 5s
    const safety = setTimeout(() => {
      setVisible(false);
      setQueue((q) => q.slice(1));
    }, 5000);
    return () => {
      clearTimeout(hideTimer.current);
      clearTimeout(safety);
    };
  }, [queue, visible]);

  // If animation is off, show instantly and hide instantly
  if (!animationEnabled && queue.length > 0 && !visible) {
    setMsg(queue[0].message);
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
      setQueue((q) => q.slice(1));
    }, 1200);
  }

  return (
    <div
      className={`toast-container${visible ? ' show' : ''}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="toast-item">{msg}</div>
    </div>
  );
}
