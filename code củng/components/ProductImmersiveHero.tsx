"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight } from "lucide-react";

const image = "/images/kodak-ultramax-cutout.png";
const clamp = (value: number) => Math.min(1, Math.max(0, value));

function between(progress: number, values: number[]) {
  const segment = Math.min(values.length - 2, Math.floor(progress * (values.length - 1)));
  const amount = progress * (values.length - 1) - segment;
  const eased = amount * amount * (3 - 2 * amount);
  return values[segment] + (values[segment + 1] - values[segment]) * eased;
}

export default function ProductImmersiveHero() {
  const story = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = story.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const distance = Math.max(1, bounds.height - window.innerHeight);
        const progress = clamp(-bounds.top / distance);
        const mobile = window.innerWidth < 760;
        const x = between(progress, mobile ? [0, 0.08, -0.08, 0.07, 0] : [0, 0.245, -0.245, 0.235, 0]);
        const y = between(progress, mobile ? [0, -0.09, -0.08, -0.08, -0.04] : [0, -0.025, 0.015, -0.02, -0.13]);
        const scale = between(progress, mobile ? [1, 0.81, 0.84, 0.79, 0.85] : [1, 0.9, 0.94, 0.86, 0.82]);
        const angle = between(progress, [0, -7, 8, -5, 0]);
        element.style.setProperty("--story-x", `${Math.round(x * window.innerWidth)}px`);
        element.style.setProperty("--story-y", `${Math.round(y * window.innerHeight)}px`);
        element.style.setProperty("--story-scale", String(scale));
        element.style.setProperty("--story-angle", `${angle}deg`);
        element.style.setProperty("--story-progress", `${progress * 100}%`);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <section ref={story} className="product-story" aria-labelledby="immersive-product-title">
    <div className="product-story-stage" aria-hidden="true">
      <div className="product-story-glow" />
      <div className="product-story-ghost">ULTRA<br />MAX</div>
      <div className="product-story-object"><Image src={image} alt="" fill priority sizes="(max-width: 760px) 82vw, (max-width: 1200px) 48vw, 560px" quality={92} /></div>
      <div className="product-story-progress"><span>01</span><span className="product-story-progress-track"><i /></span><span>05</span></div>
      <span className="product-story-side">SOORAH / FILM 001</span>
    </div>

    <div className="product-story-chapters">
      <div className="product-story-nav"><Link href="/products/film-rolls"><ArrowLeft size={15} aria-hidden="true" /> CUỘN FILM</Link><span>SOORAH / 001</span></div>

      <section className="product-story-chapter product-story-intro" aria-label="Giới thiệu Kodak Ultramax">
        <div className="product-story-intro-copy">
          <span className="product-story-kicker">MỘT CUỘN FILM CHO NHỮNG NGÀY MUỐN GIỮ LẠI</span>
          <h1 id="immersive-product-title">KODAK <span>ULTRAMAX</span></h1>
          <div className="product-story-intro-foot"><span>400 / FILM MÀU 35MM / 36 TẤM ẢNH</span><span>CUỘN XUỐNG ĐỂ KHÁM PHÁ <ArrowDown size={17} aria-hidden="true" /></span></div>
        </div>
      </section>

      <section className="product-story-chapter product-story-chapter-left" aria-labelledby="story-everyday">
        <div className="product-story-copy"><span className="product-story-number">01 / MANG THEO</span><h2 id="story-everyday">Ngày thường<br /><em>cũng đáng nhớ.</em></h2><p>Một buổi dạo phố, chuyến đi ngắn hay khoảng nắng ngang cửa sổ. Chọn khung hình, rồi để cuộn film giữ lại cách bạn nhìn ngày hôm ấy.</p><span className="product-story-rule">KODAK ULTRAMAX 400 <ArrowUpRight size={15} aria-hidden="true" /></span></div>
      </section>

      <section className="product-story-chapter product-story-chapter-right" aria-labelledby="story-specs">
        <div className="product-story-copy"><span className="product-story-number">02 / TRONG CUỘN FILM</span><h2 id="story-specs">36 tấm ảnh.<br /><em>Mỗi tấm một lần.</em></h2><p>Film màu 35mm, độ nhạy ISO 400. Hợp với những ngày đủ sáng, những cuộc đi chơi và người mới bắt đầu chụp film.</p><div className="product-story-specs"><span>35MM <small>ĐỊNH DẠNG</small></span><span>400 <small>ISO</small></span><span>36 <small>TẤM ẢNH</small></span></div></div>
      </section>

      <section className="product-story-chapter product-story-chapter-left" aria-labelledby="story-finish">
        <div className="product-story-copy"><span className="product-story-number">03 / SAU KHI CHỤP</span><h2 id="story-finish">Hẹn gặp lại<br /><em>những khung hình.</em></h2><p>Chụp xong, tua film về hộp rồi mang đến tiệm tráng C-41. Cảm giác chờ ảnh hiện ra cũng là một phần của cuộc chơi.</p><span className="product-story-rule">CHỤP / TUA FILM / TRÁNG / QUÉT</span></div>
      </section>

      <section className="product-story-chapter product-story-last" aria-labelledby="story-ready">
        <div className="product-story-last-copy"><span className="product-story-number">04 / BẮT ĐẦU</span><h2 id="story-ready">Sẵn sàng cho<br /><em>cuộn tiếp theo?</em></h2><a href="#chi-tiet-san-pham" className="button button-light">XEM SẢN PHẨM &amp; ĐẶT HÀNG <ArrowDown size={18} aria-hidden="true" /></a><p>Ảnh bao bì minh họa có thể khác; sản phẩm đang bán là cuộn 36 tấm ảnh.</p></div>
      </section>
    </div>
  </section>;
}
