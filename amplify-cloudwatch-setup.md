# 🔍 AWS Amplify CloudWatch Logging Setup Guide

## Problem: Missing Logs in Production
Your `next.config.js` has `removeConsole: true` in production, which removes all console.log statements.

## Solution: Proper CloudWatch Integration

### 1. Update Environment Variables in Amplify Console

Go to your Amplify app → Environment variables and add:

```
# CloudWatch Logging
ENABLE_CLOUDWATCH_LOGS=true
NEXT_PUBLIC_AWS_REGION=us-east-1
LOG_LEVEL=info

# Performance Monitoring
MONITOR_PERFORMANCE=true
TRACK_API_CALLS=true
TRACK_PAGE_LOADS=true
```

### 2. Create CloudWatch Log Groups

In AWS CloudWatch Console:
1. Go to Logs → Log groups
2. Create log group: `/aws/amplify/cadbull-frontend/performance`
3. Create log group: `/aws/amplify/cadbull-frontend/api-calls`
4. Create log group: `/aws/amplify/cadbull-frontend/page-loads`

### 3. Update IAM Role for Amplify

Your Amplify service role needs CloudWatch permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"
            ],
            "Resource": "arn:aws:logs:*:*:log-group:/aws/amplify/cadbull-frontend/*"
        }
    ]
}
```

### 4. Enable Function Logging

In your Amplify console:
1. Go to Function → Settings
2. Enable "Function Logs"
3. Set log retention to 7 days (cost-effective)

## Cost Monitoring Queries

### Most Expensive Pages (by compute time)
```
fields @timestamp, page, computeTime, memoryUsed
| filter @message like /PERFORMANCE-COMPLETE/
| sort computeTime desc
| limit 20
```

### API Call Performance
```
fields @timestamp, endpoint, duration, status
| filter @message like /API-SUCCESS/ or @message like /API-ERROR/
| stats avg(duration), count() by endpoint
| sort avg(duration) desc
```

### Memory Usage Tracking
```
fields @timestamp, page, heapUsed, rss
| filter @message like /MEMORY-USAGE/
| stats avg(heapUsed), max(heapUsed) by page
| sort avg(heapUsed) desc
```

### ISR Cache Performance
```
fields @timestamp, page, isrTime, cacheHit
| filter @message like /ISR-PERFORMANCE/
| stats avg(isrTime), count() by page, cacheHit
```

## Amplify Function Logs Location

Your logs will appear in:
- **Function logs**: `/aws/lambda/amplify-cadbull-frontend-main-xxxxxxxxx`
- **Build logs**: Available in Amplify Console → Build history
- **Performance logs**: Custom CloudWatch groups (after implementation)

## How to Find Your Amplify Function Name

1. Go to AWS Lambda Console
2. Search for functions containing "amplify" and "cadbull"
3. Your function name will be like: `amplify-cadbull-frontend-main-xxxxxxxxx`

## Enable Real-time Monitoring

1. **CloudWatch Dashboard**: Create custom dashboard for real-time metrics
2. **CloudWatch Alarms**: Set alerts for high memory usage or slow responses
3. **Log Insights**: Use the queries above to analyze performance patterns

## Cost Optimization Tips

1. **Log Retention**: Set to 7 days for development, 1 day for testing
2. **Selective Logging**: Only log performance-critical pages
3. **Batch Logging**: Group multiple events before sending to CloudWatch
4. **Conditional Logging**: Enable detailed logging only when needed

## Next Steps

1. Apply the environment variables
2. Deploy your app
3. Check CloudWatch logs after deployment
4. Use Log Insights queries to analyze performance
5. Set up dashboards for ongoing monitoring
