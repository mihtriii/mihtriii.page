import React from 'react';
import { social, hasRealScholar } from '../config/site.js';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer mt-5 pt-4 pb-4 border-top border-zinc">
      <div className="container">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
          <div>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
              <span className="roman-eyebrow">© {year}</span>
              <span className="font-display fw-semibold text-primary">Nguyễn Minh Trí</span>
            </div>
            <p className="text-secondary small mb-0 font-mono" style={{ fontSize: '0.78rem' }}>
              Built for research clarity & reproducible AI · FPT University HCMC
            </p>
          </div>

          {/* Social icons + Back to Top */}
          <div className="d-flex align-items-center gap-3">
            <div className="icon-row d-flex align-items-center gap-2">
              <a className="icon-btn" href={social.kaggle} target="_blank" rel="noopener" aria-label="Kaggle" title="Kaggle">
                <img src={`${import.meta.env.BASE_URL}assets/kaggle.svg`} alt="Kaggle" width="16" height="16" loading="lazy" decoding="async" />
              </a>
              <a className="icon-btn" data-brand="linkedin" href={social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a className="icon-btn" data-brand="github" href={social.github} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a className="icon-btn" data-brand="email" href={social.email} aria-label="Email" title="Email">
                <i className="bi bi-envelope"></i>
              </a>
              {hasRealScholar && (
                <a className="icon-btn" data-brand="scholar" href={social.scholar} target="_blank" rel="noopener" aria-label="Google Scholar" title="Google Scholar">
                  <i className="bi bi-mortarboard"></i>
                </a>
              )}
              <a className="icon-btn" data-brand="orcid" href={social.orcid} target="_blank" rel="noopener" aria-label="ORCID" title="ORCID">
                <i className="bi bi-person-badge"></i>
              </a>
            </div>

            <button
              onClick={scrollToTop}
              className="btn-roman btn-roman-ghost btn-sm btn-icon"
              aria-label="Back to top"
              title="Back to top"
              style={{ width: 34, height: 34, padding: 0 }}
            >
              <i className="bi bi-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}