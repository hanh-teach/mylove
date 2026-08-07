import { useState, useEffect, useRef } from 'react';
import { WorkflowSessionViewModel } from '../WorkflowViewModel';
import { createInitialWorkflowSession, advanceSimulationStep } from '../WorkflowExecutionSimulator';

export function useWorkflowSimulation() {
  const [session, setSession] = useState<WorkflowSessionViewModel | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const elapsedRef = useRef<number>(0);

  // Initialize with initial workflow session
  useEffect(() => {
    if (!session) {
      const initial = createInitialWorkflowSession('Tạo video kỷ niệm');
      setSession(initial);
      setSelectedTaskId('task-1');
      elapsedRef.current = 1;
    }
  }, []);

  // Update selected task when currentTaskId changes and user hasn't explicitly clicked another
  useEffect(() => {
    if (session && session.currentTaskId && !selectedTaskId) {
      setSelectedTaskId(session.currentTaskId);
    }
  }, [session?.currentTaskId]);

  // Timer loop for simulation
  useEffect(() => {
    if (!session || session.status !== 'running') {
      return;
    }

    const interval = setInterval(() => {
      elapsedRef.current += 1;
      setSession((prev) => {
        if (!prev || prev.status !== 'running') return prev;
        return advanceSimulationStep(prev, elapsedRef.current);
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [session?.status]);

  const startWorkflow = (goal: string) => {
    elapsedRef.current = 0;
    const fresh = createInitialWorkflowSession(goal);
    setSession(fresh);
    setSelectedTaskId('task-1');
  };

  const pauseWorkflow = () => {
    setSession((prev) => {
      if (!prev) return null;
      const updatedTasks = prev.tasks.map((t) =>
        t.status === 'running' ? { ...t, status: 'paused' as const } : t
      );
      return {
        ...prev,
        status: 'paused',
        tasks: updatedTasks,
        timeline: [
          ...prev.timeline,
          {
            id: `tl-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            message: 'Workflow execution paused by user',
            level: 'warning'
          }
        ]
      };
    });
  };

  const resumeWorkflow = () => {
    setSession((prev) => {
      if (!prev) return null;
      const updatedTasks = prev.tasks.map((t) =>
        t.status === 'paused' ? { ...t, status: 'running' as const } : t
      );
      return {
        ...prev,
        status: 'running',
        tasks: updatedTasks,
        timeline: [
          ...prev.timeline,
          {
            id: `tl-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            message: 'Workflow execution resumed',
            level: 'info'
          }
        ]
      };
    });
  };

  const cancelWorkflow = () => {
    setSession((prev) => {
      if (!prev) return null;
      const updatedTasks = prev.tasks.map((t) =>
        t.status === 'running' || t.status === 'paused' ? { ...t, status: 'cancelled' as const } : t
      );
      return {
        ...prev,
        status: 'cancelled',
        tasks: updatedTasks,
        timeline: [
          ...prev.timeline,
          {
            id: `tl-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour12: false }),
            message: 'Workflow execution cancelled by user',
            level: 'error'
          }
        ]
      };
    });
  };

  const retryWorkflow = () => {
    if (session) {
      startWorkflow(session.goal);
    } else {
      startWorkflow('Tạo video kỷ niệm');
    }
  };

  const resetToEmpty = () => {
    setSession(null);
    setSelectedTaskId(null);
    elapsedRef.current = 0;
  };

  return {
    session,
    selectedTaskId,
    setSelectedTaskId,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    retryWorkflow,
    resetToEmpty
  };
}
