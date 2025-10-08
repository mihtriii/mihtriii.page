import React from 'react';
import { motion } from 'framer-motion';

const icons = [
  {
    name: 'GitHub',
    icon: <i className="bi bi-github"></i>,
    url: 'https://github.com/mihtriii',
    color: '#181717',
  },
  {
    name: 'LinkedIn',
    icon: <i className="bi bi-linkedin"></i>,
    url: 'https://www.linkedin.com/in/mihtriii/',
    color: '#0a66c2',
  },
  {
    name: 'Kaggle',
    icon: (
      <img
        src={import.meta.env.BASE_URL + 'assets/kaggle.svg'}
        alt="Kaggle"
        width={18}
        height={18}
      />
    ),
    url: 'https://www.kaggle.com/mihtriii',
    color: '#20beff',
  },
  {
    name: 'Email',
    icon: <i className="bi bi-envelope"></i>,
    url: 'mailto:mihtriii295@gmail.com',
    color: '#c97a40',
  },
  {
    name: 'Scholar',
    icon: <i className="bi bi-mortarboard"></i>,
    url: 'https://scholar.google.com/citations?user=YOUR_PROFILE_ID',
    color: '#4285f4',
  },
];

export default function SidebarIcons() {
  return (
    <div
      className="position-fixed"
      style={{ top: '50%', right: '20px', transform: 'translateY(-50%)', zIndex: 1000 }}
    >
      <motion.div
        className="d-flex flex-column gap-2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {icons.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target={social.url.startsWith('mailto:') ? undefined : '_blank'}
            rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className="btn btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '45px',
              height: '45px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}
            whileHover={{
              scale: 1.1,
              backgroundColor: social.color,
              borderColor: social.color,
              boxShadow: `0 0 15px ${social.color}40`,
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            title={social.name}
          >
            {social.icon}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
