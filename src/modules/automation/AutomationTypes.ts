export type CommandType = 
  | 'create_project' | 'delete_project' | 'update_project'
  | 'create_memory' | 'delete_memory' | 'update_memory'
  | 'create_timeline_event' | 'delete_timeline_event'
  | 'create_knowledge' | 'update_knowledge'
  | 'export_pdf' | 'change_theme' | 'generate_draft'
  | 'add_tag' | 'move_item' | 'ai_refine';

export interface ICommand {
  id: string;
  type: CommandType;
  payload: any;
  label: string;
  timestamp: string;
  undoable?: boolean;
  projectId?: string;
}

export interface IAutomationStep {
  id: string;
  commandType: CommandType;
  payload: any;
  label: string;
  delayMs?: number;
  waitForUser?: boolean;
}

export interface IAutomation {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: IAutomationStep[];
  tags: string[];
  isFavorite: boolean;
  lastRun?: string;
  runCount: number;
  projectId?: string;
}

export interface IAutomationExecution {
  id: string;
  automationId: string;
  status: 'pending' | 'running' | 'waiting_review' | 'completed' | 'failed' | 'cancelled';
  currentStepIndex: number;
  logs: string[];
  startTime: string;
  endTime?: string;
}

export interface IMacroSession {
  isRecording: boolean;
  startTime: string;
  commands: ICommand[];
}
