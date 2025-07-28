# 🌐 Hướng dẫn Deploy Thay thế - Hoàng Linh Medicine

## ⚠️ Vercel không hoạt động? Không sao! Có nhiều cách khác!

---

## ☁️ **Phương pháp 1: Netlify (Khuyến nghị)**

### Ưu điểm:
- ✅ Miễn phí hoàn toàn
- ✅ Dễ sử dụng
- ✅ Tự động HTTPS
- ✅ CDN toàn cầu
- ✅ Form handling miễn phí

### Bước 1: Chuẩn bị
```bash
# Build project
npm run build
```

### Bước 2: Deploy
1. **Tạo tài khoản**: [netlify.com](https://netlify.com)
2. **Drag & Drop**: Kéo thư mục `.next` lên Netlify
3. **Hoặc Git**: Connect GitHub repository

### Bước 3: Cấu hình
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18

### Kết quả: `https://your-app-name.netlify.app`

---

## 🚂 **Phương pháp 2: Railway**

### Ưu điểm:
- ✅ Miễn phí $5 credit/tháng
- ✅ Deploy từ GitHub
- ✅ Database tích hợp
- ✅ Auto-deploy

### Bước 1: Chuẩn bị
```bash
# Push code lên GitHub
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### Bước 2: Deploy
1. **Tạo tài khoản**: [railway.app](https://railway.app)
2. **Connect GitHub**: Chọn repository
3. **Auto-deploy**: Railway tự động deploy

### Kết quả: `https://your-app-name.railway.app`

---

## 🎨 **Phương pháp 3: Render**

### Ưu điểm:
- ✅ Miễn phí tier
- ✅ Tự động HTTPS
- ✅ Global CDN
- ✅ Easy setup

### Bước 1: Chuẩn bị
```bash
# Đảm bảo code sạch
npm run build
```

### Bước 2: Deploy
1. **Tạo tài khoản**: [render.com](https://render.com)
2. **New Web Service**: Chọn GitHub repo
3. **Cấu hình**:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### Kết quả: `https://your-app-name.onrender.com`

---

## 🐳 **Phương pháp 4: Docker + VPS**

### Ưu điểm:
- ✅ Kiểm soát hoàn toàn
- ✅ Chi phí thấp
- ✅ Tùy chỉnh cao

### Bước 1: Build Docker
```bash
# Build image
docker build -t hoanglinh-medicine .

# Test locally
docker run -p 3000:3000 hoanglinh-medicine
```

### Bước 2: Deploy lên VPS
```bash
# Upload lên VPS (DigitalOcean, AWS, etc.)
docker run -d -p 80:3000 --name hoanglinh-medicine hoanglinh-medicine
```

### Kết quả: `http://your-server-ip`

---

## 🎯 **Phương pháp 5: GitHub Pages (Static)**

### Ưu điểm:
- ✅ Miễn phí hoàn toàn
- ✅ Tích hợp GitHub
- ✅ Tự động deploy

### Bước 1: Export static
```bash
# Thêm vào next.config.js
module.exports = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}
```

### Bước 2: Deploy
1. **GitHub Actions**: Tự động build và deploy
2. **Settings**: Enable GitHub Pages
3. **Source**: Deploy from Actions

### Kết quả: `https://username.github.io/repo-name`

---

## 💰 **So sánh chi phí:**

| Platform | Free Tier | Paid Tier | Domain |
|----------|-----------|-----------|---------|
| **Netlify** | ✅ $0 | $19/tháng | $12/năm |
| **Railway** | ✅ $5 credit | $20/tháng | $12/năm |
| **Render** | ✅ $0 | $7/tháng | $12/năm |
| **VPS** | ❌ | $5-20/tháng | $12/năm |
| **GitHub Pages** | ✅ $0 | - | $12/năm |

---

## 🚀 **Deploy nhanh với Netlify:**

### Bước 1: Build
```bash
npm run build
```

### Bước 2: Deploy
1. Vào [netlify.com](https://netlify.com)
2. Tạo tài khoản miễn phí
3. Kéo thư mục `.next` lên Netlify
4. Đợi 2-3 phút

### Bước 3: Kết quả
- ✅ URL: `https://random-name.netlify.app`
- ✅ HTTPS tự động
- ✅ CDN toàn cầu
- ✅ Form handling

---

## 🔧 **Troubleshooting:**

### Lỗi build:
```bash
# Xóa cache
rm -rf .next node_modules
npm install
npm run build
```

### Lỗi deploy:
- Kiểm tra build logs
- Verify Node.js version
- Check environment variables

### Lỗi domain:
- Đợi DNS propagate (24-48h)
- Kiểm tra CNAME records
- Contact support

---

## 📱 **Mobile App (Tương lai):**

### React Native:
```bash
npx create-expo-app hoanglinh-mobile
```

### Flutter:
```bash
flutter create hoanglinh_mobile
```

---

## 🎉 **Kết luận:**

**Khuyến nghị thứ tự:**
1. **Netlify** - Dễ nhất, miễn phí
2. **Railway** - Tích hợp database
3. **Render** - Ổn định, miễn phí
4. **VPS** - Kiểm soát cao
5. **GitHub Pages** - Static site

**Tất cả đều miễn phí và dễ sử dụng!** 🚀 