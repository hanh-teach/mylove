import { AgentRegistry } from './AgentRegistry';
import { AgentBus } from './AgentBus';
import { AgentMessage } from './AgentMessage';
import { AgentLifecycle } from './AgentLifecycle';

export class DelegationEngine {
  public static delegate(
    workflowId: string, 
    taskId: string, 
    capability: string, 
    payload: any, 
    senderRole: string = 'Planner'
  ): boolean {
    const candidates = AgentRegistry.discoverByCapability(capability);
    if (candidates.length === 0) {
      console.warn(`[DelegationEngine] No idle agents found for capability: ${capability}`);
      return false;
    }

    const assignedAgent = candidates[0]; // Simple round-robin or first available
    AgentLifecycle.updateStatus(assignedAgent, 'Busy');

    const msg: AgentMessage = {
      id: `msg-${Date.now()}`,
      sender: senderRole,
      receiver: assignedAgent.role,
      type: 'REQUEST',
      workflowId,
      taskId,
      payload,
      priority: 'high',
      traceId: `trace-${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    console.log(`[DelegationEngine] TASK_DELEGATED: ${taskId} to ${assignedAgent.role}`);
    AgentBus.publish(msg);
    return true;
  }
}
