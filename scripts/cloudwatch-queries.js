#!/usr/bin/env node

/**
 * CloudWatch Log Insights Queries for Performance Monitoring
 * 
 * After deployment, use these queries in AWS CloudWatch Log Insights
 * to analyze performance and identify bottlenecks.
 * 
 * Usage:
 * 1. Go to AWS CloudWatch > Log Insights
 * 2. Select your Lambda function's log group
 * 3. Paste one of these queries
 * 4. Set time range and run query
 */

const queries = {
  // 🔥 TOP PERFORMANCE ISSUES - Use this first!
  slowestPages: `
fields @timestamp, @message
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /(?<pageName>[A-Za-z]+Page)/
| sort duration desc
| limit 20
| stats avg(duration), max(duration), count() by pageName
  `.trim(),

  // 💰 HIGHEST COST PAGES - Check which pages cost the most
  highestCostPages: `
fields @timestamp, @message
| filter @message like /COST-EVENT/
| parse @message /estimatedCost: '\$(?<cost>[0-9.]+)'/
| parse @message /page: '(?<pageName>[^']+)'/
| sort cost desc
| limit 20
| stats sum(cost), avg(cost), count() by pageName
  `.trim(),

  // ⚡ API PERFORMANCE - See which API calls are slowest
  slowestAPIs: `
fields @timestamp, @message
| filter @message like /API-SUCCESS/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /\[API-SUCCESS\] (?<apiName>[^{]+)/
| sort duration desc
| limit 20
| stats avg(duration), max(duration), count() by apiName
  `.trim(),

  // 🧠 MEMORY USAGE ALERTS - Find memory-heavy operations
  highMemoryUsage: `
fields @timestamp, @message
| filter @message like /MEMORY-USAGE/
| parse @message /heapUsed: '(?<memory>\d+)MB'/
| sort memory desc
| limit 20
| stats avg(memory), max(memory) by bin(5m)
  `.trim(),

  // 🚨 ERROR TRACKING - Monitor failures
  errorTracking: `
fields @timestamp, @message
| filter @message like /ERROR/ or @message like /❌/
| parse @message /(?<errorType>API-ERROR|PERFORMANCE-ERROR|DB-ERROR)/
| parse @message /(?<pageName>[A-Za-z]+Page)/
| stats count() by errorType, pageName
| sort count desc
  `.trim(),

  // 📊 PAGE PERFORMANCE SUMMARY - Overall health check
  performanceSummary: `
fields @timestamp, @message
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /memoryUsed: '(?<memory>\d+)MB'/
| parse @message /(?<pageName>[A-Za-z]+Page)/
| stats 
    avg(duration) as avgDuration,
    max(duration) as maxDuration,
    avg(memory) as avgMemory,
    max(memory) as maxMemory,
    count() as requestCount
  by pageName
| sort avgDuration desc
  `.trim(),

  // 🕐 HOURLY PERFORMANCE TRENDS - Track performance over time
  hourlyTrends: `
fields @timestamp, @message
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /(?<pageName>[A-Za-z]+Page)/
| stats avg(duration) as avgDuration, count() as requests by bin(1h), pageName
| sort @timestamp desc
  `.trim(),

  // 🔍 SEARCH PERFORMANCE - Specific to search functionality
  searchPerformance: `
fields @timestamp, @message
| filter @message like /SearchPage/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /searchTerm: '(?<searchTerm>[^']+)'/
| parse @message /resultsCount: (?<results>\d+)/
| stats avg(duration), max(duration), avg(results) by searchTerm
| sort avg(duration) desc
| limit 10
  `.trim(),

  // 📈 ISR vs SSR PERFORMANCE - Compare rendering methods
  renderingComparison: `
fields @timestamp, @message
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /pageType: '(?<renderType>[^']+)'/
| parse @message /(?<pageName>[A-Za-z]+Page)/
| stats avg(duration), count() by renderType, pageName
| sort avg(duration) desc
  `.trim(),

  // 🔄 SLOW QUERY ALERTS - Database performance
  slowQueries: `
fields @timestamp, @message
| filter @message like /SLOW-DB-ALERT/ or @message like /DB-SUCCESS/
| parse @message /duration: '(?<duration>\d+)ms'/
| parse @message /\[DB-SUCCESS\] (?<queryName>[^{]+)/
| sort duration desc
| limit 10
  `.trim(),

  // 💾 CACHE PERFORMANCE - ISR effectiveness
  cacheAnalysis: `
fields @timestamp, @message
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message /cacheStatus: '(?<cacheStatus>[^']+)'/
| parse @message /(?<pageName>[A-Za-z]+Page)/
| parse @message /duration: '(?<duration>\d+)ms'/
| stats avg(duration), count() by cacheStatus, pageName
| sort avg(duration) desc
  `.trim(),
};

// Helper function to format queries for easy copying
function printQueries() {
  console.log('🔍 CloudWatch Log Insights Queries for Performance Monitoring\n');
  console.log('📋 Copy and paste these queries into AWS CloudWatch Log Insights:\n');
  
  Object.entries(queries).forEach(([name, query]) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 ${name.toUpperCase()}`);
    console.log(`${'='.repeat(60)}`);
    console.log(query);
    console.log('\n');
  });

  console.log(`\n${'📊'.repeat(20)}`);
  console.log('💡 QUICK START GUIDE:');
  console.log('1. Deploy your app to production');
  console.log('2. Go to AWS CloudWatch > Log Insights');
  console.log('3. Select your Lambda function log group');
  console.log('4. Start with "slowestPages" query');
  console.log('5. Check "highestCostPages" for cost optimization');
  console.log('6. Use "errorTracking" to monitor issues');
  console.log(`${'📊'.repeat(20)}\n`);
}

// Export queries for programmatic use
module.exports = { queries };

// Run if called directly
if (require.main === module) {
  printQueries();
}
