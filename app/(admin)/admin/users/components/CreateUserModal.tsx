import { Modal, Form, Input, Select, Button } from 'antd';
import { User } from '../interface/IUser';

const { Option } = Select;

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<User>) => void;
}

export default function CreateUserModal({ visible, onClose, onSubmit }: CreateUserModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Tạo người dùng mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Tạo</Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập username' }]}
        >
          <Input placeholder="Nhập username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập password' }]}
        >
          <Input.Password placeholder="Nhập password" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="role_id"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value={1}>Admin</Option>
            <Option value={2}>Staff</Option>
            <Option value={3}>User</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}