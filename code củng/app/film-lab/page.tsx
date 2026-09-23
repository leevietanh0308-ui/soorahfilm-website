import type { Metadata } from "next";
import FilmLab from "@/components/film-lab/FilmLab";
import "./film-lab.css";

export const metadata: Metadata = {
  title: "Film Lab — Kiểm tra cú chụp",
  description: "Chọn máy, ánh sáng và bối cảnh để hiểu rủi ro thiếu sáng, nhòe và flash trước khi chụp Kodak Ultramax 400.",
};

export default function FilmLabPage() {
  return <FilmLab />;
}
