import React from 'react';
import { motion } from 'framer-motion';

export default function SectionDivider({ variant = 'default' }) {
  if (variant === 'dots') {
    return (
      <div className="section-divider section-divider-dots my-4">
        <motion.div
          className="divider-dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="divider-dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.div
          className="divider-dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className="section-divider section-divider-wave my-4">
        <svg
          width="100%"
          height="40"
          viewBox="0 0 1200 40"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M0,20 Q300,5 600,20 T1200,20"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="var(--brand-secondary)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Default gradient line
  return (
    <motion.div
      className="section-divider my-4"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    />
  );
}
