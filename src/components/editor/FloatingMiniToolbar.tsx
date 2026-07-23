import React from 'react';
import { 
  Bold, 
  Italic, 
  Trash2, 
  CopyPlus, 
  Sparkles, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Group, 
  Ungroup,
  Lock,
  Unlock,
  Type,
  Palette,
  Sliders
} from 'lucide-react';
import { ILayer } from '../../modules/editor/LayerTypes';

interface FloatingMiniToolbarProps {
  selectedLayers: ILayer[];
  zoom: number;
  panOffset: { x: number; y: number };
  onUpdateLayer: (id: string, updates: Partial<ILayer>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onToggleLock?: () => void;
  onAIRewrite?: () => void;
}

export const FloatingMiniToolbar: React.FC<FloatingMiniToolbarProps> = ({
  selectedLayers,
  zoom,
  panOffset,
  onUpdateLayer,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onToggleLock,
  onAIRewrite,
}) => {
  if (!selectedLayers || selectedLayers.length === 0) return null;

  const primary = selectedLayers[0];
  const isMulti = selectedLayers.length > 1;
  const isText = primary.type === 'text';

  // Calculate bounding box of selection in screen space
  const minX = Math.min(...selectedLayers.map((l) => l.x));
  const minY = Math.min(...selectedLayers.map((l) => l.y));
  const maxX = Math.max(...selectedLayers.map((l) => l.x + l.width));

  const screenCenterX = panOffset.x + ((minX + maxX) / 2) * zoom;
  const screenTopY = panOffset.y + minY * zoom - 52; // float 52px above object

  const isLocked = primary.locked;
  const isBold = primary.metadata?.bold;
  const isItalic = primary.metadata?.italic;
  const align = primary.metadata?.align || 'left';
  const color = primary.metadata?.color || '#f43f5e';

  return (
    <div
      style={{
        left: `${screenCenterX}px`,
        top: `${Math.max(16, screenTopY)}px`,
        transform: 'translateX(-50%)',
      }}
      className="absolute z-[80] flex items-center gap-1 bg-slate-900/90 text-white backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-2xl border border-white/20 text-xs animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* If Multi-selection */}
      {isMulti ? (
        <>
          <span className="text-[10px] font-medium text-rose-300 px-1 font-mono">
            {selectedLayers.length} đã chọn
          </span>
          <button
            onClick={onGroup}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-indigo-300 flex items-center gap-1"
            title="Gộp nhóm (Group)"
          >
            <Group size={14} />
            <span className="text-[10px]">Group</span>
          </button>
          <div className="w-px h-4 bg-white/20 my-auto" />
        </>
      ) : primary.type === 'group' ? (
        <button
          onClick={onUngroup}
          className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-indigo-300 flex items-center gap-1"
          title="Rã nhóm (Ungroup)"
        >
          <Ungroup size={14} />
          <span className="text-[10px]">Ungroup</span>
        </button>
      ) : null}

      {/* Text formatting controls */}
      {!isMulti && isText && (
        <>
          <button
            onClick={() =>
              onUpdateLayer(primary.id, {
                metadata: { ...primary.metadata, bold: !isBold },
              })
            }
            className={`p-1.5 rounded-xl transition-colors ${
              isBold ? 'bg-rose-500 text-white' : 'hover:bg-white/20 text-slate-200'
            }`}
            title="In đậm (Bold)"
          >
            <Bold size={13} />
          </button>

          <button
            onClick={() =>
              onUpdateLayer(primary.id, {
                metadata: { ...primary.metadata, italic: !isItalic },
              })
            }
            className={`p-1.5 rounded-xl transition-colors ${
              isItalic ? 'bg-rose-500 text-white' : 'hover:bg-white/20 text-slate-200'
            }`}
            title="In nghiêng (Italic)"
          >
            <Italic size={13} />
          </button>

          {/* Alignment */}
          <button
            onClick={() => {
              const nextAlign = align === 'left' ? 'center' : align === 'center' ? 'right' : 'left';
              onUpdateLayer(primary.id, {
                metadata: { ...primary.metadata, align: nextAlign },
              });
            }}
            className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-slate-200"
            title="Căn lề"
          >
            {align === 'left' ? (
              <AlignLeft size={13} />
            ) : align === 'center' ? (
              <AlignCenter size={13} />
            ) : (
              <AlignRight size={13} />
            )}
          </button>

          {/* Color Picker input */}
          <div className="relative flex items-center justify-center p-1 rounded-xl hover:bg-white/20 cursor-pointer">
            <input
              type="color"
              value={color}
              onChange={(e) =>
                onUpdateLayer(primary.id, {
                  metadata: { ...primary.metadata, color: e.target.value },
                })
              }
              className="w-4 h-4 rounded-full border border-white/50 cursor-pointer opacity-0 absolute inset-0 z-10"
            />
            <div
              className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="w-px h-4 bg-white/20 my-auto" />

          {/* AI Rewrite */}
          {onAIRewrite && (
            <button
              onClick={onAIRewrite}
              className="px-2 py-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 rounded-xl text-[10px] font-bold flex items-center gap-1 text-white shadow-sm transition-all"
              title="AI Viết lại nội dung"
            >
              <Sparkles size={12} />
              <span>AI Rewrite</span>
            </button>
          )}

          <div className="w-px h-4 bg-white/20 my-auto" />
        </>
      )}

      {/* Lock toggle */}
      {onToggleLock && (
        <button
          onClick={onToggleLock}
          className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-slate-200"
          title={isLocked ? 'Mở khóa' : 'Khóa layer'}
        >
          {isLocked ? <Unlock size={13} className="text-amber-400" /> : <Lock size={13} />}
        </button>
      )}

      {/* Duplicate */}
      <button
        onClick={onDuplicate}
        className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-slate-200"
        title="Nhân bản (Ctrl+D)"
      >
        <CopyPlus size={13} />
      </button>

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-1.5 hover:bg-red-500/80 rounded-xl transition-colors text-red-300 hover:text-white"
        title="Xóa layer (Del)"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
};
