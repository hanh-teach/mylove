import React from 'react';
import { IMemory, ITag } from '../../modules/memory/MemoryTypes';
import { RelationshipTimelineView } from '../timeline/RelationshipTimelineView';

interface MemoryTimelineViewProps {
  memories?: IMemory[];
  allTags?: ITag[];
  onOpenMemory?: (memory: IMemory) => void;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const MemoryTimelineView: React.FC<MemoryTimelineViewProps> = () => {
  return <RelationshipTimelineView />;
};
