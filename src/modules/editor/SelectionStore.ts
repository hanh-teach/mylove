export type SelectionStoreListener = (selectedIds: string[]) => void;

export class SelectionStore {
  private selectedIds: Set<string> = new Set();
  private listeners: Set<SelectionStoreListener> = new Set();

  /**
   * Get currently selected layer IDs
   */
  public getSelectedIds(): string[] {
    return Array.from(this.selectedIds);
  }

  /**
   * Check if a layer is selected
   */
  public isSelected(id: string): boolean {
    return this.selectedIds.has(id);
  }

  /**
   * Set the exact selection of layer IDs
   */
  public setSelectedIds(ids: string[]): void {
    this.selectedIds = new Set(ids);
    this.notify();
  }

  /**
   * Add a layer to the selection
   */
  public select(id: string): void {
    if (!this.selectedIds.has(id)) {
      this.selectedIds.add(id);
      this.notify();
    }
  }

  /**
   * Remove a layer from the selection
   */
  public deselect(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
      this.notify();
    }
  }

  /**
   * Toggle the selection status of a layer ID
   */
  public toggle(id: string): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.notify();
  }

  /**
   * Clear the entire selection
   */
  public clear(): void {
    if (this.selectedIds.size > 0) {
      this.selectedIds.clear();
      this.notify();
    }
  }

  /**
   * Subscribe to selection changes
   */
  public subscribe(listener: SelectionStoreListener): () => void {
    this.listeners.add(listener);
    // Notify immediately with current selection state
    listener(this.getSelectedIds());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const idsSnapshot = this.getSelectedIds();
    this.listeners.forEach(listener => {
      try {
        listener(idsSnapshot);
      } catch (err) {
        console.error('[SelectionStore] Error invoking listener:', err);
      }
    });
  }
}

export const selectionStore = new SelectionStore();
