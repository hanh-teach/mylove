import { knowledgeEventBus, KnowledgeEvent } from './KnowledgeEvents';

export interface PerformanceMetrics {
  totalRetrievals: number;
  cacheHits: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
  indexingCount: number;
  policyViolations: number;
}

export class KnowledgeMetrics {
  private static metrics: PerformanceMetrics = {
    totalRetrievals: 0,
    cacheHits: 0,
    totalLatencyMs: 0,
    averageLatencyMs: 0,
    indexingCount: 0,
    policyViolations: 0
  };

  static {
    // Listen to our events and automatically calculate metrics
    knowledgeEventBus.subscribe((event: KnowledgeEvent) => {
      if (event.type === 'KNOWLEDGE_RETRIEVED') {
        this.metrics.totalRetrievals++;
        if (event.message?.includes('cache')) {
          this.metrics.cacheHits++;
        }
        
        // Parse latency from message if available e.g., "latency: 12ms"
        const latencyMatch = event.message?.match(/latency:\s*(\d+)ms/i);
        if (latencyMatch && latencyMatch[1]) {
          const latency = parseInt(latencyMatch[1], 10);
          this.metrics.totalLatencyMs += latency;
          this.metrics.averageLatencyMs = this.metrics.totalLatencyMs / this.metrics.totalRetrievals;
        }
      } else if (event.type === 'KNOWLEDGE_CREATED') {
        this.metrics.indexingCount++;
      } else if (event.type === 'KNOWLEDGE_POLICY_VIOLATION') {
        this.metrics.policyViolations++;
      }
    });
  }

  public static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public static reset(): void {
    this.metrics = {
      totalRetrievals: 0,
      cacheHits: 0,
      totalLatencyMs: 0,
      averageLatencyMs: 0,
      indexingCount: 0,
      policyViolations: 0
    };
  }
}
