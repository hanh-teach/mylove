export interface MpsVolume {
  id: string;
  volumeNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  sections: {
    heading: string;
    details: string[];
  }[];
  status: 'draft' | 'under_review' | 'approved_canonical';
  lastUpdated: string;
}

export interface ProductTelemetryData {
  moduleName: string;
  usagePercentage: number;
  activeUsersCount: number;
  satisfactionScore: number;
  trend: 'up' | 'stable' | 'down';
  recommendation: string;
}
