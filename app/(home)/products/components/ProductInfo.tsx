"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Modal, Form, Input, Select, Button, message, InputNumber } from "antd";
import {
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
  SwapOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { Product } from "../interface/IProduct";
import { isAuthenticated, getAuthData } from "../../../../lib/utils/cookie";
import { addToFavorites, removeFromFavorites, checkFavorite } from "../../../../lib/api/favorites";
import { addToCart } from "../../../../lib/api/cart";
import { showLoginAlert } from "../../../../lib/utils/loginAlert";
import { submitVnpayOrder } from "../../../../lib/api/payments";
import { createOrder, addOrderItem } from "../../../../lib/api/orders";

interface ProductInfoProps {
  product: Product;
  category: string;
}

const ProductInfo = ({ product, category }: ProductInfoProps) => {
  const router = useRouter();
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(true);
  const [buyNowModalVisible, setBuyNowModalVisible] = useState(false);
  const [buyNowForm] = Form.useForm();
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Check if product is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const authenticated = isAuthenticated();
      if (!authenticated) {
        setIsCheckingFavorite(false);
        return;
      }

      try {
        setIsCheckingFavorite(true);
        const response = await checkFavorite(product.id);
        if (response.success) {
          setIsFavorite(response.data);
        }
      } catch (error) {
        // Ignore error when checking favorite
      } finally {
        setIsCheckingFavorite(false);
      }
    };

    checkFavoriteStatus();
  }, [product.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFavoriteClick = async () => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
      showLoginAlert("Bạn cần đăng nhập để thêm các sản phẩm yêu thích");
      return;
    }

    try {
      setIsAddingFavorite(true);

      if (isFavorite) {
        // Remove from favorites
        const response = await removeFromFavorites(product.id);
        if (response.success) {
          setIsFavorite(false);
          toast.success("Đã xóa sản phẩm khỏi yêu thích!");
        } else {
          toast.error(response.message || "Không thể xóa sản phẩm khỏi yêu thích");
        }
      } else {
        // Add to favorites
        const response = await addToFavorites(product.id);
        if (response.success) {
          setIsFavorite(true);
          toast.success("Đã thêm sản phẩm vào yêu thích!");
        } else {
          toast.error(response.message || "Không thể thêm sản phẩm vào yêu thích");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setIsAddingFavorite(false);
    }
  };

  const handleActionClick = async (actionName: string) => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
      showLoginAlert("Bạn cần đăng nhập để thực hiện hành động này");
      return;
    }
    if (actionName === "Thêm vào giỏ hàng") {
      try {
        const auth = getAuthData();
        const userId = auth?.userId ? parseInt(auth.userId, 10) : NaN;
        if (!userId) {
          toast.error("Không xác định được người dùng");
          return;
        }

        const res = await addToCart({ userId, productId: product.id, quantity: 1 });
        if (res.success) {
          toast.success("Đã thêm vào giỏ hàng");
          // Cập nhật badge giỏ hàng (dựa trên localStorage)
          const current = parseInt(localStorage.getItem("cart_count") || "0", 10) || 0;
          const next = current + 1;
          localStorage.setItem("cart_count", String(next));
          // Phát sự kiện để header cập nhật ngay
          window.dispatchEvent(new Event("storage"));
        } else {
          toast.error(res.message || "Không thể thêm vào giỏ hàng");
        }
      } catch (e: any) {
        toast.error(e?.message || "Lỗi khi thêm vào giỏ hàng");
      }
      return;
    }
    if (actionName === "Mua ngay") {
      // Mở modal mua ngay - không pre-fill giá trị
      buyNowForm.resetFields();
      setBuyNowModalVisible(true);
      return;
    }
    // Các hành động khác
    console.log(`${actionName} clicked for product ${product.id}`);
  };

  const handleBuyNowSubmit = async (values: any) => {
    try {
      setSubmittingOrder(true);

      // Chỉ hỗ trợ VNPAY
      if (values.paymentMethod !== "bank_transfer") {
        message.error("Hiện tại chúng tôi chỉ hỗ trợ thanh toán qua VNPAY");
        setSubmittingOrder(false);
        return;
      }

      const auth = getAuthData();
      const uid = auth?.userId ? parseInt(auth.userId, 10) : NaN;
      if (!uid) {
        throw new Error("Không xác định được userId");
      }

      const orderCustomer = {
        buyerName: values.username,
        buyerPhone: values.phone,
        buyerEmail: values.email,
        buyerAddress: values.address,
      };

      const quantity = Number(values.quantity) || 1;
      const orderItemsPayload = [
        { productId: product.id, quantity, unitPrice: product.price },
      ];
      const orderTotal = orderItemsPayload.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
      
      // Bước 1: tạo đơn hàng pending (định dạng chuẩn backend yêu cầu)
      const created = await createOrder({
        userId: uid,
        buyerName: orderCustomer.buyerName,
        buyerEmail: orderCustomer.buyerEmail,
        buyerPhone: orderCustomer.buyerPhone,
        buyerAddress: orderCustomer.buyerAddress,
        paymentMethod: "VNPAY",
        amount: Math.floor(orderTotal),
        status: "PENDING",
      });
      if (!created.success || !created.data?.id) {
        throw new Error(created.message || "Tạo đơn hàng thất bại");
      }
      const orderId = created.data.id;

      // Bước 2: thêm chi tiết đơn hàng - gửi TỪNG ITEM một
      for (const it of orderItemsPayload) {
        const resAdd = await addOrderItem(orderId, it);
        if (!resAdd.success) {
          throw new Error(resAdd.message || "Thêm sản phẩm vào đơn hàng thất bại");
        }
      }

      // Gửi sang VNPAY: chỉ cần truyền orderId để backend tra cứu lại
      const orderInfoStr = String(orderId);
      const amount = Math.floor(orderTotal);
      const submitResp = await submitVnpayOrder(amount, orderInfoStr);
      const prefix = "redirect:";
      let url = submitResp.redirectUrl;
      if (!url && typeof submitResp.raw === "string") {
        url = submitResp.raw.startsWith(prefix) ? submitResp.raw.slice(prefix.length) : undefined;
      }
      if (url) {
        window.location.href = url;
        return;
      }
    } catch (error: any) {
      message.error(error.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Name */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</span>
          {product.quantity !== undefined && (
            <span className={`text-sm font-medium ${product.quantity > 0 ? "text-green-700" : "text-red-600"}`}>
              (Còn {product.quantity.toLocaleString("vi-VN")} sản phẩm)
            </span>
          )}
          {/* Rating - chỉ hiển thị nếu có */}
          {product.reviews && product.rating && (
            <>
              <span className="text-gray-600">({product.reviews} đánh giá)</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-lg ${i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}>
                    ★
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-bold text-blue-700">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>}
        </div>
        {product.discountPercent > 0 && (
          <div className="flex items-center space-x-2">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">-{product.discountPercent}% OFF</span>
            {product.isOnSale && <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">SALE</span>}
          </div>
        )}
      </div>

      {/* Colors */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Màu sắc</h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <div
                key={color.id}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                style={{ borderColor: color.hexColor }}
              >
                <div className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: color.hexColor }} />
                <span className="text-gray-700">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.name} là một sản phẩm cao cấp từ {product.brand}, được thiết kế với công nghệ tiên tiến và chất lượng vượt trội. Sản phẩm mang đến
          trải nghiệm tuyệt vời cho người dùng với hiệu năng mạnh mẽ và thiết kế tinh tế.
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Tính năng nổi bật</h3>
        <ul className="grid grid-cols-2 gap-2">
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Thiết kế cao cấp, sang trọng</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Hiệu năng mạnh mẽ, ổn định</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Bảo hành chính hãng 12 tháng</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="text-green-500">✓</span>
            <span className="text-gray-600">Miễn phí vận chuyển toàn quốc</span>
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-6">
        <div className="flex space-x-4">
          <button
            onClick={() => handleActionClick("Thêm vào giỏ hàng")}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <ShoppingCartOutlined />
            <span>Thêm vào giỏ hàng</span>
          </button>
          {/* Ẩn nút Mua ngay */}
          {false && (
            <button
              onClick={() => handleActionClick("Mua ngay")}
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer flex items-center justify-center space-x-2"
            >
              <ThunderboltOutlined />
              <span>Mua ngay</span>
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleFavoriteClick}
            disabled={isAddingFavorite || isCheckingFavorite}
            className={`flex-1 border py-3 px-6 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
              isFavorite ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100" : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {isAddingFavorite ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                {isFavorite ? (
                  <>
                    <HeartFilled className="text-red-500" />
                    <span>Đã yêu thích</span>
                  </>
                ) : (
                  <>
                    <HeartOutlined />
                    <span>Yêu thích</span>
                  </>
                )}
              </>
            )}
          </button>
          <button
            onClick={() => handleActionClick("So sánh")}
            className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center space-x-2"
          >
            <SwapOutlined />
            <span>So sánh</span>
          </button>
        </div>
      </div>

      {/* Ẩn modal Mua ngay */}
      {false && (
        <Modal
          title="Thông tin đặt hàng"
          open={buyNowModalVisible}
          onCancel={() => {
            setBuyNowModalVisible(false);
            buyNowForm.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Form
            form={buyNowForm}
            layout="vertical"
            onFinish={handleBuyNowSubmit}
            className="mt-4"
            autoComplete="off"
            disabled={submittingOrder}
            initialValues={{ quantity: 1, paymentMethod: "bank_transfer" }}
          >
            <Form.Item label="Tên người dùng" name="username" rules={[{ required: true, message: "Vui lòng nhập tên người dùng" }]}>
              <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" autoComplete="off" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default ProductInfo;
