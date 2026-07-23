import { useState, useEffect } from 'react';
import { runtimeEventBus, RuntimeEvent } from '../modules/ai-engine/runtime/ExecutionEvents';
import { reflectionEventBus, ReflectionEvent } from '../modules/ai-engine/reflection/ReflectionEvents';
import { memoryEventBus, MemoryEvent } from '../modules/ai-engine/knowledge/MemoryEvents';
import { KnowledgeRegistry } from '../modules/ai-engine/knowledge/KnowledgeRegistry';
import { LearningRecorder } from '../modules/ai-engine/reflection/LearningRecorder';
import { knowledgeEngine } from '../modules/ai-engine/knowledge/KnowledgeEngine';

export interface TimelineEvent {
  id: string;
  timestamp: string;
  message: string;
  type: string;
  source: 'runtime' | 'reflection' | 'memory';
  payload?: any;
}

export function useAIState() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [memories, setMemories] = useState<any[]>([]);
  const [reflections, setReflections] = useState<any[]>([]);
  const [inspectorData, setInspectorData] = useState<any>({});

  const addEvent = (event: Omit<TimelineEvent, 'id'>) => {
    setEvents(prev => [...prev, { ...event, id: Math.random().toString(36).substr(2, 9) }].slice(-100)); // Keep last 100
  };

  const updateMemories = () => {
    setMemories(KnowledgeRegistry.getAllItems().filter(m => m.type !== 'policy')); // Hide policy from UI
  };

  const updateReflections = () => {
    setReflections(LearningRecorder.getRecentTraces());
  };

  useEffect(() => {
    // Seed initial data if empty to show MVP functionality
    if (KnowledgeRegistry.getAllItems().length === 0) {
      knowledgeEngine.seedDefaultTemplates('demo-user').then(() => {
        updateMemories();
      }).catch(console.error);
    } else {
      updateMemories();
    }
    
    updateReflections();

    const unsubRuntime = runtimeEventBus.subscribe((event: RuntimeEvent) => {
      addEvent({
        timestamp: event.timestamp || new Date().toISOString(),
        message: event.message || `Event: ${event.type}`,
        type: event.type,
        source: 'runtime',
        payload: event.payload
      });
      
      setInspectorData(prev => ({
        ...prev,
        workflowId: event.workflowId || prev.workflowId,
        provider: event.payload?.provider || prev.provider,
        latency: event.payload?.latency || prev.latency,
        cost: (prev.cost || 0) + (event.payload?.usage?.costEstimate || 0),
        tokens: (prev.tokens || 0) + (event.payload?.usage?.totalTokens || 0)
      }));
    });

    const unsubReflection = reflectionEventBus.subscribe((event: ReflectionEvent) => {
      addEvent({
        timestamp: event.timestamp || new Date().toISOString(),
        message: event.message || `Reflection: ${event.type}`,
        type: event.type,
        source: 'reflection',
        payload: event.trace
      });
      updateReflections();
    });

    const unsubMemory = memoryEventBus.subscribe((event: MemoryEvent) => {
      addEvent({
        timestamp: event.timestamp || new Date().toISOString(),
        message: event.message || `Memory: ${event.type}`,
        type: event.type,
        source: 'memory',
        payload: event.itemId
      });
      updateMemories();
    });

    return () => {
      unsubRuntime();
      unsubReflection();
      unsubMemory();
    };
  }, []);

  return { events, memories, reflections, inspectorData };
}
