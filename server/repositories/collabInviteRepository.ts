import fs from 'fs';
import path from 'path';
import { withFileLock } from '../utils/fileLock';

export interface ServerInvite {
  inviteId: string;
  projectId: string;
  ownerUserId: string;
  email: string;
  name: string;
  role: string;
  status: 'pending' | 'active';
  updatedAt: number;
}

const DEFAULT_COLLAB_INVITES_FILE = path.join(process.cwd(), 'collab_invites.json');

export class CollabInviteRepository {
  private filePath: string;

  constructor(filePath: string = DEFAULT_COLLAB_INVITES_FILE) {
    this.filePath = filePath;
  }

  private readUnsafe(): ServerInvite[] {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const raw = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  private writeUnsafe(invites: ServerInvite[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(invites, null, 2), 'utf8');
  }

  public async getInvites(): Promise<ServerInvite[]> {
    return withFileLock(this.filePath, () => {
      return this.readUnsafe();
    });
  }

  public async saveInvite(data: {
    inviteId: string;
    projectId: string;
    ownerUserId?: string;
    email?: string;
    name?: string;
    role?: string;
    status?: 'pending' | 'active';
    currentUserId?: string;
    isSystemOwner?: boolean;
  }): Promise<{ invite?: ServerInvite; forbidden?: boolean; error?: string }> {
    return withFileLock(this.filePath, () => {
      const invites = this.readUnsafe();
      const currentUserId = data.currentUserId || '';
      const currentUserEmail = data.email ? data.email.toLowerCase() : '';
      const isSystemOwner = !!data.isSystemOwner;

      const projectInvites = invites.filter((i) => i.projectId === String(data.projectId));
      const existingOwnerUserId = projectInvites.find((i) => i.ownerUserId)?.ownerUserId;

      if (projectInvites.length > 0 && existingOwnerUserId) {
        const isOwner = isSystemOwner || (currentUserId && existingOwnerUserId === currentUserId);
        const isCollaborator = projectInvites.some(
          (i) => i.email.toLowerCase() === currentUserEmail && i.status === 'active'
        );

        if (!isOwner && !isCollaborator) {
          return {
            forbidden: true,
            error: 'Forbidden: Bạn không có quyền quản lý lời mời cho project này',
          };
        }
      }

      const existingIdx = invites.findIndex(
        (i) =>
          i.inviteId === data.inviteId ||
          (i.projectId === data.projectId &&
            i.email &&
            data.email &&
            i.email.toLowerCase() === data.email.toLowerCase())
      );

      const newInvite: ServerInvite = {
        inviteId: data.inviteId,
        projectId: data.projectId,
        ownerUserId:
          existingOwnerUserId ||
          (existingIdx >= 0 && invites[existingIdx].ownerUserId) ||
          data.ownerUserId ||
          currentUserId,
        email: data.email || '',
        name: data.name || '',
        role: data.role || 'editor',
        status: data.status || 'pending',
        updatedAt: Date.now(),
      };

      if (existingIdx >= 0) {
        invites[existingIdx] = { ...invites[existingIdx], ...newInvite };
      } else {
        invites.push(newInvite);
      }

      this.writeUnsafe(invites);
      return { invite: newInvite };
    });
  }

  public async acceptInvite(data: {
    inviteId?: string;
    projectId?: string;
    userEmail?: string;
    userName?: string;
    isSystemOwner?: boolean;
  }): Promise<{ invite?: ServerInvite; error?: string; status: number }> {
    return withFileLock(this.filePath, () => {
      const invites = this.readUnsafe();
      const userEmail = data.userEmail;
      const userName = data.userName;
      const isSystemOwner = !!data.isSystemOwner;

      const target = invites.find(
        (i) =>
          i.inviteId === data.inviteId ||
          (data.projectId &&
            i.projectId === data.projectId &&
            userEmail &&
            i.email.toLowerCase() === userEmail.toLowerCase())
      );

      if (!target) {
        return { error: 'Lời mời không tồn tại hoặc đã hết hạn', status: 404 };
      }

      if (
        !isSystemOwner &&
        target.email &&
        userEmail &&
        target.email.toLowerCase() !== userEmail.toLowerCase()
      ) {
        return { error: 'Forbidden: Lời mời này không dành cho tài khoản của bạn', status: 403 };
      }

      target.status = 'active';
      if (userName) target.name = userName;
      if (userEmail) target.email = userEmail;
      target.updatedAt = Date.now();

      this.writeUnsafe(invites);
      return { invite: target, status: 200 };
    });
  }
}

export const collabInviteRepository = new CollabInviteRepository();
