'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Tabs, Form, Input, Button, Checkbox, Divider, Space, message, Spin } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { signIn, signInWithGoogle } from '../../../../lib/api/auth'
import { saveAuthData } from '../../../../lib/utils/cookie'
import { buildApiUrl } from '../../../../lib/api/config'
import GoogleLoginButton from './GoogleLoginButton'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('signin')
  const [signInForm] = Form.useForm()
  const [signUpForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [authProcessing, setAuthProcessing] = useState(false)

  // Control body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
    } else {
      // Restore background scroll
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  const handleSignIn = async (values: { username: string; password: string }) => {
    try {
      setLoading(true)
      setAuthProcessing(true)
      const response = await signIn({
        username: values.username,
        password: values.password,
      })

      if (response.success && response.data) {
        // Save auth data to cookie
        saveAuthData(response.data)
        message.success(response.message || 'Đăng nhập thành công!')
        onClose()
        signInForm.resetFields()
        
        // Redirect to protected route if exists, otherwise reload
        const urlParams = new URLSearchParams(window.location.search)
        const redirect = urlParams.get('redirect')
        if (redirect) {
          router.push(redirect)
        } else {
          window.location.reload()
        }
      } else {
        message.error(response.message || 'Đăng nhập thất bại!')
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      message.error(error.message || 'Đăng nhập thất bại!')
    } finally {
      setLoading(false)
      setAuthProcessing(false)
    }
  }

  const handleSignUp = async (values: any) => {
    try {
      console.log('Sign up:', values)
      message.success('Đăng ký thành công!')
      onClose()
      signUpForm.resetFields()
    } catch (error) {
      message.error('Đăng ký thất bại!')
    }
  }

  const handleGoogleLogin = () => {
    // Deprecated: replaced by GoogleLoginButton component
  }

  const handleGoogleToken = async (idToken: string) => {
    try {
      setAuthProcessing(true)
      const data = await signInWithGoogle(idToken)
      if (data?.data) saveAuthData(data.data)
      message.success(data?.message || 'Đăng nhập thành công')
      onClose()
      // reload để đồng bộ UI đăng nhập
      setTimeout(() => window.location.reload(), 300)
    } catch (e: any) {
      message.error(e?.message || 'Đăng nhập Google thất bại')
    }
    finally {
      setAuthProcessing(false)
    }
  }

  const handleFacebookLogin = () => {
    message.info('Đăng nhập Facebook (Demo)')
  }

  const items = [
    {
      key: 'signin',
      label: 'Đăng nhập',
      children: (
        <Form
          form={signInForm}
          name="signin"
          onFinish={handleSignIn}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' }
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Tên đăng nhập"
              className="h-12"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              className="h-12"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Button type="link" className="p-0">
                Quên mật khẩu?
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              loading={loading}
              disabled={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      )
    },
    {
      key: 'signup',
      label: 'Đăng ký',
      children: (
        <Form
          form={signUpForm}
          name="signup"
          onFinish={handleSignUp}
          layout="vertical"
          size="large"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Họ"
                className="h-12"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Tên"
                className="h-12"
                autoComplete="off"
              />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className="h-12"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ!' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Số điện thoại"
              className="h-12"
              autoComplete="off"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              className="h-12"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'))
                }
              })
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              className="h-12"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="agreement"
            valuePropName="checked"
            rules={[
              { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Vui lòng đồng ý với điều khoản!')) }
            ]}
          >
            <Checkbox>
              Tôi đồng ý với <Button type="link" className="p-0">Điều khoản sử dụng</Button>
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      )
    }
  ]

  return (
    <>
      {/* Blur Background Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          style={{
            backdropFilter: 'blur(3px) brightness(0.8)',
            WebkitBackdropFilter: 'blur(3px) brightness(0.8)'
          }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      <Modal
        title={
          <div className="flex items-center justify-center py-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">PhoneHub</span>
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={500}
        centered
        className="auth-modal"
        styles={{
          body: { padding: '0 24px 24px 24px' }
        }}
        mask={false}
        closable={!authProcessing}
        maskClosable={!authProcessing}
        zIndex={50}
      >
      <div className={`relative ${authProcessing ? 'pointer-events-none' : ''}`} aria-busy={authProcessing}>
        {authProcessing && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 rounded">
            <Spin tip="Đang xử lý..." size="large" />
          </div>
        )}
        <Tabs
          activeKey={activeTab}
          onChange={authProcessing ? () => {} : setActiveTab}
          items={items}
          className="auth-tabs"
        />
        
        <Divider>Hoặc đăng nhập bằng</Divider>
        
        <Space direction="vertical" className="w-full">
          <div className={authProcessing ? 'opacity-60' : ''}>
            <GoogleLoginButton onReceivedToken={handleGoogleToken} />
          </div>
        </Space>
      </div>
      </Modal>
    </>
  )
}
