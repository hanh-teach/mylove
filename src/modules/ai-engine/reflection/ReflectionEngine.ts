import { CritiqueEngine } from './CritiqueEngine';
import { QualityEvaluator } from './QualityEvaluator';
import { RepairEngine } from './RepairEngine';
import { ConfidenceEngine } from './ConfidenceEngine';
import { LearningRecorder } from './LearningRecorder';
import { ReflectionTrace } from './ReflectionTrace';
import { reflectionEventBus } from './ReflectionEvents';

export class ReflectionEngine {
  public static async reflect(workflowId: string, output: string): Promise<ReflectionTrace> {
    console.log(`[ReflectionEngine] Starting reflection for workflow ${workflowId}`);
    
    reflectionEventBus.emit({
      type: 'REFLECTION_STARTED',
      workflowId,
      message: `Starting reflection for workflow ${workflowId}`,
      timestamp: new Date().toISOString()
    });

    try {
      // Critique
      const critique = { qualityScore: 0.9, emotionScore: 0.8, critiqueText: "Looks good", shouldRepair: false };
      
      // Quality
      const qualityScore = QualityEvaluator.evaluate(output);
      
      // Repair if needed
      let finalOutput = output;
      if (critique.shouldRepair) {
          finalOutput = await RepairEngine.repair(output, critique.critiqueText);
      }
      
      // Confidence
      const confidence = ConfidenceEngine.estimate(finalOutput, qualityScore);
      
      const trace: ReflectionTrace = {
          id: `trace-${Date.now()}`,
          workflowId,
          originalOutput: output,
          critique: critique.critiqueText,
          improvement: finalOutput !== output ? "Repaired" : "None",
          finalOutput,
          qualityScore,
          confidence,
          timestamp: new Date().toISOString()
      };
      
      LearningRecorder.record(trace);

      reflectionEventBus.emit({
        type: 'REFLECTION_COMPLETED',
        workflowId,
        trace,
        message: `Reflection completed for workflow ${workflowId}`,
        timestamp: new Date().toISOString()
      });

      return trace;
    } catch (error: any) {
      reflectionEventBus.emit({
        type: 'REFLECTION_FAILED',
        workflowId,
        message: `Reflection failed: ${error.message}`,
        timestamp: new Date().toISOString()
      });
      throw error;
    }
  }
}
