import React, { useEffect, useState } from 'react';
import { AlignmentLine, DistanceIndicator, SpacingGuide } from './SmartGuideService';
import { Eye, EyeOff, LayoutGrid, Compass, Hash, Move } from 'lucide-react';

interface SmartGuideOverlaysProps {
  alignmentLines: AlignmentLine[];
  distanceIndicators: DistanceIndicator[];
  spacingGuides: SpacingGuide[];
  containerWidth: number;
  containerHeight: number;
  gridEnabled: boolean;
  rulersEnabled: boolean;
  smartGuidesEnabled: boolean;
  showCanvasMargin: boolean;
  selectedItemId: number | null;
  draggedItemId: number | null;
  itemBounds: Array<{ id: number; x: number; y: number; width: number; height: number }>;
  zoom: number;
  panOffset: { x: number; y: number };
}

export const SmartGuideOverlays: React.FC<SmartGuideOverlaysProps> = ({
  alignmentLines,
  distanceIndicators,
  spacingGuides,
  containerWidth,
  containerHeight,
  gridEnabled,
  rulersEnabled,
  smartGuidesEnabled,
  showCanvasMargin,
  selectedItemId,
  draggedItemId,
  itemBounds,
  zoom,
  panOffset
}) => {
  const CANVAS_MARGIN = 40;
  const ARTBOARD_WIDTH = 1200;
  const ARTBOARD_HEIGHT = 800;

  // 1. Zoom-aware Ruler calculations
  const step = zoom < 0.2 ? 500 : zoom < 0.5 ? 200 : zoom < 1.0 ? 100 : 50;
  
  const topTicks: number[] = [];
  const startX = Math.max(0, Math.floor(-panOffset.x / (step * zoom)) * step);
  const endX = Math.max(0, Math.ceil((containerWidth - panOffset.x) / (step * zoom)) * step);
  for (let val = startX; val <= endX + step; val += step) {
    topTicks.push(val);
  }

  const leftTicks: number[] = [];
  const startY = Math.max(0, Math.floor(-panOffset.y / (step * zoom)) * step);
  const endY = Math.max(0, Math.ceil((containerHeight - panOffset.y) / (step * zoom)) * step);
  for (let val = startY; val <= endY + step; val += step) {
    leftTicks.push(val);
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none overflow-hidden">
      {/* 1. Grid Pattern (Translating & scaling with zoom & pan) */}
      {gridEnabled && (
        <div 
          className="absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: `
              radial-gradient(circle, #f43f5e 1.5px, transparent 1.5px)
            `,
            backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`
          }}
        />
      )}

      {/* 2. Rulers */}
      {rulersEnabled && (
        <>
          {/* Top Ruler */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-white/95 border-b border-rose-100 flex items-end z-50 shadow-sm">
            {topTicks.map((val) => {
              const screenX = panOffset.x + val * zoom;
              if (screenX < 0 || screenX > containerWidth) return null;
              const isMajor = val % (step * 2) === 0;
              return (
                <div 
                  key={`tr-${val}`} 
                  className="absolute bottom-0 border-l border-rose-200/60"
                  style={{ 
                    left: `${screenX}px`, 
                    height: isMajor ? '12px' : '6px' 
                  }}
                >
                  {isMajor && (
                    <span className="absolute bottom-3 left-1 text-[8px] text-rose-950/70 font-mono">
                      {val}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Left Ruler */}
          <div className="absolute top-0 left-0 bottom-0 w-6 bg-white/95 border-r border-rose-100 flex justify-end z-50 shadow-sm">
            {leftTicks.map((val) => {
              const screenY = panOffset.y + val * zoom;
              if (screenY < 0 || screenY > containerHeight) return null;
              const isMajor = val % (step * 2) === 0;
              return (
                <div 
                  key={`lr-${val}`} 
                  className="absolute right-0 border-t border-rose-200/60"
                  style={{ 
                    top: `${screenY}px`, 
                    width: isMajor ? '12px' : '6px' 
                  }}
                >
                  {isMajor && (
                    <span className="absolute right-3 top-0.5 text-[8px] text-rose-950/70 font-mono origin-top-left">
                      {val}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 3. Canvas Margins Guide (Safe margins within Artboard) */}
      {showCanvasMargin && (
        <div 
          className="absolute border border-dashed border-rose-400/20 rounded-lg pointer-events-none transition-opacity"
          style={{
            left: `${panOffset.x + CANVAS_MARGIN * zoom}px`,
            top: `${panOffset.y + CANVAS_MARGIN * zoom}px`,
            width: `${(ARTBOARD_WIDTH - CANVAS_MARGIN * 2) * zoom}px`,
            height: `${(ARTBOARD_HEIGHT - CANVAS_MARGIN * 2) * zoom}px`
          }}
        />
      )}

      {/* 4. Selected Item Bounding Margin (Object Outline) */}
      {selectedItemId !== null && !draggedItemId && (
        (() => {
          const matched = itemBounds.find(b => b.id === selectedItemId);
          if (!matched) return null;
          return (
            <div 
              className="absolute border-2 border-rose-500/50 rounded-xl pointer-events-none transition-all shadow-[0_0_10px_rgba(244,63,94,0.1)]"
              style={{
                left: `${panOffset.x + matched.x * zoom}px`,
                top: `${panOffset.y + matched.y * zoom}px`,
                width: `${matched.width * zoom}px`,
                height: `${matched.height * zoom}px`
              }}
            >
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded shadow font-mono font-medium whitespace-nowrap">
                {Math.round(matched.width)}x{Math.round(matched.height)}
              </div>
            </div>
          );
        })()
      )}

      {/* 5. Dragged Item Active Boundary Guide */}
      {draggedItemId !== null && (
        (() => {
          const matched = itemBounds.find(b => b.id === draggedItemId);
          if (!matched) return null;
          return (
            <div 
              className="absolute border border-rose-500 rounded-xl pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.2)]"
              style={{
                left: `${panOffset.x + matched.x * zoom}px`,
                top: `${panOffset.y + matched.y * zoom}px`,
                width: `${matched.width * zoom}px`,
                height: `${matched.height * zoom}px`
              }}
            >
              {/* Corner handles decoration to simulate Figma/Canva Object Margins */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white border border-rose-500 rounded-sm" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border border-rose-500 rounded-sm" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white border border-rose-500 rounded-sm" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white border border-rose-500 rounded-sm" />
            </div>
          );
        })()
      )}

      {/* 6. Alignment Guidelines (Magnetic snapping lines) */}
      {smartGuidesEnabled && alignmentLines.map((line, idx) => {
        if (line.type === 'v') {
          return (
            <div 
              key={`line-v-${idx}`}
              className="absolute border-l border-dashed border-rose-500/80 z-40"
              style={{
                left: `${panOffset.x + line.coord * zoom}px`,
                top: `${panOffset.y + line.from * zoom}px`,
                height: `${(line.to - line.from) * zoom}px`
              }}
            >
              {line.label && (
                <span className="absolute left-1 top-2 bg-rose-500 text-white text-[8px] px-1 rounded shadow-sm opacity-80 scale-90 font-mono">
                  {line.label}
                </span>
              )}
            </div>
          );
        } else {
          return (
            <div 
              key={`line-h-${idx}`}
              className="absolute border-t border-dashed border-rose-500/80 z-40"
              style={{
                top: `${panOffset.y + line.coord * zoom}px`,
                left: `${panOffset.x + line.from * zoom}px`,
                width: `${(line.to - line.from) * zoom}px`
              }}
            >
              {line.label && (
                <span className="absolute left-2 top-1 bg-rose-500 text-white text-[8px] px-1 rounded shadow-sm opacity-80 scale-90 font-mono">
                  {line.label}
                </span>
              )}
            </div>
          );
        }
      })}

      {/* 7. Distance Indicators (Dimensions) */}
      {smartGuidesEnabled && distanceIndicators.map((dist, idx) => {
        const isV = dist.type === 'v';
        const displayLeft = isV ? panOffset.x + dist.x * zoom - 20 : panOffset.x + dist.x * zoom;
        const displayTop = isV ? panOffset.y + dist.y * zoom : panOffset.y + dist.y * zoom - 12;
        const displayWidth = isV ? 40 : dist.length * zoom;
        const displayHeight = isV ? dist.length * zoom : 24;

        return (
          <div 
            key={`dist-${idx}`}
            className="absolute flex items-center justify-center z-40"
            style={{
              left: `${displayLeft}px`,
              top: `${displayTop}px`,
              width: `${displayWidth}px`,
              height: `${displayHeight}px`
            }}
          >
            {/* Visual alignment line between items */}
            <div 
              className={`absolute border-rose-500/60 ${isV ? 'border-l h-full' : 'border-t w-full'}`} 
            />
            {/* Tiny arrows on ends */}
            {!isV && (
              <>
                <div className="absolute left-0 border-y-4 border-y-transparent border-r-4 border-r-rose-500" />
                <div className="absolute right-0 border-y-4 border-y-transparent border-l-4 border-l-rose-500" />
              </>
            )}
            {isV && (
              <>
                <div className="absolute top-0 border-x-4 border-x-transparent border-b-4 border-b-rose-500" />
                <div className="absolute bottom-0 border-x-4 border-x-transparent border-t-4 border-t-rose-500" />
              </>
            )}
            
            {/* Measurement label */}
            <span className="bg-rose-500 text-white text-[9px] px-1 rounded shadow-md z-10 font-mono leading-none py-0.5 whitespace-nowrap">
              {dist.text}
            </span>
          </div>
        );
      })}

      {/* 8. Spacing Guides (Equal spacing highlight boxes) */}
      {smartGuidesEnabled && spacingGuides.map((guide, idx) => (
        <React.Fragment key={`spacing-guide-${idx}`}>
          {guide.rects.map((rect, rIdx) => (
            <div 
              key={`rect-${rIdx}`}
              className="absolute bg-rose-500/10 border border-rose-500/30 flex items-center justify-center rounded-sm transition-all"
              style={{
                left: `${panOffset.x + rect.x * zoom}px`,
                top: `${panOffset.y + rect.y * zoom}px`,
                width: `${rect.width * zoom}px`,
                height: `${rect.height * zoom}px`
              }}
            >
              <span className="bg-rose-600 text-white text-[8px] px-1 py-0.5 rounded font-mono font-bold scale-90">
                {rect.text}
              </span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

/* --- FLOATING DESIGN CONTROL PALETTE --- */
interface SmartGuideControlProps {
  smartGuidesEnabled: boolean;
  setSmartGuidesEnabled: (val: boolean) => void;
  gridEnabled: boolean;
  setGridEnabled: (val: boolean) => void;
  rulersEnabled: boolean;
  setRulersEnabled: (val: boolean) => void;
  showCanvasMargin: boolean;
  setShowCanvasMargin: (val: boolean) => void;
  onAddManyLayers: () => void;
  totalLayers: number;
}

export const SmartGuideControl: React.FC<SmartGuideControlProps> = ({
  smartGuidesEnabled,
  setSmartGuidesEnabled,
  gridEnabled,
  setGridEnabled,
  rulersEnabled,
  setRulersEnabled,
  showCanvasMargin,
  setShowCanvasMargin,
  onAddManyLayers,
  totalLayers
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-rose-100 flex flex-col gap-3 w-56 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-rose-50/80 pb-2">
            <span className="text-xs font-semibold text-rose-950 flex items-center gap-1.5">
              <Compass size={14} className="text-rose-500 animate-spin-slow" />
              Công cụ Smart Guide
            </span>
            <span className="text-[10px] font-mono bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full font-semibold">
              {totalLayers} lớp
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Toggle Snapping */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-rose-900 group-hover:text-rose-600 transition-colors">Tự động Hút (Snap)</span>
              <input 
                type="checkbox" 
                checked={smartGuidesEnabled} 
                onChange={(e) => setSmartGuidesEnabled(e.target.checked)} 
                className="accent-rose-500 rounded cursor-pointer"
              />
            </label>

            {/* Toggle Grid */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-rose-900 group-hover:text-rose-600 transition-colors">Hiển thị Lưới (Grid)</span>
              <input 
                type="checkbox" 
                checked={gridEnabled} 
                onChange={(e) => setGridEnabled(e.target.checked)} 
                className="accent-rose-500 rounded cursor-pointer"
              />
            </label>

            {/* Toggle Rulers */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-rose-900 group-hover:text-rose-600 transition-colors">Thước đo (Rulers)</span>
              <input 
                type="checkbox" 
                checked={rulersEnabled} 
                onChange={(e) => setRulersEnabled(e.target.checked)} 
                className="accent-rose-500 rounded cursor-pointer"
              />
            </label>

            {/* Toggle Canvas Margins */}
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs text-rose-900 group-hover:text-rose-600 transition-colors">Lề Canvas (Margin)</span>
              <input 
                type="checkbox" 
                checked={showCanvasMargin} 
                onChange={(e) => setShowCanvasMargin(e.target.checked)} 
                className="accent-rose-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Performance load test button */}
          <button 
            onClick={onAddManyLayers}
            className="w-full mt-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium text-xs py-2 rounded-xl shadow-md shadow-rose-200 transition-all active:scale-[0.98] flex items-center justify-center gap-1"
          >
            <Move size={12} />
            Thêm 500 Layer (Test Lag)
          </button>
        </div>
      )}

      {/* Primary Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border ${isOpen ? 'bg-rose-500 text-white border-rose-500 scale-105 rotate-180 shadow-rose-200' : 'bg-white hover:bg-rose-50 text-rose-600 border-rose-100 hover:scale-105'}`}
        title="Bật/Tắt Thước đo & Smart Guide"
      >
        <LayoutGrid size={20} />
      </button>
    </div>
  );
};
