export interface UserInfo {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
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
