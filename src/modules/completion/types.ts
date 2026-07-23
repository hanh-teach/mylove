export interface CompletionAuditPhase {
  id: string;
  phaseNumber: number;
  title: string;
  category: 'product' | 'technical' | 'readiness';
  summary: string;
  checklistItems: {
    id: string;
    label: string;
    status: 'passed' | 'warning' | 'pending';
    detail: string;
  }[];
  completionPercentage: number;
}

export interface ProductionProgressCategory {
  name: string;
  percentage: number;
  status: 'complete' | 'near_complete' | 'in_progress';
  iconName: string;
}

export interface UserPersonaBenchmark {
  persona: string;
  taskName: string;
  targetTime: string;
  actualTime: string;
  passed: boolean;
  notes: string;
}

// LPEP (LoveNote Product Evolution Program) Specific Data Models - Phase 4.1 to Phase 4.8

export interface LpepPhaseItem {
  phaseId: '4.1' | '4.2' | '4.3' | '4.4' | '4.5' | '4.6' | '4.7' | '4.8';
  phaseName: string;
  tagline: string;
  timeframe: string;
  objective: string;
  keyDeliverablesOrMetrics: string[];
  strategicOutcome: string;
  status: 'Active Stabilization' | 'Data Gathering' | 'Planned Roadmap' | 'Ecosystem Design' | 'Enterprise Ready' | 'AI Evolution' | 'Platform Multi-OS' | 'Annual Audit';
}

export interface LpepProductAnalyticsInsight {
  insightCategory: 'Most Used Feature' | 'Underused Screen' | 'High Friction Exit' | 'AI Content Type' | 'Popular Template';
  metricLabel: string;
  measuredData: string;
  dataInsight: string;
  roadmapImpact: string;
}

export interface LpepEcosystemMarketplace {
  marketplaceCategory: 'Plugin Marketplace' | 'Theme Marketplace' | 'Template Marketplace' | 'AI Prompt Marketplace' | 'Community Templates';
  description: string;
  creatorMonetizationOrShare: string;
  launchMilestone: 'LoveNote 1.1' | 'LoveNote 1.2' | 'LoveNote 2.0';
  status: 'SDK Ready' | 'In Design' | 'Planned';
}

export interface LpepAiEvolutionCapability {
  capabilityTitle: string;
  description: string;
  transparencyAndControl: string;
  offlineSupport: 'Full Offline On-Device' | 'Hybrid Cloud' | 'Cloud Processing';
  targetRelease: 'LoveNote 1.1' | 'LoveNote 1.2' | 'LoveNote 2.0';
  status: 'In Prototyping' | 'Roadmap Enforced';
}

export interface LpepPlatformMatrix {
  platformName: 'Windows Desktop' | 'Android Mobile' | 'Tablet HD' | 'Web Platform';
  targetExperience: string;
  syncStrategy: string;
  releaseVersion: 'v1.0 Ready' | 'v1.1 Native' | 'v1.2 Tablet' | 'v2.0 Web';
  status: 'Production Ready' | 'In Testing' | 'Roadmap';
}

export interface LpepAnnualArchitectureCheck {
  domain: 'System Architecture' | 'Design System' | 'Database Engine' | 'AI Pipeline' | 'Plugin SDK' | 'Security & Auth';
  reviewInterval: 'Annual (Mỗi 12 Tháng)';
  evaluationCriteria: string;
  debtMitigationAction: string;
  status: 'Scheduled Audit';
}

// LPEP Phase 4.1 - Operational Excellence & Product Governance Models
export interface LpepGovernanceBoardFeature {
  featureId: string;
  title: string;
  reviewStage: 'Feature Request' | 'Product Review' | 'Technical Review' | 'UX Review' | 'Priority Score' | 'Roadmap Enforced';
  impactScore: number; // 1-10
  effortScore: number; // 1-10
  priorityScore: number; // Calculated RICE/Impact-Effort Score
  decisionStatus: 'Approved for v1.1' | 'In UX Evaluation' | 'In Tech Review' | 'Backlog' | 'Retired';
}

