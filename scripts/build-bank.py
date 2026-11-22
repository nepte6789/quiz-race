"""Build the curated launch bank from the checked-in base plus verified knowledge prompts."""
import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
bank=[q for q in json.loads((root/'data/questions.json').read_text()) if not q['id'].startswith(('knowledge-','mix-choice-'))]
# Keep just eight easy arithmetic prompts; other subjects dominate the rotation.
maths=[q for q in bank if q['type']=='math'][:8]
bank=[q for q in bank if q['type']!='math']+maths
facts='''Địa lý Việt Nam|Vịnh biển nổi tiếng với nhiều đảo đá vôi, di sản thế giới ở Quảng Ninh|Vịnh Hạ Long
Địa lý Việt Nam|Đỉnh núi cao nhất Việt Nam|Fansipan
Địa lý Việt Nam|Dòng sông chảy qua trung tâm thành phố Huế|Sông Hương
Địa lý Việt Nam|Thành phố được mệnh danh là thành phố ngàn hoa|Đà Lạt
Địa lý Việt Nam|Chợ nổi nổi tiếng mang tên một quận cũ ở Cần Thơ|Cái Răng
Địa lý Việt Nam|Hội An nổi tiếng với những chiếc đèn nhiều màu gọi là gì|Đèn lồng
Địa lý Việt Nam|Hang động khổng lồ mang tên có nghĩa là sông và núi ở Quảng Bình|Sơn Đoòng
Địa lý Việt Nam|Hồ nước ngọt tự nhiên nổi tiếng ở Bắc Kạn, tên có nghĩa ba hồ|Ba Bể
Địa lý Việt Nam|Cao nguyên đá nổi tiếng nằm ở Đồng Văn|Cao nguyên đá Đồng Văn
Địa lý Việt Nam|Con đèo nổi tiếng nối vùng Huế với Đà Nẵng|Hải Vân
Thế giới quanh ta|Đất nước có núi Phú Sĩ|Nhật Bản
Thế giới quanh ta|Đất nước nổi tiếng với tháp Eiffel|Pháp
Thế giới quanh ta|Đất nước có những kim tự tháp Giza|Ai Cập
Thế giới quanh ta|Đất nước có thành phố Sydney|Úc
Thế giới quanh ta|Châu lục có sa mạc Sahara|Châu Phi
Thế giới quanh ta|Đại dương lớn nhất thế giới|Thái Bình Dương
Thế giới quanh ta|Lục địa lạnh nhất trên Trái Đất|Nam Cực
Thế giới quanh ta|Thủ đô của Việt Nam|Hà Nội
Thế giới quanh ta|Thủ đô của Lào|Viêng Chăn
Thế giới quanh ta|Thủ đô của Campuchia|Phnôm Pênh
Khoa học vui|Chất khí cây xanh hấp thụ trong quá trình quang hợp|Cacbon đioxit
Khoa học vui|Chất khí cần thiết cho sự hô hấp của con người|Oxy
Khoa học vui|Nước chuyển từ lỏng sang hơi gọi là sự gì|Bay hơi
Khoa học vui|Nước chuyển từ lỏng thành đá gọi là sự gì|Đông đặc
Khoa học vui|Dụng cụ dùng để đo nhiệt độ|Nhiệt kế
Khoa học vui|Lực hút của Trái Đất tác dụng lên vật gọi là gì|Trọng lực
Khoa học vui|Hiện tượng ánh sáng đổi hướng khi truyền qua hai môi trường|Khúc xạ
Khoa học vui|Thiết bị giúp quan sát những vật rất nhỏ|Kính hiển vi
Khoa học vui|Năng lượng lấy từ ánh sáng Mặt Trời gọi là năng lượng gì|Mặt trời
Khoa học vui|Kim loại thường dùng làm lõi dây điện, màu đỏ nâu|Đồng
Vũ trụ|Hành tinh được gọi là hành tinh đỏ|Sao Hỏa
Vũ trụ|Vệ tinh tự nhiên của Trái Đất|Mặt Trăng
Vũ trụ|Hành tinh nổi tiếng với các vành đai lớn|Sao Thổ
Vũ trụ|Ngôi sao ở trung tâm Hệ Mặt Trời|Mặt Trời
Vũ trụ|Thiết bị dùng để quan sát các thiên thể ở xa|Kính thiên văn
Vũ trụ|Hành tinh lớn nhất Hệ Mặt Trời|Sao Mộc
Vũ trụ|Hành tinh gần Mặt Trời nhất|Sao Thủy
Vũ trụ|Dải ngân hà mà Hệ Mặt Trời thuộc về gọi là gì trong tiếng Việt|Ngân Hà
Vũ trụ|Hiện tượng Mặt Trăng che khuất Mặt Trời|Nhật thực
Vũ trụ|Hiện tượng Trái Đất che ánh sáng Mặt Trời chiếu tới Mặt Trăng|Nguyệt thực
Động vật kỳ thú|Loài thú có túi nổi tiếng ở Australia, thường nhảy bằng hai chân sau|Kangaroo
Động vật kỳ thú|Loài chim lớn không biết bay, chạy nhanh ở châu Phi|Đà điểu
Động vật kỳ thú|Loài vật có vòi dài và ngà|Voi
Động vật kỳ thú|Loài vật mang chiếc mai cứng trên lưng|Rùa
Động vật kỳ thú|Loài côn trùng làm ra mật|Ong
Động vật kỳ thú|Loài chim thường được dùng làm biểu tượng hòa bình|Bồ câu
Động vật kỳ thú|Loài thú có cổ rất dài|Hươu cao cổ
Động vật kỳ thú|Loài thú lớn sống ở biển, phun khí qua lỗ thở trên đầu|Cá voi
Động vật kỳ thú|Loài vật đổi màu da nổi tiếng và có đuôi cuộn|Tắc kè hoa
Động vật kỳ thú|Loài chim có chiếc đuôi xòe nhiều mắt màu sắc|Chim công
Thực vật|Bộ phận của cây thường hút nước và muối khoáng từ đất|Rễ
Thực vật|Bộ phận của cây thường thực hiện quang hợp chủ yếu|Lá
Thực vật|Loại cây có thân chia đốt, thường mọc thành bụi ở làng quê|Tre
Thực vật|Loại cây ra bông trắng được dùng kéo sợi dệt vải|Bông
Thực vật|Loài hoa có tên mang nghĩa hướng về Mặt Trời|Hướng dương
Thực vật|Loại quả bên ngoài có gai, bên trong múi vàng, mùi rất đặc trưng|Sầu riêng
Thực vật|Loại quả đỏ mọc thành chùm nhỏ, thường có vị chua, làm siro mùa hè|Dâu tằm
Thực vật|Loại củ màu cam, thường được nhắc là thức ăn của thỏ|Cà rốt
Thực vật|Loại rau thường dùng gói thịt nướng, tên cũng là một loại lá|Lá lốt
Thực vật|Cây có quả chứa nước và cơm trắng, thường trồng ven biển|Dừa
Văn hóa Việt|Trang phục truyền thống Việt Nam có hai tà dài|Áo dài
Văn hóa Việt|Loại nón truyền thống có hình chóp|Nón lá
Văn hóa Việt|Ngày Tết thiếu nhi theo âm lịch, có rước đèn và phá cỗ|Trung thu
Văn hóa Việt|Loại tranh dân gian nổi tiếng gắn với làng ở Bắc Ninh|Đông Hồ
Văn hóa Việt|Nghệ thuật diễn rối trên mặt nước|Múa rối nước
Văn hóa Việt|Loại bánh vuông thường có trong Tết cổ truyền miền Bắc|Bánh chưng
Văn hóa Việt|Loại bánh dài hình trụ thường có trong Tết miền Nam|Bánh tét
Văn hóa Việt|Lạc Long Quân trong truyền thuyết thuộc dòng giống con gì|Rồng
Văn hóa Việt|Người anh hùng làng Phù Đổng cưỡi ngựa sắt|Thánh Gióng
Văn hóa Việt|Vị vua gắn với truyền thuyết trả gươm ở hồ Hoàn Kiếm|Lê Lợi
Tiếng Việt|Từ trái nghĩa với nóng|Lạnh
Tiếng Việt|Từ trái nghĩa với cao|Thấp
Tiếng Việt|Từ trái nghĩa với rộng|Hẹp
Tiếng Việt|Từ trái nghĩa với nhanh|Chậm
Tiếng Việt|Dấu câu thường đặt cuối câu hỏi|Dấu chấm hỏi
Tiếng Việt|Dấu câu gồm ba dấu chấm liên tiếp|Dấu chấm lửng
Tiếng Việt|Điền từ: Có công mài sắt, có ngày nên ...|Kim
Tiếng Việt|Điền từ: Uống nước nhớ ...|Nguồn
Tiếng Việt|Điền từ: Ăn quả nhớ kẻ ... cây|Trồng
Tiếng Việt|Điền từ: Lá lành đùm lá ...|Rách
Thể thao vui|Môn thể thao dùng vợt và quả cầu có lông|Cầu lông
Thể thao vui|Môn thể thao dùng găng tay trên võ đài, còn gọi là boxing|Quyền anh
Thể thao vui|Môn thể thao ném bóng vào rổ treo cao|Bóng rổ
Thể thao vui|Môn thể thao dùng bàn, vợt nhỏ và bóng nhựa nhẹ|Bóng bàn
Thể thao vui|Môn thể thao di chuyển trong nước bằng các động tác tay chân|Bơi lội
Thể thao vui|Môn thể thao dùng kiếm, mặt nạ và áo bảo hộ|Đấu kiếm
Thể thao vui|Môn thể thao có quân vua, hậu, xe, tượng, mã, tốt|Cờ vua
Thể thao vui|Môn võ Nhật Bản nổi tiếng với các đòn vật, nghĩa là nhu đạo|Judo
Thể thao vui|Giải đấu bóng đá lớn nhất thế giới dành cho các đội tuyển quốc gia|World Cup
Thể thao vui|Vật được trao cho người chiến thắng, thường có dạng chiếc cốc|Cúp
Âm nhạc|Nhạc cụ có phím đen trắng, còn gọi là dương cầm|Piano
Âm nhạc|Nhạc cụ truyền thống chỉ có một dây|Đàn bầu
Âm nhạc|Nhạc cụ bằng tre được thổi để phát âm|Sáo
Âm nhạc|Bộ phận của bài hát thường được lặp lại nhiều lần|Điệp khúc
Âm nhạc|Người chỉ huy dàn nhạc gọi là gì|Nhạc trưởng
Âm nhạc|Nhạc cụ có sáu dây, thường dùng đệm hát|Guitar
Âm nhạc|Người hát một bài hát trước khán giả gọi là gì|Ca sĩ
Âm nhạc|Nhạc cụ có mặt căng bằng da, dùng dùi gõ|Trống
Âm nhạc|Tên nốt nhạc đứng ngay sau Đô trong dãy bảy nốt|Rê
Âm nhạc|Tên nốt nhạc đứng ngay trước Si trong dãy bảy nốt|La
An toàn số|Chuỗi ký tự bí mật dùng để đăng nhập tài khoản|Mật khẩu
An toàn số|Mã xác thực dùng một lần thường được gửi khi đăng nhập|OTP
An toàn số|Khi nhận tin nhắn lạ xin mã OTP, nên giữ mã hay gửi mã|Giữ mã
An toàn số|Bản sao dữ liệu để có thể khôi phục khi bị mất gọi là gì|Sao lưu
An toàn số|Phần mềm dùng để truy cập các trang web|Trình duyệt
An toàn số|Thiết bị nhập ký tự vào máy tính bằng các phím|Bàn phím
An toàn số|Thiết bị điều khiển con trỏ máy tính bằng tay|Chuột
An toàn số|Thư gửi qua mạng Internet, còn gọi là email|Thư điện tử
An toàn số|Hành động thoát khỏi phiên tài khoản sau khi dùng máy công cộng|Đăng xuất
An toàn số|Hình thức xác minh cần thêm một bước ngoài mật khẩu|Xác thực hai bước'''
for i,line in enumerate(facts.splitlines(),1):
 category,prompt,answer=line.split('|')
 aliases={'Oxy':['oxi','oxygen'],'Cacbon đioxit':['CO2','carbon dioxide'],'Kangaroo':['chuột túi'],'Fansipan':['Phan Xi Păng','phanxipang'],'Viêng Chăn':['Vientiane'],'Phnôm Pênh':['Phnom Penh'],'Nhật thực':['nhat thuc'],'Cúp':['cup'],'Piano':['đàn piano','dương cầm'],'Guitar':['đàn guitar','ghi ta'],'Sáo':['sáo trúc']}.get(answer,[])
 bank.append(dict(id=f'knowledge-{i:03}',category=category,type='text',prompt=prompt+'?',answer=answer,aliases=aliases))
