import React, { useState } from 'react';
import { Tag, Edit3, Check, X, Sparkles, Heart, Gift, Users, Award, Smile } from 'lucide-react';
import { Button } from '../ui/Button';

interface CustomCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentCategory: string;
  currentSender: string;
  currentReceiver: string;
  onSave: (data: { title: string; category: string; sender: string; receiver: string }) => void;
}

export const CustomCategoryModal: React.FC<CustomCategoryModalProps> = ({
  isOpen,
  onClose,
  currentTitle,
  currentCategory,
  currentSender,
  currentReceiver,
  onSave
}) => {
  const [title, setTitle] = useState(currentTitle || 'Ghi Nhớ Khoảnh Khắc');
  const [category, setCategory] = useState(currentCategory || 'Thiệp Kỷ Niệm');
  const [sender, setSender] = useState(currentSender || 'Người Gửi');
  const [receiver, setReceiver] = useState(currentReceiver || 'Thân Gửi');

  if (!isOpen) return null;

  const presetCategories = [
    { label: '🎂 Chúc Mừng Sinh Nhật', value: 'Thiệp Sinh Nhật' },
    { label: '💍 Kỷ Niệm Dấu Mốc', value: 'Kỷ Niệm Dấu Mốc' },
    { label: '💐 Tri Ân Thầy Cô', value: 'Tri Ân Thầy Cô' },
    { label: '🌸 Chúc Mừng Lễ / Tết', value: 'Thiệp Chúc Mừng' },
    { label: '🙏 Lời Cảm Ơn Trân Trọng', value: 'Thiệp Tri Ân' },
    { label: '💌 Thông Điệp Trân Quý', value: 'Thiệp Ghi Nhớ' },
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, category, sender, receiver });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <Tag size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tùy Chỉnh Tên Chủ Đề & Danh Xưng Thiệp
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chỉnh sửa danh xưng và chủ đề linh hoạt cho mọi dịp kỷ niệm.
            </p>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Preset Category Quick Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Gợi ý Chủ đề Phổ biến:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presetCategories.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCategory(item.value)}
                  className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all ${
                    category === item.value
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Category Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tên Dịp / Nhãn Thiệp (Category Label):
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ví dụ: Kỷ niệm 5 năm, Thiệp Tri Ân..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          {/* Card Main Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tiêu đề chính của Thiệp:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề hiển thị trên bìa thiệp..."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none font-bold"
            />
          </div>

          {/* Sender & Receiver */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Danh xưng Người Gửi:
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Anh / Tập thể Lớp / Con..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Danh xưng Người Nhận:
              </label>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Em / Thầy Cô / Mẹ Yêu..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outlined"
              onClick={onClose}
              className="text-xs py-2 px-4 rounded-xl border-slate-300"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="bg-pink-600 hover:bg-pink-700 text-white text-xs py-2 px-5 rounded-xl font-bold flex items-center gap-1.5"
            >
              <Check size={16} />
              <span>Lưu Tùy Chỉnh</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
