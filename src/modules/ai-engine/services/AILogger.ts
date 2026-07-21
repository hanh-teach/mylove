import { AILogEntry } from '../types';

export class AILogger {
  private history: AILogEntry[] = [];

  public log(entry: Omit<AILogEntry, 'timestamp'>) {
    const fullEntry: AILogEntry = {
      ...entry,
      timestamp: Date.now(),
      // Sanitize prompt: remove potential secrets if any
      prompt: this.sanitizePrompt(entry.prompt)
    };
    
    this.history.push(fullEntry);
    console.log(`[AI Log] ${fullEntry.success ? 'Success' : 'Failure'} - ${fullEntry.provider}/${fullEntry.model} - TraceID: ${fullEntry.traceId}`);
  }

  private sanitizePrompt(prompt: string): string {
    // Basic sanitization, can be improved
    return prompt.replace(/(sk-|AI-)[a-zA-Z0-9]{20,}/g, '[REDACTED_KEY]');
  }

  public getHistory(): AILogEntry[] {
    return this.history;
  }
}

export const aiLogger = new AILogger();
