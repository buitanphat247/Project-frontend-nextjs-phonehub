import React from 'react'

const Mission = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mang đến những sản phẩm công nghệ chất lượng cao với giá cả hợp lý, 
            cùng dịch vụ chuyên nghiệp và tận tâm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-blue-50 rounded-2xl border border-gray-200 hover:border-blue-300 hover:bg-blue-100 transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-rocket text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Đổi mới liên tục</h3>
            <p className="text-gray-600 leading-relaxed">
              Luôn cập nhật những công nghệ mới nhất, mang đến trải nghiệm 
              tuyệt vời cho khách hàng.
            </p>
          </div>

          <div className="text-center p-8 bg-green-50 rounded-2xl border border-gray-200 hover:border-green-300 hover:bg-green-100 transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-bullseye text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Chất lượng hàng đầu</h3>
            <p className="text-gray-600 leading-relaxed">
              Cam kết cung cấp sản phẩm chính hãng 100%, với chế độ bảo hành 
              toàn diện và dịch vụ hậu mãi chu đáo.
            </p>
          </div>

          <div className="text-center p-8 bg-purple-50 rounded-2xl border border-gray-200 hover:border-purple-300 hover:bg-purple-100 transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-2xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Khách hàng là trung tâm</h3>
            <p className="text-gray-600 leading-relaxed">
              Đặt nhu cầu và sự hài lòng của khách hàng lên hàng đầu, 
              xây dựng mối quan hệ lâu dài và tin cậy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mission