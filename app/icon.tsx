import { ImageResponse } from "next/og";

// Cấu hình icon metadata - Next.js tự động serve tại /icon
export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

// Generate dynamic icon cho PhoneHub
// Browser sẽ tự động tìm /icon hoặc /favicon.ico
export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 180,
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontFamily: "system-ui, -apple-system, sans-serif",
          borderRadius: "100%",
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
