// Performance monitoring utility for AWS Lambda with CloudWatch integration
export const performance = {
  // Track page generation performance
  trackPagePerformance: async (pageName, pageProps, fn) => {
    const startTime = Date.now();
    const startMemory = process.memoryUsage();
    const requestId = process.env.AWS_REQUEST_ID || 'local';
    
    console.log(`🚀 [PERFORMANCE-START] ${pageName} | RequestId: ${requestId}`);
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      const endMemory = process.memoryUsage();
      const memoryUsed = Math.round(endMemory.heapUsed / 1024 / 1024);
      
      // Log comprehensive performance data for CloudWatch
      console.log(`📊 [PERFORMANCE-COMPLETE] ${pageName}`, {
        requestId,
        duration: `${duration}ms`,
        memoryUsed: `${memoryUsed}MB`,
        pageType: pageProps?.pageType || 'unknown',
        isSSR: pageProps?.isSSR || false,
        cacheStatus: pageProps?.cacheStatus || 'miss',
        userAgent: pageProps?.userAgent || 'unknown',
        timestamp: new Date().toISOString(),
      });
      
      // Alert for slow pages (> 2 seconds)
      if (duration > 2000) {
        console.warn(`⚠️ [SLOW-PAGE-ALERT] ${pageName} took ${duration}ms - OPTIMIZATION NEEDED`);
      }
      
      // Alert for high memory usage (> 200MB)
      if (memoryUsed > 200) {
        console.warn(`⚠️ [HIGH-MEMORY-ALERT] ${pageName} used ${memoryUsed}MB - MEMORY LEAK POSSIBLE`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ [PERFORMANCE-ERROR] ${pageName}`, {
        requestId,
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack?.substring(0, 500),
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  },

  // Track API call durations with detailed logging
  timeAPICall: async (name, apiCall, url = 'unknown') => {
    const start = Date.now();
    const startMemory = process.memoryUsage();
    const REQUEST_ID = process.env.AWS_REQUEST_ID || 'local';
    
    // Helper function to safely stringify objects with circular references
    const safeStringify = (obj) => {
      try {
        return JSON.stringify(obj, (key, value) => {
          // Skip circular references and functions
          if (typeof value === 'object' && value !== null) {
            if (value.constructor?.name === 'ClientRequest' || 
                value.constructor?.name === 'IncomingMessage' ||
                value.constructor?.name === 'Socket') {
              return '[Circular/Network Object]';
            }
          }
          if (typeof value === 'function') {
            return '[Function]';
          }
          return value;
        });
      } catch (error) {
        return '[Unstringifiable Object]';
      }
    };
    
    // Helper function to get safe data size
    const getSafeDataSize = (data) => {
      try {
        if (!data) return 0;
        if (typeof data === 'string') return data.length;
        if (Array.isArray(data)) return data.length;
        if (typeof data === 'object') {
          const stringified = safeStringify(data);
          return stringified ? stringified.length : 0;
        }
        return 0;
      } catch (error) {
        return 0;
      }
    };
    
    try {
      const result = await apiCall();
      const duration = Date.now() - start;
      const dataSize = getSafeDataSize(result);
      
      console.log(`🌐 [API-SUCCESS] ${name} {`);
      console.log(`  requestId: '${REQUEST_ID}',`);
      console.log(`  duration: '${duration}ms',`);
      console.log(`  method: '${url?.includes('POST') ? 'POST' : 'GET'}',`);
      console.log(`  url: '${url?.substring(0, 100)}',`);
      console.log(`  dataSize: '${dataSize}B',`);
      console.log(`  timestamp: '${new Date().toISOString()}'`);
      console.log(`}`);
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      console.log(`❌ [API-ERROR] ${name} {`);
      console.log(`  requestId: '${REQUEST_ID}',`);
      console.log(`  duration: '${duration}ms',`);
      console.log(`  method: '${url?.includes('POST') ? 'POST' : 'GET'}',`);
      console.log(`  url: '${url?.substring(0, 100)}',`);
      console.log(`  error: ${JSON.stringify(error.message || error, null, 2)},`);
      console.log(`  statusCode: '${error?.status || error?.response?.status || 'unknown'}',`);
      console.log(`  timestamp: '${new Date().toISOString()}'`);
      console.log(`}`);
      
      // Re-throw to maintain error flow
      throw error;
    }
  },

  // Track database queries with detailed metrics
  timeDBQuery: async (queryName, query, fn) => {
    const start = Date.now();
    const requestId = process.env.AWS_REQUEST_ID || 'local';
    
    console.log(`🗄️ [DB-START] ${queryName} | RequestId: ${requestId}`);
    
    try {
      const result = await fn();
      const duration = Date.now() - start;
      const resultCount = Array.isArray(result) ? result.length : 1;
      
      console.log(`✅ [DB-SUCCESS] ${queryName}`, {
        requestId,
        duration: `${duration}ms`,
        resultCount,
        query: query?.substring(0, 100), // Truncate long queries
        timestamp: new Date().toISOString(),
      });
      
      // Alert for slow queries (> 500ms)
      if (duration > 500) {
        console.warn(`⚠️ [SLOW-DB-ALERT] ${queryName} took ${duration}ms - DATABASE OPTIMIZATION NEEDED`);
      }
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ [DB-ERROR] ${queryName}`, {
        requestId,
        duration: `${duration}ms`,
        query: query?.substring(0, 100),
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  },

  // Log detailed memory usage
  logMemoryUsage: (context = '', details = {}) => {
    const used = process.memoryUsage();
    const requestId = process.env.AWS_REQUEST_ID || 'local';
    
    console.log(`🧠 [MEMORY-USAGE] ${context}`, {
      requestId,
      rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(used.external / 1024 / 1024)}MB`,
      ...details,
      timestamp: new Date().toISOString(),
    });
  },

  // Track cost-generating events
  logCostEvent: (eventType, details = {}) => {
    const requestId = process.env.AWS_REQUEST_ID || 'local';
    
    console.log(`💰 [COST-EVENT] ${eventType}`, {
      requestId,
      ...details,
      estimatedCost: details.duration ? `$${(details.duration * 0.0000166667 / 1000).toFixed(4)}` : 'unknown',
      timestamp: new Date().toISOString(),
    });
  },

  // Generate performance summary
  generateSummary: (pageName, timings = {}) => {
    const total = Object.values(timings).reduce((sum, time) => sum + (time || 0), 0);
    const requestId = process.env.AWS_REQUEST_ID || 'local';
    
    console.log(`📈 [PERFORMANCE-SUMMARY] ${pageName}`, {
      requestId,
      totalDuration: `${total}ms`,
      breakdown: timings,
      estimatedCost: `$${(total * 0.0000166667 / 1000).toFixed(4)}`,
      timestamp: new Date().toISOString(),
    });
  },
};

// Memory optimization utilities
export const memoryUtils = {
  // Clean up variables to free memory
  cleanup: (vars) => {
    vars.forEach(varRef => {
      if (varRef && typeof varRef === 'object') {
        Object.keys(varRef).forEach(key => delete varRef[key]);
      }
    });
  },

  // Monitor memory thresholds
  checkMemoryThreshold: (maxMB = 200) => {
    const used = process.memoryUsage();
    const currentMB = Math.round(used.heapUsed / 1024 / 1024);
    
    if (currentMB > maxMB) {
      console.warn(`⚠️ [MEMORY-THRESHOLD] Usage high: ${currentMB}MB (threshold: ${maxMB}MB)`);
      return false;
    }
    return true;
  },
};
