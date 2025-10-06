#!/bin/bash

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Start backend in background
cd "$SCRIPT_DIR/apps/backend" && pnpm dev &
BACKEND_PID=$!

# Start ML FastAPI service in background
cd "$SCRIPT_DIR/apps/backend/ml" && python main.py &
ML_PID=$!

# Give services a moment to start
sleep 3

# Start frontend in foreground
cd "$SCRIPT_DIR/apps/frontend" && pnpm dev

# Cleanup on exit
trap "kill $BACKEND_PID $ML_PID 2>/dev/null" EXIT