export interface LpepProductKpiItem {
  category: 'Business KPI' | 'Technical KPI' | 'UX KPI' | 'Operational KPI';
  metricName: string;
  currentValue: string;
  targetValue: string;
  status: 'Optimal' | 'On Track' | 'Watchlist';
}

export interface LpepFeatureLifecycleItem {
  featureName: string;
  stage: 'Idea' | 'Research' | 'Prototype' | 'Development' | 'Beta' | 'Release' | 'Improve' | 'Retire' | 'Archive';
  valueTag: string;
  actionNote: string;
}

export interface LpepTechDebtRegisterItem {
  debtType: 'Code Debt' | 'UI Debt' | 'AI Prompt Debt' | 'Performance Debt' | 'Documentation Debt';
  description: string;
  costDays: number;
  interestScore: 'High Interest' | 'Medium Interest' | 'Low Interest';
  capacityAllocated: string;
  severity: 'Low' | 'Medium' | 'High';
  mitigationPlan: string;
}

export interface LpepProductHealthBreakdown {
  category: 'Stability' | 'Performance' | 'UX' | 'Security' | 'Accessibility' | 'Documentation';
  weightPercentage: number;
  rawScore: number; // out of 100
  weightedScore: number;
  notes: string;
}

export interface LpepHealthHistoryTrendItem {
  version: string;
  score: number;
  rating: string;
  releaseDate: string;
}

export interface LpepVocCategoryItem {
  category: 'Suggestion' | 'Complaint' | 'Praise' | 'Bug' | 'Idea' | 'Question';
  count: number;
  aiClusterTrend: string;
  priorityAction: string;
}

export interface LpepVocSentimentData {
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  topPainPoints: string[];
}

export interface LpepReleaseQualityIndex {
  releaseVersion: string;
  crashScore: number;
  performanceScore: number;
  uxScore: number;
  securityScore: number;
  rqiTotalScore: number;
  releaseConfidencePercent: number;
  goNoGoStatus: 'GO FOR RELEASE' | 'NO-GO HOLD';
  status: string;
}

export interface LpepContinuousImprovementReport {
  reportTitle: string;
  top10Bugs: string[];
  top10Requests: string[];
  top10Underused: string[];
  top10ProposedImprovements: string[];
}

export interface LpepEpdMetricItem {
  metricName: string;
  value: string;
  trend: string;
  status: 'Excellent' | 'High' | 'Optimal' | 'Controlled' | 'Warning';
  category: 'Executive Health' | 'Growth & Stickiness' | 'Technical & Risk';
}

export interface LpepProductIntelligenceItem {
  featureMetric: string;
  changeTrend: string;
  reason: string;
  confidencePercent: number;
  recommendation: string;
}

export interface LpepDecisionIntelligenceLogItem {
  decisionId: string;
  decisionTitle: string;
  reason: string;
  expectedResult: string;
  actualResult: string;
  aiLearningNote: string;
  status: 'Validated Success' | 'In Monitoring' | 'Refining';
}

export interface LpepRiskRadarItem {
  riskArea: string;
  currentMetric: string;
  predictedIssue: string;
  severity: 'High' | 'Medium' | 'Critical';
  proactiveRecommendation: string;
}

export interface LpepOpportunityDiscoveryItem {
  segmentOrPattern: string;
  growthSignal: string;
  insightDescription: string;
  aiRecommendation: string;
}

export interface LpepCompetitiveBenchmarkItem {
  competitorName: string;
  strengths: string;
  weaknesses: string;
  marketTrend: string;
  shouldAdopt: 'YES' | 'NO' | 'LATER';
  adoptionReasoning: string;
}

export interface LpepInnovationPortfolioItem {
  ideaTitle: string;
  description: string;
  stage: 'Explore' | 'Prototype' | 'Validate' | 'Roadmap' | 'Archived';
  stageMeaning: string;
  strategicFitScore: number;
}

export interface LpepProductForecastItem {
  forecastArea: string;
  currentValue: string;
  sixMonthForecast: string;
  confidencePercent: number;
  strategicActionNeeded: string;
}

