import React from 'react';
import { social, hasRealScholar } from '../config/site.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer mt-5">
      <div className="container d-flex flex-wrap align-items-center gap-2 justify-content-between">
        <p className="mb-0">
          <span className="roman-eyebrow me-2">© {year}</span>
          <span className="font-display">Nguyễn Minh Trí</span>
          <span className="text-muted ms-2">— Sic Parvis Magna</span>
        </p>
        <div className="icon-row">
          <a className="icon-btn" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle">
            <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="18" height="18" loading="lazy" decoding="async" />
          </a>
          <a className="icon-btn" data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
            <i className="bi bi-linkedin"></i>
          </a>
          <a className="icon-btn" data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub">
            <i className="bi bi-github"></i>
          </a>
          <a className="icon-btn" data-brand="email" href={social.email} aria-label="Email">
            <i className="bi bi-envelope"></i>
          </a>
          {hasRealScholar && (
            <a className="icon-btn" data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar">
              <i className="bi bi-mortarboard"></i>
            </a>
          )}
          <a className="icon-btn" data-brand="orcid" href={social.orcid} target="_blank" rel="noopener" aria-label="ORCID">
            <i className="bi bi-person-badge"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}