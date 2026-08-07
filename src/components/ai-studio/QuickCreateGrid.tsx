import React from 'react';
import { AICreativeType } from './types';
import { Heart, Image, Film, Music, BookOpen, Mail, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface QuickCreateGridProps {
  onSelectType: (type: AICreativeType) => void;
}

interface QuickTile {
  type: AICreativeType;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}

export const QUICK_TILES: QuickTile[] = [
  {
    type: 'love_letter',
    title: 'AI Letter & Card',
    description: 'Thư tri ân, thiệp mừng & lời chúc ý nghĩa',
    icon: <Sparkles size={22} className="fill-white" />,
    bgGradient: 'from-rose-500 to-pink-600',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700'
  },
  {
    type: 'romantic_image',
    title: 'Visual Artwork',
    description: 'Tạo hình ảnh & tranh minh họa nghệ thuật',
    icon: <Image size={22} />,
    bgGradient: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  {
    type: 'memory_video',
    title: 'Story Video',
    description: 'Tạo kịch bản video & câu chuyện',
    icon: <Film size={22} />,
    bgGradient: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700'
  },
  {
    type: 'playlist',
    title: 'Music & Audio',
    description: 'Giai điệu & âm thanh chủ đề',
    icon: <Music size={22} />,
    bgGradient: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700'
  },
  {
    type: 'story',
    title: 'Creative Narrative',
    description: 'Truyện ngắn & bài viết cảm hứng',
    icon: <BookOpen size={22} />,
    bgGradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700'
  },
  {
    type: 'anniversary_card',
    title: 'Greeting Card',
    description: 'Thiệp chúc mừng sự kiện & cột mốc',
    icon: <Mail size={22} />,
    bgGradient: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-200',
    textColor: 'text-pink-700'
  },
  {
    type: 'relationship_advice',
    title: 'Ideas & Communication',
    description: 'Gợi ý ý tưởng sáng tạo & kết nối',
    icon: <Users size={22} />,
    bgGradient: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  }
];

export const QuickCreateGrid: React.FC<QuickCreateGridProps> = ({ onSelectType }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={14} className="text-rose-500" />
          Tạo nhanh nội dung AI (Quick Create)
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">Click chọn mẫu khởi tạo</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {QUICK_TILES.map((tile) => (
          <motion.div
            key={tile.type}
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectType(tile.type)}
            className={`p-3 rounded-2xl bg-white border ${tile.borderColor} shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group h-full`}
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tile.bgGradient} text-white flex items-center justify-center shadow-xs mb-2 group-hover:rotate-6 transition-transform`}>
              {tile.icon}
            </div>
            <div>
              <h4 className={`text-xs font-black ${tile.textColor} group-hover:underline leading-tight mb-0.5`}>
                {tile.title}
              </h4>
              <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                {tile.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
