# 🚀 Hướng dẫn Deploy lên Render

## 📋 Yêu cầu trước khi deploy

1. **Tài khoản Render** - Đăng ký tại [render.com](https://render.com)
2. **Git Repository** - Code đã được push lên GitHub/GitLab
3. **Environment Variables** - Chuẩn bị các biến môi trường

## 🔧 Bước 1: Chuẩn bị Repository

### Cấu trúc thư mục:
```
hoanglinhmedicine/
├── apps/
│   ├── web/          # Next.js Frontend
│   └── api/          # NestJS Backend
├── packages/
│   └── shared/       # Shared packages
├── render.yaml        # Render configuration
├── Dockerfile         # Docker configuration
└── .dockerignore      # Docker ignore file
```

## 🌐 Bước 2: Deploy lên Render

### 2.1. Tạo Web Service (Frontend)
1. Vào [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect với GitHub repository
4. Cấu hình:
   - **Name**: `hoanglinh-web`
   - **Environment**: `Node`
   - **Build Command**: `cd apps/web && npm install && npm run build`
   - **Start Command**: `cd apps/web && npm start`
   - **Plan**: Free

### 2.2. Tạo Web Service (Backend)
1. Click "New +" → "Web Service"
2. Cấu hình:
   - **Name**: `hoanglinh-api`
   - **Environment**: `Node`
   - **Build Command**: `cd apps/api && npm install && npm run build`
   - **Start Command**: `cd apps/api && npm run start:prod`
   - **Plan**: Free

### 2.3. Tạo PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Cấu hình:
   - **Name**: `hoanglinh-db`
   - **Database**: `hoanglinh_obesity`
   - **User**: `hoanglinh_user`
   - **Plan**: Free

### 2.4. Tạo Redis Database
1. Click "New +" → "Redis"
2. Cấu hình:
   - **Name**: `hoanglinh-redis`
   - **Plan**: Free

## 🔑 Bước 3: Cấu hình Environment Variables

### Frontend (hoanglinh-web):
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://hoanglinh-api.onrender.com
```

### Backend (hoanglinh-api):
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key
REDIS_URL=redis://username:password@host:port
```

## 📊 Bước 4: Kiểm tra Deployment

### Health Check URLs:
- **Frontend**: `https://hoanglinh-web.onrender.com`
- **Backend**: `https://hoanglinh-api.onrender.com/health`
- **API Docs**: `https://hoanglinh-api.onrender.com/api`

## 🚨 Troubleshooting

### Lỗi thường gặp:

1. **Build Failed**:
   - Kiểm tra `package.json` scripts
   - Kiểm tra dependencies
   - Kiểm tra Node.js version

2. **Database Connection Error**:
   - Kiểm tra `DATABASE_URL`
   - Kiểm tra database credentials
   - Kiểm tra network access

3. **Port Binding Error**:
   - Đảm bảo app sử dụng `process.env.PORT`
   - Kiểm tra start command

4. **Memory Issues**:
   - Upgrade lên plan cao hơn
   - Tối ưu build process
   - Sử dụng production build

## 🔄 Auto-deploy

- Mỗi khi push code lên `main` branch
- Render sẽ tự động build và deploy
- Có thể cấu hình branch khác

## 📱 Kiểm tra ứng dụng

1. **Frontend**: Mở URL frontend trong browser
2. **API**: Test endpoint `/health`
3. **Database**: Kiểm tra kết nối database
4. **Logs**: Xem logs trong Render dashboard

## 💰 Chi phí

- **Free Plan**: $0/tháng (có giới hạn)
- **Starter Plan**: $7/tháng
- **Standard Plan**: $25/tháng

## 📞 Hỗ trợ

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [Render Status](https://status.render.com)
