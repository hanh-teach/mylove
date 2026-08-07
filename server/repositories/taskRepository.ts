import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { withFileLock } from '../utils/fileLock';

export interface Task {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

const DEFAULT_TASKS_FILE = path.join(process.cwd(), 'tasks.json');
const STUCK_PROCESSING_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

export class TaskRepository {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private filePath: string;

  constructor(filePath: string = DEFAULT_TASKS_FILE) {
    this.filePath = filePath;
    this.loadFromDiskAndRecover().catch((err) => {
      console.error('Failed to load/recover tasks during initialization:', err);
    });
    this.startCleanupInterval();
  }

  private startCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cleanupInterval = setInterval(async () => {
      try {
        await this.cleanup();
      } catch (err) {
        console.error('Failed task repository cleanup:', err);
      }
    }, 10 * 60 * 1000);

    // Make sure the timer doesn't prevent Node from exiting in testing environments
    if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
      this.cleanupInterval.unref();
    }
  }

  private readUnsafe(): Task[] {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const raw = fs.readFileSync(this.filePath, 'utf8');
      if (!raw.trim()) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  private writeUnsafe(tasks: Task[]): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Atomic write using a temporary file to prevent corruption
      const tempPath = `${this.filePath}.${crypto.randomUUID()}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(tasks, null, 2), 'utf8');
      fs.renameSync(tempPath, this.filePath);
    } catch (e) {
      console.error('Failed to save tasks to disk:', e);
    }
  }

  private cleanupUnsafe(tasks: Task[]): Task[] {
    const now = Date.now();
    const expiryMs = 30 * 60 * 1000; // 30 minutes
    return tasks.filter(task => {
      const shouldKeep = !((task.status === 'completed' || task.status === 'failed') && (now - task.updatedAt > expiryMs));
      return shouldKeep;
    });
  }

  public async loadFromDiskAndRecover(): Promise<void> {
    if (!fs.existsSync(this.filePath)) {
      return;
    }

    try {
      await withFileLock(this.filePath, async () => {
        const loadedTasks = this.readUnsafe();
        const now = Date.now();
        let changed = false;

        const recoveredTasks = loadedTasks.map(task => {
          if (task.status === 'processing' && (now - task.updatedAt >= STUCK_PROCESSING_THRESHOLD_MS)) {
            changed = true;
            return {
              ...task,
              status: 'failed' as const,
              error: 'Server restarted while task was processing',
              updatedAt: now
            };
          }
          return task;
        });

        if (changed) {
          this.writeUnsafe(recoveredTasks);
        }
      });
    } catch (e) {
      console.error('Failed to load tasks from disk:', e);
    }
  }

  public async createTask(status: Task['status'] = 'pending', result?: any, error?: string): Promise<Task> {
    const taskId = crypto.randomUUID();
    const now = Date.now();
    const task: Task = {
      taskId,
      status,
      result,
      error,
      createdAt: now,
      updatedAt: now
    };

    return await withFileLock(this.filePath, async () => {
      let tasks = this.readUnsafe();
      tasks = this.cleanupUnsafe(tasks);
      tasks.push(task);
      this.writeUnsafe(tasks);
      return task;
    });
  }

  public getTask(taskId: string): Task | null {
    const tasks = this.readUnsafe();
    return tasks.find(t => t.taskId === taskId) || null;
  }

  public async updateTask(taskId: string, updates: Partial<Omit<Task, 'taskId' | 'createdAt'>>): Promise<Task | null> {
    return await withFileLock(this.filePath, async () => {
      const tasks = this.readUnsafe();
      const idx = tasks.findIndex(t => t.taskId === taskId);
      if (idx === -1) return null;

      const updatedTask: Task = {
        ...tasks[idx],
        ...updates,
        updatedAt: Date.now()
      };
      tasks[idx] = updatedTask;
      this.writeUnsafe(tasks);

      return updatedTask;
    });
  }

  public async cleanup(): Promise<void> {
    await withFileLock(this.filePath, async () => {
      const tasks = this.readUnsafe();
      const initialLen = tasks.length;
      const filteredTasks = this.cleanupUnsafe(tasks);

      if (filteredTasks.length !== initialLen) {
        this.writeUnsafe(filteredTasks);
      }
    });
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    if (fs.existsSync(this.filePath)) {
      try {
        fs.unlinkSync(this.filePath);
      } catch (e) {}
    }
  }

  // Helper for testing
  public getAllTasksForTest(): Task[] {
    return this.readUnsafe();
  }
}

export const taskRepository = new TaskRepository();

