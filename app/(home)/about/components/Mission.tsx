'use client'

import React from 'react'

const Mission = () => {
  const missions = [
    {
      icon: <i className="fas fa-rocket text-2xl text-white"></i>,
      bgColor: "bg-blue-600",
      cardBg: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverBg: "hover:bg-blue-100",
      hoverBorder: "hover:border-blue-400",
      title: "Đổi mới liên tục",
      description: "Luôn cập nhật những công nghệ mới nhất, mang đến trải nghiệm tuyệt vời cho khách hàng."
    },
    {
      icon: <i className="fas fa-bullseye text-2xl text-white"></i>,
      bgColor: "bg-green-600",
      cardBg: "bg-green-50",
      borderColor: "border-green-200",
      hoverBg: "hover:bg-green-100",
      hoverBorder: "hover:border-green-400",
      title: "Chất lượng hàng đầu",
      description: "Cam kết cung cấp sản phẩm chính hãng 100%, với chế độ bảo hành toàn diện và dịch vụ hậu mãi chu đáo."
    },
    {
      icon: <i className="fas fa-check-circle text-2xl text-white"></i>,
      bgColor: "bg-purple-600",
      cardBg: "bg-purple-50",
      borderColor: "border-purple-200",
      hoverBg: "hover:bg-purple-100",
      hoverBorder: "hover:border-purple-400",
      title: "Khách hàng là trung tâm",
      description: "Đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu, xây dựng mối quan hệ lâu dài và tin cậy."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mang đến những sản phẩm công nghệ chất lượng cao với giá cả hợp lý, 
            cùng dịch vụ chuyên nghiệp và tận tâm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missions.map((mission, index) => (
            <div
              key={index}
              className={`text-center p-8 ${mission.cardBg} rounded-2xl border-2 ${mission.borderColor} ${mission.hoverBg} ${mission.hoverBorder} transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:shadow-lg`}
            >
              <div className={`w-16 h-16 ${mission.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                {mission.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{mission.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {mission.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Mission