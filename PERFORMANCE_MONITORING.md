# 📊 Performance Monitoring for EC2 Deployment

## Overview
We've set up comprehensive performance logging to diagnose the Chrome loading delays. The logs are now sent to a backend endpoint and stored in your server logs.

## 🔍 How to View Logs on Your EC2 Server

### Option 1: Using PM2 (Recommended)
```bash
# View all PM2 processes
pm2 list

# View logs for your Next.js app (real-time)
pm2 logs cadbull-frontend --lines 100

# Filter for performance logs only
pm2 logs cadbull-frontend --lines 1000 | grep "FRONTEND-LOG"
```

### Option 2: Using the Log Viewer Script
```bash
# Make the script executable
chmod +x view-performance-logs.sh

# Run the script
./view-performance-logs.sh
```

### Option 3: Direct Log Files
```bash
# If using systemd service
sudo journalctl -u your-nextjs-service -f

# If using custom log files
tail -f /var/log/nextjs/app.log | grep "FRONTEND-LOG"
```

## 📋 Log Types to Look For

### 1. Performance Logs
```
[FRONTEND-LOG] {"type":"PERFORMANCE","page":"homepage","finalLoadTime":1534,...}
```

### 2. Chrome-Specific Logs
```
[FRONTEND-LOG] {"type":"CHROME_PERFORMANCE","isChrome":true,"navigationStart":123,...}
```

### 3. API Call Logs
```
[FRONTEND-LOG] {"type":"API_CALL","endpoint":"/projects","duration":45,...}
```

### 4. Page Event Logs
```
[FRONTEND-LOG] {"type":"PAGE_EVENT","page":"homepage","event":"COMPONENT_RENDER_START",...}
```

## 🔍 What to Look For in Live Site

1. **Navigation Start Time**: Should be reasonable
2. **DOM Content Loaded**: Should be under 2 seconds
3. **API Call Duration**: Should be under 500ms
4. **Chrome vs Other Browsers**: Compare timing differences
5. **Final Load Time**: Look for values over 90 seconds (1.5 minutes)

## ⚡ Quick Commands

```bash
# Monitor logs in real-time
pm2 logs cadbull-frontend | grep "CHROME-PERF"

# Search for slow performance (over 10 seconds)
pm2 logs cadbull-frontend --lines 1000 | grep "finalLoadTime" | grep -E "[0-9]{5,}"

# Check API response times
pm2 logs cadbull-frontend --lines 1000 | grep "API_CALL" | grep "duration"

# Look for errors
pm2 logs cadbull-frontend --lines 1000 | grep "ERROR"
```

## 📊 Performance Thresholds

- **Good**: DOM load < 2s, APIs < 500ms, Total load < 5s
- **Warning**: DOM load 2-5s, APIs 500ms-2s, Total load 5-15s  
- **Critical**: DOM load > 5s, APIs > 2s, Total load > 15s
- **Emergency**: Total load > 90s (1.5 minutes)

## 🚨 If You See the 1.5 Minute Delay

Look for these patterns in the logs:
1. Normal API times (< 500ms) but high final load time
2. Large gaps between navigation start and DOM loaded
3. Chrome-specific issues vs other browsers
4. External resource loading delays

The logs will help identify if the delay is:
- DNS resolution
- External scripts (GTM, Facebook Pixel, etc.)
- Chrome-specific network issues  
- Server-side processing
- Client-side JavaScript execution
