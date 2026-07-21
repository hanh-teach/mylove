export type HistoryActionType =
  | 'ADD_LAYER'
  | 'DELETE_LAYER'
  | 'MOVE_LAYER'
  | 'RESIZE_LAYER'
  | 'ROTATE_LAYER'
  | 'CHANGE_COLOR'
  | 'CHANGE_FONT'
  | 'EDIT_TEXT'
  | 'DUPLICATE_LAYER'
  | 'GROUP_LAYERS'
  | 'UNGROUP_LAYERS';

export interface HistoryActionPayload {
  layerId: string;
  previous?: any;
  next?: any;
  // Optional secondary IDs or context (e.g. child IDs for grouping)
  context?: Record<string, any>;
}

export interface HistoryAction {
  type: HistoryActionType;
  payload: HistoryActionPayload;
  timestamp: number;
}
