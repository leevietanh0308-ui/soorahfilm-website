# SOORAH Film Lab — thiết kế đã duyệt

## Mục tiêu

Giúp người mới đánh giá rủi ro của một cú chụp với Kodak Ultramax 400 trước khi tốn một khung film. Film Lab giải thích nguyên nhân và đưa ra tối đa ba thay đổi có thể làm ngay. Ảnh hiển thị chỉ minh họa xu hướng, không dự đoán chính xác ảnh film hoặc màu sau tráng quét.

## Phương án đã chọn

Trải nghiệm **Kiểm tra cú chụp** theo tình huống, ưu tiên đánh giá rủi ro hơn mô phỏng màu. Người dùng chọn loại máy (có lựa chọn “Tôi không biết”), bối cảnh, mức sáng, chủ thể, khoảng cách và flash. Film cố định là Ultramax 400 trong MVP. Kết quả gồm rủi ro thiếu sáng, nhòe và hiệu quả flash; phần “Vì sao?”; tối đa ba việc nên làm; ảnh minh họa có ghi nhãn; cùng thẻ ghi nhớ có thể lưu/chia sẻ.

Người dùng có thể đổi một biến và thấy kết quả cập nhật ngay. Đặc biệt, giao diện minh họa vùng flash gần và nhắc khi chủ thể nằm ngoài vùng hữu ích. Khi thiếu thông tin về máy, kết quả ghi rõ mức chắc chắn thấp hơn và tránh khẳng định về phơi sáng chính xác.

## Phương án đã cân nhắc

1. Tư vấn theo tình huống — đã chọn vì trả lời trực tiếp câu hỏi “nên làm gì trước khi bấm?”.
2. Mô phỏng ảnh là trọng tâm — trực quan hơn nhưng dễ tạo cảm giác dự đoán màu chính xác.
3. Bài học tương tác là trọng tâm — giáo dục tốt nhưng chậm hơn với người đang chuẩn bị chụp.

## Kiến trúc và dữ liệu

Thêm route `/film-lab` trong Next.js App Router. Một hàm TypeScript thuần nhận các lựa chọn và trả về các risk bands, lý do và lời khuyên. UI client chỉ quản lý trạng thái lựa chọn và trình bày kết quả. Các bối cảnh là preset có mức sáng mặc định; slider cho phép chỉnh theo thực tế. Quy tắc dùng nguyên lý về ánh sáng, khoảng cách flash và chuyển động, nhưng không gán độ chính xác giả khi thiếu khẩu độ, tốc độ và thông tin máy.

Ảnh minh họa dùng tư liệu film hiện có của SOORAH và hiệu ứng CSS nhẹ, được ghi nhãn rõ. Dữ liệu giá và sản phẩm lấy từ `data/products.ts`. Analytics dùng `lib/analytics.ts` hiện tại, không thu thập hay gửi ảnh cá nhân. Website vẫn xuất tĩnh cho GitHub Pages, không cần backend.

## Trải nghiệm và trạng thái biên

Desktop trình bày bộ chọn cạnh phần kết quả; mobile ưu tiên phần kết quả và điều khiển dễ chạm. Mọi điều khiển dùng nhãn rõ, bàn phím được, và hiệu ứng tôn trọng `prefers-reduced-motion`. Flash `AUTO` được coi là chưa chắc sẽ nổ. Máy không rõ loại sẽ không nhận khẳng định chính xác. Kết quả luôn nhắc ảnh thực tế phụ thuộc máy, film, đo sáng, tráng và quét.

Các điểm vào gồm menu, homepage CTA, trang hướng dẫn và trang sản phẩm. CTA thương mại chỉ dẫn đến Ultramax 400; khi cảnh khó, lời khuyên chụp được ưu tiên trước CTA.

## Kiểm tra

Kiểm tra các tổ hợp điển hình: trời nắng; quán tối không flash; quán tối với flash gần; sân khấu xa dù bật flash; máy không rõ; chủ thể chuyển động. Kiểm tra kết quả thay đổi khi đổi một biến, khả năng dùng trên mobile, giảm chuyển động, lint và build cả cấu hình thường lẫn GitHub Pages.
