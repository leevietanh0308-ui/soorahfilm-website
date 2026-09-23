import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductDetails from "@/components/ProductDetails";
import ProductImmersiveHero from "@/components/ProductImmersiveHero";
import { featuredProduct, formatPrice } from "@/data/products";

export function generateStaticParams() {
  return [{ slug: featuredProduct.slug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== featuredProduct.slug) return {};
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const socialImage = new URL(`${basePath}/images/film/frame-11.webp`, siteUrl).toString();
  return { title: `${featuredProduct.name} — ${formatPrice(featuredProduct.price)}`, description: `${featuredProduct.name}: film màu 35mm, 36 tấm ảnh, ISO 400, còn hạn đến ${featuredProduct.expiry}. Giá ${formatPrice(featuredProduct.price)}.`, openGraph: { images: [socialImage] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== featuredProduct.slug) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Product", name: featuredProduct.name, description: featuredProduct.description, brand: { "@type": "Brand", name: "Kodak" }, category: "Film âm bản màu 35mm", offers: { "@type": "Offer", price: featuredProduct.price, priceCurrency: "VND", availability: featuredProduct.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><ProductImmersiveHero /><ProductDetails /><section className="product-lab-invite section-pad"><span className="eyebrow">CHƯA CHẮC CUỘN NÀY HỢP CẢNH BẠN CHỤP?</span><h2>Thử một cú chụp<br /><em>trước khi mua.</em></h2><p>Film Lab giúp bạn đánh giá ánh sáng, chuyển động và flash với Ultramax 400. Kết quả là gợi ý để học, không phải cam kết ảnh cuối.</p><Link href="/film-lab" className="button button-red">VÀO FILM LAB <ArrowUpRight size={17} /></Link></section></>;
}
