import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getUserById, getUserTotalSpent } from "../../../../lib/api/users";
import { getOrders, OrderDetailResponse } from "../../../../lib/api/orders";
import { ReviewResponse } from "../../../../lib/api/reviews";
import { getAuthData } from "../../../../lib/utils/cookie";
import { UserInfo } from "../interface/IAccount";

export interface OrderItemReviewInfo extends ReviewResponse {
  orderId: number;
  orderItemId: number;
}

export function useAccountData() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderDetailResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersSize] = useState(5);
  const [productReviews, setProductReviews] = useState<Map<number, OrderItemReviewInfo[]>>(new Map());
  const productReviewsRef = useRef<Map<number, OrderItemReviewInfo[]>>(new Map());
  const [dataReady, setDataReady] = useState(false);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

  const rebuildProductReviews = (ordersData: OrderDetailResponse[]) => {
    const map = new Map<number, OrderItemReviewInfo[]>();
    ordersData.forEach((order) => {
      order.items?.forEach((item) => {
        if (item.reviewId) {
          const reviewInfo: OrderItemReviewInfo = {
            id: item.reviewId,
            productId: item.productId,
            userId: order.userId,
            rating: item.reviewRating ?? 0,
            comment: item.reviewComment ?? "",
            createdAt: item.reviewCreatedAt ?? "",
            updatedAt: item.reviewCreatedAt ?? "",
            orderId: order.id,
            orderItemId: item.id,
          };
          const existing = map.get(item.productId) ?? [];
          map.set(item.productId, [...existing, reviewInfo]);
        }
      });
    });
    setProductReviews(map);
    productReviewsRef.current = map;
  };

  const markOrderItemReviewed = ({
    orderId,
    orderItemId,
    review,
  }: {
    orderId: number;
    orderItemId: number;
    review: ReviewResponse;
  }) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((order) => {
        if (order.id !== orderId) return order;
        const updatedItems = order.items?.map((item) => {
          if (item.id !== orderItemId) return item;
          return {
            ...item,
            isReviewed: true,
            reviewId: review.id,
            reviewRating: review.rating,
            reviewComment: review.comment,
            reviewCreatedAt: review.createdAt,
          };
        }) ?? order.items;
        return { ...order, items: updatedItems };
      });
      rebuildProductReviews(updatedOrders);
      return updatedOrders;
    });
  };

  // Fetch tất cả data một lần duy nhất khi component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setOrdersLoading(true);
        const authData = getAuthData();
        
        if (!authData?.userId) {
          toast.error("Không tìm thấy thông tin người dùng");
          setLoading(false);
          setOrdersLoading(false);
          return;
        }

        const userId = parseInt(authData.userId, 10);

        // Fetch user info, orders, total spent và reviews cùng lúc
        const [userResponse, ordersResponse, totalSpentResponse] = await Promise.all([
          getUserById(userId),
          getOrders({ page: ordersPage, size: ordersSize, userId }),
          getUserTotalSpent(userId)
        ]);

        // Set user info
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          const joinDate = new Date(userData.createdAt);
          const formattedJoinDate = joinDate.toLocaleDateString('vi-VN', {
            month: 'long',
            year: 'numeric'
          });

          const totalOrders = ordersResponse.success && ordersResponse.data 
            ? ordersResponse.data.totalElements || 0 
            : 0;
          const totalSpent = totalSpentResponse.success && typeof totalSpentResponse.data === 'number'
            ? totalSpentResponse.data
            : 0;

          setUserInfo({
            name: userData.username,
            email: userData.email,
            address: userData.address || "",
            phone: userData.phone || "",
            avatar: userData.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            birthday: userData.birthday || undefined,
            joinDate: formattedJoinDate,
            totalOrders,
            totalSpent,
            loyaltyPoints: userData.points ?? 0,
            rankName: userData.rank?.name,
            rankDiscount: (userData as any).rank?.discount,
          });
        } else {
          toast.error(userResponse.message || "Không thể tải thông tin người dùng");
          setLoading(false);
          setOrdersLoading(false);
          return;
        }

        // Set orders
        if (ordersResponse.success && ordersResponse.data) {
          const ordersData = ordersResponse.data.content || [];
          setOrders(ordersData);
          setOrdersTotal(ordersResponse.data.totalElements || 0);
          rebuildProductReviews(ordersData);
        }

        setDataReady(true);
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast.error(error.message || "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
        setOrdersLoading(false);
      }
    };

    fetchAllData();
  }, []); // Chỉ chạy một lần khi mount

  // Fetch orders khi đổi trang (pagination) - chỉ khi data đã ready
  useEffect(() => {
    if (!dataReady || isFetchingOrders) return; // Chỉ fetch khi đã initialized và không đang fetch
    
    const fetchOrdersPage = async () => {
      try {
        setIsFetchingOrders(true);
        setOrdersLoading(true);
        const auth = getAuthData();
        const uid = auth?.userId ? parseInt(auth.userId, 10) : NaN;
        if (!uid) {
          setOrdersLoading(false);
          setIsFetchingOrders(false);
          return;
        }
        
        const res = await getOrders({ page: ordersPage, size: ordersSize, userId: uid });
        if (res.success && res.data) {
          const ordersData = res.data.content || [];
          setOrders(ordersData);
          const total = res.data.totalElements || 0;
          setOrdersTotal(total);
          
          // Update userInfo mà không trigger re-render không cần thiết
          setUserInfo(prev => {
            if (!prev) return null;
            if (prev.totalOrders === total) return prev; // Không update nếu giá trị không đổi
            return { ...prev, totalOrders: total };
          });
          
          rebuildProductReviews(ordersData);
        }
      } catch (e) {
        console.error("Error fetching orders:", e);
      } finally {
        setOrdersLoading(false);
        setIsFetchingOrders(false);
      }
    };
    
    fetchOrdersPage();
  }, [ordersPage, ordersSize, dataReady]); // Loại bỏ userInfo khỏi dependencies

  return {
    userInfo,
    setUserInfo,
    loading,
    orders,
    ordersLoading,
    ordersTotal,
    ordersPage,
    setOrdersPage,
    ordersSize,
    productReviews,
    productReviewsRef,
    dataReady,
    markOrderItemReviewed,
  };
}

