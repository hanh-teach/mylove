import { ExecutionContext } from './ExecutionContext';
import { RuntimeState } from './ExecutionState';

export class ExecutionSession {
  private static STORAGE_KEY_PREFIX = 'lovenote_runtime_session_';

  public static createSession(workflowId: string, goal: string, userId?: string): ExecutionContext {
    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const traceId = `trace-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    return {
      workflowId,
      sessionId,
      userId,
      traceId,
      goal,
      memory: {},
      tokenBudget: 50000,
      costBudgetUsd: 1.0,
      currentCostUsd: 0,
      currentTokenUsage: 0,
      state: RuntimeState.CREATED,
      results: {},
      artifacts: [],
      startTime: Date.now()
    };
  }

  public static persist(context: ExecutionContext): void {
    try {
      const data = JSON.stringify(context);
      localStorage.setItem(`${this.STORAGE_KEY_PREFIX}${context.sessionId}`, data);
      localStorage.setItem(`${this.STORAGE_KEY_PREFIX}latest`, context.sessionId);
    } catch (e) {
      console.warn('[ExecutionSession] Failed to persist session to localStorage:', e);
    }
  }

  public static load(sessionId: string): ExecutionContext | null {
    try {
      const data = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}${sessionId}`);
      if (!data) return null;
      return JSON.parse(data) as ExecutionContext;
    } catch (e) {
      console.warn('[ExecutionSession] Failed to load session:', e);
      return null;
    }
  }

  public static loadLatest(): ExecutionContext | null {
    try {
      const latestId = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}latest`);
      if (!latestId) return null;
      return this.load(latestId);
    } catch (e) {
      return null;
    }
  }

  public static clear(sessionId: string): void {
    try {
      localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${sessionId}`);
    } catch (e) {}
  }
}
