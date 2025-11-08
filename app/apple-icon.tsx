import { ImageResponse } from "next/og";

// Cấu hình Apple touch icon (180x180px)
export const size = {
  width: 180,
  height: 180,
};

export const runtime = "edge";

export const contentType = "image/png";

// Generate Apple touch icon cho PhoneHub
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontFamily: "system-ui, -apple-system, sans-serif",
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