export interface LpepQuarterlyBusinessReview {
  quarterTitle: string;
  productHealthSummary: string;
  userGrowthMetrics: string;
  technicalDebtStatus: string;
  releaseQualityIndex: string;
  customerFeedbackSummary: string;
  innovationProgress: string;
  riskAssessmentSummary: string;
  strategicRoadmapRecommendation: string;
}

export interface LpepPhase42DodItem {
  criterionId: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CERTIFIED';
}

export interface LpepPortfolioTrackItem {
  trackName: string;
  initiativesCount: number;
  status: 'Active' | 'Expanding' | 'Research' | 'Maintained';
  description: string;
}

export interface LpepStrategicPrioritizationItem {
  initiativeTitle: string;
  track: string;
  customerValueScore: number; // 30%
  businessImpactScore: number; // 25%
  techComplexityScore: number; // 15%
  strategicAlignmentScore: number; // 20%
  devCostScore: number; // 10%
  strategicScore: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface LpepInnovationFunnelItem {
  initiativeName: string;
  stage: 'Idea' | 'Research' | 'Validation' | 'Prototype' | 'Pilot' | 'Roadmap' | 'Development' | 'Release';
  leadOwner: string;
  stageProgress: number;
}

export interface LpepInvestmentAllocationItem {
  category: string;
  percentage: number;
  resourceHours: number;
  strategicFocus: string;
}

export interface LpepFeatureRoiItem {
  featureName: string;
  investmentHours: number;
  usagePercent: number;
  csatScore: number;
  roiRating: 'Very High' | 'High' | 'Moderate' | 'Low';
  actionRecommendation: string;
}

export interface LpepSunsetManagementItem {
  featureName: string;
  stage: 'Low Usage' | 'Review' | 'Deprecation Notice' | 'Migration' | 'Archive';
  retirementReason: string;
  replacementAlternative: string;
}

export interface LpepCapabilityMapItem {
  capabilityName: string;
  levelPercent: number;
  status: 'Market Lead' | 'Strong' | 'Developing' | 'Gap to Invest';
  strategicAction: string;
}

export interface LpepHorizonRoadmapItem {
  horizonTitle: string;
  timeframe: string;
  focusGoal: string;
  keyInitiatives: string[];
}

export interface LpepExecutiveReviewCycleItem {
  cadence: 'Hàng tháng' | 'Hàng quý' | '6 tháng' | 'Hàng năm';
  contentFocus: string;
  keyParticipants: string;
  deliverableOutput: string;
}

export interface LpepDesignCouncilReviewItem {
  initiativeTitle: string;
  fitsPhilosophy: boolean;
  philosophyVerdict: string;
  solvesRealProblem: boolean;
  problemVerdict: string;
  preventsUiClutter: boolean;
  uiVerdict: string;
  maintainsPerformanceSecurity: boolean;
  techVerdict: string;
  createsLongTermValue: boolean;
  valueVerdict: string;
  councilDecision: 'APPROVED FOR ROADMAP' | 'REJECTED' | 'NEEDS REFINEMENT';
}

export interface LpepPhase43DodItem {
  criterionId: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CERTIFIED';
}

export interface LpepArchitectureProposalItem {
  proposalId: string;
  title: string;
  impactScope: string;
  riskAssessment: 'LOW' | 'MEDIUM' | 'HIGH';
  reviewBoardStatus: 'APPROVED' | 'IN_REVIEW' | 'REJECTED';
  rationale: string;
}

export interface LpepDependencyHealthSummary {
  healthyPercent: number;
  deprecatedCount: number;
  criticalUpdateCount: number;
  licenseRiskCount: number;
  monitoredCategories: string[];
}

export interface LpepPluginCompatibilityItem {
  pluginName: string;
  ln10Compat: boolean;
  ln11Compat: boolean;
  ln20Compat: 'COMPATIBLE' | 'WARNING' | 'INCOMPATIBLE';
  nightlyCompat: boolean;
  healthNote: string;
}

export interface LpepApiStabilityIndex {
  stablePercent: number;
  deprecatedPercent: number;
  experimentalPercent: number;
  totalEndpoints: number;
  lifecyclePolicyNote: string;
}

export interface LpepModularizationAuditItem {
  moduleName: string;
  independenceScore: number;
  status: 'OPTIMAL' | 'HEALTHY' | 'NEEDS_DECOUPLING';
  couplingRiskNote: string;
}

export interface LpepScalabilitySimulation {
  scenarioName: string;
  projectsCount: string;
  assetsCount: string;
  notesCount: string;
  workspacesCount: string;
  startupLatencyMs: number;
  searchLatencyMs: number;
  memoryUsageMb: number;
  exportTimeSec: number;
  syncStatus: 'REALTIME' | 'STABLE_BUFFER';
}

export interface LpepTechWatchItem {
  technologyName: string;
  category: 'AI Model' | 'UI Framework' | 'OS API' | 'GPU Accel' | 'Offline AI';
  readinessStatus: 'WATCHING' | 'EVALUATING' | 'READY_FOR_POC';
  strategicNote: string;
}

export interface LpepSustainabilityScore {
  maintainability: number; // 30%
  extensibility: number;   // 25%
  testability: number;     // 15%
  scalability: number;     // 20%
  documentation: number;   // 10%
  totalScore: number;
  ratingLabel: string;
}

export interface LpepArchitectureEvolutionRoadmapItem {
  layer: 'Architecture' | 'Infrastructure' | 'SDK' | 'AI Engine' | 'Cloud';
  horizonFocus: string;
  keyUpgrades: string[];
}

export interface LpepEngineeringConstitutionPrinciple {
  pillarNumber: number;
  title: string;
  englishTitle: string;
  principleDescription: string;
  enforcementMechanism: string;
}

export interface LpepPhase44DodItem {
  criterionId: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CERTIFIED';
}

export interface LpepProductOsStep {
  stepName: string;
  sequence: number;
  description: string;
  status: 'ACTIVE_LOOP';
}

export interface LpepStrategyManagement {
  vision: string;
  mission: string;
  strategicGoals: string[];
}

export interface LpepOkrItem {
  objective: string;
  keyResults: { krTitle: string; currentVal: string; targetVal: string; isAchieved: boolean }[];
  overallProgressPercent: number;
}

export interface LpepCapabilityMaturityItem {
  domain: 'Product' | 'Engineering' | 'UX' | 'AI' | 'Operations' | 'Analytics' | 'Innovation';
  maturityLevel: number; // 1 - 5
  targetLevel: number;
  strategicFocus: string;
}

export interface LpepDecisionQualityItem {
  decisionTitle: string;
  evidenceQuality: 'HIGH' | 'MEDIUM' | 'EMPIRICAL';
  executionRating: 'EXCELLENT' | 'GOOD' | 'IN_PROGRESS';
  resultOutcome: 'SUCCESS' | 'LEARNING_GAINED';
  aiLearningInsight: string;
}

export interface LpepKnowledgeGraphNode {
  nodeId: string;
  featureName: string;
  linkedDecision: string;
  linkedRequirement: string;
  linkedCodeModule: string;
  linkedTestSuite: string;
  linkedReleaseVersion: string;
  userFeedbackSummary: string;
  continuousImprovement: string;
}

export interface LpepOrganizationalMemoryItem {
  memoryCategory: 'Architecture' | 'UX Pattern' | 'AI Prompt' | 'Release & KPI' | 'Incident Postmortem';
  title: string;
  recordSummary: string;
  knowledgeRetentionValue: string;
}

export interface LpepContinuousGovernanceReview {
  reviewDomain: 'Product' | 'Engineering' | 'Security' | 'UX' | 'Performance' | 'Innovation';
  reviewCadence: 'Monthly Auto';
  status: 'PASS' | 'AUDITED';
  generatedArtifact: string;
}

export interface LpepOrgExecutiveDashboard {
  orgHealthPercent: number;
  decisionQualityPercent: number;
  innovationVelocityPercent: number;
  technicalDebtPercent: number;
  employeeKnowledgePercent: number;
  releaseStabilityPercent: number;
}

export interface LpepStrategicTierItem {
  tierCode: 'Tier 1' | 'Tier 2' | 'Tier 3';
  tierTitle: string;
  strategicPurpose: string;
  includedModules: string[];
}

export interface LpepPhase45DodItem {
  criterionId: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CERTIFIED';
}

export interface LdefPillarStatus {
  pillarName: 'Product Excellence' | 'Engineering Excellence' | 'Operational Excellence' | 'Business Excellence' | 'Platform Excellence' | 'Continuous Evolution';
  completionPercent: number;
  statusLabel: string;
}

export interface LdefBusinessModelItem {
  modelType: 'Free' | 'Premium' | 'Family' | 'Education' | 'Enterprise';
  status: 'ACTIVE_READY' | 'ROADMAP_PLANNED' | 'RESEARCH_PHASE';
  description: string;
  targetSegment: string;
}

export interface LdefEcosystemComponent {
  componentName: 'Desktop' | 'Mobile' | 'Cloud' | 'AI' | 'Plugin' | 'Template' | 'Community' | 'API';
  readinessStatus: string;
  governanceProtocol: string;
}

export interface LdefPartnershipReadiness {
  partnerCategory: 'AI Provider' | 'Cloud Provider' | 'Print Service' | 'Education Org';
  readinessStatus: 'ARCHITECTED_READY';
  integrationSpec: string;
}

export interface LdefSustainabilityMetric {
  costCategory: 'Infrastructure & Cloud' | 'AI Inference Tokens' | 'Storage & Backups' | 'Support & Operations';
  currentCostProjection: string;
  optimizationStrategy: string;
}

export interface LdefBrandConsistencyCheck {
  touchpoint: 'Logo & Mark' | 'Typography System' | 'Color Palette' | 'Iconography' | 'Illustrations' | 'Tone of Voice';
  complianceStatus: '100% UNIFIED';
  brandGuidelineSummary: string;
}

export interface LdefCommunityStrategyItem {
  pillarName: 'Shared Templates' | 'User Guides' | 'Feature Request Portal' | 'Bug Reporting' | 'User Stories & Testimonials';
  strategyAction: string;
}

export interface LdefBusinessMetric {
  metricTitle: string;
  currentValue: string;
  targetGoal: string;
  status: 'EXCEEDED' | 'ON_TRACK';
}

export interface LdefStrategicReviewDomain {
  domain: 'Product Review' | 'Business Review' | 'Technology Review' | 'Market Trend Review' | 'Risk Review';
  cadencedPeriod: 'Every 6 Months';
  reviewOutput: string;
}

export interface LdefPhase51DodItem {
  criterionId: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CERTIFIED';
}

export interface LpepProductInsightItem {
  metric: string;
  trendChange: string;
  reason: string;
  strategicImpact: string;
}

export interface LpepProductDecisionLogItem {
  decisionId: string;
  decisionTitle: string;
  reason: string;
  expectedResult: string;
  actualResult: string;
  status: 'Validated Success' | 'In Monitoring';
}

export interface LpepStrategicAdvisorRecommendation {
  riskOrOpportunityDetected: string;
  metricTrigger: string;
  aiRecommendation: string;
  priority: 'Critical' | 'High' | 'Strategic';
}

export interface LpepExecutiveProductDashboard {
  productHealthScore: number;
  releaseQualityIndex: number;
  activeUsersDauMau: string;
  retentionD30: string;
  customerSatisfactionCsat: string;
  top5Risks: string[];
  top5Opportunities: string[];
  innovationPipelineProgress: number;
  technicalDebtRatio: number;
  roadmapProgress: number;
}

export interface LpepOperationalDashboardSummary {
  productionHealth: number; // 98
  releaseQuality: number; // 97
  customerSatisfaction: number; // 98
  technicalDebt: number; // 18
  innovationPipeline: number; // 50
  roadmapReadiness: number; // 90
  operationalExcellence: number; // 70
}

// LPCP Phase 3.4 Specific Data Models - Go-Live, Operations & Continuous Improvement

export interface ProductionHealthMetric {
  metricKey: string;
  metricLabel: string;
  measuredValue: string;
  kpiTarget: string;
  status: 'Healthy (99.9%+) font-mono' | 'Healthy' | 'Optimal';
  trend: 'Stable' | 'Improving' | 'Zero Issue';
}

export interface SupportTicketItem {
  ticketId: string;
  category: 'Bug' | 'UX' | 'Feature Request' | 'Performance' | 'AI' | 'Documentation';
  title: string;
  reportedBy: string;
  lifecycleStage: 'User Report' | 'Ticket Created' | 'Triaged' | 'Fixing' | 'Verified' | 'Released 1.0.1';
  priority: 'High' | 'Medium' | 'Low';
  resolutionNote: string;
}

export interface ReleaseTrainCycle {
  versionSeries: '1.0.x' | '1.1' | '1.2' | '2.0';
  cycleName: string;
  frequency: string;
  focusArea: string;
  qualityGateEnforced: boolean;
  status: 'Active / Hotfix Ready' | 'In Development' | 'Planned Roadmap';
}

export interface TechnicalDebtItem {
  debtCategory: 'Technical Debt' | 'Design Debt' | 'Documentation Debt' | 'AI Prompt Debt' | 'Performance Debt';
  title: string;
  allocatedCapacity: string; // e.g. "15-20% capacity per release"
  mitigationStrategy: string;
  targetVersion: string;
  status: 'Tracked & Budgeted' | 'In Progress';
}

export interface InnovationBacklogItem {
  ideaId: string;
  title: string;
  category: 'AI Agent' | 'Real-time Collaboration' | 'Mobile Widget' | 'Voice Notes' | 'Advanced OCR' | 'Smart Templates';
  valueProposition: string;
  targetMajorRelease: 'LoveNote 1.1' | 'LoveNote 1.2' | 'LoveNote 2.0' | 'LoveNote 3.0';
  feasibilityScore: string;
}

export interface LongTermRoadmapPhase {
  phaseTag: 'LoveNote 1.x' | 'LoveNote 2.x' | 'LoveNote 3.x';
  timelineHorizon: string;
  coreVision: string;
  keyDeliverables: string[];
  readinessState: 'In Production' | 'Architecture Design' | 'Vision Backlog';
}

export interface ProductGovernanceCadence {
  reviewCadence: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual';
  cadenceFocus: string;
  keyMetricsReviewed: string[];
  responsibleStakeholders: string;
  status: 'Active Operating Model';
}

// LPCP Phase 3.3 Specific Data Models - User Acceptance Testing (UAT) & Pilot Deployment

export interface PilotGroupTarget {
  groupId: 'student' | 'teacher' | 'personal' | 'family' | 'office' | 'senior';
  groupName: string;
  targetAudience: string;
  useCases: string[];
  participantCount: number;
  satisfactionScore: number; // e.g. 4.8 / 5.0
  taskSuccessRate: number; // e.g. 98%
  status: 'Completed' | 'Active';
}

export interface UatTestScenario {
  scenarioId: string;
  title: string;
  stepsSequence: string[];
  targetMetric: string;
  actualResult: string;
  successRate: number; // %
  status: 'Passed (≥95%)' | 'In Progress';
}

export interface UatMetricTarget {
  metricName: string;
  targetGoal: string;
  actualMeasured: string;
  passedStatus: boolean;
  notes: string;
}

export interface BugTriageItem {
  bugId: string;
  severity: 'Critical' | 'Major' | 'Minor';
  title: string;
  impactArea: string;
  assignedTo: string;
  fixVersion: string;
  status: 'Resolved' | 'Triaged' | 'In Progress' | 'Closed';
}

export interface ReleaseCandidatePipeline {
  versionTag: string;
  buildDate: string;
  passRatePercentage: number;
  criticalBugCount: number;
  majorBugCount: number;
  status: 'Approved for Launch' | 'In Testing' | 'Superseded';
}

export interface ReadinessReviewChecklist {
  domain: 'Product' | 'Engineering' | 'Operations' | 'Business';
  checkItems: {
    label: string;
    status: 'Passed' | 'Ready';
    notes: string;
  }[];
}

// LPCP Phase 3.1 Specific Data Models - Documentation & Knowledge Center Certification

export interface UserGuideArticle {
  id: string;
  category: 'Getting Started' | 'Projects' | 'Editor' | 'AI Assistant' | 'Memory' | 'Timeline' | 'Export' | 'Cloud Sync' | 'FAQ';
  title: string;
  readingTimeMinutes: number;
  keyTakeaway: string;
  sectionContent: string;
  docVersion: '1.0' | '1.1' | '1.2';
}

export interface InteractiveTutorialStep {
  stepNumber: number;
  title: string;
  targetUiElement: string;
  instructionText: string;
  actionButtonLabel: string;
}

export interface ApiReferenceEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpointPath: string;
  purpose: string;
  inputParams: string;
  outputResponse: string;
  errorCodes: string[];
  exampleSnippet: string;
}

