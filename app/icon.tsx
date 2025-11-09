import { ImageResponse } from "next/og";

// Cấu hình icon metadata - Next.js tự động serve tại /icon
export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

// Generate dynamic icon cho PhoneHub
// Browser sẽ tự động tìm /icon hoặc /favicon.ico
// Icon này hiển thị trên tab trình duyệt
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 200,
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "900",
          fontFamily: "system-ui, -apple-system, sans-serif",
          borderRadius: "100%",
          boxShadow: "0 4px 20px rgba(24, 144, 255, 0.3)",
        }}
      >
        PH
      </div>
    ),
    {
      ...size,
    }
  );
}
