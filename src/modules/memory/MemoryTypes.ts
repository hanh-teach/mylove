export type MemoryType = 'image' | 'letter' | 'video' | 'music' | 'timeline';

export type MoodType = 'Happy' | 'Romantic' | 'Excited' | 'Gentle' | 'Magical' | 'Cozy';

export type MemoryViewMode = 'grid' | 'list' | 'album' | 'timeline' | 'map';

export type TimelineCategory = 'Love' | 'Birthday' | 'Travel' | 'Wedding' | 'Photo' | 'Letter' | 'Music' | 'Video' | 'Graduation' | 'Family' | 'Friend' | 'Teacher' | 'Holiday' | 'Achievement' | 'Journal' | 'Custom';

export type TimelineViewMode = 'vertical' | 'horizontal' | 'compact' | 'calendar';

export interface ITimelineCategoryConfig {
  id: TimelineCategory;
  label: string;
  icon: string; // Emoji e.g. '❤️'
  lucideIconName: string;
  color: string; // Hex color string
  badgeBg: string; // Tailwind bg class
  badgeText: string; // Tailwind text class
  badgeBorder: string; // Tailwind border class
}

export const TIMELINE_CATEGORIES: Record<TimelineCategory, ITimelineCategoryConfig> = {
  Love: {
    id: 'Love',
    label: 'Love',
    icon: '❤️',
    lucideIconName: 'Heart',
    color: '#f43f5e',
    badgeBg: 'bg-rose-50 text-rose-700',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200'
  },
  Birthday: {
    id: 'Birthday',
    label: 'Birthday',
    icon: '🎂',
    lucideIconName: 'Cake',
    color: '#f59e0b',
    badgeBg: 'bg-amber-50 text-amber-700',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200'
  },
  Travel: {
    id: 'Travel',
    label: 'Travel',
    icon: '✈️',
    lucideIconName: 'Plane',
    color: '#3b82f6',
    badgeBg: 'bg-blue-50 text-blue-700',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200'
  },
  Wedding: {
    id: 'Wedding',
    label: 'Wedding',
    icon: '💍',
    lucideIconName: 'Sparkles',
    color: '#ec4899',
    badgeBg: 'bg-pink-50 text-pink-700',
    badgeText: 'text-pink-700',
    badgeBorder: 'border-pink-200'
  },
  Photo: {
    id: 'Photo',
    label: 'Photo',
    icon: '📸',
    lucideIconName: 'Camera',
    color: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200'
  },
  Letter: {
    id: 'Letter',
    label: 'Letter',
    icon: '💌',
    lucideIconName: 'Mail',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200'
  },
  Music: {
    id: 'Music',
    label: 'Music',
    icon: '🎵',
    lucideIconName: 'Music',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-50 text-cyan-700',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200'
  },
  Video: {
    id: 'Video',
    label: 'Video',
    icon: '🎬',
    lucideIconName: 'Video',
    color: '#ef4444',
    badgeBg: 'bg-red-50 text-red-700',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200'
  },
  Graduation: {
    id: 'Graduation',
    label: 'Tốt nghiệp',
    icon: '🎓',
    lucideIconName: 'GraduationCap',
    color: '#6366f1',
    badgeBg: 'bg-indigo-50 text-indigo-700',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200'
  },
  Family: {
    id: 'Family',
    label: 'Gia đình',
    icon: '👨‍👩‍👧‍👦',
    lucideIconName: 'Users',
    color: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200'
  },
  Friend: {
    id: 'Friend',
    label: 'Bạn bè',
    icon: '👥',
    lucideIconName: 'UserCheck',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-50 text-cyan-700',
    badgeText: 'text-cyan-700',
    badgeBorder: 'border-cyan-200'
  },
  Teacher: {
    id: 'Teacher',
    label: 'Thầy cô',
    icon: '👨‍🏫',
    lucideIconName: 'BookOpen',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200'
  },
  Holiday: {
    id: 'Holiday',
    label: 'Lễ hội',
    icon: '🎉',
    lucideIconName: 'PartyPopper',
    color: '#f59e0b',
    badgeBg: 'bg-amber-50 text-amber-700',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200'
  },
  Achievement: {
    id: 'Achievement',
    label: 'Thành tựu',
    icon: '🏆',
    lucideIconName: 'Trophy',
    color: '#eab308',
    badgeBg: 'bg-yellow-50 text-yellow-700',
    badgeText: 'text-yellow-700',
    badgeBorder: 'border-yellow-200'
  },
  Journal: {
    id: 'Journal',
    label: 'Nhật ký',
    icon: '📖',
    lucideIconName: 'Book',
    color: '#3b82f6',
    badgeBg: 'bg-blue-50 text-blue-700',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200'
  },
  Custom: {
    id: 'Custom',
    label: 'Tùy chọn',
    icon: '⚙️',
    lucideIconName: 'Settings',
    color: '#64748b',
    badgeBg: 'bg-slate-50 text-slate-700',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200'
  }
};

export interface ITag {
  id: string;
  name: string;
  color: string; // HEX or Tailwind color class
}

export interface ICollection {
  id: string;
  name: string;
  icon: string; // e.g., '❤️', '🌸', '✈️', '🎂', '💌'
  color: string; // HEX string
  description?: string;
  memoryIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface ITimelineEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  icon?: string;
  category?: TimelineCategory;
}

export interface IMemory {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  mood: MoodType;
  type: MemoryType;
  category?: TimelineCategory;
  coverImage?: string;
  content: string; // Full story or love letter
  aiSummary?: string;
  notes?: string;
  isFavorite: boolean;
  viewCount: number;
  tags: string[]; // Tag IDs or tag names
  collectionId?: string;
  mediaUrls?: string[];
  timelineEvents?: ITimelineEvent[];
  createdAt: number;
  updatedAt: number;
}

export type MemorySortOption = 'newest' | 'oldest' | 'a-z' | 'most-viewed' | 'recently-edited';

export interface MemoryFilterOptions {
  searchQuery: string;
  type: 'all' | 'favorites' | MemoryType;
  mood?: MoodType | 'all';
  category?: TimelineCategory | 'all';
  year?: string | 'all';
  month?: string | 'all';
  tag?: string | 'all';
  collectionId?: string | 'all';
  startDate?: string;
  endDate?: string;
  locationQuery?: string;
  selectedTags?: string[];
}

export interface MemoryStats {
  total: number;
  letters: number;
  photos: number;
  videos: number;
  music: number;
  timelineEvents: number;
  favorites: number;
  // Extended stats for Sprint M-02 & T-01
  relationshipDays?: number; // Days together
  relationshipYears?: string; // Years together (e.g., '2 năm 3 tháng')
  longestStreakMonths?: number;
  mostActiveMonth?: string;
  favoriteLocation?: string;
  favoriteMood?: MoodType | string;
  topTag?: string;
  eventsThisYear?: number;
}

