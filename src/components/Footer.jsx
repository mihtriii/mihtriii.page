import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer py-4 border-top mt-5">
      <div className="container">
        <p className="text-secondary small mb-0">© {year} Nguyễn Minh Trí. All rights reserved.</p>
      </div>
    </footer>
  );
}

