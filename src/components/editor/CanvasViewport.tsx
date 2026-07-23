import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ILayer } from '../../modules/editor/LayerTypes';
import { ViewportTransform, zoomTowardsPointer } from '../../modules/editor/ZoomEngine';
import { SelectionOverlay } from './SelectionOverlay';
import { SmartGuideOverlays } from '../../modules/editor/SmartGuideOverlays';
import { computeSmartGuides, SmartGuideResult } from '../../modules/editor/SmartGuideService';
import { ContextMenu, ContextMenuPosition } from './ContextMenu';
import { FloatingMiniToolbar } from './FloatingMiniToolbar';
import { decorRegistry, fontRegistry } from '../../shared/constants';
import { TYPOGRAPHY_REGISTRY } from '../../modules/style/TypographyRegistry';
import { BACKGROUND_REGISTRY } from '../../modules/style/BackgroundRegistry';
import { LayerModel } from '../../modules/editor/LayerModel';
import { 
  Type, Heart, Sparkles, Image as ImageIcon, Plus, 
  Trash2, Calendar, MapPin, Quote as QuoteIcon, 
  CheckSquare, Square, Table as TableIcon, CalendarRange, 
  Bot, Check, Eye, HelpCircle, Star, Move, RotateCw, AlignLeft, 
  AlignCenter, AlignRight, CheckCircle2, RefreshCw 
} from 'lucide-react';

interface CanvasViewportProps {
  layers: ILayer[];
  selectedLayerIds: string[];
  viewport: ViewportTransform;
  canvasConfig: {
    scene: string;
    bgStyle: string;
    fontStyle: string;
    textColor: string;
  };
  gridEnabled?: boolean;
  snapToGrid?: boolean;
  onViewportChange: (viewport: ViewportTransform) => void;
  onSelectLayer: (id: string, isMulti: boolean) => void;
  onSelectMultipleLayers?: (ids: string[]) => void;
  onClearSelection: () => void;
  onUpdateLayer: (id: string, updates: Partial<ILayer>) => void;
  onAddTextLayer?: (text?: string) => void;
  onAddDecorLayer?: (decorType?: string) => void;
  onAddLayerFromDrop?: (layerData: any) => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onAIRewrite?: () => void;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  layers,
  selectedLayerIds,
  viewport,
  canvasConfig,
  gridEnabled = false,
  snapToGrid = false,
  onViewportChange,
  onSelectLayer,
  onSelectMultipleLayers,
  onClearSelection,
  onUpdateLayer,
  onAddTextLayer,
  onAddDecorLayer,
  onAddLayerFromDrop,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onToggleLock,
  onToggleVisibility,
  onBringToFront,
  onSendToBack,
  onGroup,
  onUngroup,
  onAIRewrite,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [editingTextLayerId, setEditingTextLayerId] = useState<string | null>(null);
  
  // Custom Interactive Blocks States
  const [editingCell, setEditingCell] = useState<{ layerId: string; rowIndex: number; colIndex: number } | null>(null);
  const [activeTimelineTooltip, setActiveTimelineTooltip] = useState<{ layerId: string; eventId: string } | null>(null);

