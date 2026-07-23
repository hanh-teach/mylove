import React from 'react';
import { useWorkflowSimulation } from './hooks/useWorkflowSimulation';
import { WorkflowSessionHeader } from './WorkflowSessionHeader';
import { WorkflowProgress } from './WorkflowProgress';
import { WorkflowExecutionGraph } from './WorkflowExecutionGraph';
import { WorkflowTaskInspector } from './WorkflowTaskInspector';
import { WorkflowControls } from './WorkflowControls';
import { WorkflowProviderMonitor } from './WorkflowProviderMonitor';
import { WorkflowMetrics } from './WorkflowMetrics';
import { WorkflowCostCard } from './WorkflowCostCard';
import { WorkflowEventFeed } from './WorkflowEventFeed';
import { WorkflowEmptyState } from './WorkflowEmptyState';

export const WorkflowPanel: React.FC = () => {
  const {
    session,
    selectedTaskId,
    setSelectedTaskId,
    startWorkflow,
    pauseWorkflow,
    resumeWorkflow,
    cancelWorkflow,
    retryWorkflow,
    resetToEmpty
  } = useWorkflowSimulation();

  if (!session) {
    return (
      <div className="p-4 sm:p-6">
        <WorkflowEmptyState onStartWorkflow={startWorkflow} />
      </div>
    );
  }

  const inspectedTask =
    session.tasks.find((t) => t.id === selectedTaskId) ||
    session.tasks.find((t) => t.id === session.currentTaskId) ||
    session.tasks[0];

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-5xl mx-auto">
      {/* 1. Session Header */}
      <WorkflowSessionHeader
        workflowId={session.workflowId}
        goal={session.goal}
        status={session.status}
        startedAt={session.startedAt}
        onReset={resetToEmpty}
      />

      {/* 2. Runtime Progress & Time Counters */}
      <WorkflowProgress
        progress={session.progress}
        elapsedTime={session.elapsedTime}
        estimatedRemaining={session.estimatedRemaining}
      />

      {/* 3. Interactive Controls */}
      <WorkflowControls
        status={session.status}
        onPause={pauseWorkflow}
        onResume={resumeWorkflow}
        onCancel={cancelWorkflow}
        onRetry={retryWorkflow}
      />

      {/* 4. Execution Graph (DAG) */}
      <WorkflowExecutionGraph
        tasks={session.tasks}
        selectedTaskId={selectedTaskId}
        onSelectTask={(id) => setSelectedTaskId(id)}
      />

      {/* 5. Task Inspector */}
      <WorkflowTaskInspector task={inspectedTask} />

      {/* 6. Provider Monitor */}
      <WorkflowProviderMonitor providers={session.providers} />

      {/* 7. Mini Metrics */}
      <WorkflowMetrics metrics={session.metrics} />

      {/* 8. Cost & Time Breakdown */}
      <WorkflowCostCard costs={session.costs} timeSummary={session.timeSummary} />

      {/* 9. Runtime Event Feed */}
      <WorkflowEventFeed events={session.timeline} />
    </div>
  );
};