export interface PluginSDKGuideTopic {
  topic: string;
  lifecyclePhase: string;
  permissions: string;
  events: string;
  codeExample: string;
}

export interface ReleaseNoteVersion {
  versionNumber: string;
  releaseDate: string;
  newFeatures: string[];
  improvements: string[];
  bugFixes: string[];
  knownIssues: string[];
}

export interface ArchitectureDecisionRecord {
  adrId: string;
  title: string;
  decisionDate: string;
  status: 'Accepted' | 'Superseded' | 'Proposed';
  context: string;
  decision: string;
  consequences: string;
}

// LPCP Phase 2.3 Specific Data Models - Accessibility & Inclusive Design Certification

export interface AccessibilityAuditItem {
  domain: 'WCAG 2.2 AA Contrast' | 'Keyboard Navigation' | 'Screen Reader ARIA' | 'Touch Certification' | 'Font Scaling (200%)' | 'Color Blind Modes' | 'Reduced Motion' | 'Cognitive Load';
  scorePercentage: number;
  status: 'WCAG 2.2 AA Certified' | 'Passed';
  details: string;
  standardsRef: string;
}

export interface KeyboardShortcutMapItem {
  shortcut: string;
  actionName: string;
  contextScope: string;
  focusTrapProtected: boolean;
  status: 'Certified';
}

