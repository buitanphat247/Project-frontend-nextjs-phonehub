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
      title="Tạo vai trò mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>Tạo</Button>,
      ]}
      width={500}
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
          label="Tên vai trò"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên vai trò' }]}
        >
          <Input 
            placeholder="Nhập tên vai trò" 
            autoComplete="off"
            onPressEnter={handlePressEnter}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}