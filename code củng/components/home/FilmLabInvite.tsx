import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FilmLabInvite() {
  return <section className="home-lab section-pad" aria-labelledby="home-lab-title"><div className="section-index"><span>SOORAH / FILM LAB</span><span>MỘT CÔNG CỤ CHO CUỘN FILM ĐẦU</span></div><div className="home-lab-grid"><div className="home-lab-copy"><span className="eyebrow">TRƯỚC KHI BẤM MÁY</span><h2 id="home-lab-title">Film không nên<br /><em>là một canh bạc.</em></h2><p>Không thể biết trước ảnh sẽ ra chính xác thế nào. Nhưng bạn có thể biết khi nào ánh sáng thiếu, flash quá xa hoặc chủ thể dễ nhòe.</p><Link href="/film-lab" className="button button-red">VÀO FILM LAB <ArrowUpRight size={17} /></Link><span className="home-lab-micro">CHỌN TÌNH HUỐNG · HIỂU RỦI RO · CHỤP TỰ TIN HƠN</span></div><div className="home-lab-visual"><Image src="/images/film/frame-17.webp" alt="Ảnh film của SOORAH dùng minh họa sự khác biệt về độ sáng" fill sizes="(max-width: 850px) 100vw, 50vw" quality={80} /><div className="home-lab-dark" /><span className="home-lab-visual-label left">CÓ ÁNH SÁNG</span><span className="home-lab-visual-label right">THIẾU SÁNG</span><span className="home-lab-visual-center">↔</span><small>ẢNH MINH HỌA / KHÔNG DỰ ĐOÁN ẢNH THẬT</small></div></div></section>;
}
