import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

/**
 * Enhanced Suspense wrapper with loading states and error boundaries
 */
function LazyLoadWrapper({
  children,
  fallback,
  className = '',
  minHeight = '200px',
  showSpinner = true,
}) {
  const defaultFallback = (
    <div
      className={`d-flex align-items-center justify-content-center ${className}`}
      style={{ minHeight }}
    >
      {showSpinner && (
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted small mb-0">Loading component...</p>
        </div>
      )}
    </div>
  );

  return <Suspense fallback={fallback || defaultFallback}>{children}</Suspense>;
}

/**
 * Error boundary for lazy loaded components
 */
class LazyLoadErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy load error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <div>
            <strong>Component failed to load</strong>
            <div className="small text-muted mt-1">
              {this.state.error?.message || 'Unknown error occurred'}
            </div>
            <button
              className="btn btn-sm btn-outline-warning mt-2"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for lazy loading with enhanced features
 */
export function withLazyLoading(importFunc, options = {}) {
  const {
    fallback,
    className = '',
    minHeight = '200px',
    showSpinner = true,
    retryable = true,
  } = options;

  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props) {
    return (
      <LazyLoadErrorBoundary>
        <LazyLoadWrapper
          fallback={fallback}
          className={className}
          minHeight={minHeight}
          showSpinner={showSpinner}
        >
          <LazyComponent {...props} />
        </LazyLoadWrapper>
      </LazyLoadErrorBoundary>
    );
  };
}

/**
 * Preloader for critical components
 */
export class ComponentPreloader {
  static cache = new Map();

  static preload(importFunc, key) {
    if (!this.cache.has(key)) {
      const componentPromise = importFunc();
      this.cache.set(key, componentPromise);
      return componentPromise;
    }
    return this.cache.get(key);
  }

  static preloadMultiple(components) {
    return Promise.allSettled(
      components.map(({ importFunc, key }) => this.preload(importFunc, key))
    );
  }
}

/**
 * Hook for conditional component loading based on viewport
 */
export function useConditionalLoad(condition = true, delay = 0) {
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    if (!condition) return;

    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [condition, delay]);

  return shouldLoad;
}

/**
 * Loading skeleton component
 */
export function LoadingSkeleton({ lines = 3, height = '1rem', className = '', animated = true }) {
  return (
    <div className={`${className} ${animated ? 'placeholder-glow' : ''}`}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={`placeholder bg-secondary ${animated ? 'placeholder-wave' : ''}`}
          style={{
            height,
            width: i === lines - 1 ? '75%' : '100%',
            marginBottom: i === lines - 1 ? 0 : '0.5rem',
            borderRadius: '0.25rem',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton for loading states
 */
export function CardSkeleton({ animated = true, className = '' }) {
  return (
    <div className={`card ${className} ${animated ? 'placeholder-glow' : ''}`}>
      <div
        className={`placeholder bg-secondary ${animated ? 'placeholder-wave' : ''}`}
        style={{ height: '200px', borderRadius: '0.375rem 0.375rem 0 0' }}
      />
      <div className="card-body">
        <h5
          className={`card-title placeholder bg-secondary ${animated ? 'placeholder-wave' : ''}`}
        ></h5>
        <p className="card-text">
          <span
            className={`placeholder bg-secondary ${animated ? 'placeholder-wave' : ''}`}
            style={{ width: '100%' }}
          ></span>
          <span
            className={`placeholder bg-secondary ${animated ? 'placeholder-wave' : ''}`}
            style={{ width: '75%' }}
          ></span>
        </p>
        <div
          className={`placeholder bg-secondary ${animated ? 'placeholder-wave' : ''}`}
          style={{ width: '30%', height: '38px', borderRadius: '0.25rem' }}
        ></div>
      </div>
    </div>
  );
}

// Export lazy loaded components
export const LazyThemeCustomizer = withLazyLoading(() => import('./ThemeCustomizer.jsx'), {
  minHeight: '100px',
  fallback: <LoadingSkeleton lines={2} height="2rem" className="p-3" />,
});

export const LazyParticles = withLazyLoading(() => import('./Particles.jsx'), {
  showSpinner: false,
  minHeight: '0px',
});

export const LazyBlogPost = withLazyLoading(() => import('../pages/BlogPost.jsx'), {
  minHeight: '400px',
  fallback: (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <LoadingSkeleton lines={1} height="3rem" className="mb-4" />
          <LoadingSkeleton lines={5} height="1.2rem" />
        </div>
      </div>
    </div>
  ),
});

export default LazyLoadWrapper;
