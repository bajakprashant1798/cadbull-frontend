// Frontend API Timing Utility for Performance Analysis
export class APITimer {
  constructor(apiName) {
    this.apiName = apiName;
    this.startTime = Date.now();
    this.timings = {};
    this.requestId = `${apiName}-${Date.now()}`;

    // console.log(`🚀 [FRONTEND-API-START] ${this.requestId} - ${apiName} started`);
  }

  mark(stage) {
    const currentTime = Date.now();
    const stageTime = currentTime - (this.lastMarkTime || this.startTime);
    this.timings[stage] = stageTime;
    this.lastMarkTime = currentTime;

    // console.log(`📊 [FRONTEND-API-STAGE] ${this.requestId} - ${stage}: ${stageTime}ms`);
    return this;
  }

  complete(success = true, result = null) {
    const totalTime = Date.now() - this.startTime;
    const status = success ? '✅' : '❌';

    const timingBreakdown = Object.entries(this.timings)
      .map(([stage, time]) => `${stage}: ${time}ms`)
      .join(', ');

    // console.log(`${status} [FRONTEND-API-COMPLETE] ${this.requestId} - ${this.apiName} completed: ${totalTime}ms (${timingBreakdown})`);

    if (totalTime > 2000) {
      console.warn(`⚠️ [FRONTEND-SLOW-API] ${this.requestId} - ${this.apiName} took ${totalTime}ms - investigate backend bottleneck`);
    }

    return {
      apiName: this.apiName,
      requestId: this.requestId,
      totalTime,
      timings: this.timings,
      success,
      result
    };
  }

  error(error) {
    const totalTime = Date.now() - this.startTime;
    console.error(`❌ [FRONTEND-API-ERROR] ${this.requestId} - ${this.apiName} failed: ${totalTime}ms -`, error);

    return {
      apiName: this.apiName,
      requestId: this.requestId,
      totalTime,
      timings: this.timings,
      success: false,
      error
    };
  }
}

// Hook for component-level timing
export function useComponentTimer(componentName) {
  const componentTimer = new APITimer(`Component-${componentName}`);

  return {
    timer: componentTimer,
    mark: (stage) => componentTimer.mark(stage),
    complete: (success, result) => componentTimer.complete(success, result),
    error: (error) => componentTimer.error(error)
  };
}

// Wrapper for API calls with automatic timing
export async function timedAPICall(apiName, apiFunction, ...args) {
  const timer = new APITimer(apiName);

  try {
    timer.mark('request-start');
    const result = await apiFunction(...args);
    timer.mark('response-received');

    timer.complete(true, result);
    return result;
  } catch (error) {
    timer.error(error);
    throw error;
  }
}

// Performance monitoring for useEffect hooks
export function useEffectTimer(effectName, dependencies = []) {
  // console.log(`🔄 [FRONTEND-EFFECT] ${effectName} triggered by:`, dependencies);
  return new APITimer(`Effect-${effectName}`);
}
