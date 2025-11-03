"use client";

import React, { useEffect, useState } from "react";
import { Result, Button, Spin, message } from "antd";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailChange } from "../../../../lib/api/auth";
import { getAuthData, updateAuthData } from "../../../../lib/utils/cookie";
import { getUserById } from "../../../../lib/api/users";

export default function VerifyEmailChangePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setSuccess(false);
      setMsg("Thiếu token xác minh");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await verifyEmailChange(token);
        if (res.success) {
          setSuccess(true);
          setMsg(res.message || "Xác minh email thành công");
          message.success(res.message || "Xác minh email thành công");
          // đồng bộ lại email trong cookie auth_data
          const auth = getAuthData();
          if (auth?.userId) {
            try {
              const userRes = await getUserById(parseInt(auth.userId, 10));
              if (userRes.success && userRes.data?.email) {
                updateAuthData({ email: userRes.data.email });
              }
            } catch {}
          }
        } else {
          setSuccess(false);
          // Xử lý thông báo lỗi thân thiện hơn
          let errorMsg = res.message || "Xác minh email thất bại";
          // Kiểm tra nếu là lỗi duplicate email hoặc lỗi database liên quan email
          if (errorMsg.toLowerCase().includes('duplicate') || 
              (errorMsg.toLowerCase().includes('email') && 
               (errorMsg.toLowerCase().includes('constraint') || errorMsg.toLowerCase().includes('unique')))) {
            errorMsg = "Email đã được sử dụng hoặc không hợp lệ. Vui lòng thử email khác.";
          }
          setMsg(errorMsg);
          message.error(errorMsg);
        }
      } catch (e: any) {
        setSuccess(false);
        let errorMsg = "Lỗi xác minh email";
        // Parse lỗi từ response nếu có
        if (e?.message) {
          const msg = e.message.toLowerCase();
          if (msg.includes('duplicate') || 
              (msg.includes('email') && (msg.includes('constraint') || msg.includes('unique')))) {
            errorMsg = "Email đã được sử dụng hoặc không hợp lệ. Vui lòng thử email khác.";
          } else if (msg.includes('expired') || msg.includes('hết hạn') || msg.includes('invalid')) {
            errorMsg = "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đổi email mới.";
          } else {
            errorMsg = e.message;
          }
        }
        setMsg(errorMsg);
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spin tip="Đang xác minh..." size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      {success ? (
        <Result
          status="success"
          title="Xác minh email thành công"
          subTitle={msg}
          extra={[
            <Button type="primary" key="home" onClick={() => router.push("/")}>Về trang chủ</Button>,
            <Button key="account" onClick={() => router.push("/account")}>Về tài khoản</Button>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="Xác minh email thất bại"
          subTitle={msg || "Token không hợp lệ hoặc đã hết hạn"}
          extra={[
            <Button type="primary" key="retry" onClick={() => router.push("/account")}>Quay lại tài khoản</Button>,
          ]}
        />
      )}
    </div>
  );
}


