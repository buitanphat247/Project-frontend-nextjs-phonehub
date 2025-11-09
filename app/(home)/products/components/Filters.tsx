'use client'

import { useState } from 'react'

interface FiltersProps {
  onFilterChange: (filters: any) => void
  currentFilters: any
  category: string
}

export default function Filters({ onFilterChange, currentFilters, category }: FiltersProps) {
  const [localFilters, setLocalFilters] = useState(currentFilters)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      brand: '',
      search: ''
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'phones', label: 'Điện thoại' },
    { value: 'laptops', label: 'Laptop' },
    { value: 'ipads', label: 'iPad' },
    { value: 'accessories', label: 'Phụ kiện' }
  ]

  const brands = [
    { value: 'all', label: 'Tất cả thương hiệu' },
    { value: 'apple', label: 'Apple' },
    { value: 'samsung', label: 'Samsung' },
    { value: 'xiaomi', label: 'Xiaomi' },
    { value: 'google', label: 'Google' },
    { value: 'oneplus', label: 'OnePlus' },
    { value: 'huawei', label: 'Huawei' },
    { value: 'dell', label: 'Dell' },
    { value: 'hp', label: 'HP' },
    { value: 'lenovo', label: 'Lenovo' },
    { value: 'asus', label: 'ASUS' },
    { value: 'msi', label: 'MSI' }
  ]

  const priceRanges = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '0-5000000', label: 'Dưới 5 triệu' },
    { value: '5000000-10000000', label: '5 - 10 triệu' },
    { value: '10000000-20000000', label: '10 - 20 triệu' },
    { value: '20000000-30000000', label: '20 - 30 triệu' },
    { value: '30000000-', label: 'Trên 30 triệu' }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-700 hover:text-blue-800"
        >
          Xóa bộ lọc
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <input
          type="text"
          value={localFilters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Nhập tên sản phẩm..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Danh mục
        </label>
        <select
          value={localFilters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thương hiệu
        </label>
        <select
          value={localFilters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {brands.map((brand) => (
            <option key={brand.value} value={brand.value}>
              {brand.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 opacity-50">
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Mức giá (Tạm khóa)
        </label>
        <select
          value={localFilters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Display */}
      {(localFilters.category || localFilters.brand || localFilters.priceRange || localFilters.search) && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Bộ lọc đang áp dụng:</h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.category && localFilters.category !== 'all' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {categories.find(c => c.value === localFilters.category)?.label}
              </span>
            )}
            {localFilters.brand && localFilters.brand !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {brands.find(b => b.value === localFilters.brand)?.label}
              </span>
            )}
            {localFilters.priceRange && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                {priceRanges.find(p => p.value === localFilters.priceRange)?.label}
              </span>
            )}
            {localFilters.search && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                "{localFilters.search}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
