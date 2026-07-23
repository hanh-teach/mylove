import { ReleaseChannel, FeatureFlag, FeedbackEntry, PerformanceMetric, ReleaseReadinessItem, KnownIssue, BetaRoadmapItem } from './types';

class ReleaseService {
  private currentChannel: ReleaseChannel = 'beta';
  private currentLanguage: 'vi' | 'en' | 'ja' | 'ko' = 'vi';

  private featureFlags: FeatureFlag[] = [
    {
      id: 'ff_1',
      key: 'ai_copilot_v2',
      name: 'AI Copilot v2 (Multimodal)',
      description: 'Gợi ý ý tưởng thông minh dựa trên ngữ cảnh ảnh và ký ức.',
      status: 'beta',
      category: 'ai'
    },
    {
      id: 'ff_2',
      key: 'realtime_collaboration',
      name: 'Realtime Multi-user Canvas',
      description: 'Cho phép chỉnh sửa dự án cùng lúc theo thời gian thực.',
      status: 'experimental',
      category: 'editor'
    },
    {
      id: 'ff_3',
      key: 'delta_sync_v2',
      name: 'Delta Sync Engine v2',
      description: 'Đồng bộ hóa dữ liệu phân mảnh giúp tiết kiệm 70% băng thông.',
      status: 'enabled',
      category: 'sync'
    },
    {
      id: 'ff_4',
      key: 'high_contrast_theme',
      name: 'High Contrast Mode',
      description: 'Chế độ tương phản cao tối ưu cho trợ năng người dùng khiếm thị.',
      status: 'enabled',
      category: 'ui'
    }
  ];

  private feedbackList: FeedbackEntry[] = [
    {
      id: 'fb_1',
      type: 'bug',
      title: 'Lỗi cuộn trang trong Editor khi chèn ảnh dung lượng lớn',
      description: 'Khi chèn ảnh > 10MB vào dòng thời gian, hiệu ứng cuộn bị giật nhẹ trên Chrome.',
      includeLogs: true,
      includeScreenshot: true,
      timestamp: Date.now() - 3600000 * 5,
      channel: 'beta',
      status: 'under_review'
    },
    {
      id: 'fb_2',
      type: 'feature',
      title: 'Hỗ trợ phím tắt Custom Keybindings cho Windows',
      description: 'Cho phép tùy chỉnh lại tổ hợp phím Ctrl+Shift+M theo ý muốn.',
      includeLogs: false,
      includeScreenshot: false,
      timestamp: Date.now() - 86400000 * 2,
      channel: 'beta',
      status: 'submitted'
    }
  ];

  private performanceMetrics: PerformanceMetric[] = [
    { name: 'Khởi động (Startup Time)', value: 420, unit: 'ms', threshold: 1000, status: 'good', history: [480, 450, 430, 420] },
    { name: 'Mở Project (Load Time)', value: 180, unit: 'ms', threshold: 500, status: 'good', history: [220, 200, 190, 180] },
    { name: 'Bộ nhớ (RAM Usage)', value: 124, unit: 'MB', threshold: 300, status: 'good', history: [140, 130, 128, 124] },
    { name: 'Tốc độ tìm kiếm (Search)', value: 18, unit: 'ms', threshold: 100, status: 'good', history: [25, 22, 20, 18] },
    { name: 'Thời gian xuất file (Export)', value: 1250, unit: 'ms', threshold: 2000, status: 'good', history: [1400, 1350, 1300, 1250] },
    { name: 'Đồng bộ Cloud (Sync Speed)', value: 310, unit: 'ms', threshold: 1000, status: 'good', history: [350, 340, 320, 310] }
  ];

  private knownIssues: KnownIssue[] = [
    {
      id: 'issue_1',
      title: 'Font rendering trên màn hình High-DPI Windows 11',
      severity: 'low',
      status: 'fixing',
      affectedVersions: ['0.91.0-beta']
    },
    {
      id: 'issue_2',
      title: 'Độ trễ phản hồi Webhook khi mất kết nối chập chờn',
      severity: 'medium',
      status: 'investigating',
      affectedVersions: ['0.91.0-beta', '0.90.0']
    }
  ];

