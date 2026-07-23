export type MarketplaceCategory = 'template' | 'plugin' | 'theme' | 'aipack' | 'collection';
export type MarketplaceTag = 'featured' | 'trending' | 'new' | 'education' | 'family' | 'work' | 'event' | 'ai';

export interface AuthorProfile {
  id: string;
  name: string;
  bio: string;
  downloads: number;
  rating: number;
  verified: boolean;
  joinedAt: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  versionUsed: string;
  timestamp: number;
}

export interface MarketplaceItem {
  id: string;
  type: MarketplaceCategory;
  name: string;
  description: string;
  authorId: string;
  authorName: string;
  version: string;
  downloads: number;
  rating: number;
  tags: MarketplaceTag[];
  updatedAt: number;
  price?: number; // 0 for free
  thumbnail?: string;
  
  // Specific properties depending on type
  permissionsRequested?: string[];
  features?: string[];
  includes?: string[];
}

export interface Collection extends MarketplaceItem {
  type: 'collection';
  items: string[]; // IDs of items in the collection
}

export interface UserMarketplaceData {
  installedItemIds: string[];
  favoriteItemIds: string[];
  updatesAvailable: {
    itemId: string;
    newVersion: string;
  }[];
}
