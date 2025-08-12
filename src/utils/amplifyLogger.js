// 🔍 CloudWatch Logging Utility for AWS Amplify
// Optimized for serverless functions and cost monitoring

class AmplifyCloudWatchLogger {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.enableCloudWatch = process.env.ENABLE_CLOUDWATCH_LOGS === 'true';
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.region = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';
  }

  // 🚀 Track page performance in Amplify functions
  logPagePerformance(pageName, metrics) {
    if (!this.shouldLog('info')) return;

    const logData = {
      timestamp: new Date().toISOString(),
      type: 'PAGE_PERFORMANCE',
      page: pageName,
      ...metrics,
      environment: this.isProduction ? 'production' : 'development'
    };

    // Use console.info to bypass removeConsole for critical logs
    console.info('🚀 AMPLIFY-PERFORMANCE:', JSON.stringify(logData));
  }

  // 💰 Track costs and resource usage
  logCostMetrics(pageName, metrics) {
    if (!this.shouldLog('warn')) return;

    const costData = {
      timestamp: new Date().toISOString(),
      type: 'COST_METRICS',
      page: pageName,
      computeTime: metrics.computeTime,
      memoryUsed: metrics.memoryUsed,
      apiCalls: metrics.apiCalls,
      estimatedCost: this.calculateCost(metrics),
      environment: this.isProduction ? 'production' : 'development'
    };

    // Use console.warn for cost alerts
    console.warn('💰 AMPLIFY-COST:', JSON.stringify(costData));
  }

  // 🌐 Track API performance
  logAPICall(endpoint, duration, status, size = 0) {
    if (!this.shouldLog('info')) return;

    const apiData = {
      timestamp: new Date().toISOString(),
      type: 'API_CALL',
      endpoint,
      duration,
      status,
      responseSize: size,
      environment: this.isProduction ? 'production' : 'development'
    };

    console.info('🌐 AMPLIFY-API:', JSON.stringify(apiData));
  }

  // 🧠 Track memory usage
  logMemoryUsage(pageName, memoryStats) {
    if (!this.shouldLog('info')) return;

    const memoryData = {
      timestamp: new Date().toISOString(),
      type: 'MEMORY_USAGE',
      page: pageName,
      ...memoryStats,
      environment: this.isProduction ? 'production' : 'development'
    };

    console.info('🧠 AMPLIFY-MEMORY:', JSON.stringify(memoryData));
  }

  // ⚠️ Log errors and warnings
  logError(error, context = {}) {
    const errorData = {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      message: error.message,
      stack: error.stack,
      ...context,
      environment: this.isProduction ? 'production' : 'development'
    };

    console.error('⚠️ AMPLIFY-ERROR:', JSON.stringify(errorData));
  }

  // 📊 ISR Performance tracking
  logISRPerformance(pageName, isrMetrics) {
    if (!this.shouldLog('info')) return;

    const isrData = {
      timestamp: new Date().toISOString(),
      type: 'ISR_PERFORMANCE',
      page: pageName,
      ...isrMetrics,
      environment: this.isProduction ? 'production' : 'development'
    };

    console.info('📊 AMPLIFY-ISR:', JSON.stringify(isrData));
  }

  // 💵 Calculate estimated AWS costs
  calculateCost(metrics) {
    // AWS Lambda pricing (us-east-1)
    const lambdaPricePerRequest = 0.0000002; // $0.20 per 1M requests
    const lambdaPricePerGBSecond = 0.0000166667; // $16.67 per 1M GB-seconds
    
    const memoryGB = (metrics.memoryUsed || 128) / 1024;
    const executionTimeSeconds = (metrics.computeTime || 0) / 1000;
    
    const requestCost = lambdaPricePerRequest;
    const computeCost = memoryGB * executionTimeSeconds * lambdaPricePerGBSecond;
    
    return {
      requestCost: requestCost.toFixed(8),
      computeCost: computeCost.toFixed(8),
      totalCost: (requestCost + computeCost).toFixed(8),
      currency: 'USD'
    };
  }

  // 🔍 Check if logging should occur
  shouldLog(level) {
    if (!this.isProduction && !this.enableCloudWatch) return true;
    
    const levels = ['error', 'warn', 'info', 'debug'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex <= currentLevelIndex;
  }

  // 🎯 Track specific page events
  trackPageEvent(pageName, eventType, data = {}) {
    if (!this.shouldLog('info')) return;

    const eventData = {
      timestamp: new Date().toISOString(),
      type: 'PAGE_EVENT',
      page: pageName,
      event: eventType,
      ...data,
      environment: this.isProduction ? 'production' : 'development'
    };

    console.info(`🎯 AMPLIFY-EVENT-${eventType.toUpperCase()}:`, JSON.stringify(eventData));
  }

  // 📈 Performance summary
  logPerformanceSummary(pageName, summary) {
    if (!this.shouldLog('warn')) return;

    const summaryData = {
      timestamp: new Date().toISOString(),
      type: 'PERFORMANCE_SUMMARY',
      page: pageName,
      ...summary,
      environment: this.isProduction ? 'production' : 'development'
    };

    console.warn('📈 AMPLIFY-SUMMARY:', JSON.stringify(summaryData));
  }
}

// Export singleton instance
const amplifyLogger = new AmplifyCloudWatchLogger();

// Helper functions for easy use
export const logPagePerformance = (pageName, metrics) => 
  amplifyLogger.logPagePerformance(pageName, metrics);

export const logCostMetrics = (pageName, metrics) => 
  amplifyLogger.logCostMetrics(pageName, metrics);

export const logAPICall = (endpoint, duration, status, size) => 
  amplifyLogger.logAPICall(endpoint, duration, status, size);

export const logMemoryUsage = (pageName, memoryStats) => 
  amplifyLogger.logMemoryUsage(pageName, memoryStats);

export const logError = (error, context) => 
  amplifyLogger.logError(error, context);

export const logISRPerformance = (pageName, isrMetrics) => 
  amplifyLogger.logISRPerformance(pageName, isrMetrics);

export const trackPageEvent = (pageName, eventType, data) => 
  amplifyLogger.trackPageEvent(pageName, eventType, data);

export const logPerformanceSummary = (pageName, summary) => 
  amplifyLogger.logPerformanceSummary(pageName, summary);

export default amplifyLogger;
