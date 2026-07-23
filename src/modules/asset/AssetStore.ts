import { ProjectAsset, AssetCategory, AssetStatus } from './AssetModel';

const ASSETS_STORAGE_KEY = 'love_note_project_assets_v59';

export const INITIAL_SAMPLE_ASSETS: ProjectAsset[] = [
  {
    id: 'asset-sample-1',
    projectId: 'proj-1',
    title: 'Bouquet Gift Illustration.jpg',
    url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop',
    type: 'image',
    size: 1245000,
    width: 1200,
    height: 800,
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
    favorite: true,
    tags: ['hoa', 'tri-an', 'romantic'],
    aiGenerated: false,
    provider: 'system',
    version: 1,
    status: 'active',
    mimeType: 'image/jpeg',
    description: 'Bó hoa tươi thắm mến tặng cô giáo',
    collections: ['Birthday', 'Family'],
    projectsUsed: ['Love Note Special', 'Kỷ niệm 20-11']
  },
  {
    id: 'asset-sample-2',
    projectId: 'proj-1',
    title: 'AI Dreamy Classroom Background.png',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    type: 'background',
    size: 2150000,
    width: 1920,
    height: 1080,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    favorite: true,
    tags: ['ai-art', 'classroom', 'warm'],
    aiGenerated: true,
    provider: 'gemini',
    version: 1,
    status: 'active',
    mimeType: 'image/png',
    description: 'Ảnh lớp học kỷ niệm được tạo bởi Gemini 3.5 Flash',
    collections: ['School', 'Teacher'],
    projectsUsed: ['Kỷ niệm 20-11']
  },
  {
    id: 'asset-sample-3',
    projectId: 'proj-1',
    title: 'Gentle Piano Melody.mp3',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=piano-moment-112248.mp3',
    type: 'audio',
    size: 3450000,
    duration: 142,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    favorite: false,
    tags: ['nhac-nen', 'piano', 'nhe-nhang'],
    aiGenerated: false,
    provider: 'system',
    version: 1,
    status: 'active',
    mimeType: 'audio/mp3',
    description: 'Giai điệu Piano nhẹ nhàng cho bài phát biểu',
    collections: ['Birthday', 'Journal'],
    projectsUsed: ['Love Note Special']
  },
  {
    id: 'asset-sample-4',
    projectId: 'proj-1',
    title: 'Loi_Tri_An_Co_Giao.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'document',
    size: 450000,
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
    favorite: false,
    tags: ['kich-ban', 'pdf', 'van-ban'],
    aiGenerated: false,
    provider: 'local',
    version: 1,
    status: 'active',
    mimeType: 'application/pdf',
    description: 'File dự thảo văn bản lời tri ân gửi Thầy Cô',
    collections: ['School', 'Teacher'],
    projectsUsed: []
  },
  {
    id: 'asset-sample-5',
    projectId: 'proj-2',
    title: 'Romantic Sunset Memory.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'video',
    size: 15400000,
    width: 1280,
    height: 720,
    duration: 15,
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
    favorite: true,
    tags: ['video-loop', 'hoang-hon', 'ky-niem'],
    aiGenerated: false,
    provider: 'external',
    version: 1,
    status: 'active',
    mimeType: 'video/mp4',
    description: 'Video kỷ niệm hoàng hôn lãng mạn',
    collections: ['Travel', 'Family'],
    projectsUsed: ['Chuyến đi Đà Lạt 2026']
  },
  {
    id: 'asset-sample-6',
    projectId: 'proj-2',
    title: 'AI Birthday Cake Art.png',
    url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop',
    type: 'ai',
    size: 1890000,
    width: 1024,
    height: 1024,
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
    favorite: true,
    tags: ['ai-gen', 'sinhnhat', 'cake'],
    aiGenerated: true,
    provider: 'ai-studio',
    version: 1,
    status: 'active',
    mimeType: 'image/png',
    description: 'Bánh sinh nhật phong cách màu nước tạo bởi AI Studio',
    collections: ['Birthday'],
    projectsUsed: ['Sinh Nhật Người Thương']
  },
  {
    id: 'asset-sample-7',
    projectId: 'proj-1',
    title: 'Sweet Sparkle Stars.svg',
    url: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=200&auto=format&fit=crop',
    type: 'icon',
    size: 4500,
    width: 64,
    height: 64,
    createdAt: Date.now() - 3600000 * 8,
    updatedAt: Date.now() - 3600000 * 8,
    favorite: false,
    tags: ['icon', 'star', 'sparkle'],
    aiGenerated: false,
    provider: 'system',
    version: 1,
    status: 'active',
    mimeType: 'image/svg+xml',
    description: 'Icon ngôi sao lấp lánh trang trí thiệp',
    collections: ['Journal', 'Birthday'],
    projectsUsed: ['Kỷ niệm 20-11']
  },
  {
    id: 'asset-sample-8',
    projectId: 'proj-1',
    title: 'Classic Love Letter Layout.json',
    url: '',
    type: 'template',
    size: 15400,
    createdAt: Date.now() - 3600000 * 12,
    updatedAt: Date.now() - 3600000 * 12,
    favorite: false,
    tags: ['template', 'layout', 'letter'],
    aiGenerated: false,
    provider: 'system',
    version: 1,
    status: 'active',
    mimeType: 'application/json',
    description: 'Bố cục thiệp thư tình cổ điển lãng mạn',
    collections: ['Journal'],
    projectsUsed: ['Love Note Special']
  }
];

