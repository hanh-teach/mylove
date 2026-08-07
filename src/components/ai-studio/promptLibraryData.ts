import { IPromptTemplate } from './types';

export const INITIAL_PROMPT_LIBRARY: IPromptTemplate[] = [
  {
    id: 'p-1',
    title: 'Thư Tri Ân Thầy Cô & Người Hướng Dẫn',
    description: 'Bức thư bộc lộ lòng biết ơn sâu sắc gửi tới thầy cô, người dẫn dắt trên con đường tri thức.',
    category: 'Education',
    creativeType: 'love_letter',
    promptText: 'Viết một bức thư tri ân chân thành gửi tới thầy/cô kính yêu nhân ngày lễ kỷ niệm. Nhắc lại những bài học quý giá và sự tận tụy dìu dắt suốt những năm tháng qua.',
    isFavorite: true,
    tags: ['Teacher', 'Gratitude', 'Inspiring']
  },
  {
    id: 'p-2',
    title: 'Lời Hứa Nguyện & Thiệp Kỷ Niệm',
    description: 'Bài viết đong đầy tình cảm dành riêng cho lễ kỷ niệm, sự kiện hoặc đám cưới.',
    category: 'Celebration',
    creativeType: 'anniversary_card',
    promptText: 'Tạo lời nhắn kỷ niệm sâu sắc, gửi lời cảm ơn chân thành đến người bạn đời hoặc gia đình vì đã cùng đi qua mọi bão giông và xây dựng mái ấm ngọt ngào.',
    isFavorite: true,
    tags: ['Wedding', 'Anniversary', 'Deep Love']
  },
  {
    id: 'p-3',
    title: 'Thư Gửi Người Bạn Nơi Xa - Kết Nối Tình Bạn',
    description: 'Lời nhắn gửi người bạn thân nơi xa, giữ trọn sự thấu hiểu qua mọi khoảng cách.',
    category: 'Personal',
    creativeType: 'love_letter',
    promptText: 'Viết lá thư nhắn gửi tới người bạn lâu ngày chưa gặp. Thể hiện sự trân trọng những kỷ niệm đẹp và niềm tin vào tình bạn bền chặt.',
    isFavorite: false,
    tags: ['Friendship', 'Connection', 'Warm']
  },
  {
    id: 'p-4',
    title: 'Lời Chúc Sinh Nhật Bạn Bè & Đồng Nghiệp',
    description: 'Lời chúc sinh nhật vui tươi, ấm áp và đầy chân thành.',
    category: 'Birthday',
    creativeType: 'story',
    promptText: 'Tạo một câu chuyện ngắn chúc mừng sinh nhật tuổi mới cho bạn bè. Lồng ghép những kỷ niệm vui vẻ và ước nguyện cho tuổi mới thành công.',
    isFavorite: true,
    tags: ['Birthday', 'Joyful', 'Inspirational']
  },
  {
    id: 'p-5',
    title: 'Danh Sách Nhạc Cảm Hứng & Thư Giãn',
    description: 'Tuyển tập những giai điệu nhẹ nhàng truyền cảm hứng sáng tạo và bình yên.',
    category: 'Celebration',
    creativeType: 'playlist',
    promptText: 'Gợi ý danh sách các bài hát acoustic thư giãn kèm những câu trích dẫn ý nghĩa chạm đến cảm xúc người nghe.',
    isFavorite: false,
    tags: ['Music', 'Focus', 'Relaxing']
  },
  {
    id: 'p-6',
    title: 'Thư Lời Cảm Ơn & Hòa Giải Chân Thành',
    description: 'Lời nhắn lịch sự, chân thành để xóa tan hiểu lầm và thắt chặt tình cảm.',
    category: 'Apology',
    creativeType: 'relationship_advice',
    promptText: 'Viết bức thư chia sẻ chân thành sau một hiểu lầm. Thể hiện sự lắng nghe, tôn trọng và mong muốn hướng tới sự thấu hiểu.',
    isFavorite: false,
    tags: ['Apology', 'Gentle', 'Healing']
  },
  {
    id: 'p-7',
    title: 'Bài Phát Biểu Kỷ Niệm & Cột Mốc Mới',
    description: 'Lời chia sẻ chân thành, giàu cảm xúc trong dịp kỷ niệm hoặc cột mốc sự kiện quan trọng.',
    category: 'Celebration',
    creativeType: 'story',
    promptText: 'Soạn lời phát biểu ấm áp cho buổi tiệc kỷ niệm. Bày tỏ sự tri ân tới tất cả mọi người đã đồng hành suốt chặng đường qua.',
    isFavorite: true,
    tags: ['Celebration', 'Milestone', 'Gratitude']
  },
  {
    id: 'p-8',
    title: 'Gửi Những Suy Tư Ngày Mưa',
    description: 'Những dòng tâm sự nhẹ nhàng khi ngẫm nghĩ về cuộc sống và hành trình cá nhân.',
    category: 'Personal',
    creativeType: 'love_letter',
    promptText: 'Viết bài tản văn thể hiện những suy tư, hoài niệm và năng lượng tích cực trong một chiều mưa lắng đọng.',
    isFavorite: false,
    tags: ['Reflection', 'Cozy', 'Poetic']
  }
];
