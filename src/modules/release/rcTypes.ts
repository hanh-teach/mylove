export interface FreezeStatus {
  type: 'Feature Freeze' | 'UI Freeze' | 'String Freeze' | 'Code Freeze';
  locked: boolean;
  lockedAt: number;
  description: string;
}

export interface PerformanceKpi {
  id: string;
  metric: string;
  target: string;
  actual: string;
  passed: boolean;
}

export interface ModuleRegressionTest {
  moduleName: string;
  testCasesCount: number;
  passedCount: number;
  status: 'passed' | 'failed' | 'in_progress';
}

export interface SecurityAuditItem {
  id: string;
  scope: string;
  checkName: string;
  status: 'passed' | 'warning' | 'failed';
  notes: string;
}

export interface StorePackage {
  platform: 'Windows' | 'Android' | 'Web SaaS';
  artifactName: string;
  version: string;
  status: 'ready' | 'building' | 'pending';
  checksum: string;
}

export interface DisasterRecoveryScenario {
  id: string;
  scenarioName: string;
  simulationResult: 'success' | 'failed';
  recoveryTime: string;
  dataIntegrity: '100%' | 'Loss Detected';
}

export interface GoNoGoDecision {
  overallStatus: 'GO' | 'NO_GO';
  qualityScore: number; // e.g. 98
  performanceScore: number; // e.g. 96
  securityScore: number; // e.g. 100
  accessibilityScore: number; // e.g. 95
  docsScore: number; // e.g. 100
  signedOffBy: string[];
  timestamp: number;
}