export interface InclusiveModeProfile {
  modeKey: 'beginner' | 'senior' | 'focus_reading' | 'education';
  modeName: string;
  targetAudience: string;
  keyAdaptations: string[];
  activeState: boolean;
}

export interface AdaptiveWorkspaceFeature {
  featureName: string;
  frequentlyUsed: boolean;
  confidenceScore: number;
  adaptedPlacement: string;
  privacyGuarantee: '100% Local Device On-Device Habit Intelligence';
}

// LPCP Phase 2.2 Specific Data Models - Security, Privacy & Reliability Certification

export interface SecurityMetricItem {
  domain: 'Authentication' | 'Authorization' | 'Encryption' | 'Backup Integrity' | 'Disaster Recovery' | 'Plugin Security' | 'AI Safety' | '7-Day Reliability';
  scorePercentage: number;
  status: 'Certified 100%' | 'Passed';
  details: string;
  auditStandard: string;
}

export interface PrivacyControlSetting {
  feature: string;
  category: 'Cloud Sync' | 'AI Memory' | 'Telemetry' | 'Plugin Access';
  defaultState: 'ON (Local/Private)' | 'OFF (Opt-in)' | 'Anonymous Only' | 'Review Required';
  userConfigurable: boolean;
  description: string;
}

export interface DisasterRecoveryTest {
  scenario: string;
  simulationType: string;
  recoveryTarget: string;
  actualBehavior: string;
  status: 'Passed (0 Data Loss)';
}

