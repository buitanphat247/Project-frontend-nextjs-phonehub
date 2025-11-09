# Security Headers Checklist - Kiểm tra Bảo mật

## Bảng kiểm tra Security Headers

| Mục                                       | Trạng thái | Giải thích chi tiết                                                                                                      | Cấu hình hiện tại                                                      |
| ----------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| **CSP (Content Security Policy)**         | ✅ Đã cấu hình | Bảo vệ website khỏi tấn công **XSS (Cross-site scripting)** bằng cách chỉ cho phép tải tài nguyên từ nguồn bạn chỉ định. | `Content-Security-Policy: default-src 'self'; frame-ancestors 'none'; require-trusted-types-for 'script'` |
| **HSTS (HTTP Strict Transport Security)** | ✅ Đã cấu hình | Bắt buộc trình duyệt chỉ dùng HTTPS, giúp ngăn **downgrade attack (HTTP → HTTPS)**.                                      | `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` |
| **COOP (Cross-Origin Opener Policy)**     | ✅ Đã cấu hình | Ngăn các tab hoặc cửa sổ khác truy cập cùng quy trình (process) — giúp tăng bảo mật và tách biệt nguồn.                  | `Cross-Origin-Opener-Policy: same-origin-allow-popups` (linh hoạt hơn `same-origin`) |
| **XFO hoặc CSP chống clickjacking**       | ✅ Đã cấu hình | Bảo vệ website khỏi **clickjacking** (kẻ tấn công chèn web bạn vào iframe và dụ người dùng click).                       | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` (double protection) |
| **Trusted Types**                         | ✅ Đã cấu hình | Giúp ngăn lỗi **XSS DOM-based** bằng cách giới hạn nguồn dữ liệu được chèn vào DOM.                                      | CSP: `require-trusted-types-for 'script'` + `trusted-types default 'allow-duplicates'` |

## Chi tiết cấu hình

### 1. Content Security Policy (CSP) ✅

**Header**: `Content-Security-Policy`

**Cấu hình**:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://vitals.vercel-insights.com https://cdnjs.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
img-src 'self' data: blob: https: http:;
font-src 'self' data: https://fonts.gstatic.com https://cdnjs.cloudflare.com;
connect-src 'self' https://phonehub.vn http://localhost:8080 https://vercel.live https://vitals.vercel-insights.com;
frame-ancestors 'none';
upgrade-insecure-requests;
block-all-mixed-content;
require-trusted-types-for 'script';
trusted-types default 'allow-duplicates';
```

**Bảo vệ**:
- ✅ Chống XSS attacks
- ✅ Chống clickjacking (frame-ancestors 'none')
- ✅ Chống DOM-based XSS (Trusted Types)

### 2. HTTP Strict Transport Security (HSTS) ✅

**Header**: `Strict-Transport-Security`

**Cấu hình**:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Bảo vệ**:
- ✅ Bắt buộc HTTPS
- ✅ Chống downgrade attacks
- ✅ Áp dụng cho tất cả subdomains
- ✅ Đủ điều kiện cho HSTS preload list

### 3. Cross-Origin-Opener-Policy (COOP) ✅

**Header**: `Cross-Origin-Opener-Policy`

**Cấu hình hiện tại**:
```
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

**Lưu ý**: 
- Sử dụng `same-origin-allow-popups` thay vì `same-origin` để cho phép popups (cần cho một số tính năng)
- Vẫn bảo vệ khỏi cross-origin attacks
- Nếu cần strict hơn, có thể đổi sang `same-origin`

**Bảo vệ**:
- ✅ Tách biệt nguồn gốc
- ✅ Bảo vệ khỏi cross-origin attacks
- ✅ Cho phép popups khi cần

### 4. X-Frame-Options + CSP frame-ancestors ✅

**Headers**: 
- `X-Frame-Options: DENY`
- CSP: `frame-ancestors 'none'`

**Bảo vệ**:
- ✅ Chống clickjacking (double protection)
- ✅ Không cho phép website được embed trong iframe

### 5. Trusted Types ✅

**Cấu hình trong CSP**:
```
require-trusted-types-for 'script';
trusted-types default 'allow-duplicates';
```

**Bảo vệ**:
- ✅ Giảm thiểu DOM-based XSS
- ✅ Kiểm soát dữ liệu được chèn vào DOM

## Các Security Headers bổ sung

### 6. Cross-Origin-Embedder-Policy (COEP) ✅
```
Cross-Origin-Embedder-Policy: credentialless
```
- Bảo vệ khỏi Spectre attacks
- Cân bằng giữa bảo mật và tương thích

### 7. Cross-Origin-Resource-Policy (CORP) ✅
```
Cross-Origin-Resource-Policy: cross-origin
```
- Kiểm soát resource sharing
- Cho phép load từ CDN

### 8. X-Content-Type-Options ✅
```
X-Content-Type-Options: nosniff
```
- Chống MIME type sniffing

### 9. Referrer-Policy ✅
```
Referrer-Policy: strict-origin-when-cross-origin
```
- Kiểm soát thông tin referrer

### 10. Permissions-Policy ✅
```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()
```
- Chặn các browser features không cần thiết

## Kiểm tra Security Headers

### 1. Browser DevTools
1. Mở DevTools (F12)
2. Tab **Network** → Chọn request → **Headers** → **Response Headers**

### 2. Online Tools
- [SecurityHeaders.com](https://securityheaders.com/) - Kiểm tra tất cả headers
- [Mozilla Observatory](https://observatory.mozilla.org/) - Phân tích bảo mật toàn diện
- [SSL Labs](https://www.ssllabs.com/ssltest/) - Kiểm tra SSL/TLS

### 3. Command Line
```bash
# Linux/Mac
curl -I https://phonehub.vn

# Windows PowerShell
Invoke-WebRequest -Uri https://phonehub.vn -Method Head
```

## Kết quả mong đợi

- ✅ **A+ Rating** trên SecurityHeaders.com
- ✅ **Bảo vệ khỏi XSS** (CSP + Trusted Types)
- ✅ **Bảo vệ khỏi clickjacking** (XFO + CSP frame-ancestors)
- ✅ **Bảo vệ khỏi downgrade attacks** (HSTS)
- ✅ **Bảo vệ khỏi Spectre** (COOP + COEP)
- ✅ **Bảo vệ khỏi MIME sniffing** (X-Content-Type-Options)

## Tùy chọn: Điều chỉnh COOP

Nếu cần strict hơn, có thể đổi COOP từ `same-origin-allow-popups` sang `same-origin`:

```typescript
// Trong middleware.ts
response.headers.set(
  'Cross-Origin-Opener-Policy',
  'same-origin' // Strict hơn, không cho phép popups
)
```

**Lưu ý**: Điều này có thể ảnh hưởng đến các tính năng sử dụng popups (như OAuth, payment gateways).

