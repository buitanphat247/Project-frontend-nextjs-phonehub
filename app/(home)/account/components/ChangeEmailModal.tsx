'use client'

import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, message, Result } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { getAuthData } from '../../../../lib/utils/cookie'
import { requestEmailChange } from '../../../../lib/api/auth'

interface ChangeEmailModalProps {
  isOpen: boolean
  onClose: () => void
  currentEmail?: string
}

export default function ChangeEmailModal({ isOpen, onClose, currentEmail }: ChangeEmailModalProps) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'form' | 'sent'>('form')
  const [targetEmail, setTargetEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue({ email: '' })
      setStep('form')
      setTargetEmail(undefined)
    } else {
      form.resetFields()
    }
  }, [isOpen, currentEmail, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const authData = getAuthData()
      if (!authData?.userId) {
        message.error('Không tìm thấy người dùng')
        return
      }
      setSubmitting(true)
      // Backend sẽ tự kiểm tra email đã tồn tại chưa và trả lỗi nếu có
      const res = await requestEmailChange({
        userId: String(authData.userId),
        currentEmail: currentEmail || '',
        newEmail: values.email.trim(),
      })
      if (res.success) {
        setTargetEmail(values.email)
        setStep('sent')
        message.success('Đã gửi yêu cầu, vui lòng kiểm tra email để xác nhận')
      } else {
        // Backend đã kiểm tra và trả lỗi (ví dụ: email đã tồn tại)
        const err = res.message || 'Cập nhật email thất bại'
        form.setFields([{ name: 'email', errors: [err] }])
        message.error(err)
      }
    } catch (e: any) {
      if (e?.errorFields) return
      // Xử lý lỗi từ backend (email đã tồn tại, v.v.)
      let errorMsg = e?.message || 'Cập nhật email thất bại'
      if (errorMsg.toLowerCase().includes('email') && 
          (errorMsg.toLowerCase().includes('đã') || errorMsg.toLowerCase().includes('đã được sử dụng'))) {
        errorMsg = 'Email mới đã được sử dụng. Vui lòng thử email khác.'
      }
      form.setFields([{ name: 'email', errors: [errorMsg] }])
      message.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title="Cập nhật email"
      open={isOpen}
      onCancel={submitting ? undefined : onClose}
      footer={null}
      centered
      maskClosable={!submitting}
      closable={!submitting}
    >
      {step === 'form' && (
        <Form form={form} layout="vertical" onFinish={handleSubmit} disabled={submitting}>
          <Form.Item
            label={<span>Email mới <span className="text-red-500">*</span></span>}
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
              {
                validator: (_, value) => {
                  const v = (value || '').trim()
                  if (!v) return Promise.resolve()
                  if (currentEmail && v.toLowerCase() === currentEmail.toLowerCase()) {
                    return Promise.reject(new Error('Email mới không được trùng email hiện tại'))
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email mới" autoComplete="email" disabled={submitting} />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} disabled={submitting}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Gửi yêu cầu
            </Button>
          </div>
        </Form>
      )}
      {step === 'sent' && (
        <Result
          status="success"
          title="Vui lòng kiểm tra email"
          subTitle={`Chúng tôi đã gửi liên kết xác minh tới ${currentEmail || 'email hiện tại của bạn'}. Hãy mở thư và hoàn tất xác nhận để đổi email.`}
        />
      )}
    </Modal>
  )
}


