import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Smile, Sticker, Sparkles, Heart } from 'lucide-react';

interface EmojiStickerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (sticker: string) => void;
  initialTab?: 'emojis' | 'stickers';
}

const STICKER_CATEGORIES = [
  {
    title: '❤️ Tình Yêu & Kỷ Niệm',
    items: [
      '❤️ Kỷ niệm',
      '💌 Love Note',
      '🌸 Mùa yêu',
      '✨ Tỏa sáng',
      '🎂 Ngày đặc biệt',
      '💍 Đính hôn',
      '💒 Ngày chung đôi',
      '🥂 Kỷ niệm vàng'
    ]
  },
  {
    title: '💐 Tri Ân & Tôn Vinh',
    items: [
      '💐 Tri ân Thầy Cô',
      '🎓 Kỷ niệm mái trường',
      '🌟 Sáng mãi tri thức',
      '📖 Nét chữ nết người',
      '🌸 Tri ân sâu sắc',
      '🕊️ Bến đỗ tri thức'
    ]
  },
  {
    title: '💖 Cảm Xúc & Lời Chúc',
    items: [
      '💖 Mãi bên nhau',
      '🌹 Trân trọng cảm ơn',
      '🧸 Trọn vẹn yêu thương',
      '🎉 Chúc mừng hạnh phúc',
      '✨ Khoảnh khắc ngọt ngào',
      '👑 Trân quý vô ngần'
    ]
  }
];

const EMOJI_CATEGORIES = [
  {
    title: '💖 Trái Tim & Tình Yêu',
    items: ['💖', '🥰', '🌹', '💘', '💌', '🌸', '🎁', '💍', '🎀', '🕯️', '🧸', '🍾', '🥂', '🦋', '✨', '👑', '💎', '💐', '🥳', '💗', '💒', '🦄', '🌟', '🎈', '🕊️']
  },
  {
    title: '😊 Cảm Xúc & Nụ Cười',
    items: ['🥰', '😍', '😘', '🤩', '🥳', '🥺', '😊', '🤗', '💖', '✨', '🔥', '💫', '🎉', '🎊', '❤️', '💕', '💞', '💓', '💗']
  },
  {
    title: '🌺 Hoa, Quà & Lễ Hội',
    items: ['🌹', '🌸', '🌺', '🌻', '🌷', '💐', '🌾', '🎁', '🎂', '🍰', '🧁', '🎈', '🎉', '🥂', '🍾', '🕯️', '💌', '🧸', '🎀', '👑']
  }
];

export const EmojiStickerPickerModal: React.FC<EmojiStickerPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
  onSelectSticker,
  initialTab = 'stickers'
}) => {
  const [activeTab, setActiveTab] = useState<'emojis' | 'stickers'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-md sm:max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-rose-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[75vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              <h3 className="font-bold text-sm sm:text-base">Bộ Chọn Emoji & Sticker Trang Trí</h3>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs & Search */}
          <div className="p-3 border-b border-rose-100 dark:border-slate-800 bg-rose-50/40 dark:bg-slate-800/40 shrink-0 flex flex-col gap-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('stickers')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'stickers'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-100/50 border border-rose-200/80 dark:border-slate-700'
                }`}
              >
                <Sticker size={15} />
                <span>Thẻ Sticker Tag ({STICKER_CATEGORIES.reduce((acc, c) => acc + c.items.length, 0)})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('emojis')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'emojis'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-rose-100/50 border border-rose-200/80 dark:border-slate-700'
                }`}
              >
                <Smile size={15} />
                <span>Emoji Biểu Cảm</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'stickers'
                    ? "Tìm Sticker (kỷ niệm, love note, đính hôn...)..."
                    : "Tìm Emoji (tim, hoa, quà, bánh...)..."
                }
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-rose-200/90 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100 shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
            {activeTab === 'stickers' && (
              <div className="space-y-3.5">
                {STICKER_CATEGORIES.map((category, catIdx) => {
                  const filteredItems = category.items.filter(item =>
                    !searchQuery || item.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={catIdx} className="space-y-2">
                      <h4 className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                        <Heart size={14} className="text-rose-500 fill-rose-500" />
                        {category.title}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {filteredItems.map((stickerText, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => {
                              onSelectSticker(stickerText);
                              onClose();
                            }}
                            className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-slate-800 dark:to-slate-800/90 hover:from-rose-100 hover:to-pink-100 border border-rose-200/80 dark:border-slate-700 text-rose-900 dark:text-rose-200 font-semibold px-3 py-1.5 rounded-xl shadow-2xs hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm flex items-center gap-1 cursor-pointer"
                          >
                            <span>{stickerText}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'emojis' && (
              <div className="space-y-3.5">
                {EMOJI_CATEGORIES.map((category, catIdx) => {
                  const filteredItems = category.items.filter(emoji =>
                    !searchQuery || emoji.includes(searchQuery)
                  );
                  if (filteredItems.length === 0) return null;

                  return (
                    <div key={catIdx} className="space-y-2">
                      <h4 className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                        {category.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {filteredItems.map((emojiChar, eIdx) => (
                          <button
                            key={eIdx}
                            onClick={() => {
                              onSelectEmoji(emojiChar);
                              onClose();
                            }}
                            className="w-10 h-10 sm:w-11 sm:h-11 text-2xl rounded-xl bg-white dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 border border-rose-100 dark:border-slate-700 flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-2xs cursor-pointer"
                            title={`Chèn ${emojiChar}`}
                          >
                            {emojiChar}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-rose-100 dark:border-slate-800 shrink-0 flex items-center justify-between text-xs text-slate-500">
            <span>Chạm để chèn vào nội dung</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 cursor-pointer text-xs"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
