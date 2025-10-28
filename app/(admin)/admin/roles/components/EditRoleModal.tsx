import { Modal, Form, Input, Button } from 'antd';
import { Role } from '../interface/IRole';
import { useEffect } from 'react';

interface EditRoleModalProps {
  role: Role | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Role>) => void;
}

export default function EditRoleModal({ role, visible, onClose, onSubmit }: EditRoleModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (role && visible) {
      form.setFieldsValue({
        name: role.name,
      });
    }
  }, [role, visible, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Sửa vai trò"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Cập nhật</Button>,
      ]}
      width={500}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên vai trò"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
        >
          <Input placeholder="Nhập tên vai trò" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
