#!/bin/bash

# 🚀 Hoàng Linh Medicine - Deploy Script
# Sử dụng: ./deploy.sh [vercel|netlify|docker|vps]

echo "🏥 Hoàng Linh Medicine - Deploy Script"
echo "======================================"

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js 18+"
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm chưa được cài đặt"
    exit 1
fi

echo "✅ Node.js và npm đã sẵn sàng"

# Build project
echo "🔨 Đang build project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build thất bại"
    exit 1
fi

echo "✅ Build thành công"

# Deploy method
case $1 in
    "vercel")
        echo "🚀 Deploy lên Vercel..."
        
        # Kiểm tra Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "📦 Cài đặt Vercel CLI..."
            npm install -g vercel
        fi
        
        # Deploy
        vercel --prod
        ;;
        
    "netlify")
        echo "☁️ Deploy lên Netlify..."
        echo "📝 Vui lòng thực hiện thủ công:"
        echo "1. Tạo tài khoản Netlify"
        echo "2. Drag & drop thư mục .next"
        echo "3. Cấu hình build settings"
        ;;
        
    "docker")
        echo "🐳 Deploy với Docker..."
        
        # Kiểm tra Docker
        if ! command -v docker &> /dev/null; then
            echo "❌ Docker chưa được cài đặt"
            exit 1
        fi
        
        # Build Docker image
        echo "🔨 Đang build Docker image..."
        docker build -t hoanglinh-medicine .
        
        # Run container
        echo "🚀 Đang chạy container..."
        docker run -d -p 3000:3000 --name hoanglinh-medicine hoanglinh-medicine
        
        echo "✅ Deploy thành công! Truy cập: http://localhost:3000"
        ;;
        
    "vps")
        echo "🖥️ Deploy lên VPS..."
        echo "📝 Vui lòng thực hiện thủ công:"
        echo "1. Upload code lên VPS"
        echo "2. Cài đặt dependencies: npm install"
        echo "3. Build project: npm run build"
        echo "4. Chạy với PM2: pm2 start npm --name 'hoanglinh-medicine' -- start"
        ;;
        
    *)
        echo "❓ Cách sử dụng: ./deploy.sh [vercel|netlify|docker|vps]"
        echo ""
        echo "🌐 Vercel (Khuyến nghị):"
        echo "   ./deploy.sh vercel"
        echo ""
        echo "☁️ Netlify:"
        echo "   ./deploy.sh netlify"
        echo ""
        echo "🐳 Docker:"
        echo "   ./deploy.sh docker"
        echo ""
        echo "🖥️ VPS:"
        echo "   ./deploy.sh vps"
        ;;
esac

echo ""
echo "🎉 Hoàn thành!" 