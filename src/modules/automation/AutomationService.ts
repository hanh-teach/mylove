import { 
  ICommand, 
  IAutomation, 
  IAutomationExecution, 
  IMacroSession,
  CommandType
} from './AutomationTypes';

class AutomationService {
  private COMMANDS_KEY = 'lovenote_command_history';
  private AUTOMATIONS_KEY = 'lovenote_automations';
  
  private macroSession: IMacroSession = {
    isRecording: false,
    startTime: '',
    commands: []
  };

  // --- Command History ---
  
  getCommandHistory(): ICommand[] {
    const data = localStorage.getItem(this.COMMANDS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveCommand(command: ICommand) {
    const history = this.getCommandHistory();
    history.unshift(command);
    localStorage.setItem(this.COMMANDS_KEY, JSON.stringify(history.slice(0, 100)));
    
    if (this.macroSession.isRecording) {
      this.macroSession.commands.push(command);
    }
  }

  // --- Universal Execution Engine ---

  async executeCommand(type: CommandType, payload: any, label: string, projectId?: string): Promise<any> {
    console.log(`[CommandEngine] Executing: ${type}`, payload);
    
    // Simulate core logic routing (In real app, call respective services)
    const command: ICommand = {
      id: `cmd-${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      label,
      timestamp: new Date().toISOString(),
      projectId
    };

    this.saveCommand(command);

    // Mock execution delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return { success: true, commandId: command.id };
  }

  // --- Automation Management ---

  getAutomations(): IAutomation[] {
    const data = localStorage.getItem(this.AUTOMATIONS_KEY);
    if (!data) return this.getSeedAutomations();
    return JSON.parse(data);
  }

  saveAutomation(automation: IAutomation) {
    const autos = this.getAutomations();
    const idx = autos.findIndex(a => a.id === automation.id);
    if (idx >= 0) autos[idx] = automation;
    else autos.push(automation);
    localStorage.setItem(this.AUTOMATIONS_KEY, JSON.stringify(autos));
  }

  private getSeedAutomations(): IAutomation[] {
    return [
      {
        id: 'auto-1',
        title: 'Project Quick Start',
        description: 'Tạo timeline, lời chào và đổi theme tự động.',
        icon: 'Zap',
        isFavorite: true,
        runCount: 12,
        tags: ['New Project', 'Setup'],
        steps: [
          { id: 's1', commandType: 'create_timeline_event', label: 'Tạo sự kiện bắt đầu', payload: { title: 'Dự án khởi tạo' } },
          { id: 's2', commandType: 'generate_draft', label: 'Soạn lời chào mừng', payload: { type: 'welcome' } },
          { id: 's3', commandType: 'change_theme', label: 'Áp dụng Theme Rose', payload: { theme: 'rose' } }
        ]
      },
      {
        id: 'auto-2',
        title: 'Weekly Backup & Export',
        description: 'Đóng gói toàn bộ kỷ niệm trong tuần và xuất PDF.',
        icon: 'Archive',
        isFavorite: false,
        runCount: 5,
        tags: ['Export', 'Maintenance'],
        steps: [
          { id: 's1', commandType: 'move_item', label: 'Lưu trữ kỷ niệm cũ', payload: { folder: 'Archive' } },
          { id: 's2', commandType: 'export_pdf', label: 'Xuất file PDF tổng hợp', payload: { range: 'weekly' } }
        ]
      }
    ];
  }

  // --- Macro Recording ---

  startRecording() {
    this.macroSession = {
      isRecording: true,
      startTime: new Date().toISOString(),
      commands: []
    };
  }

  stopRecording(title: string): IAutomation {
    const automation: IAutomation = {
      id: `auto-macro-${Date.now()}`,
      title,
      description: `Được ghi lại lúc ${new Date().toLocaleString()}`,
      icon: 'MousePointer',
      isFavorite: false,
      runCount: 0,
      tags: ['Recorded'],
      steps: this.macroSession.commands.map(cmd => ({
        id: `s-${Math.random()}`,
        commandType: cmd.type,
        payload: cmd.payload,
        label: cmd.label
      }))
    };
    
    this.macroSession.isRecording = false;
    this.saveAutomation(automation);
    return automation;
  }

  getRecordingStatus() {
    return this.macroSession;
  }
}

export const automationService = new AutomationService();
