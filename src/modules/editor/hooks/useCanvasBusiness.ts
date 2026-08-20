import React, { useState, useRef, useCallback } from 'react';
import { ILayer } from '../LayerTypes';
import { ViewportTransform } from '../ZoomEngine';
import { CanvasSelectionUseCase, MarqueeBox } from '../usecases/CanvasSelectionUseCase';
import { CanvasViewportUseCase } from '../usecases/CanvasViewportUseCase';
import { CanvasInteractionUseCase } from '../usecases/CanvasInteractionUseCase';
import { CanvasLayerMetadataUseCase } from '../usecases/CanvasLayerMetadataUseCase';
import { GenerateCanvasAISuggestionUseCase } from '../usecases/GenerateCanvasAISuggestionUseCase';
import { ContextMenuPosition } from '../../../components/editor/ContextMenu';

export interface UseCanvasBusinessParams {
  layers: ILayer[];
  viewport: ViewportTransform;
  onViewportChange: (viewport: ViewportTransform) => void;
  onSelectMultipleLayers?: (ids: string[]) => void;
  onClearSelection: () => void;
  onUpdateLayer: (id: string, updates: Partial<ILayer>) => void;
  onAddLayerFromDrop?: (layerData: any) => void;
}

export function useCanvasBusiness({
  layers,
  viewport,
  onViewportChange,
  onSelectMultipleLayers,
  onClearSelection,
  onUpdateLayer,
  onAddLayerFromDrop,
}: UseCanvasBusinessParams) {
  const [isPanning, setIsPanning] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [editingTextLayerId, setEditingTextLayerId] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<{ layerId: string; rowIndex: number; colIndex: number } | null>(null);
  const [activeTimelineTooltip, setActiveTimelineTooltip] = useState<{ layerId: string; eventId: string } | null>(null);
  const [isMarqueeSelecting, setIsMarqueeSelecting] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<MarqueeBox | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<ContextMenuPosition | null>(null);

  const panStartRef = useRef<{ pointerX: number; pointerY: number; panX: number; panY: number }>({
    pointerX: 0,
    pointerY: 0,
    panX: 0,
    panY: 0,
  });

  const handleWheel = useCallback(
    (e: React.WheelEvent, containerRect: DOMRect | null) => {
      e.preventDefault();
      if (!containerRect) return;

      const pointerX = e.clientX - containerRect.left;
      const pointerY = e.clientY - containerRect.top;

      if (e.ctrlKey || e.metaKey) {
        const updated = CanvasViewportUseCase.handleWheelZoom(viewport, e.deltaY, pointerX, pointerY);
        onViewportChange(updated);
      } else {
        const updated = CanvasViewportUseCase.handleWheelPan(viewport, e.deltaX, e.deltaY);
        onViewportChange(updated);
      }
    },
    [viewport, onViewportChange]
  );

  const startPanning = useCallback(
    (e: React.PointerEvent) => {
      setIsPanning(true);
      panStartRef.current = {
        pointerX: e.clientX,
        pointerY: e.clientY,
        panX: viewport.panX,
        panY: viewport.panY,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [viewport]
  );

  const startMarquee = useCallback(
    (e: React.PointerEvent, artboardRect: DOMRect) => {
      setEditingTextLayerId(null);
      const pos = CanvasInteractionUseCase.calculateCanvasPointerPosition(
        e.clientX,
        e.clientY,
        artboardRect,
        viewport.zoom
      );

      setIsMarqueeSelecting(true);
      setMarqueeBox({
        startX: pos.x,
        startY: pos.y,
        currentX: pos.x,
        currentY: pos.y,
      });

      if (!e.shiftKey && !e.ctrlKey) {
        onClearSelection();
      }
    },
    [viewport.zoom, onClearSelection]
  );

  const updatePointerMove = useCallback(
    (e: React.PointerEvent, artboardRect: DOMRect | null) => {
      if (isPanning) {
        const dx = e.clientX - panStartRef.current.pointerX;
        const dy = e.clientY - panStartRef.current.pointerY;
        const updated = CanvasViewportUseCase.calculatePointerPan(
          panStartRef.current.panX,
          panStartRef.current.panY,
          dx,
          dy
        );
        onViewportChange({
          ...viewport,
          ...updated,
        });
        return;
      }

      if (isMarqueeSelecting && marqueeBox && artboardRect) {
        const pos = CanvasInteractionUseCase.calculateCanvasPointerPosition(
          e.clientX,
          e.clientY,
          artboardRect,
          viewport.zoom
        );

        const currentBox: MarqueeBox = { ...marqueeBox, currentX: pos.x, currentY: pos.y };
        setMarqueeBox(currentBox);

        const intersectedIds = CanvasSelectionUseCase.getIntersectedLayerIds(layers, currentBox);
        if (onSelectMultipleLayers && intersectedIds.length > 0) {
          onSelectMultipleLayers(intersectedIds);
        }
      }
    },
    [isPanning, isMarqueeSelecting, marqueeBox, viewport, layers, onViewportChange, onSelectMultipleLayers]
  );

  const endPointer = useCallback(() => {
    if (isPanning) setIsPanning(false);
    if (isMarqueeSelecting) {
      setIsMarqueeSelecting(false);
      setMarqueeBox(null);
    }
  }, [isPanning, isMarqueeSelecting]);

  const handleAssetDrop = useCallback(
    (e: React.DragEvent, artboardRect: DOMRect) => {
      e.preventDefault();
      try {
        const rawData = e.dataTransfer.getData('application/json');
        if (!rawData) return;
        const assetData = JSON.parse(rawData);
        const coords = CanvasInteractionUseCase.calculateDropPosition(
          e.clientX,
          e.clientY,
          artboardRect,
          viewport.zoom
        );
        if (onAddLayerFromDrop) {
          onAddLayerFromDrop({ ...assetData, ...coords });
        }
      } catch (err) {
        console.error('Lỗi thả asset vào canvas:', err);
      }
    },
    [viewport.zoom, onAddLayerFromDrop]
  );

  const handleToggleCheckItem = useCallback(
    (layerId: string, itemId: string) => {
      const targetLayer = layers.find((l) => l.id === layerId);
      if (!targetLayer) return;
      const updates = CanvasLayerMetadataUseCase.toggleCheckListItem(targetLayer, itemId);
      if (updates) onUpdateLayer(layerId, updates);
    },
    [layers, onUpdateLayer]
  );

  const handleUpdateTableCell = useCallback(
    (layerId: string, rowIndex: number, colIndex: number, text: string) => {
      const targetLayer = layers.find((l) => l.id === layerId);
      if (!targetLayer) return;
      const updates = CanvasLayerMetadataUseCase.updateTableCell(targetLayer, rowIndex, colIndex, text);
      if (updates) onUpdateLayer(layerId, updates);
    },
    [layers, onUpdateLayer]
  );

  const handleGenerateAISuggestion = useCallback(
    async (layerId: string) => {
      const targetLayer = layers.find((l) => l.id === layerId);
      if (!targetLayer) return;
      await GenerateCanvasAISuggestionUseCase.execute(targetLayer, onUpdateLayer);
    },
    [layers, onUpdateLayer]
  );

  return {
    isPanning,
    isSpacePressed,
    setIsSpacePressed,
    editingTextLayerId,
    setEditingTextLayerId,
    editingCell,
    setEditingCell,
    activeTimelineTooltip,
    setActiveTimelineTooltip,
    isMarqueeSelecting,
    marqueeBox,
    contextMenuPos,
    setContextMenuPos,
    handleWheel,
    startPanning,
    startMarquee,
    updatePointerMove,
    endPointer,
    handleAssetDrop,
    handleToggleCheckItem,
    handleUpdateTableCell,
    handleGenerateAISuggestion,
  };
}
