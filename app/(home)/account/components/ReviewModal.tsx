"use client";

import React from "react";
import { Modal, Steps, Rate, Input, Button } from "antd";

interface ReviewModalProps {
  open: boolean;
  currentStep: number;
  rating: number;
  commentContent: string;
  isSubmitting: boolean;
  onClose: () => void;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSubmit: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  currentStep,
  rating,
  commentContent,
  isSubmitting,
  onClose,
  onRatingChange,
  onCommentChange,
  onNextStep,
  onPrevStep,
  onSubmit,
}) => {
  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      className="review-modal"
    >
      <Steps current={currentStep} items={[{ title: "Chọn đánh giá" }, { title: "Viết bình luận" }]} className="mb-6" />

      {currentStep === 0 && (
        <div className="py-6">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900 mb-4">Bạn đánh giá sản phẩm này như thế nào?</p>
            <Rate value={rating} onChange={onRatingChange} className="text-3xl" allowClear />
            {rating > 0 && (
              <p className="mt-4 text-gray-600">
                {rating === 5 && "Tuyệt vời!"}
                {rating === 4 && "Rất tốt!"}
                {rating === 3 && "Tốt"}
                {rating === 2 && "Tạm được"}
                {rating === 1 && "Không hài lòng"}
              </p>
            )}
          </div>
          <div className="flex justify-end mt-8">
            <Button onClick={onClose} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" onClick={onNextStep} disabled={rating === 0}>
              Tiếp theo
            </Button>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="py-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Đánh giá của bạn:</p>
            <Rate disabled value={rating} className="text-lg" />
          </div>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-2">Viết bình luận của bạn</p>
            <Input.TextArea
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={commentContent}
              onChange={(e) => onCommentChange(e.target.value)}
              rows={6}
              className="rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button onClick={onPrevStep}>Quay lại</Button>
            <Button onClick={onClose} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" onClick={onSubmit} loading={isSubmitting} disabled={!commentContent.trim()}>
              Gửi đánh giá
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReviewModal;

