"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "./CartProvider";
import { site } from "@/data/content";
import { trapFocus } from "@/lib/focus";

const nav = [{ label: "Sản phẩm", href: "/products" }, { label: "Film Lab", href: "/film-lab" }, { label: "Về SOORAH", href: "/about" }, { label: "Hướng dẫn", href: "/guide" }, { label: "Cộng đồng", href: "/community" }];

export default function Header() {
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 28); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    menuRef.current?.querySelector<HTMLElement>("nav a")?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); trapFocus(event, menuRef.current); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [menuOpen]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    if (main) main.inert = menuOpen;
    if (footer) footer.inert = menuOpen;
    return () => { document.body.classList.remove("menu-open"); if (main) main.inert = false; if (footer) footer.inert = false; };
  }, [menuOpen]);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  return <><a className="skip-link" href="#main-content">Đi đến nội dung chính</a><header className={`site-header ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-active" : ""} ${pathname === "/products" ? "catalog-header" : ""} ${["/checkout", "/shipping", "/terms", "/privacy"].includes(pathname) ? "on-light" : ""}`}><Link href="/" className="wordmark" aria-label="SOORAH trang chủ" onClick={() => setMenuOpen(false)}><Image src="/images/soorah-logo.png" alt="" width={1379} height={804} priority sizes="(max-width: 760px) 64px, 75px" /></Link><nav className="desktop-nav" aria-label="Điều hướng chính">{nav.map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}</nav><div className="header-actions"><button className="cart-trigger" onClick={() => setOpen(true)} aria-label={`Mở giỏ hàng, ${count} sản phẩm`}><ShoppingBag size={19} strokeWidth={1.5} /><span>{String(count).padStart(2, "0")}</span></button><button className="menu-trigger" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? "Đóng menu" : "Mở menu"}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button></div></header><div ref={menuRef} id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} inert={!menuOpen}><span className="eyebrow">MỤC LỤC / SOORAH</span><nav aria-label="Điều hướng di động">{nav.map((item, index) => <Link href={item.href} key={item.label} onClick={() => setMenuOpen(false)}><small>0{index + 1}</small>{item.label}</Link>)}</nav><div className="mobile-menu-bottom"><a href={site.instagramUrl} target="_blank" rel="noreferrer">Instagram ↗</a><a href={site.facebookUrl} target="_blank" rel="noreferrer">Facebook ↗</a><a href={site.zaloUrl} target="_blank" rel="noreferrer">Zalo ↗</a><a href={`mailto:${site.contactEmail}`}>Gmail ↗</a><span>Film, made simple.</span></div></div></>;
}
