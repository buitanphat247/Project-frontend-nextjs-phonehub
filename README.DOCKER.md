# Hướng dẫn Docker cho Frontend

## Trường hợp A: Development Local (Khuyến nghị)

**Frontend chạy local, Backend chạy Docker**

### Bước 1: Tạo file `.env.local` trong thư mục gốc

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

### Bước 2: Chạy Backend trong Docker

```bash
# Chạy backend (giả sử bạn đã có docker-compose cho backend)
docker compose up -d backend
# Hoặc nếu backend chạy riêng:
# docker run -d -p 8080:8080 your-backend-image:latest
```

### Bước 3: Chạy Frontend local

```bash
npm install
npm run dev
```

✅ **Xong!** Frontend sẽ chạy tại `http://localhost:3000` và kết nối với backend tại `http://localhost:8080/api/v1`

---

## Trường hợp B: Production (Cả FE và BE trong Docker)

**Chỉ dùng khi deploy production**

### Bước 1: Build và chạy với docker-compose

```bash
# Build frontend image
docker build -t frontend:latest .

# Hoặc dùng docker-compose (nếu đã có file docker-compose.yml)
docker compose up -d --build
```

### Bước 2: Cấu hình Base URL

Trong `docker-compose.yml`, set environment variable:

```yaml
environment:
  - NEXT_PUBLIC_API_BASE_URL=http://backend:8080/api/v1  # Nếu cùng network
  # Hoặc
  - NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api/v1  # Nếu BE ở server khác
```

---

## Lưu ý

1. **Development**: KHÔNG cần Docker cho frontend, chỉ cần `.env.local`
2. **Production**: Cần Docker cho frontend, dùng `Dockerfile` và `docker-compose.yml`
3. Backend phải expose port `8080` ra host để frontend có thể kết nối

