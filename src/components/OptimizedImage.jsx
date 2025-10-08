import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Optimized Image component with lazy loading, blur placeholder, and error handling
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+',
  blur = true,
  priority = false,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setIsError(true);
    onError?.(e);
  };

  const imageStyle = {
    transition: 'all 0.3s ease',
    filter: isLoaded ? 'none' : blur ? 'blur(5px)' : 'none',
    opacity: isLoaded ? 1 : 0.7,
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      ref={imgRef}
      className={`position-relative overflow-hidden ${className}`}
      style={{ backgroundColor: '#f8f9fa' }}
      {...props}
    >
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <img
          src={placeholder}
          alt=""
          className="w-100 h-100 object-fit-cover position-absolute top-0 start-0"
          style={{ zIndex: 1 }}
        />
      )}

      {/* Main image */}
      {isInView && !isError && (
        <motion.img
          src={src}
          alt={alt}
          className="w-100 h-100 object-fit-cover"
          style={{ ...imageStyle, zIndex: 2 }}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0.7 }}
          transition={{ duration: 0.3 }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}

      {/* Error state */}
      {isError && (
        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
          <div className="text-center">
            <i className="bi bi-image fs-2 d-block mb-2"></i>
            <small>Failed to load image</small>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isInView && !isLoaded && !isError && (
        <div className="position-absolute top-50 start-50 translate-middle" style={{ zIndex: 3 }}>
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook for preloading critical images
 */
export function useImagePreloader(urls = []) {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!urls.length) return;

    setIsLoading(true);
    const promises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          setLoadedImages((prev) => new Set([...prev, url]));
          resolve(url);
        };
        img.onerror = reject;
        img.src = url;
      });
    });

    Promise.allSettled(promises).finally(() => {
      setIsLoading(false);
    });
  }, [urls]);

  return { loadedImages, isLoading };
}

/**
 * Component for generating responsive image srcSet
 */
export function ResponsiveImage({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  widths = [320, 480, 768, 1024, 1280],
  className = '',
  ...props
}) {
  // Generate srcSet from base image path
  const generateSrcSet = (baseSrc, widths) => {
    const extension = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${extension}`, '');

    return widths.map((width) => `${baseName}_${width}w.${extension} ${width}w`).join(', ');
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      srcSet={generateSrcSet(src, widths)}
      sizes={sizes}
      {...props}
    />
  );
}
