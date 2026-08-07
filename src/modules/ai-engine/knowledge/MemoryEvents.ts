import { knowledgeEventBus, KnowledgeEvent, KnowledgeEventListener, KnowledgeEventType } from './KnowledgeEvents';

export type MemoryEvent = KnowledgeEvent;
export type MemoryEventListener = KnowledgeEventListener;
export type MemoryEventType = KnowledgeEventType;

export const memoryEventBus = knowledgeEventBus;
