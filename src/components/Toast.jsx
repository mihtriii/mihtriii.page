import React, { useEffect, useState } from 'react';

export function toast(message, timeout = 2000) {
  const ev = new CustomEvent('app:toast', { detail: { message, timeout } });
  window.dispatchEvent(ev);
}

export default function ToastContainer() {
  const [queue, setQueue] = useState([]);
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState('');

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
    const id = setTimeout(() => {
      setVisible(false);
      setQueue((q) => q.slice(1));
    }, timeout || 2000);
    return () => clearTimeout(id);
  }, [queue, visible]);

  return (
    <div className={`toast-container${visible ? ' show' : ''}`} aria-live="polite" aria-atomic="true">
      <div className="toast-item">{msg}</div>
    </div>
  );
}

