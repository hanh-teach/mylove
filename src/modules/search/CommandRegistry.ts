import { CommandItem } from './types';

export const CommandRegistry: CommandItem[] = [
  { id: 'new-project', title: 'New Project', category: 'Projects', action: () => window.dispatchEvent(new CustomEvent('trigger-new-project-dialog')) },
  { id: 'open-timeline', title: 'Open Timeline', category: 'Workspace', action: () => console.log('Open Timeline') },
  { id: 'insert-image', title: 'Insert Image', category: 'Insert', action: () => console.log('Insert Image') },
  { id: 'export-pdf', title: 'Export PDF', category: 'Export', action: () => console.log('Export PDF') },
];
