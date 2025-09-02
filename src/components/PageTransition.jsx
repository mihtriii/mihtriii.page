import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function WithPresence({ location, children }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

