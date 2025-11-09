'use client'

import React from 'react'
import { Button } from 'antd'
import { PhoneOutlined, MailOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons'

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <PhoneOutlined className="text-2xl" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
      title: "Điện thoại",
      content: "1900 1234",
      description: "Hỗ trợ 24/7"
    },
    {
      icon: <MailOutlined className="text-2xl" />,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
      title: "Email",
      content: "info@phonehub.vn",
      description: "Phản hồi trong 24h"
    },
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "Địa chỉ",
      content: "123 Nguyễn Huệ, Q1, TP.HCM",
      description: "Trung tâm thành phố"
    },
    {
      icon: <ClockCircleOutlined className="text-2xl" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
      title: "Giờ làm việc",
      content: "8:00 - 22:00",
      description: "Tất cả các ngày trong tuần"
    }
  ]

  return (
    <section className="py-20 bg-linear-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn mọi lúc, mọi nơi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className={`w-16 h-16 ${info.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 ${info.iconColor} transform hover:scale-110 transition-transform duration-300`}>
                {info.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
              <p className="text-base font-semibold text-blue-700 mb-2">{info.content}</p>
              <p className="text-gray-600 text-sm">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng bắt đầu?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn miễn phí 
            về các sản phẩm phù hợp nhất với nhu cầu của bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="primary"
              size="large"
              icon={<PhoneOutlined />}
              className="bg-white text-blue-700 hover:bg-gray-100 border-0 font-semibold px-8 py-4 h-auto cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Gọi ngay: 1900 1234
            </Button>
            
            <Button
              size="large"
              icon={<MailOutlined />}
              className="bg-white/10 backdrop-blur-md text-white border-2 border-white/30 hover:bg-white/20 font-semibold px-8 py-4 h-auto cursor-pointer transition-all duration-300"
            >
              Gửi email
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection