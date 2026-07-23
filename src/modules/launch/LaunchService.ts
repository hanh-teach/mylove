import { 
  LicenseInfo, ProductHealthMetric, SupportArticle, PrivacyConfig, 
  OperationalPlaybookItem, ProductCouncilGoal, ReleaseNoteItem, LicenseEditionType 
} from './types';

class LaunchService {
  private currentVersion = '1.0.0';
  private currentBuildNumber = 1000;
  private releaseDate = '2026-07-23';

  private activeEdition: LicenseEditionType = 'personal';

  private updateMode: 'auto' | 'notify' | 'manual' = 'auto';

  private privacyConfig: PrivacyConfig = {
    analyticsEnabled: false,
    aiContextTraining: false,
    pluginDataIsolation: true,
    cloudSyncEncrypted: true,
    totalDataSizeMB: 42.8,
    lastDataExportDate: Date.now() - 86400000 * 5
  };

  private licenses: LicenseInfo[] = [
    {
      edition: 'community',
      displayName: 'Community Free',
      active: false,
      maxProjects: '5 Dự án',
      aiMonthlyQuota: '100 Yêu cầu/tháng',
      cloudSyncEnabled: false,
      customPluginsAllowed: false,
      price: 'Miễn phí'
    },
    {
      edition: 'personal',
      displayName: 'LoveNote Personal',
      active: true,
      maxProjects: 'Không giới hạn',
      aiMonthlyQuota: 'Không giới hạn (Gemini 2.5/3.0)',
      cloudSyncEnabled: true,
      customPluginsAllowed: true,
      price: 'Đã kích hoạt'
    },
    {
      edition: 'professional',
      displayName: 'LoveNote Professional',
      active: false,
      maxProjects: 'Không giới hạn + Multi-user',
      aiMonthlyQuota: 'Không giới hạn + Priority API',
      cloudSyncEnabled: true,
      customPluginsAllowed: true,
      price: '$9.99/tháng'
    },
    {
      edition: 'education',
      displayName: 'LoveNote Education',
      active: false,
      maxProjects: 'Không giới hạn (Trường học)',
      aiMonthlyQuota: 'Ưu đãi Giáo dục',
      cloudSyncEnabled: true,
      customPluginsAllowed: true,
      price: 'Miễn phí (Học sinh/SV)'
    },
    {
      edition: 'enterprise',
      displayName: 'LoveNote Enterprise',
      active: false,
      maxProjects: 'Custom Infrastructure',
      aiMonthlyQuota: 'Dedicated AI Endpoint',
      cloudSyncEnabled: true,
      customPluginsAllowed: true,
      price: 'Liên hệ Báo giá'
    }
  ];

  private healthMetrics: ProductHealthMetric[] = [
    { id: 'hm_1', name: 'Crash-free Users Rate', value: '99.98', unit: '%', status: 'optimal', threshold: '> 99.5%' },
    { id: 'hm_2', name: 'Startup Time (Cold Boot)', value: '380', unit: 'ms', status: 'optimal', threshold: '< 2000ms' },
    { id: 'hm_3', name: 'Cloud Sync Success Rate', value: '100', unit: '%', status: 'optimal', threshold: '> 99.0%' },
    { id: 'hm_4', name: 'AI Co-pilot Response SLA', value: '1.45', unit: 's', status: 'optimal', threshold: '< 5.0s' },
    { id: 'hm_5', name: 'PDF Export Completion Rate', value: '100', unit: '%', status: 'optimal', threshold: '> 98.0%' },
    { id: 'hm_6', name: 'Global Search Speed', value: '14', unit: 'ms', status: 'optimal', threshold: '< 300ms' }
  ];

  private supportArticles: SupportArticle[] = [
    {
      id: 'art_1',
      title: 'Bắt đầu sử dụng LoveNote 1.0 trong 3 phút',
      category: 'getting_started',
      summary: 'Hướng dẫn tạo thư tình đầu tiên, gắn thẻ mốc thời gian và lưu giữ kỷ niệm.',
      content: 'Chào mừng bạn đến với LoveNote! Bắt đầu bằng cách chọn một Mẫu thiệp hoặc Mẫu thư từ Studio Editor...',
      helpfulCount: 384
    },
    {
      id: 'art_2',
      title: 'Cách bảo vệ dữ liệu kỷ niệm riêng tư tuyệt đối',
      category: 'cloud',
      summary: 'Tìm hiểu về cơ chế mã hóa AES-256 local-first và đồng bộ hóa đám mây an toàn.',
      content: 'LoveNote cam kết triết lý Trust-First. Toàn bộ nội dung kỷ niệm của bạn được mã hóa trước khi lưu trữ...',
      helpfulCount: 521
    },
    {
      id: 'art_3',
      title: 'Sử dụng AI Co-pilot để nâng tầm cảm xúc trong từng câu chữ',
      category: 'ai',
      summary: 'Gợi ý thơ, câu chúc, chỉnh sửa văn phong tình cảm với trí tuệ nhân tạo Gemini.',
      content: 'Chỉ cần nhấp vào nút AI Assistant trên thanh công cụ, chọn mục tiêu cảm xúc mong muốn...',
      helpfulCount: 412
    }
  ];

