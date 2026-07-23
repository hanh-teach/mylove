import { RuntimeEngine } from '../../ai-engine/runtime/RuntimeEngine';
import { WorkflowRegistry } from '../../ai-engine/creative-workflow/WorkflowRegistry';
import { WorkflowHistory } from '../../ai-engine/creative-workflow/WorkflowHistory';
import { runtimeEventBus } from '../../ai-engine/runtime/ExecutionEvents';

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
    description: 'Collect memories, compose meaningful text, and generate atmospheric visuals and media.',
    steps: [
      { id: 's1', name: 'Collect Memories & Notes', status: 'completed', provider: 'Local Store', estimatedTime: '2s', estimatedCost: '$0.00', outputSummary: '3 items linked' },
      { id: 's2', name: 'Generate Content Draft', status: 'running', provider: 'Gemini 2.5 Flash', estimatedTime: '5s', estimatedCost: '$0.01' },
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
    description: 'Create heartfelt teacher appreciation letters, student memories, and gift cards.',
    steps: [
      { id: 't1', name: 'Select Class Memories', status: 'pending', provider: 'Memory Store', estimatedTime: '2s', estimatedCost: '$0.00' },
      { id: 't2', name: 'Draft Gratitude Speech', status: 'pending', provider: 'Gemini AI', estimatedTime: '4s', estimatedCost: '$0.01' },
      { id: 't3', name: 'Generate Card Design', status: 'pending', provider: 'Imagen 3', estimatedTime: '14s', estimatedCost: '$0.03' },
      { id: 't4', name: 'Export Card & PDF', status: 'pending', provider: 'PDF / PNG', estimatedTime: '2s', estimatedCost: '$0.00' },
    ],
  },
  {
    id: 'birthday_card',
    name: 'Birthday Greeting & Photo Card',
    category: 'Celebration',
    description: 'Create a joyful birthday greeting with custom photo cards and festive media.',
    steps: [
      { id: 'b1', name: 'Select Celebration Photo', status: 'pending', provider: 'Memory Store', estimatedTime: '2s', estimatedCost: '$0.00' },
      { id: 'b2', name: 'Compose Celebration Wishes', status: 'pending', provider: 'Gemini AI', estimatedTime: '4s', estimatedCost: '$0.01' },
      { id: 'b3', name: 'Generate Celebration Images', status: 'pending', provider: 'Imagen 3', estimatedTime: '14s', estimatedCost: '$0.03' },
      { id: 'b4', name: 'Export Card', status: 'pending', provider: 'PDF / PNG', estimatedTime: '2s', estimatedCost: '$0.00' },
    ],
  },
  {
    id: 'event_narrative',
    name: 'Event & Life Story Keepsake',
    category: 'Milestone',
    description: 'Craft an unforgettable event narrative with timeline milestones and keepsake layout.',
    steps: [
      { id: 'p1', name: 'Timeline Milestones Review', status: 'pending', provider: 'Timeline Store', estimatedTime: '1s', estimatedCost: '$0.00' },
      { id: 'p2', name: 'Write Life Story Narrative', status: 'pending', provider: 'Gemini Pro', estimatedTime: '8s', estimatedCost: '$0.02' },
      { id: 'p3', name: 'Generate Cinematic Artwork', status: 'pending', provider: 'Fal AI', estimatedTime: '20s', estimatedCost: '$0.05' },
      { id: 'p4', name: 'Publish KeepSafe', status: 'pending', provider: 'Cloud Sync', estimatedTime: '3s', estimatedCost: '$0.00' },
    ],
  },
];

class WorkflowControllerClass {
  private activeTemplate: WorkflowTemplateItem = WORKFLOW_TEMPLATES[0];
  private isRunning: boolean = true;
  private isPaused: boolean = false;
  private progress: number = 42;
  private timelineLogs: { time: string; message: string }[] = [
    { time: '08:20', message: 'Started Workflow: Story & Media Keepsake' },
    { time: '08:21', message: 'Memories collected & validated' },
    { time: '08:22', message: 'Generating AI draft with context' },
  ];

  getActiveTemplate(): WorkflowTemplateItem {
    return this.activeTemplate;
  }

  setActiveTemplate(templateId: string) {
    const found = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (found) {
      this.activeTemplate = found;
      this.progress = 30;
      this.timelineLogs.unshift({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: `Switched template to ${found.name}` });
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
    this.timelineLogs.unshift({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Workflow Paused by User' });
  }

  resume() {
    this.isPaused = false;
    this.timelineLogs.unshift({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Workflow Resumed' });
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.timelineLogs.unshift({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: 'Workflow Stopped' });
  }

  retryStep(stepId: string) {
    this.activeTemplate.steps = this.activeTemplate.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, status: 'running' };
      }
      return s;
    });
    this.timelineLogs.unshift({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), message: `Retrying step: ${stepId}` });
  }
}

export const WorkflowController = new WorkflowControllerClass();
