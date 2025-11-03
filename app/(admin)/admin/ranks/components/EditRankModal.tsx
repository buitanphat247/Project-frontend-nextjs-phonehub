import { Modal, Form, Input, Button, InputNumber } from "antd";
import { Rank } from "../interface/IRank";
import { useEffect } from "react";

interface EditRankModalProps {
  rank: Rank | null;
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Rank>) => void;
}

export default function EditRankModal({ rank, visible, onClose, onSubmit }: EditRankModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (rank && visible) {
      form.setFieldsValue({
        name: rank.name,
        minPoints: rank.minPoints,
        maxPoints: rank.maxPoints,
        discountPercent: rank.discountPercent,
      });
    }
  }, [rank, visible, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
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

  return (
    <Modal
      title="Sửa xếp hạng"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" onClick={handleSubmit}>
          Cập nhật
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical" autoComplete="off" onFinish={handleFinish}>
        <Form.Item
          label={
            <span>
              Tên xếp hạng <span className="text-red-500">*</span>
            </span>
          }
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên xếp hạng" }]}
        >
          <Input placeholder="Nhập tên xếp hạng" autoComplete="off" />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Điểm tối thiểu <span className="text-red-500">*</span>
            </span>
          }
          name="minPoints"
          rules={[
            { required: true, message: "Vui lòng nhập điểm tối thiểu" },
            { type: "number", min: 0, message: "Điểm phải lớn hơn hoặc bằng 0" },
          ]}
        >
          <InputNumber
            placeholder="Nhập điểm tối thiểu"
            style={{ width: "100%" }}
            min={0}
            formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "")}
            parser={(value) => (value ? value.replace(/\$\s?|(,*)/g, '') : '') as any}

          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Điểm tối đa <span className="text-red-500">*</span>
            </span>
          }
          name="maxPoints"
          dependencies={["minPoints"]}
          rules={[
            { required: true, message: "Vui lòng nhập điểm tối đa" },
            { type: "number", min: 0, message: "Điểm phải lớn hơn hoặc bằng 0" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const minPoints = getFieldValue("minPoints");
                if (!minPoints) {
                  return Promise.resolve();
                }
                if (value <= minPoints) {
                  return Promise.reject(new Error("Điểm tối đa phải lớn hơn điểm tối thiểu"));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber
            placeholder="Nhập điểm tối đa"
            style={{ width: "100%" }}
            min={0}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => {
              const parsed = value?.replace(/\$\s?|(,*)/g, "") || "0";
              return (parseFloat(parsed) || 0) as any;
            }}
          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Phần trăm giảm giá (%) <span className="text-red-500">*</span>
            </span>
          }
          name="discountPercent"
          rules={[
            { required: true, message: "Vui lòng nhập phần trăm giảm giá" },
            { type: "number", min: 0, max: 100, message: "Phần trăm giảm giá phải từ 0 đến 100" },
          ]}
        >
          <InputNumber
            placeholder="Nhập phần trăm giảm giá"
            style={{ width: "100%" }}
            min={0}
            max={100}
            formatter={(value) => `${value}%`}
            parser={(value) => {
              const parsed = value?.replace("%", "") || "0";
              return (parseFloat(parsed) || 0) as any;
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
