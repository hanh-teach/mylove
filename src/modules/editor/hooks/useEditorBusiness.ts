import { useState, useCallback } from 'react';
import { ILayer } from '../LayerTypes';
import { ViewportTransform } from '../ZoomEngine';
import { LoadEditorDraftUseCase } from '../usecases/LoadEditorDraftUseCase';
import { SaveEditorDraftUseCase } from '../usecases/SaveEditorDraftUseCase';
import { LayerOperationsUseCase } from '../usecases/LayerOperationsUseCase';
import { UndoRedoUseCase } from '../usecases/UndoRedoUseCase';
import { ExportEditorUseCase } from '../usecases/ExportEditorUseCase';
import { ZoomViewportUseCase } from '../usecases/ZoomViewportUseCase';
import { NoteDocument } from '../../../components/editor/DocumentModel';
import { ExportOptions } from '../../export/ExportTypes';

export function useEditorBusiness(initialLayers: ILayer[]) {
  const [layers, setLayers] = useState<ILayer[]>(initialLayers);
  const [history, setHistory] = useState<ILayer[][]>([]);
  const [redoStack, setRedoStack] = useState<ILayer[][]>([]);
  const [viewport, setViewport] = useState<ViewportTransform>({ zoom: 0.85, panX: 0, panY: 0 });

  const recordState = useCallback(() => {
    const res = UndoRedoUseCase.pushHistory(history, redoStack, layers);
    setHistory(res.newHistory);
    setRedoStack(res.newRedoStack);
  }, [history, redoStack, layers]);

  const handleAddLayer = useCallback((newLayer: ILayer) => {
    recordState();
    setLayers(prev => LayerOperationsUseCase.addLayer(prev, newLayer));
  }, [recordState]);

  const handleUpdateLayer = useCallback((layerId: string, updates: Partial<ILayer>) => {
    recordState();
    setLayers(prev => LayerOperationsUseCase.updateLayer(prev, layerId, updates));
  }, [recordState]);

  const handleRemoveLayer = useCallback((layerId: string) => {
    recordState();
    setLayers(prev => LayerOperationsUseCase.removeLayer(prev, layerId));
  }, [recordState]);

  const handleUndo = useCallback(() => {
    const res = UndoRedoUseCase.undo(history, redoStack, layers);
    if (res.previousLayers) {
      setRedoStack(res.newRedoStack);
      setHistory(res.newHistory);
      setLayers(res.previousLayers);
    }
  }, [history, redoStack, layers]);

  const handleRedo = useCallback(() => {
    const res = UndoRedoUseCase.redo(history, redoStack, layers);
    if (res.nextLayers) {
      setHistory(res.newHistory);
      setRedoStack(res.newRedoStack);
      setLayers(res.nextLayers);
    }
  }, [history, redoStack, layers]);

  const handleZoomIn = useCallback(() => {
    setViewport(prev => ZoomViewportUseCase.zoomIn(prev));
  }, []);

  const handleZoomOut = useCallback(() => {
    setViewport(prev => ZoomViewportUseCase.zoomOut(prev));
  }, []);

  const handleResetZoom = useCallback(() => {
    setViewport(prev => ZoomViewportUseCase.resetZoom(prev));
  }, []);

  const handleFitScreen = useCallback((w: number, h: number) => {
    setViewport(ZoomViewportUseCase.fitToScreen(w, h));
  }, []);

  const saveDraft = useCallback(async (doc: NoteDocument) => {
    await SaveEditorDraftUseCase.execute(doc);
  }, []);

  const loadDraft = useCallback(async () => {
    return await LoadEditorDraftUseCase.execute();
  }, []);

  const exportProject = useCallback(async (projectId: string, data: any, options: ExportOptions) => {
    return await ExportEditorUseCase.execute(projectId, data, options);
  }, []);

  return {
    layers,
    setLayers,
    viewport,
    setViewport,
    handleAddLayer,
    handleUpdateLayer,
    handleRemoveLayer,
    handleUndo,
    handleRedo,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    handleFitScreen,
    saveDraft,
    loadDraft,
    exportProject,
  };
}
