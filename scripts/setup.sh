#!/bin/bash

# Setup script for Hoang Linh Medicine Application
echo "🚀 Setting up Hoang Linh Medicine Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install web app dependencies
echo "📦 Installing web app dependencies..."
cd apps/web
npm install
cd ../..

# Install API dependencies
echo "📦 Installing API dependencies..."
cd apps/api
npm install
cd ../..

# Create environment files if they don't exist
echo "🔧 Setting up environment files..."

# Web .env.local
if [ ! -f "apps/web/.env.local" ]; then
    echo "📝 Creating apps/web/.env.local template..."
    cat > apps/web/.env.local << EOF
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EOF
    echo "⚠️  Please update apps/web/.env.local with your Firebase configuration"
fi

# API .env
if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating apps/api/.env template..."
    cat > apps/api/.env << EOF
# Firebase Configuration (same as web app)
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Environment
NODE_ENV=development
PORT=3001
EOF
    echo "⚠️  Please update apps/api/.env with your Firebase and JWT configuration"
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update apps/web/.env.local with your Firebase configuration"
echo "2. Update apps/api/.env with your Firebase configuration"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "🚀 Happy coding!"
