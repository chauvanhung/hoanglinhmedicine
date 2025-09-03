@echo off
echo 🚀 Setting up Hoang Linh Medicine Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install web app dependencies
echo 📦 Installing web app dependencies...
cd apps\web
npm install
if errorlevel 1 (
    echo ❌ Failed to install web dependencies
    pause
    exit /b 1
)
cd ..\..

REM Install API dependencies
echo 📦 Installing API dependencies...
cd apps\api
npm install
if errorlevel 1 (
    echo ❌ Failed to install API dependencies
    pause
    exit /b 1
)
cd ..\..

REM Create environment files if they don't exist
echo 🔧 Setting up environment files...

REM Web .env.local
if not exist "apps\web\.env.local" (
    echo 📝 Creating apps\web\.env.local template...
    (
        echo # Firebase Configuration
        echo NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY
        echo NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hoanglinh-obesity-care.firebaseapp.com
        echo NEXT_PUBLIC_FIREBASE_PROJECT_ID=hoanglinh-obesity-care
        echo NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hoanglinh-obesity-care.firebasestorage.app
        echo NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=860032582221
        echo NEXT_PUBLIC_FIREBASE_APP_ID=1:860032582221:web:e3c5923cbe504725d91204
        echo NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-T9Z1DMXE8P
    ) > apps\web\.env.local
    echo ⚠️  Please update apps\web\.env.local with your Firebase configuration
)

REM API .env
if not exist "apps\api\.env" (
    echo 📝 Creating apps\api\.env template...
    (
        echo # Firebase Configuration (same as web app)
        echo FIREBASE_API_KEY=AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY
        echo FIREBASE_AUTH_DOMAIN=hoanglinh-obesity-care.firebaseapp.com
        echo FIREBASE_PROJECT_ID=hoanglinh-obesity-care
        echo FIREBASE_STORAGE_BUCKET=hoanglinh-obesity-care.firebasestorage.app
        echo FIREBASE_MESSAGING_SENDER_ID=860032582221
        echo FIREBASE_APP_ID=1:860032582221:web:e3c5923cbe504725d91204
        echo FIREBASE_MEASUREMENT_ID=G-T9Z1DMXE8P
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your_jwt_secret_here
        echo.
        echo # Environment
        echo NODE_ENV=development
        echo PORT=3001
    ) > apps\api\.env
    echo ⚠️  Please update apps\api\.env with your Firebase and JWT configuration
)

echo.
echo ✅ Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Update apps\web\.env.local with your Firebase configuration
echo 2. Update apps\api\.env with your Firebase configuration
echo 3. Run 'npm run dev' to start the development server
echo.
echo 🚀 Happy coding!
pause
