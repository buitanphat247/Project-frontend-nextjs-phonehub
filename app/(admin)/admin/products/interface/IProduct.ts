export interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  categoryId: number;
  categoryName: string;
  price: number;
  priceOld: number;
  discount: string;
  thumbnailImage: string;
  quantity: number;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

