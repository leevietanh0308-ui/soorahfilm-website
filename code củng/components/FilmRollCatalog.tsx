"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { featuredProduct, formatPrice } from "@/data/products";

const nextRolls = ["Cuộn film tiếp theo 01", "Cuộn film tiếp theo 02"];
const kodakCardImage = "/images/kodak-ultramax-400-card.jpeg";

export default function FilmRollCatalog() {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [opening, setOpening] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const openProduct = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    event.preventDefault();
    if (opening) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    setOpening({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 });
    timer.current = setTimeout(() => router.push(`/product/${featuredProduct.slug}`), 600);
  };

  return <section className="film-roll-catalog section-pad" aria-labelledby="film-roll-catalog-title">
    <div className="section-index"><span>01 / CUỘN FILM</span><span>CHỌN CUỘN CỦA BẠN</span></div>
    <div className="film-roll-catalog-heading"><h2 id="film-roll-catalog-title">Những cuộn <em>đang chờ bạn.</em></h2><p>Chạm vào cuộn film để xem ảnh, thông số và cách đặt hàng.</p></div>
    <div className="film-roll-grid">
      <Link className="film-roll-card film-roll-card-active" href={`/product/${featuredProduct.slug}`} onClick={openProduct}>
        <div className="film-roll-card-visual"><Image className="film-roll-card-photo" src={kodakCardImage} alt="Hộp Kodak Ultramax 400 ở giữa bốn ảnh phong cảnh do SOORAH cung cấp" fill sizes="(max-width: 760px) 100vw, 33vw" quality={88} /><span className="film-roll-card-index">01 / ĐANG NHẬN ĐƠN</span><span className="film-roll-card-corner" aria-hidden="true">↗</span></div>
        <div className="film-roll-card-copy"><div><span>FILM MÀU 35MM · ISO 400</span><h3>{featuredProduct.name}</h3></div><ArrowUpRight size={23} aria-hidden="true" /></div>
        <p>{formatPrice(featuredProduct.price)} / CUỘN · 36 TẤM ẢNH</p>
      </Link>
      {nextRolls.map((name, index) => <article className="film-roll-card film-roll-card-soon" key={name}>
        <div className="film-roll-card-visual"><div className="film-roll-placeholder" aria-hidden="true"><div className="film-roll-placeholder-cap" /><div className="film-roll-placeholder-body"><span>?</span></div></div><span className="film-roll-card-index">0{index + 2} / CHƯA CÔNG BỐ</span><span className="film-roll-coming-label">ĐỢT HÀNG TIẾP THEO</span></div>
        <div className="film-roll-card-copy"><div><span>ĐANG CHỜ THÔNG TIN</span><h3>{name}</h3></div></div>
        <p>SOORAH SẼ CẬP NHẬT ẢNH VÀ TÊN KHI CÓ HÀNG</p>
      </article>)}
    </div>
    {opening && createPortal(<div className="film-roll-opening" style={{ "--opening-x": `${opening.x}px`, "--opening-y": `${opening.y}px` } as React.CSSProperties} aria-hidden="true"><div className="film-roll-opening-content"><span>SOORAH / CUỘN FILM 001</span><div className="film-roll-opening-image"><Image className="film-roll-opening-cutout" src="/images/kodak-ultramax-cutout.png" alt="" fill sizes="(max-width: 760px) 83vw, 450px" quality={90} /></div><strong>KODAK ULTRAMAX</strong></div></div>, document.body)}
  </section>;
}
