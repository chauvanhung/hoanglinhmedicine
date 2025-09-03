#!/bin/bash

# Build script for web app on Render
echo "🚀 Starting web app build process..."

# Navigate to web app directory
cd apps/web

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building Next.js app..."
npm run build

echo "✅ Build completed successfully!"
