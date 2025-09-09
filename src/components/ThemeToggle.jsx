import React from 'react';

export default function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
  const icon = theme === 'light' ? 'bi-sun' : theme === 'dark' ? 'bi-moon-stars' : 'bi-circle-half';
  const label = theme.charAt(0).toUpperCase() + theme.slice(1);
  return (
    <button
      onClick={onToggle}
      className="btn btn-outline-secondary btn-sm theme-toggle-btn"
      type="button"
      aria-label={`Theme: ${theme}`}
      title={`Theme: ${label} (Click to switch)`}
      style={{ transition: 'background 0.2s, color 0.2s' }}
    >
      <i className={`bi ${icon}`} style={{ fontSize: '1.2em', transition: 'color 0.2s' }}></i>
      <span className="visually-hidden">{label}</span>
    </button>
  );
}
