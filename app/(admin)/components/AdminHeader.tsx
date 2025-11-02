'use client';

import { Layout, Button, Badge, Space, Avatar, Dropdown, App } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { forwardRef } from 'react';
import { useRouter } from 'next/navigation';
import type { MenuProps } from 'antd';
import { clearAuthData } from '../../../lib/utils/cookie';

const { Header } = Layout;

interface AdminHeaderProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminHeader = forwardRef<HTMLDivElement, AdminHeaderProps>(({ collapsed, setCollapsed }, ref) => {
  const { modal } = App.useApp();
  const router = useRouter();

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
        router.push('/');
        window.location.reload();
      },
    });
  };

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
      handleLogout();
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
