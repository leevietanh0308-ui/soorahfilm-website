"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clipboard, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatPrice, products } from "@/data/products";
import { site } from "@/data/content";
import { track } from "@/lib/analytics";

type FormData = { name: string; phone: string; instagram: string; method: "delivery" | "pickup"; address: string; note: string };
const initial: FormData = { name: "", phone: "", instagram: "", method: "delivery", address: "", note: "" };

export default function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState<FormData>(initial);
  const [summary, setSummary] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const orderEndpoint = process.env.NEXT_PUBLIC_ORDER_WEB_APP_URL?.trim() || "";
  const ordersEnabled = orderEndpoint.startsWith("https://script.google.com/macros/s/") && orderEndpoint.endsWith("/exec");
  const change = (key: keyof FormData, value: string) => { setForm((current) => ({ ...current, [key]: value })); setError(""); };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!items.length) { event.preventDefault(); setError("Giỏ hàng đang trống."); return; }
    if (!form.name.trim() || form.name.trim().length > 100 || !/^[0-9+().\s-]{9,16}$/.test(form.phone.trim())) {
      event.preventDefault(); setError("Vui lòng nhập tên và số điện thoại hợp lệ."); return;
    }
    if (form.method === "delivery" && !form.address.trim()) {
      event.preventDefault(); setError("Vui lòng nhập địa chỉ nhận hàng."); return;
    }
    if (form.address.length > 300 || form.instagram.length > 100 || form.note.length > 1000) {
      event.preventDefault(); setError("Thông tin quá dài. Vui lòng rút gọn."); return;
    }
    if (ordersEnabled) {
      const orderId = event.currentTarget.elements.namedItem("order_id");
      if (!(orderId instanceof HTMLInputElement)) {
        event.preventDefault(); setError("Không thể chuẩn bị đơn hàng. Vui lòng tải lại trang."); return;
      }
      orderId.value ||= "SOO-" + crypto.randomUUID();
      track("order_submit", { value: subtotal, mode: "google_sheets" });
      return;
    }
    event.preventDefault();
    const lines = ["SOORAH / YÊU CẦU ĐẶT HÀNG", "", ...items.map((item) => { const product = products.find((entry) => entry.id === item.id); return `${product?.name || item.id} × ${item.quantity} = ${formatPrice((product?.price || 0) * item.quantity)}`; }), `Tạm tính film: ${formatPrice(subtotal)}`, "Phí vận chuyển: chờ SOORAH xác nhận", "Phí tráng và quét ảnh: không bao gồm", "", `Tên: ${form.name.trim()}`, `SĐT: ${form.phone.trim()}`, `Instagram: ${form.instagram.trim() || "không cung cấp"}`, `Hình thức: ${form.method === "delivery" ? "Giao hàng" : "Nhận trực tiếp (chờ xác nhận)"}`, ...(form.method === "delivery" ? [`Địa chỉ: ${form.address.trim()}`] : []), `Ghi chú: ${form.note.trim() || "không có"}`];
    setSummary(lines.join("\n"));
    track("order_submit", { value: subtotal, mode: "draft_only" });
  };
  const copy = async () => { try { await navigator.clipboard.writeText(summary); setCopied(true); window.setTimeout(() => setCopied(false), 2200); } catch { setError("Không thể sao chép tự động. Hãy chọn và sao chép nội dung bên dưới."); } };
  return <div className="checkout-page"><div className="checkout-heading"><span className="eyebrow">CUỘN FILM / THÔNG TIN CỦA BẠN</span><h1>Cuộn film <em>của bạn.</em></h1><p>{ordersEnabled ? "Điền thông tin và gửi yêu cầu đặt hàng. Bạn sẽ thấy trang xác nhận sau khi đơn được ghi vào Google Sheets của SOORAH. SOORAH sẽ liên hệ để xác nhận hàng, phí giao và cách thanh toán." : "Điền thông tin để tạo nội dung đơn hàng. Đơn chỉ được gửi đi khi bạn sao chép và nhắn trực tiếp cho SOORAH; trang này chưa nhận thanh toán hoặc lưu thông tin của bạn."}</p></div>{!items.length ? <div className="checkout-empty"><ShoppingBag size={36} strokeWidth={1} /><h2>Giỏ hàng vẫn đang trống.</h2><Link href="/products" className="button button-light">SẢN PHẨM <ArrowRight size={17} /></Link></div> : <div className="checkout-grid"><div>{summary ? <div className="order-summary-result"><span className="eyebrow">SẴN SÀNG GỬI / BẢN NHÁP</span><h2>Nội dung đơn<br /><em>đã sẵn sàng.</em></h2><p>Sao chép nội dung rồi gửi qua Instagram {site.instagramHandle}. Hãy chờ xác nhận hàng, phí vận chuyển và cách thanh toán trước khi chuyển tiền.</p><textarea aria-label="Nội dung đơn hàng" readOnly value={summary} rows={14} /><div className="result-actions"><button className="button button-red" onClick={copy}>{copied ? "ĐÃ SAO CHÉP" : "SAO CHÉP NỘI DUNG ĐƠN"} {copied ? <Check size={17} /> : <Clipboard size={17} />}</button><a className="button button-outline-dark" href={site.instagramUrl} target="_blank" rel="noreferrer" onClick={() => track("instagram_click", { source: "checkout" })}>MỞ INSTAGRAM ↗</a></div><button className="text-link edit-order" onClick={() => setSummary("")}>SỬA THÔNG TIN ↗</button></div> : <form className="checkout-form" action={ordersEnabled ? orderEndpoint : undefined} method={ordersEnabled ? "POST" : undefined} onSubmit={submit} noValidate><input type="hidden" name="order_id" defaultValue="" /><input type="hidden" name="items" value={JSON.stringify(items)} /><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} /><h2>01 / THÔNG TIN CỦA BẠN</h2><div className="form-pair"><label>Họ tên <span>*</span><input name="name" value={form.name} maxLength={100} onChange={(event) => change("name", event.target.value)} autoComplete="name" required placeholder="Tên của bạn" /></label><label>Số điện thoại <span>*</span><input name="phone" value={form.phone} maxLength={16} onChange={(event) => change("phone", event.target.value)} autoComplete="tel" inputMode="tel" required placeholder="09..." /></label></div><label>Instagram <small>(không bắt buộc)</small><input name="instagram" value={form.instagram} maxLength={100} onChange={(event) => change("instagram", event.target.value)} placeholder="@tenban" /></label><h2>02 / NHẬN HÀNG</h2><fieldset><legend>Hình thức nhận hàng</legend><div className="method-options"><label className={form.method === "delivery" ? "selected" : ""}><input type="radio" name="method" checked={form.method === "delivery"} onChange={() => change("method", "delivery")} /> Giao hàng</label><label className={form.method === "pickup" ? "selected" : ""}><input type="radio" name="method" checked={form.method === "pickup"} onChange={() => change("method", "pickup")} /> Nhận trực tiếp (chờ xác nhận)</label></div></fieldset>{form.method === "delivery" && <label>Địa chỉ nhận hàng <span>*</span><input name="address" value={form.address} maxLength={300} onChange={(event) => change("address", event.target.value)} autoComplete="street-address" required placeholder="Số nhà, đường, phường, quận..." /></label>}<label>Ghi chú <small>(không bắt buộc)</small><textarea name="note" value={form.note} maxLength={1000} onChange={(event) => change("note", event.target.value)} rows={3} placeholder="Điều SOORAH nên biết" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-red full" type="submit">{ordersEnabled ? "GỬI YÊU CẦU ĐẶT HÀNG" : "TẠO NỘI DUNG ĐƠN"} <ArrowRight size={18} /></button><p className="form-fineprint">{ordersEnabled ? "Không có thanh toán trực tuyến. Thông tin đơn sẽ được gửi tới Google Sheets do SOORAH quản lý." : "Không có thanh toán trực tuyến. Thông tin nhập chỉ dùng để tạo nội dung trên thiết bị của bạn."}</p></form>}</div><aside className="order-recap"><span className="eyebrow">GIỎ HÀNG / {items.length} SẢN PHẨM</span>{items.map((item) => { const product = products.find((entry) => entry.id === item.id); return <div className="recap-item" key={item.id}><div className="mini-pack"><span>Kodak</span><b>ULTRAMAX</b><strong>400</strong></div><div><strong>{product?.name}</strong><span>SL {item.quantity} / {formatPrice((product?.price || 0) * item.quantity)}</span></div></div>; })}<div className="recap-total"><span>TẠM TÍNH FILM</span><strong>{formatPrice(subtotal)}</strong></div><p>Phí vận chuyển tính riêng.<br />Phí tráng và quét ảnh trả cho tiệm bạn chọn.</p><Link href="/product/kodak-ultramax-400" className="text-link">QUAY LẠI SẢN PHẨM ↗</Link></aside></div>}</div>;
}
