// 📊 Simple Remote Logger for EC2 Deployment
// Sends performance logs to a backend endpoint for monitoring

class RemoteLogger {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.logEndpoint = process.env.NEXT_PUBLIC_LOG_ENDPOINT || '/api/logs';
    this.batchSize = 10;
    this.logQueue = [];
    this.flushInterval = 5000; // 5 seconds
    
    // Auto-flush logs periodically
    if (typeof window !== 'undefined') {
      setInterval(() => this.flush(), this.flushInterval);
      
      // Flush on page unload
      window.addEventListener('beforeunload', () => this.flush());
    }
  }

  // 🚀 Log performance data
  logPerformance(pageName, metrics) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: 'PERFORMANCE',
      page: pageName,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...metrics
    };

    this.addToQueue(logData);
    
    // Also log to console for immediate debugging
    console.log(`🚀 [PERFORMANCE] ${pageName}:`, metrics);
  }

  // 🌐 Log API call performance
  logAPICall(endpoint, duration, status, error = null) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: 'API_CALL',
      endpoint,
      duration,
      status,
      error: error?.message || null,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    this.addToQueue(logData);
    console.log(`🌐 [API] ${endpoint}: ${duration}ms (${status})`);
  }

  // 🎯 Log page events
  logPageEvent(pageName, eventType, data = {}) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: 'PAGE_EVENT',
      page: pageName,
      event: eventType,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...data
    };

    this.addToQueue(logData);
    console.log(`🎯 [EVENT] ${pageName} - ${eventType}:`, data);
  }

  // ⚠️ Log errors
  logError(error, context = {}) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      message: error.message,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      ...context
    };

    this.addToQueue(logData);
    console.error(`⚠️ [ERROR]`, error, context);
  }

  // 📊 Log Chrome-specific performance issues
  logChromePerformance(metrics) {
    const logData = {
      timestamp: new Date().toISOString(),
      type: 'CHROME_PERFORMANCE',
      isChrome: typeof navigator !== 'undefined' ? navigator.userAgent.includes('Chrome') : false,
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      ...metrics
    };

    this.addToQueue(logData);
    console.log(`🔍 [CHROME-PERF]:`, metrics);
  }

  // Add log to queue
  addToQueue(logData) {
    this.logQueue.push(logData);
    
    // Auto-flush if queue is full
    if (this.logQueue.length >= this.batchSize) {
      this.flush();
    }
  }

  // Send logs to backend
  async flush() {
    if (this.logQueue.length === 0) return;
    
    const logsToSend = [...this.logQueue];
    this.logQueue = [];

    try {
      // In production, send to backend
      if (this.isProduction && typeof fetch !== 'undefined') {
        await fetch(this.logEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ logs: logsToSend }),
        });
      }
    } catch (error) {
      console.error('Failed to send logs:', error);
      // Re-add logs to queue for retry
      this.logQueue.unshift(...logsToSend);
    }
  }

  // Helper to measure Navigation Timing API
  getNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance) return {};

    try {
      let navigationStart, loadEventEnd, domContentLoaded;
      
      if (performance.getEntriesByType && performance.getEntriesByType('navigation').length > 0) {
        // Modern API
        const navigation = performance.getEntriesByType('navigation')[0];
        navigationStart = navigation.fetchStart || navigation.startTime || 0;
        loadEventEnd = navigation.loadEventEnd || 0;
        domContentLoaded = navigation.domContentLoadedEventEnd || 0;
        
        return {
          navigationStart,
          domContentLoaded: domContentLoaded - navigationStart,
          loadEventEnd: loadEventEnd > 0 ? loadEventEnd - navigationStart : null,
          currentTime: Date.now() - (navigationStart + performance.timeOrigin)
        };
      } else if (performance.timing) {
        // Legacy API fallback
        navigationStart = performance.timing.navigationStart;
        loadEventEnd = performance.timing.loadEventEnd;
        domContentLoaded = performance.timing.domContentLoadedEventEnd;
        
        return {
          navigationStart,
          domContentLoaded: domContentLoaded - navigationStart,
          loadEventEnd: loadEventEnd > 0 ? loadEventEnd - navigationStart : null,
          currentTime: Date.now() - navigationStart
        };
      }
    } catch (error) {
      console.error('Error getting navigation timing:', error);
    }
    
    return { error: 'Navigation timing not available' };
  }
}

// Export singleton instance
const logger = new RemoteLogger();

// Helper functions
export const logPerformance = (pageName, metrics) => logger.logPerformance(pageName, metrics);
export const logAPICall = (endpoint, duration, status, error) => logger.logAPICall(endpoint, duration, status, error);
export const logPageEvent = (pageName, eventType, data) => logger.logPageEvent(pageName, eventType, data);
export const logError = (error, context) => logger.logError(error, context);
export const logChromePerformance = (metrics) => logger.logChromePerformance(metrics);
export const getNavigationTiming = () => logger.getNavigationTiming();

export default logger;