export class AssetStore {
  private assets: ProjectAsset[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadAssets();
  }

  private loadAssets() {
    try {
      const stored = localStorage.getItem(ASSETS_STORAGE_KEY);
      if (stored) {
        this.assets = JSON.parse(stored);
      } else {
        this.assets = [...INITIAL_SAMPLE_ASSETS];
        this.saveAssets();
      }
    } catch (e) {
      console.error('Failed to load project assets:', e);
      this.assets = [...INITIAL_SAMPLE_ASSETS];
    }
  }

  private saveAssets() {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(this.assets));
    } catch (e) {
      console.error('Failed to save project assets:', e);
    }
  }

  public getAssets(projectId?: string): ProjectAsset[] {
    if (!projectId) return this.assets;
    const projectAssets = this.assets.filter(a => a.projectId === projectId);
    if (projectAssets.length === 0) {
      // Seed this project with sample assets dynamically so the user always has gorgeous assets to work with!
      const seeded = INITIAL_SAMPLE_ASSETS.map(asset => ({
        ...asset,
        id: `${asset.id}-${projectId}`,
        projectId: projectId
      }));
      this.assets = [...this.assets, ...seeded];
      this.saveAssets();
      return seeded;
    }
    return projectAssets;
  }

  public getAssetById(id: string): ProjectAsset | undefined {
    return this.assets.find(a => a.id === id);
  }

  public getAssetByHash(hash?: string): ProjectAsset | undefined {
    if (!hash) return undefined;
    return this.assets.find(a => a.hash === hash);
  }

  public addAsset(asset: Omit<ProjectAsset, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'status'> & { id?: string }): ProjectAsset {
    const newAsset: ProjectAsset = {
      id: asset.id || `asset-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
      status: 'active',
      favorite: asset.favorite ?? false,
      tags: asset.tags || [],
      aiGenerated: asset.aiGenerated ?? false,
      provider: asset.provider || 'local',
      ...asset,
    };

    this.assets = [newAsset, ...this.assets];
    this.saveAssets();
    this.notify();
    return newAsset;
  }

  public updateAsset(id: string, updates: Partial<ProjectAsset>): ProjectAsset | undefined {
    let updatedAsset: ProjectAsset | undefined;
    this.assets = this.assets.map(a => {
      if (a.id === id) {
        updatedAsset = {
          ...a,
          ...updates,
          updatedAt: Date.now(),
        };
        return updatedAsset;
      }
      return a;
    });

    if (updatedAsset) {
      this.saveAssets();
      this.notify();
    }
    return updatedAsset;
  }

  public toggleFavorite(id: string): void {
    const asset = this.getAssetById(id);
    if (asset) {
      this.updateAsset(id, { favorite: !asset.favorite });
    }
  }

  public moveToTrash(id: string): void {
    this.updateAsset(id, { status: 'trash' });
  }

  public restoreFromTrash(id: string): void {
    this.updateAsset(id, { status: 'active' });
  }

  public deletePermanently(id: string): void {
    this.assets = this.assets.filter(a => a.id !== id);
    this.saveAssets();
    this.notify();
  }

  public clearTrash(projectId?: string): void {
    this.assets = this.assets.filter(a => {
      if (projectId && a.projectId !== projectId) return true;
      return a.status !== 'trash';
    });
    this.saveAssets();
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}

export const assetStore = new AssetStore();
