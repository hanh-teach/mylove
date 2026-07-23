export interface CommandDefinition {
  id: string;
  title: string;
  description?: string;
  category: string;
  icon?: string;
  shortcut?: string[]; // e.g., ['Ctrl', 'N'] or ['⌥', 'M']
  action: (context?: any) => void;
}

export class CommandRegistryClass {
  private commands: Map<string, CommandDefinition> = new Map();
  private listeners: Set<() => void> = new Set();

  public register(cmd: CommandDefinition): () => void {
    this.commands.set(cmd.id, cmd);
    this.notify();
    return () => {
      this.commands.delete(cmd.id);
      this.notify();
    };
  }

  public getCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  public getCommandById(id: string): CommandDefinition | undefined {
    return this.commands.get(id);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const CommandRegistry = new CommandRegistryClass();
