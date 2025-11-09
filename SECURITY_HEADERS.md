# Security Headers - Bảo mật và Chống tấn công

## Tổng quan

Dự án đã được cấu hình đầy đủ các security headers để bảo vệ khỏi các cuộc tấn công phổ biến như XSS, clickjacking, MIME sniffing, và các lỗ hổng bảo mật khác.

## Các Security Headers đã cấu hình

### 1. **Content Security Policy (CSP)** ✅

**Mục đích**: Chống XSS (Cross-Site Scripting) attacks

**Cấu hình**:
- `default-src 'self'` - Chỉ cho phép resources từ same origin
- `script-src` - Cho phép scripts từ same origin, inline (cần cho Next.js), và trusted CDNs
- `style-src` - Cho phép styles từ same origin, inline (cần cho Ant Design/Tailwind), và Google Fonts
- `img-src` - Cho phép images từ mọi nguồn HTTPS/HTTP (cần cho product images)
- `font-src` - Cho phép fonts từ Google Fonts và CDN
- `connect-src` - Cho phép API calls đến backend và Vercel Analytics
- `frame-ancestors 'none'` - Chống clickjacking
- `upgrade-insecure-requests` - Tự động upgrade HTTP lên HTTPS
- `block-all-mixed-content` - Chặn mixed content

**Trusted Types**:
- `require-trusted-types-for 'script'` - Yêu cầu Trusted Types cho scripts
- `trusted-types default 'allow-duplicates'` - Cho phép Trusted Types với duplicates

### 2. **HTTP Strict Transport Security (HSTS)** ✅

**Mục đích**: Bảo mật HTTPS, chống man-in-the-middle attacks

**Cấu hình**:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- `max-age=31536000` - Cache 1 năm
- `includeSubDomains` - Áp dụng cho tất cả subdomains
- `preload` - Đủ điều kiện cho HSTS preload list

### 3. **Cross-Origin-Opener-Policy (COOP)** ✅

**Mục đích**: Tách biệt nguồn gốc, bảo vệ khỏi Spectre attacks

**Cấu hình**:
```
Cross-Origin-Opener-Policy: same-origin-allow-popups
```

- `same-origin-allow-popups` - Chỉ cho phép same-origin windows, nhưng cho phép popups

### 4. **Cross-Origin-Embedder-Policy (COEP)** ✅

**Mục đích**: Bảo vệ khỏi Spectre attacks

**Cấu hình**:
```
Cross-Origin-Embedder-Policy: credentialless
```

- `credentialless` - Cân bằng giữa bảo mật và tương thích với external resources

### 5. **Cross-Origin-Resource-Policy (CORP)** ✅

**Mục đích**: Kiểm soát resource sharing

**Cấu hình**:
```
Cross-Origin-Resource-Policy: cross-origin
```

- `cross-origin` - Cho phép load resources từ external domains (cần cho CDN)

### 6. **X-Frame-Options** ✅

**Mục đích**: Chống clickjacking (backup cho CSP frame-ancestors)

**Cấu hình**:
```
X-Frame-Options: DENY
```

- `DENY` - Không cho phép website được embed trong iframe

### 7. **X-Content-Type-Options** ✅

**Mục đích**: Chống MIME type sniffing

**Cấu hình**:
```
X-Content-Type-Options: nosniff
```

- `nosniff` - Browser không được đoán MIME type, phải dùng Content-Type header

### 8. **Referrer-Policy** ✅

**Mục đích**: Kiểm soát thông tin referrer được gửi

**Cấu hình**:
```
Referrer-Policy: strict-origin-when-cross-origin
```

- `strict-origin-when-cross-origin` - Chỉ gửi origin khi cross-origin, full URL khi same-origin

### 9. **Permissions-Policy** ✅

**Mục đích**: Kiểm soát browser features

**Cấu hình**:
```
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()
```

- Tất cả các features đều bị chặn (empty list `()`)

### 10. **X-DNS-Prefetch-Control** ✅

**Mục đích**: Kiểm soát DNS prefetching

**Cấu hình**:
```
X-DNS-Prefetch-Control: on
```

- `on` - Cho phép DNS prefetching để cải thiện performance

## Cách kiểm tra Security Headers

### 1. **Browser DevTools**
1. Mở DevTools (F12)
2. Vào tab **Network**
3. Chọn một request
4. Xem tab **Headers** → **Response Headers**

### 2. **Online Tools**
- [SecurityHeaders.com](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### 3. **Command Line**
```bash
curl -I https://phonehub.vn
```

## Tối ưu hóa CSP (Tùy chọn)

### Sử dụng Nonce thay vì 'unsafe-inline'

**Hiện tại**: Sử dụng `'unsafe-inline'` cho scripts và styles

**Tối ưu hơn**: Sử dụng nonce để chỉ cho phép inline scripts/styles cụ thể

```typescript
// Tạo nonce trong middleware
const nonce = crypto.randomBytes(16).toString('base64')

// Set nonce trong CSP
`script-src 'self' 'nonce-${nonce}' https://vercel.live`

// Sử dụng nonce trong component
<script nonce={nonce}>...</script>
```

## Lưu ý

### CSP và External Resources

CSP hiện tại cho phép:
- ✅ Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`)
- ✅ Font Awesome CDN (`cdnjs.cloudflare.com`)
- ✅ Vercel Analytics (`vercel.live`, `vitals.vercel-insights.com`)
- ✅ Product images từ `phonehub.vn`

### Nếu cần thêm External Domain:

1. Thêm vào `script-src` nếu là script:
   ```typescript
   `script-src 'self' 'unsafe-inline' https://new-domain.com`
   ```

2. Thêm vào `style-src` nếu là stylesheet:
   ```typescript
   `style-src 'self' 'unsafe-inline' https://new-domain.com`
   ```

3. Thêm vào `connect-src` nếu là API:
   ```typescript
   `connect-src 'self' https://new-api-domain.com`
   ```

## Troubleshooting

### Lỗi CSP violations trong console:

1. Kiểm tra console để xem directive nào bị vi phạm
2. Thêm domain vào directive tương ứng
3. Hoặc sử dụng `report-uri` để nhận reports:
   ```typescript
   "report-uri /api/csp-report"
   ```

### Website không load sau khi thêm CSP:

1. Kiểm tra console để xem CSP violations
2. Tạm thời thêm `'unsafe-inline'` để test
3. Dần dần loại bỏ `'unsafe-inline'` và sử dụng nonce

### COEP/CORP blocking resources:

1. Kiểm tra external resources có CORS headers không
2. Điều chỉnh COEP từ `require-corp` sang `credentialless`
3. Điều chỉnh CORP từ `same-origin` sang `cross-origin`

## Kết quả mong đợi

- ✅ **A+ Rating** trên SecurityHeaders.com
- ✅ **Bảo vệ khỏi XSS** attacks
- ✅ **Bảo vệ khỏi clickjacking**
- ✅ **Bảo vệ khỏi MIME sniffing**
- ✅ **Bảo vệ khỏi Spectre** attacks
- ✅ **HTTPS enforcement** với HSTS
- ✅ **Trusted Types** để giảm DOM-based XSS

