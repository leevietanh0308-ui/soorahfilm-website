import type { Metadata } from "next";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Tạo nội dung đơn hàng", robots: { index: false, follow: false } };
export default function CheckoutPage() { return <CheckoutForm />; }
