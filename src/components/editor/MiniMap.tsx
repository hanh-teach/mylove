import React, { useRef } from 'react';
import { Compass, Maximize2 } from 'lucide-react';
import { ViewportTransform } from '../../modules/editor/ZoomEngine';

interface MiniMapProps {
  layers: any[];
  viewport: ViewportTransform;
  containerWidth: number;
  containerHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  onPanChange: (panX: number, panY: number) => void;
  onResetZoom: () => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  layers,
  viewport,
  containerWidth,
  containerHeight,
  canvasWidth,
  canvasHeight,
  onPanChange,
  onResetZoom,
}) => {
  const minimapRef = useRef<HTMLDivElement>(null);

  const miniWidth = 120;
  const miniHeight = Math.round((miniWidth * canvasHeight) / canvasWidth);

  // Calculate visible box relative to minimap scale
  const scaleX = miniWidth / canvasWidth;
  const scaleY = miniHeight / canvasHeight;

  // Viewport visible region in canvas space
  const visibleCanvasWidth = containerWidth / viewport.zoom;
  const visibleCanvasHeight = containerHeight / viewport.zoom;

  const visibleCanvasLeft = -viewport.panX / viewport.zoom;
  const visibleCanvasTop = -viewport.panY / viewport.zoom;

  // Minimap rect bounds
  const boxLeft = Math.max(0, Math.min(miniWidth, visibleCanvasLeft * scaleX));
  const boxTop = Math.max(0, Math.min(miniHeight, visibleCanvasTop * scaleY));
  const boxWidth = Math.min(miniWidth - boxLeft, Math.max(12, visibleCanvasWidth * scaleX));
  const boxHeight = Math.min(miniHeight - boxTop, Math.max(12, visibleCanvasHeight * scaleY));

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!minimapRef.current) return;
    const rect = minimapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Convert minimap click to canvas coordinate center
    const targetCanvasX = clickX / scaleX;
    const targetCanvasY = clickY / scaleY;

    // Center viewport around target canvas point
    const newPanX = containerWidth / 2 - targetCanvasX * viewport.zoom;
    const newPanY = containerHeight / 2 - targetCanvasY * viewport.zoom;

    onPanChange(newPanX, newPanY);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 p-2 flex flex-col gap-1.5 select-none z-30">
      <div className="flex items-center justify-between px-1 text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1 text-rose-600">
          <Compass size={12} />
          MiniMap
        </span>
        <button
          onClick={onResetZoom}
          className="hover:text-rose-700 transition-colors flex items-center gap-0.5"
          title="Fit screen"
        >
          <Maximize2 size={10} />
          <span>Fit</span>
        </button>
      </div>

      <div
        ref={minimapRef}
        onClick={handleMinimapClick}
        style={{ width: `${miniWidth}px`, height: `${miniHeight}px` }}
        className="relative bg-rose-50/50 rounded-lg border border-rose-200/60 overflow-hidden cursor-crosshair shadow-inner"
      >
        {/* Render mini representations of layers */}
        {layers
          .filter((l) => l.visible !== false)
          .map((layer) => {
            const lx = layer.x * scaleX;
            const ly = layer.y * scaleY;
            const lw = Math.max(4, (layer.width || 60) * scaleX);
            const lh = Math.max(4, (layer.height || 60) * scaleY);

            return (
              <div
                key={layer.id}
                style={{
                  left: `${lx}px`,
                  top: `${ly}px`,
                  width: `${lw}px`,
                  height: `${lh}px`,
                }}
                className="absolute bg-rose-400/40 rounded-xs border border-rose-500/30 pointer-events-none"
              />
            );
          })}

        {/* Viewport Viewfinder box */}
        <div
          style={{
            left: `${boxLeft}px`,
            top: `${boxTop}px`,
            width: `${boxWidth}px`,
            height: `${boxHeight}px`,
          }}
          className="absolute border-2 border-rose-600 bg-rose-500/15 rounded-xs shadow-sm transition-all duration-75 pointer-events-none"
        />
      </div>
    </div>
  );
};
