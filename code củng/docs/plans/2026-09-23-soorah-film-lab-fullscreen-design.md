# SOORAH Film Lab — màn thử nghiệm toàn khung

## Mục tiêu đã duyệt

Người dùng đổi lựa chọn và nhìn ngay ảnh mẫu, đánh giá cùng điểm cần sửa mà không phải cuộn trang lên xuống. Màn thử nghiệm chiếm trọn chiều cao khung trình duyệt ngay trong `/film-lab`; các phần hướng dẫn và lưu thẻ vẫn nằm bên dưới.

## Bố cục

Desktop: vùng điều khiển ở trái tự cuộn; ảnh mẫu, kết quả ba màu và rủi ro theo từng yếu tố ở phải luôn nhìn thấy. Điện thoại: ảnh và kết quả ở trên; vùng điều khiển tự cuộn ở dưới. Header của màn thử nghiệm gọn để dành diện tích cho ảnh. Các nút đổi nhanh một biến nằm trong vùng điều khiển.

Ảnh mẫu có thanh kéo so sánh ảnh gốc và ảnh minh họa xu hướng sáng/tối, tương phản, độ bão hòa. Không ghi nhãn đây là màu film được dự đoán chính xác. Việc so sánh dùng cùng một ảnh đã có của SOORAH.

## Đánh giá ba chấm

Ba chấm xanh, vàng, đỏ là ba mức **rủi ro thấp, vừa, cao**; chỉ một chấm sáng cho đánh giá chung. Ba dòng ánh sáng, nhòe và flash dùng chấm màu cùng ngôn ngữ và mô tả thiếu sót cụ thể. Flash đang tắt có trạng thái trung tính, không được tính như flash hoạt động tốt. Đánh giá chung lấy mức rủi ro cao nhất trong các yếu tố liên quan; không dùng phần trăm hoặc độ chính xác giả.

## Kiến trúc và trạng thái biên

Hàm đánh giá thuần trong `lib/film-lab.ts` tiếp tục quyết định rủi ro; một hàm thuần mới xây ba tín hiệu hiển thị và rủi ro chung. Component chỉ giữ state lựa chọn và vị trí thanh so sánh. Máy không rõ loại và flash AUTO vẫn được ghi rõ là mức chắc chắn giới hạn. Ở màn hình thấp, ảnh co lại; danh sách điều khiển cuộn bên trong. Nội dung vẫn dùng được bằng bàn phím và `prefers-reduced-motion`.

## Kiểm tra

Kiểm tra thay đổi điều khiển không làm ảnh/kết quả rời khỏi khung nhìn ở desktop, tablet, mobile và màn hình thấp; ba màu chuyển đúng với nắng, quán tối, flash xa và flash tắt; thanh so sánh dùng được bằng bàn phím; WCAG A/AA, lint, build thường và GitHub Pages đều đạt. Sau khi kiểm tra, push `main` và xác nhận workflow Pages cùng URL `/film-lab/`.
