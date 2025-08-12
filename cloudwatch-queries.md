# CloudWatch Insights Queries for Performance Monitoring
# Use these queries in AWS CloudWatch → Logs → Insights

## 1. Most Expensive Pages by Processing Time
```
fields @timestamp, @message, @requestId
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message "PERFORMANCE-COMPLETE] * {*}"
| parse @message '"duration":"*ms"' as duration_str
| parse @message '"memoryUsed":"*MB"' as memory_str
| stats 
    count() as request_count,
    avg(tonumber(replace(duration_str, "ms", ""))) as avg_duration_ms,
    max(tonumber(replace(duration_str, "ms", ""))) as max_duration_ms,
    avg(tonumber(replace(memory_str, "MB", ""))) as avg_memory_mb
    by bin(5m)
| sort @timestamp desc
```

## 2. Slowest Individual Page Requests
```
fields @timestamp, @message, @requestId
| filter @message like /PERFORMANCE-COMPLETE/
| parse @message '"duration":"*ms"' as duration_str
| parse @message "PERFORMANCE-COMPLETE] *" as page_name
| filter tonumber(replace(duration_str, "ms", "")) > 1000
| sort tonumber(replace(duration_str, "ms", "")) desc
| limit 50
```

## 3. API Performance Analysis
```
fields @timestamp, @message, @requestId
| filter @message like /API-SUCCESS/ or @message like /API-ERROR/
| parse @message '"duration":"*ms"' as duration_str
| parse @message /API-(?<status>\w+)\] (?<api_name>[^{]+)/
| stats 
    count() as calls,
    avg(tonumber(replace(duration_str, "ms", ""))) as avg_ms,
    max(tonumber(replace(duration_str, "ms", ""))) as max_ms
    by api_name, status
| sort avg_ms desc
```

## 4. Database Query Performance
```
fields @timestamp, @message, @requestId
| filter @message like /DB-SUCCESS/ or @message like /DB-ERROR/
| parse @message '"duration":"*ms"' as duration_str
| parse @message /DB-(?<status>\w+)\] (?<query_name>[^{]+)/
| stats 
    count() as queries,
    avg(tonumber(replace(duration_str, "ms", ""))) as avg_ms,
    max(tonumber(replace(duration_str, "ms", ""))) as max_ms
    by query_name, status
| sort avg_ms desc
```

## 5. Memory Usage Analysis
```
fields @timestamp, @message, @requestId
| filter @message like /MEMORY-USAGE/
| parse @message '"heapUsed":"*MB"' as heap_used
| parse @message '"rss":"*MB"' as rss_used
| stats 
    avg(tonumber(replace(heap_used, "MB", ""))) as avg_heap_mb,
    max(tonumber(replace(heap_used, "MB", ""))) as max_heap_mb,
    avg(tonumber(replace(rss_used, "MB", ""))) as avg_rss_mb
    by bin(5m)
| sort @timestamp desc
```

## 6. Cost Analysis by Page
```
fields @timestamp, @message, @requestId
| filter @message like /COST-EVENT/
| parse @message '"estimatedCost":"$*"' as cost_str
| parse @message /COST-EVENT\] (?<event_type>[^{]+)/
| stats 
    count() as events,
    sum(tonumber(replace(cost_str, "$", ""))) as total_cost,
    avg(tonumber(replace(cost_str, "$", ""))) as avg_cost
    by event_type
| sort total_cost desc
```

## 7. Error Tracking
```
fields @timestamp, @message, @requestId
| filter @message like /ERROR/ or @message like /ALERT/
| parse @message /(?<error_type>SLOW-PAGE-ALERT|HIGH-MEMORY-ALERT|API-ERROR|DB-ERROR|PERFORMANCE-ERROR)/
| stats count() as error_count by error_type, bin(1h)
| sort @timestamp desc
```

## 8. Performance Summary Dashboard
```
fields @timestamp, @message, @requestId
| filter @message like /PERFORMANCE-SUMMARY/
| parse @message '"totalDuration":"*ms"' as total_duration
| parse @message '"estimatedCost":"$*"' as estimated_cost
| parse @message /PERFORMANCE-SUMMARY\] (?<page_name>[^{]+)/
| stats 
    count() as generations,
    avg(tonumber(replace(total_duration, "ms", ""))) as avg_duration_ms,
    sum(tonumber(replace(estimated_cost, "$", ""))) as total_cost,
    max(tonumber(replace(total_duration, "ms", ""))) as slowest_generation
    by page_name
| sort total_cost desc
```

## How to Use These Queries:

1. **Go to AWS CloudWatch Console**
2. **Navigate to**: Logs → Insights
3. **Select your Log Group**: `/aws/lambda/your-nextjs-app`
4. **Copy and paste** any query above
5. **Set time range** (e.g., Last 24 hours)
6. **Click "Run query"**

## Key Metrics to Monitor:

### 🚨 Performance Alerts:
- Pages taking > 2 seconds
- API calls taking > 1 second  
- Database queries taking > 500ms
- Memory usage > 200MB

### 💰 Cost Optimization:
- Most expensive pages by total cost
- Pages with highest request frequency
- Memory allocation vs actual usage

### 🎯 Optimization Targets:
- Focus on pages with highest `total_cost`
- Optimize APIs with `avg_ms > 500`
- Reduce memory for functions using `< 200MB`
