# Tree Shaking và Dead Code Elimination - Tối ưu hóa

## Các cải thiện đã thực hiện

### 1. **Next.js Configuration (`next.config.ts`)**
- ✅ Bật `usedExports: true` - Đánh dấu exports được sử dụng
- ✅ **KHÔNG** set `sideEffects: false` global (sẽ tree-shake cả React context)
- ✅ **KHÔNG** thêm React alias (Next.js 16 đã tự động xử lý)
- ✅ Cấu hình `optimizePackageImports` cho các packages lớn:
  - `@ant-design/icons` - Tree shake icons không sử dụng
  - `antd` - Tree shake Ant Design components không sử dụng
  - `framer-motion` - Tree shake Framer Motion features không sử dụng

### 2. **Package.json Configuration**
- ✅ Thêm `sideEffects` array để đánh dấu các file có side effects (CSS, SCSS)
- ✅ Thêm script `analyze` để phân tích bundle size

### 3. **Code Optimizations**
- ✅ Loại bỏ unused React imports (Next.js 13+ không cần import React)
- ✅ Sử dụng dynamic import cho `unstable_cache` trong `lib/utils/cache.ts`
- ✅ Sử dụng named imports thay vì default imports khi có thể

## Best Practices

### ✅ Sử dụng ES Modules
```typescript
// ✅ Good - Named imports (tree-shakeable)
import { Button, Modal } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';

// ❌ Bad - Default imports (khó tree shake)
import Antd from 'antd';
```

### ✅ Dynamic Imports cho Code Splitting
```typescript
// ✅ Good - Dynamic import cho heavy modules
const { unstable_cache } = await import('next/cache');

// ✅ Good - Lazy loading components
const HeavyComponent = dynamic(() => import('./HeavyComponent'));
```

### ✅ Named Exports
```typescript
// ✅ Good - Named exports
export function myFunction() {}
export const myConstant = 'value';

// ❌ Bad - Default exports (khó tree shake)
export default { myFunction, myConstant };
```

## Dependencies cần kiểm tra

### Có thể tối ưu thêm:
1. **Toast Libraries**: Đang sử dụng cả `react-toastify` và `react-hot-toast`
   - Nên chọn một và loại bỏ cái còn lại
   - `react-hot-toast` nhẹ hơn và tree-shakeable tốt hơn

2. **Unused Dependencies**:
   - `@heroicons/react` - Kiểm tra xem có đang sử dụng không
   - `@heroui/react` - Kiểm tra xem có đang sử dụng không
   - `sweetalert2` - Kiểm tra xem có đang sử dụng không

## Kiểm tra Bundle Size

### Cài đặt Bundle Analyzer
```bash
npm i -D @next/bundle-analyzer cross-env
```

### Chạy phân tích bundle:

**Trên Linux/Mac:**
```bash
npm run analyze
```

**Trên Windows PowerShell:**
```bash
npm run analyze:win
```

Hoặc:
```powershell
$env:ANALYZE="true"; npm run build
```

### Kết quả:
Sau khi build xong, bundle analyzer sẽ tự động mở trình duyệt với:
- **Client bundles**: Hiển thị các file JS cho client-side
- **Server bundles**: Hiển thị các file JS cho server-side

### Cách đọc kết quả:
1. **Kích thước**: Box càng lớn = file càng nặng
2. **Màu sắc**: Các màu khác nhau đại diện cho các chunks khác nhau
3. **Click vào box**: Xem chi tiết các dependencies bên trong
4. **Tìm kiếm**: Dùng search box để tìm package cụ thể

### Các file thường "ăn" nhiều JS:
- `antd` - Ant Design components
- `@ant-design/icons` - Icons library
- `framer-motion` - Animation library
- `react-image-gallery` - Image gallery
- `swiper` - Carousel library

## Lưu ý

1. **CSS Files**: Phải được đánh dấu trong `sideEffects` vì chúng có side effects
2. **Global Styles**: Các file CSS global không thể tree shake
3. **Ant Design**: Đã được tối ưu với `optimizePackageImports`
4. **Icons**: Chỉ import icons cần thiết từ `@ant-design/icons`
5. **React Context**: Không set `sideEffects: false` global vì sẽ tree-shake cả React context
6. **React Version**: Đảm bảo chỉ có 1 phiên bản React bằng cách dùng resolve.alias

## Troubleshooting

### Lỗi `createContext is not a function`:
- **Nguyên nhân**: `sideEffects: false` trong webpack config đang tree-shake React context
- **Giải pháp**: Xóa `sideEffects: false` khỏi webpack config, chỉ dùng trong `package.json`
- **Fix**: Đã xóa `sideEffects: false` global

### Lỗi `Can't resolve 'react/jsx-runtime'`:
- **Nguyên nhân**: React alias trong webpack config gây conflict với Next.js internal resolution
- **Giải pháp**: Xóa React alias, Next.js 16 đã tự động xử lý React resolution
- **Fix**: Đã xóa React alias khỏi webpack config

### Xóa cache và rebuild:
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next
npm run build

# Linux/Mac
rm -rf .next
npm run build
```

## Kết quả mong đợi

- ✅ Giảm bundle size
- ✅ Cải thiện thời gian load
- ✅ Tối ưu hóa code splitting
- ✅ Loại bỏ dead code

