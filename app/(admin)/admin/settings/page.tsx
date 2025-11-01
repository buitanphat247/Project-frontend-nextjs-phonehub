"use client";

import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Switch, Select, Button, Divider, Space, message } from 'antd';
import {
  SettingOutlined,
  BellOutlined,
  SafetyOutlined,
  MailOutlined,
  GlobalOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Cài đặt đã được lưu thành công!');
      setLoading(false);
    } catch (error) {
      message.error('Vui lòng kiểm tra lại các trường nhập liệu');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Cài đặt hệ thống</h2>
        <Button type="primary" size="large" onClick={handleSave} loading={loading}>
          Lưu tất cả
        </Button>
      </div>

      <Card>
        <Tabs defaultActiveKey="general" type="card">
          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Cài đặt chung
              </span>
            }
            key="general"
          >
            <Form form={form} layout="vertical" initialValues={{
              siteName: 'PhoneHub',
              siteDescription: 'Cửa hàng điện thoại uy tín',
              language: 'vi',
              timezone: 'Asia/Ho_Chi_Minh',
              currency: 'VND',
            }}>
              <Form.Item
                label="Tên website"
                name="siteName"
                rules={[{ required: true, message: 'Vui lòng nhập tên website' }]}
              >
                <Input placeholder="Nhập tên website" />
              </Form.Item>

              <Form.Item
                label="Mô tả website"
                name="siteDescription"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
              >
                <TextArea rows={3} placeholder="Nhập mô tả website" />
              </Form.Item>

              <Form.Item
                label="Ngôn ngữ"
                name="language"
              >
                <Select>
                  <Option value="vi">Tiếng Việt</Option>
                  <Option value="en">English</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Múi giờ"
                name="timezone"
              >
                <Select>
                  <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (UTC+7)</Option>
                  <Option value="UTC">UTC</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Đơn vị tiền tệ"
                name="currency"
              >
                <Select>
                  <Option value="VND">VND (₫)</Option>
                  <Option value="USD">USD ($)</Option>
                  <Option value="EUR">EUR (€)</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Form.Item
                label="Bảo trì hệ thống"
                name="maintenanceMode"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px', marginBottom: '24px' }}>
                Khi bật, website sẽ hiển thị thông báo bảo trì cho người dùng
              </p>

              <Form.Item
                label="Cho phép đăng ký"
                name="allowRegistration"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px' }}>
                Cho phép người dùng mới đăng ký tài khoản
              </p>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <AppstoreOutlined />
                Giao diện
              </span>
            }
            key="appearance"
          >
            <Form form={form} layout="vertical" initialValues={{
              theme: 'light',
              primaryColor: '#1890ff',
              itemsPerPage: 10,
            }}>
              <Form.Item
                label="Chủ đề"
                name="theme"
              >
                <Select>
                  <Option value="light">Sáng</Option>
                  <Option value="dark">Tối</Option>
                  <Option value="auto">Tự động</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Màu chủ đạo"
                name="primaryColor"
              >
                <Input type="color" style={{ width: 100, height: 40 }} />
              </Form.Item>

              <Form.Item
                label="Số lượng mục mỗi trang"
                name="itemsPerPage"
              >
                <Select>
                  <Option value={10}>10 mục</Option>
                  <Option value={20}>20 mục</Option>
                  <Option value={50}>50 mục</Option>
                  <Option value={100}>100 mục</Option>
                </Select>
              </Form.Item>

              <Divider />

              <Form.Item
                label="Hiển thị logo"
                name="showLogo"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Hiển thị breadcrumb"
                name="showBreadcrumb"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Thông báo
              </span>
            }
            key="notifications"
          >
            <Form form={form} layout="vertical" initialValues={{
              emailNotifications: true,
              smsNotifications: false,
              orderNotifications: true,
              productNotifications: true,
              userNotifications: true,
            }}>
              <Form.Item
                label="Thông báo qua email"
                name="emailNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px', marginBottom: '24px' }}>
                Gửi thông báo qua email khi có sự kiện quan trọng
              </p>

              <Form.Item
                label="Thông báo qua SMS"
                name="smsNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px', marginBottom: '24px' }}>
                Gửi thông báo qua tin nhắn SMS
              </p>

              <Divider />

              <h4 style={{ marginBottom: '16px' }}>Loại thông báo</h4>

              <Form.Item
                label="Thông báo đơn hàng"
                name="orderNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Thông báo sản phẩm"
                name="productNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Thông báo người dùng"
                name="userNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SafetyOutlined />
                Bảo mật
              </span>
            }
            key="security"
          >
            <Form form={form} layout="vertical" initialValues={{
              twoFactorAuth: false,
              passwordMinLength: 8,
              sessionTimeout: 30,
              enableCaptcha: true,
            }}>
              <Form.Item
                label="Xác thực hai yếu tố (2FA)"
                name="twoFactorAuth"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px', marginBottom: '24px' }}>
                Yêu cầu xác thực hai yếu tố khi đăng nhập
              </p>

              <Form.Item
                label="Độ dài mật khẩu tối thiểu"
                name="passwordMinLength"
              >
                <Select>
                  <Option value={6}>6 ký tự</Option>
                  <Option value={8}>8 ký tự</Option>
                  <Option value={12}>12 ký tự</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Thời gian hết hạn phiên (phút)"
                name="sessionTimeout"
              >
                <Input type="number" min={5} max={480} />
              </Form.Item>

              <Divider />

              <Form.Item
                label="Bật CAPTCHA"
                name="enableCaptcha"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px', marginBottom: '24px' }}>
                Yêu cầu xác thực CAPTCHA khi đăng nhập hoặc đăng ký
              </p>

              <Form.Item
                label="Giới hạn số lần đăng nhập sai"
                name="maxLoginAttempts"
              >
                <Input type="number" min={3} max={10} defaultValue={5} />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <MailOutlined />
                Email
              </span>
            }
            key="email"
          >
            <Form form={form} layout="vertical" initialValues={{
              smtpHost: 'smtp.gmail.com',
              smtpPort: 587,
              smtpUser: '',
              smtpSecure: true,
            }}>
              <Form.Item
                label="SMTP Host"
                name="smtpHost"
                rules={[{ required: true, message: 'Vui lòng nhập SMTP host' }]}
              >
                <Input placeholder="smtp.gmail.com" />
              </Form.Item>

              <Form.Item
                label="SMTP Port"
                name="smtpPort"
                rules={[{ required: true, message: 'Vui lòng nhập SMTP port' }]}
              >
                <Input type="number" placeholder="587" />
              </Form.Item>

              <Form.Item
                label="SMTP Username"
                name="smtpUser"
                rules={[{ required: true, message: 'Vui lòng nhập SMTP username' }]}
              >
                <Input placeholder="your-email@gmail.com" />
              </Form.Item>

              <Form.Item
                label="SMTP Password"
                name="smtpPassword"
                rules={[{ required: true, message: 'Vui lòng nhập SMTP password' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu SMTP" />
              </Form.Item>

              <Form.Item
                label="Sử dụng SSL/TLS"
                name="smtpSecure"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Divider />

              <Form.Item
                label="Email người gửi"
                name="fromEmail"
                rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="noreply@phonehub.com" />
              </Form.Item>

              <Form.Item
                label="Tên người gửi"
                name="fromName"
              >
                <Input placeholder="PhoneHub" />
              </Form.Item>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <GlobalOutlined />
                Hệ thống
              </span>
            }
            key="system"
          >
            <Form form={form} layout="vertical" initialValues={{
              autoBackup: true,
              backupFrequency: 'daily',
              logLevel: 'info',
            }}>
              <Form.Item
                label="Tự động sao lưu"
                name="autoBackup"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <p style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '-16px', marginBottom: '24px' }}>
                Tự động sao lưu dữ liệu định kỳ
              </p>

              <Form.Item
                label="Tần suất sao lưu"
                name="backupFrequency"
              >
                <Select>
                  <Option value="hourly">Mỗi giờ</Option>
                  <Option value="daily">Hàng ngày</Option>
                  <Option value="weekly">Hàng tuần</Option>
                  <Option value="monthly">Hàng tháng</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Mức độ log"
                name="logLevel"
              >
                <Select>
                  <Option value="debug">Debug</Option>
                  <Option value="info">Info</Option>
                  <Option value="warning">Warning</Option>
                  <Option value="error">Error</Option>
                </Select>
              </Form.Item>

              <Divider />

              <h4 style={{ marginBottom: '16px' }}>Thông tin hệ thống</h4>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>Phiên bản:</strong> <span>1.0.0</span>
                </div>
                <div>
                  <strong>Ngày cài đặt:</strong> <span>01/01/2024</span>
                </div>
                <div>
                  <strong>Dung lượng đã sử dụng:</strong> <span>2.5 GB / 10 GB</span>
                </div>
              </Space>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
