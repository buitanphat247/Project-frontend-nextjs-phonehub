'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  headerHeight?: number;
}

export default function AdminSidebar({ collapsed, setCollapsed, headerHeight = 64 }: AdminSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: 'products',
      icon: <ShopOutlined />,
      label: 'Sản phẩm',
      children: [
        {
          key: '/admin/products',
          icon: <ShopOutlined />,
          label: <Link href="/admin/products">Quản lý sản phẩm</Link>,
        },
        {
          key: '/admin/categories',
          icon: <AppstoreOutlined />,
          label: <Link href="/admin/categories">Danh mục</Link>,
        },
      ],
    },
    {
      key: '/admin/orders',
      icon: <ShoppingCartOutlined />,
      label: <Link href="/admin/orders">Quản lý đơn hàng</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link href="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: '/admin/roles',
      icon: <SecurityScanOutlined />,
      label: <Link href="/admin/roles">Quản lý vai trò</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link href="/admin/settings">Cài đặt</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={250}
      theme="light"
      style={{
        overflow: 'auto',
        height: `calc(100vh - ${headerHeight}px)`,
        position: 'fixed',
        left: 0,
        top: `${headerHeight}px`,
        bottom: 0,
      }}
    >
      <div className="border-b border-gray-200 py-2 text-center">
        <h2 className="text-2xl font-bold text-blue-600">
          {collapsed ? 'A' : 'Admin'}
        </h2>
      </div>
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[pathname]}
        items={menuItems}
      />
    </Sider>
  );
}
