import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Type, 
  Image as ImageIcon, 
  Square, 
  Smile, 
  Gift, 
  Cake, 
  Users, 
  Flower2, 
  Star,
  Search,
  Plus,
  FolderOpen
} from 'lucide-react';
import { AssetPickerModal } from '../asset/AssetPickerModal';
import { ProjectAsset } from '../../modules/asset/AssetModel';

interface AssetBrowserProps {
  onAddText: (textPreset: string) => void;
  onAddDecor: (decorType: string) => void;
  onAddShape: (shapeType: string) => void;
  onUploadImage?: () => void;
  onInsertProjectAsset?: (asset: ProjectAsset) => void;
}

const STICKER_ITEMS = [
  { id: 'Heart', name: 'Trái tim', icon: Heart, color: '#f43f5e' },
  { id: 'Star', name: 'Ngôi sao', icon: Star, color: '#eab308' },
  { id: 'Sparkles', name: 'Lấp lánh', icon: Sparkles, color: '#ec4899' },
  { id: 'Smile', name: 'Mặt cười', icon: Smile, color: '#f59e0b' },
  { id: 'Gift', name: 'Hộp quà', icon: Gift, color: '#10b981' },
  { id: 'Cake', name: 'Bánh kem', icon: Cake, color: '#8b5cf6' },
  { id: 'Users', name: 'Cặp đôi', icon: Users, color: '#06b6d4' },
  { id: 'Flower2', name: 'Bông hoa', icon: Flower2, color: '#f43f5e' },
];

const TEXT_PRESETS = [
  { id: 'title', label: 'Tiêu đề lớn', font: 'playfair', text: 'Love Note 2026', size: '2xl' },
  { id: 'sub', label: 'Phụ đề ngọt ngào', font: 'dancing', text: 'Forever & Always', size: 'xl' },
  { id: 'quote', label: 'Lời nhắn gửi', font: 'caveat', text: 'Gửi người tôi yêu nhất...', size: 'lg' },
  { id: 'date', label: 'Ngày kỷ niệm', font: 'nunito', text: '21.07.2026', size: 'sm' },
];

const SHAPE_PRESETS = [
  { id: 'card', label: 'Khung ảnh', type: 'frame', color: '#fdf2f8' },
  { id: 'rect', label: 'Hình chữ nhật', type: 'rectangle', color: '#ffe4e6' },
  { id: 'badge', label: 'Huy hiệu tim', type: 'badge', color: '#fce7f3' },
];

export const AssetBrowser: React.FC<AssetBrowserProps> = ({
  onAddText,
  onAddDecor,
  onAddShape,
  onUploadImage,
  onInsertProjectAsset,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'stickers' | 'shapes'>('stickers');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleDragStart = (e: React.DragEvent, assetData: any) => {
    e.dataTransfer.setData('application/json', JSON.stringify(assetData));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 flex flex-col h-full select-none overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3 border-b border-rose-100/80 bg-rose-50/40 space-y-2">
        <div className="flex items-center justify-between font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-rose-600" />
            <span>Thư viện Assets</span>
          </div>
          <span className="text-[10px] text-rose-500 bg-rose-100/80 px-2 py-0.5 rounded-full font-medium">
            Kéo thả vào Canvas
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-0.5 rounded-xl text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'stickers' ? 'bg-white text-rose-600 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <Heart size={13} />
            <span>Sticker</span>
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'text' ? 'bg-white text-rose-600 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <Type size={13} />
            <span>Chữ mẫu</span>
          </button>
          <button
            onClick={() => setActiveTab('shapes')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'shapes' ? 'bg-white text-rose-600 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            <Square size={13} />
            <span>Khung</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2.5 border-b border-slate-100">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhãn dán, chữ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-400"
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {activeTab === 'stickers' && (
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Stickers Trang trí (Kéo thả)
            </span>
            <div className="grid grid-cols-4 gap-2">
              {STICKER_ITEMS.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(
                (item) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, { type: 'decor', decorType: item.id, color: item.color })
                      }
                      onClick={() => onAddDecor(item.id)}
                      className="group p-2.5 bg-rose-50/50 hover:bg-rose-100/80 rounded-2xl border border-rose-100 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 hover:shadow-md transition-all text-center"
                      title={`${item.name} (Bấm hoặc kéo vào Canvas)`}
                    >
                      <IconComp size={24} style={{ color: item.color }} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] text-slate-600 mt-1 truncate w-full">{item.name}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Mẫu chữ nghệ thuật
            </span>
            {TEXT_PRESETS.map((preset) => (
              <div
                key={preset.id}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, { type: 'text', text: preset.text, fontStyle: preset.font })
                }
                onClick={() => onAddText(preset.text)}
                className="p-3 bg-slate-50 hover:bg-rose-50/80 rounded-2xl border border-slate-200 hover:border-rose-300 cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div>
                  <span className="text-[10px] text-slate-400 block">{preset.label}</span>
                  <span className="font-semibold text-slate-800 text-sm">{preset.text}</span>
                </div>
                <div className="p-1.5 bg-white group-hover:bg-rose-500 group-hover:text-white text-rose-500 rounded-xl shadow-xs transition-colors">
                  <Plus size={14} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'shapes' && (
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Khung hình & Trang trí
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SHAPE_PRESETS.map((shape) => (
                <div
                  key={shape.id}
                  draggable
                  onDragStart={(e) =>
                    handleDragStart(e, { type: 'shape', shapeType: shape.type, color: shape.color })
                  }
                  onClick={() => onAddShape(shape.type)}
                  className="p-3 bg-rose-50/40 hover:bg-rose-100 rounded-2xl border border-rose-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                >
                  <div
                    className="w-12 h-10 rounded-lg border-2 border-dashed border-rose-300 flex items-center justify-center mb-1.5"
                    style={{ backgroundColor: shape.color }}
                  >
                    <Square size={16} className="text-rose-400" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700">{shape.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upload & Media Library buttons at bottom */}
      <div className="p-3 border-t border-rose-100 bg-rose-50/30 space-y-1.5">
        <button
          onClick={() => setIsPickerOpen(true)}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <FolderOpen size={15} className="text-rose-400" />
          <span>Chèn từ Media Library</span>
        </button>

        {onUploadImage && (
          <button
            onClick={onUploadImage}
            className="w-full py-1.5 bg-white hover:bg-rose-50 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 transition-all text-[11px]"
          >
            <ImageIcon size={14} className="text-rose-500" />
            <span>Tải file trực tiếp</span>
          </button>
        )}
      </div>

      <AssetPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectAsset={(asset) => {
          if (onInsertProjectAsset) {
            onInsertProjectAsset(asset);
          } else {
            onAddDecor('Sparkles');
          }
        }}
      />
    </div>
  );
};
