# Quiz Race · TikTok LIVE

Game đố vui qua bình luận TikTok, dựng theo video tham chiếu: nền tím đậm, ô đáp án/xáo chữ, tên top 1 chạy ngang, bảng điểm trái và bảng quà phải. Ba chibi nữ mini di chuyển tự do, tung bông/cánh hoa và nhảy mừng khi người chơi trả lời đúng.

[Xem ba mẫu chibi](docs/screenshots/chibi-models.png) · [Xem câu ×2](docs/screenshots/community-double.png) · [Mở điểm đầu tiên](docs/screenshots/first-point.png) · [Mở đáp án](docs/screenshots/solution.png) · [Điều khiển](docs/screenshots/studio.png) · [Phân tích video](docs/REFERENCE.md)

## Chạy ngay

Cài **Node.js 22 LTS** (tối thiểu 20.12), mở PowerShell:

```powershell
git clone https://github.com/nepte6789/quiz-race.git
cd quiz-race
npm start
```

Lần đầu `npm start` tự cài thư viện còn thiếu, cần Internet. Windows có thể mở `start.bat`. **Chạy trong thư mục có package.json**, không chạy từ thư mục cha. Giữ terminal mở; Ctrl+C để dừng.

Mở **http://localhost:3000/** hoặc đúng địa chỉ in trong terminal. Chưa đặt PORT mà cổng bận, máy chủ tự tìm cổng tiếp theo tới 3010. Nguồn LIVE trên bảng điều khiển luôn theo cổng thực tế.

## Lên LIVE

1. Tự phát LIVE trên TikTok. Nhập `@username` hoặc link đầy đủ `https://www.tiktok.com/@username/live`, bấm **Kết nối**. Không dùng tên hiển thị/link rút gọn.
2. Chọn bộ/loại câu hỏi, thời gian và điểm. Mặc định **60 giây trả lời / nghỉ 6 giây**, đúng +1 điểm.
3. Chọn giọng nữ **Hoài My** hoặc nam **Nam Minh**; bấm **Bắt đầu** (tự lưu thiết lập).
4. Thêm nguồn Browser/Liên kết **http://localhost:3000/overlay.html** vào OBS/LIVE Studio, kích thước **1080 × 1920**.
5. Bấm **Bật âm thanh & giọng đọc** một lần trên nguồn LIVE. Preview trong bảng điều khiển luôn im lặng.

Khi chưa nối LIVE, bấm **Thử trả lời đúng** để xem thẻ thắng, lời giải xanh, giọng đọc và chibi tung bông. Tên hiển thị đúng như bạn nhập, không thêm đuôi “thử”. Dữ liệu vẫn dùng mã nội bộ riêng, không phải người xem TikTok. Không tự tạo bot hoặc người giả trong LIVE.

## Giống nhịp trong video

- Gợi ý trắng, ô đáp án trống lớn, nhóm chữ xáo trộn nhỏ giữ dấu và từng từ.
- Khi có người đúng: khóa câu, hiện thẻ viền vàng khoảng **2 giây** kèm avatar/tên, đáp án xanh, tổng điểm và hạng thật trên toàn bảng.
- Sau thẻ, mở các chữ đáp án màu xanh và thông báo kết quả; hết thời gian nghỉ mới sang câu tiếp.
- Tên người top điểm chạy trên đầu; top điểm trái/top quà phải hiển thị tối đa 10 người.
- Ba chibi nữ có tóc/trang phục riêng: hồng, tím, xanh ngọc; mắt sáng, má hồng, váy xếp ly và bông nhiều lớp. Mỗi nhân vật tự chọn đích di chuyển trong vùng từ dưới tiêu đề Top điểm đến cuối sân khấu, đổi hướng và tránh chồng lên nhau, không chạy lên câu hỏi. Khi có đáp án đúng, cả ba dừng di chuyển 4,5 giây để nhảy mừng/tung cánh hoa và hiện lời tung hô. Khi đang đi ngang bảng, nhân vật giảm độ đậm để chữ bên dưới vẫn nhìn thấy.
- Tôn trọng chế độ giảm chuyển động của hệ điều hành. Vùng trên chừa cho lớp LIVE; không giả lập nút Follow, bình luận hay đồng hồ điện thoại.

## Mục tiêu cộng đồng và chặng đua

