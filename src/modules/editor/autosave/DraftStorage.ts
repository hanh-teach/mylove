import { NoteDocument } from '../../../components/editor/DocumentModel';
import { VersionMetadata } from './VersionDiff';

const DB_NAME = 'LoveNoteAutoSaveDB';
const STORE_DRAFTS = 'drafts';
const STORE_VERSIONS = 'versions';
const DB_VERSION = 1;

export class DraftStorage {
  private static openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB not supported'));
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
          db.createObjectStore(STORE_DRAFTS, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE_VERSIONS)) {
          db.createObjectStore(STORE_VERSIONS, { keyPath: 'id' });
        }
      };
    });
  }

  static async saveDraft(doc: NoteDocument): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      const store = tx.objectStore(STORE_DRAFTS);
      store.put({ key: 'current_draft', document: doc, timestamp: Date.now() });
      return new Promise((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      // Fallback to localStorage
      try {
        localStorage.setItem('lovenote_draft_fallback', JSON.stringify({ document: doc, timestamp: Date.now() }));
      } catch (err) {
        console.error('Draft storage fallback failed:', err);
      }
    }
  }

  static async getDraft(): Promise<{ document: NoteDocument; timestamp: number } | null> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_DRAFTS, 'readonly');
        const store = tx.objectStore(STORE_DRAFTS);
        const req = store.get('current_draft');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      try {
        const raw = localStorage.getItem('lovenote_draft_fallback');
        if (raw) return JSON.parse(raw);
      } catch (err) {}
      return null;
    }
  }

  static async clearDraft(): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      tx.objectStore(STORE_DRAFTS).delete('current_draft');
    } catch (e) {
      localStorage.removeItem('lovenote_draft_fallback');
    }
  }

  static async saveVersion(version: VersionMetadata): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_VERSIONS, 'readwrite');
      tx.objectStore(STORE_VERSIONS).put(version);
    } catch (e) {
      try {
        const versions = await this.getVersions();
        versions.unshift(version);
        localStorage.setItem('lovenote_versions_fallback', JSON.stringify(versions.slice(0, 50)));
      } catch (err) {}
    }
  }

  static async getVersions(): Promise<VersionMetadata[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_VERSIONS, 'readonly');
        const store = tx.objectStore(STORE_VERSIONS);
        const req = store.getAll();
        req.onsuccess = () => {
          const list = req.result || [];
          // Sort newest first
          list.sort((a, b) => b.timestamp - a.timestamp);
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      try {
        const raw = localStorage.getItem('lovenote_versions_fallback');
        if (raw) return JSON.parse(raw);
      } catch (err) {}
      return [];
    }
  }

  static async deleteVersion(id: string): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_VERSIONS, 'readwrite');
      tx.objectStore(STORE_VERSIONS).delete(id);
    } catch (e) {
      try {
        let versions = await this.getVersions();
        versions = versions.filter(v => v.id !== id);
        localStorage.setItem('lovenote_versions_fallback', JSON.stringify(versions));
      } catch (err) {}
    }
  }
}
