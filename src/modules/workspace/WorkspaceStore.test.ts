import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WorkspaceStore } from './WorkspaceStore';

describe('WorkspaceStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with guest credentials if localStorage is empty', () => {
    const store = new WorkspaceStore();
    const user = store.getCurrentUser();
    expect(user.email).toBe('');
    expect(user.name).toBe('Khách');
    expect(user.role).toBe('Tài khoản Người dùng');
  });

  it('should update user fields and preserve role if not specified', () => {
    const store = new WorkspaceStore();
    
    // Set some initial state first
    store.updateCurrentUser({
      email: 'owner@example.com',
      name: 'Owner User',
      role: 'Tài khoản Chủ (Toàn quyền)'
    });

    // Check it updated correctly
    expect(store.getCurrentUser().role).toBe('Tài khoản Chủ (Toàn quyền)');

    // Now update just the email to a different address
    store.updateCurrentUser({
      email: 'random@user.com'
    });

    // Role MUST remain "Tài khoản Chủ (Toàn quyền)", not get downgraded or recalculated
    const user = store.getCurrentUser();
    expect(user.email).toBe('random@user.com');
    expect(user.role).toBe('Tài khoản Chủ (Toàn quyền)');
  });
});
