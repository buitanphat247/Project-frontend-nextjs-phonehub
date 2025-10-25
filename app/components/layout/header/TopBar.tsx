"use client";

import Link from "next/link";
import { useState } from "react";
import { UserOutlined, HeartOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import MyButton from "../../MyButton";
import AuthModal from "./AuthModal";

export default function TopBar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <p>📞 Hotline: 1900 1234 | 🚚 Miễn phí vận chuyển</p>
            <div className="hidden md:flex space-x-4 items-center">
              <MyButton 
                size="small" 
                variant="secondary"
                icon={<UserOutlined />}
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                Đăng nhập
              </MyButton>
              {/* <Link 
                href="/wishlist" 
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <HeartOutlined />
                <span>Yêu thích</span>
              </Link>
              <Link 
                href="/help" 
                className="flex items-center space-x-1 hover:text-blue-200 transition-colors"
              >
                <CustomerServiceOutlined />
                <span>Hỗ trợ</span>
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
