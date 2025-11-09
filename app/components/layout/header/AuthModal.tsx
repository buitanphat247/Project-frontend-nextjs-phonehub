'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Modal, Tabs, Form, Input, Button, Checkbox, Divider, Space, message, Spin, DatePicker, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, HomeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { signIn, signInWithGoogle, signUp } from '../../../../lib/api/auth'
import { saveAuthData } from '../../../../lib/utils/cookie'
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
    // Sử dụng requestAnimationFrame để tránh forced reflow
    requestAnimationFrame(() => {
      if (isOpen) {
        // Prevent background scroll
        document.body.style.overflow = 'hidden'
      } else {
        // Restore background scroll
        document.body.style.overflow = 'unset'
      }
    })

    // Cleanup on unmount
    return () => {
      requestAnimationFrame(() => {
        document.body.style.overflow = 'unset'
      })
    }
  }, [isOpen])

  // Listen for openAuthModal event with tab parameter
  useEffect(() => {
    const handleOpenAuthModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: 'signin' | 'signup' }>
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab)
      }
    }

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener)
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener)
    }
  }, [])

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
      setLoading(true)
      setAuthProcessing(true)
      
      // Format birthday to YYYY-MM-DD
      const birthday = values.birthday ? dayjs(values.birthday).format('YYYY-MM-DD') : undefined
      
      // Step 1: Đăng ký tài khoản
      const signUpResponse = await signUp({
        username: values.username,
        email: values.email,
        phone: values.phone,
        address: values.address,
        birthday: birthday,
        password: values.password,
      })

      if (!signUpResponse.success) {
        message.error(signUpResponse.message || 'Đăng ký thất bại!')
        return
      }

      message.success(signUpResponse.message || 'Đăng ký thành công!')

      // Step 2: Sau khi đăng ký thành công, tự động đăng nhập
      try {
        const signInResponse = await signIn({
          username: values.username,
          password: values.password,
        })

        if (signInResponse.success && signInResponse.data) {
          // Lưu auth data vào cookie sau khi đăng nhập thành công
          saveAuthData(signInResponse.data)
          message.success('Đăng nhập thành công!')
          onClose()
          signUpForm.resetFields()
          
          // Redirect to protected route if exists, otherwise reload
          const urlParams = new URLSearchParams(window.location.search)
          const redirect = urlParams.get('redirect')
          if (redirect) {
            router.push(redirect)
          } else {
            window.location.reload()
          }
        } else {
          message.warning('Đăng ký thành công nhưng đăng nhập thất bại. Vui lòng đăng nhập lại!')
          // Chuyển sang tab đăng nhập
          setActiveTab('signin')
          signUpForm.resetFields()
        }
      } catch (signInError: any) {
        console.error('Auto sign in error:', signInError)
        message.warning('Đăng ký thành công nhưng đăng nhập thất bại. Vui lòng đăng nhập lại!')
        // Chuyển sang tab đăng nhập
        setActiveTab('signin')
        signUpForm.resetFields()
      }
    } catch (error: any) {
      console.error('Sign up error:', error)
      message.error(error.message || 'Đăng ký thất bại!')
    } finally {
      setLoading(false)
      setAuthProcessing(false)
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
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Tên đăng nhập"
                  className="h-12"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
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
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
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
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="Địa chỉ"
                  className="h-12"
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="birthday"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker
                  placeholder="Ngày sinh"
                  className="w-full h-12"
                  format="DD/MM/YYYY"
                  suffixIcon={<CalendarOutlined />}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
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
            </Col>
          </Row>

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
              loading={loading}
              disabled={loading}
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
        width={700}
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
