import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ContactRequestRepository } from './contactRequestRepository';

describe('ContactRequestRepository - Concurrent Write and Lock Verification', () => {
  const testFilePath = path.join(process.cwd(), 'temp_test_contact_requests.json');
  let repo: ContactRequestRepository;

  beforeEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    repo = new ContactRequestRepository(testFilePath);
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      try {
        fs.unlinkSync(testFilePath);
      } catch (e) {}
    }
  });

  it('should handle sequential save correctly', async () => {
    await repo.saveContactRequest('john@example.com', 'John Doe');
    const requests = await repo.getContactRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].email).toBe('john@example.com');
  });

  it('should prevent lost updates during high concurrency contact requests (Promise.all)', async () => {
    const totalRequests = 20;
    const concurrentTasks = Array.from({ length: totalRequests }, (_, i) => {
      return repo.saveContactRequest(`user${i}@domain.com`, `User ${i}`);
    });

    await Promise.all(concurrentTasks);

    const allRequests = await repo.getContactRequests();
    expect(allRequests).toHaveLength(totalRequests);

    const savedEmails = new Set(allRequests.map(r => r.email));
    for (let i = 0; i < totalRequests; i++) {
      expect(savedEmails.has(`user${i}@domain.com`)).toBe(true);
    }
  });
});
