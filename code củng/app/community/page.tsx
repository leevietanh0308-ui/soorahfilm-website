import type { Metadata } from "next";
import Image from "next/image";
import Community from "@/components/home/Community";

export const metadata: Metadata = {
  title: "Cộng đồng",
  description: "Góc chia sẻ ảnh film dành cho cộng đồng SOORAH.",
};

export default function CommunityPage() {
  return <><section className="section-page-hero community-page-hero"><div className="editorial-hero-photo" aria-hidden="true"><Image src="/images/film/frame-17.webp" alt="" fill priority sizes="100vw" quality={82} /></div><div className="editorial-hero-shade" aria-hidden="true" /><span className="eyebrow">SOORAH / CỘNG ĐỒNG</span><h1>Những khung hình <em>của chúng ta.</em></h1><p>Mỗi cuộn film là một câu chuyện. Chia sẻ khung hình bạn muốn giữ lại; bộ ảnh film của SOORAH nằm trên trang tổng.</p></section><Community /></>;
}
