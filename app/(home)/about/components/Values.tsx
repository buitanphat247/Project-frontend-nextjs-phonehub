'use client'

import React from 'react'

const Values = () => {
  const values = [
    {
      icon: <i className="fas fa-heart text-3xl"></i>,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "Tận tâm",
      description: "Luôn đặt khách hàng làm trung tâm, phục vụ với tất cả sự tận tâm và chuyên nghiệp."
    },
    {
      icon: <i className="fas fa-shield-alt text-3xl"></i>,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Tin cậy",
      description: "Xây dựng niềm tin thông qua sản phẩm chất lượng và dịch vụ minh bạch, rõ ràng."
    },
    {
      icon: <i className="fas fa-users text-3xl"></i>,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Đồng đội",
      description: "Làm việc nhóm hiệu quả, hỗ trợ lẫn nhau để mang đến kết quả tốt nhất."
    },
    {
      icon: <i className="fas fa-lightbulb text-3xl"></i>,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      title: "Sáng tạo",
      description: "Không ngừng đổi mới, tìm kiếm giải pháp sáng tạo để phục vụ khách hàng tốt hơn."
    }
  ]

  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Giá trị cốt lõi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Những nguyên tắc và giá trị định hướng mọi hoạt động của PhoneHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center border-2 border-gray-100 hover:border-gray-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col"
            >
              <div className={`w-20 h-20 ${value.iconBg} rounded-full flex items-center justify-center mx-auto mb-6 ${value.iconColor} transform hover:scale-110 transition-transform duration-300`}>
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Values