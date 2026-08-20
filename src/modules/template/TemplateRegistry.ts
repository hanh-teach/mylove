export interface TemplateConfig {
  id: string;
  name: string;
  category: 'Personal' | 'Education' | 'Family' | 'Friendship' | 'Business';
  subcategory: string;
  description: string;
  pages: number;
  difficulty: 'Dễ' | 'Trung bình' | 'Khó';
  suitableFor: string;
  tags: string[];
  previewImage: string;
  version: string;
  recommendedAIStyle: string;
  supportedBlocks: string[];
  themeId: string;
  layers: any[];
}

export const TEMPLATE_REGISTRY: Record<string, TemplateConfig> = {
  // --- Personal ---
  travel_journal: {
    id: 'travel_journal',
    name: 'Nhật Ký Hành Trình (Travel Journal)',
    category: 'Personal',
    subcategory: 'Journal',
    description: 'Nơi lưu giữ từng chặng đường, cảm nhận và khoảnh khắc đẹp đẽ trên mọi cung đường khám phá.',
    pages: 2,
    difficulty: 'Trung bình',
    suitableFor: 'Người đam mê xê dịch, du lịch tự túc',
    tags: ['Travel', 'Journal', 'Memories', 'Bento'],
    previewImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
    version: '1.2',
    recommendedAIStyle: 'Văn phong bay bổng, giàu chất thơ và trải nghiệm',
    supportedBlocks: ['Tiêu đề', 'Kỷ niệm', 'Dòng thời gian', 'Ảnh', 'Quote'],
    themeId: 'nature',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'NHẬT KÝ HÀNH TRÌNH PHÚ QUỐC', fontStyle: 'caveat', fontSize: 32, align: 'center', color: '#064e3b' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Mở đầu',
        x: 150,
        y: 160,
        width: 700,
        height: 100,
        zIndex: 2,
        metadata: { text: 'Ba ngày hai đêm tại đảo ngọc bình yên, nơi những cơn sóng vỗ về bãi cát trắng mịn màng và ánh hoàng hôn buông xuống nhuộm đỏ cả một góc trời rộng lớn...', fontStyle: 'caveat', fontSize: 20, align: 'center', color: '#064e3b' }
      },
      {
        id: 'layer_quote_1',
        type: 'quote',
        name: 'Quote Tâm Trạng',
        x: 100,
        y: 280,
        width: 380,
        height: 110,
        zIndex: 3,
        metadata: { quoteText: '"Chúng ta không chỉ đi để ngắm cảnh, mà để thấy tâm hồn mình rộng mở hơn sau mỗi chuyến hành trình."', quoteAuthor: 'Kẻ lữ hành', color: '#064e3b', borderColor: '#059669' }
      },
      {
        id: 'layer_image_1',
        type: 'image',
        name: 'Ảnh Đảo Ngọc',
        x: 520,
        y: 280,
        width: 380,
        height: 220,
        zIndex: 4,
        metadata: { imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', caption: 'Bình minh trên Bãi Sao yên bình' }
      },
      {
        id: 'layer_timeline_1',
        type: 'timeline_block',
        name: 'Lịch trình ngắn',
        x: 100,
        y: 430,
        width: 380,
        height: 280,
        zIndex: 5,
        metadata: {
          color: '#059669',
          events: [
            { id: '1', time: 'Ngày 1', title: 'Check-in Đảo Ngọc', desc: 'Đón hoàng hôn tại Sunset Sanato cực kỳ lung linh.' },
            { id: '2', time: 'Ngày 2', title: 'Lặn ngắm san hô', desc: 'Khám phá thế giới đại dương rực rỡ tại hòn Móng Tay.' },
            { id: '3', time: 'Ngày 3', title: 'Chợ đêm Dinh Cậu', desc: 'Thưởng thức hải sản tươi ngon và mua quà lưu niệm.' }
          ]
        }
      }
    ]
  },
  personal_diary: {
    id: 'personal_diary',
    name: 'Góc Nhỏ Tâm Sự (Personal Diary)',
    category: 'Personal',
    subcategory: 'Diary',
    description: 'Không gian ghi chép những suy tư thầm kín, cảm xúc chân thật nhất của bản thân sau ngày dài làm việc.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Ghi chép tự sự cá nhân',
    tags: ['Diary', 'Personal', 'Mindfulness', 'Thoughts'],
    previewImage: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Nhẹ nhàng, sâu lắng, mang tính phản tỉnh',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Checklist', 'Quote'],
    themeId: 'minimal',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề',
        x: 100,
        y: 100,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'VIẾT CHO NGÀY THẢNH THƠI', fontStyle: 'nunito', fontSize: 28, align: 'center', color: '#1e293b' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Nhật ký ngày hôm nay',
        x: 150,
        y: 180,
        width: 700,
        height: 140,
        zIndex: 2,
        metadata: { text: 'Có những ngày chỉ muốn tắt hết thông báo, nhâm nhi một tách trà ấm và ngắm nhìn phố thị qua khung cửa sổ. Ngày hôm nay trôi qua thật chậm rãi, không hối hả, không âu lo...', fontStyle: 'nunito', fontSize: 16, align: 'center', color: '#334155' }
      },
      {
        id: 'layer_checklist_1',
        type: 'checklist',
        name: 'Việc đã hoàn thành',
        x: 150,
        y: 360,
        width: 320,
        height: 240,
        zIndex: 3,
        metadata: {
          color: '#475569',
          items: [
            { id: '1', text: 'Thức dậy lúc 6:00 sáng đón bình minh', checked: true },
            { id: '2', text: 'Đọc hết 3 chương cuốn sách đang dang dở', checked: true },
            { id: '3', text: 'Đi dạo quanh hồ lộng gió buổi chiều', checked: true },
            { id: '4', text: 'Viết vài dòng nhật ký gửi chính mình', checked: false }
          ]
        }
      },
      {
        id: 'layer_quote_1',
        type: 'quote',
        name: 'Lời khuyên ngày mới',
        x: 510,
        y: 360,
        width: 340,
        height: 160,
        zIndex: 4,
        metadata: { quoteText: '"Hạnh phúc không nằm ở đích đến mà là những niềm vui nhỏ bé gom nhặt trên từng bước chân ta qua."', quoteAuthor: 'Zen Book', color: '#1e293b', borderColor: '#cbd5e1' }
      }
    ]
  },
  daily_notes: {
    id: 'daily_notes',
    name: 'Sổ Ý Tưởng Thường Nhật (Daily Notes)',
    category: 'Personal',
    subcategory: 'Daily Notes',
    description: 'Bố cục năng động hỗ trợ phác thảo, lập kế hoạch nhanh và ghi chú sáng tạo mỗi ngày.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Học sinh, sinh viên, người làm sáng tạo',
    tags: ['Notes', 'Brainstorm', 'Planning'],
    previewImage: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Ngắn gọn, súc tích, định hướng hành động',
    supportedBlocks: ['Tiêu đề', 'Checklist', 'Bảng kỷ niệm'],
    themeId: 'modern',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề',
        x: 100,
        y: 100,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'Ý TƯỞNG & NHIỆM VỤ NGÀY MỚI', fontStyle: 'nunito', fontSize: 30, align: 'center', color: '#0f172a' }
      },
      {
        id: 'layer_checklist_1',
        type: 'checklist',
        name: 'Checklist hành động',
        x: 100,
        y: 180,
        width: 380,
        height: 240,
        zIndex: 2,
        metadata: {
          color: '#2563eb',
          items: [
            { id: '1', text: 'Thiết kế giao diện Sprint 66', checked: true },
            { id: '2', text: 'Viết Registry cho Template & Theme', checked: true },
            { id: '3', text: 'Build, lint và test hệ thống', checked: false }
          ]
        }
      },
      {
        id: 'layer_table_1',
        type: 'table',
        name: 'Lịch họp & Deadline',
        x: 510,
        y: 180,
        width: 390,
        height: 240,
        zIndex: 3,
        metadata: {
          color: '#1e293b',
          headers: ['Thời gian', 'Nội dung', 'Trạng thái'],
          rows: [
            ['09:00', 'Họp bàn giao diện', 'Hoàn thành'],
            ['14:00', 'Coding Backend', 'Đang xử lý'],
            ['17:00', 'Review & Deploy', 'Chưa bắt đầu']
          ]
        }
      }
    ]
  },

  // --- Education ---
  teacher_appreciation: {
    id: 'teacher_appreciation',
    name: 'Tri Ân Người Gieo Chữ (Teacher Appreciation)',
    category: 'Education',
    subcategory: 'Teacher Appreciation',
    description: 'Thư tri ân thầy cô giáo nhân dịp ngày Hiến chương Nhà giáo, bày tỏ lòng biết ơn sâu sắc.',
    pages: 1,
    difficulty: 'Trung bình',
    suitableFor: 'Học trò gửi tặng thầy cô giáo cũ và mới',
    tags: ['Teacher', 'Appreciation', 'School', 'Gratitude'],
    previewImage: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
    version: '1.1',
    recommendedAIStyle: 'Trang trọng, ấm áp, giàu tình cảm kính trọng',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Quote', 'Ảnh'],
    themeId: 'classic',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'KÍNH GỬI NGƯỜI THẦY KÍNH YÊU', fontStyle: 'lora', fontSize: 32, align: 'center', color: '#451a03' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Lời chúc tri ân',
        x: 150,
        y: 160,
        width: 700,
        height: 180,
        zIndex: 2,
        metadata: { text: 'Thời gian có thể trôi đi, nhưng những lời giảng ấm áp và bài học sâu sắc của Thầy vẫn mãi khắc sâu trong tâm trí của chúng em. Cảm ơn Thầy vì đã luôn kiên nhẫn, dìu dắt và truyền ngọn lửa tri thức dẫn lối cho chúng em bước vào đời rộng lớn...', fontStyle: 'lora', fontSize: 18, align: 'center', color: '#451a03' }
      },
      {
        id: 'layer_quote_1',
        type: 'quote',
        name: 'Trích dẫn hay',
        x: 100,
        y: 380,
        width: 800,
        height: 110,
        zIndex: 3,
        metadata: { quoteText: '"Một người thầy giỏi giống như ngọn nến, luôn cháy hết mình để soi sáng đường đi cho những người khác."', quoteAuthor: 'Mustafa Kemal Atatürk', color: '#451a03', borderColor: '#d97706' }
      }
    ]
  },
  graduation_speech: {
    id: 'graduation_speech',
    name: 'Diễn Văn Tốt Nghiệp (Graduation Speech)',
    category: 'Education',
    subcategory: 'Graduation',
    description: 'Mẫu diễn văn truyền cảm hứng, xúc động và tự hào dành cho thủ khoa hoặc đại diện học sinh.',
    pages: 2,
    difficulty: 'Khó',
    suitableFor: 'Lễ tốt nghiệp THPT, Đại học',
    tags: ['Graduation', 'Speech', 'University', 'Inspirational'],
    previewImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Truyền cảm hứng mạnh mẽ, trang trọng, tự hào và hoài niệm',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Dòng thời gian', 'Quote'],
    themeId: 'academic',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề diễn văn',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'DIỄN VĂN TỐT NGHIỆP: KHÁT VỌNG VÀ NIỀM TIN', fontStyle: 'lora', fontSize: 32, align: 'center', color: '#1e1b4b' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Nội dung chính',
        x: 150,
        y: 160,
        width: 700,
        height: 220,
        zIndex: 2,
        metadata: { text: 'Ngày hôm nay, đứng dưới mái trường thân yêu này, chúng ta nhìn lại chặng đường 4 năm đầy ắp nỗ lực, mồ hôi và cả những tiếng cười giòn giã. Đây không phải điểm kết thúc, mà là vạch xuất phát mới để mỗi người trong chúng ta tự tin sải cánh vươn xa, vẽ nên hoài bão lớn của đời mình...', fontStyle: 'lora', fontSize: 18, align: 'center', color: '#1e1b4b' }
      },
      {
        id: 'layer_timeline_1',
        type: 'timeline_block',
        name: 'Chặng đường học tập',
        x: 100,
        y: 400,
        width: 800,
        height: 260,
        zIndex: 3,
        metadata: {
          color: '#4338ca',
          events: [
            { id: '1', time: 'Năm nhất', title: 'Bỡ ngỡ bước vào trường', desc: 'Làm quen với bạn bè mới, thầy cô giáo và những môn học đại cương lí thú.' },
            { id: '2', time: 'Năm hai & ba', title: 'Nỗ lực nghiên cứu & hoạt động', desc: 'Tham gia các câu lạc bộ, dự án cộng đồng và tích lũy tri thức chuyên ngành sâu.' },
            { id: '3', time: 'Năm cuối', title: 'Khoá luận & Khởi hành', desc: 'Hoàn thành chặng đường học thuật, khoác lên mình tấm áo cử nhân danh giá.' }
          ]
        }
      }
    ]
  },
  school_project: {
    id: 'school_project',
    name: 'Báo Cáo Dự Án Học Tập (School Project)',
    category: 'Education',
    subcategory: 'School Project',
    description: 'Layout tổ chức khoa học, trực quan cho các dự án nghiên cứu nhóm, bài luận xuất sắc.',
    pages: 1,
    difficulty: 'Trung bình',
    suitableFor: 'Học sinh, nhóm nghiên cứu',
    tags: ['Project', 'Research', 'Academic', 'Presentation'],
    previewImage: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Khách quan, cấu trúc rõ ràng, đậm tính khoa học',
    supportedBlocks: ['Tiêu đề', 'Table', 'Checklist', 'Quote'],
    themeId: 'professional',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tên dự án',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'DỰ ÁN NGHIÊN CỨU: NĂNG LƯỢNG XANH 2026', fontStyle: 'nunito', fontSize: 28, align: 'center', color: '#0f172a' }
      },
      {
        id: 'layer_table_1',
        type: 'table',
        name: 'Bảng phân công công việc',
        x: 100,
        y: 180,
        width: 480,
        height: 280,
        zIndex: 2,
        metadata: {
          color: '#1e3a8a',
          headers: ['Nhiệm vụ', 'Thành viên', 'Hạn chót'],
          rows: [
            ['Thu thập dữ liệu', 'Nguyễn Văn A', '15/08/2026'],
            ['Phân tích thông tin', 'Trần Thị B', '20/08/2026'],
            ['Viết báo cáo tổng hợp', 'Phạm Hồng C', '25/08/2026'],
            ['Thiết kế Slide thuyết trình', 'Cả nhóm', '30/08/2026']
          ]
        }
      },
      {
        id: 'layer_checklist_1',
        type: 'checklist',
        name: 'Tiến độ chung',
        x: 600,
        y: 180,
        width: 300,
        height: 280,
        zIndex: 3,
        metadata: {
          color: '#475569',
          items: [
            { id: '1', text: 'Nghiên cứu tài liệu tham khảo', checked: true },
            { id: '2', text: 'Khảo sát thực tế môi trường', checked: true },
            { id: '3', text: 'Kiểm nghiệm mẫu đất & nước', checked: false },
            { id: '4', text: 'Viết báo cáo đánh giá', checked: false }
          ]
        }
      }
    ]
  },
  academic_certificate: {
    id: 'academic_certificate',
    name: 'Chứng Nhận Đạt Thành Tích (Certificate)',
    category: 'Education',
    subcategory: 'Certificate',
    description: 'Mẫu chứng chỉ danh giá, thiết kế tinh xảo để tuyên dương học sinh xuất sắc.',
    pages: 1,
    difficulty: 'Trung bình',
    suitableFor: 'Nhà trường, trung tâm giáo dục, câu lạc bộ',
    tags: ['Certificate', 'Award', 'Education', 'Excellence'],
    previewImage: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Trang trọng, tôn vinh, chuẩn mực cao quý',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Quote', 'Shape'],
    themeId: 'academic',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Chứng chỉ',
        x: 100,
        y: 120,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'GIẤY CHỨNG NHẬN VINH DANH', fontStyle: 'lora', fontSize: 36, align: 'center', color: '#1e1b4b' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Chi tiết khen thưởng',
        x: 150,
        y: 220,
        width: 700,
        height: 180,
        zIndex: 2,
        metadata: { text: 'Trân trọng trao tặng danh hiệu này cho Học viên xuất sắc nhất khoá học vì đã có những nỗ lực vượt bậc, tinh thần cống hiến hăng say và thành tích học tập xuất sắc dẫn đầu tập thể trong học kỳ vừa qua...', fontStyle: 'lora', fontSize: 18, align: 'center', color: '#1e1b4b' }
      }
    ]
  },

  // --- Family ---
  family_birthday: {
    id: 'family_birthday',
    name: 'Thiệp Sinh Nhật Gia Đình (Birthday)',
    category: 'Family',
    subcategory: 'Birthday',
    description: 'Thiết kế ngập tràn niềm vui và sự ấm áp dành riêng cho các thành viên thân yêu trong gia đình.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Tặng cha mẹ, con cái, anh chị em',
    tags: ['Birthday', 'Family', 'Love', 'Pastel'],
    previewImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    version: '1.1',
    recommendedAIStyle: 'Văn phong ngọt ngào, ấm áp, đong đầy kỷ niệm gia đình',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Ảnh', 'Quote'],
    themeId: 'cute',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Lời chúc mừng',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'CHÚC MỪNG SINH NHẬT MẸ YÊU!', fontStyle: 'pacifico', fontSize: 30, align: 'center', color: '#831843' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Lời chúc chi tiết',
        x: 150,
        y: 160,
        width: 700,
        height: 140,
        zIndex: 2,
        metadata: { text: 'Chúc người phụ nữ tuyệt vời nhất thế giới của chúng con luôn luôn mạnh khỏe, tràn đầy niềm vui, hạnh phúc và luôn nở nụ cười rạng rỡ trên môi. Mẹ là bến đỗ bình yên nhất, là điểm tựa vững chãi để chúng con vững vàng vững bước trong cuộc sống...', fontStyle: 'pacifico', fontSize: 18, align: 'center', color: '#831843' }
      },
      {
        id: 'layer_image_1',
        type: 'image',
        name: 'Ảnh gia đình',
        x: 250,
        y: 330,
        width: 500,
        height: 280,
        zIndex: 3,
        metadata: { imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80', caption: 'Khoảnh khắc sum vầy đầm ấm bên nhau' }
      }
    ]
  },
  family_album: {
    id: 'family_album',
    name: 'Album Kỷ Niệm Gia Đình (Family Album)',
    category: 'Family',
    subcategory: 'Family Album',
    description: 'Dàn trang dạng lưới bento tuyệt đẹp giúp lưu lại và tôn vinh những khoảnh khắc quý giá nhất của cả gia đình.',
    pages: 2,
    difficulty: 'Khó',
    suitableFor: 'Kỷ niệm ngày cưới, năm mới, sum vầy',
    tags: ['Album', 'Family', 'Photos', 'Grid'],
    previewImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Ấm cúng, tự hào, tràn đầy niềm hạnh phúc gia đình',
    supportedBlocks: ['Tiêu đề', 'Kỷ niệm', 'Ảnh', 'Quote'],
    themeId: 'classic',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tựa đề Album',
        x: 100,
        y: 60,
        width: 800,
        height: 50,
        zIndex: 1,
        metadata: { text: 'NƠI BÌNH YÊN QUAY TRỞ VỀ', fontStyle: 'lora', fontSize: 28, align: 'center', color: '#451a03' }
      },
      {
        id: 'layer_image_1',
        type: 'image',
        name: 'Ảnh Cả Nhà',
        x: 100,
        y: 140,
        width: 480,
        height: 320,
        zIndex: 2,
        metadata: { imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80', caption: 'Gia đình nhỏ, hạnh phúc to' }
      },
      {
        id: 'layer_quote_1',
        type: 'quote',
        name: 'Châm ngôn gia đình',
        x: 600,
        y: 140,
        width: 300,
        height: 160,
        zIndex: 3,
        metadata: { quoteText: '"Gia đình không phải là một điều quan trọng, nó là tất cả mọi thứ."', quoteAuthor: 'Michael J. Fox', color: '#451a03', borderColor: '#d97706' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Lời tự sự',
        x: 600,
        y: 320,
        width: 300,
        height: 140,
        zIndex: 4,
        metadata: { text: 'Năm tháng có thể trôi qua, những đứa trẻ rồi sẽ khôn lớn và bay cao đến những chân trời mới, nhưng mái ấm gia đình vẫn mãi là nơi neo đậu bình yên và chào đón ta quay trở về...', fontStyle: 'lora', fontSize: 15, align: 'left', color: '#451a03' }
      }
    ]
  },
  family_letter: {
    id: 'family_letter',
    name: 'Thư Gửi Đấng Sinh Thành (Family Letter)',
    category: 'Family',
    subcategory: 'Family Letter',
    description: 'Thư ngỏ gửi cha mẹ, nói lời cảm ơn chân thành từ đáy lòng vì công lao sinh thành dưỡng dục.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Mùa Vu lan, năm mới, ngày của Cha/Mẹ',
    tags: ['Letter', 'Parents', 'Love', 'Gratitude'],
    previewImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Chân thành, xúc động, tràn trề sự hiếu thảo',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Quote'],
    themeId: 'elegant',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề',
        x: 100,
        y: 100,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'THƯ GỬI CHA MẸ YÊU DẤU', fontStyle: 'playfair', fontSize: 32, align: 'center', color: '#4c0519' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Bức thư tay',
        x: 150,
        y: 180,
        width: 700,
        height: 240,
        zIndex: 2,
        metadata: { text: 'Con viết những dòng này khi ngoài trời mưa nhẹ rơi, nhớ về đôi bàn tay chai sần của cha và nụ cười ấm áp, hiền hậu của mẹ. Suốt cả một đời vất vả ngược xuôi, cha mẹ đã hy sinh tất cả để nuôi nấng chúng con nên người. Con vô cùng tự hào và biết ơn vì được làm con của cha mẹ...', fontStyle: 'playfair', fontSize: 18, align: 'center', color: '#4c0519' }
      }
    ]
  },

  // --- Friendship ---
  friendship_card: {
    id: 'friendship_card',
    name: 'Thiệp Tình Bạn Bền Chặt (Greeting Card)',
    category: 'Friendship',
    subcategory: 'Greeting Card',
    description: 'Mẫu thiệp chúc mừng sinh nhật hoặc chúc mừng thành tích dành riêng cho hội bạn thân nghịch ngợm.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Bạn học, bạn chí cốt',
    tags: ['Friendship', 'Funny', 'Cheer', 'Bright'],
    previewImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Hài hước, vui nhộn, năng động và gần gũi',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Quote', 'Ảnh'],
    themeId: 'cute',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'CẢM ƠN VÌ ĐÃ LÀ BẠN CỦA TAO!', fontStyle: 'pacifico', fontSize: 28, align: 'center', color: '#831843' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Lời nhắn gửi',
        x: 150,
        y: 160,
        width: 700,
        height: 140,
        zIndex: 2,
        metadata: { text: 'Gửi đứa bạn thân chí cốt chuyên cùng tao trải qua mọi trò đùa tinh quái dưới mái trường. Cảm ơn mày vì đã luôn ở bên lắng nghe những lời than vãn ngớ ngẩn nhất và cùng chia sẻ từng que kem mát lạnh ngày hè nóng bức...', fontStyle: 'pacifico', fontSize: 16, align: 'center', color: '#831843' }
      },
      {
        id: 'layer_image_1',
        type: 'image',
        name: 'Ảnh Bạn Thân',
        x: 250,
        y: 320,
        width: 500,
        height: 280,
        zIndex: 3,
        metadata: { imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80', caption: 'Đồng hành trên mọi nẻo đường rực rỡ' }
      }
    ]
  },
  farewell_letter: {
    id: 'farewell_letter',
    name: 'Thư Tạm Biệt Đồng Nghiệp (Farewell Letter)',
    category: 'Friendship',
    subcategory: 'Farewell Letter',
    description: 'Thư chia tay tinh tế, tri ân đồng nghiệp và ban quản lý trước khi chuyển giao công tác mới.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Người chuyển việc, chia tay phòng ban',
    tags: ['Farewell', 'Business', 'Colleagues', 'Wishes'],
    previewImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Chân thành, lưu luyến nhưng đầy lạc quan và chúc phúc',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Quote'],
    themeId: 'minimal',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tựa chia tay',
        x: 100,
        y: 100,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'LỜI TẠM BIỆT & TRÂN TRỌNG CẢM ƠN', fontStyle: 'nunito', fontSize: 26, align: 'center', color: '#1e293b' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Nội dung thư chia tay',
        x: 150,
        y: 180,
        width: 700,
        height: 220,
        zIndex: 2,
        metadata: { text: 'Hành trình đồng hành cùng mọi người tại phòng thiết kế là một trong những trải nghiệm quý giá nhất của tôi. Cảm ơn sự hỗ trợ, những lời chỉ bảo tận tình và những buổi tối cùng nhau OT hăng say hoàn thành dự án lớn. Chúc cho công ty ta ngày càng phát triển rực rỡ hơn nữa...', fontStyle: 'nunito', fontSize: 15, align: 'center', color: '#334155' }
      }
    ]
  },
  congratulations_card: {
    id: 'congratulations_card',
    name: 'Lời Chúc Mừng Thành Công (Congratulations)',
    category: 'Friendship',
    subcategory: 'Congratulations',
    description: 'Thiệp chúc mừng trang trọng vinh danh bạn bè đạt giải thưởng, thăng chức, đỗ đạt.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Khai trương, thăng tiến, tốt nghiệp',
    tags: ['Congratulations', 'Success', 'Achievement'],
    previewImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Tươi vui, chúc mừng nhiệt thành, đầy hi vọng rạng rỡ',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Quote'],
    themeId: 'modern',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề vinh danh',
        x: 100,
        y: 120,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'TỰ HÀO VỀ SỰ THÀNH CÔNG CỦA BẠN!', fontStyle: 'nunito', fontSize: 28, align: 'center', color: '#0f172a' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Nội dung vinh danh',
        x: 150,
        y: 220,
        width: 700,
        height: 180,
        zIndex: 2,
        metadata: { text: 'Không gì có thể ngăn cản bước tiến của một người luôn nỗ lực không ngừng nghỉ mỗi ngày. Thành quả ngày hôm nay hoàn toàn xứng đáng với những mồ hôi, nước mắt và ý chí sắt đá mà bạn đã bỏ ra suốt thời gian qua. Hãy tiếp tục tiến lên và gặt hái thêm nhiều vinh quang mới nhé...', fontStyle: 'nunito', fontSize: 16, align: 'center', color: '#1e293b' }
      }
    ]
  },

  // --- Business ---
  business_thank_you: {
    id: 'business_thank_you',
    name: 'Thư Cảm Ơn Khách Hàng (Thank You Letter)',
    category: 'Business',
    subcategory: 'Thank You Letter',
    description: 'Mẫu thư tri ân khách hàng và đối tác kinh doanh thân thiết, khẳng định mối quan hệ bền vững.',
    pages: 1,
    difficulty: 'Trung bình',
    suitableFor: 'Khách hàng VIP, đối tác chiến lược',
    tags: ['Business', 'Thank You', 'Corporate', 'Partner'],
    previewImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Trang trọng, chuyên nghiệp, uy tín và tôn trọng',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Table'],
    themeId: 'professional',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề doanh nghiệp',
        x: 100,
        y: 80,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'THƯ CẢM ƠN ĐỐI TÁC CHIẾN LƯỢC', fontStyle: 'nunito', fontSize: 26, align: 'center', color: '#0f172a' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Bức thư cảm ơn',
        x: 150,
        y: 150,
        width: 700,
        height: 160,
        zIndex: 2,
        metadata: { text: 'Chúng tôi trân trọng gửi lời cảm ơn sâu sắc nhất tới Quý công ty vì sự tin tưởng và đồng hành cùng thương hiệu trong suốt năm vừa qua. Sự hợp tác tin cậy này là động lực to lớn giúp chúng tôi không ngừng cải tiến chất lượng sản phẩm dịch vụ và đạt được những bước tăng trưởng vượt bậc...', fontStyle: 'nunito', fontSize: 15, align: 'center', color: '#1e293b' }
      },
      {
        id: 'layer_table_1',
        type: 'table',
        name: 'Chương trình tri ân',
        x: 150,
        y: 340,
        width: 700,
        height: 220,
        zIndex: 3,
        metadata: {
          color: '#1e3a8a',
          headers: ['Hạng mục tri ân', 'Ưu đãi đặc quyền', 'Hạn áp dụng'],
          rows: [
            ['Khách hàng VIP 2026', 'Chiết khấu 15% tổng hoá đơn', '31/12/2026'],
            ['Gói bảo hành Premium', 'Miễn phí bảo trì trọn đời', 'Không thời hạn'],
            ['Hội nghị đối tác lớn', 'Thư mời tham dự tiệc cuối năm', 'Hà Nội - 25/12']
          ]
        }
      }
    ]
  },
  business_invitation: {
    id: 'business_invitation',
    name: 'Thư Mời Khai Trương (Invitation)',
    category: 'Business',
    subcategory: 'Invitation',
    description: 'Thư mời sự kiện sang trọng, chuẩn chỉ để gửi tặng đối tác đến dự lễ ra mắt, tiệc công ty.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Khai trương showroom, gala dinner',
    tags: ['Invitation', 'Gala', 'Launch', 'Event'],
    previewImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Trang nhã, lịch thiệp, thu hút sự tham gia',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Table'],
    themeId: 'professional',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tựa đề thư mời',
        x: 100,
        y: 100,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'THƯ MỜI SỰ KIỆN: KHỞI NGUỒN SÁNG TẠO', fontStyle: 'nunito', fontSize: 26, align: 'center', color: '#0f172a' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Thông điệp kính mời',
        x: 150,
        y: 180,
        width: 700,
        height: 140,
        zIndex: 2,
        metadata: { text: 'Chúng tôi trân trọng kính mời Quý Khách tới tham dự Lễ ra mắt nền tảng công nghệ Canvas Composer thế hệ mới. Đây là dấu mốc quan trọng đánh dấu bước đột phá vượt bậc của chúng tôi trong hành trình chuyển đổi số toàn diện...', fontStyle: 'nunito', fontSize: 15, align: 'center', color: '#1e293b' }
      },
      {
        id: 'layer_table_1',
        type: 'table',
        name: 'Lịch trình sự kiện',
        x: 150,
        y: 350,
        width: 700,
        height: 200,
        zIndex: 3,
        metadata: {
          color: '#1e3a8a',
          headers: ['Thời gian', 'Nội dung chương trình', 'Địa điểm'],
          rows: [
            ['18:00 - 18:30', 'Đón tiếp khách mời & Check-in', 'Sảnh Grand Ballroom'],
            ['18:30 - 19:30', 'Khai mạc & Trình diễn Công nghệ', 'Sân khấu chính'],
            ['19:30 - 21:00', 'Tiệc tối & Giao lưu kết nối', 'Nhà hàng Skyview']
          ]
        }
      }
    ]
  },
  business_announcement: {
    id: 'business_announcement',
    name: 'Thông Báo Ra Mắt Dự Án (Announcement)',
    category: 'Business',
    subcategory: 'Announcement',
    description: 'Mẫu thông báo cột mốc dự án mới, sáp nhập, tái cấu trúc hoặc chào đón nhân sự cao cấp.',
    pages: 1,
    difficulty: 'Dễ',
    suitableFor: 'Toàn thể nhân viên, cổ đông, truyền thông',
    tags: ['Announcement', 'Project', 'Launch', 'Corporate'],
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    version: '1.0',
    recommendedAIStyle: 'Chuyên nghiệp, định hướng tầm nhìn, tin cậy vững chãi',
    supportedBlocks: ['Tiêu đề', 'Lời chúc', 'Table'],
    themeId: 'professional',
    layers: [
      {
        id: 'layer_title',
        type: 'text',
        name: 'Tựa đề thông báo',
        x: 100,
        y: 120,
        width: 800,
        height: 60,
        zIndex: 1,
        metadata: { text: 'CÔNG BỐ CHIẾN LƯỢC PHÁT TRIỂN 2026', fontStyle: 'nunito', fontSize: 26, align: 'center', color: '#0f172a' }
      },
      {
        id: 'layer_message',
        type: 'text',
        name: 'Nội dung công bố',
        x: 150,
        y: 200,
        width: 700,
        height: 200,
        zIndex: 2,
        metadata: { text: 'Trải qua chặng đường xây dựng và phát triển vững chắc, Hội đồng quản trị xin trân trọng thông báo về việc tái cấu trúc các phòng ban kinh doanh nhằm tập trung toàn lực nghiên cứu và ứng dụng trí tuệ nhân tạo Gemini thế hệ mới vào quy trình sản xuất...', fontStyle: 'nunito', fontSize: 15, align: 'center', color: '#1e293b' }
      }
    ]
  }
};

export class TemplateRegistry {
  public static getAll(): TemplateConfig[] {
    return Object.values(TEMPLATE_REGISTRY);
  }

  public static getById(id: string): TemplateConfig {
    return TEMPLATE_REGISTRY[id] || TEMPLATE_REGISTRY.travel_journal;
  }
}
