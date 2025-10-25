import React from 'react'
import { Button } from 'antd'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons'

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <PhoneOutlined className="text-2xl text-blue-600" />,
      title: "Điện thoại",
      content: "1900 1234",
      description: "Hỗ trợ 24/7"
    },
    {
      icon: <MailOutlined className="text-2xl text-green-600" />,
      title: "Email",
      content: "info@phonehub.vn",
      description: "Phản hồi trong 24h"
    },
    {
      icon: <EnvironmentOutlined className="text-2xl text-red-600" />,
      title: "Địa chỉ",
      content: "123 Nguyễn Huệ, Q1, TP.HCM",
      description: "Trung tâm thành phố"
    },
    {
      icon: <ClockCircleOutlined className="text-2xl text-purple-600" />,
      title: "Giờ làm việc",
      content: "8:00 - 22:00",
      description: "Tất cả các ngày trong tuần"
    }
  ]

  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 text-center border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
              <div className="mb-6">
                {info.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-lg font-semibold text-blue-600 mb-2">{info.content}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 hover:border-blue-300 transition-all duration-300 cursor-pointer">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Sẵn sàng bắt đầu?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí 
            về các sản phẩm phù hợp nhất với nhu cầu của bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              type="primary" 
              size="large"
              icon={<PhoneOutlined />}
              className="bg-blue-600 hover:bg-blue-700 font-semibold px-8 py-4 h-auto cursor-pointer"
            >
              Gọi ngay: 1900 1234
            </Button>
            
            <Button 
              size="large"
              icon={<MailOutlined />}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 h-auto cursor-pointer"
            >
              Gửi email
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactSection