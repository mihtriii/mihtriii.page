import React from 'react';

export default function Fab() {
  // Example: quick scroll to top and contact
  return (
    <div className="fab d-md-none" title="Quick actions">
      <button
        className="fab"
        onClick={() => {
          if (window.scrollY > 200) window.scrollTo({ top: 0, behavior: 'smooth' });
          else window.location.hash = '#contact';
        }}
        aria-label="Quick action"
      >
        <i className="bi bi-lightning-charge"></i>
      </button>
    </div>
  );
}