  private betaRoadmap: BetaRoadmapItem[] = [
    {
      id: 'rm_1',
      title: 'Xuất file PDF chất lượng cao tích hợp Vector Graphics',
      description: 'Cho phép xuất bản in sắc nét cho thiệp chúc mừng và sổ kỷ niệm.',
      votes: 142,
      voted: true,
      status: 'in_progress'
    },
    {
      id: 'rm_2',
      title: 'Tự động tạo video Kỷ niệm dạng Slideshow hiệu ứng 3D',
      description: 'Ghép ảnh và mốc thời gian thành đoạn phim ngắn có nhạc nền.',
      votes: 218,
      voted: false,
      status: 'planned'
    },
    {
      id: 'rm_3',
      title: 'Gợi ý ý tưởng kỷ niệm theo mùa và ngày lễ',
      description: 'AI tự đề xuất các hoạt động kỷ niệm gia đình và người thân.',
      votes: 95,
      voted: false,
      status: 'planned'
    }
  ];

  private readinessItems: ReleaseReadinessItem[] = [
    {
      id: 'read_1',
      category: 'bugs',
      title: 'Lỗi nghiêm trọng (Critical / Blocker Bugs)',
      description: 'Không còn lỗi làm hỏng dữ liệu hoặc treo ứng dụng.',
      status: 'pass',
      detail: '0 Blocker, 0 Critical bugs recorded'
    },
    {
      id: 'read_2',
      category: 'performance',
      title: 'Chỉ số hiệu năng (Performance Budget)',
      description: 'Startup < 1s, RAM < 300MB, Sync < 1s.',
      status: 'pass',
      detail: 'Startup 420ms, Memory 124MB (Pass)'
    },
    {
      id: 'read_3',
      category: 'accessibility',
      title: 'Đạt chuẩn Trợ năng WCAG 2.1 AA',
      description: 'Độ tương phản màu > 4.5:1, hỗ trợ phím bấm điều hướng.',
      status: 'pass',
      detail: 'Keyboard Nav & High Contrast verified'
    },
    {
      id: 'read_4',
      category: 'docs',
      title: 'Tài liệu hướng dẫn & SDK Docs',
      description: 'Hoàn thiện tài liệu API Explorer, Webhook & Plugin Guide.',
      status: 'pass',
      detail: 'Complete in Developer Portal'
    },
    {
      id: 'read_5',
      category: 'compliance',
      title: 'Chính sách bảo mật & Điều khoản sử dụng',
      description: 'Đảm bảo minh bạch theo nguyên tắc Trust First.',
      status: 'pass',
      detail: 'Privacy & Terms ready'
    }
  ];

  public getChannel(): ReleaseChannel {
    return this.currentChannel;
  }

  public setChannel(channel: ReleaseChannel) {
    this.currentChannel = channel;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  public setLanguage(lang: 'vi' | 'en' | 'ja' | 'ko') {
    this.currentLanguage = lang;
  }

  public getFeatureFlags(): FeatureFlag[] {
    return this.featureFlags;
  }

  public toggleFeatureFlag(id: string) {
    const flag = this.featureFlags.find(f => f.id === id);
    if (flag) {
      flag.status = flag.status === 'enabled' ? 'disabled' : 'enabled';
    }
  }

  public getFeedback(): FeedbackEntry[] {
    return this.feedbackList;
  }

  public addFeedback(entry: Omit<FeedbackEntry, 'id' | 'timestamp' | 'channel' | 'status'>) {
    this.feedbackList.unshift({
      ...entry,
      id: `fb_${Date.now()}`,
      timestamp: Date.now(),
      channel: this.currentChannel,
      status: 'submitted'
    });
  }

  public getPerformanceMetrics(): PerformanceMetric[] {
    return this.performanceMetrics;
  }

  public getKnownIssues(): KnownIssue[] {
    return this.knownIssues;
  }

  public getBetaRoadmap(): BetaRoadmapItem[] {
    return this.betaRoadmap;
  }

  public voteRoadmap(id: string) {
    const item = this.betaRoadmap.find(r => r.id === id);
    if (item) {
      if (item.voted) {
        item.votes -= 1;
        item.voted = false;
      } else {
        item.votes += 1;
        item.voted = true;
      }
    }
  }

  public getReadinessItems(): ReleaseReadinessItem[] {
    return this.readinessItems;
  }
}

export const releaseService = new ReleaseService();
