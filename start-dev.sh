#!/bin/bash

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend in background
cd "$SCRIPT_DIR/apps/backend" && pnpm dev &
BACKEND_PID=$!

# Give backend a moment to start
sleep 2

# Start frontend in foreground
cd "$SCRIPT_DIR/apps/frontend" && pnpm dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
