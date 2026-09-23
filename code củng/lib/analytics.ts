export type AnalyticsEvent = "view_product" | "add_to_cart" | "begin_checkout" | "order_submit" | "instagram_click" | "guide_open" | "funsaver_interest" | "gallery_interaction" | "film_lab_start" | "film_lab_change" | "film_lab_result" | "film_lab_save" | "film_lab_share" | "shop_from_simulator";

// Kết nối GA4, Meta Pixel hoặc công cụ khác tại đây khi có mã đo lường.
export function track(event: AnalyticsEvent, detail: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("soorah:analytics", { detail: { event, ...detail } }));
}
