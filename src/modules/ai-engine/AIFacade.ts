import { contextEngine } from './engines/ContextEngine';
import { promptEngine } from './engines/PromptEngine';
import { workflowEngine, WorkflowStep } from './engines/WorkflowEngine';
import { aiRouter } from './services/AIRouter';
import { aiCache, aiCostTracker } from './services/AICostTracker';
import { aiLogger } from './services/AILogger';
import { guardrailService } from './guardrails/GuardrailService';
import { GuardrailRequestContext } from './guardrails/GuardrailTypes';
import { resultService } from './services/ResultService';
import { AIRequestOptions, AIResponse } from './types';
import { NormalizedResult } from './services/ResponseNormalizer';
import { workflowPlanner, PlanningContext, PlanningResult } from './creative-workflow/WorkflowPlanner';
import { workflowOrchestrator, WorkflowExecutionResult } from './creative-workflow/WorkflowOrchestrator';
import { TaskExecutionProgress } from './creative-workflow/TaskExecutor';
import { DecisionEngine } from './reasoning/DecisionEngine';
import { GoalAnalyzer } from './reasoning/GoalAnalyzer';
import { AIKernel } from './aios/AIKernel';
import { AIControlPlane } from './aios/AIControlPlane';
import { ProviderFederation } from './providers/ProviderFederation';

export class AIFacade {
  constructor() {
    AIKernel.boot().catch(console.error);
  }

  /**
   * Generates a multi-step execution plan DAG from high-level user goal.
   */
  public async planGoal(goal: string, context?: PlanningContext): Promise<PlanningResult> {
    await AIControlPlane.dispatch(goal);
    return await workflowPlanner.plan(goal, context);
  }

  /**
   * Plans and executes a multi-step goal using the Planning Engine and DAG Orchestrator.
   */
  public async executePlan(
    goal: string, 
    context?: PlanningContext,
    onProgress?: (progress: TaskExecutionProgress) => void
  ): Promise<WorkflowExecutionResult> {
    return await workflowOrchestrator.planAndExecuteGoal(goal, context, onProgress);
  }

  /**
   * Phương thức chính để yêu cầu AI thực hiện một tác vụ đơn lẻ.
   */
  public async ask(
    templateId: string, 
    query: string, 
    projectId: string, 
    options: AIRequestOptions = {},
    userId?: string
  ): Promise<AIResponse> {
    
    // 0. Reasoning Engine: Analyze Intent & Goal even for single requests
    const analysis = GoalAnalyzer.analyze({ text: query, userId });
    console.log(`[AIFacade] Reasoning Single Task Intent: ${analysis.intent}, Emotion: ${analysis.emotion}`);

    // 1. Context Engine: Lấy ngữ cảnh dự án
    const context = await contextEngine.getProjectContext(projectId);

    // 2. Prompt Engine: Compile prompt từ template
    const builtPrompt = promptEngine.compile(templateId, { 
      context, 
      query, 
      analysis: JSON.stringify(analysis) 
    });

    // 2.5 Guardrail Check
    const traceId = Math.random().toString(36).substr(2, 9);
    const guardrailResult = await guardrailService.processRequest({
      traceId,
      projectId,
      userId,
      provider: options.provider,
      model: options.model,
    }, builtPrompt.full);

    if (guardrailResult.decision === 'BLOCK') {
      throw new Error('Request blocked by guardrails: ' + guardrailResult.violations.join(', '));
    }
    const finalPrompt = guardrailResult.sanitizedPrompt || builtPrompt.full;

    // 2.7 Provider Federation: Select best provider
    await ProviderFederation.execute({ goal: query, options });

    // 3. Cache Check
    const cacheKey = aiCache.generateKey(templateId + finalPrompt, options);
    
    if (options.useCache !== false) {
      const cached = aiCache.get(cacheKey);
      if (cached) {
        console.log('[AI Engine] Cache hit!');
        aiLogger.log({
          traceId,
          prompt: finalPrompt,
          provider: cached.provider,
          model: cached.model,
          latency: 0,
          cost: 0,
          success: true,
          retryCount: 0,
          cached: true
        });
        return cached;
      }
    }

    // 4. AI Router: Thực thi request
    try {
      const response = await aiRouter.route(finalPrompt, options);

      // 5. Cost Tracker: Lưu lại chi phí
      aiCostTracker.log(response, userId, projectId);

      // 6. Cache Save
      aiCache.set(cacheKey, response);
      
      aiLogger.log({
        traceId,
        prompt: finalPrompt,
        provider: response.provider,
        model: response.model,
        latency: response.latency,
        cost: response.usage.costEstimate,
        success: true,
        retryCount: 0,
        cached: false
      });

      return response;
    } catch (e: any) {
      aiLogger.log({
        traceId,
        prompt: finalPrompt,
        provider: options.provider || 'unknown',
        model: options.model || 'unknown',
        latency: 0,
        cost: 0,
        success: false,
        error: e.message,
        retryCount: 0,
        cached: false
      });
      throw e;
    }
  }

  /**
   * Thực hiện một chuỗi tác vụ phức tạp.
   */
  public async runWorkflow(
    projectId: string,
    steps: WorkflowStep[]
  ): Promise<NormalizedResult[]> {
    return await workflowEngine.execute(projectId, steps);
  }

  /**
   * Helper để lấy kết quả đã được chuẩn hóa (normalized).
   */
  public async askNormalized(
    templateId: string, 
    query: string, 
    projectId: string, 
    options: AIRequestOptions = {},
    userId?: string
  ): Promise<NormalizedResult> {
    const response = await this.ask(templateId, query, projectId, options, userId);
    return resultService.process(response);
  }
}

export const aiFacade = new AIFacade();
