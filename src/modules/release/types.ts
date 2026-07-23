export type ReleaseChannel = 'stable' | 'beta' | 'nightly';

export type FeatureFlagStatus = 'enabled' | 'disabled' | 'beta' | 'experimental';

export interface FeatureFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  status: FeatureFlagStatus;
  category: 'ai' | 'editor' | 'sync' | 'ui' | 'system';
}

export interface FeedbackEntry {
  id: string;
  type: 'bug' | 'feature' | 'experience' | 'general';
  title: string;
  description: string;
  includeLogs: boolean;
  includeScreenshot: boolean;
  timestamp: number;
  channel: ReleaseChannel;
  status: 'submitted' | 'under_review' | 'resolved';
}

export interface PerformanceMetric {
  name: string;
  value: number; // in ms or MB
  unit: 'ms' | 'MB' | '%';
  threshold: number;
  status: 'good' | 'warning' | 'critical';
  history: number[];
}

export interface ReleaseReadinessItem {
  id: string;
  category: 'bugs' | 'performance' | 'accessibility' | 'docs' | 'compliance';
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  detail: string;
}

export interface KnownIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high';
  status: 'investigating' | 'fixing' | 'resolved';
  affectedVersions: string[];
}

export interface BetaRoadmapItem {
  id: string;
  title: string;
  description: string;
  votes: number;
  voted?: boolean;
  status: 'planned' | 'in_progress' | 'completed';
}
