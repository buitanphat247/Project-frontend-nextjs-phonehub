"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { updateOrderStatus } from "../../../../lib/api/orders";

export default function VnpayFailurePage() {
  const params = useSearchParams();
  const router = useRouter();

  const orderId = useMemo(() => {
    const info = params.get("vnp_OrderInfo") || "";
    try {
      const decoded = decodeURIComponent(info);
      const parsed = JSON.parse(decoded);
      return parsed.orderId || info;
    } catch {
      return info;
    }
  }, [params]);

  const code = params.get("vnp_ResponseCode");
  const status = params.get("vnp_TransactionStatus");
  const message = code === "24" ? "Giao dịch bị hủy bởi người dùng" : "Thanh toán thất bại";

  useEffect(() => {
    const run = async () => {
      if (!orderId) return;
      try {
        let rs = await updateOrderStatus(orderId, "failed");
        if (!rs.success) {
          await updateOrderStatus(orderId, "FAILED");
        }
      } catch {}
    };
    run();
  }, [orderId]);

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-red-200 p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">❌</div>
            <h1 className="text-2xl font-bold text-red-700">{message}</h1>
            <p className="text-gray-600 mt-2">Mã phản hồi: {code || "—"} | Trạng thái: {status || "—"}</p>
          </div>

          <div className="mt-8 text-center">
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
              onClick={() => router.push("/")}
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



