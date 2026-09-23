import type { Metadata } from "next";
import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource-variable/dm-sans/wght-italic.css";
import "@fontsource-variable/cormorant-garamond/wght.css";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmGrain from "@/components/FilmGrain";
import PageExperience from "@/components/PageExperience";
import PageTransition from "@/components/PageTransition";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const socialImage = new URL(`${basePath}/images/film/frame-11.webp`, siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "SOORAH — Film analog và phong cách sống", template: "%s — SOORAH" },
  description: "Film analog cho thế hệ mới. Film được tuyển chọn, hướng dẫn dễ hiểu và cách bắt đầu chụp 35mm gần gũi hơn.",
  openGraph: { title: "SOORAH — Film analog và phong cách sống", description: "Film, made simple.", type: "website", images: [socialImage] },
  twitter: { card: "summary_large_image", title: "SOORAH — Film analog và phong cách sống", images: [socialImage] },
  icons: { icon: `${basePath}/favicon.png` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body><CartProvider><PageExperience /><Header /><main id="main-content"><PageTransition>{children}</PageTransition></main><Footer /><FilmGrain /></CartProvider></body></html>;
}
