import { ILayer } from '../LayerTypes';

export class CanvasLayerMetadataUseCase {
  static toggleCheckListItem(layer: ILayer, itemId: string): Partial<ILayer> | null {
    if (!layer.metadata?.items) return null;
    const updatedItems = layer.metadata.items.map((item: any) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    return {
      metadata: { ...layer.metadata, items: updatedItems },
    };
  }

  static updateTableCell(
    layer: ILayer,
    rowIndex: number,
    colIndex: number,
    text: string
  ): Partial<ILayer> | null {
    if (!layer.metadata?.rows) return null;
    const updatedRows = layer.metadata.rows.map((row: any[], rIdx: number) => {
      if (rIdx !== rowIndex) return row;
      return row.map((cellText, cIdx) => (cIdx === colIndex ? text : cellText));
    });
    return {
      metadata: { ...layer.metadata, rows: updatedRows },
    };
  }

  static setAISuggestionState(
    layer: ILayer,
    status: 'generating' | 'success' | 'error',
    suggestion: string,
    isSimulated?: boolean
  ): Partial<ILayer> {
    return {
      metadata: {
        ...layer.metadata,
        status,
        suggestion,
        ...(isSimulated !== undefined ? { isSimulated } : {}),
      },
    };
  }
}
