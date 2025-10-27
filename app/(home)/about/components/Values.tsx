import React from 'react'

const Values = () => {
  const values = [
    {
      icon: <i className="fas fa-heart text-3xl text-red-500"></i>,
      title: "Tận tâm",
      description: "Luôn đặt khách hàng làm trung tâm, phục vụ với tất cả sự tận tâm và chuyên nghiệp."
    },
    {
      icon: <i className="fas fa-shield-alt text-3xl text-blue-500"></i>,
      title: "Tin cậy",
      description: "Xây dựng niềm tin thông qua sản phẩm chất lượng và dịch vụ minh bạch, rõ ràng."
    },
    {
      icon: <i className="fas fa-users text-3xl text-green-500"></i>,
      title: "Đồng đội",
      description: "Làm việc nhóm hiệu quả, hỗ trợ lẫn nhau để mang đến kết quả tốt nhất."
    },
    {
      icon: <i className="fas fa-lightbulb text-3xl text-yellow-500"></i>,
      title: "Sáng tạo",
      description: "Không ngừng đổi mới, tìm kiếm giải pháp sáng tạo để phục vụ khách hàng tốt hơn."
    }
  ]

  return (
    <div className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Giá trị cốt lõi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những nguyên tắc và giá trị định hướng mọi hoạt động của PhoneHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 cursor-pointer min-h-[250px] flex flex-col justify-center">
              <div className="mb-6">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Values