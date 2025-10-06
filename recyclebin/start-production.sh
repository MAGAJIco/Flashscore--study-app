#!/bin/bash

# Production startup script for Replit deployment
set -e

echo "🚀 Starting Production Deployment..."

# Validate environment
if [ "$NODE_ENV" != "production" ]; then
  echo "⚠️ Warning: NODE_ENV is not set to production"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd apps/backend
npm ci --only=production

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm ci --only=production
echo "🔨 Building frontend..."
npm run build

# Start services
echo "🌐 Starting production servers..."
echo "Backend starting on port 8000..."
cd ../backend
npm start &
BACKEND_PID=$!

echo "Frontend starting on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

# Health check
sleep 10
echo "🏥 Running health checks..."

# Check backend
if curl -f http://0.0.0.0:8000/api/health > /dev/null 2>&1; then
  echo "✅ Backend health check passed"
else
  echo "❌ Backend health check failed"
fi

# Check frontend
if curl -f http://0.0.0.0:3000 > /dev/null 2>&1; then
  echo "✅ Frontend health check passed"
else
  echo "❌ Frontend health check failed"
fi

echo "🎉 Production deployment complete!"
echo "Backend: http://0.0.0.0:8000"
echo "Frontend: http://0.0.0.0:3000"

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID