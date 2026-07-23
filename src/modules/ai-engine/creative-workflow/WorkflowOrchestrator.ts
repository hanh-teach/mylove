import { WorkflowDefinition } from './WorkflowDefinition';
import { workflowPlanner, PlanningContext, PlanningResult } from './WorkflowPlanner';
import { taskExecutor, TaskExecutionProgress } from './TaskExecutor';
import { DecisionEngine } from '../reasoning/DecisionEngine';
import { DecisionOption } from '../reasoning/DecisionScorer';
import { KnowledgeEngine, knowledgeEngine } from '../knowledge/KnowledgeEngine';
import { runtimeEngine } from '../runtime/RuntimeEngine';
import { AgentCoordinator } from '../agents/AgentCoordinator';
import { AIControlPlane } from '../aios/AIControlPlane';

export interface WorkflowExecutionResult {
  workflowId: string;
  status: 'completed' | 'failed';
  taskOutputs: Record<string, any>;
  durationMs: number;
  error?: string;
  reasonTrace?: any;
}

export class WorkflowOrchestrator {
  /**
   * High-level entry point: plans and executes an AI workflow autonomously from a user goal.
   */
  public async planAndExecuteGoal(
    userGoal: string, 
    context?: PlanningContext,
    onProgress?: (progress: TaskExecutionProgress) => void
  ): Promise<WorkflowExecutionResult> {
    const startTime = Date.now();
    
    // Attempt Agent Society Coordination
    const societyResult = await AgentCoordinator.coordinate(userGoal, context);
    console.log(`[WorkflowOrchestrator] Agent Society Coordination Result:`, societyResult);

    // Continue with existing pipeline if coordination was not fully autonomous yet
    console.log(`[WorkflowOrchestrator] Goal Analysis & Reasoning for: "${userGoal}"`);

    // 1. Knowledge Retrieval
    const enrichedContextString = await knowledgeEngine.getPromptContextForGoal(userGoal, context?.userId);
    const enrichedGoal = `${userGoal}\n\n[System Injected Context]:\n${enrichedContextString}`;

    // 2. Planning Engine generates multiple options based on the enriched goal
    // Note: To truly support multiple options, we can simulate planner generating variations.
    // For now, we get one plan, and mock a few variations to feed into the Reasoning Engine.
    const planResultA: PlanningResult = await workflowPlanner.plan(enrichedGoal, context);
    
    if (!planResultA.isValidDAG) {
      throw new Error(`Planning failed - invalid DAG: ${planResultA.validationError}`);
    }

    const options: DecisionOption[] = [
      {
        id: planResultA.workflow.id + '-A',
        name: planResultA.workflow.name + ' (Balanced)',
        tasks: planResultA.workflow.tasks.map(t => t.id),
        estimatedCostUsd: 0.1,
        estimatedLatencyMs: 15000,
        safetyScore: 0.9,
        qualityScore: 0.8
      },
      {
        id: planResultA.workflow.id + '-B',
        name: planResultA.workflow.name + ' (Fast/Cheap)',
        tasks: planResultA.workflow.tasks.map(t => t.id),
        estimatedCostUsd: 0.01,
        estimatedLatencyMs: 5000,
        safetyScore: 0.9,
        qualityScore: 0.5
      },
      {
        id: planResultA.workflow.id + '-C',
        name: planResultA.workflow.name + ' (Premium)',
        tasks: planResultA.workflow.tasks.map(t => t.id),
        estimatedCostUsd: 0.5,
        estimatedLatencyMs: 40000,
        safetyScore: 0.95,
        qualityScore: 0.98
      }
    ];

    // 3. Reasoning & Decision Engine
    const decisionResult = DecisionEngine.decide({ text: userGoal, userId: context?.userId }, options, {
      maxBudgetUsd: 0.4,
      maxLatencyMs: 30000
    });

    decisionResult.trace.log();

    console.log(`[WorkflowOrchestrator] Decision Selected: "${decisionResult.selected.name}" - Routing to Runtime.`);

    // 4. Runtime Execution
    // For actual implementation, we might alter the workflow definition based on the decision.
    // Here we proceed with the generated valid plan.
    try {
      const taskOutputs = await taskExecutor.executeBatches(planResultA.executionBatches, onProgress);
      const durationMs = Date.now() - startTime;

      return {
        workflowId: decisionResult.selected.id,
        status: 'completed',
        taskOutputs,
        durationMs,
        reasonTrace: decisionResult.trace.getTrace()
      };
    } catch (err: any) {
      return {
        workflowId: planResultA.workflow.id,
        status: 'failed',
        taskOutputs: {},
        durationMs: Date.now() - startTime,
        error: err.message || 'Workflow execution failed',
        reasonTrace: decisionResult.trace.getTrace()
      };
    }
  }

  public async execute(workflow: WorkflowDefinition) {
    console.log(`[WorkflowOrchestrator] Executing workflow: ${workflow.name}`);
    return await taskExecutor.execute(workflow.tasks);
  }
}

export const workflowOrchestrator = new WorkflowOrchestrator();

