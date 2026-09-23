import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Hero from "@/components/home/Hero";
import FilmGallery from "@/components/home/FilmGallery";
import FilmLabInvite from "@/components/home/FilmLabInvite";
import { FinalCTA, WhyFilm } from "@/components/home/StorySections";

const destinations = [
  { number: "01", title: "Sản phẩm", description: "Khám phá cuộn film SOORAH đang tuyển chọn và xem chi phí trước khi đặt.", href: "/products" },
  { number: "02", title: "Về SOORAH", description: "Hiểu câu chuyện của thương hiệu và cách chúng mình giúp người mới bắt đầu chụp film.", href: "/about" },
  { number: "03", title: "Hướng dẫn", description: "Tìm hiểu cách chọn, lắp, chụp và tráng cuộn film 35mm đầu tiên.", href: "/guide" },
  { number: "04", title: "Cộng đồng", description: "Chia sẻ câu chuyện bằng những khung hình film của bạn.", href: "/community" },
];

export default function HomePage() {
  return <><Hero /><section className="home-destinations section-pad" aria-labelledby="destinations-title"><div className="section-index"><span>KHÁM PHÁ SOORAH</span><span>CHỌN ĐIỀU BẠN MUỐN XEM</span></div><h2 id="destinations-title">Khám phá theo<br /><em>cách của bạn.</em></h2><div className="destination-grid">{destinations.map((item) => <Link className="destination-card" href={item.href} key={item.href}><span>{item.number} / SOORAH</span><div><h3>{item.title}</h3><ArrowUpRight size={27} aria-hidden="true" /></div><p>{item.description}</p></Link>)}</div></section><FilmLabInvite /><WhyFilm /><FilmGallery /><FinalCTA /></>;
}
