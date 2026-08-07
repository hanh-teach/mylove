import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import { taskRepository, TaskRepository } from './taskRepository';

describe('TaskRepository', () => {
  const tempTestFile = path.join(process.cwd(), 'temp_test_tasks.json');

  beforeEach(() => {
    taskRepository.destroy();
    if (fs.existsSync(tempTestFile)) {
      try {
        fs.unlinkSync(tempTestFile);
      } catch (e) {}
    }
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    taskRepository.destroy();
    if (fs.existsSync(tempTestFile)) {
      try {
        fs.unlinkSync(tempTestFile);
      } catch (e) {}
    }
  });

  it('should create a task with pending status and correct timestamps', async () => {
    const now = Date.now();
    const task = await taskRepository.createTask('pending');

    expect(task).toBeDefined();
    expect(task.taskId).toBeDefined();
    expect(task.status).toBe('pending');
    expect(task.createdAt).toBeGreaterThanOrEqual(now);
    expect(task.updatedAt).toBeGreaterThanOrEqual(now);
  });

  it('should retrieve a task by ID', async () => {
    const created = await taskRepository.createTask('pending');
    const retrieved = taskRepository.getTask(created.taskId);

    expect(retrieved).toEqual(created);
  });

  it('should return null for non-existent task ID', () => {
    const retrieved = taskRepository.getTask('invalid-id');
    expect(retrieved).toBeNull();
  });

  it('should update task status, results, and updatedAt timestamp', async () => {
    const task = await taskRepository.createTask('pending');
    const originalUpdatedAt = task.updatedAt;

    // Fast-forward time to ensure updatedAt changes
    vi.advanceTimersByTime(5000);

    const resultPayload = { videoUrl: 'https://example.com/video.mp4' };
    const updated = await taskRepository.updateTask(task.taskId, {
      status: 'completed',
      result: resultPayload
    });

    expect(updated).toBeDefined();
    expect(updated?.status).toBe('completed');
    expect(updated?.result).toEqual(resultPayload);
    expect(updated?.updatedAt).toBeGreaterThan(originalUpdatedAt);

    const retrieved = taskRepository.getTask(task.taskId);
    expect(retrieved?.status).toBe('completed');
  });

  it('should clean up completed or failed tasks older than 30 minutes', async () => {
    const taskCompletedOld = await taskRepository.createTask('completed');
    const taskFailedOld = await taskRepository.createTask('failed');
    const taskPendingOld = await taskRepository.createTask('pending');
    const taskCompletedNew = await taskRepository.createTask('completed');

    // completed / failed tasks completed 31 minutes ago
    const thirtyOneMinutes = 31 * 60 * 1000;
    
    // Manually force update database timestamps inside repository since they are set to Date.now()
    // Let's mock Date.now() to 31 minutes in the future
    vi.setSystemTime(Date.now() + thirtyOneMinutes + 1000);

    // Run cleanup
    await taskRepository.cleanup();

    expect(taskRepository.getTask(taskCompletedOld.taskId)).toBeNull();
    expect(taskRepository.getTask(taskFailedOld.taskId)).toBeNull();
    // Pending tasks are not cleaned up even if old
    expect(taskRepository.getTask(taskPendingOld.taskId)).toBeDefined();
    // New completed tasks are not cleaned up
    expect(taskRepository.getTask(taskCompletedNew.taskId)).toBeDefined();
  });

  it('should persist tasks across server restart (instance re-creation)', async () => {
    const customRepo = new TaskRepository(tempTestFile);
    const createdTask = await customRepo.createTask('processing', { progress: 50 });

    // Create a new instance pointing to the same file path (simulating server restart)
    const restartedRepo = new TaskRepository(tempTestFile);
    // Wait for async load and recover to finish
    await restartedRepo.loadFromDiskAndRecover();

    const fetchedTask = restartedRepo.getTask(createdTask.taskId);

    expect(fetchedTask).toBeDefined();
    expect(fetchedTask?.taskId).toBe(createdTask.taskId);
    expect(fetchedTask?.result).toEqual({ progress: 50 });

    customRepo.destroy();
    restartedRepo.destroy();
  });

  it('should automatically mark stuck processing tasks (> 10 minutes) as failed upon restart', async () => {
    const initialTime = Date.now();
    const customRepo = new TaskRepository(tempTestFile);

    // Create a task that was processing 11 minutes ago
    const stuckTask = await customRepo.createTask('processing');

    // Advance system time by 11 minutes
    const elevenMinutesMs = 11 * 60 * 1000;
    vi.setSystemTime(initialTime + elevenMinutesMs);

    // Re-instantiate TaskRepository (server restarted after 11 minutes)
    const restartedRepo = new TaskRepository(tempTestFile);
    // Wait for async load and recover to finish
    await restartedRepo.loadFromDiskAndRecover();

    const updatedTask = restartedRepo.getTask(stuckTask.taskId);

    expect(updatedTask).toBeDefined();
    expect(updatedTask?.status).toBe('failed');
    expect(updatedTask?.error).toBe('Server restarted while task was processing');

    customRepo.destroy();
    restartedRepo.destroy();
  });

  it('should handle high-concurrency race conditions during createTask', async () => {
    vi.useRealTimers(); // Use real timers for concurrent operations
    const customRepo = new TaskRepository(tempTestFile);

    // Fire 20 parallel createTask calls
    const concurrencyCount = 20;
    const createTaskPromises = Array.from({ length: concurrencyCount }).map((_, i) =>
      customRepo.createTask('pending', { index: i })
    );

    const createdTasks = await Promise.all(createTaskPromises);

    // Verify all returned tasks are unique and non-null
    expect(createdTasks.length).toBe(concurrencyCount);
    const uniqueIds = new Set(createdTasks.map(t => t.taskId));
    expect(uniqueIds.size).toBe(concurrencyCount);

    // Verify tasks are correctly saved to tasks.json and readable
    const allSavedTasks = customRepo.getAllTasksForTest();
    expect(allSavedTasks.length).toBe(concurrencyCount);

    for (const task of createdTasks) {
      const retrieved = customRepo.getTask(task.taskId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.status).toBe('pending');
    }

    customRepo.destroy();
  });

  it('should handle high-concurrency race conditions during updateTask', async () => {
    vi.useRealTimers(); // Use real timers
    const customRepo = new TaskRepository(tempTestFile);

    // Create 10 initial tasks
    const tasksCount = 10;
    const createdTasks = [];
    for (let i = 0; i < tasksCount; i++) {
      createdTasks.push(await customRepo.createTask('pending'));
    }

    // Simultaneously update all tasks in parallel
    const updatePromises = createdTasks.map((task, i) =>
      customRepo.updateTask(task.taskId, { status: 'completed', result: { updatedVal: i } })
    );

    const updatedTasks = await Promise.all(updatePromises);

    // Verify all updates completed successfully without loss
    expect(updatedTasks.length).toBe(tasksCount);
    const allSavedTasks = customRepo.getAllTasksForTest();
    expect(allSavedTasks.length).toBe(tasksCount);

    for (let i = 0; i < tasksCount; i++) {
      const retrieved = customRepo.getTask(createdTasks[i].taskId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.status).toBe('completed');
      expect(retrieved?.result).toEqual({ updatedVal: i });
    }

    customRepo.destroy();
  });
});
