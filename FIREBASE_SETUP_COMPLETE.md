# 🔥 Hướng dẫn hoàn chỉnh cấu hình Firebase

## ✅ **Đã hoàn thành:**
- ✅ Firebase config đã được cấu hình trong `lib/firebase.ts`
- ✅ Authentication service đã được tạo
- ✅ Auth store đã được tích hợp
- ✅ Security Rules đã được tạo
- ✅ Scripts đã được chuẩn bị

## 🚀 **Bước tiếp theo:**

### 1. **Cài đặt Firebase CLI**
```bash
npm install -g firebase-tools
```

### 2. **Đăng nhập Firebase**
```bash
npm run firebase:login
```

### 3. **Khởi tạo Firebase project**
```bash
npm run firebase:init
```
Chọn:
- Firestore
- Hosting (tùy chọn)
- Storage (tùy chọn)

### 4. **Deploy Security Rules**
```bash
npm run deploy:rules
```

### 5. **Thêm dữ liệu mẫu**
```bash
npm run seed:data
```

### 6. **Test đăng ký/đăng nhập**
1. Truy cập `http://localhost:3000/register`
2. Đăng ký tài khoản mới
3. Ghi nhớ User ID được tạo

### 7. **Tạo Admin User**
```bash
npm run create:admin <USER_ID>
```
Ví dụ: `npm run create:admin abc123def456`

## 📁 **Cấu trúc file đã tạo:**

```
├── lib/
│   ├── firebase.ts          # Firebase config
│   └── firebaseAuth.ts      # Authentication service
├── store/
│   └── auth.ts              # Auth store với Firebase
├── components/
│   └── AuthProvider.tsx     # Auth provider
├── scripts/
│   ├── seed-data.js         # Thêm dữ liệu mẫu
│   └── create-admin.js      # Tạo admin user
├── firestore.rules          # Security Rules cho Firestore
├── storage.rules            # Security Rules cho Storage
├── firebase.json            # Firebase config
├── firestore.indexes.json   # Firestore indexes
└── deploy-rules.js          # Script deploy rules
```

## 🔐 **Security Rules đã cấu hình:**

### Firestore Rules:
- ✅ Users: Chỉ user có thể đọc/ghi dữ liệu của mình
- ✅ Orders: User chỉ đọc/ghi đơn hàng của mình, admin đọc tất cả
- ✅ Consultations: User chỉ đọc/ghi lịch tư vấn của mình, admin đọc tất cả
- ✅ Products: Ai cũng đọc được, chỉ admin mới ghi được
- ✅ Categories: Ai cũng đọc được, chỉ admin mới ghi được

### Storage Rules:
- ✅ Đọc: Tất cả đều có thể đọc
- ✅ Ghi: Chỉ admin hoặc user đã đăng nhập mới upload được ảnh sản phẩm

## 🎯 **Test Checklist:**

### Authentication:
- [ ] Đăng ký tài khoản mới
- [ ] Đăng nhập với tài khoản đã tạo
- [ ] Đăng xuất
- [ ] Cập nhật thông tin profile
- [ ] Tạo admin user

### Database:
- [ ] Dữ liệu mẫu đã được thêm
- [ ] Security rules hoạt động đúng
- [ ] User chỉ đọc được dữ liệu của mình
- [ ] Admin đọc được tất cả dữ liệu

### UI:
- [ ] Header hiển thị trạng thái đăng nhập
- [ ] Menu dropdown cho user đã đăng nhập
- [ ] Redirect khi chưa đăng nhập
- [ ] Toast notifications hoạt động

## 🚨 **Lưu ý quan trọng:**

1. **Security**: Security Rules đã được cấu hình an toàn
2. **Environment**: Không cần file `.env.local` vì config đã hardcode
3. **Production**: Cần thay đổi Security Rules cho production
4. **Backup**: Backup dữ liệu thường xuyên
5. **Monitoring**: Sử dụng Firebase Analytics

## 🔧 **Troubleshooting:**

### Lỗi thường gặp:
- **Permission denied**: Kiểm tra Security Rules
- **User not found**: Đảm bảo user đã đăng ký
- **Config error**: Kiểm tra Firebase config
- **Network error**: Kiểm tra kết nối internet

### Debug:
```bash
# Xem logs Firebase
firebase functions:log

# Test Security Rules
firebase emulators:start

# Xem dữ liệu Firestore
firebase firestore:indexes
```

## 🎉 **Hoàn thành!**

Bây giờ bạn có hệ thống Firebase hoàn chỉnh với:
- ✅ Authentication thực tế
- ✅ Database an toàn
- ✅ Security Rules đầy đủ
- ✅ Scripts tiện ích
- ✅ Dữ liệu mẫu

Hãy test ngay để đảm bảo mọi thứ hoạt động tốt! 🚀 