import { ILayer } from '../LayerTypes';

export class UndoRedoUseCase {
  static pushHistory(
    history: ILayer[][],
    redoStack: ILayer[][],
    currentLayers: ILayer[]
  ): { newHistory: ILayer[][]; newRedoStack: ILayer[][] } {
    const newHistory = [...history, currentLayers];
    const newRedoStack: ILayer[][] = [];
    return { newHistory, newRedoStack };
  }

  static undo(
    history: ILayer[][],
    redoStack: ILayer[][],
    currentLayers: ILayer[]
  ): { previousLayers: ILayer[] | null; newHistory: ILayer[][]; newRedoStack: ILayer[][] } {
    if (history.length === 0) return { previousLayers: null, newHistory: history, newRedoStack: redoStack };
    const previousLayers = history[history.length - 1];
    const newHistory = history.slice(0, history.length - 1);
    const newRedoStack = [currentLayers, ...redoStack];
    return { previousLayers, newHistory, newRedoStack };
  }

  static redo(
    history: ILayer[][],
    redoStack: ILayer[][],
    currentLayers: ILayer[]
  ): { nextLayers: ILayer[] | null; newHistory: ILayer[][]; newRedoStack: ILayer[][] } {
    if (redoStack.length === 0) return { nextLayers: null, newHistory: history, newRedoStack: redoStack };
    const nextLayers = redoStack[0];
    const newRedoStack = redoStack.slice(1);
    const newHistory = [...history, currentLayers];
    return { nextLayers, newHistory, newRedoStack };
  }
}
