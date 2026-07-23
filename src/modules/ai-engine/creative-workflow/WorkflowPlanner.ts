import { WorkflowDefinition } from './WorkflowDefinition';
import { TaskDefinition } from './TaskDefinition';
import { intentAnalyzer } from './IntentAnalyzer';
import { GoalAnalyzer } from '../reasoning/GoalAnalyzer';

export interface PlanningContext {
  userId?: string;
  projectId?: string;
  userGoal: string;
  options?: Record<string, any>;
}

export interface PlanningResult {
  workflow: WorkflowDefinition;
  executionBatches: TaskDefinition[][];
  totalEstimatedTasks: number;
  estimatedCostToken?: number;
  isValidDAG: boolean;
  validationError?: string;
}

export class WorkflowPlanner {
  /**
   * Generates a multi-step task DAG plan from a user goal.
   */
  public async plan(goal: string, context?: PlanningContext): Promise<PlanningResult> {
    const intent = await intentAnalyzer.analyze(goal);
    const reasoningGoalAnalysis = GoalAnalyzer.analyze({ text: goal, userId: context?.userId });
    
    const tasks = this.decomposeTaskGraph(goal, intent, context, reasoningGoalAnalysis);
    
    const { isValid, error, sortedBatches } = this.validateAndSortDAG(tasks);

    const workflow: WorkflowDefinition = {
      id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: `AI Plan: ${goal.substring(0, 30)}...`,
      description: `Autonomous plan for goal: "${goal}"`,
      category: intent.occasion || 'Romantic',
      trigger: 'ai_planner',
      tasks,
      conditions: [],
      priority: 1,
      timeout: 120000,
      retry: { maxRetries: 3, backoff: 'exponential' },
      version: '2.0.0',
      metadata: {
        intent,
        reasoningGoalAnalysis,
        context,
        createdAt: new Date().toISOString(),
      }
    };

    return {
      workflow,
      executionBatches: sortedBatches,
      totalEstimatedTasks: tasks.length,
      estimatedCostToken: tasks.length * 250,
      isValidDAG: isValid,
      validationError: error
    };
  }

