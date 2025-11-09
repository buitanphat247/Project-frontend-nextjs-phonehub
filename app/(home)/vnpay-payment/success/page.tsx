"use client";
import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { updateOrderStatus, getOrderById, OrderDetailResponse } from "../../../../lib/api/orders";
import { getMyCart, deleteCartItem } from "../../../../lib/api/cart";
import { Spin } from "antd";

function formatCurrency(amount?: string | null) {
  const n = amount ? parseInt(amount, 10) : 0;
  const value = n % 100 === 0 ? n / 100 : n;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
}

export default function VnpaySuccessPage() {
  const params = useSearchParams();
  const router = useRouter();

  const { amount, bank, transNo, orderId } = useMemo(() => {
    const a = params.get("vnp_Amount");
    const b = params.get("vnp_BankCode");
    const t = params.get("vnp_TransactionNo");
    const info = params.get("vnp_OrderInfo") || "";
    // OrderInfo hiện là orderId dạng string
    let id = "";
    try {
      // fallback nếu backend gửi JSON
      const decoded = decodeURIComponent(info);
      const parsed = JSON.parse(decoded);
      id = parsed.orderId || info;
    } catch {
      id = info;
    }
    return { amount: a, bank: b, transNo: t, orderId: id };
  }, [params]);

  const confetti = Array.from({ length: 70 });
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (!orderId) return;
      const isSuccess = params.get("vnp_ResponseCode") === "00" && params.get("vnp_TransactionStatus") === "00";
      try {
        // cập nhật trạng thái (thử thường trước, nếu fail thử UPPERCASE)
        const desired = isSuccess ? "success" : "failed";
        let rs = await updateOrderStatus(orderId, desired);
        if (!rs.success) {
          rs = await updateOrderStatus(orderId, desired.toUpperCase());
        }
      } catch {}
      try {
        const detail = await getOrderById(orderId);
        if (detail.success) {
          setOrder(detail.data);
          if (isSuccess) {
            // Clear user's cart after successful payment
            try {
              const cart = await getMyCart(detail.data.userId);
              if (cart.success && Array.isArray(cart.data)) {
                for (const ci of cart.data) {
                  try { await deleteCartItem(ci.id as any); } catch {}
                }
                // reset local badge
                localStorage.setItem('cart_count', '0');
                window.dispatchEvent(new Event('storage'));
              }
            } catch {}
          }
        }
      } catch {}
      setLoading(false);
    };
    run();
  }, [orderId, params]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải chi tiết đơn hàng..." />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,#f8fbff, #ffffff 60%)" }}>
      <style jsx>{`
        @keyframes fall { 0% { transform: translateY(-120vh) rotate(0); opacity: 0 } 10% {opacity:1} 100% { transform: translateY(120vh) rotate(720deg); opacity: 0 } }
        .confetti span { position:absolute; top:-10vh; width:8px; height:14px; border-radius:2px; animation: fall linear forwards }
      `}</style>
      <div className="confetti pointer-events-none absolute inset-0">
        {confetti.map((_, i) => {
          const left = Math.random() * 100;
          const delay = Math.random() * 1.2;
          const duration = 2.8 + Math.random() * 1.8;
          const colors = ["#22c55e","#60a5fa","#f59e0b","#ef4444","#a78bfa"];
          const bg = colors[i % colors.length];
          return <span key={i} style={{ left: `${left}%`, animationDuration: `${duration}s`, animationDelay: `${delay}s`, background: bg }} />
        })}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto bg-white/80 backdrop-blur rounded-2xl border border-green-200 shadow-sm p-10 text-center">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" className="text-green-700"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.2-2.125t-2.125-3.2T2 12t.788-3.9t2.125-3.2t3.2-2.125T12 2t3.9.788t3.2 2.125t2.125 3.2T22 12t-.788 3.9t-2.125 3.2t-3.2 2.125T12 22m-1.1-6.1l6.175-6.175l-1.4-1.4L10.9 13.1l-2.6-2.6l-1.4 1.4z"/></svg>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-2">Cảm ơn bạn đã thanh toán</h1>
          <p className="text-gray-600 mb-6">Bạn sẽ nhận được email xác nhận cùng chi tiết đơn hàng trong giây lát.</p>

          <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-left mb-6">
            <div className="flex justify-between text-sm text-gray-700 mb-2"><span>Mã đơn hàng</span><span className="font-semibold">{order?.id || orderId || "—"}</span></div>
            <div className="flex justify-between text-sm text-gray-700 mb-2"><span>Số tiền</span><span className="font-semibold">{formatCurrency(order ? String(order.totalPrice * 100) : amount)}</span></div>
            <div className="flex justify-between text-sm text-gray-700 mb-2"><span>Ngân hàng</span><span className="font-semibold">{bank || order?.paymentMethod || "—"}</span></div>
            <div className="flex justify-between text-sm text-gray-700"><span>Mã giao dịch</span><span className="font-semibold">{transNo || "—"}</span></div>
          </div>

          {order && (
            <div className="rounded-lg bg-gray-50 border p-4 text-left mb-8">
              <h2 className="font-semibold text-gray-900 mb-2">Thông tin khách hàng</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <div>Tên: {order.buyerName}</div>
                <div>Điện thoại: {order.buyerPhone}</div>
                <div>Email: {order.buyerEmail}</div>
                <div className="sm:col-span-2">Địa chỉ: {order.buyerAddress}</div>
              </div>
              <h3 className="font-semibold text-gray-900 mt-4 mb-2">Sản phẩm</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {order.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.productName} × {it.quantity}</span>
                    <span className="font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(it.unitPrice)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer" onClick={() => router.push("/")}>Về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  );
}



