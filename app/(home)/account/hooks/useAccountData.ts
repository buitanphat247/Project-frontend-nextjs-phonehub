import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getUserById, getUserTotalSpent } from "../../../../lib/api/users";
import { getOrders, OrderDetailResponse } from "../../../../lib/api/orders";
import { getReviewsByProductId, ReviewResponse } from "../../../../lib/api/reviews";
import { getAuthData } from "../../../../lib/utils/cookie";
import { UserInfo } from "../interface/IAccount";

export function useAccountData() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderDetailResponse[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);
  const [ordersSize] = useState(5);
  const [productReviews, setProductReviews] = useState<Map<number, ReviewResponse[]>>(new Map());
  const productReviewsRef = useRef<Map<number, ReviewResponse[]>>(new Map());
  const [dataReady, setDataReady] = useState(false);
  const [isFetchingOrders, setIsFetchingOrders] = useState(false);

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
          setOrders(ordersResponse.data.content || []);
          setOrdersTotal(ordersResponse.data.totalElements || 0);
          
          // Fetch reviews for all products in orders (chỉ fetch một lần)
          const productIds = new Set<number>();
          ordersResponse.data.content?.forEach(order => {
            order.items?.forEach(item => {
              if (item.productId) {
                productIds.add(item.productId);
              }
            });
          });
          
          // Fetch reviews for each product (parallel) - chỉ một lần
          if (productIds.size > 0) {
            const reviewPromises = Array.from(productIds).map(async (productId) => {
              try {
                const reviewsRes = await getReviewsByProductId(productId, 0, 100);
                if (reviewsRes.success && reviewsRes.data?.content) {
                  return { productId, reviews: reviewsRes.data.content };
                }
              } catch (error) {
                console.error(`Error fetching reviews for product ${productId}:`, error);
              }
              return null;
            });
            
            const reviewResults = await Promise.all(reviewPromises);
            const reviewsMap = new Map<number, ReviewResponse[]>();
            reviewResults.forEach(result => {
              if (result) {
                reviewsMap.set(result.productId, result.reviews);
              }
            });
            setProductReviews(reviewsMap);
            productReviewsRef.current = reviewsMap;
          }
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
          setOrders(res.data.content || []);
          const total = res.data.totalElements || 0;
          setOrdersTotal(total);
          
          // Update userInfo mà không trigger re-render không cần thiết
          setUserInfo(prev => {
            if (!prev) return null;
            if (prev.totalOrders === total) return prev; // Không update nếu giá trị không đổi
            return { ...prev, totalOrders: total };
          });
          
          // Fetch reviews chỉ cho products chưa có reviews (sử dụng ref để tránh stale closure)
          const currentProductIds = new Set<number>();
          res.data.content?.forEach(order => {
            order.items?.forEach(item => {
              if (item.productId) {
                currentProductIds.add(item.productId);
              }
            });
          });
          
          // Chỉ fetch reviews cho products chưa có trong ref
          const productIdsToFetch = Array.from(currentProductIds).filter(id => !productReviewsRef.current.has(id));
          
          if (productIdsToFetch.length > 0) {
            // Fetch reviews cho products mới (parallel)
            const reviewPromises = productIdsToFetch.map(async (productId) => {
              try {
                const reviewsRes = await getReviewsByProductId(productId, 0, 100);
                if (reviewsRes.success && reviewsRes.data?.content) {
                  return { productId, reviews: reviewsRes.data.content };
                }
              } catch (error) {
                console.error(`Error fetching reviews for product ${productId}:`, error);
              }
              return null;
            });
            
            const reviewResults = await Promise.all(reviewPromises);
            setProductReviews(prev => {
              const newMap = new Map(prev);
              reviewResults.forEach(result => {
                if (result) {
                  newMap.set(result.productId, result.reviews);
                }
              });
              productReviewsRef.current = newMap; // Update ref
              return newMap;
            });
          }
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
    setProductReviews,
    productReviewsRef,
    dataReady,
  };
}

