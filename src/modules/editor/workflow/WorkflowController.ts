export interface WorkflowStepItem {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  provider: string;
  estimatedTime: string;
  estimatedCost: string;
  outputSummary?: string;
}

export interface WorkflowTemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  steps: WorkflowStepItem[];
}

export const WORKFLOW_TEMPLATES: WorkflowTemplateItem[] = [
  {
    id: 'creative_story',
    name: "Story & Media Keepsake Pipeline",
    category: 'Creative Story',
    description: 'Thu thập kỷ niệm, biên soạn lời văn ý nghĩa, sinh hình ảnh nghệ thuật và dựng video lãng mạn.',
    steps: [
      { id: 's1', name: 'Collect Memories & Notes', status: 'completed', provider: 'Local Store', estimatedTime: '2s', estimatedCost: '$0.00', outputSummary: '3 items linked' },
      { id: 's2', name: 'Generate Content Draft', status: 'running', provider: 'Gemini 3.6 Flash', estimatedTime: '5s', estimatedCost: '$0.01' },
      { id: 's3', name: 'Generate Visual Artwork', status: 'pending', provider: 'Imagen 3 / Fal', estimatedTime: '15s', estimatedCost: '$0.03' },
      { id: 's4', name: 'Generate Audio Theme', status: 'pending', provider: 'Lyria Synth', estimatedTime: '12s', estimatedCost: '$0.02' },
      { id: 's5', name: 'Video Assembly', status: 'pending', provider: 'Sora / Luma', estimatedTime: '30s', estimatedCost: '$0.08' },
      { id: 's6', name: 'Export & Publish', status: 'pending', provider: 'Cloud Service', estimatedTime: '3s', estimatedCost: '$0.00' },
    ],
  },
  {
    id: 'teacher_thank_you',
    name: 'Teacher Gratitude & Card',
    category: 'Education',
    description: 'Tạo thư tri ân thầy cô sâu sắc, lồng ghép kỷ niệm lớp học và thiết kế thiệp chúc mừng.',
    steps: [
      { id: 't1', name: 'Select Class Memories', status: 'pending', provider: 'Memory Store', estimatedTime: '2s', estimatedCost: '$0.00' },
      { id: 't2', name: 'Draft Gratitude Speech', status: 'pending', provider: 'Gemini 3.1 Pro', estimatedTime: '4s', estimatedCost: '$0.01' },
      { id: 't3', name: 'Generate Card Design', status: 'pending', provider: 'Imagen 3', estimatedTime: '14s', estimatedCost: '$0.03' },
      { id: 't4', name: 'Export Card & PDF', status: 'pending', provider: 'PDF / PNG', estimatedTime: '2s', estimatedCost: '$0.00' },
    ],
  },
  {
    id: 'birthday_card',
    name: 'Birthday Greeting & Photo Card',
    category: 'Celebration',
    description: 'Thiết kế thiệp chúc mừng sinh nhật ấm áp đi kèm tuyển tập ảnh kỷ niệm sống động.',
    steps: [
      { id: 'b1', name: 'Select Celebration Photo', status: 'pending', provider: 'Memory Store', estimatedTime: '2s', estimatedCost: '$0.00' },
      { id: 'b2', name: 'Compose Celebration Wishes', status: 'pending', provider: 'Gemini 3.6 Flash', estimatedTime: '4s', estimatedCost: '$0.01' },
      { id: 'b3', name: 'Generate Celebration Images', status: 'pending', provider: 'Imagen 3', estimatedTime: '14s', estimatedCost: '$0.03' },
      { id: 'b4', name: 'Export Card', status: 'pending', provider: 'PDF / PNG', estimatedTime: '2s', estimatedCost: '$0.00' },
    ],
  },
  {
    id: 'event_narrative',
    name: 'Event & Life Story Keepsake',
    category: 'Milestone',
    description: 'Xâu chuỗi cột mốc thời gian thành câu chuyện cuộc đời đầy cảm xúc và lưu giữ mãi mãi.',
    steps: [
      { id: 'p1', name: 'Timeline Milestones Review', status: 'pending', provider: 'Timeline Store', estimatedTime: '1s', estimatedCost: '$0.00' },
      { id: 'p2', name: 'Write Life Story Narrative', status: 'pending', provider: 'Gemini 3.1 Pro', estimatedTime: '8s', estimatedCost: '$0.02' },
      { id: 'p3', name: 'Generate Cinematic Artwork', status: 'pending', provider: 'Fal AI', estimatedTime: '20s', estimatedCost: '$0.05' },
      { id: 'p4', name: 'Publish KeepSafe', status: 'pending', provider: 'Cloud Sync', estimatedTime: '3s', estimatedCost: '$0.00' },
    ],
  },
];

