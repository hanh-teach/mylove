import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { Timeline, TimelineItem } from './TimelineModel';
import { timelineStore } from './TimelineStore';

export interface TimelineZustandState {
  activeTimeline: Timeline | null;
  items: TimelineItem[];
  setActiveTimeline: (timeline: Timeline | null) => void;
  setItems: (items: TimelineItem[]) => void;
  refreshItems: (timelineId: string) => void;
  addItem: (timelineId: string, itemData: Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt' | 'timelineId'>) => TimelineItem;
  updateItem: (itemId: string, updates: Partial<TimelineItem>) => void;
  deleteItem: (itemId: string) => void;
}

export const useTimelineZustandStore = create<TimelineZustandState>()(
  subscribeWithSelector(
    devtools(
      (set) => ({
        activeTimeline: null,
        items: [],

        setActiveTimeline: (timeline: Timeline | null) => {
          set({ activeTimeline: timeline });
          if (timeline) {
            set({ items: timelineStore.getTimelineItems(timeline.id) });
          } else {
            set({ items: [] });
          }
        },

        setItems: (items: TimelineItem[]) => set({ items }),

        refreshItems: (timelineId: string) => {
          set({ items: timelineStore.getTimelineItems(timelineId) });
        },

        addItem: (timelineId: string, itemData: Omit<TimelineItem, 'id' | 'createdAt' | 'updatedAt' | 'timelineId'>) => {
          const item = timelineStore.addTimelineItem(timelineId, itemData);
          set({ items: timelineStore.getTimelineItems(timelineId) });
          return item;
        },

        updateItem: (itemId: string, updates: Partial<TimelineItem>) => {
          timelineStore.updateTimelineItem(itemId, updates);
          const activeTimeline = useTimelineZustandStore.getState().activeTimeline;
          if (activeTimeline) {
            set({ items: timelineStore.getTimelineItems(activeTimeline.id) });
          }
        },

        deleteItem: (itemId: string) => {
          timelineStore.deleteTimelineItem(itemId);
          const activeTimeline = useTimelineZustandStore.getState().activeTimeline;
          if (activeTimeline) {
            set({ items: timelineStore.getTimelineItems(activeTimeline.id) });
          }
        },
      }),
      { name: 'TimelineStore' }
    )
  )
);

// Atomic Selectors
export const selectActiveTimeline = (state: TimelineZustandState) => state.activeTimeline;
export const selectTimelineItems = (state: TimelineZustandState) => state.items;

// Custom Selector Hooks
export const useActiveTimeline = () => useTimelineZustandStore(selectActiveTimeline);
export const useTimelineItems = () => useTimelineZustandStore(selectTimelineItems);
