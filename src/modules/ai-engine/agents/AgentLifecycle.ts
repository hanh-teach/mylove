import { AgentProfile } from './AgentProfile';

export class AgentLifecycle {
  public static updateStatus(agent: AgentProfile, status: AgentProfile['status']): void {
    agent.status = status;
    agent.lastHeartbeat = Date.now();
    console.log(`[AgentLifecycle] Agent ${agent.id} (${agent.role}) transitioned to ${status}`);
  }
}
