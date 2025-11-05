"use client";
import { useEffect } from "react";
import { Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function VnpayPaymentPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (!params) return;
    const responseCode = params.get("vnp_ResponseCode");
    const status = params.get("vnp_TransactionStatus");

    const isSuccess = responseCode === "00" && status === "00";
    const target = isSuccess ? "/vnpay-payment/success" : "/vnpay-payment/failure";
    const query = params.toString();
    router.replace(`${target}?${query}`);
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
      </div>
    </div>
  );
}