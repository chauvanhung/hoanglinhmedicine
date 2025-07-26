# 🚀 Setup GitHub Repository - Hoàng Linh Medicine

## 📋 **Bước 1: Tạo Repository trên GitHub**

### 1. Vào GitHub.com
- Truy cập [github.com](https://github.com)
- Đăng nhập vào tài khoản của bạn

### 2. Tạo Repository mới
- Click nút **"New"** hoặc **"+"** > **"New repository"**
- **Repository name**: `hoanglinhmedicine`
- **Description**: `Next.js app for selling medicine with AI consultation`
- **Visibility**: Chọn **Public** (để deploy miễn phí)
- **Không check** "Add a README file" (vì đã có)
- Click **"Create repository"**

## 📋 **Bước 2: Push Code lên GitHub**

### Chạy các lệnh sau trong terminal:

```bash
# Thêm remote origin
git remote add origin https://github.com/YOUR_USERNAME/hoanglinhmedicine.git

# Push code lên GitHub
git branch -M main
git push -u origin main
```

**Thay `YOUR_USERNAME` bằng username GitHub của bạn**

## 📋 **Bước 3: Xác nhận Repository**

### Sau khi push thành công:
- Vào repository trên GitHub
- Kiểm tra tất cả files đã được upload
- URL sẽ là: `https://github.com/YOUR_USERNAME/hoanglinhmedicine`

## 🎯 **Bước 4: Deploy với Render**

### 1. Vào Render.com
- Truy cập [render.com](https://render.com)
- Click **"Get Started for Free"**
- Chọn **"Continue with GitHub"**

### 2. Tạo Web Service
- Click **"New +"** > **"Web Service"**
- Chọn repository `hoanglinhmedicine`
- **Name**: `hoanglinh-medicine`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- Click **"Create Web Service"**

### 3. Kết quả
- ✅ **URL**: `https://hoanglinh-medicine.onrender.com`
- ✅ **Toàn bộ ứng dụng Next.js**
- ✅ **Auto-deploy khi push code**

## 🎉 **Tính năng sẽ có:**

### **🏠 Trang chủ**
- Hero section với CTA
- Grid sản phẩm nổi bật
- AI tư vấn modal
- Footer với thông tin liên hệ

### **💊 Trang sản phẩm**
- Grid sản phẩm với filter
- Search theo tên/mô tả
- Filter theo danh mục
- Filter theo giá
- Checkbox "Cần đơn thuốc"

### **🛒 Giỏ hàng**
- Thêm/xóa sản phẩm
- Cập nhật số lượng
- Tính tổng tiền
- Phí ship miễn phí > 500k
- Checkout process

### **📂 Danh mục**
- Grid các danh mục
- Modal chi tiết danh mục
- Sản phẩm phổ biến
- Icons và mô tả

### **ℹ️ Giới thiệu**
- Story công ty
- Core values
- Mission & Vision
- Timeline phát triển

### **📞 Liên hệ**
- Contact form
- Validation
- FAQ section
- Thông tin liên hệ

## 💰 **Chi phí:**
- **GitHub**: Miễn phí
- **Render**: Miễn phí tier
- **Tổng**: $0

**Bắt đầu ngay!** 🚀 