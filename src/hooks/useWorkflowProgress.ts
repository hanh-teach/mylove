import { useState, useEffect } from 'react';
import { runtimeEventBus, RuntimeEvent } from '../modules/ai-engine/runtime/ExecutionEvents';
import { reflectionEventBus, ReflectionEvent } from '../modules/ai-engine/reflection/ReflectionEvents';
import { memoryEventBus, MemoryEvent } from '../modules/ai-engine/knowledge/MemoryEvents';

export interface PipelineStep {
  id: string;
  name: string;
  status: 'waiting' | 'running' | 'completed' | 'failed';
}

export interface WorkflowProgressState {
  isActive: boolean;
  sessionId: string | null;
  workflowId: string | null;
  progressPercent: number;
  pipeline: PipelineStep[];
  currentTaskName: string | null;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  durationMs: number;
  startTime: number | null;
}

const DEFAULT_PIPELINE: PipelineStep[] = [
  { id: 'planning', name: 'Planning', status: 'waiting' },
  { id: 'reasoning', name: 'Reasoning', status: 'waiting' },
  { id: 'knowledge', name: 'Knowledge', status: 'waiting' },
  { id: 'memory', name: 'Memory', status: 'waiting' },
  { id: 'runtime', name: 'Runtime', status: 'waiting' },
  { id: 'reflection', name: 'Reflection', status: 'waiting' }
];

export function useWorkflowProgress() {
  const [state, setState] = useState<WorkflowProgressState>({
    isActive: false,
    sessionId: null,
    workflowId: null,
    progressPercent: 0,
    pipeline: DEFAULT_PIPELINE,
    currentTaskName: null,
    status: 'idle',
    durationMs: 0,
    startTime: null,
  });

  useEffect(() => {
    const unsubRuntime = runtimeEventBus.subscribe((event: RuntimeEvent) => {
      setState(prev => {
        const newState = { ...prev };

        if (event.type === 'WORKFLOW_STARTED') {
          return {
            isActive: true,
            sessionId: event.sessionId,
            workflowId: event.workflowId,
            progressPercent: 10,
            pipeline: [
              { id: 'planning', name: 'Planning', status: 'completed' },
              { id: 'reasoning', name: 'Reasoning', status: 'completed' },
              { id: 'knowledge', name: 'Knowledge', status: 'completed' },
              { id: 'memory', name: 'Memory', status: 'completed' },
              { id: 'runtime', name: 'Runtime', status: 'running' },
              { id: 'reflection', name: 'Reflection', status: 'waiting' }
            ],
            currentTaskName: 'Starting tasks...',
            status: 'running',
            durationMs: 0,
            startTime: Date.now(),
          };
        }

        if (event.type === 'TASK_STARTED') {
          if (event.taskName) {
            newState.currentTaskName = event.taskName;
          }
        }

        if (event.type === 'TASK_COMPLETED') {
          if (event.progressPercent !== undefined) {
            // scale 10-90% for runtime
            newState.progressPercent = 10 + (event.progressPercent * 0.8);
          }
        }

        if (event.type === 'WORKFLOW_FINISHED') {
          newState.pipeline = newState.pipeline.map(p => 
            p.id === 'runtime' ? { ...p, status: 'completed' } : p
          );
          newState.currentTaskName = 'Runtime finished';
          newState.progressPercent = 90;
        }

        if (event.type === 'WORKFLOW_FAILED' || event.type === 'WORKFLOW_CANCELLED') {
          newState.status = event.type === 'WORKFLOW_FAILED' ? 'failed' : 'cancelled';
          if (newState.startTime) {
            newState.durationMs = Date.now() - newState.startTime;
          }
          newState.pipeline = newState.pipeline.map(p => 
            p.status === 'running' ? { ...p, status: 'failed' } : p
          );
        }

        return newState;
      });
    });

    const unsubReflection = reflectionEventBus.subscribe((event: ReflectionEvent) => {
       setState(prev => {
         const newState = { ...prev };
         if (event.type === 'REFLECTION_STARTED') {
           newState.pipeline = newState.pipeline.map(p => 
             p.id === 'reflection' ? { ...p, status: 'running' } : p
           );
           newState.currentTaskName = 'Reflecting on results';
           newState.progressPercent = 95;
         }
         if (event.type === 'REFLECTION_COMPLETED') {
           newState.pipeline = newState.pipeline.map(p => 
             p.id === 'reflection' ? { ...p, status: 'completed' } : p
           );
           newState.status = 'completed';
           newState.currentTaskName = 'Workflow Complete';
           newState.progressPercent = 100;
           if (newState.startTime) {
             newState.durationMs = Date.now() - newState.startTime;
           }
         }
         if (event.type === 'REFLECTION_FAILED') {
           newState.pipeline = newState.pipeline.map(p => 
             p.id === 'reflection' ? { ...p, status: 'failed' } : p
           );
           newState.status = 'failed';
           if (newState.startTime) {
             newState.durationMs = Date.now() - newState.startTime;
           }
         }
         return newState;
       });
    });

    return () => {
      unsubRuntime();
      unsubReflection();
    };
  }, []);

  const [elapsedMs, setElapsedMs] = useState(0);
  useEffect(() => {
    let interval: any;
    if (state.status === 'running' && state.startTime) {
      interval = setInterval(() => {
        setElapsedMs(Date.now() - state.startTime!);
      }, 1000);
    } else if (state.status === 'completed' || state.status === 'failed' || state.status === 'cancelled') {
      setElapsedMs(state.durationMs);
    } else {
      setElapsedMs(0);
    }
    return () => clearInterval(interval);
  }, [state.status, state.startTime, state.durationMs]);

  return { ...state, elapsedMs };
}
