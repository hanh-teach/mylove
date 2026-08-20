import { IAIMemory } from '../knowledge/KnowledgeTypes';

class AIMemoryService {
  private STORAGE_KEY = 'lovenote_ai_memory';

  getAIMemory(projectId: string): IAIMemory {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const allMemories: IAIMemory[] = data ? JSON.parse(data) : [];
    
    let memory = allMemories.find(m => m.projectId === projectId);
    
    if (!memory) {
      memory = {
        id: `aim-${projectId}`,
        projectId,
        preferences: {
          writingStyle: 'Nhẹ nhàng, sâu lắng',
          tone: 'Lãng mạn',
          endingStyle: 'Lời chúc chân thành',
          forbiddenElements: ['emoji quá đà'],
          preferredColors: ['Pink', 'Rose'],
          outputFormat: 'A5 Card'
        },
        keyFacts: [],
        updatedAt: new Date().toISOString()
      };
      allMemories.push(memory);
      this.saveAll(allMemories);
    }
    
    return memory;
  }

  updateMemory(memory: IAIMemory): void {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const allMemories: IAIMemory[] = data ? JSON.parse(data) : [];
    
    const index = allMemories.findIndex(m => m.projectId === memory.projectId);
    if (index >= 0) {
      allMemories[index] = { ...memory, updatedAt: new Date().toISOString() };
    } else {
      allMemories.push({ ...memory, updatedAt: new Date().toISOString() });
    }
    
    this.saveAll(allMemories);
  }

  addFact(projectId: string, key: string, value: string): void {
    const memory = this.getAIMemory(projectId);
    const existingIdx = memory.keyFacts.findIndex(f => f.key === key);
    
    if (existingIdx >= 0) {
      memory.keyFacts[existingIdx] = { key, value, lastAccessed: new Date().toISOString() };
    } else {
      memory.keyFacts.push({ key, value, lastAccessed: new Date().toISOString() });
    }
    
    this.updateMemory(memory);
  }

  private saveAll(memories: IAIMemory[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memories));
  }
}

export const aiMemoryService = new AIMemoryService();