- **Thanh tim chung:** mặc định 1.000 tim/mốc, chỉnh được 100–100.000 trong bảng điều khiển. Chỉ cộng số tim mới từ sự kiện `likeCount`, không lấy tổng lịch sử `totalLikeCount`. Chống trùng mã sự kiện. Mỗi mốc mở một câu ×2 cho **câu kế tiếp**; nhiều mốc xếp hàng, không cộng chồng thành ×4. Tim không chọn người thắng, không trực tiếp cho người thả điểm.
- **Câu đặc biệt:** đổi nền/nhãn vàng và điểm hiển thị đúng giá trị ×2. Điểm cơ bản và thời gian khóa theo câu đang chơi; sửa thiết lập áp dụng câu sau.
- **Chuỗi và danh hiệu:** người ghi điểm lần đầu được chào mừng. Đúng ba câu liên tiếp nhận “Nhanh trí”, danh hiệu giữ trong buổi; câu bỏ lỡ/không trả lời làm chuỗi về lại từ đầu ở lần đúng kế tiếp. Danh hiệu không cộng điểm ngầm.
- **Lội ngược dòng:** người đã từng ghi điểm, từ ngoài top 3 lên top 3 hoặc từ hạng sau lên hạng nhất được hiệu ứng bứt phá riêng. Người mới mở điểm dùng hiệu ứng chào mừng.
- **Chặng 10 câu:** điểm chặng tính riêng, tổng điểm buổi giữ nguyên. Bảng điểm mặc định hiển thị chặng; có hai tab Tổng/Chặng, và lựa chọn bảng mặc định trong điều khiển (áp dụng cả nguồn LIVE). Khi xong câu thứ 10, đọc kết quả câu cuối rồi vinh danh top 3 chặng bằng giọng đã chọn. Lời giải hiện trước; màn vinh danh bắt đầu sau 6,5 giây, tổng khoảng nghỉ cuối chặng tối thiểu 22 giây. Tự chuyển bật thì đếm ngược sang chặng mới, tắt thì chờ nút Câu tiếp. Có thể bấm Câu tiếp để bỏ qua phần chờ.
- **Khoảnh khắc chia sẻ:** màn trao giải có lời mời nhẹ rủ bạn bè vào so tài, một lần mỗi chặng; không đọc nhắc chia sẻ liên tục, không giả lập lượt chia sẻ hoặc hứa thưởng cho sự kiện chưa xác minh.

Đổi mục tiêu tim bắt đầu lại thanh tiến độ của mốc đang tích, giữ tổng tim và các câu ×2 đã mở. Tim và điểm thử chỉ dùng khi ngắt LIVE thật; dữ liệu thử được xóa khi chuyển sang LIVE. Khởi động lại hoặc Xóa bảng điểm bắt đầu lại cả tiến độ tim, chuỗi, danh hiệu và chặng. Bộ câu hỏi/thiết lập được giữ. Không có tính năng bình chọn chủ đề.

[Xem câu ×2](docs/screenshots/community-double.png) · [Danh hiệu](docs/screenshots/streak-title.png) · [Vinh danh top 3](docs/screenshots/segment-podium.png)

## Bộ câu hỏi

**772 câu / 41 chủ đề / 6 loại**, đã loại gợi ý trùng chính xác:

| Loại | Số câu |
| --- | ---: |
| Xếp chữ | 500 |
| Đoán đáp án | 194 |
| Trắc nghiệm | 45 |
| Emoji | 15 |
| Đố vui | 10 |
| Tính nhẩm | **8 (~1%)** |

Có địa lý Việt Nam/thế giới, đời sống, động vật, cây cối, món ăn, văn hóa Việt, tiếng Việt, văn học, lịch sử, khoa học, vũ trụ, thể thao, âm nhạc, môi trường, an toàn số… Không dùng các câu đếm số tỉnh theo đơn vị hành chính cũ.

Mỗi bộ được trộn, dùng hết mới quay vòng. Nhận tiếng Việt có/không dấu, trắc nghiệm nhận A/B/C/D hoặc nội dung đáp án. Các tên đồng nghĩa cần có trong `aliases`. LIVE thật chỉ trao cho người đúng hợp lệ đến máy chủ đầu tiên; thứ tự có thể khác thứ tự hiển thị trên điện thoại do độ trễ mạng. Chế độ mọi người đúng chỉ dành cho chạy thử.

Có nhập/xuất bộ JSON trong bảng điều khiển (tối đa 50.000 câu/5 MB). Nhập bộ thay thư viện và dừng câu đang chơi, giữ điểm buổi hiện tại. Ví dụ:

```json
[{"id":"q1","category":"Địa danh","type":"scramble","prompt":"Hồ có tháp Rùa giữa trung tâm Hà Nội?","answer":"Hồ Gươm","aliases":["Hồ Hoàn Kiếm"]}]
```

