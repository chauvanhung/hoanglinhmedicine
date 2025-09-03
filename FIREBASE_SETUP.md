# 🔥 Firebase Setup Guide

## Tổng quan
Dự án này đã được tích hợp Firebase để thay thế PostgreSQL + Redis. Firebase cung cấp:
- **Authentication** - Đăng ký/đăng nhập người dùng
- **Firestore Database** - Lưu trữ dữ liệu NoSQL
- **Hosting** - Deploy ứng dụng web
- **Real-time updates** - Cập nhật dữ liệu theo thời gian thực

## 🚀 Bước 1: Tạo Firebase Project

### 1. Truy cập Firebase Console
- Vào [console.firebase.google.com](https://console.firebase.google.com)
- Click "Create a project" hoặc "Add project"

### 2. Đặt tên project
- Tên: `hoanglinh-obesity-care` (hoặc tên bạn muốn)
- Click "Continue"

### 3. Bật Google Analytics (tùy chọn)
- Chọn "Enable Google Analytics for this project"
- Click "Continue"

### 4. Hoàn tất
- Click "Create project"
- Đợi project được tạo xong

## 🔐 Bước 2: Bật Authentication

### 1. Vào Authentication
- Trong Firebase Console, click "Authentication" ở sidebar
- Click "Get started"

### 2. Bật Email/Password
- Click tab "Sign-in method"
- Click "Email/Password"
- Bật "Enable"
- Click "Save"

### 3. Cấu hình bổ sung (tùy chọn)
- Bật "Email link (passwordless sign-in)"
- Bật "Email verification"

## 🗄️ Bước 3: Tạo Firestore Database

### 1. Vào Firestore Database
- Trong Firebase Console, click "Firestore Database"
- Click "Create database"

### 2. Chọn chế độ bảo mật
- Chọn "Start in test mode" (cho development)
- Click "Next"

### 3. Chọn location
- Chọn region gần nhất (ví dụ: `asia-southeast1`)
- Click "Done"

### 4. Tạo collections
Firestore sẽ tự động tạo collections khi có dữ liệu, nhưng bạn có thể tạo trước:

```
users/
  - user_id_1
  - user_id_2

profiles/
  - profile_id_1
  - profile_id_2

goals/
  - goal_id_1
  - goal_id_2

measurements/
  - measurement_id_1
  - measurement_id_2

plans/
  - plan_id_1
  - plan_id_2
```

## 🌐 Bước 4: Cấu hình Web App

### 1. Thêm Web App
- Trong Firebase Console, click icon "Web" (</>)
- Đặt tên app: `hoanglinh-web`
- Click "Register app"

### 2. Copy config
Bạn sẽ nhận được config như này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDug_NyDb_oVP_Pl5yXSFcy72dq7PjCYhY",
  authDomain: "hoanglinh-obesity-care.firebaseapp.com",
  projectId: "hoanglinh-obesity-care",
  storageBucket: "hoanglinh-obesity-care.firebasestorage.app",
  messagingSenderId: "860032582221",
  appId: "1:860032582221:web:e3c5923cbe504725d91204",
  measurementId: "G-T9Z1DMXE8P"
};
```

### 3. Cập nhật config
- Copy config vào file `apps/web/firebase.config.js`
- Thay thế các giá trị `your-*` bằng giá trị thực

## 📱 Bước 5: Cài đặt Firebase SDK

### 1. Cài đặt package
```bash
cd apps/web
npm install firebase
```

### 2. Cập nhật firebase.js
Thay thế mock functions bằng Firebase thực tế:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from 'firebase/firestore';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Thay thế các mock functions
async createUserWithEmailAndPassword(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

async addDocument(collectionName, data) {
  const docRef = await addDoc(collection(db, collectionName), data);
  return { id: docRef.id, ...data };
}
```

## 🔒 Bước 6: Cấu hình Security Rules

### 1. Vào Firestore Rules
- Trong Firestore Database, click tab "Rules"

### 2. Cập nhật rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /profiles/{profileId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /goals/{goalId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /measurements/{measurementId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    match /plans/{planId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 3. Publish rules
- Click "Publish"

## 🚀 Bước 7: Deploy lên Firebase Hosting

### 1. Cài đặt Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login Firebase
```bash
firebase login
```

### 3. Initialize project
```bash
cd apps/web
firebase init hosting
```

### 4. Cấu hình hosting
- Chọn project Firebase
- Public directory: `dist` (hoặc `.next`)
- Single-page app: `Yes`
- Overwrite index.html: `No`

### 5. Build và deploy
```bash
npm run build
firebase deploy
```

## 📊 Bước 8: Kiểm tra hoạt động

### 1. Test Authentication
- Truy cập `/onboarding` để đăng ký
- Truy cập `/login` để đăng nhập
- Kiểm tra Firebase Console > Authentication

### 2. Test Database
- Kiểm tra Firestore Database có dữ liệu mới
- Xem collections: users, profiles, goals, measurements

### 3. Test Real-time
- Mở 2 tab browser
- Cập nhật dữ liệu ở tab 1
- Kiểm tra tab 2 có cập nhật tự động

## 🔧 Troubleshooting

### Lỗi thường gặp:

1. **"Firebase not initialized"**
   - Kiểm tra config trong `firebase.config.js`
   - Đảm bảo đã gọi `initializeFirebase()`

2. **"Permission denied"**
   - Kiểm tra Security Rules
   - Đảm bảo user đã đăng nhập

3. **"Collection not found"**
   - Collections sẽ tự động tạo khi có dữ liệu
   - Kiểm tra tên collection trong `COLLECTIONS`

4. **"Auth user not found"**
   - Kiểm tra Firebase Authentication
   - Đảm bảo đã bật Email/Password sign-in

## 📚 Tài liệu tham khảo

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-modeling)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)

## 🎯 Lợi ích của Firebase

✅ **Dễ sử dụng** - Setup nhanh, API đơn giản
✅ **Scalable** - Tự động scale theo traffic
✅ **Real-time** - Cập nhật dữ liệu theo thời gian thực
✅ **Security** - Bảo mật tốt với Security Rules
✅ **Hosting** - Deploy dễ dàng
✅ **Free tier** - Miễn phí cho projects nhỏ
✅ **Analytics** - Theo dõi user behavior
✅ **Crashlytics** - Monitor app crashes

---

**Lưu ý**: Đây là setup cơ bản. Bạn có thể thêm các Firebase services khác như:
- Cloud Functions
- Cloud Storage
- Cloud Messaging
- Performance Monitoring
