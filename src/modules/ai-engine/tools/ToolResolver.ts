import { ToolRegistry } from './ToolRegistry';
import { AITool } from './AITool';

export class ToolResolver {
  /**
   * Translates a runtime TaskType (e.g. 'text', 'image', 'video', 'db') to the most matching tool in the system.
   */
  public static resolve(taskType: string): AITool {
    const allTools = ToolRegistry.getAllTools();
    
    // Attempt standard tag or classification matching
    let matched = allTools.find(tool => tool.metadata.tags.includes(taskType));

    if (!matched) {
      // Fallback matching to ID prefixes or description strings
      matched = allTools.find(tool => 
        tool.metadata.id.includes(taskType) || 
        tool.metadata.description.toLowerCase().includes(taskType.toLowerCase())
      );
    }

    if (!matched) {
      throw new Error(`ToolResolver Error: No certified tools found to support task type [${taskType}].`);
    }

    return matched;
  }
}