# Multiple choice uses curated, unambiguous facts with alternatives from the same domain.
choices=[('Cơ thể người','Bộ phận nào bơm máu đi khắp cơ thể?','Tim',['Phổi','Tim','Dạ dày','Thận']),('Cơ thể người','Bộ phận nào chủ yếu giúp trao đổi khí?','Phổi',['Tim','Não','Phổi','Gan']),('Cơ thể người','Giác quan nào dùng để nghe?','Thính giác',['Vị giác','Khứu giác','Xúc giác','Thính giác']),('Cơ thể người','Bộ phận nào giúp ta nhìn?','Mắt',['Tai','Mắt','Mũi','Lưỡi']),('Cơ thể người','Bộ phận nào điều khiển hoạt động của hệ thần kinh?','Não',['Não','Dạ dày','Phổi','Da']),('Môi trường','Đâu là nguồn năng lượng tái tạo?','Gió',['Than đá','Dầu mỏ','Gió','Khí tự nhiên']),('Môi trường','Việc nào giúp tiết kiệm điện?','Tắt đèn khi ra khỏi phòng',['Bật đèn cả ngày','Tắt đèn khi ra khỏi phòng','Mở tủ lạnh liên tục','Bật quạt khi không có ai']),('Môi trường','Vật nào có thể dùng nhiều lần để giảm rác nhựa?','Bình nước cá nhân',['Ống hút nhựa dùng một lần','Túi nilon dùng một lần','Cốc nhựa dùng một lần','Bình nước cá nhân']),('Môi trường','Khí nào thường được nhắc đến trong hiệu ứng nhà kính?','CO2',['Oxy','CO2','Heli','Neon']),('Ẩm thực Việt','Món nào thường ăn cùng bún, rau sống và nước mắm chua ngọt?','Bún chả',['Bún chả','Chè đỗ đen','Bánh flan','Mứt gừng']),('Ẩm thực Việt','Nguyên liệu chính làm đậu phụ là gì?','Đậu nành',['Đậu nành','Lạc','Ngô','Gạo']),('Ẩm thực Việt','Loại gạo thường dùng làm bánh chưng là gì?','Gạo nếp',['Gạo lứt','Gạo tẻ','Gạo nếp','Yến mạch']),('Ẩm thực Việt','Món nào thường có nước dùng, bánh phở và thịt bò hoặc gà?','Phở',['Cháo','Phở','Bánh cuốn','Xôi']),('Ẩm thực Việt','Món bánh nào thường được tráng mỏng rồi cuốn nhân?','Bánh cuốn',['Bánh chưng','Bánh cuốn','Bánh tét','Bánh trung thu']),('Vũ trụ','Trái Đất đứng thứ mấy tính từ Mặt Trời?','3',['1','2','3','4']),('Vũ trụ','Hệ Mặt Trời hiện được công nhận có bao nhiêu hành tinh?','8',['7','8','9','10']),('Thể thao vui','Một đội bóng đá có bao nhiêu cầu thủ trên sân khi bắt đầu trận tiêu chuẩn?','11',['5','7','9','11']),('Thể thao vui','Một đội bóng chuyền trong nhà có bao nhiêu người trên sân?','6',['5','6','7','8']),('Văn học','Ai là tác giả Truyện Kiều?','Nguyễn Du',['Nguyễn Du','Nguyễn Trãi','Hồ Xuân Hương','Nguyễn Đình Chiểu']),('Văn học','Ai là tác giả Dế Mèn phiêu lưu ký?','Tô Hoài',['Tô Hoài','Nam Cao','Kim Lân','Ngô Tất Tố']),('Văn học','Nhân vật Chí Phèo xuất hiện trong tác phẩm của nhà văn nào?','Nam Cao',['Vũ Trọng Phụng','Nam Cao','Nguyễn Công Hoan','Thạch Lam']),('Văn học','Truyện cổ tích nào có cô gái đánh rơi chiếc hài ở hội?','Tấm Cám',['Thạch Sanh','Tấm Cám','Sọ Dừa','Cây khế']),('Đời sống','Dụng cụ nào dùng để xem hướng Đông Tây Nam Bắc?','La bàn',['Nhiệt kế','La bàn','Đồng hồ cát','Kính lúp']),('Đời sống','Đèn tín hiệu màu nào yêu cầu dừng lại?','Đỏ',['Xanh','Vàng nhấp nháy','Đỏ','Trắng']),('Đời sống','Dụng cụ nào dùng để cắt vải?','Kéo',['Thước','Kéo','Bút','Kim']),('Đời sống','Đồ vật nào giúp che mưa khi đi bộ?','Ô',['Quạt','Ô','Khăn bàn','Giỏ']),('Thiên nhiên','Cầu vồng thường được mô tả có mấy màu?','7',['5','6','7','8']),('Thiên nhiên','Mây được tạo chủ yếu từ gì?','Giọt nước và tinh thể băng',['Khói bếp','Cát','Giọt nước và tinh thể băng','Bụi than']),('Thiên nhiên','Mùa nào cây thường đâm chồi nảy lộc ở miền Bắc Việt Nam?','Xuân',['Hạ','Thu','Đông','Xuân']),('Thiên nhiên','Hiện tượng nào thường đi kèm tiếng sấm?','Chớp',['Cầu vồng','Sương mù','Chớp','Tuyết']),('Lịch sử Việt','Ai đọc Tuyên ngôn Độc lập năm 1945 tại Ba Đình?','Hồ Chí Minh',['Hồ Chí Minh','Võ Nguyên Giáp','Phan Bội Châu','Phan Châu Trinh']),('Lịch sử Việt','Vị vua nào dời đô từ Hoa Lư ra Thăng Long năm 1010?','Lý Công Uẩn',['Đinh Bộ Lĩnh','Lý Công Uẩn','Trần Nhân Tông','Lê Thánh Tông']),('Lịch sử Việt','Ai là nữ tướng gắn với cuộc khởi nghĩa năm 248?','Bà Triệu',['Bà Triệu','Nguyên phi Ỷ Lan','Bùi Thị Xuân','Dương Vân Nga']),('Lịch sử Việt','Chiến thắng Điện Biên Phủ diễn ra năm nào?','1954',['1945','1954','1968','1975']),('Lịch sử Việt','Tên cũ của Hà Nội do vua Lý Thái Tổ đặt là gì?','Thăng Long',['Phú Xuân','Gia Định','Thăng Long','Hoa Lư'])]
for i,(category,prompt,answer,options) in enumerate(choices,1):bank.append(dict(id=f'mix-choice-{i:03}',category=category,type='choice',prompt=prompt,answer=answer,options=options,aliases=[]))
seen=set(); unique=[]
for q in bank:
 key=q['prompt'].strip().lower().rstrip('?!. ')
 if key not in seen: unique.append(q);seen.add(key)
bank=unique
(root/'data/questions.json').write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
print(len(bank),'questions; math:',len(maths),'categories:',len(set(q['category'] for q in bank)))
