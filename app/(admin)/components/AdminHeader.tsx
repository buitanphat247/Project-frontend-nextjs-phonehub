'use client';

import { Layout, Button, Badge, Space, Avatar, Dropdown } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { forwardRef } from 'react';
import type { MenuProps } from 'antd';

const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminHeader = forwardRef<HTMLDivElement, AdminHeaderProps>(({ collapsed, setCollapsed }, ref) => {
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      console.log('Logout clicked');
      // Xử lý đăng xuất ở đây
    }
  };

  return (
    <Header
      ref={ref}
      style={{
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: 'auto',
        minHeight: '64px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
      />
      
      <Space size="large">
        {/* <Badge count={5}>
          <Button
            type="text"
            icon={<BellOutlined style={{ fontSize: '20px' }} />}
            style={{ fontSize: '20px' }}
          />
        </Badge> */}
        
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserMenuClick }} placement="bottomRight">
          <Space style={{ cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            {/* <span>Admin User</span> */}
            {/* <DownOutlined style={{ fontSize: '12px' }} /> */}
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
});

AdminHeader.displayName = 'AdminHeader';

export default AdminHeader;
