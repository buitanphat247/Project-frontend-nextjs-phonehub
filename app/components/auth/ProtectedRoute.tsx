"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { getAuthData } from "../../../lib/utils/cookie";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check auth ngay (giống Header - không delay, không state)
    const authData = getAuthData();
    const authenticated = !!(authData?.token);
    
    if (!authenticated) {
      toast.warn("Vui lòng đăng nhập để truy cập trang này");
      router.push(`/?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [router, pathname]);

  // Render children luôn (middleware đã handle redirect ở server-side)
  // Nếu chưa auth, middleware sẽ redirect trước khi render
  // Giống Header - không check state, chỉ check trong useEffect để redirect
  return <>{children}</>;
}