  private playbooks: OperationalPlaybookItem[] = [
    {
      id: 'pb_1',
      title: 'Quy trình Phát hành Phiên bản Mới (Release Rollout Runbook)',
      category: 'release',
      summary: 'Các bước triển khai từ Staging → Staged Rollout (10% → 50% → 100%) → Monitoring.',
      steps: [
        '1. Xác nhận Go/No-Go Board đạt 100% chỉ số an toàn.',
        '2. Xuất bản gói cài đặt Signing Binaries trên Windows & Android.',
        '3. Phát hành 10% người dùng trên kênh Stable để theo dõi Crash Rate.',
        '4. Mở rộng 100% nếu Crash Rate < 0.05% sau 24 giờ.'
      ]
    },
    {
      id: 'pb_2',
      title: 'Quy trình Xử lý Sự cố Khẩn cấp (Emergency Incident Response)',
      category: 'incident',
      summary: 'Kế hoạch phản ứng khi phát hiện lỗi nghiêm trọng hỏng dữ liệu.',
      steps: [
        '1. Kích hoạt Feature Flag ngắt ngay lập tức tính năng gây lỗi.',
        '2. Phát thông báo trên Support Center cho người dùng ảnh hưởng.',
        '3. Triển khai bản hotfix khẩn cấp trong vòng 2 giờ.',
        '4. Tự động phục hồi dữ liệu từ bản sao lưu gần nhất (Disaster Recovery).'
      ]
    }
  ];

  private councilGoals: ProductCouncilGoal[] = [
    {
      id: 'cg_1',
      quarter: 'Q3 2026',
      title: 'LoveNote 1.1 Maintenance & UX Polish',
      description: 'Tổng kết dữ liệu phản hồi sau 30 ngày phát hành 1.0, tinh chỉnh giao diện và hiệu năng.',
      type: 'maintenance',
      status: 'approved'
    },
    {
      id: 'cg_2',
      quarter: 'Q4 2026',
      title: 'LoveNote 1.2 Interactive 3D Memorial Canvas',
      description: 'Nâng cấp trải nghiệm dòng thời gian với không gian kỷ niệm 3D và tương tác âm thanh.',
      type: 'feature_1_1',
      status: 'planned'
    },
    {
      id: 'cg_3',
      quarter: 'Q1 2027',
      title: 'LoveNote 2.0 Ecosystem Expansion',
      description: 'Mở rộng thị trường toàn cầu với hệ sinh thái AI Agent sáng tạo và kết nối đa thiết bị.',
      type: 'architecture',
      status: 'planned'
    }
  ];

  private releaseNotes: ReleaseNoteItem = {
    version: '1.0.0',
    buildNumber: 1000,
    releaseDate: '2026-07-23',
    highlights: [
      '🎉 Chính thức phát hành LoveNote 1.0 Stable trên Windows, Android & Web SaaS!',
      '✨ Tích hợp bộ công cụ Studio Editor sáng tạo thiệp, thư tình & sổ kỷ niệm.',
      '🤖 Trợ lý AI Co-pilot thông minh hỗ trợ gợi ý thơ, văn phong và ý tưởng kỷ niệm.',
      '🔒 Kiến trúc Trust-First: Mã hóa dữ liệu tuyệt đối và phân quyền bảo mật riêng tư.',
      '⚡ Hiệu năng siêu tốc: Khởi động dưới 0.4s, tìm kiếm tức thì dưới 20ms.'
    ],
    bugFixes: [
      'Khắc phục hoàn toàn lỗi cuộn trang khi chèn ảnh độ phân giải cao.',
      'Tối ưu hóa khả năng tương thích font chữ trên Windows High-DPI.',
      'Cải thiện độ trễ phản hồi đồng bộ Cloud khi kết nối mạng chập chờn.'
    ],
    performanceGains: [
      'Giảm 45% mức tiêu thụ bộ nhớ RAM.',
      'Tăng 300% tốc độ render dòng thời gian kỷ niệm.',
      'Xuất bản in PDF chất lượng cao chỉ trong 1.2 giây.'
    ]
  };

  public getReleaseInfo() {
    return {
      version: this.currentVersion,
      buildNumber: this.currentBuildNumber,
      releaseDate: this.releaseDate
    };
  }

  public getLicenses(): LicenseInfo[] {
    return this.licenses;
  }

  public setEdition(edition: LicenseEditionType) {
    this.activeEdition = edition;
    this.licenses.forEach(l => l.active = (l.edition === edition));
  }

  public getHealthMetrics(): ProductHealthMetric[] {
    return this.healthMetrics;
  }

  public getSupportArticles(): SupportArticle[] {
    return this.supportArticles;
  }

  public getPrivacyConfig(): PrivacyConfig {
    return this.privacyConfig;
  }

  public updatePrivacyConfig(config: Partial<PrivacyConfig>) {
    this.privacyConfig = { ...this.privacyConfig, ...config };
  }

  public getPlaybooks(): OperationalPlaybookItem[] {
    return this.playbooks;
  }

  public getCouncilGoals(): ProductCouncilGoal[] {
    return this.councilGoals;
  }

  public getReleaseNotes(): ReleaseNoteItem {
    return this.releaseNotes;
  }

  public getUpdateMode() {
    return this.updateMode;
  }

  public setUpdateMode(mode: 'auto' | 'notify' | 'manual') {
    this.updateMode = mode;
  }
}

export const launchService = new LaunchService();
