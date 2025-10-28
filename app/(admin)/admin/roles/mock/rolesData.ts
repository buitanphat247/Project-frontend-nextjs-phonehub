import { Role } from '../interface/IRole';

export const mockRoles: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Toàn quyền truy cập hệ thống',
    permissions: 'all',
    created_at: '2025-01-01 10:00:00',
    updated_at: '2025-01-01 10:00:00',
  },
  {
    id: 2,
    name: 'Staff',
    description: 'Quản lý sản phẩm và đơn hàng',
    permissions: 'products,orders',
    created_at: '2025-01-02 10:00:00',
    updated_at: '2025-01-02 10:00:00',
  },
  {
    id: 3,
    name: 'User',
    description: 'Người dùng thông thường',
    permissions: 'view',
    created_at: '2025-01-03 10:00:00',
    updated_at: '2025-01-03 10:00:00',
  },
  {
    id: 4,
    name: 'Moderator',
    description: 'Quản lý người dùng và nội dung',
    permissions: 'users,content',
    created_at: '2025-01-04 10:00:00',
    updated_at: '2025-01-04 10:00:00',
  },
];
