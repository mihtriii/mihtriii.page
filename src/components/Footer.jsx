import React from 'react';
import { social } from '../config/site.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer py-4 border-top mt-5">
      <div className="container d-flex flex-wrap align-items-center gap-2 justify-content-between">
        <p className="text-secondary small mb-0">© {year} Nguyễn Minh Trí. All rights reserved.</p>
        <div className="icon-row">
          <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle">
            <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="18" height="18" loading="lazy" decoding="async" />
          </a>
          <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
            <i className="bi bi-linkedin"></i>
          </a>
          <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.github} target="_blank" rel="noopener" aria-label="GitHub">
            <i className="bi bi-github"></i>
          </a>
          <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.email} aria-label="Email">
            <i className="bi bi-envelope"></i>
          </a>
          <a className="btn btn-outline-secondary btn-sm icon-btn" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar">
            <i className="bi bi-mortarboard"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
