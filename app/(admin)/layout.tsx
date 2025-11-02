"use client";

import { useState, useRef, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedAdminRoute from "../components/auth/ProtectedAdminRoute";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Sử dụng ResizeObserver để theo dõi thay đổi kích thước của header
    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
      updateHeaderHeight();
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ProtectedAdminRoute>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Header cố định ở trên */}
        <AdminHeader ref={headerRef} collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Phần dưới chia 2 cột: sidebar và content */}
        <div style={{ display: "flex", flex: 1, marginTop: `${headerHeight}px` }}>
          <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} headerHeight={headerHeight} />
          <main
            className="p-4"
            style={{
              flex: 1,
              background: "#f0f2f5",
              minHeight: `calc(100vh - ${headerHeight}px)`,
              marginLeft: collapsed ? 80 : 250,
              transition: "margin-left 0.2s",
            }}
          >
            {children}
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </ProtectedAdminRoute>
  );
}
