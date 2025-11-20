import { useState } from "react";
import toast from "react-hot-toast";
import { createReview, ReviewResponse } from "../../../../lib/api/reviews";
import { updateOrderItemReviewState } from "../../../../lib/api/orders";
import { getAuthData } from "../../../../lib/utils/cookie";
import { showLoginAlert } from "../../../../lib/utils/loginAlert";
import { OrderItemReviewInfo } from "./useAccountData";

interface UseReviewModalProps {
  productReviews: Map<number, OrderItemReviewInfo[]>;
  productReviewsRef: React.MutableRefObject<Map<number, OrderItemReviewInfo[]>>;
  markOrderItemReviewed: (params: { orderId: number; orderItemId: number; review: ReviewResponse }) => void;
}

export function useReviewModal({ productReviews, productReviewsRef, markOrderItemReviewed }: UseReviewModalProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState<number>(0);
  const [commentContent, setCommentContent] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenReviewModal = (orderId: number, orderItemId: number, productId: number) => {
    const authData = getAuthData();
    if (!authData?.userId) {
      showLoginAlert("Bạn cần đăng nhập để đánh giá sản phẩm");
      return;
    }

    // Check if user has reviewed
    const reviews = productReviewsRef.current.get(productId) ?? productReviews.get(productId) ?? [];
    const hasReviewed = reviews.some((review) => review.orderItemId === orderItemId);
    if (hasReviewed) {
      toast("Bạn đã đánh giá sản phẩm này rồi!", { icon: "ℹ️" });
      return;
    }

    setSelectedOrderId(orderId);
    setSelectedOrderItemId(orderItemId);
    setSelectedProductId(productId);
    setIsReviewModalOpen(true);
    setCurrentStep(0);
    setRating(0);
    setCommentContent("");
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setCurrentStep(0);
    setRating(0);
    setCommentContent("");
    setSelectedProductId(null);
    setSelectedOrderId(null);
    setSelectedOrderItemId(null);
  };

  const handleNextStep = () => {
    if (currentStep === 0 && rating === 0) {
      toast.error("Vui lòng chọn đánh giá sao!");
      return;
    }
    if (currentStep === 0) {
      setCurrentStep(1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 1) {
      setCurrentStep(0);
    }
  };

  const handleSubmitReview = async () => {
    if (!rating || !commentContent.trim() || !selectedProductId || !selectedOrderId || !selectedOrderItemId) {
      toast.error("Vui lòng chọn đánh giá và viết bình luận!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createReview({
        productId: selectedProductId,
        orderId: selectedOrderId,
        rating: rating,
        comment: commentContent.trim(),
      });

      if (response.success && response.data) {
        toast.success("Đánh giá của bạn đã được gửi thành công!");

        // Update order item review state
        const reviewId = response.data.id;
        let updateSucceeded = true;
        try {
          const updateState = await updateOrderItemReviewState(selectedOrderItemId, {
            reviewed: true,
            reviewId,
          });

          if (!updateState.success) {
            updateSucceeded = false;
            toast.error(updateState.message || "Không thể cập nhật trạng thái đánh giá!");
          }
        } catch (error: any) {
          updateSucceeded = false;
          console.error("Error updating order item review state:", error);
          toast.error(error.message || "Không thể cập nhật trạng thái đánh giá!");
        }

        if (!updateSucceeded) {
          return;
        }

        // Update local state
        markOrderItemReviewed({
          orderId: selectedOrderId,
          orderItemId: selectedOrderItemId,
          review: response.data,
        });

        handleCloseReviewModal();
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi gửi đánh giá!");
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra khi gửi đánh giá!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isReviewModalOpen,
    currentStep,
    rating,
    commentContent,
    isSubmitting,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleNextStep,
    handlePrevStep,
    handleSubmitReview,
    setRating,
    setCommentContent,
  };
}
