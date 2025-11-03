export interface UserInfo {
  name: string;
  email: string;
  address: string;
  phone: string;
  avatar: string;
  birthday?: string; // Format: YYYY-MM-DD from API
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  rankName?: string;
  rankDiscount?: number;
}

export interface Order {
  id: number;
  product: string;
  status: string;
  date: string;
  total: number;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
