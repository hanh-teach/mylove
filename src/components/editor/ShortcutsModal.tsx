import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + C / Cmd + C', desc: 'Sao chép layer' },
    { key: 'Ctrl + V / Cmd + V', desc: 'Dán layer từ clipboard' },
    { key: 'Ctrl + D / Cmd + D', desc: 'Nhân bản layer' },
    { key: 'Delete / Backspace', desc: 'Xóa layer được chọn' },
    { key: 'Shift + Click', desc: 'Chọn nhiều layer cùng lúc' },
    { key: 'Double Click', desc: 'Sửa văn bản trực tiếp trên Canvas' },
    { key: 'Ctrl + G / Cmd + G', desc: 'Gộp nhóm các layer (Group)' },
    { key: 'Ctrl + Shift + G', desc: 'Rã nhóm layer (Ungroup)' },
    { key: 'Space + Drag', desc: 'Di chuyển (Pan) Canvas' },
    { key: 'Ctrl + Cuộn chuột', desc: 'Phóng to / Thu nhỏ Canvas' },
    { key: 'Phím mũi tên (← ↑ → ↓)', desc: 'Di chuyển layer 1px (Shift + phím: 10px)' },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 max-w-md w-full p-6 text-xs text-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-rose-100">
          <div className="flex items-center gap-2 font-bold text-base text-slate-900">
            <Keyboard size={20} className="text-rose-600" />
            <span>Phím Tắt Studio 4.0</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-rose-200 transition-colors"
            >
              <span className="text-slate-700 font-medium">{s.desc}</span>
              <kbd className="bg-white border border-slate-300 shadow-2xs text-slate-900 px-2 py-0.5 rounded-lg font-mono text-[11px] font-semibold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-md transition-all"
          >
            Đã hiểu, tiếp tục thiết kế
          </button>
        </div>
      </div>
    </div>
  );
};
