import { ICollection, IMemory, ITag, MemoryFilterOptions, MemorySortOption, MemoryStats, MoodType, TimelineCategory } from './MemoryTypes';

export function resolveMemoryCategory(memory: Partial<IMemory>): TimelineCategory {
  if (memory.category) return memory.category;
  if (memory.type === 'letter') return 'Letter';
  if (memory.type === 'video') return 'Video';
  if (memory.type === 'music') return 'Music';
  if (memory.tags?.includes('Travel')) return 'Travel';
  if (memory.tags?.includes('Anniversary') || memory.tags?.includes('Wedding')) return 'Wedding';
  if (memory.tags?.includes('Gift') || memory.tags?.includes('Birthday') || memory.title?.toLowerCase().includes('sinh nhật')) return 'Birthday';
  if (memory.type === 'image') return 'Photo';
  return 'Love';
}

const MEMORIES_STORAGE_KEY = 'love_note_memories_v2';
const TAGS_STORAGE_KEY = 'love_note_tags_v2';
const COLLECTIONS_STORAGE_KEY = 'love_note_collections_v2';

export const DEFAULT_COLLECTIONS: ICollection[] = [
  {
    id: 'col-1',
    name: 'First Year',
    icon: '❤️',
    color: '#ec4899',
    description: 'Kỷ niệm và dấu mốc của năm đầu tiên hẹn hò',
    memoryIds: ['mem-3', 'mem-6'],
    createdAt: Date.now() - 86400000 * 100,
    updatedAt: Date.now() - 86400000 * 100
  },
  {
    id: 'col-2',
    name: 'Wedding & Anniversary',
    icon: '🌸',
    color: '#f43f5e',
    description: 'Các khoảnh khắc đính hôn, đám cưới và ngày kỷ niệm',
    memoryIds: ['mem-2'],
    createdAt: Date.now() - 86400000 * 80,
    updatedAt: Date.now() - 86400000 * 80
  },
  {
    id: 'col-3',
    name: 'Travel & Trips',
    icon: '✈️',
    color: '#3b82f6',
    description: 'Những chuyến đi trải nghiệm khắp mọi miền đất nước',
    memoryIds: ['mem-1', 'mem-4'],
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 60
  },
  {
    id: 'col-4',
    name: 'Birthday & Gifts',
    icon: '🎂',
    color: '#f59e0b',
    description: 'Sinh nhật và những món quà chan chứa tình cảm',
    memoryIds: ['mem-5'],
    createdAt: Date.now() - 86400000 * 40,
    updatedAt: Date.now() - 86400000 * 40
  },
  {
    id: 'col-5',
    name: 'Writing & Letters',
    icon: '📝',
    color: '#8b5cf6',
    description: 'Ghi chú, bài viết và những lời tri ân chân thành gửi trao',
    memoryIds: ['mem-2', 'mem-5'],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20
  }
];

export const DEFAULT_TAGS: ITag[] = [
  { id: 'tag-1', name: 'Travel', color: '#ec4899' },      // Pink
  { id: 'tag-2', name: 'Anniversary', color: '#8b5cf6' }, // Purple
  { id: 'tag-3', name: 'Date', color: '#f43f5e' },        // Rose
  { id: 'tag-4', name: 'Gift', color: '#10b981' },        // Emerald
  { id: 'tag-5', name: 'Letter', color: '#f59e0b' },      // Amber
  { id: 'tag-6', name: 'FirstMeet', color: '#3b82f6' },   // Blue
];

