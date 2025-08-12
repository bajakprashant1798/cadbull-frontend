# 🚀 Complete Amplify CloudWatch Setup Guide

## Step 1: Find Your Amplify App
1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/
2. Find your `cadbull-frontend` app
3. Note your app ID (it's in the URL)

## Step 2: Add Environment Variables
In your Amplify app console:

**Go to: App settings → Environment variables**

Add these variables:
```
   ```
   ENABLE_CLOUDWATCH_LOGS=true
   NEXT_PUBLIC_AWS_REGION=us-east-1
   LOG_LEVEL=info
   MONITOR_PERFORMANCE=true
   ```
TRACK_API_CALLS=true
TRACK_PAGE_LOADS=true
```

## Step 3: Find Your Lambda Function Name
Your Amplify app creates Lambda functions. To find them:

1. Go to AWS Lambda Console
2. Search for functions containing your app name
3. Function name format: `amplify-cadbull-frontend-main-xxxxxxxxx`
4. Note this name - you'll need it for CloudWatch

## Step 4: CloudWatch Log Groups
Your logs will appear in these locations:

### Automatic Lambda Logs:
- **Function logs**: `/aws/lambda/amplify-cadbull-frontend-main-xxxxxxxxx`
- **Build logs**: Available in Amplify Console

### Custom Logs (Optional - for advanced monitoring):
Create these in CloudWatch Console:
- `/aws/amplify/cadbull-frontend/performance`
- `/aws/amplify/cadbull-frontend/cost-tracking`

## Step 5: Deploy and Test
1. Deploy your app with the new environment variables
2. Wait for deployment to complete
3. Navigate to your homepage to trigger ISR
4. Check CloudWatch logs

## Step 6: View Your Logs

### In CloudWatch Console:
1. Go to: https://console.aws.amazon.com/cloudwatch/
2. Navigate to: Logs → Log groups
3. Find: `/aws/lambda/amplify-cadbull-frontend-main-xxxxxxxxx`
4. Click on the log group
5. Look for log streams (each request creates a new stream)

### What You'll See:
```
🧪 [AMPLIFY-LOG] About to call projects API
🌐 AMPLIFY-API: {"timestamp":"...","type":"API_CALL","endpoint":"getallprojects"...}
🧠 AMPLIFY-MEMORY: {"timestamp":"...","type":"MEMORY_USAGE","page":"Homepage"...}
💰 AMPLIFY-COST: {"timestamp":"...","type":"COST_METRICS","page":"Homepage"...}
🚀 AMPLIFY-PERFORMANCE: {"timestamp":"...","type":"PAGE_PERFORMANCE","page":"Homepage"...}
```

## Step 7: Use Log Insights for Analysis

### Go to: CloudWatch → Logs → Insights

### Select log group: `/aws/lambda/amplify-cadbull-frontend-main-xxxxxxxxx`

### Query 1: Most Expensive Pages
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /AMPLIFY-COST: (?<data>.*)/
| filter ispresent(data)
| parse data /"page":"(?<page>[^"]*)".*"totalCost":"(?<totalCost>[^"]*)/
| stats sum(totalCost), count() as requests by page
| sort sum(totalCost) desc
```

### Query 2: Slowest Pages
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-PERFORMANCE/
| parse @message /AMPLIFY-PERFORMANCE: (?<data>.*)/
| filter ispresent(data)
| parse data /"page":"(?<page>[^"]*)".*"totalTime":(?<totalTime>[^,}]*)/
| stats avg(totalTime), max(totalTime), count() by page
| sort avg(totalTime) desc
```

### Query 3: API Performance
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-API/
| parse @message /AMPLIFY-API: (?<data>.*)/
| filter ispresent(data)
| parse data /"endpoint":"(?<endpoint>[^"]*)".*"duration":(?<duration>[^,}]*)/
| stats avg(duration), max(duration), count() by endpoint
| sort avg(duration) desc
```

## Step 8: Set Up Cost Alerts

### Create CloudWatch Alarm:
1. Go to CloudWatch → Alarms
2. Create alarm
3. Metric: Custom metric from your logs
4. Condition: When cost exceeds threshold
5. Action: Send SNS notification

## Step 9: Monitor Your Costs

### Daily Monitoring:
Run this query to see daily costs:
```sql
fields @timestamp, @message
| filter @message like /AMPLIFY-COST/
| parse @message /AMPLIFY-COST: (?<data>.*)/
| filter ispresent(data)
| parse data /"estimatedCost":\{"totalCost":"(?<totalCost>[^"]*)/
| bin(@timestamp, 1d) as day
| stats sum(totalCost) as daily_cost by day
| sort day desc
```

## Troubleshooting

### If you don't see logs:
1. ✅ Check environment variables are set
2. ✅ Verify deployment completed successfully
3. ✅ Ensure you visited the homepage after deployment
4. ✅ Check the correct log group name
5. ✅ Wait 2-3 minutes for logs to appear

### If logs are missing data:
1. ✅ Verify Next.js config allows console.info/warn/error
2. ✅ Check for JavaScript errors in browser console
3. ✅ Ensure API calls are completing successfully

### Cost Monitoring Tips:
1. 🎯 Focus on pages with highest execution time
2. 💾 Monitor memory usage patterns
3. 🌐 Optimize slow API calls
4. 📊 Track ISR cache hit rates
5. ⚡ Identify performance bottlenecks

## Expected Results

After setup, you'll see:
- **Page Performance**: Which pages take longest to generate
- **API Performance**: Which API calls are slowest
- **Memory Usage**: Memory consumption per page
- **Cost Analysis**: Estimated AWS costs per page
- **Error Tracking**: Any issues during page generation

This gives you complete visibility into what's costing you money and where to optimize!