export interface AiSafetyAuditItem {
  requirement: string;
  verificationMethod: string;
  outcome: string;
  status: 'Passed';
}

export interface PluginSecurityAudit {
  layer: string;
  policyRule: string;
  status: 'Enforced';
}

// LPCP Phase 2.1 Specific Data Models - Performance Engineering & Scalability

export interface PerformanceBudgetItem {
  metricName: string;
  budgetTarget: string;
  actualMeasured: string;
  unit: string;
  status: 'Passed (Under Budget)' | 'Warning' | 'Exceeded';
  impactArea: string;
}

export interface BenchmarkSuiteItem {
  testSuite: string;
  scale10: string;
  scale1000: string;
  scale10000: string;
  scale50000: string;
  status: 'Passed (60 FPS)';
  optimizationMethod: string;
}

export interface VirtualRenderingSpec {
  componentName: string;
  totalDataCapacity: string;
  renderedDomNodes: string;
  bufferWindowSize: string;
  scrollingFps: number;
  status: 'Certified Virtualized';
}

export interface AiPerformanceBreakdown {
  pipelineStage: string;
  processingTimeMs: number;
  description: string;
  status: 'Optimal';
}

export interface StressAndStabilityItem {
  testCategory: 'Stress Test' | '72-Hour Long-running' | 'Battery Optimization';
  testScenario: string;
  workloadVolume: string;
  observedResult: string;
  memoryLeakDetected: boolean;
  status: '100% Stable Certified';
}

