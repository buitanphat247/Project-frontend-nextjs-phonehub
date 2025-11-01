import { Modal, Form, Input, Select, Button } from 'antd';
import { User } from '../interface/IUser';
import { useRolesForSelect } from '../hooks/useRolesForSelect';
import { capitalizeFirst } from '../../../../../lib/utils/string';

const { Option } = Select;

interface CreateUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<User>) => void;
}

export default function CreateUserModal({ visible, onClose, onSubmit }: CreateUserModalProps) {
  const [form] = Form.useForm();
  const { roles, loading: rolesLoading } = useRolesForSelect(visible);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  const handleFinish = (values: any) => {
    onSubmit(values);
    form.resetFields();
    onClose();
  };

  const handlePressEnter = () => {
    form.submit();
  };

  return (
    <Modal
      title="Tạo người dùng mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>Tạo</Button>,
      ]}
      width={600}
    >
      <Form 
        form={form} 
        layout="vertical" 
        autoComplete="off" 
        onFinish={handleFinish}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.submit();
          }
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập username' }]}
        >
          <Input placeholder="Nhập username" autoComplete="off" onPressEnter={handlePressEnter} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập password' }]}
        >
          <Input.Password placeholder="Nhập password" autoComplete="new-password" onPressEnter={handlePressEnter} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input placeholder="Nhập email" autoComplete="off" onPressEnter={handlePressEnter} />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input placeholder="Nhập số điện thoại" autoComplete="off" onPressEnter={handlePressEnter} />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input placeholder="Nhập địa chỉ" autoComplete="off" onPressEnter={handlePressEnter} />
        </Form.Item>

        <Form.Item
          label="Vai trò"
          name="roleId"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select placeholder="Chọn vai trò" loading={rolesLoading}>
            {roles.map((role) => (
              <Option key={role.id} value={role.id}>
                {capitalizeFirst(role.name)}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}