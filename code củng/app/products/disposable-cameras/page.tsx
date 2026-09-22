import type { Metadata } from "next";
import Link from "next/link";
import NextDrop from "@/components/home/NextDrop";

export const metadata: Metadata = {
  title: "Máy film dùng một lần",
  description: "Máy film dùng một lần đang được SOORAH tìm hiểu cho đợt hàng tiếp theo.",
};

export default function DisposableCamerasPage() {
  return <><section className="catalog-subpage-hero disposable-page-hero"><Link href="/products" className="eyebrow">← SẢN PHẨM / MÁY FILM DÙNG MỘT LẦN</Link><h1>Không cần có máy <em>vẫn có thể bắt đầu.</em></h1><p>Mục này đang chờ đợt hàng tiếp theo. SOORAH sẽ cập nhật khi có sản phẩm được xác nhận.</p></section><NextDrop /></>;
}
