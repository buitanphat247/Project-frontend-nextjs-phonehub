import { Modal, Form, Input, Button } from 'antd';
import { Category } from '../interface/ICategory';

interface CreateCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Category>) => void;
}

export default function CreateCategoryModal({ visible, onClose, onSubmit }: CreateCategoryModalProps) {
  const [form] = Form.useForm();

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const slug = generateSlug(values.name || '');
      onSubmit({ ...values, slug });
      form.resetFields();
      onClose();
    });
  };

  return (
    <Modal
      title="Tạo danh mục mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Tạo</Button>,
      ]}
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
