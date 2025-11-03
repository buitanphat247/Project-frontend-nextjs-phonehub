import { Modal, Button, Descriptions, Tag } from 'antd';
import { Rank } from '../interface/IRank';
import { capitalizeFirst } from '../../../../../lib/utils/string';

interface RankDetailsModalProps {
  rank: Rank | null;
  visible: boolean;
  onClose: () => void;
}

export default function RankDetailsModal({ rank, visible, onClose }: RankDetailsModalProps) {
  return (
    <Modal
      title="Thông tin xếp hạng"
      open={visible}
      onCancel={onClose}
      footer={[<Button key="close" onClick={onClose}>Đóng</Button>]}
      width={600}
    >
      {rank && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID">{rank.id}</Descriptions.Item>
          <Descriptions.Item label="Tên xếp hạng">{capitalizeFirst(rank.name)}</Descriptions.Item>
          <Descriptions.Item label="Điểm tối thiểu">
            {rank.minPoints.toLocaleString('vi-VN')} điểm
          </Descriptions.Item>
          <Descriptions.Item label="Điểm tối đa">
            {rank.maxPoints ? `${rank.maxPoints.toLocaleString('vi-VN')} điểm` : 'Không giới hạn'}
          </Descriptions.Item>
          <Descriptions.Item label="Giảm giá">
            {rank.discountPercent ? `${rank.discountPercent}%` : 'Không có'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(rank.createdAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(rank.updatedAt).toLocaleString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
}

