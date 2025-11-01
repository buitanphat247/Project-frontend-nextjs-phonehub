import { Product } from '../interface/IProduct'

/**
 * Map category ID or slug to route path
 */
export function getCategoryRoute(product: Product): string {
  if (typeof product.category === 'string') {
    // Legacy format: map string category to route
    const categoryMap: Record<string, string> = {
      phones: 'phones',
      laptops: 'laptops',
      ipads: 'ipads',
      smartwatches: 'smartwatches',
    }
    return categoryMap[product.category] || product.category
  }
  
  // Map API category slug/id to route
  const categoryId = product.category.id
  const categorySlug = product.category.slug?.toLowerCase() || ''
  
  // Map by category ID (most reliable)
  if (categoryId === 2) return 'phones' // Điện thoại
  if (categoryId === 3) return 'laptops' // Laptop
  if (categoryId === 1) return 'ipads' // Máy tính bảng (iPad)
  if (categoryId === 5) return 'smartwatches' // Đồng hồ thông minh
  
  // Fallback: map by slug
  const slugMap: Record<string, string> = {
    mobile: 'phones',
    laptop: 'laptops',
    ipad: 'ipads',
    smartwatch: 'smartwatches',
    smartwatches: 'smartwatches',
  }
  
  return slugMap[categorySlug] || categorySlug || 'products'
}

