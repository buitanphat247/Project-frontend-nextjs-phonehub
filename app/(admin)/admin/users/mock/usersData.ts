import { User } from '../interface/IUser';

export const roleMap: Record<number, string> = {
  1: 'Admin',
  2: 'Staff',
  3: 'User',
};

export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'tan270407@gmail.com',
    phone: '0984380205',
    address: '50/14 võ thị sáu',
    avatar: 'https://cellphones.com.vn/sforum/avatar.webp',
    role_id: 1,
    role_name: 'Admin',
    created_at: '2025-10-27 14:11:18',
    updated_at: '2025-10-27 15:06:55',
  },
  {
    id: 2,
    username: 'user',
    email: 'sonthai806@gmail.com',
    phone: '0984380205',
    address: '50/14 võ thị sáu',
    avatar: 'https://cellphones.com.vn/sforum/avatar2.webp',
    role_id: 3,
    role_name: 'User',
    created_at: '2025-10-27 14:11:59',
    updated_at: '2025-10-27 14:12:29',
  },
  {
    id: 3,
    username: 'buitanphat',
    email: 'buitanphat@gmail.com',
    phone: '0123456789',
    address: '123 oxford',
    avatar: 'https://cellphones.com.vn/sforum/avatar3.webp',
    role_id: 3,
    role_name: 'User',
    created_at: '2025-10-27 14:13:08',
    updated_at: '2025-10-27 15:06:00',
  },
];

