export interface ProductSpecification {
  id: number
  productId: number
  groupName: string
  label: string
  value: string | string[]
  type: string
}

export interface ProductColor {
  id: number
  productId: number
  name: string
  slug: string
  hexColor: string
}

export interface ProductImage {
  id: number
  productId: number
  url: string
}

export interface Product {
  id: number
  name: string
  slug: string
  price: number
  originalPrice: number
  thumbnailImage: string
  brand: string
  category: {
    id: number
    name: string
    slug: string
  } | string // Support both API format and legacy format
  discount: string
  discountPercent: number
  isOnSale: boolean
  rating?: number
  reviews?: number
  isPublished: boolean
  specifications?: ProductSpecification[]
  colors?: ProductColor[]
  images?: ProductImage[]
  // Legacy support
  image?: string
}

