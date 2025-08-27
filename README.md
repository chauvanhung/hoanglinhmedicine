# HealthCare Pro - Ứng dụng chăm sóc sức khỏe số

## Mô tả
HealthCare Pro là một trang web hiện đại được thiết kế dành cho người béo phì, cung cấp các tính năng toàn diện để hỗ trợ hành trình giảm cân và cải thiện sức khỏe.

## Tính năng chính

### 1. 🧮 Tính chỉ số BMI
- Máy tính BMI chính xác
- Phân loại trạng thái sức khỏe
- Biểu đồ trực quan với màu sắc phân biệt
- Kết quả chi tiết và dễ hiểu

### 2. 🍽️ Thực đơn dinh dưỡng
- Chia theo bữa ăn: sáng, trưa, tối, phụ
- Thông tin calo chi tiết
- Hình ảnh minh họa đẹp mắt
- Giao diện tab dễ sử dụng

### 3. 💪 Hướng dẫn tập luyện
- **Cardio**: Đi bộ, chạy bộ, đạp xe
- **Strength Training**: Nâng tạ, bodyweight exercises
- **Flexibility**: Yoga, stretching
- Thông tin thời gian và calo tiêu hao

### 4. 👨‍⚕️ Tư vấn chuyên gia
- **Tư vấn AI**: Phản hồi ngay lập tức
- **Gặp bác sĩ trực tiếp**: Đặt lịch > 2 tháng
- Thông tin chi tiết về dịch vụ

### 5. 🗺️ Lộ trình và thành tích
- Timeline 4 giai đoạn rõ ràng
- Mục tiêu cụ thể cho từng giai đoạn
- Hệ thống thành tích với icon đẹp mắt

### 6. 🔗 Tích hợp thiết bị
- **Apple Watch**: HealthKit API, Google Fit API
- **Ứng dụng đếm calo**: Nutrition API
- Đồng bộ dữ liệu sức khỏe

## Công nghệ sử dụng

- **HTML5**: Cấu trúc semantic
- **CSS3**: 
  - Flexbox và Grid layout
  - CSS Variables
  - Animations và Transitions
  - Responsive design
  - Modern gradients và shadows
- **JavaScript ES6+**:
  - DOM manipulation
  - Event handling
  - Smooth scrolling
  - Form validation
  - Intersection Observer API
  - Custom animations

## Cấu trúc file

```
hoanglinhmedicine/
├── index.html          # Trang chính
├── styles.css          # Stylesheet
├── script.js           # JavaScript functionality
├── package.json        # Node.js dependencies
├── render.yaml         # Render deployment config
├── Dockerfile          # Docker containerization
└── README.md           # Hướng dẫn sử dụng
```

## Cách sử dụng

### 1. Mở trang web local
- Mở file `index.html` trong trình duyệt web
- Hoặc chạy `npm run dev` để sử dụng local server

### 2. Tính BMI
- Cuộn xuống phần "Tính chỉ số BMI"
- Nhập chiều cao (cm) và cân nặng (kg)
- Nhấn "Tính BMI" để xem kết quả

### 3. Xem thực đơn
- Chuyển đến phần "Thực đơn dinh dưỡng"
- Chọn tab bữa ăn mong muốn
- Xem thông tin chi tiết và calo

### 4. Khám phá bài tập
- Cuộn xuống phần "Hướng dẫn tập luyện"
- Chọn loại bài tập phù hợp
- Xem thời gian và calo tiêu hao

### 5. Tư vấn
- Chọn loại tư vấn phù hợp
- Nhấn nút để bắt đầu dịch vụ

## 🚀 Deploy lên Render

### Bước 1: Chuẩn bị
```bash
# Clone repository
git clone <your-repo-url>
cd hoanglinhmedicine

# Cài đặt dependencies
npm install
```

### Bước 2: Push lên GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Bước 3: Deploy trên Render
1. Đăng nhập vào [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect với GitHub repository
4. Cấu hình:
   - **Name**: healthcare-pro
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click "Create Web Service"

### Bước 4: Kiểm tra
- Render sẽ tự động build và deploy
- URL sẽ có dạng: `https://healthcare-pro.onrender.com`

## Tính năng responsive

- **Desktop**: Giao diện đầy đủ với layout 2 cột
- **Tablet**: Tự động điều chỉnh layout
- **Mobile**: 
  - Menu hamburger
  - Layout 1 cột
  - Touch-friendly buttons
  - Optimized spacing

## Hiệu ứng và animations

- **Loading screen**: Animation khởi động
- **Scroll animations**: Elements fade in khi scroll
- **Hover effects**: Interactive feedback
- **Smooth scrolling**: Navigation mượt mà
- **Progress bar**: Hiển thị tiến độ scroll
- **Floating Action Button**: Nút scroll to top

## Tùy chỉnh

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #ff6b6b;
}
```

### Thêm tính năng mới
- Thêm section mới trong `index.html`
- Style tương ứng trong `styles.css`
- Logic JavaScript trong `script.js`

## Hỗ trợ trình duyệt

- ✅ Chrome (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11+ (một số tính năng có thể không hoạt động)

## Troubleshooting

### Lỗi Render ENOENT
Nếu gặp lỗi `Could not read package.json`:
1. Đảm bảo file `package.json` tồn tại
2. Kiểm tra cấu hình trong `render.yaml`
3. Restart service trên Render

### Lỗi PORT
Nếu gặp lỗi về PORT:
- Render sẽ tự động set biến môi trường `$PORT`
- Không cần hardcode port trong code

## Tác giả

Trang web được tạo dựa trên ý tưởng từ hình ảnh về ứng dụng chăm sóc sức khỏe số dành cho người béo phì.

## Giấy phép

Dự án này được tạo ra cho mục đích giáo dục và demo. Bạn có thể tự do sử dụng và chỉnh sửa theo nhu cầu.

---

**Lưu ý**: Đây là một trang web demo. Để sử dụng trong thực tế, bạn cần:
- Thay thế placeholder images bằng hình ảnh thực
- Tích hợp backend và database
- Thêm authentication và user management
- Implement các API thực tế
- Thêm validation và security measures
