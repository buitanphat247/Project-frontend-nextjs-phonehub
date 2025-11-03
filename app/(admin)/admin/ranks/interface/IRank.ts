export interface Rank {
  id: number;
  name: string;
  minPoints: number;
  maxPoints?: number;
  discountPercent?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

