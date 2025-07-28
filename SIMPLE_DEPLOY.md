# 🚀 Deploy Đơn Giản - Hoàng Linh Medicine

## ⚡ Deploy trong 3 phút - Không cần build phức tạp!

---

## 🌐 **Phương pháp 1: GitHub Pages (Đơn giản nhất)**

### Bước 1: Tạo repository GitHub
1. Vào [github.com](https://github.com)
2. Tạo repository mới: `hoanglinh-medicine`
3. Upload code lên GitHub

### Bước 2: Cấu hình Next.js cho static export
Thêm vào `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

### Bước 3: Deploy
1. **Settings** > **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: main
4. **Folder**: `/ (root)`

### Kết quả: `https://username.github.io/hoanglinh-medicine`

---

## ☁️ **Phương pháp 2: Netlify (Drag & Drop)**

### Bước 1: Build static
```bash
npm run build
```

### Bước 2: Deploy
1. Vào [netlify.com](https://netlify.com)
2. Tạo tài khoản miễn phí
3. **Drag & drop** thư mục `out` lên Netlify
4. Đợi 2 phút

### Kết quả: `https://random-name.netlify.app`

---

## 🎯 **Phương pháp 3: Surge.sh (1 lệnh)**

### Bước 1: Cài đặt Surge
```bash
npm install -g surge
```

### Bước 2: Deploy
```bash
npm run build
surge out/
```

### Kết quả: `https://random-name.surge.sh`

---

## 💰 **Chi phí: TẤT CẢ MIỄN PHÍ!**

| Platform | Hosting | Domain | Tổng |
|----------|---------|---------|------|
| **GitHub Pages** | $0 | $0 | **$0** |
| **Netlify** | $0 | $0 | **$0** |
| **Surge** | $0 | $0 | **$0** |

---

## 🚀 **Deploy ngay bây giờ:**

### **Lựa chọn 1: GitHub Pages**
1. Tạo GitHub repository
2. Upload code
3. Enable Pages
4. Xong!

### **Lựa chọn 2: Netlify**
1. Build project
2. Drag & drop
3. Xong!

### **Lựa chọn 3: Surge**
1. Cài surge
2. Deploy 1 lệnh
3. Xong!

---

## 🎉 **Kết quả:**

✅ **Website online 24/7**
✅ **HTTPS tự động**
✅ **CDN toàn cầu**
✅ **Miễn phí hoàn toàn**
✅ **Dễ quản lý**

**Bạn muốn thử phương pháp nào? Tôi sẽ hướng dẫn chi tiết!** 🚀 