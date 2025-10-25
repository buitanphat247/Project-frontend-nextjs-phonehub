import React from 'react'
import { Button } from 'antd'

const AboutHero = () => {
  return (
    <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-20 left-32 w-12 h-12 bg-white rounded-full"></div>
        <div className="absolute bottom-32 right-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-white rounded-full"></div>
        <div className="absolute top-1/3 right-1/3 w-14 h-14 bg-white rounded-full"></div>
      </div>

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <i className="fas fa-star text-yellow-300 mr-2"></i>
              <span className="text-sm font-medium">Được tin tưởng bởi 50,000+ khách hàng</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Về 
              <span className="block bg-linear-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                PhoneHub
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Điểm đến tin cậy cho những sản phẩm điện tử chất lượng cao, 
              với dịch vụ chuyên nghiệp và giá cả cạnh tranh nhất thị trường.
            </p>
            
            
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-yellow-300 mb-2">50K+</div>
              <div className="text-blue-100">Khách hàng hài lòng</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-yellow-300 mb-2">10K+</div>
              <div className="text-blue-100">Sản phẩm đa dạng</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-yellow-300 mb-2">99%</div>
              <div className="text-blue-100">Tỷ lệ hài lòng</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
              <div className="text-4xl font-bold text-yellow-300 mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trophy text-2xl text-yellow-300"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Chất lượng hàng đầu</h3>
            <p className="text-blue-100">Sản phẩm chính hãng 100%, bảo hành toàn diện</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-heart text-2xl text-yellow-300"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Dịch vụ tận tâm</h3>
            <p className="text-blue-100">Hỗ trợ khách hàng 24/7, tư vấn chuyên nghiệp</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-star text-2xl text-yellow-300"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Giá cả cạnh tranh</h3>
            <p className="text-blue-100">Giá tốt nhất thị trường, nhiều ưu đãi hấp dẫn</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutHero
