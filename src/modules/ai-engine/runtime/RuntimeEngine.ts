import { ExecutionContext } from './ExecutionContext';
import { ExecutionSession } from './ExecutionSession';
import { RuntimeState } from './ExecutionState';
import { workflowPlanner, PlanningResult } from '../creative-workflow/WorkflowPlanner';
import { DependencyResolver } from './DependencyResolver';
import { TaskScheduler } from './TaskScheduler';
import { ReflectionEngine } from '../reflection/ReflectionEngine';
import { ResultAggregator, WorkflowResult } from './ResultAggregator';
import { runtimeEventBus } from './ExecutionEvents';
import { DecisionEngine } from '../reasoning/DecisionEngine';
import { AIControlPlane } from '../aios/AIControlPlane';
import { DecisionOption } from '../reasoning/DecisionScorer';
import { knowledgeEngine } from '../knowledge/KnowledgeEngine';
import { WorkflowTracer } from '../observability/WorkflowTracer';

export class RuntimeEngine {
  private activeContexts = new Map<string, ExecutionContext>();
  private cancellationTokens = new Map<string, { value: boolean }>();

  /**
   * Starts a new autonomous workflow execution session from a user goal.
   */
  public async runGoal(goal: string, userId?: string): Promise<WorkflowResult> {
    const session = ExecutionSession.createSession(`wf-${Date.now()}`, goal, userId);
    this.activeContexts.set(session.sessionId, session);

    const cancelRef = { value: false };
    this.cancellationTokens.set(session.sessionId, cancelRef);

    session.state = RuntimeState.READY;
    ExecutionSession.persist(session);

    runtimeEventBus.emit({
      type: 'WORKFLOW_STARTED',
      sessionId: session.sessionId,
      workflowId: session.workflowId,
      message: `Workflow started for goal: "${goal}"`,
      timestamp: new Date().toISOString()
    });

    try {
      session.state = RuntimeState.RUNNING;
      ExecutionSession.persist(session);

      // 1. Enforce Knowledge retrieval
      const enrichedContextString = await knowledgeEngine.getPromptContextForGoal(goal, userId);
      const enrichedGoal = `${goal}\n\n[System Injected Context]:\n${enrichedContextString}`;

      // 2. Generate Plan DAGs
      const planResult: PlanningResult = await workflowPlanner.plan(enrichedGoal, { userId, userGoal: goal });

      if (!planResult.isValidDAG) {
        throw new Error(`Invalid Plan DAG generated: ${planResult.validationError}`);
      }

      // 3. Reasoning Engine: Evaluate plan options
      const options: DecisionOption[] = [
        {
          id: planResult.workflow.id + '-A',
          name: planResult.workflow.name + ' (Balanced)',
          tasks: planResult.workflow.tasks.map(t => t.id),
          estimatedCostUsd: 0.1,
          estimatedLatencyMs: 15000,
          safetyScore: 0.9,
          qualityScore: 0.8
        }
      ];

      const decisionResult = DecisionEngine.decide({ text: goal, userId: userId }, options);
      decisionResult.trace.log();

      // Update session with decision trace
      session.memory['reasonTrace'] = decisionResult.trace.getTrace();
      ExecutionSession.persist(session);

      // 4. Resolve & Validate DAG batches
      const { isValid, error, batches } = DependencyResolver.validateAndSort(planResult.workflow.tasks);
      if (!isValid) {
        throw new Error(`DAG validation failed: ${error}`);
      }

      // 5. Execute via TaskScheduler
      await WorkflowTracer.trace(session.workflowId, async () => {
        await TaskScheduler.executeBatches(batches, session, cancelRef);
      });

      session.state = RuntimeState.COMPLETED;
      session.endTime = Date.now();
      ExecutionSession.persist(session);

      const result = ResultAggregator.aggregate(session, 'completed');
      
      // Inject reasoning trace into final result
      result.taskOutputs['reasonTrace'] = decisionResult.trace.getTrace();

      // Reflect on the result
      const reflectionTrace = await ReflectionEngine.reflect(session.workflowId, JSON.stringify(result.taskOutputs));
      result.taskOutputs['reflectionTrace'] = reflectionTrace;

      runtimeEventBus.emit({
        type: 'WORKFLOW_FINISHED',
        sessionId: session.sessionId,
        workflowId: session.workflowId,
        message: `Workflow successfully completed.`,
        payload: result,
        timestamp: new Date().toISOString()
      });

      return result;

    } catch (err: any) {
      const isCancelled = cancelRef.value;
      session.state = isCancelled ? RuntimeState.CANCELLED : RuntimeState.FAILED;
      session.endTime = Date.now();
      ExecutionSession.persist(session);

      const status = isCancelled ? 'cancelled' : 'failed';
      const result = ResultAggregator.aggregate(session, status);

      runtimeEventBus.emit({
        type: isCancelled ? 'WORKFLOW_CANCELLED' : 'WORKFLOW_FAILED',
        sessionId: session.sessionId,
        workflowId: session.workflowId,
        message: `Workflow ${status}: ${err.message}`,
        payload: result,
        timestamp: new Date().toISOString()
      });

      if (!isCancelled) {
        throw err;
      }
      return result;

    } finally {
      this.activeContexts.delete(session.sessionId);
      this.cancellationTokens.delete(session.sessionId);
    }
  }

  /**
   * Cancels a running workflow session.
   */
  public cancelSession(sessionId: string): void {
    const cancelRef = this.cancellationTokens.get(sessionId);
    if (cancelRef) {
      cancelRef.value = true;
    }
    const ctx = this.activeContexts.get(sessionId);
    if (ctx) {
      ctx.state = RuntimeState.CANCELLED;
      ExecutionSession.persist(ctx);
    }
  }

  /**
   * Resumes a persisted session from storage.
   */
  public resumeSession(sessionId: string): ExecutionContext | null {
    return ExecutionSession.load(sessionId);
  }
}

export const runtimeEngine = new RuntimeEngine();
