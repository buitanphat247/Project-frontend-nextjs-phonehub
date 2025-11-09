"use client";

import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, message } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined, ShoppingOutlined, ShoppingCartOutlined, PictureOutlined } from "@ant-design/icons";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import CartSkeleton from "./components/CartSkeleton";
import toast from "react-hot-toast";
import { getMyCart, updateCartItemQuantity, deleteCartItem, CartItemApi } from "../../../lib/api/cart";
import { getUserRank } from "../../../lib/api/ranks";
import { createOrder, addOrderItem } from "../../../lib/api/orders";
import { submitVnpayOrder } from "../../../lib/api/payments";
import { getAuthData } from "../../../lib/utils/cookie";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  productId?: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  brand: string;
  category: string;
  quantity: number;
  discountPercent: number;
  isOnSale: boolean;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankPercent, setRankPercent] = useState<number>(0);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutForm] = Form.useForm();
  const router = useRouter();
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const auth = getAuthData();
        const userId = auth?.userId ? parseInt(auth.userId, 10) : NaN;
        if (!userId) {
          setCartItems([]);
          setLoading(false);
          return;
        }
        const res = await getMyCart(userId);
        if (res.success && Array.isArray(res.data)) {
          const mapped: CartItem[] = res.data.map((ci: CartItemApi) => {
            const price = ci.priceAtAdd || ci.product.price;
            const originalPrice = typeof ci.product.priceOld === "number" ? ci.product.priceOld : ci.product.price;
            const discountPercent = originalPrice > 0 ? Math.max(0, Math.floor(((originalPrice - price) / originalPrice) * 100)) : 0;
            return {
              id: ci.id,
              productId: (ci as any).product?.id,
              name: ci.product.name,
              price,
              originalPrice,
              image: ci.product.thumbnailImage || "📦",
              brand: ci.product.brand || "",
              category: ci.product?.category?.slug || "",
              quantity: ci.quantity,
              discountPercent,
              isOnSale: originalPrice > price,
            };
          });
          setCartItems(mapped);
        } else {
          setCartItems([]);
        }
      } catch (e: any) {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  // Fetch current user rank (for member discount)
  useEffect(() => {
    const fetchRank = async () => {
      try {
        const auth = getAuthData();
        const userId = auth?.userId ? parseInt(auth.userId, 10) : NaN;
        if (!userId) return;
        const res = await getUserRank(userId);
        if (res.success && res.data) {
          const percent = (res.data.discountPercent ?? res.data.discount ?? 0) as number;
          setRankPercent(Math.max(0, Math.min(100, percent)));
          console.debug("[Cart] User rank fetched", { userId, rank: res.data.name, percent });
        }
      } catch (e) {
        // ignore rank errors
      }
    };
    fetchRank();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const prev = [...cartItems];
    const idx = prev.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const oldQty = prev[idx].quantity;
    // optimistic
    prev[idx] = { ...prev[idx], quantity: newQuantity };
    setCartItems(prev);
    try {
      const res = await updateCartItemQuantity(id, newQuantity);
      if (!res.success) throw new Error(res.message || "Cập nhật thất bại");
      // sync badge
      const count = prev.reduce((s, i) => s + i.quantity, 0);
      localStorage.setItem("cart_count", String(count));
      window.dispatchEvent(new Event("storage"));
    } catch (e: any) {
      // rollback
      const rollback = [...cartItems];
      const rIdx = rollback.findIndex((i) => i.id === id);
      if (rIdx !== -1) rollback[rIdx] = { ...rollback[rIdx], quantity: oldQty };
      setCartItems(rollback);
    }
  };

  const removeItem = async (id: number) => {
    const prev = [...cartItems];
    const idx = prev.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const removed = prev.splice(idx, 1)[0];
    setCartItems(prev);
    try {
      const res = await deleteCartItem(id);
      if (!res.success) throw new Error(res.message || "Xóa thất bại");
      toast.success("Đã xóa khỏi giỏ hàng");
      const count = prev.reduce((s, i) => s + i.quantity, 0);
      localStorage.setItem("cart_count", String(count));
      window.dispatchEvent(new Event("storage"));
    } catch (e: any) {
      const rollback = [...cartItems];
      rollback.splice(idx, 0, removed);
      setCartItems(rollback);
      toast.error(e?.message || "Không thể xóa khỏi giỏ hàng");
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Không còn dùng giảm giá theo giá gốc vì giá hiện tại đã là giá sau khuyến mãi.
  // Hàm giữ lại để tránh lỗi gọi, luôn trả 0 và log để debug.
  const getTotalDiscount = () => {
    console.debug("[Cart] Product-level discount disabled (using current price only)");
    return 0;
  };

  const getShippingFee = () => {
    return getSubtotal() >= 500000 ? 0 : 30000;
  };

  const getMemberDiscount = () => {
    const subtotal = getSubtotal();
    const member = Math.floor((subtotal * rankPercent) / 100);
    console.debug("[Cart] Member discount (rank applied on current prices)", { subtotal, rankPercent, member });
    return Math.max(0, member);
  };

  const getTotal = () => {
    const net = getSubtotal() - getMemberDiscount();
    return Math.max(0, net) + getShippingFee();
  };

  const handleCheckoutSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const auth = getAuthData();
      const userId = auth?.userId ? parseInt(auth.userId, 10) : NaN;
      if (!userId) throw new Error("Không xác định được người dùng");

      const buyerName = values.username;
      const buyerPhone = values.phone;
      const buyerEmail = values.email;
      const buyerAddress = values.address;

      // Tính tổng giá theo giỏ hàng (không tính phí ship)
      const orderTotal = cartItems.reduce((s, it) => s + it.price * it.quantity, 0);

      // Tạo order pending
      const created = await createOrder({
        userId,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress,
        paymentMethod: "VNPAY",
        amount: Math.floor(orderTotal),
        status: "PENDING",
      });
      if (!created.success || !created.data?.id) throw new Error(created.message || "Tạo đơn hàng thất bại");
      const orderId = created.data.id;

      // Thêm từng item
      for (const it of cartItems) {
        if (!it.productId) continue;
        const resAdd = await addOrderItem(orderId, { productId: it.productId, quantity: it.quantity, unitPrice: it.price });
        if (!resAdd.success) throw new Error(resAdd.message || "Thêm sản phẩm vào đơn hàng thất bại");
      }

      // Sang VNPay
      const orderInfoStr = String(orderId);
      const submitResp = await submitVnpayOrder(Math.floor(orderTotal), orderInfoStr);
      const prefix = "redirect:";
      let url = submitResp.redirectUrl;
      if (!url && typeof submitResp.raw === "string") {
        url = submitResp.raw.startsWith(prefix) ? submitResp.raw.slice(prefix.length) : undefined;
      }
      if (url) {
        window.location.href = url;
        return;
      }
    } catch (e: any) {
      message.error(e?.message || "Không thể xử lý thanh toán");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <CartSkeleton />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className=" bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          {/* <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn</h1>
          <p className="text-gray-600">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div> */}

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16">
              <div className="text-6xl mb-4">
                <ShoppingCartOutlined />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
              <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  return router.push("/products");
                }}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Sản phẩm đã chọn</h2>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl overflow-hidden">
                            {typeof item.image === "string" && item.image.startsWith("http") ? (
                              // Thumbnail URL
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = "none";
                                }}
                              />
                            ) : (
                              // Ant Design placeholder icon
                              <PictureOutlined className="text-2xl text-gray-400" />
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.brand}</p>

                            {/* Price */}
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-lg font-bold text-blue-700">{formatPrice(item.price)}</span>
                              {item.originalPrice > item.price && (
                                <>
                                  <span className="text-sm text-gray-500 line-through">{formatPrice(item.originalPrice)}</span>
                                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold">-{item.discountPercent}%</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <Button
                              icon={<MinusOutlined />}
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            />
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button icon={<PlusOutlined />} size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} />
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
                          </div>

                          {/* Remove Button */}
                          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(item.id)} className="ml-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tạm tính:</span>
                      <span className="font-medium">{formatPrice(getSubtotal())}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm theo hạng ( {rankPercent}% ):</span>
                      <span className="text-green-700 font-medium">-{formatPrice(getMemberDiscount())}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium">
                        {getShippingFee() === 0 ? <span className="text-green-700">Miễn phí</span> : formatPrice(getShippingFee())}
                      </span>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-700">{formatPrice(getTotal())}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button type="primary" size="large" block className="bg-blue-600 hover:bg-blue-700" onClick={() => setCheckoutVisible(true)}>
                      Thanh toán
                    </Button>

                    <Button
                      size="large"
                      block
                      icon={<ShoppingOutlined />}
                      onClick={() => {
                        router.push("/products");
                      }}
                    >
                      Tiếp tục mua sắm
                    </Button>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center text-green-700 text-sm">
                      <span className="mr-2">✓</span>
                      <span>Miễn phí vận chuyển cho đơn hàng từ 500.000 VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Checkout Modal */}
      <Modal
        title="Thông tin thanh toán"
        open={checkoutVisible}
        onCancel={() => { setCheckoutVisible(false); checkoutForm.resetFields(); }}
        footer={null}
        width={600}
        centered
      >
        <Form
          form={checkoutForm}
          layout="vertical"
          onFinish={handleCheckoutSubmit}
          autoComplete="off"
          disabled={submitting}
          initialValues={{ paymentMethod: "bank_transfer" }}
        >
          <Form.Item label="Tên người dùng" name="username" rules={[{ required: true, message: "Vui lòng nhập tên" }]}>
            <Input placeholder="Nhập tên người dùng" autoComplete="off" />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }, { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }]}>
            <Input placeholder="Nhập số điện thoại" autoComplete="off" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email" }, { type: 'email', message: 'Email không hợp lệ' }]}>
            <Input placeholder="Nhập email" autoComplete="off" />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ giao hàng" autoComplete="off" />
          </Form.Item>
          <Form.Item label="Phương thức thanh toán" name="paymentMethod" rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}>
            <Select placeholder="Chọn phương thức thanh toán">
              <Select.Option value="bank_transfer">VNPAY</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-3">
              <Button onClick={() => { setCheckoutVisible(false); checkoutForm.resetFields(); }} disabled={submitting}>Hủy</Button>
              <Button type="primary" htmlType="submit" loading={submitting} className="bg-blue-600 hover:bg-blue-700">Thanh toán</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </ProtectedRoute>
  );
};

export default CartPage;
