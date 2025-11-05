// Standalone request (không dùng apiClient) để gọi trực tiếp backend VNPAY

/**
 * Submit VNPAY order to backend
 * Backend expects @RequestParam amount (int) and orderInfo (string)
 * We will send as application/x-www-form-urlencoded
 */
export async function submitVnpayOrder(amount: number, orderInfo: string): Promise<{ raw: string; redirectUrl?: string }> {
  // Gọi trực tiếp endpoint tuyệt đối: http://localhost:8080/api/v1/vnpay/submitOrder?amount=...&orderInfo=...
  const qs = new URLSearchParams({ amount: String(Math.floor(amount)), orderInfo });
  const url = `http://localhost:8080/api/v1/vnpay/submitOrder?${qs.toString()}`;

  const response = await fetch(url, {
    method: "POST",
    // Không gửi body, chỉ dùng query params theo yêu cầu
  });
  console.log("response", response);
  // Proxy may return JSON-wrapped string; try text first
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
