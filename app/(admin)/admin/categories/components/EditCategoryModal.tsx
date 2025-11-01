import { Modal, Form, Input, Button } from 'antd';
import { Category } from '../interface/ICategory';
import { useEffect } from 'react';

interface EditCategoryModalProps {
  category: Category | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Category>) => void;
}

export default function EditCategoryModal({ category, visible, onClose, onSubmit }: EditCategoryModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (category && visible) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
      });
    }
  }, [category, visible, form]);


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
      title="Sửa danh mục"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>Cập nhật</Button>,
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
            onPressEnter={handlePressEnter}
          />
        </Form.Item>

        <Form.Item
          label="Slug"
          name="slug"
          rules={[{ required: true, message: 'Vui lòng nhập slug' }]}
        >
          <Input 
            placeholder="Nhập slug" 
            autoComplete="off"
            onPressEnter={handlePressEnter}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
