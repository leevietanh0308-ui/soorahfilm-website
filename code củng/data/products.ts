export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency: "VND";
  available: boolean;
  stockLabel: string;
  format: string;
  exposures: number;
  iso: number;
  expiry: string;
  description: string;
  badges: string[];
};

// Danh mục để người quản lý dễ chỉnh sửa; thêm sản phẩm không cần đổi logic giỏ hàng.
export const products: Product[] = [
  {
    id: "ultramax-400-36",
    slug: "kodak-ultramax-400",
    name: "Kodak Ultramax 400",
    price: 275000,
    currency: "VND",
    available: true,
    stockLabel: "Đang nhận đơn",
    format: "35mm",
    exposures: 36,
    iso: 400,
    expiry: "05/2028",
    description: "Một cuộn màu linh hoạt để bắt đầu chụp những ngày bình thường theo cách khác đi.",
    badges: ["35mm", "36 tấm ảnh", "ISO 400", "Còn hạn"],
  },
];

export const featuredProduct = products[0];
export const formatPrice = (amount: number) => `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;
