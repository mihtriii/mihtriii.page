import React, { useEffect } from 'react';

/** Preload critical images on app mount */
export default function CriticalImagePreload() {
  useEffect(() => {
    const criticalImages = ['/assets/avatar.JPG'];

    criticalImages.forEach((src) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
    });

    return () => {
      // Cleanup: remove preload links on unmount
      criticalImages.forEach((src) => {
        const links = document.querySelectorAll(`link[rel="preload"][href="${src}"]`);
        links.forEach((link) => link.remove());
      });
    };
  }, []);

  return null;
}