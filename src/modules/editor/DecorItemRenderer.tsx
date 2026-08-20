import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, Unlock } from 'lucide-react';
import { PlacedItem } from '../../shared/types';
import { decorRegistry } from '../../shared/constants';
import { FRAME_SHAPE_MAP, getFrameStyle, FrameShapeType } from '../../shared/constants/frameShapes';

interface Viewport {
  panOffset: { x: number; y: number };
  zoom: number;
  width: number;
  height: number;
}

interface DecorItemRendererProps {
  item: PlacedItem;
  isSelected: boolean;
  zoom: number;
  config: any;
  viewport: Viewport;
  onSelect: (id: number) => void;
  onDragStart: (id: number, x: number, y: number) => void;
  onDrag: (id: number, item: PlacedItem, rawX: number, rawY: number) => void;
  onDragEnd: (id: number, rawX: number, rawY: number) => void;
  onScale: (id: number, delta: number) => void;
  onRotate: (id: number, delta: number) => void;
  onCycleAnimation: (id: number) => void;
  onCycleFrameShape?: (id: number) => void;
  onRemove: (id: number) => void;
  onToggleLock: (id: number) => void;
}

export const DecorItemRenderer = React.memo(({
  item,
  isSelected,
  zoom,
  config,
  viewport,
  onSelect,
  onDragStart,
  onDrag,
  onDragEnd,
  onScale,
  onRotate,
  onCycleAnimation,
  onCycleFrameShape,
  onRemove,
  onToggleLock
}: DecorItemRendererProps) => {
  const dragStartPos = useRef({ x: 0, y: 0 });

  // Virtual Rendering Check (Dirty Rectangle / Lazy Render)
  const itemScreenX = viewport.panOffset.x + item.x * viewport.zoom;
  const itemScreenY = viewport.panOffset.y + item.y * viewport.zoom;
  
  // Size of item is around 100x100 base, let's say 200 to be safe
  const itemSize = 250 * item.scale * viewport.zoom;
  
  const isVisible = 
    itemScreenX > -itemSize && 
    itemScreenX < viewport.width + itemSize &&
    itemScreenY > -itemSize && 
    itemScreenY < viewport.height + itemSize;

  if (!isVisible && !isSelected) {
    return null;
  }

  const decor = decorRegistry[item.type];
  const customImg = (item as any).url || (item as any).imageUrl || (decor?.type === 'image' ? (decor.content as string) : null);
  if (!decor && !customImg) return null;
  
  const currentAnimate = item.animation === 'float' ? { y: [0, -20, 0], x: [0, 10, -10, 0] } :
                        item.animation === 'pulse' ? { scale: [1, 1.25, 1], opacity: [1, 0.6, 1] } :
                        item.animation === 'spin' ? { rotate: [0, 360] } :
                        {};
  const currentTransition = item.animation === 'float' ? { duration: 4, repeat: Infinity, ease: 'easeInOut' as const } :
                           item.animation === 'pulse' ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const } :
                           item.animation === 'spin' ? { duration: 4, repeat: Infinity, ease: 'linear' as const } :
                           {};

  return (
    <motion.div
      drag={item.locked ? false : true}
      dragMomentum={false}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      onClick={(e) => e.stopPropagation()}
      onDragStart={() => {
        dragStartPos.current = { x: item.x, y: item.y };
        onDragStart(item.id, item.x, item.y);
      }}
      onDrag={(_, info) => {
        if (item.locked) return;
        const rawX = dragStartPos.current.x + info.offset.x / zoom;
        const rawY = dragStartPos.current.y + info.offset.y / zoom;
        onDrag(item.id, item, rawX, rawY);
      }}
      onDragEnd={(_, info) => {
        if (!item.locked) {
          const rawX = dragStartPos.current.x + info.offset.x / zoom;
          const rawY = dragStartPos.current.y + info.offset.y / zoom;
          onDragEnd(item.id, rawX, rawY);
        }
      }}
      initial={{ x: item.x, y: item.y, scale: item.scale, rotate: item.rotation }}
      animate={{ x: item.x, y: item.y, scale: item.scale, rotate: item.rotation }}
      className={`absolute ${item.locked ? 'cursor-default' : 'cursor-move'} group z-50`}
    >
      {item.locked && (
        <div className="absolute -top-2 -left-2 bg-amber-500 text-white p-1 rounded-full shadow-md z-10 pointer-events-none">
          <Lock size={10} />
        </div>
      )}
      {customImg && !decor ? (
        <motion.div 
          animate={currentAnimate}
          transition={currentTransition}
          className="bg-white/95 p-2 shadow-xl border-2 border-white ring-1 ring-rose-100 flex flex-col items-center overflow-hidden transition-all duration-300"
          style={getFrameStyle((item as any).frameShape as FrameShapeType)}
        >
          <img 
            src={customImg} 
            alt="Ảnh từ Soạn thảo" 
            className="w-32 h-32 sm:w-44 sm:h-44 object-cover transition-all duration-300" 
            style={getFrameStyle((item as any).frameShape as FrameShapeType)}
            draggable={false} 
            crossOrigin="anonymous"
          />
        </motion.div>
      ) : decor?.type === 'icon' ? (
        <motion.div 
          className={item.color ? "" : config.accent} 
          style={item.color ? { color: item.color } : {}}
          animate={currentAnimate}
          transition={currentTransition}
        >
          <decor.content size={48} />
        </motion.div>
      ) : (
        <motion.div 
          animate={currentAnimate}
          transition={currentTransition}
          className="bg-white/95 p-2 rounded-2xl shadow-lg border-2 border-white ring-1 ring-rose-100/20 flex items-center justify-center overflow-hidden transition-all duration-300"
          style={(item as any).frameShape ? getFrameStyle((item as any).frameShape as FrameShapeType) : {}}
        >
          {decor?.content && (
            <img 
              src={decor.content as string} 
              alt={item.type} 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain transition-all duration-300" 
              style={(item as any).frameShape ? getFrameStyle((item as any).frameShape as FrameShapeType) : {}}
              draggable={false} 
            />
          )}
        </motion.div>
      )}
      <div className={`absolute -top-12 -right-6 flex flex-col gap-1 transition-opacity bg-white/70 backdrop-blur-sm p-1 rounded-lg z-60 shadow-md ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {!item.locked && (
          <>
            <button onClick={() => onScale(item.id, 0.2)} className="text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-100 transition-colors" title="Phóng to">+</button>
            <button onClick={() => onScale(item.id, -0.2)} className="text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-100 transition-colors" title="Thu nhỏ">-</button>
            <button onClick={() => onRotate(item.id, 15)} className="text-xs bg-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-rose-100 transition-colors" title="Xoay 15°">↻</button>
            {onCycleFrameShape && (
              <button 
                onClick={() => onCycleFrameShape(item.id)} 
                className="text-xs bg-purple-100 text-purple-800 rounded-full w-5 h-5 flex items-center justify-center relative group/frame hover:bg-purple-200 transition-colors"
                title="Thay đổi khung hình"
              >
                {FRAME_SHAPE_MAP[(item as any).frameShape as FrameShapeType || 'rounded']?.icon || '🖼️'}
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-purple-900 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/frame:opacity-100 whitespace-nowrap pointer-events-none shadow-md z-70">
                  Khung: {FRAME_SHAPE_MAP[(item as any).frameShape as FrameShapeType || 'rounded']?.label || 'Bo tròn'}
                </span>
              </button>
            )}
            <button onClick={() => onCycleAnimation(item.id)} className="text-xs bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center relative group/anim" title="Hiệu ứng động">
              ✨
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover/anim:opacity-100 whitespace-nowrap pointer-events-none z-70">
                {item.animation === 'float' ? 'Bay lượn' : item.animation === 'pulse' ? 'Nhịp đập' : item.animation === 'spin' ? 'Xoay vòng' : 'Tĩnh'}
              </span>
            </button>
            <button onClick={() => onRemove(item.id)} className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors" title="Xóa">x</button>
          </>
        )}
        <button 
          onClick={() => onToggleLock(item.id)} 
          className={`text-xs rounded-full w-5 h-5 flex items-center justify-center transition-colors ${item.locked ? 'bg-amber-500 text-white hover:bg-amber-600 shadow' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          title={item.locked ? "Mở khóa lớp" : "Khóa lớp"}
        >
          {item.locked ? <Lock size={12} /> : <Unlock size={12} />}
        </button>
      </div>
    </motion.div>
  );
}, (prev, next) => {
  return prev.item === next.item &&
         prev.isSelected === next.isSelected &&
         prev.zoom === next.zoom &&
         prev.viewport.panOffset.x === next.viewport.panOffset.x &&
         prev.viewport.panOffset.y === next.viewport.panOffset.y &&
         prev.viewport.zoom === next.viewport.zoom &&
         prev.config === next.config;
});
