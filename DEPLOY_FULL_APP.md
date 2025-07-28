# 🚀 Deploy Toàn Bộ Ứng Dụng Next.js - Hoàng Linh Medicine

## ⚠️ Vấn đề hiện tại:
- Localhost: Ứng dụng Next.js hoàn chỉnh ✅
- Deploy: Chỉ có trang HTML đơn giản ❌

## 🎯 **Giải pháp: Deploy toàn bộ ứng dụng Next.js**

### **Phương pháp 1: Vercel (Khuyến nghị)**

#### Bước 1: Chuẩn bị
```bash
# Đảm bảo code sạch
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm install
```

#### Bước 2: Login Vercel
```bash
vercel login
# Chọn "Continue with GitHub" hoặc tạo tài khoản mới
```

#### Bước 3: Deploy
```bash
vercel --prod
```

#### Kết quả: `https://hoanglinh-medicine.vercel.app`

---

### **Phương pháp 2: Netlify (Đã thử)**

#### Bước 1: Cấu hình Next.js
```javascript
// next.config.js
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

#### Bước 2: Build và Deploy
```bash
npm run build
netlify deploy --prod --dir=out
```

---

### **Phương pháp 3: Railway (Mới)**

#### Bước 1: Tạo tài khoản Railway
1. Vào [railway.app](https://railway.app)
2. Đăng ký với GitHub
3. Tạo project mới

#### Bước 2: Deploy
1. Connect GitHub repository
2. Railway tự động deploy
3. Auto-deploy khi push code

#### Kết quả: `https://hoanglinh-medicine.railway.app`

---

### **Phương pháp 4: Render (Mới)**

#### Bước 1: Tạo tài khoản Render
1. Vào [render.com](https://render.com)
2. Đăng ký với GitHub
3. Tạo Web Service

#### Bước 2: Cấu hình
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment**: Node

#### Kết quả: `https://hoanglinh-medicine.onrender.com`

---

## 🔧 **Sửa lỗi build hiện tại:**

### **Lỗi 1: Permission denied**
```bash
# Xóa cache và build lại
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run build
```

### **Lỗi 2: Middleware manifest**
```bash
# Cấu hình Next.js đơn giản
const nextConfig = {
  images: {
    unoptimized: true
  }
}
```

### **Lỗi 3: Build timeout**
```bash
# Tăng timeout
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## 🎯 **Khuyến nghị:**

### **Thứ tự ưu tiên:**
1. **Vercel** - Tối ưu nhất cho Next.js
2. **Railway** - Dễ sử dụng, có database
3. **Render** - Ổn định, miễn phí
4. **Netlify** - Đã thử, cần cấu hình thêm

### **Lý do chọn Vercel:**
- ✅ Tối ưu cho Next.js
- ✅ Auto-deploy từ GitHub
- ✅ Edge Functions
- ✅ Analytics tích hợp
- ✅ Custom domain dễ dàng

---

## 🚀 **Deploy ngay bây giờ:**

### **Bước 1: Chuẩn bị**
```bash
# Dừng dev server
Ctrl + C

# Xóa cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### **Bước 2: Deploy Vercel**
```bash
vercel login
vercel --prod
```

### **Bước 3: Kết quả**
- ✅ Toàn bộ ứng dụng Next.js
- ✅ Tất cả các trang hoạt động
- ✅ Giỏ hàng, AI tư vấn
- ✅ Responsive design
- ✅ Performance tối ưu

---

## 🎉 **Kết quả mong đợi:**

Sau khi deploy thành công, bạn sẽ có:
- **🏠 Trang chủ** - Hero, sản phẩm, AI tư vấn
- **💊 Sản phẩm** - Grid, filter, search
- **🛒 Giỏ hàng** - Quản lý cart, checkout
- **📂 Danh mục** - Categories với modal
- **ℹ️ Giới thiệu** - About us, story
- **📞 Liên hệ** - Contact form, FAQ

**Tất cả giống hệt như localhost!** 🚀 