export interface DesignTokenAuditItem {
  category: 'Colors' | 'Typography' | 'Spacing' | 'Radius' | 'Elevation' | 'Motion' | 'Grid';
  tokenName: string;
  sourceOfTruth: string;
  status: 'Certified (0 Hardcode)';
  detail: string;
}

export interface ComponentCertificationItem {
  componentName: string;
  statesCovered: string[]; // ['Standard', 'Hover', 'Focus', 'Disabled', 'Loading', 'Error', 'Dark Mode']
  certifiedStatus: 'Certified 100%';
  notes: string;
}

export interface ResponsiveBreakpointItem {
  platform: 'Windows Desktop' | 'Windows Desktop High DPI' | 'Tablet' | 'Android Mobile';
  resolutionDpi: string;
  layoutBehavior: string;
  certifiedStatus: 'Passed';
}

export interface MotionSpecItem {
  uiPattern: string;
  animationType: string;
  durationMs: number;
  easingCurve: string;
  status: 'Certified';
}

export interface StatePatternItem {
  stateType: 'Empty State' | 'Loading Pattern' | 'Error Pattern' | 'Print Preview';
  scenario: string;
  patternDescription: string;
  actionPath: string;
  status: 'Certified';
}

export interface QualityGateItem {
  gateNumber: number;
  gateName: string;
  description: string;
  scorePercentage: number;
  status: 'Passed' | 'In Progress';
  requirements: string[];
}

