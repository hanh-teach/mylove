import { WorkflowSessionViewModel, WorkflowTaskViewModel, TimelineItem, ProviderStatus, WorkflowStatus } from './WorkflowViewModel';

export function createInitialWorkflowSession(goal: string = 'Tạo video kỷ niệm'): WorkflowSessionViewModel {
  const workflowId = `WF-${Math.floor(100000 + Math.random() * 900000)}`;
  const nowStr = new Date().toLocaleTimeString([], { hour12: false });

  const tasks: WorkflowTaskViewModel[] = [
    {
      id: 'task-1',
      title: 'Planning',
      description: 'Deconstruct user goal into execution DAG',
      status: 'running',
      progress: 30,
      provider: 'System',
      latency: '0.4s',
      cost: 0.0001,
      retryCount: 0,
      dependencies: [],
      prompt: `Analyze goal: "${goal}" and generate optimal execution sequence.`
    },
    {
      id: 'task-2',
      title: 'Memory',
      description: 'Query vector memory index for relevant anniversary facts',
      status: 'waiting',
      progress: 0,
      provider: 'System',
      latency: '0.0s',
      cost: 0.0002,
      retryCount: 0,
      dependencies: ['task-1'],
      prompt: 'Retrieve top-k relationship memory vectors and anniversary milestones.'
    },
    {
      id: 'task-3',
      title: 'Letter',
      description: 'Generate emotional romantic anniversary story',
      status: 'waiting',
      progress: 0,
      provider: 'Gemini 2.5 Flash',
      latency: '0.0s',
      cost: 0.0037,
      retryCount: 0,
      dependencies: ['task-2'],
      prompt: 'Compose romantic love letter with high emotional resonance.'
    },
    {
      id: 'task-4',
      title: 'Image',
      description: 'Generate high resolution visual memory frames',
      status: 'waiting',
      progress: 0,
      provider: 'Fal.ai (Flux)',
      latency: '0.0s',
      cost: 0.0015,
      retryCount: 0,
      dependencies: ['task-3'],
      prompt: 'Render cinematic couple memory photo in soft romantic lighting.'
    },
    {
      id: 'task-5',
      title: 'Video',
      description: 'Synthesize animated cinematic sequence',
      status: 'waiting',
      progress: 0,
      provider: 'Runway Gen-3',
      latency: '0.0s',
      cost: 0.0120,
      retryCount: 0,
      dependencies: ['task-4'],
      prompt: 'Animate romantic memory frame with ambient particle light effects.'
    },
    {
      id: 'task-6',
      title: 'Reflection',
      description: 'Run critique, emotion and grammar evaluation',
      status: 'waiting',
      progress: 0,
      provider: 'System',
      latency: '0.0s',
      cost: 0.0001,
      retryCount: 0,
      dependencies: ['task-5'],
      prompt: 'Evaluate emotional alignment, grammar, and content safety.'
    },
    {
      id: 'task-7',
      title: 'Export',
      description: 'Compile final media assets & safety verification',
      status: 'waiting',
      progress: 0,
      provider: 'System',
      latency: '0.0s',
      cost: 0.0001,
      retryCount: 0,
      dependencies: ['task-6'],
      prompt: 'Assemble final video and love letter payload package.'
    }
  ];

  const timeline: TimelineItem[] = [
    {
      id: `tl-${Date.now()}-1`,
      timestamp: nowStr,
      message: `Workflow created for goal: "${goal}"`,
      level: 'info'
    },
    {
      id: `tl-${Date.now()}-2`,
      timestamp: nowStr,
      message: 'Planning started: Deconstructing goal into 7 DAG tasks',
      level: 'info'
    }
  ];

  const providers: ProviderStatus[] = [
    { name: 'Gemini', status: 'waiting', latency: '0.0s', cost: 0.0037 },
    { name: 'Runway', status: 'waiting', latency: '0.0s', cost: 0.0120 },
    { name: 'Fal.ai', status: 'waiting', latency: '0.0s', cost: 0.0015 },
    { name: 'System', status: 'running', latency: '0.4s', cost: 0.0001 }
  ];

  return {
    workflowId,
    goal,
    status: 'running',
    startedAt: nowStr,
    progress: 5,
    estimatedRemaining: '00:21',
    elapsedTime: '00:01',
    currentTaskId: 'task-1',
    tasks,
    timeline,
    metrics: {
      totalTasks: 7,
      completed: 0,
      running: 1,
      waiting: 6,
      failed: 0
    },
    costs: {
      gemini: 0,
      runway: 0,
      fal: 0,
      total: 0.0001
    },
    timeSummary: {
      planning: '0.4s',
      memory: '-',
      letter: '-',
      image: '-',
      video: '-',
      reflection: '-',
      export: '-'
    },
    providers
  };
}

