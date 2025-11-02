"use client";

import { useState, useEffect } from "react";
import { Product } from "../../products/interface/IProduct";
import ProductBreadcrumb from "../../products/components/ProductBreadcrumb";
import ProductImage from "../../products/components/ProductImage";
import ProductInfo from "../../products/components/ProductInfo";
import RelatedProducts from "../../products/components/RelatedProducts";
import ProductDetailSkeleton from "../../products/components/ProductDetailSkeleton";
import { getProductById } from "../../../../lib/api/products";
import type { ProductResponse } from "../../../../lib/api/products";
import { getCategoryRoute } from "../../products/utils/categoryUtils";
import { getAuthData, isAuthenticated } from "../../../../lib/utils/cookie";
import { getUserById } from "../../../../lib/api/users";
import { getReviewsByProductId, createReview, type ReviewResponse } from "../../../../lib/api/reviews";
import { Input, Button, Avatar, Modal, Rate, Steps, message } from "antd";
import { UserOutlined, StarFilled } from "@ant-design/icons";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const IpadDetailPage = ({ params }: PageProps) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<number>(0);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(parseInt(resolvedParams.id));
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (id === 0) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);

        if (response.success && response.data) {
          const productData: ProductResponse = response.data;
          
          const discountPercent = productData.priceOld > 0 
            ? Math.floor((productData.priceOld - productData.price) / productData.priceOld * 100)
            : 0

          const transformedProduct: Product = {
            id: productData.id,
            name: productData.name,
            slug: productData.slug,
            price: productData.price,
            originalPrice: productData.priceOld || productData.price,
            thumbnailImage: productData.thumbnailImage,
            brand: productData.brand,
            category: {
              id: productData.category.id,
              name: productData.category.name,
              slug: productData.category.slug,
            },
            discount: productData.discount || '',
            discountPercent,
            isOnSale: productData.priceOld > 0 && productData.price < productData.priceOld,
            isPublished: productData.isPublished,
            quantity: productData.quantity || 0,
            specifications: productData.specifications?.map(spec => ({
              id: spec.id,
              productId: spec.productId,
              groupName: spec.groupName,
              label: spec.label,
              value: spec.value,
              type: spec.type,
            })),
            colors: productData.colors?.map(color => ({
              id: color.id,
              productId: color.productId,
              name: color.name,
              slug: color.slug,
              hexColor: color.hexColor,
            })),
            images: productData.images?.map(img => ({
              id: img.id,
              productId: img.productId,
              url: img.url,
            })),
          };

          setProduct(transformedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch user info for comment form
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!isAuthenticated()) return;

      try {
        const authData = getAuthData();
        if (authData?.userId) {
          const userId = parseInt(authData.userId, 10);
          const response = await getUserById(userId);
          if (response.success && response.data) {
            setUserAvatar(response.data.avatar || null);
            setUserName(response.data.username || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Fetch reviews when product ID changes
  useEffect(() => {
    if (id === 0) return;

    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const response = await getReviewsByProductId(id, currentPage, 10);

        if (response.success && response.data) {
          setReviews(response.data.content || []);
          setTotalReviews(response.data.totalElements || 0);
        } else {
          console.error("Failed to fetch reviews:", response.message);
          setReviews([]);
          setTotalReviews(0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
        setTotalReviews(0);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id, currentPage]);

  const hasUserReviewed = (): boolean => {
    if (!isAuthenticated()) return false;
    const authData = getAuthData();
    if (!authData?.userId) return false;
    const userId = parseInt(authData.userId, 10);
    return reviews.some(review => review.userId === userId);
  };

  const handleOpenReviewModal = () => {
    if (!isAuthenticated()) {
      message.info("Vui lòng đăng nhập để đánh giá sản phẩm!");
      return;
    }
    if (hasUserReviewed()) {
      message.info("Bạn đã đánh giá sản phẩm này rồi!");
      return;
    }
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
  };

  const handleNextStep = () => {
    if (currentStep === 0 && rating === 0) {
      message.warning("Vui lòng chọn đánh giá sao!");
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
    if (!rating || !commentContent.trim()) {
      message.warning("Vui lòng chọn đánh giá và viết bình luận!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createReview({
        productId: id,
        rating: rating,
        comment: commentContent.trim(),
      });

      if (response.success && response.data) {
        message.success("Đánh giá của bạn đã được gửi thành công!");
        
        // Reset form
        setRating(0);
        setCommentContent("");
        setCurrentStep(0);
        
        // Close modal first
        setIsReviewModalOpen(false);
        
        // Small delay to ensure backend has processed
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Reload reviews
        const reviewsResponse = await getReviewsByProductId(id, 0, 10);
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data.content || []);
          setTotalReviews(reviewsResponse.data.totalElements || 0);
          setCurrentPage(0);
        } else {
          console.error("Failed to reload reviews:", reviewsResponse.message);
        }
      } else {
        message.error(response.message || "Có lỗi xảy ra khi gửi đánh giá!");
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      message.error(error.message || "Có lỗi xảy ra khi gửi đánh giá!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600 mb-6">Sản phẩm bạn tìm kiếm không tồn tại.</p>
          <a href="/ipads" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            Quay lại danh sách
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <ProductBreadcrumb 
          category={getCategoryRoute(product)}
          productName={product.name} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <ProductImage product={product} />

          {/* Product Info */}
          <ProductInfo 
            product={product} 
            category={getCategoryRoute(product)}
          />
        </div>
        <div className="space-y-6">
          {/* Technical Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Thông số kỹ thuật</h2>
            {(() => {
              // Group specifications by groupName
              const groupedSpecs = product.specifications.reduce((acc, spec) => {
                if (!acc[spec.groupName]) {
                  acc[spec.groupName] = [];
                }
                acc[spec.groupName].push(spec);
                return acc;
              }, {} as Record<string, typeof product.specifications>);

              return Object.entries(groupedSpecs).map(([groupName, specs]) => (
                <div key={groupName} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <h3 className="px-6 py-4 bg-gray-50 border-b border-gray-200 text-lg font-semibold text-gray-900">
                    {groupName}
                  </h3>
            <table className="w-full">
              <tbody>
                      {specs.map((spec, index) => (
                        <tr 
                          key={spec.id} 
                          className={index < specs.length - 1 ? "border-b border-gray-200" : ""}
                        >
                          <td className="px-6 py-4 text-gray-600 font-medium w-1/3">
                            {spec.label}
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            {Array.isArray(spec.value) ? spec.value.join(', ') : spec.value}
                          </td>
                </tr>
                      ))}
              </tbody>
            </table>
          </div>
              ));
            })()}
            </div>
          )}

          {/* Comment Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đánh giá sản phẩm</h2>
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                  <StarFilled className="text-yellow-400 text-lg" />
                  <span className="ml-1.5 text-base font-bold text-gray-900">{calculateAverageRating()}</span>
                </div>
                <span className="text-gray-600 text-sm">({totalReviews} đánh giá)</span>
              </div>
            </div>
            <Button
              type="primary"
              size="middle"
              onClick={handleOpenReviewModal}
              disabled={hasUserReviewed()}
              className="rounded-lg px-6 font-medium"
            >
              {hasUserReviewed() ? "Đã đánh giá" : "Đánh giá sản phẩm"}
            </Button>
          </div>

          {/* Comments List */}
          {reviewsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-gray-500 text-sm">Đang tải đánh giá...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-3">
                <StarFilled className="text-gray-300 text-3xl mx-auto" />
              </div>
              <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
              <p className="text-gray-400 text-sm mt-1">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>
          ) : (
            <div>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-linear-to-br from-white to-gray-50 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className="shrink-0">
                      <Avatar
                        size={48}
                        src={review.user?.avatar || undefined}
                        icon={<UserOutlined />}
                        className="ring-2 ring-blue-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <span className="font-semibold text-gray-900">{review.user?.username || "Người dùng"}</span>
                            <Rate
                              disabled
                              value={review.rating}
                              className="text-sm [&_.ant-rate-star-full]:text-yellow-400"
                            />
                          </div>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-3 border border-gray-200">
                        <p className="text-gray-700 leading-relaxed text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Modal */}
        <Modal
          title="Đánh giá sản phẩm"
          open={isReviewModalOpen}
          onCancel={handleCloseReviewModal}
          footer={null}
          width={600}
          className="review-modal"
        >
          <Steps
            current={currentStep}
            items={[
              { title: "Chọn đánh giá" },
              { title: "Viết bình luận" },
            ]}
            className="mb-6"
          />

          {currentStep === 0 && (
            <div className="py-6">
              <div className="text-center">
                <p className="text-lg font-medium text-gray-900 mb-4">Bạn đánh giá sản phẩm này như thế nào?</p>
                <Rate
                  value={rating}
                  onChange={setRating}
                  className="text-3xl"
                  allowClear
                />
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
                <Button onClick={handleCloseReviewModal} className="mr-2">
                  Hủy
                </Button>
                <Button type="primary" onClick={handleNextStep} disabled={rating === 0}>
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
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={6}
                  className="rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button onClick={handlePrevStep}>Quay lại</Button>
                <Button onClick={handleCloseReviewModal} className="mr-2">
                  Hủy
                </Button>
                <Button type="primary" onClick={handleSubmitReview} loading={isSubmitting} disabled={!commentContent.trim()}>
                  Gửi đánh giá
                </Button>
              </div>
            </div>
          )}
        </Modal>

          {/* Related Products */}
          <RelatedProducts product={product} />
        </div>
      </div>
    </div>
  );
};

export default IpadDetailPage;
