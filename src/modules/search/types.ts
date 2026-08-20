import { AppTabType } from '../../components/shell/ApplicationShell';

export type SearchItemType = 'project' | 'document' | 'timeline' | 'memory' | 'asset' | 'template' | 'setting' | 'chat';

export interface SearchItem {
  id: string;
  type: SearchItemType;
  title: string;
  description?: string;
  icon: string;
  path?: string;
  tabType?: AppTabType;
}

export interface CommandItem {
  id: string;
  title: string;
  category: 'Projects' | 'Editor' | 'Insert' | 'AI' | 'Export' | 'Print' | 'Workspace';
  action: () => void;
  shortcut?: string;
}