class WorkflowControllerClass {
  private activeTemplate: WorkflowTemplateItem;
  private isRunning: boolean = true;
  private isPaused: boolean = false;
  private progress: number = 25;
  private timelineLogs: { time: string; message: string }[] = [];
  private listeners: Set<() => void> = new Set();
  private intervalId: any = null;

  constructor() {
    // Deep clone the first template to make steps modifiable
    this.activeTemplate = JSON.parse(JSON.stringify(WORKFLOW_TEMPLATES[0]));
    
    // Initialize standard timeline logs
    this.timelineLogs = [
      { time: this.formatTime(), message: 'Đang chuẩn bị quy trình sáng tạo...' },
      { time: this.formatTime(), message: '✓ Đã liên kết 3 dữ liệu kỷ niệm & ghi chú từ Local Store.' },
      { time: this.formatTime(), message: 'Khởi động mô hình Gemini 3.6 Flash để phác thảo lời tựa...' }
    ];

    // Start background simulation loop
    this.startLoop();
  }

  private formatTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  private startLoop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.tick();
    }, 4000); // Tick every 4 seconds to allow realistic visual tracking
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => {
      try {
        l();
      } catch (e) {
        console.error('Error in workflow listener', e);
      }
    });
  }

  private tick() {
    if (!this.isRunning || this.isPaused) return;

    const steps = this.activeTemplate.steps;
    const runningStepIdx = steps.findIndex(s => s.status === 'running');

    if (runningStepIdx !== -1) {
      const step = steps[runningStepIdx];
      // Complete current step
      step.status = 'completed';
      
      const nameLower = step.name.toLowerCase();
      if (nameLower.includes('collect') || nameLower.includes('select') || nameLower.includes('milestones review') || nameLower.includes('timeline')) {
        step.outputSummary = `Đã hoàn thành thu thập tư liệu và phân tích ngữ cảnh từ ${step.provider}.`;
      } else if (nameLower.includes('draft') || nameLower.includes('write') || nameLower.includes('compose') || nameLower.includes('speech')) {
        step.outputSummary = `Đã soạn thảo văn bản nháp thành công bằng mô hình ${step.provider}.`;
      } else if (nameLower.includes('visual') || nameLower.includes('artwork') || nameLower.includes('design') || nameLower.includes('image') || nameLower.includes('card')) {
        step.outputSummary = `Đã tạo tác phẩm đồ họa hình ảnh nghệ thuật độ phân giải cao bằng ${step.provider}.`;
      } else if (nameLower.includes('audio') || nameLower.includes('music') || nameLower.includes('synth') || nameLower.includes('giai điệu')) {
        step.outputSummary = `Đã tổng hợp giai điệu nhạc nền lãng mạn bằng công nghệ ${step.provider}.`;
      } else if (nameLower.includes('video') || nameLower.includes('assembly') || nameLower.includes('sora') || nameLower.includes('luma')) {
        step.outputSummary = `Đã dựng video kỷ niệm lãng mạn hoàn chỉnh bằng ${step.provider}.`;
      } else if (nameLower.includes('export') || nameLower.includes('publish') || nameLower.includes('sync') || nameLower.includes('pdf') || nameLower.includes('png')) {
        step.outputSummary = `Đã đóng gói và đồng bộ xuất bản tác phẩm thành công bằng ${step.provider}!`;
      } else {
        step.outputSummary = 'Đã hoàn thành bước xử lý.';
      }

      this.timelineLogs.unshift({
        time: this.formatTime(),
        message: `✓ Hoàn thành bước: ${step.name}`
      });

      // Start next step if available
      if (runningStepIdx + 1 < steps.length) {
        const nextStep = steps[runningStepIdx + 1];
        nextStep.status = 'running';
        this.timelineLogs.unshift({
          time: this.formatTime(),
          message: `→ Bắt đầu xử lý: ${nextStep.name} (${nextStep.provider})...`
        });
      } else {
        this.isRunning = false;
        this.timelineLogs.unshift({
          time: this.formatTime(),
          message: '★ Quy trình sáng tạo thông minh đã hoàn thành 100%!'
        });
      }
    } else {
      // No active running step - search for first pending step
      const pendingIdx = steps.findIndex(s => s.status === 'pending');
      if (pendingIdx !== -1) {
        steps[pendingIdx].status = 'running';
        this.timelineLogs.unshift({
          time: this.formatTime(),
          message: `→ Bắt đầu xử lý: ${steps[pendingIdx].name} (${steps[pendingIdx].provider})...`
        });
      } else {
        // All steps might be completed or pending, check if we need to auto-start from beginning
        const completedCount = steps.filter(s => s.status === 'completed').length;
        if (completedCount === steps.length) {
          this.isRunning = false;
        } else {
          // Restart first step if all are pending
          steps[0].status = 'running';
          this.timelineLogs.unshift({
            time: this.formatTime(),
            message: `→ Bắt đầu xử lý: ${steps[0].name} (${steps[0].provider})...`
          });
        }
      }
    }

    this.recalculateProgress();
    this.notify();
  }

  private recalculateProgress() {
    const steps = this.activeTemplate.steps;
    const completedCount = steps.filter(s => s.status === 'completed').length;
    const runningCount = steps.filter(s => s.status === 'running').length;
    
    let calculated = (completedCount / steps.length) * 100;
    if (runningCount > 0) {
      calculated += (0.5 / steps.length) * 100;
    }
    
    this.progress = Math.min(100, Math.round(calculated));
  }

  getActiveTemplate(): WorkflowTemplateItem {
    return this.activeTemplate;
  }

  setActiveTemplate(templateId: string) {
    const found = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (found) {
      this.activeTemplate = JSON.parse(JSON.stringify(found));
      // Reset all steps: first step running, others pending
      this.activeTemplate.steps.forEach((s, idx) => {
        s.status = idx === 0 ? 'running' : 'pending';
        delete s.outputSummary;
      });
      this.progress = 8;
      this.isRunning = true;
      this.isPaused = false;
      this.timelineLogs = [
        { time: this.formatTime(), message: `Đã chuyển sang quy trình: ${found.name}` },
        { time: this.formatTime(), message: `→ Bắt đầu xử lý: ${this.activeTemplate.steps[0].name}...` }
      ];
      this.notify();
    }
  }

  getProgress(): number {
    return this.progress;
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  getTimelineLogs(): { time: string; message: string }[] {
    return this.timelineLogs;
  }

  pause() {
    this.isPaused = true;
    this.timelineLogs.unshift({ time: this.formatTime(), message: '⏸ Quy trình tạm dừng bởi người dùng' });
    this.notify();
  }

  resume() {
    this.isPaused = false;
    this.timelineLogs.unshift({ time: this.formatTime(), message: '▶ Tiếp tục quy trình sáng tạo' });
    this.notify();
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.activeTemplate.steps.forEach(s => {
      if (s.status === 'running') s.status = 'pending';
    });
    this.timelineLogs.unshift({ time: this.formatTime(), message: '⏹ Đã dừng quy trình sáng tạo thông minh' });
    this.recalculateProgress();
    this.notify();
  }

  restart() {
    this.activeTemplate.steps.forEach((s, idx) => {
      s.status = idx === 0 ? 'running' : 'pending';
      delete s.outputSummary;
    });
    this.progress = 8;
    this.isRunning = true;
    this.isPaused = false;
    this.timelineLogs.unshift({ time: this.formatTime(), message: '🔄 Khởi động lại toàn bộ quy trình từ đầu...' });
    this.notify();
  }

  retryStep(stepId: string) {
    this.activeTemplate.steps = this.activeTemplate.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, status: 'running' };
      }
      return s;
    });
    this.isRunning = true;
    this.isPaused = false;
    this.timelineLogs.unshift({ time: this.formatTime(), message: `🔄 Thử lại bước: ${stepId}` });
    this.recalculateProgress();
    this.notify();
  }
}

export const WorkflowController = new WorkflowControllerClass();
