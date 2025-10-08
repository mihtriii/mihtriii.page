import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Enhanced page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

// Stagger animation for child elements
const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export function PageWrapper({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

export function WithPresence({ location, children }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}>{children}</motion.div>
    </AnimatePresence>
  );
}

// New component for staggered animations
export function StaggerContainer({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div className={className} variants={childVariants}>
      {children}
    </motion.div>
  );
}

// Loading animation component
export function LoadingSpinner({ size = 40, className = '' }) {
  return (
    <motion.div
      className={`d-flex justify-content-center align-items-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{
          width: size,
          height: size,
          border: '2px solid var(--bs-border-color)',
          borderTop: '2px solid var(--bs-primary)',
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
