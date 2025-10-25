import React from 'react'

const Stats = () => {
  const stats = [
    {
      icon: <i className="fas fa-users text-4xl text-blue-600"></i>,
      number: "50,000+",
      label: "Khách hàng tin tưởng",
      description: "Số lượng khách hàng đã sử dụng dịch vụ của chúng tôi"
    },
    {
      icon: <i className="fas fa-shopping-cart text-4xl text-green-600"></i>,
      number: "100,000+",
      label: "Sản phẩm đã bán",
      description: "Tổng số sản phẩm đã được giao đến tay khách hàng"
    },
    {
      icon: <i className="fas fa-star text-4xl text-yellow-600"></i>,
      number: "4.9/5",
      label: "Đánh giá trung bình",
      description: "Điểm đánh giá từ khách hàng trên các nền tảng"
    },
    {
      icon: <i className="fas fa-trophy text-4xl text-purple-600"></i>,
      number: "15+",
      label: "Năm kinh nghiệm",
      description: "Thời gian hoạt động và phát triển trong ngành"
    }
  ]

  return (
    <div className="py-20 bg-linear-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Thành tựu của chúng tôi</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Những con số ấn tượng phản ánh sự tin tưởng và ủng hộ của khách hàng
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-[400px]">
          {stats.map((stat, index) => (
            <div key={index} className="text-center flex flex-col justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 h-full flex flex-col justify-center">
                <div className="mb-6 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-4">{stat.number}</div>
                <h3 className="text-xl font-semibold mb-2">{stat.label}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Stats