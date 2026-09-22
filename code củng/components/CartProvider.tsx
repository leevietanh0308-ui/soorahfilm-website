"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { formatPrice, products } from "@/data/products";
import { track } from "@/lib/analytics";
import { trapFocus } from "@/lib/focus";

type CartItem = { id: string; quantity: number };
type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, quantity?: number) => void;
  update: (id: string, quantity: number) => void;
  clear: () => void;
};
const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "soorah.cart.v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (Array.isArray(saved)) setItems(saved.filter((item) => typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0 && products.some((product) => product.id === item.id && product.available)));
    } catch { /* Bỏ qua dữ liệu giỏ hàng bị lỗi. */ }
  }, []);
  useEffect(() => { localStorage.setItem(storageKey, JSON.stringify(items)); }, [items]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); trapFocus(event, drawerRef.current); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [open]);

  const add = useCallback((id: string, quantity = 1) => {
    const product = products.find((entry) => entry.id === id && entry.available);
    if (!product) return;
    setItems((current) => {
      const existing = current.find((item) => item.id === id);
      return existing ? current.map((item) => item.id === id ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item) : [...current, { id, quantity: Math.min(99, quantity) }];
    });
    track("add_to_cart", { product_id: id, quantity });
    setOpen(true);
  }, []);
  const update = useCallback((id: string, quantity: number) => setItems((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity: Math.min(99, quantity) } : item)), []);
  const clear = useCallback(() => setItems([]), []);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (products.find((product) => product.id === item.id)?.price || 0) * item.quantity, 0);
  const value = useMemo(() => ({ items, count, subtotal, open, setOpen, add, update, clear }), [items, count, subtotal, open, add, update, clear]);

  return <CartContext.Provider value={value}>{children}<CartDrawer drawerRef={drawerRef} /></CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart phải được dùng bên trong CartProvider");
  return context;
}

function CartDrawer({ drawerRef }: { drawerRef: React.RefObject<HTMLElement | null> }) {
  const { items, count, subtotal, open, setOpen, update } = useCart();
  return <div className={`cart-layer ${open ? "is-open" : ""}`} aria-hidden={!open}>
    <button className="cart-backdrop" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1} aria-label="Đóng giỏ hàng" />
    <aside ref={drawerRef} className="cart-drawer" role="dialog" aria-modal="true" aria-label="Giỏ hàng" inert={!open}>
      <div className="cart-top"><span className="eyebrow">GIỎ HÀNG / {String(count).padStart(2, "0")}</span><button className="icon-button" onClick={() => setOpen(false)} aria-label="Đóng giỏ hàng"><X size={22} /></button></div>
      {items.length ? <>
        <div className="cart-items">{items.map((item) => { const product = products.find((entry) => entry.id === item.id); if (!product) return null; return <div className="cart-item" key={item.id}><div className="mini-pack"><span>Kodak</span><b>ULTRAMAX</b><strong>400</strong></div><div className="cart-item-info"><Link href={`/product/${product.slug}`}>{product.name}</Link><p>{product.format} · {product.exposures} kiểu ảnh</p><strong>{formatPrice(product.price)}</strong><div className="qty-control small"><button onClick={() => update(item.id, item.quantity - 1)} aria-label={`Giảm số lượng ${product.name}`}><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => update(item.id, item.quantity + 1)} aria-label={`Tăng số lượng ${product.name}`}><Plus size={14} /></button></div></div></div>; })}</div>
        <div className="cart-bottom"><div className="cart-subtotal"><span>Tạm tính</span><strong>{formatPrice(subtotal)}</strong></div><p>Chưa bao gồm phí vận chuyển, tráng và quét ảnh. SOORAH sẽ xác nhận phí giao hàng khi nhận đơn.</p><Link className="button button-light full" href="/checkout" onClick={() => track("begin_checkout", { value: subtotal })}>TIẾP TỤC ĐẶT HÀNG <ArrowRight size={17} /></Link></div>
      </> : <div className="cart-empty"><ShoppingBag size={34} strokeWidth={1} /><h2>Chưa có cuộn nào.</h2><p>Một cuộn film là đủ để bắt đầu.</p><Link className="text-link" href="/product/kodak-ultramax-400">XEM ULTRAMAX 400 <ArrowRight size={16} /></Link></div>}
    </aside>
  </div>;
}
