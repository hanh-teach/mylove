import { IPlan, ITask, IProposedChange, IAgentActivity, TaskStatus } from './AgentTypes';

class AgentService {
  private PLANS_KEY = 'lovenote_agent_plans';
  private ACTIVITY_KEY = 'lovenote_agent_activity';

  getPlans(projectId?: string): IPlan[] {
    const data = localStorage.getItem(this.PLANS_KEY);
    if (!data) return [];
    let plans: IPlan[] = JSON.parse(data);
    if (projectId) {
      plans = plans.filter(p => p.projectId === projectId);
    }
    return plans;
  }

  savePlan(plan: IPlan): void {
    const plans = this.getPlans();
    const index = plans.findIndex(p => p.id === plan.id);
    if (index >= 0) {
      plans[index] = { ...plan, updatedAt: new Date().toISOString() };
    } else {
      plans.push({ ...plan, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(this.PLANS_KEY, JSON.stringify(plans));
  }

  createPlan(projectId: string, title: string, description: string): IPlan {
    const plan: IPlan = {
      id: `plan-${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      title,
      description,
      status: 'planning',
      tasks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.savePlan(plan);
    this.addActivity({
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action: 'Plan Created',
      details: `Kế hoạch mới: ${title}`,
      planId: plan.id,
      level: 'info'
    });
    return plan;
  }

  addTask(planId: string, task: Omit<ITask, 'id' | 'planId' | 'status' | 'createdAt' | 'updatedAt'>): ITask {
    const plans = this.getPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex === -1) throw new Error('Plan not found');

    const newTask: ITask = {
      ...task,
      id: `task-${Math.random().toString(36).substr(2, 9)}`,
      planId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    plans[planIndex].tasks.push(newTask);
    this.savePlan(plans[planIndex]);
    return newTask;
  }

  updateTaskStatus(planId: string, taskId: string, status: TaskStatus, result?: any, error?: string): void {
    const plans = this.getPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex === -1) return;

    const taskIndex = plans[planIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    plans[planIndex].tasks[taskIndex].status = status;
    plans[planIndex].tasks[taskIndex].updatedAt = new Date().toISOString();
    if (result) plans[planIndex].tasks[taskIndex].result = result;
    if (error) plans[planIndex].tasks[taskIndex].error = error;

    this.savePlan(plans[planIndex]);

    this.addActivity({
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action: 'Task Updated',
      details: `Tác vụ "${plans[planIndex].tasks[taskIndex].title}" chuyển sang ${status}`,
      planId,
      taskId,
      level: status === 'failed' ? 'error' : status === 'completed' ? 'success' : 'info'
    });
  }

  addProposedChange(planId: string, taskId: string, change: Omit<IProposedChange, 'id' | 'status'>): void {
    const plans = this.getPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    if (planIndex === -1) return;

    const taskIndex = plans[planIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const newChange: IProposedChange = {
      ...change,
      id: `change-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending'
    };

    if (!plans[planIndex].tasks[taskIndex].proposedChanges) {
      plans[planIndex].tasks[taskIndex].proposedChanges = [];
    }
    plans[planIndex].tasks[taskIndex].proposedChanges!.push(newChange);
    plans[planIndex].tasks[taskIndex].status = 'waiting_approval';
    
    this.savePlan(plans[planIndex]);
  }

  getActivity(planId?: string): IAgentActivity[] {
    const data = localStorage.getItem(this.ACTIVITY_KEY);
    if (!data) return [];
    const activities: IAgentActivity[] = JSON.parse(data);
    if (planId) {
      return activities.filter(a => a.planId === planId);
    }
    return activities;
  }

  addActivity(activity: IAgentActivity): void {
    const activities = this.getActivity();
    activities.unshift(activity); // Newest first
    localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(activities.slice(0, 100))); // Keep last 100
  }

  // Simulated decomposition for Phase B
  async decompose(planId: string, userIntent: string): Promise<void> {
    this.addActivity({
      id: `act-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action: 'Planning',
      details: 'AI đang phân tích yêu cầu và lập kế hoạch...',
      planId,
      level: 'info'
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock decomposition
    const steps = [
      { title: 'Phân tích Ký ức', description: 'Tìm kiếm các kỷ niệm liên quan đến yêu cầu.', tool: 'memory_engine' },
      { title: 'Sắp xếp Dòng thời gian', description: 'Tạo chuỗi sự kiện hợp lý.', tool: 'timeline_engine' },
      { title: 'Soạn thảo nội dung', description: 'Viết bản nháp dựa trên dữ liệu tìm được.', tool: 'writer_engine' },
      { title: 'Đề xuất hình ảnh', description: 'Tìm kiếm ảnh phù hợp từ thư viện.', tool: 'asset_manager' }
    ];

    steps.forEach(step => this.addTask(planId, step));
    
    const plans = this.getPlans();
    const idx = plans.findIndex(p => p.id === planId);
    if (idx >= 0) {
      plans[idx].status = 'active';
      this.savePlan(plans[idx]);
    }
  }
}

export const agentService = new AgentService();