export function advanceSimulationStep(
  session: WorkflowSessionViewModel,
  elapsedSeconds: number
): WorkflowSessionViewModel {
  if (session.status !== 'running') {
    return session;
  }

  const tasks = session.tasks.map((t) => ({ ...t }));
  const runningIndex = tasks.findIndex((t) => t.status === 'running');

  // Format elapsed time MM:SS
  const mins = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
  const elapsedTimeStr = `${mins}:${secs}`;

  let newTimeline = [...session.timeline];
  let updatedStatus: WorkflowStatus = session.status;
  let currentTaskId = session.currentTaskId;

  if (runningIndex >= 0) {
    const currentTask = tasks[runningIndex];
    currentTask.progress += 35; // Increment progress for current node

    if (currentTask.progress >= 100) {
      currentTask.progress = 100;
      currentTask.status = 'completed';

      const nowStr = new Date().toLocaleTimeString([], { hour12: false });
      newTimeline.push({
        id: `tl-${Date.now()}`,
        timestamp: nowStr,
        message: `${currentTask.title} task completed (${currentTask.latency})`,
        level: 'success'
      });

      // Move to next waiting task
      const nextIndex = runningIndex + 1;
      if (nextIndex < tasks.length) {
        const nextTask = tasks[nextIndex];
        nextTask.status = 'running';
        nextTask.progress = 20;
        currentTaskId = nextTask.id;

        // Set realistic latency for next task
        if (nextTask.id === 'task-2') nextTask.latency = '0.8s';
        if (nextTask.id === 'task-3') nextTask.latency = '2.1s';
        if (nextTask.id === 'task-4') nextTask.latency = '3.4s';
        if (nextTask.id === 'task-5') nextTask.latency = '4.8s';
        if (nextTask.id === 'task-6') nextTask.latency = '1.2s';
        if (nextTask.id === 'task-7') nextTask.latency = '0.5s';

        newTimeline.push({
          id: `tl-${Date.now() + 1}`,
          timestamp: nowStr,
          message: `${nextTask.title} task started via ${nextTask.provider}`,
          level: 'info'
        });
      } else {
        // All tasks completed!
        updatedStatus = 'completed';
        currentTaskId = null;
        newTimeline.push({
          id: `tl-${Date.now() + 2}`,
          timestamp: nowStr,
          message: 'Workflow successfully finished! Final output ready.',
          level: 'success'
        });
      }
    }
  }

  // Calculate overall metrics & costs
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const runningCount = tasks.filter((t) => t.status === 'running').length;
  const waitingCount = tasks.filter((t) => t.status === 'waiting').length;
  const failedCount = tasks.filter((t) => t.status === 'failed').length;

  const totalProgress = Math.min(
    100,
    Math.round(
      (completedCount * 100 + (tasks.find((t) => t.status === 'running')?.progress || 0)) /
        tasks.length
    )
  );

  const remainingSecs = Math.max(0, 24 - elapsedSeconds);
  const remMins = Math.floor(remainingSecs / 60)
    .toString()
    .padStart(2, '0');
  const remSecs = (remainingSecs % 60).toString().padStart(2, '0');
  const estRemainingStr = `${remMins}:${remSecs}`;

  // Calculate providers status
  const activeTask = tasks.find((t) => t.status === 'running');
  const providers: ProviderStatus[] = [
    {
      name: 'Gemini',
      status:
        activeTask?.provider.includes('Gemini')
          ? 'running'
          : tasks[2].status === 'completed'
          ? 'completed'
          : 'waiting',
      latency: tasks[2].latency,
      cost: tasks[2].cost
    },
    {
      name: 'Runway',
      status:
        activeTask?.provider.includes('Runway')
          ? 'running'
          : tasks[4].status === 'completed'
          ? 'completed'
          : 'waiting',
      latency: tasks[4].latency,
      cost: tasks[4].cost
    },
    {
      name: 'Fal.ai',
      status:
        activeTask?.provider.includes('Fal')
          ? 'running'
          : tasks[3].status === 'completed'
          ? 'completed'
          : 'waiting',
      latency: tasks[3].latency,
      cost: tasks[3].cost
    },
    {
      name: 'System',
      status:
        activeTask?.provider === 'System'
          ? 'running'
          : 'idle',
      latency: '0.4s',
      cost: 0.0001
    }
  ];

  // Cumulative costs
  let geminiCost = 0;
  let runwayCost = 0;
  let falCost = 0;

  if (tasks[2].status !== 'waiting') geminiCost = 0.0037;
  if (tasks[3].status !== 'waiting') falCost = 0.0015;
  if (tasks[4].status !== 'waiting') runwayCost = 0.012;

  const timeSummary = {
    planning: tasks[0].status === 'completed' ? tasks[0].latency : '-',
    memory: tasks[1].status === 'completed' ? tasks[1].latency : '-',
    letter: tasks[2].status === 'completed' ? tasks[2].latency : '-',
    image: tasks[3].status === 'completed' ? tasks[3].latency : '-',
    video: tasks[4].status === 'completed' ? tasks[4].latency : '-',
    reflection: tasks[5].status === 'completed' ? tasks[5].latency : '-',
    export: tasks[6].status === 'completed' ? tasks[6].latency : '-'
  };

  return {
    ...session,
    status: updatedStatus,
    progress: totalProgress,
    elapsedTime: elapsedTimeStr,
    estimatedRemaining: estRemainingStr,
    currentTaskId,
    tasks,
    timeline: newTimeline,
    metrics: {
      totalTasks: tasks.length,
      completed: completedCount,
      running: runningCount,
      waiting: waitingCount,
      failed: failedCount
    },
    costs: {
      gemini: geminiCost,
      runway: runwayCost,
      fal: falCost,
      total: geminiCost + runwayCost + falCost + 0.0003
    },
    timeSummary,
    providers
  };
}