export const INITIAL_MEMORIES: IMemory[] = [
  {
    id: 'mem-1',
    title: 'Chuyến đi Đà Lạt đầu tiên cùng nhau',
    date: '2024-02-14',
    location: 'Đà Lạt, Lâm Đồng',
    mood: 'Romantic',
    type: 'image',
    collectionId: 'col-3',
    coverImage: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80',
    content: 'Dành trọn vẹn 3 ngày ý nghĩa ở Đà Lạt. Cùng nhau thưởng thức ly cà phê nóng giữa sương mờ buổi sáng tại đồi Dã Quỳ, dạo qua những con dốc nhỏ nhộn nhịp và ngắm nhìn hoàng hôn rực rỡ buông xuống hồ Tuyền Lâm.',
    aiSummary: 'Hành trình đáng nhớ 3 ngày 2 đêm tại Đà Lạt ghi dấu mốc kỷ niệm đầu tiên với nhiều khoảnh khắc ấm áp và cảnh sắc hoàng hôn thơ mộng.',
    notes: 'Nhớ ghé lại quán cà phê Túi Mơ To vào dịp kỷ niệm sang năm nhé!',
    isFavorite: true,
    viewCount: 42,
    tags: ['Travel', 'Anniversary', 'Date'],
    mediaUrls: [
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'
    ],
    timelineEvents: [
      { id: 'te-1', title: 'Đón bình minh đồi chè', date: '2024-02-14 05:30', description: 'Trời se lạnh nhưng ấm áp vì có anh bên cạnh' },
      { id: 'te-2', title: 'Ăn lẩu gà lá é', date: '2024-02-14 19:00', description: 'Xếp hàng 30 phút nhưng rất đáng giá' }
    ],
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now() - 86400000 * 30
  },
  {
    id: 'mem-2',
    title: 'Bức thư tri ân & Lời nhắn kỷ niệm',
    date: '2024-05-20',
    location: 'TP. Hồ Chí Minh',
    mood: 'Gentle',
    type: 'letter',
    collectionId: 'col-2',
    coverImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
    content: 'Gửi những người bạn thân yêu,\n\nKhoảng thời gian trải qua cùng mọi người là hành trình bình yên và ý nghĩa nhất. Cảm ơn vì đã luôn lắng nghe, thấu hiểu và chia sẻ từng khoảnh khắc trong cuộc sống. Dù mai này có ra sao, sự đồng hành này vẫn là điều trân quý nhất.',
    aiSummary: 'Bức thư tri ân chân thành thể hiện sự trân trọng và tình cảm gắn kết sâu sắc giữa những người bạn.',
    notes: 'Được viết vào một buổi tối mưa lất phất bên tách trà hoa cúc.',
    isFavorite: true,
    viewCount: 88,
    tags: ['Anniversary', 'Letter', 'Gift'],
    mediaUrls: [
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: Date.now() - 86400000 * 15,
    updatedAt: Date.now() - 86400000 * 15
  },
  {
    id: 'mem-3',
    title: 'Buổi hẹn hò đầu tiên tại quán cà phê sách',
    date: '2023-11-10',
    location: 'Quận 1, TP. Hồ Chí Minh',
    mood: 'Cozy',
    type: 'image',
    collectionId: 'col-1',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    content: 'Lần đầu tiên gặp gỡ sau bao ngày nhắn tin. Cả hai đều bối rối nhưng ngập tràn nụ cười. Anh gọi một ly Cappuccino, em gọi Matcha Latte. Chúng mình đã nói chuyện liên tục suốt 4 tiếng đồng hồ mà không hề hay biết thời gian trôi qua.',
    aiSummary: 'Buổi gặp gỡ đầu tiên đáng nhớ tại quán cà phê sách, mở đầu cho hành trình tình yêu đẹp đẽ.',
    notes: 'Quán Nhã Nam Book Cafe đường Nguyễn Thị Minh Khai.',
    isFavorite: false,
    viewCount: 29,
    tags: ['FirstMeet', 'Date'],
    mediaUrls: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: Date.now() - 86400000 * 60,
    updatedAt: Date.now() - 86400000 * 60
  },
  {
    id: 'mem-4',
    title: 'Thước phim kỷ niệm mùa hè Phú Quốc',
    date: '2024-07-08',
    location: 'Phú Quốc, Kiên Giang',
    mood: 'Excited',
    type: 'video',
    collectionId: 'col-3',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    content: 'Chuyến đi biển rực rỡ nắng vàng và sóng xanh. Chúng mình cùng đi lặn biển ngắm san hô, chạy xe máy quanh đảo ngọc và ghi lại những thước phim lung linh dưới ánh hoàng hôn ngập tràn sắc cam hồng.',
    aiSummary: 'Video highlight đợt nghỉ dưỡng hè Phú Quốc với các hoạt động lặn san hô, ngắm hoàng hôn biển dạt dào năng lượng.',
    notes: 'File video gộp lại dài 3 phút với giai điệu bài hát "Lover" ngọt ngào.',
    isFavorite: true,
    viewCount: 65,
    tags: ['Travel', 'Date'],
    mediaUrls: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'mem-5',
    title: 'Playlist những bài hát anh viết riêng cho em',
    date: '2024-03-08',
    location: 'Home Studio, Hà Nội',
    mood: 'Magical',
    type: 'music',
    collectionId: 'col-4',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
    content: 'Gồm 5 bản nhạc Acoustic dịu êm do chính tay thu âm mỗi tối. Mỗi giai điệu đều gửi gắm sự thư thái và năng lượng tích cực.',
    aiSummary: 'Bộ sưu tập giai điệu Acoustic piano & guitar sáng tác cá nhân trao gửi cảm xúc ấm áp nhân dịp đặc biệt.',
    notes: 'Bài hát thứ 3 "Bình Yên Của Anh" là bài em thích nhất.',
    isFavorite: false,
    viewCount: 38,
    tags: ['Gift', 'Letter'],
    mediaUrls: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80'
    ],
    createdAt: Date.now() - 86400000 * 20,
    updatedAt: Date.now() - 86400000 * 20
  },
  {
    id: 'mem-6',
    title: 'Dòng thời gian: Hành trình Gắn kết & Đồng hành',
    date: '2023-01-01',
    location: 'Sài Gòn - Hà Nội',
    mood: 'Happy',
    type: 'timeline',
    collectionId: 'col-1',
    coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80',
    content: 'Các mốc lịch sử phát triển tình cảm qua 3 năm làm bạn thân cho đến khoảnh khắc tỏ tình bất ngờ dưới đêm Giao Thừa.',
    aiSummary: 'Mốc thời gian cô đọng lại các khoảnh khắc chuyển mình từ tình bạn tri kỷ sang tình yêu đôi lứa hạnh phúc.',
    notes: 'Một chặng đường dài nhưng ngập tràn niềm vui.',
    isFavorite: true,
    viewCount: 110,
    tags: ['FirstMeet', 'Anniversary'],
    mediaUrls: [
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80'
    ],
    timelineEvents: [
      { id: 'te-10', title: 'Lần đầu gặp ở CLB', date: '2021-09-15', description: 'Cùng chung nhóm thuyết trình bài tập lớn' },
      { id: 'te-11', title: 'Chuyến đi phượt Mộc Châu', date: '2022-10-20', description: 'Chụp chung bức ảnh đầu tiên' },
      { id: 'te-12', title: 'Đêm Giao Thừa tỏ tình', date: '2022-12-31', description: 'Pháo hoa rực rỡ và câu trả lời "Em đồng ý"' }
    ],
    createdAt: Date.now() - 86400000 * 45,
    updatedAt: Date.now() - 86400000 * 45
  }
];

