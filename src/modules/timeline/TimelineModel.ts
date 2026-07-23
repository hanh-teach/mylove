export interface Timeline {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: string; // e.g., 'thank_you', 'travel', 'birthday', 'custom'
  status: 'active' | 'archived';
  order: number;
  progress: number; // dynamically computed or stored
  createdAt: string;
  updatedAt: string;
}

export interface TimelineItem {
  id: string;
  timelineId: string;
  title: string;
  description: string;
  assetIds: string[]; // references to ProjectAsset
  memoryIds: string[]; // references to IMemory (from MemoryService)
  draftId: string | null; // e.g., text versions or canvas draft IDs
  workflowId: string | null;
  aiGenerated: boolean;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
