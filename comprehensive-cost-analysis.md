# 📊 Comprehensive Page Cost Analysis Queries

Now that we have Amplify CloudWatch logging on all major pages, use these queries to compare costs:

## 🔍 CloudWatch Log Insights Queries

### 1. **Overall Page Cost Comparison**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"totalCost":"(?<totalCost>[^"]*)".*"computeTime":(?<computeTime>[0-9]+)/
| stats count() as requests, avg(totalCost) as avgCost, avg(computeTime) as avgTime by page
| sort avgCost desc
```

### 2. **Most Expensive Pages by Total Daily Cost**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"totalCost":"(?<totalCost>[^"]*)/
| bin(@timestamp, 1d) as day
| stats count() as dailyRequests, sum(totalCost) as dailyCost by day, page
| sort dailyCost desc
| limit 20
```

### 3. **Memory Usage Comparison**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"memoryUsed":(?<memoryUsed>[0-9.]+)/
| stats avg(memoryUsed) as avgMemoryMB, max(memoryUsed) as maxMemoryMB, count() as requests by page
| sort avgMemoryMB desc
```

### 4. **Performance vs Cost Analysis**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"computeTime":(?<computeTime>[0-9]+).*"totalCost":"(?<totalCost>[^"]*)/
| stats avg(computeTime) as avgTime, avg(totalCost) as avgCost, count() as requests by page
| extend efficiency = avgTime / avgCost
| sort efficiency desc
```

### 5. **API Calls Efficiency**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"apiCalls":(?<apiCalls>[0-9]+).*"computeTime":(?<computeTime>[0-9]+)/
| stats avg(computeTime) as avgTime, avg(apiCalls) as avgAPICalls by page
| extend timePerAPI = avgTime / avgAPICalls
| sort timePerAPI desc
```

### 6. **Hourly Cost Breakdown by Page**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"totalCost":"(?<totalCost>[^"]*)/
| bin(@timestamp, 1h) as hour
| stats sum(totalCost) as hourlyCost, count() as requests by hour, page
| sort hour desc, hourlyCost desc
| limit 50
```

### 7. **ISR vs SSR Cost Comparison**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-PERFORMANCE/
| parse @message /"page":"(?<page>[^"]*)".*"renderMode":"(?<renderMode>[^"]*)".*"totalTime":(?<totalTime>[0-9]+)/
| stats avg(totalTime) as avgTime, count() as requests by page, renderMode
| sort avgTime desc
```

### 8. **Data Transfer Size Analysis**
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /"page":"(?<page>[^"]*)".*"dataSize":(?<dataSize>[0-9.]+)/
| stats avg(dataSize) as avgDataKB, max(dataSize) as maxDataKB by page
| sort avgDataKB desc
```

## 📊 Expected Results Analysis

Based on current Homepage data, here's what to expect:

| Page Type | Expected Avg Cost | Expected Time | Memory Usage | Traffic Impact |
|-----------|------------------|---------------|--------------|----------------|
| **Homepage** | $0.00000003 | ~140ms | ~46MB | High (40%) |
| **CategoryDetail** | $0.00000004-6 | ~200ms | ~60MB | High (30%) |
| **ProjectDetail** | $0.00000005-8 | ~300ms | ~70MB | High (25%) |
| **Profile** | $0.00000002-3 | ~100ms | ~35MB | Low (3%) |
| **Search** | $0.00000004-7 | ~250ms | ~65MB | Medium (2%) |

## 🎯 Optimization Targets

### **Priority 1: ProjectDetail Pages**
- **Why**: SSR mode = highest cost per request
- **Target**: Reduce compute time by 30% (300ms → 210ms)
- **Methods**: Cache similar projects, optimize API calls

### **Priority 2: CategoryDetail Pages**  
- **Why**: High traffic + complex data
- **Target**: Improve ISR cache hit rate
- **Methods**: Optimize revalidation timing

### **Priority 3: Search Pages**
- **Why**: SSR mode with variable data
- **Target**: Implement result caching
- **Methods**: Cache common search terms

## 📈 Cost Projection Formula

```
Daily Cost = (Page Views × Avg Cost per Request)
Monthly Cost = Daily Cost × 30

Example:
- Homepage: 1000 views × $0.00000003 = $0.03/day = $0.90/month
- CategoryDetail: 500 views × $0.00000005 = $0.025/day = $0.75/month  
- ProjectDetail: 300 views × $0.00000007 = $0.021/day = $0.63/month
- TOTAL: ~$2.28/month for 1800 daily page views
```

## 🔄 Next Steps

1. **Deploy** the updated pages with Amplify logging
2. **Wait 24-48 hours** for data collection
3. **Run queries** to get actual cost comparison
4. **Identify** the most expensive page types
5. **Focus optimization** on highest-cost pages
6. **Monitor** cost reduction after optimizations

The monitoring system will now give you complete visibility into which pages are driving your AWS costs!