export class MemoryService {
  // Load memories from localStorage or initialize
  static getMemories(): IMemory[] {
    try {
      const data = localStorage.getItem(MEMORIES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load memories from localStorage', e);
    }
    // Save initial seed if empty
    MemoryService.saveMemories(INITIAL_MEMORIES);
    return INITIAL_MEMORIES;
  }

  static saveMemories(memories: IMemory[]): void {
    try {
      localStorage.setItem(MEMORIES_STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error('Failed to save memories to localStorage', e);
    }
  }

  // Load tags from localStorage or initialize
  static getTags(): ITag[] {
    try {
      const data = localStorage.getItem(TAGS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load tags from localStorage', e);
    }
    MemoryService.saveTags(DEFAULT_TAGS);
    return DEFAULT_TAGS;
  }

  static saveTags(tags: ITag[]): void {
    try {
      localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
    } catch (e) {
      console.error('Failed to save tags to localStorage', e);
    }
  }

  // Collections localStorage Management
  static getCollections(): ICollection[] {
    try {
      const data = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load collections from localStorage', e);
    }
    MemoryService.saveCollections(DEFAULT_COLLECTIONS);
    return DEFAULT_COLLECTIONS;
  }

  static saveCollections(collections: ICollection[]): void {
    try {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
    } catch (e) {
      console.error('Failed to save collections to localStorage', e);
    }
  }

  static addCollection(data: Omit<ICollection, 'id' | 'createdAt' | 'updatedAt' | 'memoryIds'>): ICollection {
    const collections = MemoryService.getCollections();
    const newCol: ICollection = {
      ...data,
      id: `col-${Date.now()}`,
      memoryIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [...collections, newCol];
    MemoryService.saveCollections(updated);
    return newCol;
  }

  static updateCollection(id: string, updates: Partial<ICollection>): ICollection | null {
    const collections = MemoryService.getCollections();
    const idx = collections.findIndex(c => c.id === id);
    if (idx === -1) return null;

    const updatedCol = {
      ...collections[idx],
      ...updates,
      updatedAt: Date.now()
    };
    collections[idx] = updatedCol;
    MemoryService.saveCollections(collections);
    return updatedCol;
  }

  static deleteCollection(id: string): void {
    const collections = MemoryService.getCollections();
    const updated = collections.filter(c => c.id !== id);
    MemoryService.saveCollections(updated);

    // Clear collectionId reference from memories
    const memories = MemoryService.getMemories();
    const updatedMemories = memories.map(m => m.collectionId === id ? { ...m, collectionId: undefined } : m);
    MemoryService.saveMemories(updatedMemories);
  }

  static assignMemoryToCollection(memoryId: string, collectionId: string | undefined): void {
    const memories = MemoryService.getMemories();
    const collections = MemoryService.getCollections();

    // Remove memoryId from old collection memoryIds arrays
    const updatedCollections = collections.map(col => ({
      ...col,
      memoryIds: col.id === collectionId
        ? Array.from(new Set([...col.memoryIds, memoryId]))
        : col.memoryIds.filter(id => id !== memoryId)
    }));
    MemoryService.saveCollections(updatedCollections);

    // Update memory
    const memoryIdx = memories.findIndex(m => m.id === memoryId);
    if (memoryIdx !== -1) {
      memories[memoryIdx].collectionId = collectionId;
      memories[memoryIdx].updatedAt = Date.now();
      MemoryService.saveMemories(memories);
    }
  }

  // Bulk Operations
  static bulkDeleteMemories(ids: string[]): void {
    const memories = MemoryService.getMemories();
    const filtered = memories.filter(m => !ids.includes(m.id));
    MemoryService.saveMemories(filtered);

    // Also remove from collections
    const collections = MemoryService.getCollections();
    const updatedCollections = collections.map(col => ({
      ...col,
      memoryIds: col.memoryIds.filter(id => !ids.includes(id))
    }));
    MemoryService.saveCollections(updatedCollections);
  }

  static bulkToggleFavorite(ids: string[], isFavorite: boolean): void {
    const memories = MemoryService.getMemories();
    const updated = memories.map(m => ids.includes(m.id) ? { ...m, isFavorite, updatedAt: Date.now() } : m);
    MemoryService.saveMemories(updated);
  }

  static bulkMoveToCollection(memoryIds: string[], collectionId: string): void {
    memoryIds.forEach(id => {
      MemoryService.assignMemoryToCollection(id, collectionId);
    });
  }

  static bulkAddTag(memoryIds: string[], tagName: string): void {
    const memories = MemoryService.getMemories();
    const updated = memories.map(m => {
      if (memoryIds.includes(m.id)) {
        const newTags = Array.from(new Set([...m.tags, tagName]));
        return { ...m, tags: newTags, updatedAt: Date.now() };
      }
      return m;
    });
    MemoryService.saveMemories(updated);
  }

  static exportMemoriesAsBatch(memories: IMemory[]): void {
    let content = `========================================\nLOVE NOTE 4.0 — BATCH EXPORT (${memories.length} KỶ NIỆM)\n========================================\n\n`;

    memories.forEach((m, idx) => {
      content += `[${idx + 1}] ${m.title}\n`;
      content += `Thời gian: ${m.date} | Địa điểm: ${m.location} | Cảm xúc: ${m.mood}\n`;
      content += `Loại: ${m.type} | Thẻ: ${m.tags.join(', ')}\n`;
      content += `Nội dung: ${m.content}\n`;
      if (m.aiSummary) content += `AI Summary: ${m.aiSummary}\n`;
      content += `----------------------------------------\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `love-note-batch-memories-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Related Memories Calculation
  static getRelatedMemories(currentMemory: IMemory, allMemories: IMemory[], limit = 4): IMemory[] {
    const others = allMemories.filter(m => m.id !== currentMemory.id);

    // Score based on similarity
    const scored = others.map(m => {
      let score = 0;

      // Same Date year/month match
      if (m.date.substring(0, 7) === currentMemory.date.substring(0, 7)) score += 3;

      // Same Location match
      if (m.location && currentMemory.location &&
         (m.location.toLowerCase().includes(currentMemory.location.toLowerCase()) ||
          currentMemory.location.toLowerCase().includes(m.location.toLowerCase()))) {
        score += 4;
      }

      // Same Mood
      if (m.mood === currentMemory.mood) score += 2;

      // Same Collection
      if (m.collectionId && currentMemory.collectionId && m.collectionId === currentMemory.collectionId) score += 3;

      // Overlapping tags
      const commonTags = m.tags.filter(t => currentMemory.tags.includes(t));
      score += commonTags.length * 2;

      return { memory: m, score };
    });

    // Sort descending by score and pick top limit
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.memory);
  }

  // CRUD Operations
  static addMemory(memory: Omit<IMemory, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): IMemory {
    const memories = MemoryService.getMemories();
    const newMemory: IMemory = {
      ...memory,
      id: `mem-${Date.now()}`,
      viewCount: 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [newMemory, ...memories];
    MemoryService.saveMemories(updated);

    if (memory.collectionId) {
      MemoryService.assignMemoryToCollection(newMemory.id, memory.collectionId);
    }
    return newMemory;
  }

  static updateMemory(id: string, updates: Partial<IMemory>): IMemory | null {
    const memories = MemoryService.getMemories();
    const index = memories.findIndex(m => m.id === id);
    if (index === -1) return null;

    const updatedMemory = {
      ...memories[index],
      ...updates,
      updatedAt: Date.now()
    };
    memories[index] = updatedMemory;
    MemoryService.saveMemories(memories);

    if (updates.collectionId !== undefined) {
      MemoryService.assignMemoryToCollection(id, updates.collectionId);
    }

    return updatedMemory;
  }

  static deleteMemory(id: string): boolean {
    const memories = MemoryService.getMemories();
    const filtered = memories.filter(m => m.id !== id);
    if (filtered.length === memories.length) return false;
    MemoryService.saveMemories(filtered);

    // Remove from collections
    const collections = MemoryService.getCollections();
    const updatedCollections = collections.map(col => ({
      ...col,
      memoryIds: col.memoryIds.filter(mId => mId !== id)
    }));
    MemoryService.saveCollections(updatedCollections);

    return true;
  }

  static toggleFavorite(id: string): IMemory | null {
    const memories = MemoryService.getMemories();
    const memory = memories.find(m => m.id === id);
    if (!memory) return null;
    return MemoryService.updateMemory(id, { isFavorite: !memory.isFavorite });
  }

  static incrementViewCount(id: string): void {
    const memories = MemoryService.getMemories();
    const memory = memories.find(m => m.id === id);
    if (memory) {
      MemoryService.updateMemory(id, { viewCount: (memory.viewCount || 0) + 1 });
    }
  }

  static duplicateMemory(id: string): IMemory | null {
    const memories = MemoryService.getMemories();
    const memory = memories.find(m => m.id === id);
    if (!memory) return null;

    const duplicated: Omit<IMemory, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'> = {
      ...memory,
      title: `${memory.title} (Bản sao)`,
      isFavorite: false
    };
    return MemoryService.addMemory(duplicated);
  }

  // Filter & Search Logic
  static filterAndSortMemories(
    memories: IMemory[],
    options: MemoryFilterOptions,
    sortBy: MemorySortOption
  ): IMemory[] {
    let result = [...memories];

    // Search query check (title, content, location, mood, tags)
    if (options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(m => 
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.mood.toLowerCase().includes(q) ||
        (m.aiSummary && m.aiSummary.toLowerCase().includes(q)) ||
        (m.notes && m.notes.toLowerCase().includes(q)) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Type filter
    if (options.type === 'favorites') {
      result = result.filter(m => m.isFavorite);
    } else if (options.type !== 'all') {
      result = result.filter(m => m.type === options.type);
    }

    // Category filter
    if (options.category && options.category !== 'all') {
      result = result.filter(m => {
        const cat = m.category || resolveMemoryCategory(m);
        return cat === options.category;
      });
    }

    // Mood filter
    if (options.mood && options.mood !== 'all') {
      result = result.filter(m => m.mood === options.mood);
    }

    // Tag filter
    if (options.tag && options.tag !== 'all') {
      result = result.filter(m => m.tags.includes(options.tag!));
    }

    // Multiple tags selection
    if (options.selectedTags && options.selectedTags.length > 0) {
      result = result.filter(m => options.selectedTags!.every(t => m.tags.includes(t)));
    }

    // Collection filter
    if (options.collectionId && options.collectionId !== 'all') {
      result = result.filter(m => m.collectionId === options.collectionId);
    }

    // Date Range filter
    if (options.startDate) {
      result = result.filter(m => m.date >= options.startDate!);
    }
    if (options.endDate) {
      result = result.filter(m => m.date <= options.endDate!);
    }

    // Location query filter
    if (options.locationQuery && options.locationQuery.trim()) {
      const locQ = options.locationQuery.toLowerCase().trim();
      result = result.filter(m => m.location.toLowerCase().includes(locQ));
    }

    // Year filter
    if (options.year && options.year !== 'all') {
      result = result.filter(m => m.date.startsWith(options.year!));
    }

    // Month filter
    if (options.month && options.month !== 'all') {
      result = result.filter(m => {
        const monthNum = m.date.split('-')[1];
        return monthNum === options.month || parseInt(monthNum, 10) === parseInt(options.month!, 10);
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'a-z':
          return a.title.localeCompare(b.title, 'vi');
        case 'most-viewed':
          return (b.viewCount || 0) - (a.viewCount || 0);
        case 'recently-edited':
          return b.updatedAt - a.updatedAt;
        default:
          return 0;
      }
    });

    return result;
  }

  // Tag Operations
  static addTag(name: string, color: string): ITag {
    const tags = MemoryService.getTags();
    const newTag: ITag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color
    };
    const updated = [...tags, newTag];
    MemoryService.saveTags(updated);
    return newTag;
  }

  static updateTag(id: string, name: string, color: string): ITag | null {
    const tags = MemoryService.getTags();
    const index = tags.findIndex(t => t.id === id);
    if (index === -1) return null;

    const oldName = tags[index].name;
    const updatedTag = { ...tags[index], name: name.trim(), color };
    tags[index] = updatedTag;
    MemoryService.saveTags(tags);

    // If name changed, update memories tag list references
    if (oldName !== name.trim()) {
      const memories = MemoryService.getMemories();
      const updatedMemories = memories.map(m => ({
        ...m,
        tags: m.tags.map(t => (t === oldName ? name.trim() : t))
      }));
      MemoryService.saveMemories(updatedMemories);
    }

    return updatedTag;
  }

  static deleteTag(id: string): void {
    const tags = MemoryService.getTags();
    const tagToDelete = tags.find(t => t.id === id);
    if (!tagToDelete) return;

    const filtered = tags.filter(t => t.id !== id);
    MemoryService.saveTags(filtered);

    // Remove tag reference from memories
    const memories = MemoryService.getMemories();
    const updatedMemories = memories.map(m => ({
      ...m,
      tags: m.tags.filter(t => t !== tagToDelete.name)
    }));
    MemoryService.saveMemories(updatedMemories);
  }

  static mergeTags(sourceTagId: string, targetTagId: string): void {
    const tags = MemoryService.getTags();
    const sourceTag = tags.find(t => t.id === sourceTagId);
    const targetTag = tags.find(t => t.id === targetTagId);

    if (!sourceTag || !targetTag) return;

    // Remove source tag
    MemoryService.deleteTag(sourceTagId);

    // Update memories: replace sourceTag.name with targetTag.name (avoid duplicates)
    const memories = MemoryService.getMemories();
    const updatedMemories = memories.map(m => {
      if (m.tags.includes(sourceTag.name)) {
        const newTags = m.tags.filter(t => t !== sourceTag.name);
        if (!newTags.includes(targetTag.name)) {
          newTags.push(targetTag.name);
        }
        return { ...m, tags: newTags };
      }
      return m;
    });
    MemoryService.saveMemories(updatedMemories);
  }

  // Extended Calculate statistics
  static calculateStats(memories: IMemory[]): MemoryStats {
    let letters = 0;
    let photos = 0;
    let videos = 0;
    let music = 0;
    let timelineEvents = 0;
    let favorites = 0;

    const moodCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    const monthCounts: Record<string, number> = {};

    let earliestDate: Date | null = null;

    memories.forEach(m => {
      if (m.type === 'letter') letters++;
      if (m.type === 'image') photos++;
      if (m.type === 'video') videos++;
      if (m.type === 'music') music++;
      if (m.type === 'timeline') timelineEvents++;
      if (m.isFavorite) favorites++;

      if (m.timelineEvents) {
        timelineEvents += m.timelineEvents.length;
      }

      // Mood frequency
      if (m.mood) {
        moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
      }

      // Location frequency
      if (m.location) {
        const city = m.location.split(',')[0].trim();
        locationCounts[city] = (locationCounts[city] || 0) + 1;
      }

      // Tags frequency
      m.tags.forEach(t => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });

      // Month frequency
      if (m.date) {
        const monthKey = m.date.substring(0, 7); // YYYY-MM
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;

        const d = new Date(m.date);
        if (!earliestDate || d < earliestDate) {
          earliestDate = d;
        }
      }
    });

    // Calculate relationship days (from earliest memory date to today)
    let relationshipDays = 0;
    if (earliestDate) {
      const diffMs = Date.now() - (earliestDate as Date).getTime();
      relationshipDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    } else {
      relationshipDays = 365; // Default fallback
    }

    // Most active month
    let mostActiveMonth = 'Tháng 02/2024';
    let maxMonthCount = 0;
    Object.entries(monthCounts).forEach(([m, count]) => {
      if (count > maxMonthCount) {
        maxMonthCount = count;
        const [y, mNum] = m.split('-');
        mostActiveMonth = `T${mNum}/${y}`;
      }
    });

    // Favorite location
    let favoriteLocation = 'Đà Lạt';
    let maxLocCount = 0;
    Object.entries(locationCounts).forEach(([loc, count]) => {
      if (count > maxLocCount) {
        maxLocCount = count;
        favoriteLocation = loc;
      }
    });

    // Favorite mood
    let favoriteMood = 'Romantic';
    let maxMoodCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxMoodCount) {
        maxMoodCount = count;
        favoriteMood = mood;
      }
    });

    // Top tag
    let topTag = 'Travel';
    let maxTagCount = 0;
    Object.entries(tagCounts).forEach(([tag, count]) => {
      if (count > maxTagCount) {
        maxTagCount = count;
        topTag = tag;
      }
    });

    // Longest streak in months with memories
    const activeMonths = Object.keys(monthCounts).sort();
    let longestStreakMonths = activeMonths.length > 0 ? activeMonths.length : 1;

    return {
      total: memories.length,
      letters,
      photos,
      videos,
      music,
      timelineEvents,
      favorites,
      relationshipDays,
      longestStreakMonths,
      mostActiveMonth,
      favoriteLocation,
      favoriteMood,
      topTag
    };
  }

  // Export Memory to text file or print preview
  static exportMemoryAsText(memory: IMemory): void {
    const contentText = `
========================================
LOVE NOTE 4.0 — MEMORY EXPORT
========================================
Tiêu đề: ${memory.title}
Ngày: ${memory.date}
Địa điểm: ${memory.location}
Cảm xúc: ${memory.mood}
Loại kỷ niệm: ${memory.type}
Lượt xem: ${memory.viewCount}
Thẻ: ${memory.tags.join(', ')}

--- LỜI NHẮN / NỘI DUNG ---
${memory.content}

${memory.aiSummary ? `--- TÓM TẮT AI ---\n${memory.aiSummary}\n` : ''}
${memory.notes ? `--- GHI CHÚ CÁ NHÂN ---\n${memory.notes}\n` : ''}

Tạo vào ngày: ${new Date(memory.createdAt).toLocaleString('vi-VN')}
========================================
    `.trim();

    const blob = new Blob([contentText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `love-note-ky-niem-${memory.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
