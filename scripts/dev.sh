#!/bin/bash

echo "🚀 Starting Hoang Linh Obesity Care Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first: npm install -g pnpm"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🐳 Starting Docker services (PostgreSQL, Redis)..."
docker-compose up -d postgres redis

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🗄️ Setting up database..."
cd apps/api
pnpm db:generate
pnpm db:migrate
pnpm db:seed
cd ../..

echo "🌐 Starting development servers..."
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:3001"
echo "📚 API Documentation will be available at: http://localhost:3001/api/docs"
echo "🗄️ Database will be available at: localhost:5432"
echo "🔴 Redis will be available at: localhost:6379"

# Start all services in parallel
pnpm dev &

# Wait for user to stop
echo ""
echo "✅ Development environment is running!"
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for interrupt
wait
