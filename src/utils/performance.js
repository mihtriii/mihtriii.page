/**
 * Performance monitoring and analytics utilities
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = {};
    this.isEnabled = typeof window !== 'undefined' && 'performance' in window;
  }

  /**
   * Start timing a custom metric
   */
  startTiming(name) {
    if (!this.isEnabled) return;
    
    this.metrics[name] = {
      startTime: performance.now(),
      endTime: null,
      duration: null
    };
  }

  /**
   * End timing and calculate duration
   */
  endTiming(name) {
    if (!this.isEnabled || !this.metrics[name]) return;
    
    this.metrics[name].endTime = performance.now();
    this.metrics[name].duration = this.metrics[name].endTime - this.metrics[name].startTime;
    
    // Log to analytics if available
    this.trackEvent('performance_timing', {
      metric_name: name,
      duration: this.metrics[name].duration
    });
    
    return this.metrics[name].duration;
  }

  /**
   * Measure component render time
   */
  measureComponentRender(componentName, renderFunction) {
    this.startTiming(`render_${componentName}`);
    const result = renderFunction();
    this.endTiming(`render_${componentName}`);
    return result;
  }

  /**
   * Monitor Core Web Vitals
   */
  initCoreWebVitals() {
    if (!this.isEnabled) return;

    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.trackEvent('core_web_vital', {
        metric: 'LCP',
        value: lastEntry.startTime,
        rating: this.getRating('LCP', lastEntry.startTime)
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.lcp = observer;
  }

  observeFID() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.trackEvent('core_web_vital', {
          metric: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: this.getRating('FID', entry.processingStart - entry.startTime)
        });
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
    this.observers.fid = observer;
  }

  observeCLS() {
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      this.trackEvent('core_web_vital', {
        metric: 'CLS',
        value: clsValue,
        rating: this.getRating('CLS', clsValue)
      });
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.cls = observer;
  }

  observeFCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          this.trackEvent('core_web_vital', {
            metric: 'FCP',
            value: entry.startTime,
            rating: this.getRating('FCP', entry.startTime)
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
    this.observers.fcp = observer;
  }

  /**
   * Get performance rating based on thresholds
   */
  getRating(metric, value) {
    const thresholds = {
      LCP: { good: 2500, needsImprovement: 4000 },
      FID: { good: 100, needsImprovement: 300 },
      CLS: { good: 0.1, needsImprovement: 0.25 },
      FCP: { good: 1800, needsImprovement: 3000 }
    };
    
    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Monitor bundle size and loading times
   */
  monitorResourceLoading() {
    if (!this.isEnabled) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.name.includes('.js') || entry.name.includes('.css')) {
          this.trackEvent('resource_timing', {
            resource_type: entry.name.includes('.js') ? 'javascript' : 'stylesheet',
            resource_name: entry.name.split('/').pop(),
            load_time: entry.loadEnd - entry.loadStart,
            size: entry.transferSize || entry.decodedBodySize
          });
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.resource = observer;
  }

  /**
   * Monitor memory usage
   */
  getMemoryUsage() {
    if (!this.isEnabled || !performance.memory) return null;
    
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      usage_percentage: (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100
    };
  }

  /**
   * Track user interactions
   */
  trackUserInteraction(action, details = {}) {
    this.trackEvent('user_interaction', {
      action,
      timestamp: Date.now(),
      ...details
    });
  }

  /**
   * Track page views with performance data
   */
  trackPageView(page) {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    const paintTimings = performance.getEntriesByType('paint');
    
    this.trackEvent('page_view', {
      page,
      load_time: navigationTiming ? navigationTiming.loadEventEnd - navigationTiming.loadEventStart : null,
      dom_content_loaded: navigationTiming ? navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart : null,
      first_paint: paintTimings.find(p => p.name === 'first-paint')?.startTime,
      first_contentful_paint: paintTimings.find(p => p.name === 'first-contentful-paint')?.startTime,
      memory_usage: this.getMemoryUsage()
    });
  }

  /**
   * Generic event tracking (integrate with your analytics service)
   */
  trackEvent(eventName, properties = {}) {
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, properties);
    }
    
    // Integrate with Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }
    
    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('perf_events') || '[]');
    events.push({
      name: eventName,
      properties,
      timestamp: Date.now()
    });
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('perf_events', JSON.stringify(events));
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary() {
    return {
      customMetrics: this.metrics,
      memoryUsage: this.getMemoryUsage(),
      navigationTiming: performance.getEntriesByType('navigation')[0],
      resourceTiming: performance.getEntriesByType('resource').slice(-10), // Last 10 resources
      recentEvents: JSON.parse(localStorage.getItem('perf_events') || '[]').slice(-20)
    };
  }

  /**
   * Clean up observers
   */
  cleanup() {
    Object.values(this.observers).forEach(observer => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
    this.observers = {};
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitor() {
  React.useEffect(() => {
    performanceMonitor.initCoreWebVitals();
    performanceMonitor.monitorResourceLoading();
    
    return () => performanceMonitor.cleanup();
  }, []);

  return {
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    endTiming: performanceMonitor.endTiming.bind(performanceMonitor),
    trackUserInteraction: performanceMonitor.trackUserInteraction.bind(performanceMonitor),
    trackPageView: performanceMonitor.trackPageView.bind(performanceMonitor),
    getPerformanceSummary: performanceMonitor.getPerformanceSummary.bind(performanceMonitor)
  };
}

/**
 * Higher-order component for automatic performance tracking
 */
export function withPerformanceTracking(WrappedComponent, componentName) {
  return function PerformanceTrackedComponent(props) {
    const { startTiming, endTiming } = usePerformanceMonitor();
    
    React.useEffect(() => {
      startTiming(`component_mount_${componentName}`);
      return () => {
        endTiming(`component_mount_${componentName}`);
      };
    }, []);
    
    const trackedProps = {
      ...props,
      onUserInteraction: (action, details) => {
        performanceMonitor.trackUserInteraction(action, {
          component: componentName,
          ...details
        });
        props.onUserInteraction?.(action, details);
      }
    };
    
    return React.createElement(WrappedComponent, trackedProps);
  };
}

export default PerformanceMonitor;