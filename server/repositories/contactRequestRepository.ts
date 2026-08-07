import fs from 'fs';
import path from 'path';
import { withFileLock } from '../utils/fileLock';

export interface ContactRequest {
  id: string;
  email: string;
  name: string;
  date: string;
  status: string;
}

const DEFAULT_CONTACT_REQUESTS_FILE = path.join(process.cwd(), 'contact_requests.json');

export class ContactRequestRepository {
  private filePath: string;

  constructor(filePath: string = DEFAULT_CONTACT_REQUESTS_FILE) {
    this.filePath = filePath;
  }

  private readUnsafe(): ContactRequest[] {
    try {
      if (!fs.existsSync(this.filePath)) return [];
      const raw = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  private writeUnsafe(requests: ContactRequest[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(requests, null, 2), 'utf8');
  }

  public async getContactRequests(): Promise<ContactRequest[]> {
    return withFileLock(this.filePath, () => {
      return this.readUnsafe();
    });
  }

  public async saveContactRequest(
    email: string,
    name?: string
  ): Promise<{ requests: ContactRequest[]; savedRequest: ContactRequest }> {
    return withFileLock(this.filePath, () => {
      const cleanEmail = email.trim().toLowerCase();
      const requests = this.readUnsafe();

      const existingIndex = requests.findIndex((r) => r.email === cleanEmail);
      let savedRequest: ContactRequest;

      if (existingIndex > -1) {
        savedRequest = {
          ...requests[existingIndex],
          name: name || requests[existingIndex].name,
          date: new Date().toISOString(),
        };
        requests[existingIndex] = savedRequest;
      } else {
        savedRequest = {
          id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
          email: cleanEmail,
          name: name || cleanEmail.split('@')[0],
          date: new Date().toISOString(),
          status: 'pending',
        };
        requests.push(savedRequest);
      }

      this.writeUnsafe(requests);
      return { requests, savedRequest };
    });
  }
}

export const contactRequestRepository = new ContactRequestRepository();
