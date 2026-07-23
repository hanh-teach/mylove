import { MarketplaceItem, AuthorProfile, UserMarketplaceData, Review } from './types';

class MarketplaceService {
  private items: MarketplaceItem[] = [
    {
      id: 'item_1',
      type: 'template',
      name: 'Minimalist Wedding Vows',
      description: 'Elegant typography and spacing for your special day.',
      authorId: 'auth_1',
      authorName: 'LoveNote Design',
      version: '1.0.0',
      downloads: 12450,
      rating: 4.9,
      tags: ['event', 'featured', 'trending'],
      updatedAt: Date.now() - 86400000 * 5,
      price: 0,
    },
    {
      id: 'item_2',
      type: 'plugin',
      name: 'Grammar Master Pro',
      description: 'Advanced AI-powered grammar checking and tone suggestions.',
      authorId: 'auth_2',
      authorName: 'WordSmith AI',
      version: '2.1.0',
      downloads: 8530,
      rating: 4.7,
      tags: ['work', 'ai', 'featured'],
      updatedAt: Date.now() - 86400000 * 2,
      price: 0,
      permissionsRequested: ['memory:read', 'internet'],
      features: ['Real-time checking', 'Tone analysis', 'Multi-language support']
    },
    {
      id: 'item_3',
      type: 'aipack',
      name: 'Teacher Assistant Pack',
      description: 'Complete suite for educators: Lesson plans, student feedback, and more.',
      authorId: 'auth_3',
      authorName: 'EduTech Solutions',
      version: '1.2.5',
      downloads: 3200,
      rating: 4.8,
      tags: ['education', 'ai', 'trending'],
      updatedAt: Date.now() - 86400000 * 10,
      price: 0,
      includes: ['Lesson Plan Template', 'Feedback Prompt', 'Grading Automation']
    },
    {
      id: 'item_4',
      type: 'theme',
      name: 'Cozy Journal',
      description: 'Warm colors and handwritten fonts for a personal diary feel.',
      authorId: 'auth_1',
      authorName: 'LoveNote Design',
      version: '1.1.0',
      downloads: 25600,
      rating: 4.9,
      tags: ['family', 'featured'],
      updatedAt: Date.now() - 86400000 * 20,
      price: 0,
    },
    {
      id: 'item_5',
      type: 'collection',
      name: 'Back to School 2026',
      description: 'Everything you need to start the new semester right.',
      authorId: 'auth_3',
      authorName: 'EduTech Solutions',
      version: '1.0.0',
      downloads: 1500,
      rating: 4.6,
      tags: ['education', 'new'],
      updatedAt: Date.now() - 86400000 * 1,
      price: 0,
      includes: ['Student Planner Template', 'Study Habit Tracker', 'Focus Theme']
    }
  ];

  private userData: UserMarketplaceData = {
    installedItemIds: ['item_4'],
    favoriteItemIds: ['item_1', 'item_3'],
    updatesAvailable: [
      { itemId: 'item_4', newVersion: '1.2.0' }
    ]
  };

  private authors: Record<string, AuthorProfile> = {
    'auth_1': {
      id: 'auth_1',
      name: 'LoveNote Design',
      bio: 'Official design team of LoveNote.',
      downloads: 150000,
      rating: 4.9,
      verified: true,
      joinedAt: Date.now() - 86400000 * 365 * 2
    },
    'auth_2': {
      id: 'auth_2',
      name: 'WordSmith AI',
      bio: 'Building the next generation of writing tools.',
      downloads: 45000,
      rating: 4.7,
      verified: true,
      joinedAt: Date.now() - 86400000 * 200
    }
  };

  private reviews: Record<string, Review[]> = {
    'item_2': [
      {
        id: 'rev_1',
        userId: 'user_99',
        userName: 'Alex Johnson',
        rating: 5,
        comment: 'This plugin changed how I write my reports. Highly recommended!',
        versionUsed: '2.0.5',
        timestamp: Date.now() - 86400000 * 15
      }
    ]
  };

  public getItems(filter?: { category?: string, tag?: string, search?: string }): MarketplaceItem[] {
    let result = this.items;
    
    if (filter) {
      if (filter.category && filter.category !== 'all') {
        result = result.filter(item => item.type === filter.category);
      }
      if (filter.tag && filter.tag !== 'all') {
        result = result.filter(item => item.tags.includes(filter.tag as any));
      }
      if (filter.search) {
        const term = filter.search.toLowerCase();
        result = result.filter(item => 
          item.name.toLowerCase().includes(term) || 
          item.description.toLowerCase().includes(term) ||
          item.authorName.toLowerCase().includes(term)
        );
      }
    }
    
    return result;
  }

  public getItemById(id: string): MarketplaceItem | undefined {
    return this.items.find(item => item.id === id);
  }

  public getAuthorProfile(id: string): AuthorProfile | undefined {
    return this.authors[id];
  }

  public getReviews(itemId: string): Review[] {
    return this.reviews[itemId] || [];
  }

  public getUserData(): UserMarketplaceData {
    return this.userData;
  }

  public toggleFavorite(itemId: string) {
    const isFav = this.userData.favoriteItemIds.includes(itemId);
    if (isFav) {
      this.userData.favoriteItemIds = this.userData.favoriteItemIds.filter(id => id !== itemId);
    } else {
      this.userData.favoriteItemIds.push(itemId);
    }
  }

  public installItem(itemId: string) {
    if (!this.userData.installedItemIds.includes(itemId)) {
      this.userData.installedItemIds.push(itemId);
    }
    // Remove from updates if it was there
    this.userData.updatesAvailable = this.userData.updatesAvailable.filter(u => u.itemId !== itemId);
  }

  public uninstallItem(itemId: string) {
    this.userData.installedItemIds = this.userData.installedItemIds.filter(id => id !== itemId);
  }
}

export const marketplaceService = new MarketplaceService();
