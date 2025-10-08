import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { performanceMonitor } from './performance.js';

/**
 * Real-time analytics dashboard
 */
export function AnalyticsDashboard({ className = '' }) {
  const [metrics, setMetrics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    topPages: [],
    realtimeUsers: 0,
    coreWebVitals: {
      LCP: { value: 0, rating: 'good' },
      FID: { value: 0, rating: 'good' },
      CLS: { value: 0, rating: 'good' },
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      // Simulate API call - replace with real analytics service
      const data = await fetchAnalyticsData(timeRange);
      setMetrics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalyticsData = async (range) => {
    // Mock data - replace with real API calls
    return {
      pageViews: Math.floor(Math.random() * 10000) + 1000,
      uniqueVisitors: Math.floor(Math.random() * 5000) + 500,
      avgSessionDuration: Math.floor(Math.random() * 300) + 120,
      bounceRate: Math.floor(Math.random() * 30) + 20,
      realtimeUsers: Math.floor(Math.random() * 50) + 1,
      topPages: [
        { path: '/', views: 1234, percentage: 45 },
        { path: '/blog', views: 890, percentage: 32 },
        { path: '/cv', views: 456, percentage: 16 },
        { path: '/repos', views: 234, percentage: 7 },
      ],
      coreWebVitals: {
        LCP: { value: 1.8, rating: 'good' },
        FID: { value: 85, rating: 'good' },
        CLS: { value: 0.05, rating: 'good' },
      },
    };
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'good':
        return 'success';
      case 'needs-improvement':
        return 'warning';
      case 'poor':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard ${className}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">Analytics Dashboard</h2>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success d-flex align-items-center">
            <i className="bi bi-circle-fill me-1" style={{ fontSize: '0.5rem' }}></i>
            {metrics.realtimeUsers} online now
          </span>
          <select
            className="form-select form-select-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <motion.div
            className="card border-0 shadow-sm h-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted mb-1">Page Views</h6>
                  <h3 className="mb-0">{metrics.pageViews.toLocaleString()}</h3>
                </div>
                <div className="text-primary fs-2">
                  <i className="bi bi-eye"></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-3">
          <motion.div
            className="card border-0 shadow-sm h-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted mb-1">Unique Visitors</h6>
                  <h3 className="mb-0">{metrics.uniqueVisitors.toLocaleString()}</h3>
                </div>
                <div className="text-success fs-2">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-3">
          <motion.div
            className="card border-0 shadow-sm h-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted mb-1">Avg. Session</h6>
                  <h3 className="mb-0">{formatDuration(metrics.avgSessionDuration)}</h3>
                </div>
                <div className="text-info fs-2">
                  <i className="bi bi-clock"></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-md-3">
          <motion.div
            className="card border-0 shadow-sm h-100"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h6 className="card-title text-muted mb-1">Bounce Rate</h6>
                  <h3 className="mb-0">{metrics.bounceRate}%</h3>
                </div>
                <div className="text-warning fs-2">
                  <i className="bi bi-arrow-return-left"></i>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="row g-4">
        {/* Core Web Vitals */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="card-title mb-0">
                <i className="bi bi-speedometer2 me-2"></i>
                Core Web Vitals
              </h6>
            </div>
            <div className="card-body">
              {Object.entries(metrics.coreWebVitals).map(([metric, data]) => (
                <div key={metric} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold">{metric}</span>
                    <span className={`badge bg-${getRatingColor(data.rating)}`}>{data.rating}</span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className={`progress-bar bg-${getRatingColor(data.rating)}`}
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    {metric === 'LCP' && `${data.value}s`}
                    {metric === 'FID' && `${data.value}ms`}
                    {metric === 'CLS' && data.value}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Pages */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="card-title mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                Top Pages
              </h6>
            </div>
            <div className="card-body">
              {metrics.topPages.map((page, index) => (
                <div key={page.path} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-semibold">{page.path}</span>
                    <span className="text-muted">{page.views.toLocaleString()}</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div className="progress-bar" style={{ width: `${page.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="row g-4 mt-0">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h6 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Performance Summary
              </h6>
            </div>
            <div className="card-body">
              <PerformanceSummary />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Performance summary component
 */
function PerformanceSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const performanceSummary = performanceMonitor.getPerformanceSummary();
    setSummary(performanceSummary);
  }, []);

  if (!summary) {
    return <div className="text-center">Loading performance data...</div>;
  }

  return (
    <div className="performance-summary">
      <div className="row g-3">
        <div className="col-md-4">
          <h6 className="text-muted">Memory Usage</h6>
          {summary.memoryUsage ? (
            <div>
              <div className="d-flex justify-content-between">
                <span>Used</span>
                <span>{(summary.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(1)} MB</span>
              </div>
              <div className="progress mb-1" style={{ height: '4px' }}>
                <div
                  className="progress-bar"
                  style={{ width: `${summary.memoryUsage.usage_percentage}%` }}
                ></div>
              </div>
              <small className="text-muted">
                {summary.memoryUsage.usage_percentage.toFixed(1)}% of limit
              </small>
            </div>
          ) : (
            <span className="text-muted">Not available</span>
          )}
        </div>

        <div className="col-md-4">
          <h6 className="text-muted">Page Load</h6>
          {summary.navigationTiming && (
            <div>
              <div className="d-flex justify-content-between">
                <span>Load Time</span>
                <span>
                  {(
                    (summary.navigationTiming.loadEventEnd -
                      summary.navigationTiming.loadEventStart) /
                    1000
                  ).toFixed(2)}
                  s
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>DOM Ready</span>
                <span>
                  {(
                    (summary.navigationTiming.domContentLoadedEventEnd -
                      summary.navigationTiming.domContentLoadedEventStart) /
                    1000
                  ).toFixed(2)}
                  s
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="col-md-4">
          <h6 className="text-muted">Recent Events</h6>
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {summary.recentEvents.slice(0, 3).map((event, index) => (
              <div key={index} className="small text-muted">
                {event.name}: {new Date(event.timestamp).toLocaleTimeString()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for analytics tracking
 */
export function useAnalytics() {
  const trackEvent = (eventName, properties = {}) => {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, properties);
    }

    // Custom analytics
    performanceMonitor.trackEvent(eventName, properties);
  };

  const trackPageView = (path) => {
    trackEvent('page_view', { page_path: path });
    performanceMonitor.trackPageView(path);
  };

  const trackUserInteraction = (action, details = {}) => {
    trackEvent('user_interaction', { action, ...details });
  };

  const trackError = (error, context = {}) => {
    trackEvent('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackUserInteraction,
    trackError,
  };
}

/**
 * Error boundary with analytics tracking
 */
export class AnalyticsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Track error
    performanceMonitor.trackEvent('react_error', {
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
    });

    // Send to error tracking service (e.g., Sentry)
    if (typeof window.Sentry !== 'undefined') {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Oops! Something went wrong</h4>
          <p>We've been notified about this error and will fix it soon.</p>
          <hr />
          <p className="mb-0">
            <button
              className="btn btn-outline-danger"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AnalyticsDashboard;
