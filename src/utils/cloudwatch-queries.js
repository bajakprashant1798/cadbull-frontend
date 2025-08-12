// 📊 CloudWatch Log Insights Queries for Cost Analysis
// Use these in AWS CloudWatch → Logs → Insights

export const cloudWatchQueries = {
  // 💰 MOST EXPENSIVE PAGES BY COMPUTE TIME
  mostExpensivePages: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-COST/
    | parse @message /AMPLIFY-COST: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)".*"computeTime":(?<computeTime>[^,}]*)/
    | parse data /"estimatedCost":\{"totalCost":"(?<totalCost>[^"]*)/
    | stats sum(totalCost), avg(computeTime), count() as requests by page
    | sort sum(totalCost) desc
    | limit 10
  `,

  // 🚀 SLOWEST PAGES BY PERFORMANCE
  slowestPages: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-PERFORMANCE/
    | parse @message /AMPLIFY-PERFORMANCE: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)".*"totalTime":(?<totalTime>[^,}]*)/
    | parse data /"memoryUsed":(?<memoryUsed>[^,}]*)/
    | stats avg(totalTime), max(totalTime), avg(memoryUsed), count() by page
    | sort avg(totalTime) desc
    | limit 10
  `,

  // 🌐 API CALL PERFORMANCE ANALYSIS
  apiPerformance: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-API/
    | parse @message /AMPLIFY-API: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"endpoint":"(?<endpoint>[^"]*)".*"duration":(?<duration>[^,}]*)/
    | parse data /"status":(?<status>[^,}]*)/
    | stats avg(duration), max(duration), count() as calls by endpoint, status
    | sort avg(duration) desc
    | limit 20
  `,

  // 🧠 MEMORY USAGE BY PAGE
  memoryUsageByPage: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-MEMORY/
    | parse @message /AMPLIFY-MEMORY: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)".*"heapUsed":(?<heapUsed>[^,}]*)/
    | parse data /"rss":(?<rss>[^,}]*)/
    | stats avg(heapUsed), max(heapUsed), avg(rss), max(rss) by page
    | sort avg(heapUsed) desc
    | limit 10
  `,

  // 📊 ISR CACHE EFFICIENCY
  isrCacheEfficiency: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-ISR/
    | parse @message /AMPLIFY-ISR: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)".*"cacheHit":(?<cacheHit>[^,}]*)/
    | parse data /"generationTime":(?<generationTime>[^,}]*)/
    | stats count() as total, sum(case when cacheHit = "true" then 1 else 0 end) as cache_hits, avg(generationTime) by page
    | extend cache_hit_rate = (cache_hits / total) * 100
    | sort cache_hit_rate asc
    | limit 10
  `,

  // ⚠️ ERROR TRACKING
  errorsByPage: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-ERROR/
    | parse @message /AMPLIFY-ERROR: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"message":"(?<error_message>[^"]*)".*"page":"(?<page>[^"]*)/
    | stats count() as error_count by page, error_message
    | sort error_count desc
    | limit 20
  `,

  // 💵 HOURLY COST BREAKDOWN
  hourlyCostBreakdown: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-COST/
    | parse @message /AMPLIFY-COST: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"estimatedCost":\{"totalCost":"(?<totalCost>[^"]*)/
    | parse data /"page":"(?<page>[^"]*)/
    | bin(@timestamp, 1h) as hour
    | stats sum(totalCost) as hourly_cost, count() as requests by hour, page
    | sort hour desc, hourly_cost desc
    | limit 50
  `,

  // 🎯 PAGE EVENT TRACKING
  pageEventAnalysis: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-EVENT/
    | parse @message /AMPLIFY-EVENT-(?<event_type>[^:]*): (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)/
    | stats count() as event_count by page, event_type
    | sort event_count desc
    | limit 30
  `,

  // 📈 PERFORMANCE SUMMARY DASHBOARD
  performanceSummary: `
    fields @timestamp, @message
    | filter @message like /AMPLIFY-SUMMARY/
    | parse @message /AMPLIFY-SUMMARY: (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)".*"totalExecutionTime":(?<execTime>[^,}]*)/
    | parse data /"averageMemoryUsage":(?<avgMemory>[^,}]*)/
    | parse data /"totalApiCalls":(?<apiCalls>[^,}]*)/
    | stats latest(execTime) as latest_exec_time, latest(avgMemory) as latest_memory, latest(apiCalls) as latest_api_calls by page
    | sort latest_exec_time desc
    | limit 15
  `,

  // 🔍 REAL-TIME MONITORING (Last 15 minutes)
  realTimeMonitoring: `
    fields @timestamp, @message
    | filter @timestamp > @timestamp - 15m
    | filter @message like /AMPLIFY-/
    | parse @message /AMPLIFY-(?<log_type>[^:]*): (?<data>.*)/
    | filter ispresent(data)
    | parse data /"page":"(?<page>[^"]*)/
    | stats count() as log_count by log_type, page
    | sort @timestamp desc
    | limit 50
  `
};

// 📊 Usage Instructions for CloudWatch Log Insights
export const queryInstructions = {
  howToUse: [
    "1. Go to AWS CloudWatch Console",
    "2. Navigate to Logs → Insights",
    "3. Select your Amplify function log group (e.g., /aws/lambda/amplify-cadbull-frontend-main-xxxxx)",
    "4. Paste any query from above",
    "5. Adjust time range as needed",
    "6. Click 'Run query' to see results"
  ],
  
  costOptimizationTips: [
    "🎯 Focus on pages with highest 'sum(totalCost)' from mostExpensivePages query",
    "⚡ Optimize pages with highest 'avg(totalTime)' from slowestPages query", 
    "🧠 Reduce memory usage for pages showing high 'avg(heapUsed)' values",
    "📊 Improve ISR cache hit rates for pages with low 'cache_hit_rate'",
    "🌐 Optimize slow API calls from apiPerformance query results"
  ],
  
  monitoringSchedule: [
    "🌅 Daily: Run mostExpensivePages and slowestPages queries",
    "📊 Weekly: Analyze memoryUsageByPage and isrCacheEfficiency",
    "📈 Monthly: Review hourlyCostBreakdown for budget planning",
    "⚠️ Real-time: Use realTimeMonitoring for immediate issues"
  ]
};

export default cloudWatchQueries;