`scripts/build-bank.py` tái tạo phần kiến thức mở rộng theo cách lặp lại an toàn; không dùng script này trên bộ riêng của bạn. `data/questions.json` đã sẵn sàng, không cần Python để chạy game.

## Giọng đọc

Đọc câu hỏi một lần; trắc nghiệm đọc thêm lựa chọn. Khi thắng, ngắt câu hỏi để đọc đáp án/tên/lời chúc. Tạm dừng hoặc chuyển câu hủy âm cũ. Giọng trên máy dùng đúng Hoài My/Nam Minh nếu có, nếu không thử Microsoft Edge trực tuyến, cần Internet. Cache tách theo giọng; lỗi giọng không làm đứng trò chơi. Khoảng nghỉ chỉnh được, tên dài có thể cần tăng để đọc kịp. Trò chơi không chờ giọng hoàn tất mới chuyển câu.

## Kết nối EulerStream

Chép `.env.example` thành `.env` cạnh `package.json`:

```dotenv
PORT=3000
TIKTOK_CHANNEL=
EULERSTREAM_API_KEY=
HOST=127.0.0.1
OPEN_BROWSER=0
```

Điền `TIKTOK_CHANNEL` để tự nối khi mở; khóa EulerStream chỉ điền trên máy nếu dịch vụ ký yêu cầu, tên cũ `SIGN_API_KEY` cũng hỗ trợ. Không đưa `.env` lên GitHub, không gửi khóa vào chat. Khởi động lại sau khi sửa. UI chỉ hiện có khóa hay chưa.

Tự nối lại sau 2 phút khi mất kết nối; tôn trọng thời gian giới hạn lượt nếu dài hơn. Lỗi thiếu quyền hoặc bị chặn tạm dừng tự thử. **Ngắt** hủy lịch. Mỗi lượt có timeout 30 giây và thử nhanh thêm một lần cho lỗi mạng/mã phòng tạm thời.

Dùng **Sao chép lỗi** để đối chiếu: `OFFLINE` (phòng chưa phát/không tìm đúng), `ROOM_ID` (chưa lấy mã phòng), `RATE_LIMIT` (đợi), `SIGN_PERMISSION` (khóa/quyền endpoint, có tài khoản chưa chắc có quyền Business), `NETWORK` (mạng). Không yêu cầu cookie, mật khẩu hay mã đăng nhập TikTok. Thư viện cộng đồng phụ thuộc thay đổi của TikTok.

## Dữ liệu và vận hành

Mỗi lần khởi động máy chủ là một buổi mới: reset người chơi, top điểm, top quà và thống kê. Reload trình duyệt trong cùng buổi không reset. Giữ thiết lập và bộ riêng trong `data/runtime`; file hỏng không bị tự ghi đè. Top quà tính theo giá trị xu sự kiện, quà chuỗi cộng khi kết thúc, không phải doanh thu rút về.

Mặc định chỉ mở trên máy chạy. Nếu cần LAN: `HOST=0.0.0.0`, `ADMIN_TOKEN` ngẫu nhiên ít nhất 24 ký tự, `ALLOWED_HOSTS` chứa IP LAN; mở `http://IP:PORT/?key=MA_QUAN_TRI`. Không chia sẻ mã quản trị hoặc mở cổng Internet trực tiếp. `DATA_DIR` đổi thư mục dữ liệu.

## Kiểm tra

```sh
npm test
npm run load-test
```

Test nhận bình luận/quà giả lập, xử lý người thắng đầu tiên, thứ hạng ngoài top 10, giữ bí mật đáp án, thời gian reveal, giọng nam/nữ, khởi động/reset, WebSocket và cấu hình. Kiểm tra trình duyệt desktop, 390px, 1080×1920: thẻ thắng → đáp án xanh, chibi, âm thanh giả lập, preview im lặng, giảm chuyển động và không lỗi JavaScript.

Chưa kiểm chứng phòng TikTok LIVE thật, âm thanh Microsoft trực tuyến hoặc Windows LIVE Studio trên máy người dùng. Benchmark là sự kiện nội bộ giả lập, không bảo đảm số người xem hay băng thông TikTok.

Chibi/cánh hoa/bông cổ vũ được vẽ mới bằng SVG/canvas. Font Be Vietnam Pro đặt sẵn, giấy phép SIL OFL trong `public/fonts/OFL.txt`. MIT cho mã nguồn; thư viện có giấy phép riêng. Không đưa video tham chiếu hoặc avatar của người trong mẫu vào repo.
