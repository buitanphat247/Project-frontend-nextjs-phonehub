'use client'

import { useState, useEffect } from 'react'

interface FiltersProps {
  onFilterChange: (filters: any) => void
  currentFilters: any
  brands: Array<{ value: string; label: string }>
  loadingBrands?: boolean
}

export default function SmartwatchesFilters({ onFilterChange, currentFilters, brands, loadingBrands = false }: FiltersProps) {
  const [localFilters, setLocalFilters] = useState(currentFilters)

  useEffect(() => {
    setLocalFilters(currentFilters)
  }, [currentFilters])

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

  const priceRanges = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '0-3000000', label: 'Dưới 3 triệu' },
    { value: '3000000-8000000', label: '3 - 8 triệu' },
    { value: '8000000-15000000', label: '8 - 15 triệu' },
    { value: '15000000-', label: 'Trên 15 triệu' }
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
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
          value={localFilters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Nhập tên sản phẩm..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-text"
        />
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thương hiệu
        </label>
        <select
          value={localFilters.brand || 'all'}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          disabled={loadingBrands || !!localFilters.search}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
        >
          {loadingBrands ? (
            <option value="">Đang tải...</option>
          ) : (
            brands.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6 opacity-50">
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Mức giá (Tạm khóa)
        </label>
        <select
          value={localFilters.priceRange || ''}
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
      {(localFilters.brand || localFilters.priceRange || localFilters.search) && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Bộ lọc đang áp dụng:</h4>
          <div className="flex flex-wrap gap-2">
            {localFilters.brand && localFilters.brand !== 'all' && (
              <span 
                onClick={() => handleFilterChange('brand', 'all')}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-green-200 transition-colors"
              >
                {brands.find(b => b.value === localFilters.brand)?.label || localFilters.brand}
              </span>
            )}
            {localFilters.priceRange && (
              <span 
                onClick={() => handleFilterChange('priceRange', '')}
                className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-orange-200 transition-colors"
              >
                {priceRanges.find(p => p.value === localFilters.priceRange)?.label}
              </span>
            )}
            {localFilters.search && (
              <span 
                onClick={() => handleFilterChange('search', '')}
                className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-purple-200 transition-colors"
              >
                "{localFilters.search}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

