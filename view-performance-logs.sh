#!/bin/bash

# 📊 Log Viewer Script for EC2 Performance Monitoring
# Save this as view-performance-logs.sh and run with: bash view-performance-logs.sh

echo "🔍 Cadbull Performance Log Viewer"
echo "================================="
echo ""

# Check if PM2 is being used
if command -v pm2 &> /dev/null; then
    echo "📋 PM2 detected. Available PM2 processes:"
    pm2 list
    echo ""
    
    read -p "Enter PM2 process name/id (or press Enter for 'cadbull-frontend'): " pm2_name
    if [ -z "$pm2_name" ]; then
        pm2_name="cadbull-frontend"
    fi
    
    echo "📊 Showing performance logs for PM2 process: $pm2_name"
    echo "Use Ctrl+C to exit"
    echo ""
    
    # Filter for frontend performance logs
    pm2 logs $pm2_name --lines 1000 | grep -E "\[FRONTEND-LOG\]|\[PERFORMANCE\]|\[CHROME-PERF\]|\[API\]|\[PAGE_EVENT\]" --color=always
    
elif [ -f "/var/log/nextjs/app.log" ]; then
    echo "📁 Using Next.js log file: /var/log/nextjs/app.log"
    echo ""
    
    # Filter for frontend performance logs
    tail -f /var/log/nextjs/app.log | grep -E "\[FRONTEND-LOG\]|\[PERFORMANCE\]|\[CHROME-PERF\]|\[API\]|\[PAGE_EVENT\]" --color=always
    
else
    echo "⚠️  No PM2 or standard log file found."
    echo ""
    echo "📋 Available options:"
    echo "1. Check PM2 logs: pm2 logs"
    echo "2. Check system logs: sudo journalctl -u your-app-service -f"
    echo "3. Check custom log location"
    echo ""
    echo "🔍 Search for performance logs manually:"
    echo "grep -r 'FRONTEND-LOG' /var/log/"
    echo "grep -r 'PERFORMANCE' /var/log/"
fi