export interface CpecEvolutionStep {
  sequence: number;
  stepName: 'Observe' | 'Analyze' | 'Decide' | 'Build' | 'Validate' | 'Release' | 'Learn' | 'Observe';
  description: string;
  cadence: string;
}

export interface CpecObservationSource {
  sourceName: string;
  dataSource: string;
  status: 'ACTIVE_LISTENING';
}

export interface CpecAnalysisItem {
  metricChange: string;
  reasonDetected: string;
  aiRecommendation: string;
}

export interface CpecStrategicDecisionItem {
  criteria: string;
  evaluationMethod: string;
  status: 'GOVERNED_GATE';
}

export interface CpecControlledDeliveryStep {
  stage: 'Prototype' | 'Internal Test' | 'Beta' | 'Pilot' | 'General Availability';
  governanceAction: string;
}

export interface CpecLearningLoopRecord {
  category: 'Success' | 'Failure' | 'Lessons Learned' | 'Actions';
  summary: string;
}

export interface CpecKnowledgeVaultRecord {
  vaultSection: string;
  retentionType: string;
  status: 'PERMANENT_MEMORY';
}

export interface CpecAnnualHealthReviewItem {
  domain: string;
  annualHealthScore: number;
  auditConclusion: string;
}

export interface CpecLongTermVisionItem {
  reviewQuestion: string;
  strategicInsight: string;
  actionTaken: string;
}

export interface CpecPhase52DodItem {
  criterionId: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'CERTIFIED' | 'FRAMEWORK_FROZEN';
}

