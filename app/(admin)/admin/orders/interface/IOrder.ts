export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  isReviewed?: boolean;
  reviewId?: number | null;
  reviewRating?: number | null;
  reviewComment?: string | null;
  reviewCreatedAt?: string | null;
  createdAt?: string;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  totalPrice: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[] | null;
}

