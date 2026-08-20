import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { ILayer } from './LayerTypes';
import { ViewportTransform } from './ZoomEngine';

export interface EditorZustandState {
  layers: ILayer[];
  selectedLayerIds: string[];
  viewport: ViewportTransform;
  isDraftSaving: boolean;
  setLayers: (layers: ILayer[]) => void;
  setSelectedLayerIds: (ids: string[]) => void;
  setViewport: (viewport: ViewportTransform) => void;
  setIsDraftSaving: (isSaving: boolean) => void;
}

export const useEditorZustandStore = create<EditorZustandState>()(
  subscribeWithSelector(
    devtools(
      persist(
        (set) => ({
          layers: [],
          selectedLayerIds: [],
          viewport: { panX: 0, panY: 0, zoom: 1 },
          isDraftSaving: false,

          setLayers: (layers: ILayer[]) => set({ layers }),
          setSelectedLayerIds: (ids: string[]) => set({ selectedLayerIds: ids }),
          setViewport: (viewport: ViewportTransform) => set({ viewport }),
          setIsDraftSaving: (isSaving: boolean) => set({ isDraftSaving: isSaving }),
        }),
        {
          name: 'lovenote_editor_v1',
          // Persist ONLY domain data (layers, viewport). Exclude selectedLayerIds & isDraftSaving.
          partialize: (state) => ({
            layers: state.layers,
            viewport: state.viewport,
          }),
        }
      ),
      { name: 'EditorStore' }
    )
  )
);

// Atomic Selectors
export const selectEditorLayers = (state: EditorZustandState) => state.layers;
export const selectEditorSelectedLayerIds = (state: EditorZustandState) => state.selectedLayerIds;
export const selectEditorViewport = (state: EditorZustandState) => state.viewport;
export const selectEditorIsDraftSaving = (state: EditorZustandState) => state.isDraftSaving;

// Custom Selector Hooks
export const useEditorLayers = () => useEditorZustandStore(selectEditorLayers);
export const useEditorSelectedLayerIds = () => useEditorZustandStore(selectEditorSelectedLayerIds);
export const useEditorViewport = () => useEditorZustandStore(selectEditorViewport);
export const useEditorIsDraftSaving = () => useEditorZustandStore(selectEditorIsDraftSaving);
