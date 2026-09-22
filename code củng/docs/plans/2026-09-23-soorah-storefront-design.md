# Thiết kế website bán film SOORAH

## Mục tiêu

Giới thiệu SOORAH như một thương hiệu phong cách sống analog tại Hà Nội, đồng thời giúp người mới chơi film đi từ tò mò đến bản nháp đơn hàng rõ ràng. Sản phẩm đầu tiên là Kodak Ultramax 400, giá 275.000đ/cuộn; phí vận chuyển, tráng và quét ảnh được ghi riêng.

## Phương án đã chọn

Xây dựng website bán hàng kiểu tạp chí với giỏ hàng tại trình duyệt và nội dung đơn có thể sao chép. Khách có thể tìm hiểu và chuẩn bị đơn mà không bị hiểu nhầm rằng website đã có hệ thống thanh toán hoặc nhận đơn tự động. Sau này có thể thay bước gửi tin nhắn bằng hệ thống bán hàng thực mà vẫn giữ dữ liệu sản phẩm và giao diện.

## Các phương án đã cân nhắc

1. **Website thiết kế riêng — đã chọn.** Kiểm soát tốt nhất câu chuyện thương hiệu và chuyển động; cần tích hợp hệ thống nhận đơn về sau.
2. **Giao diện Shopify có sẵn.** Đưa chức năng bán hàng vào vận hành nhanh hơn; khó thể hiện nhịp kể chuyện và hình ảnh theo yêu cầu.
3. **Trang giới thiệu tĩnh.** Làm nhanh nhất nhưng thiếu giỏ hàng và luồng sản phẩm.

## Kiến trúc và luồng dữ liệu

Next.js App Router tạo các trang hỗ trợ tìm kiếm. Dữ liệu sản phẩm và nội dung nằm trong thư mục `data/`. Các thành phần chạy trên trình duyệt quản lý tương tác. Giỏ hàng chỉ lưu mã sản phẩm và số lượng trong `localStorage`. Trang đặt hàng tạo nội dung nháp trong bộ nhớ rồi hướng dẫn khách gửi qua kênh SOORAH đã xác minh. Website không lưu thông tin liên hệ của khách.

## Nguyên tắc hình ảnh và tương tác

Website xen kẽ cảnh ảnh đậm với khoảng trống màu giấy. Tương phản kiểu chữ và thông số film tạo cảm giác tạp chí ảnh. Chuyển động ưu tiên thay đổi vị trí và độ mờ, tắt khi người dùng chọn giảm chuyển động và giản lược trên điện thoại. Mọi ảnh được tạo cho bản mẫu đều có nhãn minh hoạ.

## Trạng thái trống và lỗi

Giỏ hàng có trạng thái trống, chỉnh số lượng và xử lý sản phẩm ngừng bán. Biểu mẫu kiểm tra trường bắt buộc và không tạo đơn khi giỏ trống. Nếu sao chép tự động thất bại, khách vẫn có thể chọn nội dung để sao chép. Đường dẫn sản phẩm không hợp lệ mở trang 404. Không có trạng thái nào tuyên bố SOORAH đã nhận đơn khi khách mới tạo bản nháp.

## Kiểm tra

Chạy bản build để triển khai và lệnh kiểm tra mã nguồn, sau đó thử các trang, giỏ hàng và luồng đặt hàng trong trình duyệt. Đo Lighthouse lại sau khi triển khai với tài sản hình ảnh cuối cùng và tên miền chính thức.
