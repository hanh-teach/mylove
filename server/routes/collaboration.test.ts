import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { requireAuth } from '../middlewares/requireAuth';

const TEST_SECRET = 'collab-jwt-secret';
process.env.JWT_SECRET = TEST_SECRET;

interface ServerInvite {
  inviteId: string;
  projectId: string;
  ownerUserId: string;
  email: string;
  name: string;
  role: string;
  status: 'pending' | 'active';
  updatedAt: number;
}

let inMemoryInvites: ServerInvite[] = [];

const app = express();
app.use(express.json());

app.get('/api/collaboration/invites', requireAuth, (req, res) => {
  const { projectId } = req.query;
  const currentUserId = req.user?.userId;
  const currentUserEmail = req.user?.email ? req.user.email.toLowerCase() : '';
  const isSystemOwner = req.user?.role === 'owner';

  if (projectId) {
    const projectInvites = inMemoryInvites.filter(i => i.projectId === String(projectId));
    const projectOwnerUserId = projectInvites.find(i => i.ownerUserId)?.ownerUserId;

    const isProjectOwner = isSystemOwner || (currentUserId && projectOwnerUserId === currentUserId);
    const isCollaborator = projectInvites.some(i => i.email.toLowerCase() === currentUserEmail);

    if (!isProjectOwner && !isCollaborator && projectInvites.length > 0) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    return res.json({ success: true, invites: projectInvites });
  }

  if (isSystemOwner) {
    return res.json({ success: true, invites: inMemoryInvites });
  }

  const userFiltered = inMemoryInvites.filter(i =>
    (currentUserId && i.ownerUserId === currentUserId) ||
    (currentUserEmail && i.email.toLowerCase() === currentUserEmail)
  );
  return res.json({ success: true, invites: userFiltered });
});

app.post('/api/collaboration/invites', requireAuth, (req, res) => {
  const { inviteId, projectId, email, name, role, status } = req.body;
  if (!inviteId || !projectId) {
    return res.status(400).json({ success: false, error: 'inviteId and projectId are required' });
  }

  const currentUserId = req.user?.userId || '';
  const currentUserEmail = req.user?.email ? req.user.email.toLowerCase() : '';
  const isSystemOwner = req.user?.role === 'owner';

  const projectInvites = inMemoryInvites.filter(i => i.projectId === String(projectId));
  const existingOwnerUserId = projectInvites.find(i => i.ownerUserId)?.ownerUserId;

  if (projectInvites.length > 0 && existingOwnerUserId) {
    const isOwner = isSystemOwner || (currentUserId && existingOwnerUserId === currentUserId);
    const isCollaborator = projectInvites.some(i => i.email.toLowerCase() === currentUserEmail && i.status === 'active');

    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }
  }

  const existingIdx = inMemoryInvites.findIndex(i => i.inviteId === inviteId || (i.projectId === projectId && i.email && email && i.email.toLowerCase() === email.toLowerCase()));

  const newInvite: ServerInvite = {
    inviteId,
    projectId,
    ownerUserId: existingOwnerUserId || (existingIdx >= 0 && inMemoryInvites[existingIdx].ownerUserId) || currentUserId,
    email: email || '',
    name: name || '',
    role: role || 'editor',
    status: status || 'pending',
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    inMemoryInvites[existingIdx] = { ...inMemoryInvites[existingIdx], ...newInvite };
  } else {
    inMemoryInvites.push(newInvite);
  }

  return res.json({ success: true, invite: newInvite });
});

app.post('/api/collaboration/accept-invite', requireAuth, (req, res) => {
  const { inviteId, projectId } = req.body;
  const userEmail = req.user?.email;
  const userName = req.user?.name;
  const isSystemOwner = req.user?.role === 'owner';

  if (!inviteId && !projectId) {
    return res.status(400).json({ success: false, error: 'inviteId or projectId is required' });
  }

  let target = inMemoryInvites.find(i => i.inviteId === inviteId || (projectId && i.projectId === projectId && userEmail && i.email.toLowerCase() === userEmail.toLowerCase()));

  if (!target) {
    return res.status(404).json({ success: false, error: 'Lời mời không tồn tại' });
  }

  if (!isSystemOwner && target.email && userEmail && target.email.toLowerCase() !== userEmail.toLowerCase()) {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  target.status = 'active';
  if (userName) target.name = userName;
  if (userEmail) target.email = userEmail;
  target.updatedAt = Date.now();

  return res.json({ success: true, invite: target });
});

describe('Collaboration Endpoints Auth & Ownership', () => {
  const ownerToken = jwt.sign(
    { userId: 'owner-id-1', email: 'owner@example.com', name: 'Owner', role: 'user' },
    TEST_SECRET
  );

  const strangerToken = jwt.sign(
    { userId: 'stranger-id-9', email: 'stranger@example.com', name: 'Stranger', role: 'user' },
    TEST_SECRET
  );

  const inviteeToken = jwt.sign(
    { userId: 'invitee-id-2', email: 'collab@example.com', name: 'Collaborator', role: 'user' },
    TEST_SECRET
  );

  beforeEach(() => {
    inMemoryInvites = [
      {
        inviteId: 'inv-101',
        projectId: 'proj-alpha',
        ownerUserId: 'owner-id-1',
        email: 'collab@example.com',
        name: 'Collaborator',
        role: 'editor',
        status: 'pending',
        updatedAt: Date.now()
      }
    ];
  });

  it('returns 401 Unauthorized if unauthenticated for GET /api/collaboration/invites', async () => {
    const res = await request(app).get('/api/collaboration/invites?projectId=proj-alpha');
    expect(res.status).toBe(401);
  });

  it('returns 403 Forbidden when a stranger attempts to view invites of an unowned project', async () => {
    const res = await request(app)
      .get('/api/collaboration/invites?projectId=proj-alpha')
      .set('Authorization', `Bearer ${strangerToken}`);

    expect(res.status).toBe(403);
  });

  it('returns 200 OK when the project owner fetches project invites', async () => {
    const res = await request(app)
      .get('/api/collaboration/invites?projectId=proj-alpha')
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.invites.length).toBe(1);
  });

  it('returns 403 Forbidden when a stranger attempts to modify invites for a project', async () => {
    const res = await request(app)
      .post('/api/collaboration/invites')
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({
        inviteId: 'inv-102',
        projectId: 'proj-alpha',
        email: 'attacker@example.com',
        role: 'editor'
      });

    expect(res.status).toBe(403);
  });

  it('returns 403 Forbidden when accepting an invitation intended for another user email', async () => {
    const res = await request(app)
      .post('/api/collaboration/accept-invite')
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({
        inviteId: 'inv-101',
        projectId: 'proj-alpha'
      });

    expect(res.status).toBe(403);
  });

  it('returns 200 OK when the legitimate invitee accepts the invitation', async () => {
    const res = await request(app)
      .post('/api/collaboration/accept-invite')
      .set('Authorization', `Bearer ${inviteeToken}`)
      .send({
        inviteId: 'inv-101',
        projectId: 'proj-alpha'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.invite.status).toBe('active');
  });
});
