import { aiFacade } from '../AIFacade';
import { AIRequestOptions, AIResponse } from '../types';
import { NormalizedResult } from '../services/ResponseNormalizer';

export interface WorkflowStep {
  id: string;
  templateId: string;
  query: string;
  options?: AIRequestOptions;
  // If true, the output of this step will be injected into subsequent steps as context
  useAsContext?: boolean; 
}

export interface WorkflowExecutionContext {
  [stepId: string]: NormalizedResult;
}

export class WorkflowEngine {
  /**
   * Thực thi một chuỗi các bước AI liên tiếp với hỗ trợ truyền context giữa các bước.
   */
  public async execute(
    projectId: string,
    steps: WorkflowStep[]
  ): Promise<NormalizedResult[]> {
    const results: NormalizedResult[] = [];
    const executionContext: WorkflowExecutionContext = {};

    for (const step of steps) {
      // Replace placeholders in query with results from previous steps if they exist
      let query = step.query;
      for (const [stepId, result] of Object.entries(executionContext)) {
        query = query.replace(new RegExp(`{{${stepId}}}`, 'g'), result.text);
      }

      const normalizedResult = await aiFacade.askNormalized(
        step.templateId,
        query,
        projectId,
        step.options
      );
      
      results.push(normalizedResult);
      executionContext[step.id] = normalizedResult;
    }

    return results;
  }
}

export const workflowEngine = new WorkflowEngine();
