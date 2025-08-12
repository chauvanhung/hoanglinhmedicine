# 🔥 Hướng dẫn cấu hình Firebase

## Bước 1: Tạo dự án Firebase

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" hoặc "Add project"
3. Đặt tên dự án: `hoanglinh-medicine`
4. Chọn "Enable Google Analytics" (tùy chọn)
5. Click "Create project"

## Bước 2: Thêm ứng dụng Web

1. Trong Firebase Console, click biểu tượng Web (</>)
2. Đặt tên app: `Hoang Linh Medicine Web`
3. Chọn "Also set up Firebase Hosting" (tùy chọn)
4. Click "Register app"
5. Copy config object được tạo ra

## Bước 3: Bật Authentication

1. Trong sidebar, click "Authentication"
2. Click "Get started"
3. Chọn tab "Sign-in method"
4. Bật "Email/Password"
5. Click "Save"

## Bước 4: Tạo Firestore Database

1. Trong sidebar, click "Firestore Database"
2. Click "Create database"
3. Chọn "Start in test mode" (cho development)
4. Chọn location gần nhất (ví dụ: asia-southeast1)
5. Click "Done"

## Bước 5: Cấu hình Security Rules

Trong Firestore Database > Rules, thay thế bằng:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Consultations collection
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
  }
}
```

## Bước 6: Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Thay thế các giá trị bằng config thực tế từ Firebase Console.

## Bước 7: Tạo Admin User

1. Đăng ký tài khoản thông thường
2. Trong Firestore Database, tìm document user
3. Thay đổi `role` từ `"user"` thành `"admin"`

## Cấu trúc Database

### Collection: `users`
```javascript
{
  name: "Nguyễn Văn A",
  email: "user@example.com",
  phone: "0987654321",
  role: "user", // hoặc "admin"
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `orders`
```javascript
{
  userId: "user_id",
  items: [...],
  total: 150000,
  status: "pending", // pending, confirmed, shipped, delivered, cancelled
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Collection: `consultations`
```javascript
{
  userId: "user_id",
  doctorId: "doctor_id",
  doctorName: "BS. Nguyễn Văn An",
  date: "2024-01-20",
  time: "14:00",
  status: "scheduled", // scheduled, completed, cancelled
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Lưu ý quan trọng

1. **Security**: Đảm bảo cấu hình Security Rules đúng cách
2. **Environment Variables**: Không commit file `.env.local` lên git
3. **Production**: Thay đổi Security Rules cho production
4. **Backup**: Backup dữ liệu thường xuyên
5. **Monitoring**: Sử dụng Firebase Analytics để theo dõi

## Troubleshooting

### Lỗi thường gặp:
- **Permission denied**: Kiểm tra Security Rules
- **Config not found**: Kiểm tra environment variables
- **Auth not initialized**: Đảm bảo Firebase được khởi tạo đúng cách 