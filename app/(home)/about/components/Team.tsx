'use client'

import React from 'react'
import { LinkedinOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons'

const Team = () => {
  const teamMembers = [
    {
      name: "Nguyễn Văn An",
      position: "CEO & Founder",
      image: "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=4f46e5&color=fff&size=200&bold=true",
      description: "15 năm kinh nghiệm trong ngành công nghệ, từng làm việc tại các tập đoàn lớn.",
      social: {
        linkedin: "#",
        twitter: "#",
        facebook: "#"
      }
    },
    {
      name: "Trần Thị Bình",
      position: "CTO",
      image: "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=ec4899&color=fff&size=200&bold=true",
      description: "Chuyên gia công nghệ với bằng tiến sĩ về Khoa học Máy tính từ MIT.",
      social: {
        linkedin: "#",
        twitter: "#",
        facebook: "#"
      }
    },
    {
      name: "Lê Minh Cường",
      position: "Head of Sales",
      image: "https://ui-avatars.com/api/?name=Le+Minh+Cuong&background=10b981&color=fff&size=200&bold=true",
      description: "Chuyên gia kinh doanh với 10 năm kinh nghiệm trong lĩnh vực bán lẻ.",
      social: {
        linkedin: "#",
        twitter: "#",
        facebook: "#"
      }
    },
    {
      name: "Phạm Thị Dung",
      position: "Head of Marketing",
      image: "https://ui-avatars.com/api/?name=Pham+Thi+Dung&background=f59e0b&color=fff&size=200&bold=true",
      description: "Chuyên gia marketing số với nhiều chiến dịch thành công trong ngành.",
      social: {
        linkedin: "#",
        twitter: "#",
        facebook: "#"
      }
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Đội ngũ của chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Những con người tài năng và tận tâm đang xây dựng tương lai của PhoneHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
            >
              <div className="p-6 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-4 border-gray-100 transform hover:scale-110 transition-transform duration-300 shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient background with initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = 'w-24 h-24 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-gray-100 transform hover:scale-110 transition-transform duration-300 shadow-lg';
                        const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
                        parent.textContent = initials;
                        parent.style.fontSize = '1.5rem';
                        parent.style.fontWeight = 'bold';
                        parent.style.color = '#6366f1';
                      }
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-3 text-sm">{member.position}</p>
                <p className="text-gray-600 text-xs mb-6 leading-relaxed">{member.description}</p>
                
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.social.linkedin}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <LinkedinOutlined className="text-sm" />
                  </a>
                  <a
                    href={member.social.twitter}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300"
                  >
                    <TwitterOutlined className="text-sm" />
                  </a>
                  <a
                    href={member.social.facebook}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <FacebookOutlined className="text-sm" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team