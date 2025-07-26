# 🚀 Hướng dẫn Deploy Hoàng Linh Medicine

## 📋 Chuẩn bị trước khi deploy

### 1. **Chuẩn bị Domain**
- Mua domain từ nhà cung cấp (Namecheap, GoDaddy, FPT, etc.)
- Chuẩn bị SSL certificate (thường được cung cấp miễn phí)

### 2. **Chuẩn bị Environment Variables**
Tạo file `.env.local` với các biến môi trường:
```env
# Database (nếu sử dụng)
DATABASE_URL="your_database_url"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# OpenAI (cho AI tư vấn)
OPENAI_API_KEY="your-openai-api-key"

# Stripe (cho thanh toán)
STRIPE_SECRET_KEY="your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
```

---

## 🌐 **Phương pháp 1: Vercel (Khuyến nghị)**

### Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

### Bước 2: Login Vercel
```bash
vercel login
```

### Bước 3: Deploy
```bash
# Deploy lần đầu
vercel

# Deploy production
vercel --prod
```

### Bước 4: Cấu hình Domain
1. Vào Vercel Dashboard
2. Chọn project
3. Settings > Domains
4. Thêm custom domain
5. Cập nhật DNS records

### Bước 5: Cấu hình Environment Variables
1. Vercel Dashboard > Project Settings
2. Environment Variables
3. Thêm các biến từ file `.env.local`

---

## ☁️ **Phương pháp 2: Netlify**

### Bước 1: Build project
```bash
npm run build
```

### Bước 2: Deploy lên Netlify
1. Tạo tài khoản Netlify
2. Drag & drop thư mục `.next` lên Netlify
3. Hoặc connect GitHub repository

### Bước 3: Cấu hình
- Build command: `npm run build`
- Publish directory: `.next`
- Environment variables: Thêm trong Netlify dashboard

---

## 🐳 **Phương pháp 3: Docker**

### Bước 1: Tạo Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Bước 2: Build và run
```bash
# Build image
docker build -t hoanglinh-medicine .

# Run container
docker run -p 3000:3000 hoanglinh-medicine
```

---

## 🖥️ **Phương pháp 4: VPS/Server**

### Bước 1: Chuẩn bị server
- Ubuntu/CentOS server
- Node.js 18+
- Nginx
- PM2 (process manager)

### Bước 2: Upload code
```bash
# Clone repository
git clone your-repo-url
cd hoanglinh-medicine

# Install dependencies
npm install

# Build project
npm run build

# Start with PM2
pm2 start npm --name "hoanglinh-medicine" -- start
```

### Bước 3: Cấu hình Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 **Cấu hình sau khi deploy**

### 1. **SSL Certificate**
```bash
# Với Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

### 2. **Database (nếu cần)**
- PostgreSQL: Supabase, Railway, PlanetScale
- MongoDB: MongoDB Atlas
- MySQL: PlanetScale, Railway

### 3. **CDN & Performance**
- Cloudflare (miễn phí)
- Vercel Edge Network
- AWS CloudFront

---

## 📊 **Monitoring & Analytics**

### 1. **Performance Monitoring**
- Vercel Analytics
- Google Analytics
- Hotjar (user behavior)

### 2. **Error Tracking**
- Sentry
- LogRocket
- Bugsnag

---

## 🔒 **Security Checklist**

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API keys protected
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Security headers set

---

## 💰 **Chi phí ước tính**

### Vercel (Free tier):
- ✅ Hobby: $0/tháng
- ✅ Pro: $20/tháng
- ✅ Enterprise: Liên hệ

### Netlify (Free tier):
- ✅ Starter: $0/tháng
- ✅ Pro: $19/tháng
- ✅ Business: $99/tháng

### VPS:
- ✅ DigitalOcean: $5-20/tháng
- ✅ AWS EC2: $10-50/tháng
- ✅ Google Cloud: $10-50/tháng

---

## 🚀 **Deploy nhanh với Vercel**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Add custom domain
vercel domains add your-domain.com
```

**Kết quả**: Ứng dụng sẽ có URL như:
- `https://hoanglinh-medicine.vercel.app`
- `https://your-domain.com` (sau khi cấu hình domain)

---

## 📞 **Hỗ trợ**

Nếu gặp vấn đề trong quá trình deploy:
1. Kiểm tra logs trong Vercel/Netlify dashboard
2. Verify environment variables
3. Test build locally: `npm run build`
4. Check console errors

**Lưu ý**: Đây là dự án demo. Để production thực tế, cần:
- Database thực
- API keys thực
- SSL certificate
- Domain thực
- Compliance với quy định y tế 