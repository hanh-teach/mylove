import { Operation } from 'fast-json-patch';

export type VersionPatch = Operation;

export type VersionTag = 'Milestone' | 'Auto-Save' | 'Manual' | 'Pre-Export' | 'System';

export interface ProjectVersion {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  tag?: VersionTag;
  author?: string;
  isProtected?: boolean;
  createdAt: number;
  type: 'snapshot' | 'diff';
  data: any | VersionPatch[]; // Full Project Document State if snapshot, patches if diff
  parentVersionId?: string; // ID of the version this diff applies to
}
