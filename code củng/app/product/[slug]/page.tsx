import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetails from "@/components/ProductDetails";
import ProductImmersiveHero from "@/components/ProductImmersiveHero";
import { featuredProduct, formatPrice } from "@/data/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== featuredProduct.slug) return {};
  return { title: `${featuredProduct.name} — ${formatPrice(featuredProduct.price)}`, description: `${featuredProduct.name}: film màu 35mm, 36 tấm ảnh, ISO 400, còn hạn đến ${featuredProduct.expiry}. Giá ${formatPrice(featuredProduct.price)}.`, openGraph: { images: ["/images/film/frame-11.webp"] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== featuredProduct.slug) notFound();
  const schema = { "@context": "https://schema.org", "@type": "Product", name: featuredProduct.name, description: featuredProduct.description, brand: { "@type": "Brand", name: "Kodak" }, category: "Film âm bản màu 35mm", offers: { "@type": "Offer", price: featuredProduct.price, priceCurrency: "VND", availability: featuredProduct.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><ProductImmersiveHero /><ProductDetails /></>;
}