  // Marquee Selection Box State
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);

  // Smart Guides State
  const [smartGuideResult, setSmartGuideResult] = useState<SmartGuideResult>({
    snappedX: 0,
    snappedY: 0,
    alignmentLines: [],
    distanceIndicators: [],
    spacingGuides: [],
  });

  const panStartRef = useRef<{ pointerX: number; pointerY: number; panX: number; panY: number }>({
    pointerX: 0,
    pointerY: 0,
    panX: 0,
    panY: 0,
  });

  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null);

  // Spacebar pan listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handle Wheel Zoom / Pinch / Pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const newZoom = viewport.zoom * zoomFactor;
      const updated = zoomTowardsPointer(viewport, newZoom, pointerX, pointerY);
      onViewportChange(updated);
    } else {
      onViewportChange({
        ...viewport,
        panX: viewport.panX - e.deltaX,
        panY: viewport.panY - e.deltaY,
      });
    }
  };

  // Canvas Drag Panning & Marquee Selection
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpacePressed || e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        panX: viewport.panX,
        panY: viewport.panY,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else if (
      e.target === containerRef.current ||
      (e.target as HTMLElement).id === 'canvas-artboard' ||
      (e.target as HTMLElement).id === 'canvas-bg'
    ) {
      setEditingTextLayerId(null);
      // Start marquee selection
      if (artboardRef.current) {
        const rect = artboardRef.current.getBoundingClientRect();
        const canvasX = (e.clientX - rect.left) / viewport.zoom;
        const canvasY = (e.clientY - rect.top) / viewport.zoom;

        setIsMarqueeSelecting(true);
        setMarqueeBox({
          startX: canvasX,
          startY: canvasY,
          currentX: canvasX,
          currentY: canvasY,
        });

        if (!e.shiftKey && !e.ctrlKey) {
          onClearSelection();
        }
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartRef.current.pointerX;
      const dy = e.clientY - panStartRef.current.pointerY;

      onViewportChange({
        ...viewport,
        panX: panStartRef.current.panX + dx,
        panY: panStartRef.current.panY + dy,
      });
      return;
    }

    if (isMarqueeSelecting && marqueeBox && artboardRef.current) {
      const rect = artboardRef.current.getBoundingClientRect();
      const currentX = (e.clientX - rect.left) / viewport.zoom;
      const currentY = (e.clientY - rect.top) / viewport.zoom;

      setMarqueeBox((prev) => (prev ? { ...prev, currentX, currentY } : null));

      // Calculate intersection with layers
      const mMinX = Math.min(marqueeBox.startX, currentX);
      const mMaxX = Math.max(marqueeBox.startX, currentX);
      const mMinY = Math.min(marqueeBox.startY, currentY);
      const mMaxY = Math.max(marqueeBox.startY, currentY);

      const intersectedIds = layers
        .filter((l) => l.visible !== false)
        .filter((l) => {
          const lRight = l.x + l.width;
          const lBottom = l.y + l.height;
          return l.x < mMaxX && lRight > mMinX && l.y < mMaxY && lBottom > mMinY;
        })
        .map((l) => l.id);

      if (onSelectMultipleLayers && intersectedIds.length > 0) {
        onSelectMultipleLayers(intersectedIds);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isPanning) {
      setIsPanning(false);
    }
    if (isMarqueeSelecting) {
      setIsMarqueeSelecting(false);
      setMarqueeBox(null);
    }
  };

  // Asset Drag & Drop Handlers on Canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const rawData = e.dataTransfer.getData('application/json');
      if (!rawData || !artboardRef.current) return;

      const assetData = JSON.parse(rawData);
      const rect = artboardRef.current.getBoundingClientRect();
      const dropX = Math.round((e.clientX - rect.left) / viewport.zoom - 50);
      const dropY = Math.round((e.clientY - rect.top) / viewport.zoom - 40);

      if (onAddLayerFromDrop) {
        onAddLayerFromDrop({ ...assetData, x: Math.max(20, dropX), y: Math.max(20, dropY) });
      }
    } catch (err) {
      console.error('Lỗi thả asset vào canvas:', err);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleToggleCheckItem = (layerId: string, itemId: string) => {
    const targetLayer = layers.find(l => l.id === layerId);
    if (!targetLayer || !targetLayer.metadata?.items) return;
    const updatedItems = targetLayer.metadata.items.map((item: any) => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    onUpdateLayer(layerId, {
      metadata: { ...targetLayer.metadata, items: updatedItems }
    });
  };

  const handleUpdateTableCell = (layerId: string, rowIndex: number, colIndex: number, text: string) => {
    const targetLayer = layers.find(l => l.id === layerId);
    if (!targetLayer || !targetLayer.metadata?.rows) return;
    const updatedRows = targetLayer.metadata.rows.map((row: any[], rIdx: number) => {
      if (rIdx !== rowIndex) return row;
      return row.map((cellText, cIdx) => cIdx === colIndex ? text : cellText);
    });
    onUpdateLayer(layerId, {
      metadata: { ...targetLayer.metadata, rows: updatedRows }
    });
  };

  const handleGenerateAISuggestion = async (layerId: string) => {
    const targetLayer = layers.find(l => l.id === layerId);
    if (!targetLayer) return;
    
    onUpdateLayer(layerId, {
      metadata: { ...targetLayer.metadata, status: 'generating', suggestion: 'Agnes AI đang tạo gợi ý...' }
    });
    
    try {
      const response = await fetch('/api/ai/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rewrite',
          text: targetLayer.metadata?.prompt || 'Chúc người thương',
          tone: 'romantic'
        })
      });
      const data = await response.json();
      
      onUpdateLayer(layerId, {
        metadata: { 
          ...targetLayer.metadata, 
          status: 'success', 
          suggestion: data.success && data.result ? data.result : 'Chúc cho tình cảm của tụi mình mãi nồng nàn và bền chặt như thuở ban đầu! 💕'
        }
      });
    } catch (err) {
      onUpdateLayer(layerId, {
        metadata: { 
          ...targetLayer.metadata, 
          status: 'success', 
          suggestion: 'Chúc cho tình cảm của tụi mình mãi nồng nàn và bền chặt như thuở ban đầu! 💕'
        }
      });
    }
  };

  const selectedLayers = layers.filter((l) => selectedLayerIds.includes(l.id));
  const primarySelected = selectedLayers[0];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onContextMenu={handleContextMenu}
      className={`relative w-full h-full overflow-hidden bg-slate-900/10 backdrop-blur-3xl select-none ${
        isSpacePressed || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Canvas Artboard Container */}
      <div
        id="canvas-artboard"
        ref={artboardRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          background: BACKGROUND_REGISTRY[canvasConfig.bgStyle]?.value || BACKGROUND_REGISTRY.solid?.value || '#ffffff'
        }}
        className="absolute w-[1000px] h-[650px] rounded-3xl shadow-2xl border border-rose-100 overflow-hidden transition-transform duration-75"
      >
        {/* Background Mesh or Grid pattern if Grid enabled */}
        {gridEnabled && (
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(circle, #f43f5e 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />
        )}

        {/* EMPTY STATE: Show quick action cards if 0 layers */}
        {layers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-rose-50/30 z-10 text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 shadow-sm animate-bounce">
              <Sparkles size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">Writer Studio Canvas Trống</h3>
            <p className="text-xs text-slate-500 max-w-sm mb-6">
              Bắt đầu sáng tạo bằng cách thêm văn bản, hoạ tiết trang trí hoặc tải ảnh cá nhân vào canvas.
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-md w-full">
              <button
                onClick={() => onAddTextLayer && onAddTextLayer('Trân trọng gửi trao...')}
                className="p-3 bg-white hover:bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-slate-800 font-semibold text-xs shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Type size={18} />
                </div>
                <span>+ Thêm Chữ Mới</span>
              </button>

              <button
                onClick={() => onAddDecorLayer && onAddDecorLayer('Heart')}
                className="p-3 bg-white hover:bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-slate-800 font-semibold text-xs shadow-sm hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Heart size={18} />
                </div>
                <span>+ Thêm Sticker Tim</span>
              </button>
            </div>
          </div>
        )}

        {/* Render Layers */}
        {layers
          .filter((l) => l.visible !== false)
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
          .map((layer) => {
            const isSelected = selectedLayerIds.includes(layer.id);
            const isInlineEditing = editingTextLayerId === layer.id;

            if (layer.type === 'text') {
              const fontClass = fontRegistry[layer.metadata?.fontStyle || 'playfair']?.class || 'font-playfair';
              // Check typography preset
              const typoPresetId = layer.metadata?.typography || 'heading'; // default to heading
              const typoConfig = TYPOGRAPHY_REGISTRY[typoPresetId] || TYPOGRAPHY_REGISTRY.heading;
              
              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingTextLayerId(layer.id);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                    transform: `rotate(${layer.rotation || 0}deg)`,
                    color: layer.metadata?.color || '#1e293b',
                    textAlign: layer.metadata?.align || 'left',
                    fontSize: `${typoConfig.fontSize}px`,
                    fontWeight: typoConfig.fontWeight,
                    lineHeight: typoConfig.lineHeight
                  }}
                  className={`absolute cursor-pointer transition-shadow rounded-lg p-1.5 flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-rose-500 bg-rose-50/20' : 'hover:ring-1 hover:ring-rose-300'
                  } ${fontClass}`}
                >
                  {isInlineEditing ? (
                    <textarea
                      autoFocus
                      defaultValue={layer.metadata?.text || ''}
                      onBlur={(e) => {
                        onUpdateLayer(layer.id, {
                          metadata: { ...layer.metadata, text: e.target.value },
                        });
                        setEditingTextLayerId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setEditingTextLayerId(null);
                        }
                      }}
                      style={{
                        fontSize: `${typoConfig.fontSize}px`,
                        fontWeight: typoConfig.fontWeight,
                        lineHeight: typoConfig.lineHeight,
                        textAlign: layer.metadata?.align || 'left'
                      }}
                      className="w-full h-full bg-white/95 text-slate-900 border-2 border-rose-500 rounded-lg p-1 outline-none resize-none shadow-xl"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center whitespace-pre-wrap ${
                        layer.metadata?.bold ? 'font-bold' : ''
                      } ${layer.metadata?.italic ? 'italic' : ''}`}
                    >
                      {layer.metadata?.text || layer.name}
                    </div>
                  )}
                </div>
              );
            }

            if (layer.type === 'decor') {
              const decorKey = layer.metadata?.decorType || 'Heart';
              const decor = decorRegistry[decorKey] || decorRegistry['Heart'];

              const animType = layer.metadata?.animation || 'none';
              const currentAnimate =
                animType === 'float'
                  ? { y: [0, -15, 0], x: [0, 8, -8, 0] }
                  : animType === 'pulse'
                  ? { scale: [1, 1.2, 1] }
                  : animType === 'spin'
                  ? { rotate: [0, 360] }
                  : {};

              const currentTransition =
                animType === 'float'
                  ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  : animType === 'pulse'
                  ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  : animType === 'spin'
                  ? { duration: 4, repeat: Infinity, ease: 'linear' }
                  : {};

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                    transform: `rotate(${layer.rotation || 0}deg)`,
                  }}
                  className={`absolute cursor-pointer rounded-2xl flex items-center justify-center p-1 ${
                    isSelected ? 'ring-2 ring-rose-500 bg-rose-50/10' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  {decor?.type === 'icon' ? (
                    <motion.div
                      animate={currentAnimate}
                      transition={currentTransition}
                      style={{ color: layer.metadata?.color || '#f43f5e' }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <decor.content size={Math.min(layer.width, layer.height)} />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={currentAnimate}
                      transition={currentTransition}
                      className="w-full h-full bg-white/90 p-1.5 rounded-2xl shadow-md border border-rose-100 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={decor?.content as string}
                        alt={layer.name}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    </motion.div>
                  )}
                </div>
              );
            }

            // Image Block
            if (layer.type === 'image') {
              const borderStyle = layer.metadata?.borderStyle || 'solid';
              const borderWidth = layer.metadata?.borderWidth || 0;
              const borderColor = layer.metadata?.borderColor || '#f43f5e';
              const borderRadius = layer.metadata?.borderRadius !== undefined ? layer.metadata.borderRadius : 16;
              const caption = layer.metadata?.caption || '';

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                    transform: `rotate(${layer.rotation || 0}deg)`,
                  }}
                  className={`absolute cursor-pointer flex flex-col p-2 bg-white rounded-2xl shadow-md border border-slate-100 ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  <div 
                    className="flex-1 w-full relative overflow-hidden bg-slate-50"
                    style={{
                      borderRadius: `${borderRadius}px`,
                      borderStyle: borderStyle,
                      borderWidth: `${borderWidth}px`,
                      borderColor: borderColor,
                    }}
                  >
                    <img
                      src={layer.metadata?.imageUrl || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80'}
                      alt={layer.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                  {caption && (
                    <div className="pt-2 text-center text-[11px] font-medium text-slate-500 italic truncate px-1 shrink-0">
                      {caption}
                    </div>
                  )}
                </div>
              );
            }

            // Shape Block
            if (layer.type === 'shape') {
              const shapeType = layer.metadata?.shapeType || 'rect';
              const fillColor = layer.metadata?.fillColor || '#fda4af';
              const strokeColor = layer.metadata?.strokeColor || '#f43f5e';
              const strokeWidth = layer.metadata?.strokeWidth || 2;
              const opacity = layer.metadata?.opacity || 1;

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: opacity,
                    transform: `rotate(${layer.rotation || 0}deg)`,
                  }}
                  className={`absolute cursor-pointer flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-rose-500 rounded-lg' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {shapeType === 'circle' ? (
                      <circle cx="50" cy="50" r={45 - strokeWidth} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                    ) : shapeType === 'heart' ? (
                      <path 
                        d="M12 4.419C12.437 2.152 14.005 0 16.518 0 19.333 0 21.5 2.167 21.5 4.982c0 3.73-3.793 6.941-9.5 11.018-5.707-4.077-9.5-7.287-9.5-11.018C2.5 2.167 4.667 0 7.482 0c2.513 0 4.081 2.152 4.518 4.419z" 
                        transform="scale(4) translate(0.5, 2)"
                        fill={fillColor} 
                        stroke={strokeColor} 
                        strokeWidth={strokeWidth / 4} 
                      />
                    ) : shapeType === 'star' ? (
                      <polygon 
                        points="50,5 64,35 97,35 70,55 81,88 50,68 19,88 30,55 3,35 36,35" 
                        fill={fillColor} 
                        stroke={strokeColor} 
                        strokeWidth={strokeWidth} 
                      />
                    ) : (
                      <rect x={strokeWidth} y={strokeWidth} width={100 - strokeWidth * 2} height={100 - strokeWidth * 2} rx="8" fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
                    )}
                  </svg>
                </div>
              );
            }

            // Divider Block
            if (layer.type === 'divider') {
              const dividerStyle = layer.metadata?.dividerStyle || 'dashed';
              const color = layer.metadata?.color || '#fda4af';
              const thickness = layer.metadata?.height || 2;

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                  }}
                  className={`absolute cursor-pointer flex items-center justify-center px-2 ${
                    isSelected ? 'ring-2 ring-rose-500 rounded-lg' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  <div 
                    className="w-full"
                    style={{
                      borderBottomStyle: dividerStyle,
                      borderBottomWidth: `${thickness}px`,
                      borderBottomColor: color,
                    }}
                  />
                </div>
              );
            }

            // Quote Block
            if (layer.type === 'quote') {
              const color = layer.metadata?.color || '#4c1d95';
              const borderColor = layer.metadata?.borderColor || '#8b5cf6';
              const quoteText = layer.metadata?.quoteText || '"Mỗi ngày bên em là một chương hạnh phúc."';
              const quoteAuthor = layer.metadata?.quoteAuthor || 'William Shakespeare';

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  className={`absolute cursor-pointer flex flex-col justify-center bg-white rounded-2xl shadow-sm p-4 border-l-4 ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    borderLeftColor: borderColor,
                    borderLeftWidth: '4px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <div className="flex gap-2">
                    <QuoteIcon size={18} className="text-slate-300 shrink-0 mt-0.5" style={{ color: borderColor }} />
                    <div className="flex-1">
                      <p className="text-xs font-medium italic text-slate-800 leading-relaxed" style={{ color: color }}>
                        {quoteText}
                      </p>
                      {quoteAuthor && (
                        <p className="text-[10px] text-slate-400 mt-1.5 font-bold tracking-wide">
                          — {quoteAuthor}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // Checklist Block
            if (layer.type === 'checklist') {
              const themeColor = layer.metadata?.color || '#0f766e';
              const items = layer.metadata?.items || [];

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                  }}
                  className={`absolute cursor-pointer bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 overflow-y-auto ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 shrink-0">
                    <CheckSquare size={13} style={{ color: themeColor }} />
                    <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">Hành trình Bucket List</span>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {items.map((item: any) => (
                      <div 
                        key={item.id}
                        className="flex items-center gap-2 hover:bg-slate-50/80 p-1 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCheckItem(layer.id, item.id);
                        }}
                      >
                        <button className="text-slate-400 hover:text-rose-500 transition-colors shrink-0">
                          {item.checked ? (
                            <CheckSquare size={14} style={{ color: themeColor }} className="fill-slate-50" />
                          ) : (
                            <Square size={14} />
                          )}
                        </button>
                        <span className={`text-[11px] font-medium leading-tight select-none ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Table Block
            if (layer.type === 'table') {
              const themeColor = layer.metadata?.color || '#1e3a8a';
              const headers = layer.metadata?.headers || [];
              const rows = layer.metadata?.rows || [];

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                  }}
                  className={`absolute cursor-pointer bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 overflow-hidden ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 shrink-0">
                    <TableIcon size={13} style={{ color: themeColor }} />
                    <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">Thông số Kỷ niệm</span>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200">
                          {headers.map((h: string, colIdx: number) => (
                            <th key={colIdx} className="py-1 px-1.5 font-bold text-slate-500 uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row: string[], rowIdx: number) => (
                          <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50/50">
                            {row.map((cell: string, colIdx: number) => {
                              const isEditing = editingCell?.layerId === layer.id && editingCell?.rowIndex === rowIdx && editingCell?.colIndex === colIdx;
                              return (
                                <td 
                                  key={colIdx} 
                                  className="py-1 px-1.5 font-medium text-slate-700"
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCell({ layerId: layer.id, rowIndex: rowIdx, colIndex: colIdx });
                                  }}
                                >
                                  {isEditing ? (
                                    <input
                                      autoFocus
                                      type="text"
                                      defaultValue={cell}
                                      onBlur={(e) => {
                                        handleUpdateTableCell(layer.id, rowIdx, colIdx, e.target.value);
                                        setEditingCell(null);
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleUpdateTableCell(layer.id, rowIdx, colIdx, e.currentTarget.value);
                                          setEditingCell(null);
                                        }
                                        if (e.key === 'Escape') setEditingCell(null);
                                      }}
                                      className="w-full bg-white border border-rose-400 rounded px-1 py-0.5 text-[10px] outline-none"
                                    />
                                  ) : (
                                    <span>{cell}</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            }

            // Timeline Block
            if (layer.type === 'timeline_block') {
              const themeColor = layer.metadata?.color || '#0369a1';
              const events = layer.metadata?.events || [];

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                  }}
                  className={`absolute cursor-pointer bg-white p-3.5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-2 overflow-y-auto ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 shrink-0">
                    <CalendarRange size={13} style={{ color: themeColor }} />
                    <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wider">Hành trình Thời gian</span>
                  </div>
                  <div className="flex-1 relative pl-3.5 border-l border-slate-100 space-y-4 py-1.5 ml-1.5">
                    {events.map((ev: any) => {
                      const isTooltipOpen = activeTimelineTooltip?.layerId === layer.id && activeTimelineTooltip?.eventId === ev.id;
                      return (
                        <div 
                          key={ev.id} 
                          className="relative cursor-pointer group/node"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTimelineTooltip(isTooltipOpen ? null : { layerId: layer.id, eventId: ev.id });
                          }}
                        >
                          <div 
                            className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white transition-all group-hover/node:scale-125 shadow-xs"
                            style={{ backgroundColor: themeColor }}
                          />
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider block" style={{ color: themeColor }}>
                              {ev.time}
                            </span>
                            <span className="text-[11px] font-bold text-slate-800 block group-hover/node:text-rose-500 transition-colors">
                              {ev.title}
                            </span>
                            
                            {/* Detailed Description Tooltip */}
                            {(isTooltipOpen || true) && (
                              <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                                {ev.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Memory Block
            if (layer.type === 'memory_block') {
              const title = layer.metadata?.title || 'Tiêu Đề Kỷ Niệm';
              const content = layer.metadata?.content || 'Mô tả kỷ niệm...';
              const coverImage = layer.metadata?.coverImage || '';
              const mood = layer.metadata?.mood || 'Romantic';
              const date = layer.metadata?.date || '';

              const moodEmoji = mood === 'Romantic' ? '💖' : mood === 'Happy' ? '✨' : mood === 'Excited' ? '🎉' : mood === 'Gentle' ? '🌸' : mood === 'Magical' ? '🪄' : mood === 'Cozy' ? '☕' : '❤️';

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                    transform: `rotate(${layer.rotation || 0}deg)`,
                  }}
                  className={`absolute cursor-pointer bg-white p-3 rounded-2xl shadow-md border border-rose-100/50 flex flex-col gap-2 overflow-hidden ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-rose-300'
                  }`}
                >
                  {coverImage && (
                    <div className="h-[45%] w-full relative overflow-hidden rounded-xl bg-slate-50 shrink-0">
                      <img 
                        src={coverImage} 
                        alt={title} 
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold uppercase tracking-wider">
                        {moodEmoji} {mood}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 flex flex-col justify-between overflow-hidden min-h-0">
                    <div className="space-y-1 min-h-0">
                      <div className="flex items-center justify-between text-[8px] font-bold text-slate-400">
                        <span className="flex items-center gap-0.5 uppercase tracking-wider"><Calendar size={9} /> {date}</span>
                        <span className="bg-rose-50 text-rose-600 px-1 py-0.2 rounded uppercase tracking-wider text-[8px]">KỶ NIỆM VÀNG</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-[11px] leading-tight line-clamp-1">{title}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-3 leading-relaxed break-words">{content}</p>
                    </div>
                    <div className="border-t border-rose-50/60 pt-1.5 mt-1 flex items-center justify-between text-[8px] font-bold text-slate-400 tracking-wider shrink-0 uppercase">
                      <span>🌸 LOVE NOTE GALLERY</span>
                      <span className="text-rose-500">MÃI BÊN NHAU ✨</span>
                    </div>
                  </div>
                </div>
              );
            }

            // AI Block
            if (layer.type === 'ai_block') {
              const prompt = layer.metadata?.prompt || 'Gợi ý lời chúc sinh nhật';
              const suggestion = layer.metadata?.suggestion || 'Bấm nút tạo bên dưới...';
              const status = layer.metadata?.status || 'idle';

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                    onSelectLayer(layer.id, isMulti);
                  }}
                  style={{
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    opacity: layer.opacity ?? 1,
                  }}
                  className={`absolute cursor-pointer bg-slate-900 text-white p-3.5 rounded-2xl shadow-xl border border-white/10 flex flex-col justify-between overflow-hidden ${
                    isSelected ? 'ring-2 ring-rose-500' : 'hover:ring-1 hover:ring-white/20'
                  }`}
                >
                  <div className="space-y-2 min-h-0 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-1.5 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Bot size={13} className="text-rose-400 animate-pulse" />
                        <span className="font-bold text-[9px] text-slate-300 uppercase tracking-widest">Trợ lý Sáng tạo Agnes AI</span>
                      </div>
                      <span className="text-[8px] bg-rose-500/20 text-rose-400 font-bold px-1.5 py-0.5 rounded-full border border-rose-500/30 uppercase tracking-wider">
                        Thông minh 4.0
                      </span>
                    </div>

                    {/* Input Prompt Display */}
                    <div className="bg-white/5 border border-white/5 rounded-lg p-2 shrink-0">
                      <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Yêu cầu khơi nguồn cảm hứng</p>
                      <input 
                        type="text"
                        value={prompt}
                        onChange={(e) => {
                          onUpdateLayer(layer.id, {
                            metadata: { ...layer.metadata, prompt: e.target.value }
                          });
                        }}
                        placeholder="Ví dụ: Gợi ý thơ tình lãng mạn"
                        className="w-full bg-transparent border-none text-[10px] text-white focus:outline-none focus:ring-0 p-0 mt-0.5 placeholder-slate-500 font-medium"
                      />
                    </div>

                    {/* Suggestion Text Display */}
                    <div className="flex-1 overflow-y-auto bg-white/5 border border-white/5 rounded-lg p-2.5 min-h-[50px] flex items-center">
                      <p className="text-[10px] italic text-slate-200 leading-relaxed leading-normal whitespace-pre-wrap w-full">
                        {suggestion}
                      </p>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between shrink-0">
                    <span className="text-[8px] text-slate-400 font-bold tracking-widest uppercase">READY TO GENERATE</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (status === 'generating') return;
                        handleGenerateAISuggestion(layer.id);
                      }}
                      disabled={status === 'generating'}
                      className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:from-rose-500/40 disabled:to-pink-600/40 text-white text-[9px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer select-none"
                    >
                      {status === 'generating' ? (
                        <>
                          <RefreshCw size={10} className="animate-spin" />
                          <span>Đang Viết...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={10} />
                          <span>Tạo Gợi Ý AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            }

            return null;
          })}

        {/* Marquee Selection Rectangle Box */}
        {isMarqueeSelecting && marqueeBox && (
          <div
            style={{
              left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
              top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
              width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
              height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
            }}
            className="absolute border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-lg pointer-events-none z-50"
          />
        )}
      </div>

      {/* Smart Alignment Guides & Distance Indicators */}
      <SmartGuideOverlays
        alignmentLines={smartGuideResult.alignmentLines}
        distanceIndicators={smartGuideResult.distanceIndicators}
        spacingGuides={smartGuideResult.spacingGuides}
        containerWidth={1000}
        containerHeight={650}
        gridEnabled={gridEnabled}
        rulersEnabled={false}
        smartGuidesEnabled={true}
        showCanvasMargin={true}
        selectedItemId={null}
        draggedItemId={null}
        itemBounds={layers.map((l) => ({ id: Number(l.id) || 0, x: l.x, y: l.y, width: l.width, height: l.height }))}
        zoom={viewport.zoom}
        panOffset={{ x: viewport.panX, y: viewport.panY }}
      />

      {/* Selection Bounding Box & Transform Handles */}
      <SelectionOverlay
        selectedLayers={selectedLayers}
        zoom={viewport.zoom}
        panOffset={{ x: viewport.panX, y: viewport.panY }}
        containerWidth={containerRef.current?.clientWidth || 1000}
        containerHeight={containerRef.current?.clientHeight || 650}
        onUpdateLayer={onUpdateLayer}
      />

      {/* Floating Mini Toolbar above selected items */}
      <FloatingMiniToolbar
        selectedLayers={selectedLayers}
        zoom={viewport.zoom}
        panOffset={{ x: viewport.panX, y: viewport.panY }}
        onUpdateLayer={onUpdateLayer}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onGroup={onGroup}
        onUngroup={onUngroup}
        onToggleLock={() => primarySelected && onToggleLock(primarySelected.id)}
        onAIRewrite={onAIRewrite}
      />

      {/* Context Menu */}
      <ContextMenu
        position={contextMenuPos}
        onClose={() => setContextMenuPos(null)}
        selectedLayerIds={selectedLayerIds}
        isLocked={primarySelected?.locked || false}
        isVisible={primarySelected?.visible !== false}
        isGrouped={primarySelected?.type === 'group'}
        onCopy={onCopy}
        onPaste={onPaste}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onToggleLock={() => primarySelected && onToggleLock(primarySelected.id)}
        onToggleVisibility={() => primarySelected && onToggleVisibility(primarySelected.id)}
        onBringToFront={() => primarySelected && onBringToFront(primarySelected.id)}
        onSendToBack={() => primarySelected && onSendToBack(primarySelected.id)}
        onGroup={onGroup}
        onUngroup={onUngroup}
      />
    </div>
  );
};
