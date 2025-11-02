"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Spin } from "antd";
import { getAuthData } from "../../../lib/utils/cookie";
import { toast } from "react-toastify";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

// Kiểm tra role admin
function isAdmin(authData: any): boolean {
  if (!authData) return false;
  
  const roleName = authData.roleName?.toLowerCase();
  const roleId = authData.roleId?.toString();
  
  return roleId === '1' || roleName === 'admin';
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const authData = getAuthData();
      
      if (!authData || !authData.token) {
        toast.warn("Vui lòng đăng nhập để truy cập trang này");
        router.push(`/?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!isAdmin(authData)) {
        toast.error("Bạn không có quyền truy cập trang này");
        router.push('/');
        return;
      }

      setIsAdminUser(true);
      setIsChecking(false);
    };

    checkAdmin();
  }, [router, pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="text-gray-600 mt-4">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return null;
  }

  return <>{children}</>;
}

