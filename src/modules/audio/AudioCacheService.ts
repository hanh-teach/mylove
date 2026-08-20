// Audio Cache Service with IndexedDB for NoteMe v2.0
// Ensures 0ms playback latency and offline audio resilience

interface CachedAudioRecord {
  url: string;
  blob: Blob;
  mimeType: string;
  size: number;
  cachedAt: number;
}

class AudioCacheService {
  private static instance: AudioCacheService;
  private dbName = 'noteme_audio_cache_db';
  private storeName = 'audio_blobs';
  private dbPromise: Promise<IDBDatabase | null>;
  private objectUrlMap: Map<string, string> = new Map();
  private isPreloading: boolean = false;

  private constructor() {
    this.dbPromise = this.initDb();
  }

  public static getInstance(): AudioCacheService {
    if (!AudioCacheService.instance) {
      AudioCacheService.instance = new AudioCacheService();
    }
    return AudioCacheService.instance;
  }

  private async initDb(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return null;
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event) => {
          const db = request.result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: 'url' });
          }
        };

        request.onsuccess = () => {
          resolve(request.result);
        };

        request.onerror = (err) => {
          console.warn('[AudioCacheService] IndexedDB open error, falling back to direct network:', err);
          resolve(null);
        };
      } catch (e) {
        console.warn('[AudioCacheService] IndexedDB unavailable:', e);
        resolve(null);
      }
    });
  }

  /**
   * Retrieves a cached Audio Blob from IndexedDB
   */
  public async getAudioBlob(url: string): Promise<Blob | null> {
    const db = await this.dbPromise;
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.get(url);

        req.onsuccess = () => {
          const record = req.result as CachedAudioRecord | undefined;
          resolve(record?.blob || null);
        };

        req.onerror = () => {
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  }

  /**
   * Saves an Audio Blob to IndexedDB
   */
  public async saveAudioBlob(url: string, blob: Blob): Promise<void> {
    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        const record: CachedAudioRecord = {
          url,
          blob,
          mimeType: blob.type || 'audio/mp3',
          size: blob.size,
          cachedAt: Date.now()
        };

        store.put(record);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  /**
   * Returns a ready-to-play URL (Object URL from cache if available, or fetches, caches, and returns)
   */
  public async getOrFetchAudioUrl(url: string): Promise<string> {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }

    // Check if we already have an active object URL for this track
    if (this.objectUrlMap.has(url)) {
      return this.objectUrlMap.get(url)!;
    }

    try {
      // 1. Check IndexedDB cache
      const cachedBlob = await this.getAudioBlob(url);
      if (cachedBlob) {
        const objUrl = URL.createObjectURL(cachedBlob);
        this.objectUrlMap.set(url, objUrl);
        return objUrl;
      }

      // 2. Fetch from network and save to IndexedDB cache
      const res = await fetch(url);
      if (res.ok) {
        const blob = await res.blob();
        await this.saveAudioBlob(url, blob);
        const objUrl = URL.createObjectURL(blob);
        this.objectUrlMap.set(url, objUrl);
        return objUrl;
      }
    } catch (err) {
      console.warn('[AudioCacheService] Cache fetch error, streaming from direct URL:', err);
    }

    // Fallback to original remote URL
    return url;
  }

  /**
   * Preload a list of tracks in background during idle time
   */
  public async preloadTracks(urls: string[]): Promise<void> {
    if (this.isPreloading) return;
    this.isPreloading = true;

    const queue = urls.filter((u) => u && !u.startsWith('data:') && !u.startsWith('blob:'));

    for (const url of queue) {
      try {
        const cached = await this.getAudioBlob(url);
        if (!cached) {
          const res = await fetch(url);
          if (res.ok) {
            const blob = await res.blob();
            await this.saveAudioBlob(url, blob);
          }
        }
      } catch (err) {
        // Continue silently on background preload
      }
    }

    this.isPreloading = false;
  }

  /**
   * Check if a URL is currently cached locally
   */
  public async isCached(url: string): Promise<boolean> {
    const blob = await this.getAudioBlob(url);
    return blob !== null;
  }

  /**
   * Clears the entire audio cache and revokes memory URLs
   */
  public async clearCache(): Promise<void> {
    // Revoke memory URLs
    this.objectUrlMap.forEach((objUrl) => {
      try {
        URL.revokeObjectURL(objUrl);
      } catch (e) {}
    });
    this.objectUrlMap.clear();

    const db = await this.dbPromise;
    if (!db) return;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readwrite');
        const store = tx.objectStore(this.storeName);
        store.clear();
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch (e) {
        resolve();
      }
    });
  }

  /**
   * Returns cache stats
   */
  public async getCacheStats(): Promise<{ count: number; totalBytes: number }> {
    const db = await this.dbPromise;
    if (!db) return { count: 0, totalBytes: 0 };

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
        const req = store.getAll();

        req.onsuccess = () => {
          const records = (req.result as CachedAudioRecord[]) || [];
          const count = records.length;
          const totalBytes = records.reduce((acc, cur) => acc + (cur.size || 0), 0);
          resolve({ count, totalBytes });
        };

        req.onerror = () => resolve({ count: 0, totalBytes: 0 });
      } catch (e) {
        resolve({ count: 0, totalBytes: 0 });
      }
    });
  }
}

export const audioCacheService = AudioCacheService.getInstance();
