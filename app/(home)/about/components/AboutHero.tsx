'use client'

import React from 'react'

const AboutHero = () => {
  return (
    <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-white rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-white/20 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/30">
            <i className="fas fa-star text-yellow-300 mr-2"></i>
            <span className="text-sm font-semibold">Được tin tưởng bởi 50,000+ khách hàng</span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Về{' '}
            <span className="bg-linear-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              PhoneHub
            </span>
          </h1>
          
          {/* Description */}
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed max-w-3xl mx-auto">
            Điểm đến tin cậy cho những sản phẩm điện tử chất lượng cao, 
            với dịch vụ chuyên nghiệp và giá cả cạnh tranh nhất thị trường.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">50K+</div>
              <div className="text-sm md:text-base text-blue-100">Khách hàng</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-sm md:text-base text-blue-100">Sản phẩm</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">99%</div>
              <div className="text-sm md:text-base text-blue-100">Hài lòng</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">24/7</div>
              <div className="text-sm md:text-base text-blue-100">Hỗ trợ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-white/10 backdrop-blur-md border-t border-white/20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                <i className="fas fa-trophy text-2xl text-yellow-300"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Chất lượng hàng đầu</h3>
              <p className="text-sm text-blue-100">Sản phẩm chính hãng 100%</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                <i className="fas fa-heart text-2xl text-yellow-300"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dịch vụ tận tâm</h3>
              <p className="text-sm text-blue-100">Hỗ trợ 24/7 chuyên nghiệp</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all duration-300">
                <i className="fas fa-star text-2xl text-yellow-300"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Giá cả cạnh tranh</h3>
              <p className="text-sm text-blue-100">Giá tốt nhất thị trường</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutHero
