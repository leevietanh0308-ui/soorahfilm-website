"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import FilmPack from "@/components/FilmPack";
import { useCart } from "@/components/CartProvider";
import { featuredProduct, formatPrice } from "@/data/products";

export default function ProductShowcase() { const { add } = useCart(); return <section className="product-showcase section-pad" id="shop"><div className="section-index"><span>01 / CUỘN FILM ĐẦU</span><span>SOORAH TUYỂN CHỌN</span></div><div className="showcase-grid"><div className="showcase-visual" data-reveal><div className="showcase-stamp">01 / 01<br />SẢN PHẨM HIỆN TẠI</div><FilmPack /><span className="visual-corner">35MM / FILM ÂM BẢN MÀU / ISO 400</span></div><div className="showcase-copy" data-reveal><span className="eyebrow">CUỘN FILM ĐẦU, THẬT ĐƠN GIẢN</span><h2>Kodak<br /><em>Ultramax</em><br />400<span className="small-period">.</span></h2><p>Cho những lần đi vòng xa hơn dự định, chút nắng cuối ngày và mọi điều ở giữa.</p><div className="product-spec-line"><span>35MM</span><span>36 TẤM ẢNH</span><span>ISO 400</span><span>HẠN 05/2028</span></div><div className="showcase-purchase"><strong>{formatPrice(featuredProduct.price)}</strong><span>/ CUỘN · CÓ HỘP · CÒN HẠN</span></div><div className="showcase-actions"><button className="button button-red" onClick={() => add(featuredProduct.id)} disabled={!featuredProduct.available}>THÊM VÀO GIỎ <Plus size={18} /></button><Link href={`/product/${featuredProduct.slug}`} className="text-link">XEM SẢN PHẨM <ArrowUpRight size={16} /></Link></div><p className="disclosure">Kodak Ultramax 400 là sản phẩm do SOORAH tuyển chọn, không do SOORAH sản xuất. Giá chưa gồm vận chuyển, tráng và quét ảnh.</p></div></div></section>; }
