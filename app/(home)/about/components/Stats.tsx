'use client'

import React from 'react'

const Stats = () => {
  const stats = [
    {
      icon: <i className="fas fa-users text-4xl"></i>,
      iconColor: "text-blue-300",
      number: "50,000+",
      label: "Khách hàng tin tưởng",
      description: "Số lượng khách hàng đã sử dụng dịch vụ"
    },
    {
      icon: <i className="fas fa-shopping-cart text-4xl"></i>,
      iconColor: "text-green-300",
      number: "100,000+",
      label: "Sản phẩm đã bán",
      description: "Tổng số sản phẩm đã giao đến khách hàng"
    },
    {
      icon: <i className="fas fa-star text-4xl"></i>,
      iconColor: "text-yellow-300",
      number: "4.9/5",
      label: "Đánh giá trung bình",
      description: "Điểm đánh giá từ khách hàng"
    },
    {
      icon: <i className="fas fa-trophy text-4xl"></i>,
      iconColor: "text-purple-300",
      number: "15+",
      label: "Năm kinh nghiệm",
      description: "Thời gian hoạt động trong ngành"
    }
  ]

  return (
    <section className="py-20 bg-linear-to-r from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Thành tựu của chúng tôi</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Những con số ấn tượng phản ánh sự tin tưởng và ủng hộ của khách hàng
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-center"
            >
              <div className={`mb-6 flex justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-3 text-yellow-300">{stat.number}</div>
              <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats