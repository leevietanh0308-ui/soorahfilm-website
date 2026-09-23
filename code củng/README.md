# Website bán film SOORAH

Website giới thiệu thương hiệu và bán film 35mm, xây dựng bằng Next.js App Router, React, TypeScript, CSS và bộ phông chữ lưu trong dự án. Giỏ hàng được lưu trên trình duyệt. Mặc định website tạo bản nháp đơn để khách tự gửi qua Instagram; khi cấu hình Google Apps Script, biểu mẫu có thể ghi yêu cầu đặt hàng vào Google Sheets. Website chưa thu tiền.

## Khởi động trên máy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`. Để kiểm tra bản chạy thực tế, dùng `npm run build` rồi `npm run start`. Trước khi đưa lên mạng, đặt biến `NEXT_PUBLIC_SITE_URL` thành địa chỉ website chính thức để ảnh chia sẻ trên mạng xã hội có đường dẫn đúng.

## Đăng bằng GitHub Pages

Repository này có quy trình `.github/workflows/deploy-pages.yml` để tự xây dựng và đăng bản tĩnh tại `https://leevietanh0308-ui.github.io/soorahfilm-website/` sau mỗi lần đẩy lên nhánh `main`. Trong GitHub, vào **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**. Theo dõi lần chạy trong tab **Actions**; khi bước `deploy` hoàn tất, tải lại địa chỉ website.

Bản GitHub Pages giữ giỏ hàng trong trình duyệt. Để nhận yêu cầu đặt hàng trong Google Sheets, làm theo [hướng dẫn Google Sheets](docs/google-sheets-orders.md). Nếu chưa cấu hình, biểu mẫu tiếp tục tạo nội dung đơn để khách tự gửi qua Instagram.

Nếu dùng macOS và đã cài Google Chrome ở vị trí mặc định, lệnh `node scripts/verify.mjs` sẽ kiểm tra bố cục máy tính và điện thoại, menu, giỏ hàng, bản nháp đơn và các lỗi tiếp cận theo WCAG A/AA trên những trang chính. Lệnh này cần server đang chạy tại `127.0.0.1:3000`.

## Sơ đồ trang

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang tổng: mở đầu, lý do chụp film và bộ 18 ảnh film của chủ thương hiệu |
| `/products` | Chọn giữa cuộn film và máy film dùng một lần |
| `/film-lab` | Kiểm tra cú chụp với Ultramax 400: tình huống, ánh sáng, flash, khoảng cách, rủi ro và gợi ý |
| `/products/film-rolls` | Các ô cuộn film: Kodak Ultramax 400 và hai ô chờ đợt hàng tiếp theo; thông tin chọn film và chi phí |
| `/products/disposable-cameras` | Bảng chờ máy film dùng một lần và biểu mẫu tạo tin nhắn quan tâm |
| `/product/kodak-ultramax-400` | Trải nghiệm cuộn 5 cảnh với ảnh Kodak nổi, phần thông số, chọn số lượng và câu hỏi giúp chọn film |
| `/about` | Trang Về SOORAH riêng: khoảng trống, rào cản của người mới, cách bắt đầu và định hướng dài hạn |
| `/guide` | Hướng dẫn cuộn film đầu tiên, câu hỏi thường gặp và hành trình chụp film |
| `/community` | Góc chia sẻ ảnh; liên kết đến bộ ảnh film trên trang tổng |
| `/checkout` | Biểu mẫu gửi yêu cầu tới Google Sheets khi đã cấu hình; nếu chưa, tạo bản nháp để gửi qua Instagram |
| `/shipping` | Cách đặt hàng và giao hàng |
| `/terms`, `/privacy` | Điều khoản bản mẫu và cách xử lý dữ liệu |
| Đường dẫn khác | Trang báo lỗi 404 |

## Hệ thống thiết kế

- **Màu sắc:** đen than `#11110f`, giấy ngà `#eee9dd`, đỏ phòng tối `#b54635`, nâu hổ phách và be trầm.
- **Chữ:** DM Sans Variable cho nội dung và thương hiệu, Cormorant Garamond Variable cho tiêu đề kiểu tạp chí, IBM Plex Mono cho thông số film và điều khiển. Tệp phông chữ được cài kèm dự án qua Fontsource.
- **Nhịp trình bày:** ảnh mở đầu lớn, những khoảng nghỉ nền giấy, khu trưng bày sản phẩm tối, thư viện ảnh film kéo dài theo chiều dọc và lời mời bắt đầu ở cuối trang. Thư viện hiển thị ba cột trên máy tính, hai cột trên máy tính bảng và một cột trên điện thoại; ảnh giữ tỷ lệ gốc và có thể bấm để xem lớn.
- **Chuyển động:** màn mở đầu đếm khung hình, nội dung xuất hiện theo cuộn trang, ảnh phóng nhẹ, vệt sáng, hạt film, thanh tiến độ và chuyển động của menu, giỏ hàng. Trang chi tiết Kodak giữ ảnh PNG ở giữa nền và dịch chuyển qua 5 cảnh khi cuộn. Khi người dùng chọn giảm chuyển động, ảnh đứng yên và nội dung vẫn đọc được.
- **Hình ảnh:** ảnh chụp film do chủ thương hiệu cung cấp nằm trong `ảnh film`; 18 bản WebP tối ưu cho website nằm trong `public/images/film`. Ảnh Kodak Ultramax 400 do chủ thương hiệu cung cấp nằm trong `ảnh kodakultra` và bản dùng trên website nằm tại `public/images/kodak-ultramax-400.jpeg`; hình hộp trong ảnh vẫn mang tính minh hoạ. Ảnh cộng đồng chỉ được đăng khi có quyền sử dụng.
- **Ảnh đầu trang:** trang Cộng đồng dùng `frame-17.webp`; trang Hướng dẫn dùng `frame-14.webp`. Cả hai nằm trong bộ ảnh film của chủ thương hiệu và được hiển thị qua `app/community/page.tsx`, `app/guide/page.tsx`.
- **Ô chọn loại sản phẩm:** ô Cuộn film trên `/products` dùng ảnh AI minh họa cuộn film 35mm mờ tại `public/images/film-roll-category.webp`, cùng phong cách với hình máy film dùng một lần. Đây không phải ảnh của một sản phẩm Kodak cụ thể.
- **Ô Kodak trong danh mục cuộn film:** dùng ảnh `ảnh kodakultra/Kodak Ultramax 400 (1).jpeg`, bản phục vụ website ở `public/images/kodak-ultramax-400-card.jpeg`. Khi mở ô, ảnh cắt nền `ảnh kodakultra/b80574fd95a40b69e448ff5272154aa3 (1)-Photoroom.png` xuất hiện trong chuyển cảnh và xuyên suốt phần giới thiệu cuộn trang; bản website ở `public/images/kodak-ultramax-cutout.png`. Hình hộp trên ảnh minh họa ghi 24 tấm, còn sản phẩm đang bán theo thông tin cửa hàng là cuộn 36 tấm; trang sản phẩm có ghi rõ ảnh bao bì có thể khác.

## Luồng mua hàng

1. Khách tìm hiểu thương hiệu hoặc đọc hướng dẫn cuộn film đầu tiên.
2. Khách xem giá film và những khoản chưa bao gồm: vận chuyển, tráng và quét ảnh.
3. Khách thêm film vào giỏ, chỉnh số lượng và mở trang đặt hàng.
4. Biểu mẫu kiểm tra thông tin liên hệ và cách nhận hàng.
5. Khi đã cấu hình Google Apps Script, khách gửi yêu cầu và chỉ thấy trang xác nhận sau khi Apps Script ghi vào Google Sheets. Nếu chưa cấu hình, khách sao chép bản nháp rồi tự gửi đến Instagram `@lee._.vietanh`.
6. SOORAH xác nhận hàng, phí giao và cách thanh toán. Website không xử lý thanh toán.

Biểu mẫu quan tâm đợt hàng tiếp theo cũng tạo một tin nhắn để sao chép. Website chưa có danh sách chờ trên máy chủ.

## Cấu trúc mã nguồn

| Phần | Tệp |
| --- | --- |
| Nội dung và danh mục | `data/products.ts`, `data/content.ts` |
| Trang tổng và các mục chính | `app/page.tsx`, `app/products/page.tsx`, `app/guide/page.tsx`, `app/community/page.tsx` |
| Nội dung từng phần | `components/home/*` (được sử dụng ở các trang tương ứng) |
| Giỏ hàng và đặt hàng | `components/CartProvider.tsx`, `components/CheckoutForm.tsx` |
| Giao diện sản phẩm | `components/FilmRollCatalog.tsx`, `components/ProductImmersiveHero.tsx`, `components/ProductDetails.tsx`, `components/FilmPack.tsx` |
| Thành phần chung và hiệu ứng | `components/Header.tsx`, `Footer.tsx`, `PageExperience.tsx`, `PageTransition.tsx`, `FilmGrain.tsx`, `LightLeak.tsx` |
| Điểm nối phân tích hành vi | `lib/analytics.ts` |
| Film Lab | `lib/film-lab.ts` (quy tắc đánh giá), `components/film-lab/FilmLab.tsx` (giao diện), `app/film-lab/film-lab.css` (trình bày) |

Film Lab là công cụ học theo tình huống với hai lựa chọn máy film: Máy tự động (mặc định) và Máy chỉnh tay. Màn thử nghiệm chiếm một khung nhìn: điều khiển tự cuộn trong khi ảnh mẫu và kết quả luôn hiện. Ba chấm xanh, vàng, đỏ cho biết mức rủi ro chung; từng yếu tố ánh sáng, độ nét, flash nêu rõ thiếu sót. Có thể kéo trực tiếp trên ảnh hoặc dùng thanh trượt để so mẫu gốc với minh họa. Ảnh chỉ minh họa xu hướng sáng tối, không dự đoán màu hoặc chất lượng ảnh cuối. Logic đánh giá không cần backend; thẻ ghi nhớ được tạo trong trình duyệt. Có thể kiểm tra quy tắc bằng `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test lib/film-lab.test.ts`. Khi server đang chạy tại `127.0.0.1:3000`, dùng `node scripts/verify-film-lab.mjs` để kiểm tra desktop, tablet và điện thoại bằng Chrome.

Để sửa một mục lớn, mở tệp `app/<tên-trang>/page.tsx` tương ứng trong bảng trên. Nội dung Về SOORAH nằm trong `app/about/page.tsx`; thứ tự các phần trên trang tổng nằm trong `app/page.tsx`. Bộ ảnh lấy từ `data/content.ts` và hiển thị bằng `components/home/FilmGallery.tsx`. Dữ liệu sản phẩm nằm trong `data/products.ts`. Hàm `track()` chỉ phát sự kiện `soorah:analytics` trong trình duyệt; cần kết nối công cụ phân tích khi đã có mã đo lường và yêu cầu xin phép người dùng.

| Muốn sửa | Mở tệp |
| --- | --- |
| Lối vào các mục và thứ tự phần trên trang tổng | `app/page.tsx` |
| Trang Về SOORAH, nội dung và ảnh nền | `app/about/page.tsx`, `app/globals.css` (`.about-*`) |
| Phần “Vì sao là film” trên trang tổng | `components/home/StorySections.tsx` (`WhyFilm`) |
| Hai loại sản phẩm | `app/products/page.tsx` |
| Ô cuộn film, thông tin chọn film và chi phí | `app/products/film-rolls/page.tsx`, `components/FilmRollCatalog.tsx`, `components/home/StorySections.tsx` (`WhyThisFilm`), `components/home/CostCalculator.tsx` |
| Bảng chờ máy film dùng một lần | `app/products/disposable-cameras/page.tsx`, `components/home/NextDrop.tsx` |
| Trang chi tiết Kodak | `app/product/[slug]/page.tsx`, `components/ProductImmersiveHero.tsx`, `components/ProductDetails.tsx` |
| Hướng dẫn và câu hỏi thường gặp | `app/guide/page.tsx`, `components/home/CheatSheet.tsx`, `components/home/StorySections.tsx` (`HowItWorks`) |
| Bộ 18 ảnh film trên trang tổng | `components/home/FilmGallery.tsx`, `data/content.ts` |
| Góc chia sẻ ảnh cộng đồng | `app/community/page.tsx`, `components/home/Community.tsx` |

## Trước khi mở bán chính thức

- Thông tin liên hệ Instagram, Facebook, Zalo và Gmail được quản lý trong `data/content.ts`; kiểm tra lại khi tài khoản hoặc số điện thoại thay đổi.
- Kiểm tra ảnh Kodak Ultramax 400 trước khi giới thiệu hình hộp trong ảnh là bao bì sản phẩm thực tế.
- Bổ sung nguồn dữ liệu tồn kho, phí vận chuyển thực tế, hệ thống nhận đơn hoặc thanh toán và email xác nhận nếu cần đặt hàng trực tuyến.
- Thay nội dung điều khoản, quyền riêng tư và giao hàng bản mẫu bằng chính sách chính thức của SOORAH.
- Kiểm tra lại khả năng tiếp cận và Lighthouse sau khi triển khai với ảnh, tên miền và các tích hợp cuối cùng.
