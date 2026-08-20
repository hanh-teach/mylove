import { ICommand } from './Command';

export type HistoryStoreListener = (state: { canUndo: boolean; canRedo: boolean; undoCount: number; redoCount: number }) => void;

export class HistoryStore {
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];
  private readonly maxSteps: number = 100;
  private listeners: Set<HistoryStoreListener> = new Set();

  /**
   * Pushes a completed command onto the undo stack and clears the redo stack to maintain branching safety
   */
  public push(command: ICommand): void {
    this.undoStack.push(command);
    
    // Clear redo stack on new action to prevent branching issues (standard Photoshop/Figma behavior)
    this.clearRedoStack();

    // Enforce maximum stack limits
    if (this.undoStack.length > this.maxSteps) {
      const removedCommand = this.undoStack.shift();
      // Assist JavaScript garbage collector by explicitly releasing reference if needed
      if (removedCommand) {
        (removedCommand as any)._disposed = true;
      }
    }

    this.notify();
  }

  /**
   * Pops the latest command from the undo stack, returns it, and moves it to the redo stack
   */
  public popUndo(): ICommand | null {
    if (this.undoStack.length === 0) return null;
    const command = this.undoStack.pop() || null;
    if (command) {
      this.redoStack.push(command);
      this.notify();
    }
    return command;
  }

  /**
   * Pops the latest command from the redo stack, returns it, and moves it back to the undo stack
   */
  public popRedo(): ICommand | null {
    if (this.redoStack.length === 0) return null;
    const command = this.redoStack.pop() || null;
    if (command) {
      this.undoStack.push(command);
      this.notify();
    }
    return command;
  }

  /**
   * Check if Undo operation is possible
   */
  public get canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Check if Redo operation is possible
   */
  public get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Returns current counts
   */
  public getCounts() {
    return {
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    };
  }

  /**
   * Clears all history stacks completely
   */
  public clear(): void {
    this.undoStack = [];
    this.clearRedoStack();
    this.notify();
  }

  /**
   * Internal helper to safely clear the redo stack and dereference objects
   */
  private clearRedoStack(): void {
    // Explicitly dereference commands to prevent closure-based memory leaks
    for (const cmd of this.redoStack) {
      try {
        (cmd as any)._disposed = true;
      } catch (e) {}
    }
    this.redoStack = [];
  }

  /**
   * Subscribe to history state changes
   */
  public subscribe(listener: HistoryStoreListener): () => void {
    this.listeners.add(listener);
    // Emit initial state
    listener({
      canUndo: this.canUndo,
      canRedo: this.canRedo,
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const state = {
      canUndo: this.canUndo,
      canRedo: this.canRedo,
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length
    };
    this.listeners.forEach(listener => {
      try {
        listener(state);
      } catch (err) {
        console.error('[HistoryStore] Listener error:', err);
      }
    });
  }
}

export const historyStore = new HistoryStore();
