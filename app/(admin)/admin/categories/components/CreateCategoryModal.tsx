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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const currentSlug = form.getFieldValue('slug');
    // Chỉ auto-generate slug nếu slug field trống hoặc chưa được chỉnh sửa thủ công
    if (!currentSlug || currentSlug === generateSlug(form.getFieldValue('name') || '')) {
      form.setFieldValue('slug', generateSlug(name));
    }
  };

  const handleSubmit = () => {
    form.validateFields().then(values => {
      // Nếu slug trống, tự động generate từ name
      const slug = values.slug || generateSlug(values.name || '');
      onSubmit({ ...values, slug });
      form.resetFields();
      onClose();
    });
  };

  const handleFinish = (values: any) => {
    // Nếu slug trống, tự động generate từ name
    const slug = values.slug || generateSlug(values.name || '');
    onSubmit({ ...values, slug });
    form.resetFields();
    onClose();
  };

  const handlePressEnter = () => {
    form.submit();
  };

  return (
    <Modal
      title="Tạo danh mục mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>Tạo</Button>,
      ]}
      width={400}
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
          label="Tên danh mục"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input 
            placeholder="Nhập tên danh mục" 
            autoComplete="off"
            onChange={handleNameChange}
            onPressEnter={handlePressEnter}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
        >
          <Input 
            placeholder="Slug sẽ tự động được tạo từ tên danh mục" 
            autoComplete="off"
            onPressEnter={handlePressEnter}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
