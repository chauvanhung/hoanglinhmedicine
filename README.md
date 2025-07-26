# Hoàng Linh Medicine - Ứng dụng bán thuốc & Tư vấn AI

Ứng dụng web hiện đại cho việc bán thuốc trực tuyến với tính năng tư vấn AI thông minh.

## 🚀 Tính năng chính

### 🛍️ Quản lý sản phẩm
- **Danh mục thuốc đa dạng**: Thuốc giảm đau, vitamin, thuốc tiêu hóa, thuốc dị ứng
- **Tìm kiếm thông minh**: Tìm kiếm thuốc theo tên, danh mục
- **Chi tiết sản phẩm**: Thông tin đầy đủ về thuốc, liều lượng, tác dụng phụ
- **Quản lý đơn thuốc**: Phân biệt thuốc cần đơn và không cần đơn

### 🤖 Tư vấn AI
- **Chatbot thông minh**: Tư vấn sức khỏe 24/7
- **Tư vấn thuốc**: Hướng dẫn sử dụng, tương tác thuốc
- **Chẩn đoán sơ bộ**: Phân tích triệu chứng và đưa ra lời khuyên
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt

### 🛒 Giỏ hàng & Thanh toán
- **Quản lý giỏ hàng**: Thêm, sửa, xóa sản phẩm
- **Tính toán tự động**: Tổng tiền, phí vận chuyển
- **Thanh toán an toàn**: Tích hợp Stripe
- **Theo dõi đơn hàng**: Trạng thái real-time

### 👤 Quản lý người dùng
- **Đăng ký/Đăng nhập**: Hệ thống xác thực an toàn
- **Hồ sơ cá nhân**: Thông tin, địa chỉ giao hàng
- **Lịch sử đơn hàng**: Theo dõi các đơn hàng đã mua
- **Đánh giá sản phẩm**: Chia sẻ trải nghiệm

## 🛠️ Công nghệ sử dụng

### Frontend
- **Next.js 14**: Framework React hiện đại
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling utility-first
- **Framer Motion**: Animation mượt mà
- **Zustand**: State management
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend & Database
- **Next.js API Routes**: Backend API
- **Prisma**: ORM cho database
- **PostgreSQL**: Database chính
- **NextAuth.js**: Authentication

### AI & External Services
- **OpenAI API**: Tư vấn AI
- **Stripe**: Thanh toán
- **Vercel**: Deployment

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn
- PostgreSQL database

### Bước 1: Clone repository
```bash
git clone https://github.com/your-username/hoanglinh-medicine.git
cd hoanglinh-medicine
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Cấu hình environment
Tạo file `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hoanglinh_medicine"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

### Bước 4: Setup database
```bash
# Tạo database schema
npx prisma generate
npx prisma db push

# Seed dữ liệu mẫu (tùy chọn)
npx prisma db seed
```

### Bước 5: Chạy ứng dụng
```bash
npm run dev
# hoặc
yarn dev
```

Truy cập: http://localhost:3000

## 🏗️ Cấu trúc dự án

```
hoanglinh-medicine/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # UI components
│   ├── Header.tsx        # Navigation header
│   ├── Hero.tsx          # Hero section
│   ├── ProductGrid.tsx   # Product display
│   ├── ProductCard.tsx   # Product card
│   ├── AIConsultation.tsx # AI chat
│   └── Footer.tsx        # Footer
├── lib/                  # Utility functions
├── store/                # Zustand stores
├── types/                # TypeScript types
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Primary blue, secondary purple
- **Typography**: Inter font family
- **Components**: Consistent button, card, input styles
- **Responsive**: Mobile-first design

### User Experience
- **Loading States**: Skeleton loading, spinners
- **Error Handling**: Toast notifications, error boundaries
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Image optimization, code splitting

## 🤖 AI Consultation Features

### Capabilities
- **Health Advice**: Tư vấn sức khỏe cơ bản
- **Medicine Information**: Thông tin thuốc, liều lượng
- **Symptom Analysis**: Phân tích triệu chứng
- **Lifestyle Tips**: Lời khuyên về lối sống

### Safety Measures
- **Medical Disclaimer**: Cảnh báo không thay thế bác sĩ
- **Emergency Alerts**: Hướng dẫn khi cần cấp cứu
- **Prescription Warnings**: Cảnh báo thuốc kê đơn

## 🔒 Bảo mật

### Authentication
- **JWT Tokens**: Secure session management
- **Password Hashing**: bcrypt encryption
- **CSRF Protection**: Cross-site request forgery prevention

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM
- **XSS Protection**: Content Security Policy

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables
Đảm bảo cấu hình đầy đủ environment variables trên Vercel:
- DATABASE_URL
- NEXTAUTH_SECRET
- OPENAI_API_KEY
- STRIPE_SECRET_KEY

## 📱 Mobile Responsive

Ứng dụng được thiết kế responsive cho:
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px  
- **Mobile**: 320px - 767px

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
npm run type-check   # TypeScript check
```

### Code Style
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 📞 Liên hệ

- **Email**: info@hoanglinh.com
- **Phone**: 1900-1234
- **Website**: https://hoanglinh-medicine.com

## 🙏 Acknowledgments

- Next.js team cho framework tuyệt vời
- OpenAI cho AI capabilities
- Tailwind CSS cho styling system
- Cộng đồng open source

---

**Lưu ý**: Đây là dự án demo. Để sử dụng trong production, vui lòng:
1. Cấu hình đầy đủ security measures
2. Tích hợp với hệ thống thanh toán thực
3. Tuân thủ quy định về bán thuốc online
4. Có giấy phép kinh doanh dược phẩm 