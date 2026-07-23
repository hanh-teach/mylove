export type LicenseEditionType = 'community' | 'personal' | 'professional' | 'education' | 'enterprise';

export interface LicenseInfo {
  edition: LicenseEditionType;
  displayName: string;
  active: boolean;
  maxProjects: string;
  aiMonthlyQuota: string;
  cloudSyncEnabled: boolean;
  customPluginsAllowed: boolean;
  price: string;
}

export interface ProductHealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  threshold: string;
}

export interface SupportArticle {
  id: string;
  title: string;
  category: 'getting_started' | 'editor' | 'ai' | 'cloud' | 'plugins';
  summary: string;
  content: string;
  helpfulCount: number;
}

export interface PrivacyConfig {
  analyticsEnabled: boolean;
  aiContextTraining: boolean;
  pluginDataIsolation: boolean;
  cloudSyncEncrypted: boolean;
  totalDataSizeMB: number;
  lastDataExportDate?: number | null;
}

export interface OperationalPlaybookItem {
  id: string;
  title: string;
  category: 'release' | 'incident' | 'backup' | 'support' | 'compliance';
  summary: string;
  steps: string[];
}

export interface ProductCouncilGoal {
  id: string;
  quarter: string; // e.g. 'Q3 2026'
  title: string;
  description: string;
  type: 'maintenance' | 'feature_1_1' | 'architecture' | 'ux_polish';
  status: 'planned' | 'in_review' | 'approved';
}

export interface ReleaseNoteItem {
  version: string;
  buildNumber: number;
  releaseDate: string;
  highlights: string[];
  bugFixes: string[];
  performanceGains: string[];
}
