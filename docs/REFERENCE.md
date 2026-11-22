# Phân tích mẫu và bản dựng

Video được cung cấp dài khoảng 107,7 giây, 576 × 1280. Đã xem toàn đoạn qua các mốc 10 giây và xem từng giây đoạn 12–19 để xác định chuyển cảnh.

## Bố cục quan sát

- Giao diện điện thoại và TikTok chiếm vùng trên/dưới; đó là lớp TikTok, không phải phần game cần giả lập. Bản dựng có vùng trống trên 230 px trong sân khấu 1080 × 1920 để chừa chỗ cho lớp LIVE. Vị trí lớp TikTok thực tế tùy thiết bị.
- Nền tím than, đầu màn chơi có tên người dẫn điểm màu vàng chạy ngang; cạnh tên là số câu, nhãn hồng “Đúng +1 điểm” và đồng hồ vòng vàng.
- Phần gợi ý nằm giữa, chữ trắng đậm. Ô đáp án lớn màu tím, tách theo từ. Bên dưới là nhãn chữ xáo trộn và các ô chữ nhỏ; có hướng dẫn bình luận và số chữ cái.
- Dải thông báo ngăn câu hỏi và hai bảng. Top điểm bên trái, Top quà bên phải, mười dòng có avatar/tên/điểm, ba thứ hạng đầu có huy hiệu vàng/bạc/đồng.
- Khi thắng, một thẻ tím viền vàng thay vùng hỏi: avatar, tên, đáp án xanh, điểm cộng/tổng điểm/hạng trong viên thuốc hồng. Pháo giấy rơi.

## Nhịp chuyển cảnh

- Khoảng 12–13 giây: thẻ người thắng xuất hiện cho câu có đáp án Hồ Gươm.
- Khoảng 14–15 giây: thẻ biến mất, các ô lớn mở thành chữ xanh; thông báo cập nhật tên/điểm.
- Khoảng 16 giây: mở câu mới, đồng hồ về 60; đáp án lại được ẩn hoàn toàn.
- Khoảng 25 giây: thấy rõ thẻ người thắng của câu Mặt Trời với tổng điểm và hạng khác top 10. Vì vậy thứ hạng được tính trên tất cả người có điểm, không dùng vị trí trong mười dòng đang hiển thị.

Bản dựng dùng 60 giây/câu, nghỉ 6 giây mặc định; hai giá trị chỉnh được. Thẻ thắng hiện 2 giây tính từ dấu thời gian máy chủ, sau đó hiện lời giải cho đến câu kế. Nếu đặt thời gian nghỉ dưới 2 giây, câu mới sẽ thay thẻ ngay theo thiết lập.

## Phần bổ sung theo yêu cầu

Chibi nữ tự vẽ bằng SVG: tóc hai bên, váy tím/hồng, hai bông cổ vũ. Nhân vật chạy theo quỹ đạo vòng ở vùng thấp, không chạy qua ô hỏi hoặc che các dòng điểm. Khi có sự kiện đúng, dừng quỹ đạo 4,5 giây, tung bông và cánh hoa, nhảy mừng và hiện tên người thắng. Nhận snapshot thông thường không tạo lại hiệu ứng. Reduce motion giữ thông báo và tắt chuyển động.

Không sao chép khung chat, nút Follow, đồng hồ điện thoại, tên hay avatar người trong video thành dữ liệu giả của ứng dụng. Mẫu trong ảnh kiểm tra của repo là người chơi thử, có hậu tố “thử”.

## Giới hạn độ giống

Đã bám bố cục, màu chủ đạo, tỷ lệ chữ/ô, hai bảng và nhịp hỏi–thẻ thắng–mở lời giải. Hình chibi là phần vẽ mới; font dùng Be Vietnam Pro đặt sẵn và có đủ dấu. Giao diện TikTok thật, nội dung câu và độ trễ sự kiện phụ thuộc phiên LIVE; không thể bảo đảm khớp từng pixel trên mọi thiết bị.
