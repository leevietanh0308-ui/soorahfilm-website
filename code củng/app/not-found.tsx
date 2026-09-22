import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function NotFound() { return <div className="not-found"><span className="eyebrow">LỖI / 404 / LẠC KHUNG HÌNH</span><h1>Khung hình này<br /><em>không hiện ra.</em></h1><p>Trang bạn tìm không nằm trên cuộn này.</p><Link className="button button-light" href="/">VỀ TRANG CHỦ SOORAH <ArrowUpRight size={17} /></Link><span className="not-found-frame">[ 404 ]</span></div>; }
