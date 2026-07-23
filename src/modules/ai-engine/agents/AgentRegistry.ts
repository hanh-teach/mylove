import { AgentProfile } from './AgentProfile';
import { AgentLifecycle } from './AgentLifecycle';

export class AgentRegistry {
  private static agents = new Map<string, AgentProfile>();

  public static register(profile: AgentProfile): void {
    this.agents.set(profile.id, profile);
    console.log(`[AgentRegistry] AGENT_REGISTERED: ${profile.id} (${profile.role})`);
  }

  public static unregister(agentId: string): void {
    this.agents.delete(agentId);
  }

  public static get(agentId: string): AgentProfile | undefined {
    return this.agents.get(agentId);
  }

  public static discoverByCapability(capability: string): AgentProfile[] {
    return Array.from(this.agents.values()).filter(a => a.capabilities.includes(capability) && a.status === 'Idle');
  }

  public static heartbeat(agentId: string): void {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastHeartbeat = Date.now();
    }
  }

  public static getAll(): AgentProfile[] {
    return Array.from(this.agents.values());
  }
}
