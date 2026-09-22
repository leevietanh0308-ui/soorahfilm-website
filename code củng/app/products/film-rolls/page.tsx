import type { Metadata } from "next";
import Link from "next/link";
import FilmRollCatalog from "@/components/FilmRollCatalog";
import CostCalculator from "@/components/home/CostCalculator";
import { WhyThisFilm } from "@/components/home/StorySections";

export const metadata: Metadata = {
  title: "Cuộn film",
  description: "Các cuộn film 35mm tại SOORAH: Kodak Ultramax 400 đang nhận đơn và những lựa chọn sắp tới.",
};

export default function FilmRollsPage() {
  return <><section className="catalog-subpage-hero film-rolls-page-hero"><Link href="/products" className="eyebrow">← SẢN PHẨM / CUỘN FILM</Link><h1>Cuộn film <em>cho từng ngày.</em></h1><p>Chọn cuộn đang có hoặc xem những ô chờ cho đợt hàng tiếp theo.</p></section><FilmRollCatalog /><WhyThisFilm /><CostCalculator /></>;
}
