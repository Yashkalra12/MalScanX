#!/bin/bash

# MalScanX Development Startup Script

echo "🚀 Starting MalScanX Development Environment..."

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  Warning: MongoDB doesn't seem to be running on localhost:27017"
    echo "   Please start MongoDB or update your connection string in server/.env"
    echo "   You can install MongoDB locally or use MongoDB Atlas"
fi

# Start server in background
echo "🔧 Starting server..."
cd server
npm run dev &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client in background
echo "🎨 Starting client..."
cd ../client
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ MalScanX is starting up!"
echo "📱 Client: http://localhost:5173"
echo "🔧 Server: http://localhost:3001"
echo "📊 Health Check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 