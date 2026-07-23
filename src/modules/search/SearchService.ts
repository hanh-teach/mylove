import { 
  ISearchResult, 
  SearchResultType, 
  ISavedSearch, 
  ISearchHistory,
  ISearchFilter
} from './SearchTypes';

class SearchEngine {
  private HISTORY_KEY = 'lovenote_search_history';
  private SAVED_KEY = 'lovenote_saved_searches';

  // --- Search Logic ---

  async search(query: string, filters?: ISearchFilter): Promise<ISearchResult[]> {
    if (!query || query.length < 2) return [];

    console.log(`[SearchEngine] Analyzing Intent: "${query}"`);
    
    // 1. Intent Analysis (Simulated)
    const intent = this.analyzeIntent(query);
    
    // 2. Data Gathering (Mocked from all modules)
    const allData = this.getMockGlobalData();
    
    // 3. Semantic Scoring
    let results = allData.map(item => {
      const score = this.calculateSemanticScore(query, item, intent);
      return { ...item, score };
    });

    // 4. Filtering
    if (filters) {
      results = results.filter(r => {
        if (filters.types && !filters.types.includes(r.type)) return false;
        return true;
      });
    }

    // 5. Ranking & Thresholding
    return results
      .filter(r => r.score > 0.1)
      .sort((a, b) => b.score - a.score);
  }

  private analyzeIntent(query: string) {
    const q = query.toLowerCase();
    return {
      isVisual: q.includes('ảnh') || q.includes('hình') || q.includes('video') || q.includes('photo'),
      isDraft: q.includes('nháp') || q.includes('draft') || q.includes('viết'),
      isMemory: q.includes('ký ức') || q.includes('kỷ niệm') || q.includes('memory'),
      isProject: q.includes('dự án') || q.includes('project'),
      locationTarget: q.includes('đà lạt') ? 'Đà Lạt' : q.includes('hà nội') ? 'Hà Nội' : null,
      timeTarget: q.includes('tháng 5') ? 'May' : q.includes('năm ngoái') ? '2025' : null
    };
  }

  private calculateSemanticScore(query: string, item: ISearchResult, intent: any): number {
    const q = query.toLowerCase();
    const title = item.title.toLowerCase();
    const content = (item.content || '').toLowerCase();
    const snippet = (item.snippet || '').toLowerCase();
    
    let score = 0;

    // Exact keyword match (High priority)
    if (title.includes(q)) score += 0.8;
    if (content.includes(q) || snippet.includes(q)) score += 0.4;

    // Intent Match
    if (intent.isVisual && item.type === 'asset') score += 0.5;
    if (intent.isDraft && item.type === 'draft') score += 0.5;
    if (intent.isMemory && item.type === 'memory') score += 0.5;
    
    // Location Match (Semantic)
    if (intent.locationTarget && item.metadata?.location?.includes(intent.locationTarget)) score += 0.6;
    
    // Time Match
    if (intent.timeTarget && item.metadata?.date?.includes(intent.timeTarget)) score += 0.4;

    // Semantic Expansion (Mocking "lần đầu gặp" -> "Memory", "Kỷ niệm")
    if (q.includes('lần đầu') && (title.includes('kỷ niệm') || title.includes('ký ức'))) score += 0.3;

    return score;
  }

  private getMockGlobalData(): ISearchResult[] {
    return [
      {
        id: 'p1',
        type: 'project',
        title: 'Chuyến đi Đà Lạt 2024',
        subtitle: 'Dự án hành trình',
        icon: 'Map',
        score: 0,
        metadata: { location: 'Đà Lạt', date: '2024-05-12', tags: ['Travel', 'Family'] }
      },
      {
        id: 'm1',
        type: 'memory',
        title: 'Lần đầu mình gặp nhau',
        subtitle: 'Tại quán cafe nhỏ',
        snippet: 'Đó là một buổi chiều mưa tại Hà Nội, khi chúng ta vô tình trú mưa...',
        icon: 'Heart',
        score: 0,
        metadata: { location: 'Hà Nội', date: '2023-10-05', people: ['Linh'] }
      },
      {
        id: 'a1',
        type: 'asset',
        title: 'Hoàng hôn Hồ Tuyền Lâm',
        subtitle: 'Ảnh chụp từ iPhone',
        icon: 'Image',
        score: 0,
        metadata: { location: 'Đà Lạt', date: '2024-05-13', thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }
      },
      {
        id: 'd1',
        type: 'draft',
        title: 'Lời nhắn gửi 10 năm sau',
        subtitle: 'Draft tự động',
        snippet: 'Gửi Linh của tương lai, hy vọng lúc này chúng ta đang...',
        icon: 'PenTool',
        score: 0,
        metadata: { date: '2024-07-20' }
      },
      {
        id: 't1',
        type: 'timeline',
        title: 'Kỷ niệm 2 năm yêu nhau',
        subtitle: 'Sự kiện lớn',
        icon: 'Calendar',
        score: 0,
        metadata: { date: '2025-10-05' }
      }
    ];
  }

  // --- History & Saved ---

  getSearchHistory(): ISearchHistory[] {
    const data = localStorage.getItem(this.HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveToHistory(query: string) {
    const history = this.getSearchHistory();
    const newEntry = { id: Date.now().toString(), query, timestamp: new Date().toISOString() };
    const filtered = [newEntry, ...history.filter(h => h.query !== query)].slice(0, 10);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(filtered));
  }

  getSavedSearches(): ISavedSearch[] {
    const data = localStorage.getItem(this.SAVED_KEY);
    if (!data) return [
      { id: 's1', label: 'Dự án Đà Lạt', query: 'Đà Lạt', icon: 'Star', createdAt: new Date().toISOString() },
      { id: 's2', label: 'Ảnh mới nhất', query: 'Ảnh', icon: 'Clock', createdAt: new Date().toISOString() }
    ];
    return JSON.parse(data);
  }
}

export const searchEngine = new SearchEngine();
