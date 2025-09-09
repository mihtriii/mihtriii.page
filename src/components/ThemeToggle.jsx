import React, { useContext } from 'react';

// Animation context for global animation toggle
const AnimationContext = React.createContext({ enabled: true, toggle: () => {} });
export function useAnimation() {
  return useContext(AnimationContext);
}

export function AnimationProvider({ children }) {
  const [enabled, setEnabled] = React.useState(() => {
    const v = localStorage.getItem('animation');
    return v === null ? true : v === 'true';
  });
  const toggle = () => {
    setEnabled((prev) => {
      localStorage.setItem('animation', String(!prev));
      return !prev;
    });
  };
  return (
    <AnimationContext.Provider value={{ enabled, toggle }}>{children}</AnimationContext.Provider>
  );
}

export default function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
  const icon = theme === 'light' ? 'bi-sun' : theme === 'dark' ? 'bi-moon-stars' : 'bi-circle-half';
  const label = theme.charAt(0).toUpperCase() + theme.slice(1);
  const { enabled, toggle } = useAnimation();
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
      <button
        onClick={toggle}
        className={`btn btn-outline-secondary btn-sm`}
        type="button"
        aria-label={enabled ? 'Tắt hiệu ứng động' : 'Bật hiệu ứng động'}
        title={enabled ? 'Tắt hiệu ứng động' : 'Bật hiệu ứng động'}
        style={{ transition: 'background 0.2s, color 0.2s' }}
      >
        <i
          className={`bi ${enabled ? 'bi-lightning-charge' : 'bi-lightning-charge-fill'}`}
          style={{ fontSize: '1.2em', transition: 'color 0.2s' }}
        ></i>
        <span className="visually-hidden">
          {enabled ? 'Tắt hiệu ứng động' : 'Bật hiệu ứng động'}
        </span>
      </button>
    </div>
  );
}
