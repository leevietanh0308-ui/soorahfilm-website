import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Về SOORAH",
  description: "SOORAH giúp người trẻ mới bước vào nhiếp ảnh analog chọn film, hiểu cách chụp và bắt đầu dễ dàng hơn.",
};

export default function AboutPage() {
  return <>
    <section className="about-hero" aria-labelledby="about-title">
      <div className="about-hero-image" aria-hidden="true"><Image src="/images/film/frame-09.webp" alt="" fill priority sizes="100vw" quality={85} /></div>
      <div className="about-hero-shade" aria-hidden="true" />
      <div className="about-hero-content"><span className="eyebrow">SOORAH / CÂU CHUYỆN THƯƠNG HIỆU</span><h1 id="about-title">Về <em>SOORAH.</em></h1><p>Một điểm bắt đầu gần gũi hơn với nhiếp ảnh analog.</p><a href="#cau-chuyen" className="about-hero-scroll">ĐỌC CÂU CHUYỆN <ArrowDown size={17} aria-hidden="true" /></a></div>
      <span className="about-hero-note">FILM PHOTOGRAPHY / SOORAH COLLECTION</span>
    </section>

    <section className="about-opening section-pad" id="cau-chuyen" aria-labelledby="about-opening-title">
      <div className="section-index"><span>01 / KHOẢNG TRỐNG</span><span>VÌ SAO CÓ SOORAH</span></div>
      <div className="about-opening-grid"><span className="about-margin-note">BẮT ĐẦU TỪ<br />NGƯỜI MỚI CHỤP FILM</span><h2 id="about-opening-title">SOORAH không giải quyết bài toán “thiếu nơi bán film”; thị trường hiện tại đã có nhiều cửa hàng làm điều đó tốt. <em>Khoảng trống mà SOORAH muốn tập trung vào là trải nghiệm của những người trẻ mới bước vào nhiếp ảnh analog.</em></h2></div>
    </section>

    <section className="about-barriers section-pad" aria-labelledby="about-barriers-title">
      <div className="section-index"><span>02 / NGƯỜI MỚI</span><span>NHỮNG ĐIỀU CÒN KHÓ BẮT ĐẦU</span></div>
      <div className="about-editorial-grid"><h2 id="about-barriers-title">Film thú vị.<br /><em>Bước đầu còn khó.</em></h2><p>Đối với nhiều học sinh và sinh viên, trải nghiệm chơi film vẫn có một số rào cản: giá film tương đối cao, có quá nhiều loại film khiến người mới khó lựa chọn, kiến thức về ISO, điều kiện ánh sáng, cách sử dụng và tráng scan còn phân tán, trong khi việc mua film thường vẫn giống một giao dịch sản phẩm hơn là một trải nghiệm dành cho người mới.</p></div>
    </section>

    <section className="about-approach" aria-labelledby="about-approach-title">
      <div className="about-approach-image"><Image src="/images/film/frame-01.webp" alt="Một góc hiệu sách được chụp bằng máy film" fill sizes="(max-width: 760px) 100vw, 48vw" quality={84} /></div>
      <div className="about-approach-copy"><span className="eyebrow">03 / CÁCH SOORAH BẮT ĐẦU</span><h2 id="about-approach-title">Chọn kỹ hơn.<br /><em>Giải thích dễ hơn.</em></h2><p>SOORAH xây dựng một lifestyle analog brand dành trước hết cho Gen Z: bắt đầu bằng một số sản phẩm được lựa chọn kỹ thay vì bán quá nhiều SKU, giữ mức giá dễ tiếp cận nhờ mô hình vận hành tinh gọn, đồng thời cung cấp hướng dẫn đơn giản để người mới có thể mua film và bắt đầu chụp mà không cần hiểu quá sâu về kỹ thuật.</p><Link href="/guide" className="text-link">XEM HƯỚNG DẪN <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    </section>

    <section className="about-future section-pad" aria-labelledby="about-future-title">
      <div className="section-index"><span>04 / VỀ DÀI HẠN</span><span>MỘT LỐI SỐNG ANALOG</span></div>
      <div className="about-editorial-grid"><h2 id="about-future-title">Từ một cuộn film<br /><em>đến nhiều cách trải nghiệm.</em></h2><p>Về dài hạn, SOORAH hướng tới phát triển từ việc bán film thành một thương hiệu lifestyle xoay quanh analog photography, với curated products, máy ảnh dùng một lần, thuê và bán máy film, và các dịch vụ liên quan.</p></div>
    </section>

    <section className="about-closing" aria-labelledby="about-closing-title"><span className="eyebrow">ĐIỀU SOORAH MUỐN LÀM</span><h2 id="about-closing-title">SOORAH không chỉ muốn làm cho film rẻ hơn; <em>SOORAH muốn làm cho việc bắt đầu chơi film trở nên dễ hơn.</em></h2><div className="about-closing-actions"><Link href="/products" className="button button-light">XEM SẢN PHẨM <ArrowUpRight size={17} aria-hidden="true" /></Link><Link href="/guide" className="button button-outline">BẮT ĐẦU CHỤP FILM <ArrowUpRight size={17} aria-hidden="true" /></Link></div></section>
  </>;
}
