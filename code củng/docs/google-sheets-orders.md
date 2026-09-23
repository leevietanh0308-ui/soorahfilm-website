# Nhận yêu cầu đặt hàng trong Google Sheets

Website SOORAH trên GitHub Pages không có máy chủ riêng. Cách này dùng Google Apps Script để nhận biểu mẫu, kiểm tra dữ liệu và ghi vào một Google Sheet riêng tư. Khách được chuyển tới trang xác nhận của Apps Script sau khi gửi.

## 1. Tạo Google Sheet

Tạo một bảng tính mới tên **Đơn hàng SOORAH** trong Google Sheets. Giữ quyền truy cập ở chế độ riêng tư. Sao chép ID nằm giữa `/d/` và `/edit` trong URL bảng tính.

## 2. Tạo Apps Script

Trong bảng tính, mở **Extensions → Apps Script**. Xoá mã mẫu và dán toàn bộ nội dung tệp [`integrations/google-sheets/Code.gs`](../integrations/google-sheets/Code.gs). Thay `PASTE_GOOGLE_SHEET_ID_HERE` bằng ID ở bước 1. Lưu lại.

Mã này tự tạo tab **Đơn hàng** và các cột khi nhận yêu cầu đầu tiên. Cột **Trạng thái** ban đầu là **Mới**; bạn có thể đổi thành **Đã liên hệ**, **Đã xác nhận**, v.v. Trường giá được tính lại trong Apps Script thay vì tin vào tổng tiền gửi từ trình duyệt. Khi đổi giá sản phẩm trên website, cập nhật giá trong `PRODUCTS` của Apps Script rồi triển khai phiên bản mới.

## 3. Xuất bản Web App

Trong Apps Script, chọn **Deploy → New deployment → Web app**. Chọn **Execute as: Me** và **Who has access: Anyone** để khách không cần đăng nhập Google. Cấp quyền cho script truy cập bảng tính khi Google yêu cầu. Sao chép URL Web App kết thúc bằng `/exec`; URL `/dev` chỉ dùng để thử khi đang chỉnh sửa. [Hướng dẫn Web App của Google](https://developers.google.com/apps-script/guides/web).

## 4. Kết nối website

URL Web App `/exec` hiện được cấu hình trong `.github/workflows/deploy-pages.yml` dưới tên `NEXT_PUBLIC_ORDER_WEB_APP_URL`. Khi đẩy mã lên nhánh `main`, GitHub Actions sẽ xây dựng lại website với URL này. Nếu tạo một triển khai Apps Script mới có URL khác, cập nhật giá trị đó trong workflow rồi đẩy mã lên GitHub. URL này là địa chỉ nhận biểu mẫu công khai, không phải mật khẩu; tuyệt đối không thêm quyền chỉnh sửa Google Sheet cho khách.

## 5. Kiểm tra

Trên website, thêm một cuộn film vào giỏ, mở trang đặt hàng và điền một yêu cầu thử bằng thông tin của bạn. Sau khi bấm **Gửi yêu cầu đặt hàng**, trang xác nhận phải hiển thị mã đơn `SOO-...`. Mở Google Sheet và kiểm tra một dòng mới trong tab **Đơn hàng**. Nếu khách thấy thông báo chưa thể gửi, vào Apps Script → **Executions** để xem lỗi và kiểm tra ID bảng tính, quyền truy cập cùng URL `/exec`.

Apps Script nhận yêu cầu qua biểu mẫu POST thông thường vì trình duyệt không thể đọc phản hồi Web App bằng `fetch` từ GitHub Pages một cách đáng tin cậy. Do đó trang xác nhận được Google phục vụ và có nút quay về SOORAH. Web App công khai có thể nhận yêu cầu ngoài website; mã kiểm tra trường dữ liệu, loại sản phẩm và mã đơn trùng, nhưng bạn vẫn nên rà soát đơn lạ trước khi liên hệ. Đơn được ghi nhận là **yêu cầu đặt hàng**, chưa phải đơn đã xác nhận hay đã thanh toán.
