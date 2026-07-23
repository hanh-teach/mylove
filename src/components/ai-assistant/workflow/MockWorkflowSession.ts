import { WorkflowSessionViewModel, WorkflowTaskViewModel, TimelineItem } from './WorkflowViewModel';

export const initialMockTasks: WorkflowTaskViewModel[] = [
  {
    id: 'task-1',
    title: 'Planning',
    description: 'Deconstruct user goal into execution DAG',
    status: 'completed',
    progress: 100,
    provider: 'System',
    latency: '0.4s',
    cost: 0.0001,
    retryCount: 0,
    dependencies: []
  },
  {
    id: 'task-2',
    title: 'Memory',
    description: 'Query vector memory index for relevant anniversary facts',
    status: 'completed',
    progress: 100,
    provider: 'System',
    latency: '0.8s',
    cost: 0.0002,
    retryCount: 0,
    dependencies: ['task-1']
  },
  {
    id: 'task-3',
    title: 'Letter',
    description: 'Generate emotional romantic anniversary story',
    status: 'running',
    progress: 68,
    provider: 'Gemini 2.5 Flash',
    latency: '2.1s',
    cost: 0.0037,
    retryCount: 0,
    dependencies: ['task-2']
  },
  {
    id: 'task-4',
    title: 'Image',
    description: 'Generate high resolution visual memory frames',
    status: 'waiting',
    progress: 0,
    provider: 'Fal.ai (Flux)',
    latency: '0.0s',
    cost: 0.0,
    retryCount: 0,
    dependencies: ['task-3']
  },
  {
    id: 'task-5',
    title: 'Video',
    description: 'Synthesize animated cinematic sequence',
    status: 'waiting',
    progress: 0,
    provider: 'Runway Gen-3',
    latency: '0.0s',
    cost: 0.0,
    retryCount: 0,
    dependencies: ['task-4']
  },
  {
    id: 'task-6',
    title: 'Reflection',
    description: 'Run critique, emotion and grammar evaluation',
    status: 'waiting',
    progress: 0,
    provider: 'System',
    latency: '0.0s',
    cost: 0.0,
    retryCount: 0,
    dependencies: ['task-5']
  },
  {
    id: 'task-7',
    title: 'Export',
    description: 'Compile final media assets & safety verification',
    status: 'waiting',
    progress: 0,
    provider: 'System',
    latency: '0.0s',
    cost: 0.0,
    retryCount: 0,
    dependencies: ['task-6']
  }
];

export const initialMockTimeline: TimelineItem[] = [
  { id: 'tl-1', timestamp: '14:21:00', message: 'Workflow created: "Tạo video kỷ niệm"', level: 'info' },
  { id: 'tl-2', timestamp: '14:21:04', message: 'Planning completed in 0.4s', level: 'success' },
  { id: 'tl-3', timestamp: '14:22:12', message: 'Memory search retrieved 4 relevant items', level: 'info' },
  { id: 'tl-4', timestamp: '14:23:05', message: 'Letter generation initiated via Gemini', level: 'info' },
  { id: 'tl-5', timestamp: '14:24:00', message: 'Image waiting for letter completion', level: 'info' }
];

export const getInitialMockSession = (): WorkflowSessionViewModel => {
  const tasks = initialMockTasks;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const runningCount = tasks.filter(t => t.status === 'running').length;
  const waitingCount = tasks.filter(t => t.status === 'waiting').length;
  const failedCount = tasks.filter(t => t.status === 'failed').length;

  return {
    workflowId: 'wf-anniversary-2026',
    goal: 'Tạo video kỷ niệm',
    status: 'running',
    startedAt: '14:21:00',
    progress: 42,
    estimatedRemaining: '00:19',
    elapsedTime: '00:14',
    currentTaskId: 'task-3',
    tasks,
    timeline: initialMockTimeline,
    metrics: {
      totalTasks: tasks.length,
      completed: completedCount,
      running: runningCount,
      waiting: waitingCount,
      failed: failedCount
    },
    costs: {
      gemini: 0.004,
      runway: 0.0,
      fal: 0.0,
      total: 0.004
    },
    timeSummary: {
      planning: '0.4s',
      memory: '0.8s',
      letter: '2.1s',
      image: '-',
      video: '-',
      reflection: '-',
      export: '-'
    },
    providers: [
      { name: 'Gemini', status: 'running', latency: '2.1s', cost: 0.0037 },
      { name: 'Runway', status: 'waiting', latency: '0.0s', cost: 0.0120 },
      { name: 'Fal.ai', status: 'waiting', latency: '0.0s', cost: 0.0015 },
      { name: 'System', status: 'idle', latency: '0.4s', cost: 0.0001 }
    ]
  };
};
