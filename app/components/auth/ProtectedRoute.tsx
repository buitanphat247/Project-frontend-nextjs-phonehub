"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthData } from "../../../lib/utils/cookie";
import { showLoginRequired } from "../../../lib/utils/loginAlert";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authData = getAuthData();
    const authenticated = !!(authData?.token);
    
    if (!authenticated) {
      showLoginRequired("Bạn không có quyền truy cập trang này").then(() => {
        // Bắt buộc phải về trang chủ
        router.push(`/?redirect=${encodeURIComponent(pathname)}`);
      });
    }
  }, [router, pathname]);

  return <>{children}</>;
}

