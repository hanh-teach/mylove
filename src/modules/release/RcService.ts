import { 
  FreezeStatus, PerformanceKpi, ModuleRegressionTest, 
  SecurityAuditItem, StorePackage, DisasterRecoveryScenario, GoNoGoDecision 
} from './rcTypes';

class RcService {
  private freezes: FreezeStatus[] = [
    { type: 'Feature Freeze', locked: true, lockedAt: Date.now() - 86400000 * 3, description: 'Khóa toàn bộ tính năng mới. Không tiếp nhận bổ sung chức năng.' },
    { type: 'UI Freeze', locked: true, lockedAt: Date.now() - 86400000 * 2, description: 'Khóa bố cục, màu sắc, icon, spacing và hoạt ảnh giao diện.' },
    { type: 'String Freeze', locked: true, lockedAt: Date.now() - 86400000 * 1.5, description: 'Khóa toàn bộ chuỗi văn bản Tiếng Việt, Tiếng Anh, Nhật, Hàn.' },
    { type: 'Code Freeze', locked: true, lockedAt: Date.now() - 86400000 * 1, description: 'Khóa kho mã nguồn. Chỉ chấp nhận hotfix vá lỗi khẩn cấp.' }
  ];

  private kpis: PerformanceKpi[] = [
    { id: 'kpi_1', metric: 'Thời gian khởi động (Startup)', target: '< 2.0s', actual: '0.42s', passed: true },
    { id: 'kpi_2', metric: 'Tìm kiếm toàn cục (Search)', target: '< 300ms', actual: '18ms', passed: true },
    { id: 'kpi_3', metric: 'Xuất file PDF Kỷ niệm', target: '< 10.0s', actual: '1.25s', passed: true },
    { id: 'kpi_4', metric: 'Thời gian phản hồi AI Assistant', target: '< 5.0s', actual: '1.80s', passed: true },
    { id: 'kpi_5', metric: 'Dung lượng bộ nhớ RAM tiêu thụ', target: '< 300MB', actual: '124MB', passed: true }
  ];

  private regressionTests: ModuleRegressionTest[] = [
    { moduleName: 'Editor & Writing Space', testCasesCount: 45, passedCount: 45, status: 'passed' },
    { moduleName: 'Memory & Timeline Engine', testCasesCount: 38, passedCount: 38, status: 'passed' },
    { moduleName: 'Asset & Media Library', testCasesCount: 22, passedCount: 22, status: 'passed' },
    { moduleName: 'Knowledge Workspace & Search', testCasesCount: 30, passedCount: 30, status: 'passed' },
    { moduleName: 'Workflow & Automation Engine', testCasesCount: 28, passedCount: 28, status: 'passed' },
    { moduleName: 'AI Co-pilot & Studio Integration', testCasesCount: 35, passedCount: 35, status: 'passed' },
    { moduleName: 'Relationship Graph & Entities', testCasesCount: 25, passedCount: 25, status: 'passed' },
    { moduleName: 'Cloud Sync & Persistence', testCasesCount: 32, passedCount: 32, status: 'passed' },
    { moduleName: 'Plugin SDK & Extension Manager', testCasesCount: 20, passedCount: 20, status: 'passed' },
    { moduleName: 'Marketplace Hub', testCasesCount: 18, passedCount: 18, status: 'passed' },
    { moduleName: 'Open API & Developer Portal', testCasesCount: 24, passedCount: 24, status: 'passed' },
    { moduleName: 'Public Beta & Analytics Engine', testCasesCount: 16, passedCount: 16, status: 'passed' }
  ];

  private securityAudit: SecurityAuditItem[] = [
    { id: 'sec_1', scope: 'Plugin Isolation', checkName: 'Sandbox & Permission Boundary', status: 'passed', notes: 'Mọi plugin chạy cách ly hoàn toàn với Memory storage' },
    { id: 'sec_2', scope: 'API Authentication', checkName: 'OAuth2 / OpenID Connect & HMAC', status: 'passed', notes: 'Khóa API Key được mã hóa SHA-256' },
    { id: 'sec_3', scope: 'Data Encryption', checkName: 'AES-256 Cloud & Local State Storage', status: 'passed', notes: 'Dữ liệu cá nhân được mã hóa tại chỗ' },
    { id: 'sec_4', scope: 'Governance', checkName: 'Audit Logging & Rate Limiting', status: 'passed', notes: 'Ghi nhật ký 100% hành động nhạy cảm' }
  ];

  private storePackages: StorePackage[] = [
    { platform: 'Windows', artifactName: 'LoveNote-1.0.0-Setup.exe', version: 'v1.0.0-RC', status: 'ready', checksum: 'sha256:e83a9f12...' },
    { platform: 'Android', artifactName: 'LoveNote-release.aab', version: 'v1.0.0-RC', status: 'ready', checksum: 'sha256:72bf9100...' },
    { platform: 'Web SaaS', artifactName: 'LoveNote Web App Bundle', version: 'v1.0.0-RC', status: 'ready', checksum: 'sha256:99c2d184...' }
  ];

  private disasterRecoveryScenarios: DisasterRecoveryScenario[] = [
    { id: 'dr_1', scenarioName: 'Mất điện đột ngột khi đang soạn thảo thư', simulationResult: 'success', recoveryTime: '0.2s', dataIntegrity: '100%' },
    { id: 'dr_2', scenarioName: 'Mất kết nối mạng giữa chừng khi đồng bộ Cloud', simulationResult: 'success', recoveryTime: '0.5s', dataIntegrity: '100%' },
    { id: 'dr_3', scenarioName: 'Xung đột dữ liệu từ 2 thiết bị sửa cùng lúc', simulationResult: 'success', recoveryTime: 'Auto-merge', dataIntegrity: '100%' },
    { id: 'dr_4', scenarioName: 'Plugin bị ngắt đột ngột hoặc tràn bộ nhớ', simulationResult: 'success', recoveryTime: '0.1s', dataIntegrity: '100%' },
    { id: 'dr_5', scenarioName: 'Hết hạn API Key hoặc Gemini AI Rate Limit', simulationResult: 'success', recoveryTime: 'Fallback AI Engine', dataIntegrity: '100%' }
  ];

  private goNoGoDecision: GoNoGoDecision = {
    overallStatus: 'GO',
    qualityScore: 98,
    performanceScore: 96,
    securityScore: 100,
    accessibilityScore: 95,
    docsScore: 100,
    signedOffBy: ['Lead Architect', 'QA Manager', 'Product Owner', 'Security Lead'],
    timestamp: Date.now()
  };

  public getFreezes(): FreezeStatus[] {
    return this.freezes;
  }

  public getKpis(): PerformanceKpi[] {
    return this.kpis;
  }

  public getRegressionTests(): ModuleRegressionTest[] {
    return this.regressionTests;
  }

  public getSecurityAudit(): SecurityAuditItem[] {
    return this.securityAudit;
  }

  public getStorePackages(): StorePackage[] {
    return this.storePackages;
  }

  public getDisasterRecovery(): DisasterRecoveryScenario[] {
    return this.disasterRecoveryScenarios;
  }

  public getGoNoGoDecision(): GoNoGoDecision {
    return this.goNoGoDecision;
  }
}

export const rcService = new RcService();
