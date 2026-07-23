import React from 'react';

export type AppTabType = 'home' | 'card' | 'editor' | 'assets' | 'memory' | 'timeline' | 'aistudio' | 'design-system' | 'project-dashboard' | 'people' | 'places' | 'graph' | 'knowledge' | 'automation' | 'collaboration' | 'sync' | 'plugins' | 'marketplace' | 'developer' | 'release' | 'rc' | 'stable' | 'mps' | 'completion';

export interface NavigationItem {
  id: AppTabType | string;
  label: string;
  icon: React.ReactNode;
  tabType?: AppTabType;
  badge?: string;
}

export interface NavigationSection {
  section: string;
  items: NavigationItem[];
}
