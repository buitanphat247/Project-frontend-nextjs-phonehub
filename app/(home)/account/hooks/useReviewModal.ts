import { useState } from "react";
import toast from "react-hot-toast";
import { createReview, ReviewResponse } from "../../../../lib/api/reviews";
import { getAuthData } from "../../../../lib/utils/cookie";
import { showLoginAlert } from "../../../../lib/utils/loginAlert";

interface UseReviewModalProps {
  productReviews: Map<number, ReviewResponse[]>;
  setProductReviews: React.Dispatch<React.SetStateAction<Map<number, ReviewResponse[]>>>;
  productReviewsRef: React.MutableRefObject<Map<number, ReviewResponse[]>>;
}

export function useReviewModal({ productReviews, setProductReviews, productReviewsRef }: UseReviewModalProps) {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [rating, setRating] = useState<number>(0);
  const [commentContent, setCommentContent] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenReviewModal = (orderId: number, productId: number) => {
    const authData = getAuthData();
    if (!authData?.userId) {
      showLoginAlert("Bạn cần đăng nhập để đánh giá sản phẩm");
      return;
    }

    // Check if user has reviewed
    const reviews = productReviews.get(productId) || [];
    const userId = parseInt(authData.userId, 10);
    const hasReviewed = reviews.some((review) => review.userId === userId && review.orderId === orderId);
    if (hasReviewed) {
      toast("Bạn đã đánh giá sản phẩm này rồi!", { icon: 'ℹ️' });
      return;
    }
    
    setSelectedOrderId(orderId);
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
    if (!rating || !commentContent.trim() || !selectedProductId || !selectedOrderId) {
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

        // Update productReviews
        const newReview = { ...response.data!, orderId: selectedOrderId } as ReviewResponse;

        setProductReviews(prev => {
          const currentReviews = prev.get(selectedProductId) || [];
          const newMap = new Map(prev);
          newMap.set(selectedProductId, [...currentReviews, newReview]);
          productReviewsRef.current = newMap; // Update ref
          return newMap;
        });

        // Reset form
        setRating(0);
        setCommentContent("");
        setCurrentStep(0);
        setIsReviewModalOpen(false);
        setSelectedProductId(null);
        setSelectedOrderId(null);
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