  /**
   * Decomposes high-level intent into granular tasks with explicit DAG dependencies.
   */
  private decomposeTaskGraph(goal: string, intent: any, context?: PlanningContext, reasoningAnalysis?: any): TaskDefinition[] {
    const tasks: TaskDefinition[] = [];
    const goalLower = goal.toLowerCase();

    // Task 1: Narrative & Concept Generation (Root Node)
    const taskNarrative: TaskDefinition = {
      id: 'task-1-narrative',
      name: 'Generate Narrative & Theme Concept',
      type: 'text',
      status: 'pending',
      priority: 1,
      input: { goal, occasion: intent.occasion, style: intent.style, emotion: reasoningAnalysis?.emotion },
      dependencies: [],
      retry: { maxRetries: 2, currentRetry: 0 },
      timeout: 15000,
      metadata: { stage: 'ideation' }
    };
    tasks.push(taskNarrative);

    // Task 2: Love Letter Composition (Depends on Narrative)
    const taskLetter: TaskDefinition = {
      id: 'task-2-letter',
      name: 'Compose Personalized Love Letter',
      type: 'text',
      status: 'pending',
      priority: 2,
      input: { theme: intent.theme, emotion: intent.emotion },
      dependencies: ['task-1-narrative'],
      retry: { maxRetries: 2, currentRetry: 0 },
      timeout: 20000,
      metadata: { stage: 'composition' }
    };
    tasks.push(taskLetter);

    // Task 3: Visual Prompt Construction (Depends on Narrative)
    const taskImagePrompt: TaskDefinition = {
      id: 'task-3-image-prompt',
      name: 'Build AI Image Prompts',
      type: 'text',
      status: 'pending',
      priority: 2,
      input: { style: intent.style, occasion: intent.occasion },
      dependencies: ['task-1-narrative'],
      retry: { maxRetries: 2, currentRetry: 0 },
      timeout: 15000,
      metadata: { stage: 'prompting' }
    };
    tasks.push(taskImagePrompt);

    // Task 4: Image Asset Generation (Depends on Image Prompt)
    const taskImageGen: TaskDefinition = {
      id: 'task-4-image-gen',
      name: 'Synthesize Romantic Artwork & Canvas',
      type: 'image',
      status: 'pending',
      priority: 3,
      input: { provider: 'gemini/fal' },
      dependencies: ['task-3-image-prompt'],
      retry: { maxRetries: 3, currentRetry: 0 },
      timeout: 30000,
      metadata: { stage: 'synthesis' }
    };
    tasks.push(taskImageGen);

    // If goal requests video or animation
    if (goalLower.includes('video') || goalLower.includes('phim') || goalLower.includes('animation') || intent.requiredWorkflows?.includes('video')) {
      const taskVideoPrompt: TaskDefinition = {
        id: 'task-5-video-prompt',
        name: 'Build Video Animation Script',
        type: 'text',
        status: 'pending',
        priority: 4,
        input: { motion: 'cinematic gentle pan' },
        dependencies: ['task-4-image-gen'],
        retry: { maxRetries: 2, currentRetry: 0 },
        timeout: 15000,
        metadata: { stage: 'video_script' }
      };
      tasks.push(taskVideoPrompt);

      const taskVideoGen: TaskDefinition = {
        id: 'task-6-video-gen',
        name: 'Render AI Video Clip',
        type: 'video',
        status: 'pending',
        priority: 5,
        input: { provider: 'runway/huggingface' },
        dependencies: ['task-5-video-prompt'],
        retry: { maxRetries: 2, currentRetry: 0 },
        timeout: 60000,
        metadata: { stage: 'rendering' }
      };
      tasks.push(taskVideoGen);
    }

    // Task Final: Guardrail Safety Review & Final Assembly (Depends on all previous tasks)
    const allPrecedingIds = tasks.map(t => t.id);
    const taskAssembly: TaskDefinition = {
      id: 'task-final-assembly',
      name: 'Content Safety Review & Final Assembly',
      type: 'export',
      status: 'pending',
      priority: 10,
      input: {},
      dependencies: allPrecedingIds,
      retry: { maxRetries: 1, currentRetry: 0 },
      timeout: 10000,
      metadata: { stage: 'assembly' }
    };
    tasks.push(taskAssembly);

    return tasks;
  }

  /**
   * Validates DAG integrity (checks for cycles, missing deps) and computes topological execution batches for parallel execution.
   */
  private validateAndSortDAG(tasks: TaskDefinition[]): { isValid: boolean; error?: string; sortedBatches: TaskDefinition[][] } {
    const taskMap = new Map<string, TaskDefinition>();
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();

    for (const task of tasks) {
      taskMap.set(task.id, task);
      inDegree.set(task.id, 0);
      adjList.set(task.id, []);
    }

    for (const task of tasks) {
      for (const depId of task.dependencies) {
        if (!taskMap.has(depId)) {
          return {
            isValid: false,
            error: `Task ${task.id} references non-existent dependency ${depId}`,
            sortedBatches: []
          };
        }
        adjList.get(depId)?.push(task.id);
        inDegree.set(task.id, (inDegree.get(task.id) || 0) + 1);
      }
    }

    // Kahn's algorithm for topological sorting into parallel batches
    const batches: TaskDefinition[][] = [];
    let currentBatch: string[] = [];

    inDegree.forEach((degree, id) => {
      if (degree === 0) currentBatch.push(id);
    });

    let processedCount = 0;

    while (currentBatch.length > 0) {
      const batchTasks = currentBatch.map(id => taskMap.get(id)!);
      batches.push(batchTasks);
      processedCount += currentBatch.length;

      const nextBatch: string[] = [];
      for (const id of currentBatch) {
        const neighbors = adjList.get(id) || [];
        for (const neighbor of neighbors) {
          const newDegree = (inDegree.get(neighbor) || 0) - 1;
          inDegree.set(neighbor, newDegree);
          if (newDegree === 0) {
            nextBatch.push(neighbor);
          }
        }
      }
      currentBatch = nextBatch;
    }

    if (processedCount !== tasks.length) {
      return {
        isValid: false,
        error: 'Circular dependency detected in Task Graph DAG!',
        sortedBatches: []
      };
    }

    return {
      isValid: true,
      sortedBatches: batches
    };
  }
}

export const workflowPlanner = new WorkflowPlanner();

