import { IKnowledgeItem, IKnowledgeRelationship } from './KnowledgeTypes';

class KnowledgeService {
  private STORAGE_KEY = 'lovenote_knowledge_items';

  getKnowledgeItems(projectId?: string): IKnowledgeItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    let items: IKnowledgeItem[] = JSON.parse(data);
    if (projectId) {
      items = items.filter(item => item.projectId === projectId);
    }
    return items;
  }

  saveKnowledgeItem(item: IKnowledgeItem): void {
    const items = this.getKnowledgeItems();
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = { ...item, updatedAt: new Date().toISOString() };
    } else {
      items.push({ ...item, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  deleteKnowledgeItem(id: string): void {
    const items = this.getKnowledgeItems();
    const filtered = items.filter(i => i.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
  }

  getKnowledgeItemById(id: string): IKnowledgeItem | undefined {
    return this.getKnowledgeItems().find(i => i.id === id);
  }

  addRelationship(sourceId: string, relationship: IKnowledgeRelationship): void {
    const item = this.getKnowledgeItemById(sourceId);
    if (item) {
      if (!item.relationships) item.relationships = [];
      item.relationships.push(relationship);
      this.saveKnowledgeItem(item);
    }
  }

  // Universal Search across all modules (simulated here)
  search(query: string, projectId?: string): any[] {
    const q = query.toLowerCase();
    const knowledgeItems = this.getKnowledgeItems(projectId).filter(i => 
      i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    );
    
    // In a real app, we'd also search Memories, Timeline, etc.
    // For this sprint, we'll return a structure that indicates source
    return [
      ...knowledgeItems.map(i => ({ ...i, source: 'knowledge' })),
    ];
  }

  seedInitialData(projectId: string): void {
    const existing = this.getKnowledgeItems(projectId);
    if (existing.length > 0) return;

    const initialItems: IKnowledgeItem[] = [
      {
        id: 'k1',
        title: 'Gia đình Nguyễn Văn A',
        description: 'Thông tin về gia đình, các thành viên và sở thích chung.',
        type: 'person',
        tags: ['Gia đình', 'Nhân vật'],
        relationships: [],
        projectId,
        aiNotes: ['Thích phong cách viết ấm áp', 'Thường xuyên nhắc về kỷ niệm Đà Lạt'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'k2',
        title: 'Đà Lạt - Thành phố ngàn hoa',
        description: 'Địa điểm du lịch yêu thích, nơi diễn ra nhiều kỷ niệm quan trọng.',
        type: 'place',
        tags: ['Địa điểm', 'Du lịch'],
        relationships: [],
        projectId,
        aiNotes: ['Gắn liền với kỷ niệm 2022'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    initialItems.forEach(item => this.saveKnowledgeItem(item));
  }
}

export const knowledgeService = new KnowledgeService();
