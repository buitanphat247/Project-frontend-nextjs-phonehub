"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { App } from "antd";
import { UserOutlined, HeartOutlined, CustomerServiceOutlined, LogoutOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import MyButton from "../../MyButton";
import AuthModal from "./AuthModal";
import { isAuthenticated, getAuthData, clearAuthData } from "../../../../lib/utils/cookie";

interface AuthState {
  authenticated: boolean
  userData: {
    username: string
    email: string
  } | null
}

interface TopBarProps {
  initialAuth: AuthState
}

export default function TopBar({ initialAuth }: TopBarProps) {
  const { modal } = App.useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(initialAuth.authenticated);
  const [userData, setUserData] = useState<{ username: string; email: string } | null>(initialAuth.userData);

  // Use useEffect for event listeners and interval
  useEffect(() => {
    const checkAuth = () => {
      const auth = isAuthenticated();
      setAuthenticated(auth);
      if (auth) {
        const data = getAuthData();
        if (data) {
          setUserData({ username: data.username, email: data.email });
        }
      } else {
        setUserData(null);
      }
    };

    // Listen for storage changes (when login/logout happens)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check periodically in case cookie changes without storage event
    const interval = setInterval(checkAuth, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    modal.confirm({
      title: 'Xác nhận đăng xuất',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn đăng xuất không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      maskClosable: true,
      keyboard: true,
      onOk() {
        clearAuthData();
        setAuthenticated(false);
        setUserData(null);
        window.location.reload();
      },
    });
  };

  return (
    <>
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <p>📞 Hotline: 1900 1234 | 🚚 Miễn phí vận chuyển</p>
            <div className="hidden md:flex space-x-4 items-center">
              {authenticated && userData ? (
                <>
                  <div className="flex items-center space-x-2 text-white/90">
                    <UserOutlined />
                    <span className="text-sm">
                      <span className="font-medium">{userData.username}</span>
                      <span className="text-white/70 ml-2">({userData.email})</span>
                    </span>
                  </div>
                  {/* <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-1 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded transition-colors cursor-pointer"
                  >
                    <LogoutOutlined />
                    <span>Đăng xuất</span>
                  </button> */}
                </>
              ) : (
                <MyButton 
                  size="small" 
                  variant="secondary"
                  icon={<UserOutlined />}
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
                >
                  Đăng nhập
                </MyButton>
              )}
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
