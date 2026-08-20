import { Timeline, TimelineItem } from './TimelineModel';

const TIMELINE_STORAGE_KEY = 'love_note_studio_timelines_v1';
const TIMELINE_ITEMS_STORAGE_KEY = 'love_note_studio_timeline_items_v1';

class TimelineStoreClass {
  private timelines: Timeline[] = [];
  private timelineItems: TimelineItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const timelinesJson = localStorage.getItem(TIMELINE_STORAGE_KEY);
      const itemsJson = localStorage.getItem(TIMELINE_ITEMS_STORAGE_KEY);

      this.timelines = timelinesJson ? JSON.parse(timelinesJson) : [];
      this.timelineItems = itemsJson ? JSON.parse(itemsJson) : [];
    } catch (err) {
      console.error('Failed to load timelines from localStorage:', err);
      this.timelines = [];
      this.timelineItems = [];
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(TIMELINE_STORAGE_KEY, JSON.stringify(this.timelines));
      localStorage.setItem(TIMELINE_ITEMS_STORAGE_KEY, JSON.stringify(this.timelineItems));
    } catch (err) {
      console.error('Failed to save timelines to localStorage:', err);
    }
  }

  /**
   * Get or create a timeline for a project.
   */
  public getOrCreateTimeline(projectId: string, projectTitle: string = 'My Project', projectTemplate?: string): Timeline {
    let timeline = this.timelines.find(t => t.projectId === projectId);
    
    if (!timeline) {
      const now = new Date().toISOString();
      const timelineId = `timeline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      
      timeline = {
        id: timelineId,
        projectId,
        title: `Timeline cho ${projectTitle}`,
        description: `Lộ trình thực hiện dự án: ${projectTitle}`,
        type: projectTemplate || 'custom',
        status: 'active',
        order: 0,
        progress: 0,
        createdAt: now,
        updatedAt: now
      };

      this.timelines.push(timeline);
      this.initializeDefaultSteps(timelineId, projectTitle, projectTemplate);
      this.saveToStorage();
    }

    // Compute progress just in case
    timeline.progress = this.calculateProgress(timeline.id);
    return timeline;
  }

  private initializeDefaultSteps(timelineId: string, projectTitle: string, templateType?: string) {
    const titleLower = projectTitle.toLowerCase();
    const now = new Date().toISOString();
    let steps: { title: string; description: string; completed?: boolean }[] = [];

    if (titleLower.includes('thank') || titleLower.includes('cám ơn') || titleLower.includes('thầy') || titleLower.includes('cô')) {
      steps = [
        { title: 'Chọn Template', description: 'Chọn giao diện phù hợp cho thiệp Cảm ơn', completed: true },
        { title: 'Thu thập ảnh kỷ niệm', description: 'Chèn ảnh của lớp hoặc thầy cô từ Media Library/Memory' },
        { title: 'Viết nội dung thiệp', description: 'Sử dụng AI tối ưu hóa lời chúc chân thành' },
        { title: 'Kiểm tra & Chỉnh sửa', description: 'Review bố cục và tinh chỉnh văn bản' },
        { title: 'Xuất PDF & Chia sẻ', description: 'Xuất thiệp chất lượng cao để gửi tặng' }
      ];
    } else if (titleLower.includes('travel') || titleLower.includes('du lịch') || titleLower.includes('nhật ký') || titleLower.includes('journal')) {
      steps = [
        { title: 'Ngày 1: Lên ý tưởng', description: 'Ghi lại hành trình ngày đầu tiên & chọn layout' },
        { title: 'Ngày 2: Ảnh & Memories', description: 'Chèn hình ảnh check-in và khoảnh khắc đáng nhớ' },
        { title: 'Ngày 3: AI Viết bài', description: 'AI hỗ trợ mô tả chi tiết cảm xúc chuyến đi' },
        { title: 'Ngày 4: Hoàn thiện nhật ký', description: 'Đánh giá, trang trí sticker và hoàn tất' }
      ];
    } else if (titleLower.includes('birthday') || titleLower.includes('sinh nhật') || titleLower.includes('thiệp')) {
      steps = [
        { title: 'Ý tưởng thiệp sinh nhật', description: 'Xác định tone màu và chủ đề buổi tiệc', completed: true },
        { title: 'Thiết kế nháp', description: 'Sắp xếp lời chúc thô và layout chữ chính' },
        { title: 'Hình minh họa', description: 'Thêm sticker bóng bay, bánh sinh nhật từ Assets' },
        { title: 'Tinh chỉnh & Đánh giá', description: 'AI review câu từ và cân đối thẩm mỹ' },
        { title: 'Gửi thiệp hoàn thành', description: 'Xuất bản và gửi tới người nhận' }
      ];
    } else {
      // Default step pipeline
      steps = [
        { title: 'Khởi tạo Dự án', description: 'Bắt đầu phác thảo ý tưởng dự án', completed: true },
        { title: 'Thu thập Memories', description: 'Liên kết các kỷ niệm và hình ảnh liên quan' },
        { title: 'AI Sáng tạo nội dung', description: 'Yêu cầu AI viết và tối ưu hóa văn bản' },
        { title: 'Thiết kế & Trang trí', description: 'Trang trí nhãn dán, thay đổi font chữ' },
        { title: 'Hoàn thành & Xuất bản', description: 'Xuất bản tác phẩm và lưu trữ' }
      ];
    }

    steps.forEach((step, idx) => {
      const item: TimelineItem = {
        id: `timeline_item_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`,
        timelineId,
        title: step.title,
        description: step.description,
        assetIds: [],
        memoryIds: [],
        draftId: null,
        workflowId: null,
        aiGenerated: step.title.toLowerCase().includes('ai') || step.title.toLowerCase().includes('sáng tạo'),
        completed: step.completed || false,
        order: idx,
        createdAt: now,
        updatedAt: now
      };
      this.timelineItems.push(item);
    });
  }

  public getTimelineItems(timelineId: string): TimelineItem[] {
    return this.timelineItems
      .filter(item => item.timelineId === timelineId)
      .sort((a, b) => a.order - b.order);
  }

  public addTimelineItem(timelineId: string, item: Omit<TimelineItem, 'id' | 'timelineId' | 'createdAt' | 'updatedAt'>): TimelineItem {
    const now = new Date().toISOString();
    const newItem: TimelineItem = {
      ...item,
      id: `timeline_item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timelineId,
      createdAt: now,
      updatedAt: now
    };

    this.timelineItems.push(newItem);
    this.updateTimelineProgress(timelineId);
    this.saveToStorage();
    return newItem;
  }

  public updateTimelineItem(id: string, updates: Partial<TimelineItem>): TimelineItem | undefined {
    const itemIndex = this.timelineItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return undefined;

    const currentItem = this.timelineItems[itemIndex];
    const updatedItem = {
      ...currentItem,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.timelineItems[itemIndex] = updatedItem;
    this.updateTimelineProgress(currentItem.timelineId);
    this.saveToStorage();
    return updatedItem;
  }

  public deleteTimelineItem(id: string): boolean {
    const itemIndex = this.timelineItems.findIndex(i => i.id === id);
    if (itemIndex === -1) return false;

    const timelineId = this.timelineItems[itemIndex].timelineId;
    this.timelineItems.splice(itemIndex, 1);
    this.updateTimelineProgress(timelineId);
    this.saveToStorage();
    return true;
  }

  public reorderTimelineItems(timelineId: string, itemIds: string[]): TimelineItem[] {
    // Reassign orders based on index in itemIds
    this.timelineItems = this.timelineItems.map(item => {
      if (item.timelineId === timelineId) {
        const newIndex = itemIds.indexOf(item.id);
        if (newIndex !== -1) {
          return { ...item, order: newIndex, updatedAt: new Date().toISOString() };
        }
      }
      return item;
    });

    this.saveToStorage();
    return this.getTimelineItems(timelineId);
  }

  public calculateProgress(timelineId: string): number {
    const items = this.timelineItems.filter(i => i.timelineId === timelineId);
    if (items.length === 0) return 0;

    const completedCount = items.filter(i => i.completed).length;
    return Math.round((completedCount / items.length) * 100);
  }

  private updateTimelineProgress(timelineId: string) {
    const timelineIndex = this.timelines.findIndex(t => t.id === timelineId);
    if (timelineIndex !== -1) {
      this.timelines[timelineIndex].progress = this.calculateProgress(timelineId);
      this.timelines[timelineIndex].updatedAt = new Date().toISOString();
    }
  }
}

export const timelineStore = new TimelineStoreClass();
