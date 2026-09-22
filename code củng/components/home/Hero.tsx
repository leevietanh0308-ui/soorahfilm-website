import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import LightLeak from "@/components/LightLeak";

export default function Hero() { return <section className="hero" aria-labelledby="hero-title"><div className="hero-image"><Image src="/images/film/frame-11.webp" alt="Ảnh film: cây cầu sáng đèn bên dòng sông ban đêm" fill priority sizes="100vw" quality={82} /></div><div className="hero-vignette" /><LightLeak /><div className="hero-top-meta"><span>ANALOG LIFESTYLE<br />HANOI, VIETNAM</span><span>CUỘN SỐ 001 / 36 TẤM ẢNH</span></div><div className="hero-content"><span className="eyebrow hero-kicker">DÀNH CHỖ CHO KHOẢNH KHẮC</span><h1 id="hero-title">SOORAH<span>.</span></h1><div className="hero-under"><p>Film, made simple.</p><div className="hero-ctas"><Link href="/products" className="button button-light">SẢN PHẨM <ArrowUpRight size={17} /></Link><Link href="/guide" className="button button-outline">BẮT ĐẦU <ArrowUpRight size={17} /></Link></div></div></div><div className="hero-bottom"><span>FILM PHOTOGRAPHY / SOORAH COLLECTION</span><Link href="/about">KHÁM PHÁ SOORAH <ArrowUpRight size={15} /></Link></div></section>; }
