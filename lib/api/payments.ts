/**
 * Submit VNPAY order to backend
 * Backend expects @RequestParam amount (int) and orderInfo (string)
 * 
 * Sử dụng Next.js API route riêng để:
 * - Tránh CORS khi deploy
 * - Không ảnh hưởng đến chữ ký VNPAY (không thêm headers không cần thiết)
 */
export async function submitVnpayOrder(amount: number, orderInfo: string): Promise<{ raw: string; redirectUrl?: string }> {
  // Gọi Next.js API route riêng (không qua proxy chung)
  // Route này sẽ forward đến backend mà không thêm headers
  const qs = new URLSearchParams({ 
    amount: String(Math.floor(amount)), 
    orderInfo: orderInfo 
  });
  const url = `/api/vnpay/submitOrder?${qs.toString()}`;

  const response = await fetch(url, {
    method: "POST",
    // Không gửi body, chỉ dùng query params theo yêu cầu
    // Không thêm headers để tránh ảnh hưởng đến chữ ký VNPAY
  });

  // Response là text string (không phải JSON)
  const rawText = await response.text();

  // If proxy wrapped it as JSON string, it'll look like "redirect:URL" (quoted)
  let raw = rawText;
  try {
    const parsed = JSON.parse(rawText);
    if (typeof parsed === "string") {
      raw = parsed;
    }
  } catch {
    // ignore JSON parse error; keep rawText
  }

  const redirectPrefix = "redirect:";
  const redirectUrl = raw.startsWith(redirectPrefix) ? raw.slice(redirectPrefix.length) : undefined;

  return { raw, redirectUrl };
}
