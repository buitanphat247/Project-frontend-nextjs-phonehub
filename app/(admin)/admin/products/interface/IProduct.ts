export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category_id: number;
  category_name: string;
  stock: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

