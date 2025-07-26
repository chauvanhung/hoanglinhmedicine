#!/bin/bash

# 🚀 Hoàng Linh Medicine - Deploy to Netlify
echo "🏥 Deploying to Netlify..."
echo "=========================="

# Build project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if .next directory exists
if [ ! -d ".next" ]; then
    echo "❌ .next directory not found!"
    exit 1
fi

echo "📦 Ready to deploy to Netlify!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to https://netlify.com"
echo "2. Create free account"
echo "3. Drag & drop the .next folder"
echo "4. Wait 2-3 minutes"
echo "5. Get your URL!"
echo ""
echo "🎉 Your app will be live at: https://random-name.netlify.app"
echo ""
echo "💡 Tips:"
echo "- You can rename the site later"
echo "- Add custom domain in settings"
echo "- Enable form handling for contact form"
echo "- Set up analytics" 