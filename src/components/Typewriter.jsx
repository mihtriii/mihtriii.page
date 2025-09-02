import React, { useEffect, useState } from 'react';

export default function Typewriter({ words = [], typingSpeed = 60, deletingSpeed = 30, pause = 1200 }) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[index % words.length];
    let timer;
    if (!deleting) {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
      } else {
        timer = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingSpeed);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(timer);
  }, [text, deleting, words, index, typingSpeed, deletingSpeed, pause]);

  return <span className="typewriter">{text}<span className="caret">|</span></span>;
}

