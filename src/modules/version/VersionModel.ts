export type VersionPatch = any; // Placeholder for standard JSON Patch (RFC 6902)

export interface ProjectVersion {
  id: string;
  projectId: string;
  name: string;
  createdAt: number;
  type: 'snapshot' | 'diff';
  data: any | VersionPatch[]; // Full Project Document State if snapshot, patches if diff
  parentVersionId?: string; // ID of the version this diff applies to
}
