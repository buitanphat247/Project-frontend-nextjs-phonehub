export interface User {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  birthday?: string;
  points?: number;
  roleId?: number;
  roleName?: string;
  rankId?: number;
  rankName?: string;
  createdAt: string;
  updatedAt: string;
}

