import { PipelineDefinition, PipelineStep } from './PipelineDefinition';

export class CreativePipeline {
  private definition: PipelineDefinition;
  private context: Record<string, any> = {};

  constructor(definition: PipelineDefinition) {
    this.definition = definition;
  }

  public async run() {
    for (const step of this.definition.steps) {
      console.log(`[Pipeline] Executing step: ${step.id}`);
      try {
        const result = await step.executor(this.context);
        this.context[step.id] = result;
      } catch (error) {
        if (step.fallback) {
          console.warn(`[Pipeline] Step ${step.id} failed, running fallback`);
          const fallbackResult = await step.fallback(this.context);
          this.context[step.id] = fallbackResult;
        } else {
          throw error;
        }
      }
    }
    return this.context;
  }
}
