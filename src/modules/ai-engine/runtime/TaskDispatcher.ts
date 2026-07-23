import { TaskDefinition } from '../creative-workflow/TaskDefinition';
import { ExecutionContext } from './ExecutionContext';
import { ToolResolver } from '../tools/ToolResolver';
import { ToolRegistry } from '../tools/ToolRegistry';
import '../tools'; // Ensure tools are registered

export class TaskDispatcher {
  /**
   * Dispatches task to underlying engines based on task type without hardcoupling to provider SDKs.
   * Now utilizes the Enterprise Tool Registry and Tool Resolver.
   */
  public static async dispatch(task: TaskDefinition, context: ExecutionContext): Promise<any> {
    console.log(`[TaskDispatcher] Dispatching task type [${task.type}] id=${task.id} name="${task.name}"`);

    // Inject upstream results into task input if available
    const enrichedInput = { ...task.input, sessionMemory: context.memory, goal: context.goal };
    task.input = enrichedInput;

    // Resolve appropriate tool using ToolResolver
    const tool = ToolResolver.resolve(task.type);

    // Default agent role for execution if not defined
    const agentRole = context.userId ? 'LoveLetterAgent' : 'PlannerAgent'; // Mocking role logic based on context

    // Invoke tool via ToolRegistry for governance, cost tracking, and telemetry
    const result = await ToolRegistry.invoke(
      tool.metadata.id,
      task.input,
      agentRole,
      { workflowId: context.workflowId, sessionMemory: context.memory }
    );

    return result;
  }
}
