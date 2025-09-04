# Hướng dẫn Deploy lên Render

## 🚀 Cách Deploy

### 1. **Chuẩn bị Repository**
- Đảm bảo code đã được push lên GitHub
- Branch `main` chứa code mới nhất

### 2. **Tạo Services trên Render**

#### **Web Frontend (Next.js)**
1. Vào [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Cấu hình:
   - **Name**: `hoanglinhmedicine-web`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd apps/web && npm ci && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd apps/web && npm start
     ```
   - **Plan**: `Starter` (Free)

#### **API Backend (NestJS)**
1. Tạo service thứ 2
2. Cấu hình:
   - **Name**: `hoanglinhmedicine-api`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     cd apps/api && npm ci && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd apps/api && npm run start:prod
     ```
   - **Plan**: `Starter` (Free)

### 3. **Environment Variables**

#### **Web Service**
```
NODE_ENV=production
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hoanglinh-obesity-care.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hoanglinh-obesity-care
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hoanglinh-obesity-care.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=860032582221
NEXT_PUBLIC_FIREBASE_APP_ID=1:860032582221:web:e3c5923cbe504725d91204
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-T9Z1DMXE8P
PORT=3000
```

#### **API Service**
```
NODE_ENV=production
FIREBASE_API_KEY=AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY
FIREBASE_AUTH_DOMAIN=hoanglinh-obesity-care.firebaseapp.com
FIREBASE_PROJECT_ID=hoanglinh-obesity-care
FIREBASE_STORAGE_BUCKET=hoanglinh-obesity-care.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=860032582221
FIREBASE_APP_ID=1:860032582221:web:e3c5923cbe504725d91204
FIREBASE_MEASUREMENT_ID=G-T9Z1DMXE8P
JWT_SECRET=your-secure-jwt-secret
PORT=3001
```

### 4. **Auto Deploy**
- ✅ **Auto Deploy**: Bật
- ✅ **Branch**: `main`
- ✅ **Health Check**: `/` (web), `/health` (api)

## 📁 Files đã chuẩn bị

### ✅ **render.yaml**
- File config chính cho Render
- Chứa cấu hình cho cả 2 services
- Auto-deploy từ branch main

### ✅ **Dockerfile** (apps/web/)
- Tối ưu cho monorepo structure
- Multi-stage build
- Production ready

### ✅ **next.config.js**
- Output standalone
- Firebase compatibility
- Build optimizations

### ✅ **.dockerignore**
- Loại bỏ files không cần thiết
- Tối ưu build time

## 🔧 Troubleshooting

### **Build Errors**
- Kiểm tra Node.js version (18+)
- Đảm bảo `package.json` có đúng scripts
- Check environment variables

### **Runtime Errors**
- Kiểm tra Firebase config
- Verify PORT environment variable
- Check logs trong Render dashboard

### **Performance**
- Sử dụng `npm ci` thay vì `npm install`
- Enable caching trong Render
- Monitor memory usage

## 🌐 URLs sau khi deploy

- **Web App**: `https://hoanglinhmedicine-web.onrender.com`
- **API**: `https://hoanglinhmedicine-api.onrender.com`

## 📊 Monitoring

- **Logs**: Render Dashboard → Service → Logs
- **Metrics**: CPU, Memory, Response time
- **Health Checks**: Automatic monitoring

---

**Lưu ý**: Render free tier có thể sleep sau 15 phút không hoạt động. Upgrade lên paid plan để tránh cold start.
