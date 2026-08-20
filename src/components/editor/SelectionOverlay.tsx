import React, { useRef, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { ILayer } from '../../modules/editor/LayerTypes';

interface SelectionOverlayProps {
  selectedLayers: ILayer[];
  zoom: number;
  panOffset: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  onUpdateLayer: (id: string, updates: Partial<ILayer>) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export const SelectionOverlay: React.FC<SelectionOverlayProps> = ({
  selectedLayers,
  zoom,
  panOffset,
  onUpdateLayer,
  onDragStart,
  onDragEnd,
}) => {
  const [isTransforming, setIsTransforming] = useState(false);
  const activeHandleRef = useRef<string | null>(null);
  const startStateRef = useRef<{
    pointerX: number;
    pointerY: number;
    layers: Array<{ id: string; x: number; y: number; width: number; height: number; rotation: number }>;
    bounds: { minX: number; minY: number; width: number; height: number };
  } | null>(null);

  if (!selectedLayers || selectedLayers.length === 0) {
    return null;
  }

  // Filter out hidden or locked layers if single, but if multi, show bounding box
  const validLayers = selectedLayers.filter((l) => l.visible !== false && !l.locked);
  if (validLayers.length === 0) return null;

  const isMulti = validLayers.length > 1;

  // Compute union bounding box
  const minX = Math.min(...validLayers.map((l) => l.x));
  const minY = Math.min(...validLayers.map((l) => l.y));
  const maxX = Math.max(...validLayers.map((l) => l.x + l.width));
  const maxY = Math.max(...validLayers.map((l) => l.y + l.height));
  const boundsWidth = maxX - minX;
  const boundsHeight = maxY - minY;

  // Single layer primary attributes
  const primaryLayer = validLayers[0];
  const rotation = isMulti ? 0 : primaryLayer.rotation || 0;

  // Calculate screen coordinates
  const screenX = panOffset.x + minX * zoom;
  const screenY = panOffset.y + minY * zoom;
  const screenWidth = boundsWidth * zoom;
  const screenHeight = boundsHeight * zoom;

  // Handle pointer down on handles or bounding box
  const handleHandlePointerDown = (e: React.PointerEvent, handleType: string) => {
    e.stopPropagation();
    e.preventDefault();

    activeHandleRef.current = handleType;
    setIsTransforming(true);
    if (onDragStart) onDragStart();

    startStateRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      layers: validLayers.map((l) => ({
        id: l.id,
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
        rotation: l.rotation || 0,
      })),
      bounds: { minX, minY, width: boundsWidth, height: boundsHeight },
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isTransforming || !activeHandleRef.current || !startStateRef.current) return;
    e.stopPropagation();

    const handle = activeHandleRef.current;
    const start = startStateRef.current;

    const dx = (e.clientX - start.pointerX) / zoom;
    const dy = (e.clientY - start.pointerY) / zoom;

    if (handle === 'move') {
      // Move all selected layers together
      start.layers.forEach((l) => {
        onUpdateLayer(l.id, {
          x: Math.round(l.x + dx),
          y: Math.round(l.y + dy),
        });
      });
      return;
    }

    if (handle === 'rotate' && !isMulti) {
      // Calculate rotation angle relative to center of box
      const centerX = screenX + screenWidth / 2;
      const centerY = screenY + screenHeight / 2;

      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = Math.round((rad * 180) / Math.PI) + 90;
      if (deg < 0) deg += 360;

      if (e.shiftKey) {
        deg = Math.round(deg / 45) * 45;
      }

      onUpdateLayer(primaryLayer.id, { rotation: deg % 360 });
      return;
    }

    // Single layer resize calculation
    if (!isMulti) {
      const startLayer = start.layers[0];
      let newWidth = startLayer.width;
      let newHeight = startLayer.height;
      let newX = startLayer.x;
      let newY = startLayer.y;

      const minSize = 20;

      if (handle.includes('e')) newWidth = Math.max(minSize, startLayer.width + dx);
      if (handle.includes('s')) newHeight = Math.max(minSize, startLayer.height + dy);
      if (handle.includes('w')) {
        const computedWidth = startLayer.width - dx;
        if (computedWidth >= minSize) {
          newWidth = computedWidth;
          newX = startLayer.x + dx;
        }
      }
      if (handle.includes('n')) {
        const computedHeight = startLayer.height - dy;
        if (computedHeight >= minSize) {
          newHeight = computedHeight;
          newY = startLayer.y + dy;
        }
      }

      // Aspect ratio lock on diagonal handle resize with Shift
      if (e.shiftKey && handle !== 'e' && handle !== 'w' && handle !== 'n' && handle !== 's') {
        const aspectRatio = startLayer.width / startLayer.height;
        newHeight = newWidth / aspectRatio;
      }

      onUpdateLayer(primaryLayer.id, {
        x: Math.round(newX),
        y: Math.round(newY),
        width: Math.round(newWidth),
        height: Math.round(newHeight),
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isTransforming) {
      setIsTransforming(false);
      activeHandleRef.current = null;
      startStateRef.current = null;
      if (onDragEnd) onDragEnd();
    }
  };

  const handlePositions = [
    { type: 'nw', x: 0, y: 0, cursor: 'nwse-resize' },
    { type: 'n', x: 0.5, y: 0, cursor: 'ns-resize' },
    { type: 'ne', x: 1, y: 0, cursor: 'nesw-resize' },
    { type: 'e', x: 1, y: 0.5, cursor: 'ew-resize' },
    { type: 'se', x: 1, y: 1, cursor: 'nwse-resize' },
    { type: 's', x: 0.5, y: 1, cursor: 'ns-resize' },
    { type: 'sw', x: 0, y: 1, cursor: 'nesw-resize' },
    { type: 'w', x: 0, y: 0.5, cursor: 'ew-resize' },
  ];

  return (
    <div
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        width: `${screenWidth}px`,
        height: `${screenHeight}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
      className="absolute pointer-events-auto cursor-move z-40 select-none group"
      onPointerDown={(e) => handleHandlePointerDown(e, 'move')}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Outer Bounding Box Ring */}
      <div className="absolute inset-0 border-2 border-rose-500 rounded-xs ring-1 ring-white/50 shadow-sm pointer-events-none" />

      {/* Rotation handle arm & handle at top (for single selection) */}
      {!isMulti && (
        <div className="absolute left-1/2 -top-7 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing">
          <div
            onPointerDown={(e) => handleHandlePointerDown(e, 'rotate')}
            className="w-5 h-5 bg-white border-2 border-rose-600 rounded-full shadow-md flex items-center justify-center text-rose-600 hover:scale-125 hover:bg-rose-50 transition-all"
            title="Xoay object (Shift để xoay 45°)"
          >
            <RotateCw size={11} />
          </div>
          <div className="w-0.5 h-2 bg-rose-500" />
        </div>
      )}

      {/* 8 Resize Handles */}
      {!isMulti &&
        handlePositions.map((h) => {
          const handleX = h.x * screenWidth;
          const handleY = h.y * screenHeight;

          return (
            <div
              key={h.type}
              style={{
                left: `${handleX}px`,
                top: `${handleY}px`,
                cursor: h.cursor,
              }}
              onPointerDown={(e) => handleHandlePointerDown(e, h.type)}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-rose-600 rounded-xs shadow-md hover:scale-125 hover:bg-rose-100 transition-all pointer-events-auto"
            />
          );
        })}

      {/* Size Badge / Multi-Selection Badge */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-mono rounded-md shadow-md pointer-events-none whitespace-nowrap">
        {isMulti ? (
          <span>Multi-Selection ({validLayers.length} items)</span>
        ) : (
          <span>
            {Math.round(boundsWidth)} × {Math.round(boundsHeight)}
            {primaryLayer.rotation ? ` (${Math.round(primaryLayer.rotation)}°)` : ''}
          </span>
        )}
      </div>
    </div>
  );
};
