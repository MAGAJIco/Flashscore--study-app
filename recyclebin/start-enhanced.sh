
#!/bin/bash

echo "🚀 Starting MagajiCo Enhanced Platform..."

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:8000 | xargs kill -9 2>/dev/null || true

sleep 2

echo "📦 Installing dependencies..."

# Install frontend dependencies
cd apps/frontend && pnpm install --no-frozen-lockfile &
FRONTEND_PID=$!

# Install backend dependencies  
cd ../../apps/backend && pnpm install --no-frozen-lockfile &
BACKEND_PID=$!

# Install ML dependencies
cd ../backend/ml && pip install -r requirements.txt &
ML_PID=$!

# Wait for installations
wait $FRONTEND_PID
wait $BACKEND_PID
wait $ML_PID

echo "🤖 Starting ML Service on port 8000..."
cd ../../apps/backend/ml && python main.py &
ML_SERVICE_PID=$!

sleep 3

echo "🔧 Starting Backend Service on port 3000..."
cd ../../../apps/backend && pnpm run dev &
BACKEND_SERVICE_PID=$!

sleep 5

echo "🌐 Starting Frontend Service on port 5000..." 
cd ../frontend && pnpm run dev &
FRONTEND_SERVICE_PID=$!

echo "✅ All services started successfully!"
echo "🌐 Frontend: http://0.0.0.0:5000"
echo "🔧 Backend: http://0.0.0.0:3000" 
echo "🤖 ML Service: http://0.0.0.0:8000"

# Function to handle script termination
cleanup() {
    echo "🛑 Shutting down services..."
    kill $ML_SERVICE_PID $BACKEND_SERVICE_PID $FRONTEND_SERVICE_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for all background processes
wait
