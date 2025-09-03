# 🚀 Hướng dẫn Deploy lên Render

## 📋 Tổng quan
Ứng dụng Hoang Linh Medicine được thiết kế để deploy trên Render với 2 services:
- **Web Frontend**: Next.js app
- **API Backend**: NestJS app

## 🔧 Cấu hình cần thiết

### 1. Firebase Configuration
Tạo file `.env.local` trong thư mục `apps/web/`:

```bash
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

### 2. API Configuration
Tạo file `.env` trong thư mục `apps/api/`:

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/hoanglinhmedicine

# JWT
JWT_SECRET=your_jwt_secret_here

# Environment
NODE_ENV=production
PORT=3001
```

## 🚀 Deploy trên Render

### Bước 1: Tạo Repository
1. Push code lên GitHub repository
2. Kết nối repository với Render

### Bước 2: Tạo Database
1. Tạo PostgreSQL database trên Render
2. Lưu connection string

### Bước 3: Deploy Web Frontend
1. Tạo new Web Service
2. Cấu hình:
   - **Build Command**: `cd apps/web && npm install && npm run build`
   - **Start Command**: `cd apps/web && npm start`
   - **Environment Variables**: Thêm tất cả Firebase config
   - **Health Check Path**: `/`

### Bước 4: Deploy API Backend
1. Tạo new Web Service
2. Cấu hình:
   - **Build Command**: `cd apps/api && npm install && npm run build`
   - **Start Command**: `cd apps/api && npm run start:prod`
   - **Environment Variables**: 
     - `DATABASE_URL`: Connection string từ PostgreSQL
     - `JWT_SECRET`: Random secret key
     - `PORT`: 3001
   - **Health Check Path**: `/health`

## 🔄 Auto Deploy
- Repository được cấu hình để auto deploy khi có push vào branch `main`
- Mỗi service sẽ tự động build và deploy

## 📊 Monitoring
- Health checks được cấu hình cho cả 2 services
- Logs có thể xem trực tiếp trên Render dashboard

## 🛠️ Troubleshooting

### Lỗi Build
- Kiểm tra Node.js version (khuyến nghị 18.x)
- Đảm bảo tất cả dependencies được install đúng

### Lỗi Database
- Kiểm tra DATABASE_URL format
- Đảm bảo database đã được tạo và accessible

### Lỗi Firebase
- Kiểm tra tất cả Firebase environment variables
- Đảm bảo Firebase project đã được cấu hình đúng

## 🛠️ Quick Setup

### Development
```bash
# Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh

# Windows
scripts\setup.bat
```

### Production (Render)
1. Fork/clone repository
2. Import `render.yaml` vào Render dashboard
3. Cấu hình Environment Variables
4. Deploy!

## 📁 File Structure
```
hoanglinhmedicine/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # NestJS backend
├── scripts/
│   ├── setup.sh      # Linux/Mac setup
│   └── setup.bat     # Windows setup
├── render.yaml       # Render configuration
├── DEPLOYMENT.md     # This file
└── package.json      # Root package
```

## 🔄 CI/CD Pipeline
- **Auto Deploy**: Push to `main` branch
- **Build Cache**: Optimized for faster builds
- **Health Checks**: Automatic service monitoring
- **Rollback**: Easy rollback on failed deployments

## 📊 Performance Optimization
- **Static Generation**: Next.js SSG for better performance
- **CDN**: Automatic CDN distribution
- **Compression**: Gzip compression enabled
- **Caching**: Optimized caching strategies

## 📝 Notes
- File `render.yaml` đã được tạo sẵn để cấu hình tự động
- File `.renderignore` tối ưu quá trình build
- Scripts setup tự động cho development
- Tất cả sensitive data nên được lưu trong Environment Variables