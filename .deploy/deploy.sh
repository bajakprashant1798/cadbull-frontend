#!/bin/sh
# POSIX script for Plesk deploy actions

# Use the newest Plesk Node on this server (22 or 24)
NODEBIN="$(ls -d /opt/plesk/node/*/bin 2>/dev/null | sort -V | tail -1)"
[ -n "$NODEBIN" ] && PATH="$NODEBIN:$PATH" && export PATH

# More memory for Next.js/builds
export NODE_OPTIONS="--max-old-space-size=4096"

# Plesk sets this to your Server path (/httpdocs)
cd "$DEPLOYMENT_PATH" || exit 1

# Log versions into the deploy popup
node -v
npm -v

# Install + build
npm ci
npm run build

# Restart Passenger/Node app
mkdir -p tmp
touch tmp/restart.txt
