import { Modal, Form, Input, Button } from 'antd';
import { Role } from '../interface/IRole';

interface CreateRoleModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Role>) => void;
}

export default function CreateRoleModal({ visible, onClose, onSubmit }: CreateRoleModalProps) {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields.jupiter(values => {
      onSubmit(values);
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Tạo vai trò mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Tạo</Button>,
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