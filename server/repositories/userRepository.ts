import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserRecord {
  userId: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'owner' | 'user' | 'editor';
  createdAt: number;
  resetCode?: string;
  resetExpires?: number;
  twoFactorEnabled?: boolean;
  twoFactorTempCode?: string;
  twoFactorTempExpires?: number;
}

const USERS_FILE = path.join(process.cwd(), 'users.json');

class UserRepository {
  private users: UserRecord[] = [];

  constructor() {
    this.loadUsers();
  }

  private loadUsers(): void {
    try {
      if (fs.existsSync(USERS_FILE)) {
        const raw = fs.readFileSync(USERS_FILE, 'utf8');
        this.users = JSON.parse(raw);
      } else {
        this.users = [];
      }
    } catch (err) {
      console.error('Error loading users:', err);
      this.users = [];
    }
  }

  private saveUsers(): void {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(this.users, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving users:', err);
    }
  }

  public findByEmail(email: string): UserRecord | null {
    this.loadUsers();
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return this.users.find(u => u.email.toLowerCase() === clean) || null;
  }

  public findById(userId: string): UserRecord | null {
    this.loadUsers();
    if (!userId) return null;
    return this.users.find(u => u.userId === userId) || null;
  }

  public createUser(data: { email: string; passwordHash: string; name: string; role?: 'owner' | 'user' | 'editor' }): UserRecord {
    this.loadUsers();
    const userId = crypto.randomUUID();
    const newUser: UserRecord = {
      userId,
      email: data.email.trim().toLowerCase(),
      passwordHash: data.passwordHash,
      name: data.name || data.email.split('@')[0],
      role: data.role || 'user',
      createdAt: Date.now()
    };
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  public updateUser(userId: string, updates: Partial<Omit<UserRecord, 'userId' | 'createdAt'>>): UserRecord | null {
    this.loadUsers();
    const idx = this.users.findIndex(u => u.userId === userId);
    if (idx === -1) return null;

    const updatedUser: UserRecord = {
      ...this.users[idx],
      ...updates
    };
    this.users[idx] = updatedUser;
    this.saveUsers();
    return updatedUser;
  }

  public getAllUsers(): UserRecord[] {
    this.loadUsers();
    return [...this.users];
  }

  public clearForTest(): void {
    this.users = [];
    if (fs.existsSync(USERS_FILE)) {
      try {
        fs.unlinkSync(USERS_FILE);
      } catch (e) {}
    }
  }
}

export const userRepository = new UserRepository();
