import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Chọn cuộn film hoặc tìm hiểu máy film dùng một lần do SOORAH tuyển chọn.",
};

export default function ProductsPage() {
  return <section className="catalog-landing section-pad" aria-labelledby="catalog-title"><div className="section-index"><span>SOORAH / SẢN PHẨM</span><span>HAI CÁCH BẮT ĐẦU</span></div><div className="catalog-landing-heading"><h1 id="catalog-title">Bạn muốn chụp <em>theo cách nào?</em></h1><p>Chọn một loại bên dưới để xem sản phẩm và tình trạng hàng hiện tại.</p></div><div className="catalog-category-grid"><Link className="catalog-category" href="/products/film-rolls"><div className="catalog-category-visual film-roll-category"><Image className="catalog-category-image" src="/images/film-roll-category.webp" alt="Ảnh minh họa mờ của một cuộn film 35mm trên nền studio" fill sizes="(max-width: 760px) 100vw, 50vw" quality={85} /><span className="catalog-category-stamp">ĐANG NHẬN ĐƠN</span></div><div className="catalog-category-copy"><span>01 / CUỘN FILM 35MM</span><div><h2>Cuộn film</h2><ArrowUpRight size={28} aria-hidden="true" /></div><p>Cho chiếc máy film bạn đang dùng.</p></div></Link><Link className="catalog-category" href="/products/disposable-cameras"><div className="catalog-category-visual disposable-category"><div className="teaser-camera" aria-hidden="true"><div className="teaser-lens" /><div className="teaser-flash" /><span>?</span></div><span className="catalog-category-stamp">ĐỢT HÀNG TIẾP THEO</span></div><div className="catalog-category-copy"><span>02 / MÁY FILM DÙNG MỘT LẦN</span><div><h2>Máy film dùng một lần</h2><ArrowUpRight size={28} aria-hidden="true" /></div><p>Một cách thử chụp film khi chưa có máy.</p></div></Link></div></section>;
}
