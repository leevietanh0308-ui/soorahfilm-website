"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Clipboard, X } from "lucide-react";
import { site } from "@/data/content";
import { track } from "@/lib/analytics";
import { trapFocus } from "@/lib/focus";

export default function NextDrop() {
  const [open, setOpen] = useState(false);
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    modalRef.current?.querySelector<HTMLElement>("input, .interest-modal > .button")?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); trapFocus(event, modalRef.current); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [open, message]);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!contact.trim()) return;
    setMessage(`SOORAH / ĐỢT HÀNG TIẾP THEO\nMình quan tâm Kodak FunSaver 800 khi có thông tin mới.\nLiên hệ: ${contact.trim()}`);
    track("funsaver_interest", { mode: "draft_only" });
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); } catch { setCopied(false); }
  };
  return <section className="next-drop section-pad"><div className="section-index"><span>01 / ĐỢT HÀNG TIẾP THEO</span><span>THÊM MỘT CÁCH BẮT ĐẦU</span></div><div className="next-grid"><div><span className="eyebrow">CHƯA CÓ MÁY ẢNH?</span><h2 data-reveal>Bạn vẫn có thể <em>bắt đầu.</em></h2><p>Chúng mình đang khám phá một lựa chọn film dùng một lần cho những người muốn thử mà chưa có máy. Chưa mở bán.</p><button className="button button-outline-dark" onClick={() => setOpen(true)}>TÔI QUAN TÂM <ArrowUpRight size={18} /></button></div><div className="teaser-visual" aria-label="Hình bóng minh hoạ máy ảnh dùng một lần"><div className="teaser-camera"><div className="teaser-lens" /><div className="teaser-flash" /><span>?</span></div><span className="teaser-label">ĐỢT HÀNG TIẾP THEO / ĐANG TÌM HIỂU<br />KODAK FUNSAVER 800</span></div></div>{open && <div className="modal-layer" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><div ref={modalRef} className="interest-modal" role="dialog" aria-modal="true" aria-labelledby="interest-title"><button className="icon-button modal-close" onClick={() => setOpen(false)} aria-label="Đóng"><X /></button>{message ? <><span className="eyebrow">ĐỢT HÀNG TIẾP / ĐÃ CÓ BẢN NHÁP</span><h3 id="interest-title">Cứ tò mò nhé.</h3><p>Chúng mình chưa lưu danh sách chờ tự động. Sao chép tin nhắn và gửi đến Instagram {site.instagramHandle} để báo bạn quan tâm.</p><textarea className="interest-message" value={message} readOnly rows={4} aria-label="Nội dung tin nhắn quan tâm" /><button className="button button-red full" onClick={copy}>{copied ? "ĐÃ SAO CHÉP" : "SAO CHÉP TIN NHẮN"} {copied ? <Check size={17} /> : <Clipboard size={17} />}</button><a className="text-link" href={site.instagramUrl} target="_blank" rel="noreferrer">MỞ INSTAGRAM ↗</a></> : <form onSubmit={submit}><span className="eyebrow">ĐỢT HÀNG TIẾP / QUAN TÂM</span><h3 id="interest-title">Bạn tò mò chứ?</h3><p>Để lại email hoặc Instagram để tạo tin nhắn gửi SOORAH. Thông tin không được gửi hoặc lưu tự động.</p><label htmlFor="interest-contact">EMAIL HOẶC INSTAGRAM</label><input ref={inputRef} id="interest-contact" value={contact} onChange={(event) => setContact(event.target.value)} placeholder="@tenban hoặc ban@vidu.com" required /><button className="button button-red full" type="submit">TẠO TIN NHẮN <ArrowUpRight size={17} /></button></form>}</div></div>}</section>;
}
