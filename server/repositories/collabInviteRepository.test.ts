import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { CollabInviteRepository } from './collabInviteRepository';

describe('CollabInviteRepository - Concurrent Write and Lock Verification', () => {
  const testFilePath = path.join(process.cwd(), 'temp_test_collab_invites.json');
  let repo: CollabInviteRepository;

  beforeEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    repo = new CollabInviteRepository(testFilePath);
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      try {
        fs.unlinkSync(testFilePath);
      } catch (e) {}
    }
  });

  it('should handle sequential save and fetch correctly', async () => {
    await repo.saveInvite({
      inviteId: 'inv-1',
      projectId: 'proj-1',
      email: 'user1@example.com',
      name: 'User 1'
    });

    const invites = await repo.getInvites();
    expect(invites).toHaveLength(1);
    expect(invites[0].inviteId).toBe('inv-1');
  });

  it('should prevent lost updates during high concurrency writes (Promise.all)', async () => {
    const totalRequests = 15;
    const concurrentSaveTasks = Array.from({ length: totalRequests }, (_, i) => {
      return repo.saveInvite({
        inviteId: `concurrent-inv-${i}`,
        projectId: 'proj-concurrent',
        email: `concurrent${i}@example.com`,
        name: `Concurrent User ${i}`
      });
    });

    const results = await Promise.all(concurrentSaveTasks);
    expect(results).toHaveLength(totalRequests);

    const savedInvites = await repo.getInvites();
    expect(savedInvites).toHaveLength(totalRequests);

    const savedIds = new Set(savedInvites.map(i => i.inviteId));
    for (let i = 0; i < totalRequests; i++) {
      expect(savedIds.has(`concurrent-inv-${i}`)).toBe(true);
    }
  });
});
