import React from 'react'
import { LinkedinOutlined, TwitterOutlined, FacebookOutlined } from '@ant-design/icons'

const Team = () => {
  const teamMembers = [
    {
      name: "Nguyễn Văn An",
      position: "CEO & Founder",
      image: "👨‍💼",
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
      image: "👩‍💻",
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
      image: "👨‍💼",
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
      image: "👩‍💼",
      description: "Chuyên gia marketing số với nhiều chiến dịch thành công trong ngành.",
      social: {
        linkedin: "#",
        twitter: "#",
        facebook: "#"
      }
    }
  ]

  return (
    <div className="py-20 bg-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Đội ngũ của chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những con người tài năng và tận tâm đang xây dựng tương lai của PhoneHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 cursor-pointer">
              <div className="p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  {member.image}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-semibold mb-4">{member.position}</p>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">{member.description}</p>
                
                <div className="flex justify-center space-x-4">
                  <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <LinkedinOutlined className="text-xl" />
                  </a>
                  <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                    <TwitterOutlined className="text-xl" />
                  </a>
                  <a href={member.social.facebook} className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <FacebookOutlined className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Team