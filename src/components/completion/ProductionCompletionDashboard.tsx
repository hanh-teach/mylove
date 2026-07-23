import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, ShieldCheck, Award, Sparkles, Activity, Layers, Rocket, 
  Users, BarChart2, Zap, Clock, ShieldAlert, Cpu, Heart, Check, ChevronRight, FileText,
  Search, BookOpen, AlertCircle, RefreshCw, Layout, Eye, Lock, ArrowRight, CornerDownRight, MessageSquare,
  Printer, Smartphone, Monitor, Palette, Type, Move, Sliders, Shield, HardDrive, BatteryCharging, Gauge,
  Key, UserCheck, Database, HardDriveDownload, PowerOff, ShieldX, Terminal, CpuIcon, CheckSquare, EyeOff, Radio,
  Accessibility, Keyboard, Volume2, Maximize2, SunMedium, ToggleLeft, ToggleRight,
  Smile, GraduationCap, User, Briefcase, Glasses, Compass, BrainCircuit, Sparkle, Wand2,
  HelpCircle, Code, Server, GitBranch, Bookmark, ExternalLink, HelpCircle as QuestionIcon, PlayCircle, Filter,
  TrendingUp, AlertTriangle, Target, Building2, GitCommit, Network, Workflow, RotateCcw
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { completionService } from '../../modules/completion/CompletionService';
import { UserGuideArticle, ApiReferenceEndpoint, ArchitectureDecisionRecord } from '../../modules/completion/types';

export const ProductionCompletionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lpep_program' | 'ops_health' | 'feedback_loop' | 'release_train' | 'tech_debt_backlog' | 'p45_digital_org' | 'ldef_business_org' | 'ldef_cpec_evolution' | 'roadmap_governance' | 'uat_pilot' | 'readiness_review' | 'user_guides' | 'dev_portal'>('ldef_cpec_evolution');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [docVersion, setDocVersion] = useState<'1.0' | '1.1' | '1.2'>('1.0');
  const [guideCategoryFilter, setGuideCategoryFilter] = useState<string>('All');
  
  // Interactive Onboarding Walkthrough Simulator State
  const [currentTutorialStep, setCurrentTutorialStep] = useState<number>(0);
  const [contextHelpOpen, setContextHelpOpen] = useState<boolean>(false);
  const [selectedGuideForModal, setSelectedGuideForModal] = useState<UserGuideArticle | null>(null);

  // AI Knowledge Assistant Interactive Simulation State
  const [aiUserQuery, setAiUserQuery] = useState<string>('Làm sao tạo thiệp sinh nhật?');
  const [aiResponseState, setAiResponseState] = useState<'idle' | 'analyzing' | 'action_ready'>('idle');
  const [highlightedUiButton, setHighlightedUiButton] = useState<string | null>(null);

  // Interactive Bug & Ticket Filter
  const [bugSeverityFilter, setBugSeverityFilter] = useState<string>('All');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState<string>('All');

  // Data from completion service
  const userGuides = completionService.getUserGuides();
  const tutorialSteps = completionService.getInteractiveTutorialSteps();
  const apiEndpoints = completionService.getApiEndpoints();
  const pluginTopics = completionService.getPluginSDKTopics();
  const releaseNotes = completionService.getReleaseNotes();
  const adrRecords = completionService.getArchitectureDecisionRecords();
  const a11yMetrics = completionService.getAccessibilityMetrics();

  // Phase 3.3 & 3.4 Data
  const pilotGroups = completionService.getPilotGroups();
  const uatScenarios = completionService.getUatScenarios();
  const uatMetrics = completionService.getUatMetrics();
  const bugTriageList = completionService.getBugTriageList();
  const releaseCandidates = completionService.getReleaseCandidates();
  const readinessChecklist = completionService.getReadinessChecklist();

  // Phase 3.4 Production Operations & Governance Data
  const healthMetrics = completionService.getHealthMetrics();
  const supportTickets = completionService.getSupportTickets();
  const releaseTrain = completionService.getReleaseTrain();
  const technicalDebts = completionService.getTechnicalDebts();
  const innovationBacklog = completionService.getInnovationBacklog();
  const longTermRoadmap = completionService.getLongTermRoadmap();
  const productGovernance = completionService.getProductGovernance();

  // LPEP Phase 4.1 to Phase 4.8 Product Evolution Data
  const lpepPhases = completionService.getLpepPhases();
  const lpepAnalytics = completionService.getLpepAnalyticsInsights();
  const lpepMarketplaces = completionService.getLpepMarketplaces();
  const lpepAiCaps = completionService.getLpepAiCapabilities();
  const lpepPlatforms = completionService.getLpepPlatforms();
  const lpepAnnualChecks = completionService.getLpepAnnualChecks();

  // LPEP Phase 4.1 Operational Excellence & Product Governance Getters
  const lpepGovBoard = completionService.getLpepGovernanceBoard();
  const lpepProductKpis = completionService.getLpepProductKpis();
  const lpepLifecycles = completionService.getLpepFeatureLifecycles();
  const lpepTechDebts = completionService.getLpepTechDebtItems();
  const lpepHealthBreakdowns = completionService.getLpepHealthBreakdowns();
  const lpepHealthTrends = completionService.getLpepHealthTrends();
  const lpepVocCategories = completionService.getLpepVocCategories();
  const lpepVocSentiment = completionService.getLpepVocSentiment();
  const lpepRqi = completionService.getLpepReleaseQualityIndex();
  const lpepContinuousReport = completionService.getLpepContinuousReport();
  const lpepProductInsights = completionService.getLpepProductInsights();
  const lpepDecisionLogs = completionService.getLpepDecisionLogs();
  const lpepStrategicRecommendations = completionService.getLpepStrategicRecommendations();
  const lpepExecutiveDashboard = completionService.getLpepExecutiveDashboard();
  const lpepOperationalSummary = completionService.getLpepOperationalSummary();

  // LPEP Phase 4.2 Product Intelligence & Strategic Decision System Getters
  const lpepEpdMetrics = completionService.getLpepEpdMetrics();
  const lpepIntelligenceEngine = completionService.getLpepProductIntelligenceEngine();
  const lpepDecisionIntelligenceLogs = completionService.getLpepDecisionIntelligenceLogs();
  const lpepRiskRadar = completionService.getLpepRiskRadarItems();
  const lpepOpportunities = completionService.getLpepOpportunityDiscoveryItems();
  const lpepCompetitors = completionService.getLpepCompetitiveBenchmarkItems();
  const lpepInnovationPortfolio = completionService.getLpepInnovationPortfolioItems();
  const lpepForecasts = completionService.getLpepProductForecastItems();
  const lpepQbrReport = completionService.getLpepQuarterlyBusinessReview();
  const lpepPhase42Dod = completionService.getLpepPhase42DodItems();

  // LPEP Phase 4.3 Product Portfolio & Innovation Management Getters
  const lpepPortfolioTracks = completionService.getLpepPortfolioTracks();
  const lpepPrioritization = completionService.getLpepStrategicPrioritization();
  const lpepFunnel = completionService.getLpepInnovationFunnel();
  const lpepInvestments = completionService.getLpepInvestmentAllocation();
  const lpepFeatureRois = completionService.getLpepFeatureRoi();
  const lpepSunsetItems = completionService.getLpepSunsetManagement();
  const lpepCapabilities = completionService.getLpepCapabilityMap();
  const lpepHorizons = completionService.getLpepThreeHorizonsRoadmap();
  const lpepReviewCycle = completionService.getLpepExecutiveReviewCycle();
  const lpepDesignCouncil = completionService.getLpepDesignCouncilReviews();
  const lpepPhase43Dod = completionService.getLpepPhase43DodItems();

  // LPEP Phase 4.4 Evolution Architecture & Platform Sustainability Getters
  const lpepArchProposals = completionService.getLpepArchProposals();
  const lpepDepHealth = completionService.getLpepDepHealthSummary();
  const lpepPluginCompats = completionService.getLpepPluginCompats();
  const lpepApiStability = completionService.getLpepApiStability();
  const lpepModularAudits = completionService.getLpepModularAudits();
  const lpepScalabilitySim = completionService.getLpepScalabilitySimulation();
  const lpepTechWatch = completionService.getLpepTechWatch();
  const lpepSustainability = completionService.getLpepSustainabilityScore();
  const lpepArchRoadmap = completionService.getLpepArchRoadmap();
  const lpepConstitution = completionService.getLpepEngineeringConstitution();
  const lpepPhase44Dod = completionService.getLpepPhase44DodItems();

  // LPEP Phase 4.5 Digital Product Organization & Operational Maturity Getters
  const lpepProductOsSteps = completionService.getLpepProductOsSteps();
  const lpepStrategyMgmt = completionService.getLpepStrategyManagement();
  const lpepOkrItems = completionService.getLpepOkrItems();
  const lpepCapabilityMaturity = completionService.getLpepCapabilityMaturity();
  const lpepDecisionQuality = completionService.getLpepDecisionQuality();
  const lpepKnowledgeGraph = completionService.getLpepKnowledgeGraphNodes();
  const lpepOrgMemory = completionService.getLpepOrganizationalMemory();
  const lpepContinuousGovernance = completionService.getLpepContinuousGovernance();
  const lpepOrgExecutiveDashboard = completionService.getLpepOrgExecutiveDashboard();
  const lpepStrategicTiers = completionService.getLpepStrategicTiers();
  const lpepPhase45Dod = completionService.getLpepPhase45DodItems();

  // LoveNote Digital Excellence Framework (LDEF) & Phase 5.1 Business Excellence Getters
  const ldefPillars = completionService.getLdefPillarStatuses();
  const ldefBusinessModels = completionService.getLdefBusinessModels();
  const ldefEcosystem = completionService.getLdefEcosystemComponents();
  const ldefPartnerships = completionService.getLdefPartnerships();
  const ldefSustainability = completionService.getLdefSustainabilityMetrics();
  const ldefBrandChecks = completionService.getLdefBrandConsistencyChecks();
  const ldefCommunity = completionService.getLdefCommunityStrategyItems();
  const ldefBusinessMetrics = completionService.getLdefBusinessMetrics();
  const ldefStrategicReviews = completionService.getLdefStrategicReviews();
  const ldefPhase51Dod = completionService.getLdefPhase51DodItems();

  // Phase 5.2 CPEC Getters
  const cpecSteps = completionService.getCpecEvolutionSteps();
  const cpecObservations = completionService.getCpecObservations();
  const cpecAnalyses = completionService.getCpecAnalyses();
  const cpecDecisions = completionService.getCpecStrategicDecisions();
  const cpecDeliveries = completionService.getCpecControlledDeliveries();
  const cpecLearningLoops = completionService.getCpecLearningLoops();
  const cpecKnowledgeVaults = completionService.getCpecKnowledgeVaults();
  const cpecHealthReviews = completionService.getCpecAnnualHealthReviews();
  const cpecVisions = completionService.getCpecLongTermVisions();
  const cpecDod = completionService.getCpecPhase52DodItems();

  // Filtered guides based on search & category
  const filteredGuides = userGuides.filter(g => {
    const matchesCategory = guideCategoryFilter === 'All' || g.category === guideCategoryFilter;
    const matchesSearch = searchQuery === '' || 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.sectionContent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredBugs = bugTriageList.filter(b => {
    return bugSeverityFilter === 'All' || b.severity === bugSeverityFilter;
  });

  const runAiAssistantSimulation = () => {
    setAiResponseState('analyzing');
    setHighlightedUiButton(null);

    setTimeout(() => {
      setAiResponseState('action_ready');
      setHighlightedUiButton('btn_export_card');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 rounded-3xl p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles size={16} className="text-amber-400 animate-pulse" />
              <span>LPEP Governance • Living Product Evolution Model (Phase 4.1 – 4.8)</span>
            </div>
            <Typography variant="h2" className="text-white tracking-tighter">
              LoveNote Product Evolution Program (LPEP)
            </Typography>
            <Typography variant="body" className="text-slate-300 mt-2 max-w-3xl">
              Chuyển đổi từ dự án đóng gói 1.0 sang Nền tảng Bền vũng nhiều năm: Quản trị sản phẩm liên tục, 8 Pha phát triển (4.1–4.8), Phân tích Customer Insight, Ecosystem SDK, Enterprise SSO, AI Personalization & Chu trình Release Cycles v1.0.1 → v2.0.
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/15 backdrop-blur-md shrink-0">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-400">LPEP</div>
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Product Evolution Partner</div>
            </div>
          </div>
        </div>

        {/* Global Production Readiness Meter */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Product Evolution Program Roadmap & Governance Lifecycle (LoveNote 1.0 → 2.0 Living Platform)</span>
            <span className="text-emerald-400 font-bold">100% Active LPEP Governance</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-10 gap-2 text-[10px]">
            <MeterItem label="4.1 STABILIZE" percentage={100} complete active />
            <MeterItem label="4.2 ANALYTICS" percentage={100} complete />
            <MeterItem label="4.3 PLAN 1.1" percentage={100} complete />
            <MeterItem label="4.4 ECOSYSTEM" percentage={100} complete />
            <MeterItem label="4.5 ENTERPRISE" percentage={100} complete />
            <MeterItem label="4.6 AI EVOLUTION" percentage={100} complete />
            <MeterItem label="4.7 PLATFORMS" percentage={100} complete />
            <MeterItem label="4.8 ARCH AUDIT" percentage={100} complete />
            <MeterItem label="GOVERNANCE" percentage={100} complete />
            <MeterItem label="AI PARTNER" percentage={100} complete />
          </div>
        </div>
      </div>

      {/* Global Unified Knowledge Search & Version Selector */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm LPEP phases, analytics, ecosystem, enterprise, AI evolution hoặc governance..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
            <GitBranch size={14} className="text-rose-600" /> Program Mode:
          </span>
          <select 
            value={docVersion} 
            onChange={e => setDocVersion(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
          >
            <option value="1.0">LoveNote LPEP (Current Living Platform)</option>
            <option value="1.1">LoveNote 1.1 (Productivity Release)</option>
            <option value="1.2">LoveNote 1.2 (Ecosystem Expansion)</option>
          </select>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 overflow-x-auto pb-1 scrollbar-none">
        <TabButton 
          active={activeTab === 'lpep_program'} 
          onClick={() => setActiveTab('lpep_program')} 
          label="1. Product Evolution (LPEP 4.1–4.8)" 
          icon={<Sparkles size={16} />} 
        />
        <TabButton 
          active={activeTab === 'ops_health'} 
          onClick={() => setActiveTab('ops_health')} 
          label="2. Live Health & Stabilization (4.1)" 
          icon={<Activity size={16} />} 
        />
        <TabButton 
          active={activeTab === 'feedback_loop'} 
          onClick={() => setActiveTab('feedback_loop')} 
          label="3. Customer Insight & Feedback (4.2)" 
          icon={<MessageSquare size={16} />} 
        />
        <TabButton 
          active={activeTab === 'release_train'} 
          onClick={() => setActiveTab('release_train')} 
          label="4. Release Train & Quality Gates (4.3)" 
          icon={<Rocket size={16} />} 
        />
        <TabButton 
          active={activeTab === 'tech_debt_backlog'} 
          onClick={() => setActiveTab('tech_debt_backlog')} 
          label="5. Evolution Architecture (4.4)" 
          icon={<Layers size={16} />} 
        />
        <TabButton 
          active={activeTab === 'p45_digital_org'} 
          onClick={() => setActiveTab('p45_digital_org')} 
          label="6. Digital Product Org (Phase 4.5)" 
          icon={<Building2 size={16} />} 
        />
        <TabButton 
          active={activeTab === 'ldef_business_org'} 
          onClick={() => setActiveTab('ldef_business_org')} 
          label="7. LDEF Business & Ecosystem (Phase 5.1)" 
          icon={<Briefcase size={16} />} 
        />
        <TabButton 
          active={activeTab === 'ldef_cpec_evolution'} 
          onClick={() => setActiveTab('ldef_cpec_evolution')} 
          label="8. LDEF Phase 5.2 CPEC & Freeze" 
          icon={<RotateCcw size={16} />} 
        />
        <TabButton 
          active={activeTab === 'roadmap_governance'} 
          onClick={() => setActiveTab('roadmap_governance')} 
          label="8. AI Evolution & Governance (4.6–4.8)" 
          icon={<Compass size={16} />} 
        />
        <TabButton 
          active={activeTab === 'uat_pilot'} 
          onClick={() => setActiveTab('uat_pilot')} 
          label="9. Pilot Cohorts & UAT (Archive)" 
          icon={<Users size={16} />} 
        />
        <TabButton 
          active={activeTab === 'readiness_review'} 
          onClick={() => setActiveTab('readiness_review')} 
          label="10. Commercial Release Sign-Off" 
          icon={<ShieldCheck size={16} />} 
        />
        <TabButton 
          active={activeTab === 'user_guides'} 
          onClick={() => setActiveTab('user_guides')} 
          label="11. Knowledge Center & Dev Portal" 
          icon={<BookOpen size={16} />} 
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: LOVE NOTE PRODUCT EVOLUTION PROGRAM (LPEP 4.1 TO 4.8) */}
        {activeTab === 'lpep_program' && (
          <motion.div key="lpep_program_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {/* Transition Philosophy Banner */}
            <div className="p-8 bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white rounded-3xl border border-rose-500/30 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                  <Sparkles size={16} /> LPCP Completion → LPEP Product Evolution Shift
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
                  Continuous Product Governance
                </span>
              </div>

              <div className="space-y-2">
                <Typography variant="h3" className="text-white tracking-tight">
                  "Một dự án kết thúc khi phát hành. Một sản phẩm bắt đầu khi phát hành."
                </Typography>
                <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
                  Từ điểm Go-Live bản 1.0, LoveNote chính thức chuyển từ mô hình "Dự án phát triển ngắn hạn" sang <span className="text-amber-400 font-bold">"Sản phẩm Sống (Living Product)"</span>. Mọi thay đổi không dựa trên ý muốn cảm tính mà tuân theo Chu trình Quản trị Sản phẩm liên tục (Product Governance Loop).
                </p>
              </div>

              {/* Continuous Product Governance Loop Diagram */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chu Trình Quản Trị Sản Phẩm Bền Vững (Governance Continuous Loop)</span>
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 text-center text-[10px] font-bold">
                  <div className="p-2.5 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30">1. Feedback</div>
                  <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">2. Analysis</div>
                  <div className="p-2.5 bg-yellow-500/20 text-yellow-300 rounded-xl border border-yellow-500/30">3. Roadmap</div>
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30">4. Design</div>
                  <div className="p-2.5 bg-cyan-500/20 text-cyan-300 rounded-xl border border-cyan-500/30">5. Dev</div>
                  <div className="p-2.5 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30">6. Testing</div>
                  <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-500/30">7. Release</div>
                  <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">8. Monitor</div>
                  <div className="p-2.5 bg-pink-500/20 text-pink-300 rounded-xl border border-pink-500/30 animate-pulse">9. Feedback ↺</div>
                </div>
              </div>
            </div>

            {/* LPEP 8-Phase Master Architecture Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="text-slate-900">LoveNote Product Evolution Roadmap (Phase 4.1 – 4.8)</Typography>
                  <Typography variant="body-sm" className="text-slate-500">
                    Lộ trình 8 Pha chuyển giao từ ổn định vận hành đến mở rộng hệ sinh thái & nâng cấp kiến trúc 10 năm.
                  </Typography>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                  8 Product Evolution Phases
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lpepPhases.map((phase) => (
                  <div key={phase.phaseId} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-rose-400 transition-all space-y-4 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">
                          {phase.phaseName.split('–')[0].trim()}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                          <Clock size={12} className="text-rose-500" /> {phase.timeframe}
                        </span>
                      </div>

                      <Typography variant="h4" className="text-slate-900">{phase.phaseName.split('–')[1] || phase.phaseName}</Typography>
                      <p className="text-xs text-rose-600 font-bold">{phase.tagline}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{phase.objective}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Chỉ số & Kết quả bàn giao chính</span>
                      <ul className="space-y-1.5">
                        {phase.keyDeliverablesOrMetrics.map((item, idx) => (
                          <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Strategic Outcome:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">{phase.strategicOutcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Studio Role as Product Evolution Partner */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                  <BrainCircuit size={18} /> Vai Trò AI Studio Trong Chương Trình LPEP
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
                  AI Product Development Partner
                </span>
              </div>

              <Typography variant="h4" className="text-white">
                AI Studio: Từ công cụ sinh mã nguồn (Code Generator) thành Đối tác Phát triển Sản phẩm (Product Partner)
              </Typography>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trong giai đoạn LPEP, AI Studio không chỉ nhận lệnh viết thêm mã, mà đồng hành cùng đội ngũ qua 7 năng lực quản trị cốt lõi:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <span className="font-bold text-rose-400 block">1. User Feedback Analysis</span>
                  <p className="text-[11px] text-slate-300">Phân tích ticket, gom nhóm vấn đề UX & đề xuất giải pháp cải tiến.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <span className="font-bold text-amber-400 block">2. Roadmap Proposals</span>
                  <p className="text-[11px] text-slate-300">Gợi ý lộ trình v1.1, v1.2 dựa vào dữ liệu đo lường hành vi người dùng.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <span className="font-bold text-emerald-400 block">3. Regression Testing</span>
                  <p className="text-[11px] text-slate-300">Kiểm tra khả năng tương thích ngược & đảm bảo Quality Gates trước release.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <span className="font-bold text-cyan-400 block">4. Performance & Battery</span>
                  <p className="text-[11px] text-slate-300">Đánh giá thời gian phản hồi AI, dung lượng bộ nhớ & thời lượng pin.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <span className="font-bold text-indigo-400 block">5. UX & Accessibility Audit</span>
                  <p className="text-[11px] text-slate-300">Rà soát chuẩn WCAG AA, font scaling Senior Mode & touch targets.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                  <span className="font-bold text-purple-400 block">6. Release Support</span>
                  <p className="text-[11px] text-slate-300">Tự động soạn Release Notes, FAQ & hướng dẫn sử dụng nâng cấp.</p>
                </div>
                <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1 col-span-1 sm:col-span-2">
                  <span className="font-bold text-pink-400 block">7. Tech Debt Management</span>
                  <p className="text-[11px] text-slate-300">Rà soát mã nguồn định kỳ, tái cấu trúc hook & duy trì ngân sách Tech Debt 15-20% per Release.</p>
                </div>
              </div>
            </div>

            {/* Release Cycles & Product Analytics Insights Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Analytics Highlights */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="h4" className="text-slate-900">Customer Insight & Feature Usage (Phase 4.2)</Typography>
                  <BarChart2 size={18} className="text-rose-600" />
                </div>
                <div className="space-y-3">
                  {lpepAnalytics.map((insight, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{insight.metricLabel}</span>
                        <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">{insight.measuredData}</span>
                      </div>
                      <p className="text-xs text-slate-600">{insight.dataInsight}</p>
                      <span className="text-[11px] text-emerald-700 font-medium block">➔ Tác động Roadmap: {insight.roadmapImpact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Release Cycle Strategy */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="h4" className="text-slate-900">LoveNote Release Cycles Architecture</Typography>
                  <Rocket size={18} className="text-rose-600" />
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-rose-900">
                      <span>LoveNote 1.0.1 (Hotfix & Stabilization)</span>
                      <span className="px-2 py-0.5 bg-rose-200 text-rose-900 text-[10px] rounded-md">Vá Lỗi Nhẹ</span>
                    </div>
                    <p className="text-slate-700">Tập trung sửa lỗi khẩn cấp, vá bảo mật nhỏ & duy trì crash rate &lt; 0.05%.</p>
                  </div>

                  <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-amber-900">
                      <span>LoveNote 1.1 (Productivity Enhancement)</span>
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] rounded-md">Chu kỳ 2-3 tuần</span>
                    </div>
                    <p className="text-slate-700">Bổ sung 12 layout album, tối ưu AI Card Polish, căn lề in Print Studio chuẩn nhà in.</p>
                  </div>

                  <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-900">
                      <span>LoveNote 1.2 (Creative Expansion & Ecosystem)</span>
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] rounded-md">Chu kỳ 1-2 tháng</span>
                    </div>
                    <p className="text-slate-700">Mở SDK Plugin Marketplace, Theme Marketplace & Smart Template AI gợi ý.</p>
                  </div>

                  <div className="p-3.5 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-1">
                    <div className="flex items-center justify-between font-bold text-indigo-900">
                      <span>LoveNote 2.0 (Intelligent Collaboration Platform)</span>
                      <span className="px-2 py-0.5 bg-indigo-200 text-indigo-900 text-[10px] rounded-md">Chu kỳ 6-12 tháng</span>
                    </div>
                    <p className="text-slate-700">AI Agent tự ghi nhớ lịch kỷ niệm, Voice Notes cảm xúc, Real-time Family Canvas.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LPEP PHASE 4.1 – OPERATIONAL EXCELLENCE & PRODUCT GOVERNANCE SECTION */}
            <div className="pt-8 border-t border-slate-200 space-y-8">
              
              {/* EXECUTIVE PRODUCT DASHBOARD (EPD) – EXECUTIVE C-LEVEL & FOUNDER VIEW */}
              <div className="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-white rounded-3xl border border-rose-500/30 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-1">
                      <ShieldCheck size={16} /> LPEP Phase 4.1 • Executive Product Dashboard (EPD)
                    </div>
                    <Typography variant="h3" className="text-white font-mono tracking-tight">
                      LoveNote Executive Product Dashboard & Strategic Control
                    </Typography>
                    <Typography variant="body-sm" className="text-slate-300 mt-1">
                      Tầng quản trị cấp cao dành cho Product Lead & Founder – Giám sát 10-15 chỉ số chiến lược quan trọng nhất của sản phẩm.
                    </Typography>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-900/90 rounded-2xl border border-emerald-500/40 text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">HEALTH SCORE</div>
                      <div className="text-2xl font-black text-emerald-400 font-mono">{lpepExecutiveDashboard.productHealthScore}</div>
                      <div className="text-[9px] text-emerald-300 font-bold">EXCELLENT</div>
                    </div>
                    <div className="px-4 py-2 bg-slate-900/90 rounded-2xl border border-amber-500/40 text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">RELEASE QUALITY</div>
                      <div className="text-2xl font-black text-amber-400 font-mono">{lpepExecutiveDashboard.releaseQualityIndex}</div>
                      <div className="text-[9px] text-amber-300 font-bold">RQI GA CERTIFIED</div>
                    </div>
                  </div>
                </div>

                {/* 10 Strategic Metric Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Active Stickiness</span>
                    <span className="text-emerald-400 font-bold text-sm block">{lpepExecutiveDashboard.activeUsersDauMau}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">D30 Retention</span>
                    <span className="text-emerald-400 font-bold text-sm block">{lpepExecutiveDashboard.retentionD30}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Customer Rating</span>
                    <span className="text-emerald-400 font-bold text-sm block">{lpepExecutiveDashboard.customerSatisfactionCsat}</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Innovation Pipeline</span>
                    <span className="text-cyan-400 font-bold text-sm block">{lpepExecutiveDashboard.innovationPipelineProgress}% Progress</span>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase block">Tech Debt Budget</span>
                    <span className="text-amber-400 font-bold text-sm block">{lpepExecutiveDashboard.technicalDebtRatio}% Budget</span>
                  </div>
                </div>

                {/* Top 5 Risks vs Top 5 Opportunities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-rose-500/30 space-y-2">
                    <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <AlertCircle size={14} /> Top 5 Rủi Ro Vận Hành & Kỹ Thuật (Top 5 Risks)
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {lpepExecutiveDashboard.top5Risks.map((risk, idx) => (
                        <li key={idx} className="leading-tight">{risk}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-2">
                    <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles size={14} /> Top 5 Cơ Hội Tăng Trưởng & Sản Phẩm (Top 5 Opportunities)
                    </span>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      {lpepExecutiveDashboard.top5Opportunities.map((opp, idx) => (
                        <li key={idx} className="leading-tight">{opp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* PRODUCT INTELLIGENCE LAYER & STRATEGIC PRODUCT ADVISOR */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Product Intelligence Layer</div>
                    <Typography variant="h3" className="text-slate-900">Production Insights & AI Strategic Advisor</Typography>
                    <Typography variant="body-sm" className="text-slate-500">
                      Tự động phân tích lý do sâu xa ("Why?") đằng sau biến động dữ liệu thực tế và đưa ra đề xuất chiến lược chủ động ("What Next?").
                    </Typography>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <BrainCircuit size={14} /> Strategic Advisor Active
                  </span>
                </div>

                {/* Production Insights "Why?" & "What Next?" Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {lpepProductInsights.map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-900">{item.metric}</span>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md font-mono text-[11px]">{item.trendChange}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium"><strong className="text-slate-900">Nguyên nhân (Why):</strong> {item.reason}</p>
                      <p className="text-[11px] text-indigo-700 bg-indigo-50 p-2 rounded-xl border border-indigo-100"><strong className="text-indigo-900">Hành động tiếp (What next):</strong> {item.strategicImpact}</p>
                    </div>
                  ))}
                </div>

                {/* AI Studio Proactive Recommendations Banner */}
                <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-500/30 space-y-3">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles size={15} /> Khuyến Nghị Chiến Lược Chủ Động Từ AI Studio (Proactive AI Recommendations)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {lpepStrategicRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-rose-400">{rec.metricTrigger}</span>
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded">{rec.priority}</span>
                        </div>
                        <p className="text-slate-200 font-bold leading-tight">{rec.riskOrOpportunityDetected}</p>
                        <p className="text-[11px] text-emerald-300">➔ Đề xuất AI: {rec.aiRecommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PRODUCT DECISION LOG (ADR / PRODUCT DECISION LOG) */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Product Knowledge Asset</div>
                    <Typography variant="h3" className="text-slate-900">Product Decision Log (ADR & Feature Outcomes)</Typography>
                    <Typography variant="body-sm" className="text-slate-500">
                      Nhật ký quyết định sản phẩm: Lưu trữ lý do đưa ra tính năng, kết quả kỳ vọng và kết quả thực tế thu được.
                    </Typography>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-full">3 Decision Records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="p-3">Mã Quyết Định</th>
                        <th className="p-3">Tên Quyết Định Cải Tiến</th>
                        <th className="p-3">Lý Do Đưa Ra (Reason)</th>
                        <th className="p-3">Kết Quả Kỳ Vọng (Expected)</th>
                        <th className="p-3">Kết Quả Thực Tế (Actual)</th>
                        <th className="p-3 text-right">Trạng Thái Thẩm Định</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lpepDecisionLogs.map((log) => (
                        <tr key={log.decisionId} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-800">{log.decisionId}</td>
                          <td className="p-3 font-bold text-slate-900">{log.decisionTitle}</td>
                          <td className="p-3 text-slate-600">{log.reason}</td>
                          <td className="p-3 text-amber-700 font-medium">{log.expectedResult}</td>
                          <td className="p-3 font-bold text-emerald-700">{log.actualResult}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              log.status === 'Validated Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODULE 1 – PRODUCT GOVERNANCE BOARD */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 1</div>
                    <Typography variant="h3" className="text-slate-900">Product Governance Board</Typography>
                    <Typography variant="body-sm" className="text-slate-500">
                      Thiết lập "Hội đồng sản phẩm". Mọi yêu cầu tính năng mới đều phải qua quy trình kiểm duyệt 6 bước minh bạch.
                    </Typography>
                  </div>
                  <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full">6-Step Governance Pipeline</span>
                </div>

                {/* Step-by-Step Governance Workflow Diagram */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Quy Trình Duyệt Tính Năng (Feature Review Flow)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs font-bold">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
                      <span className="text-slate-400 text-[10px] block">Bước 1</span>
                      <span className="text-slate-800 block">Feature Request</span>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 space-y-1 text-rose-900">
                      <span className="text-rose-500 text-[10px] block">Bước 2</span>
                      <span className="block">Product Review</span>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1 text-amber-900">
                      <span className="text-amber-500 text-[10px] block">Bước 3</span>
                      <span className="block">Technical Review</span>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1 text-indigo-900">
                      <span className="text-indigo-500 text-[10px] block">Bước 4</span>
                      <span className="block">UX Review</span>
                    </div>
                    <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-200 space-y-1 text-cyan-900">
                      <span className="text-cyan-500 text-[10px] block">Bước 5</span>
                      <span className="block">Priority Score</span>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1 text-emerald-900 font-black">
                      <span className="text-emerald-600 text-[10px] block">Bước 6</span>
                      <span className="block">Roadmap Enforced</span>
                    </div>
                  </div>
                </div>

                {/* Active Governance Queue Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="p-3">Feature ID</th>
                        <th className="p-3">Tên Yêu Cầu Tính Năng</th>
                        <th className="p-3">Giai Đoạn Duyệt</th>
                        <th className="p-3 text-center">Impact (1-10)</th>
                        <th className="p-3 text-center">Effort (1-10)</th>
                        <th className="p-3 text-center">Priority Score</th>
                        <th className="p-3 text-right">Trạng Thái Quyết Định</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lpepGovBoard.map((item) => (
                        <tr key={item.featureId} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-800">{item.featureId}</td>
                          <td className="p-3 font-bold text-slate-900">{item.title}</td>
                          <td className="p-3">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-[11px]">
                              {item.reviewStage}
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-emerald-600">{item.impactScore} / 10</td>
                          <td className="p-3 text-center font-bold text-slate-600">{item.effortScore} / 10</td>
                          <td className="p-3 text-center font-mono font-black text-rose-600 text-sm">{item.priorityScore}</td>
                          <td className="p-3 text-right">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              item.decisionStatus === 'Approved for v1.1' ? 'bg-emerald-100 text-emerald-800' :
                              item.decisionStatus === 'In Tech Review' ? 'bg-amber-100 text-amber-800' :
                              item.decisionStatus === 'In UX Evaluation' ? 'bg-indigo-100 text-indigo-800' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {item.decisionStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODULE 2 – PRODUCT KPI DASHBOARD (INCL. OPERATIONAL KPI) */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 2</div>
                    <Typography variant="h3" className="text-slate-900">Product KPI Dashboard (4 Categories)</Typography>
                    <Typography variant="body-sm" className="text-slate-500">
                      Đo lường toàn bộ sức khỏe sản phẩm qua 4 nhóm chỉ số: Business, Technical, UX & Operational KPI.
                    </Typography>
                  </div>
                  <BarChart2 size={20} className="text-rose-600" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Business KPI */}
                  <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-200/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                      <span className="font-bold text-rose-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Users size={14} /> Business KPI
                      </span>
                      <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">5 Metrics</span>
                    </div>
                    <div className="space-y-2">
                      {lpepProductKpis.filter(k => k.category === 'Business KPI').map((kpi, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-xl border border-rose-100 space-y-0.5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span>{kpi.metricName}</span>
                            <span className="text-rose-600">{kpi.currentValue}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Target: {kpi.targetValue}</span>
                            <span className="text-emerald-600 font-bold">✓ {kpi.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technical KPI */}
                  <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Cpu size={14} /> Technical KPI
                      </span>
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">5 Metrics</span>
                    </div>
                    <div className="space-y-2">
                      {lpepProductKpis.filter(k => k.category === 'Technical KPI').map((kpi, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-xl border border-amber-100 space-y-0.5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span>{kpi.metricName}</span>
                            <span className="text-amber-600 font-mono">{kpi.currentValue}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Target: {kpi.targetValue}</span>
                            <span className="text-emerald-600 font-bold">✓ {kpi.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* UX KPI */}
                  <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="font-bold text-emerald-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Smile size={14} /> UX KPI
                      </span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">5 Metrics</span>
                    </div>
                    <div className="space-y-2">
                      {lpepProductKpis.filter(k => k.category === 'UX KPI').map((kpi, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-xl border border-emerald-100 space-y-0.5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span>{kpi.metricName}</span>
                            <span className="text-emerald-600 font-bold">{kpi.currentValue}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Target: {kpi.targetValue}</span>
                            <span className="text-emerald-600 font-bold">✓ {kpi.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational KPI */}
                  <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-200/60 space-y-3">
                    <div className="flex items-center justify-between border-b border-indigo-200 pb-2">
                      <span className="font-bold text-indigo-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck size={14} /> Operational KPI
                      </span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded-full">5 Metrics</span>
                    </div>
                    <div className="space-y-2">
                      {lpepProductKpis.filter(k => k.category === 'Operational KPI').map((kpi, idx) => (
                        <div key={idx} className="p-2 bg-white rounded-xl border border-indigo-100 space-y-0.5">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                            <span>{kpi.metricName}</span>
                            <span className="text-indigo-600 font-bold">{kpi.currentValue}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Target: {kpi.targetValue}</span>
                            <span className="text-emerald-600 font-bold">✓ {kpi.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* MODULE 3 & MODULE 4 GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* MODULE 3 – FEATURE LIFECYCLE MANAGER (INCL. RETIRE -> ARCHIVE) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 3</div>
                      <Typography variant="h4" className="text-slate-900">Feature Lifecycle Manager (9 Stages)</Typography>
                    </div>
                    <RefreshCw size={18} className="text-rose-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Vòng đời 9 bước: Idea ➔ Research ➔ Prototype ➔ Development ➔ Beta ➔ Release ➔ Improve ➔ Retire ➔ <strong>Archive</strong>.
                  </p>

                  <div className="space-y-2">
                    {lpepLifecycles.map((lifecycle, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{lifecycle.featureName}</span>
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-md">{lifecycle.valueTag}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{lifecycle.actionNote}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                          lifecycle.stage === 'Release' ? 'bg-emerald-100 text-emerald-800' :
                          lifecycle.stage === 'Improve' ? 'bg-indigo-100 text-indigo-800' :
                          lifecycle.stage === 'Retire' ? 'bg-rose-100 text-rose-800' :
                          lifecycle.stage === 'Archive' ? 'bg-slate-800 text-slate-100' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {lifecycle.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 4 – TECHNICAL DEBT REGISTER (WITH INTEREST SCORE & COST DAYS) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 4</div>
                      <Typography variant="h4" className="text-slate-900">Technical Debt Register (Interest Score)</Typography>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                      15–20% Release Budget
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Sổ nợ kỹ thuật bổ sung <strong>Chi Phí Trả Nợ (Days)</strong> & <strong>Interest Score (Lãi Suất Nợ)</strong> để AI ưu tiên trả nợ nguy hiểm trước.
                  </p>

                  <div className="space-y-2.5">
                    {lpepTechDebts.map((debt, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <AlertCircle size={13} className="text-amber-500" /> {debt.debtType}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-900 text-[10px] font-bold rounded-md">
                              Chi phí: {debt.costDays} ngày
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              debt.interestScore === 'High Interest' ? 'bg-rose-600 text-white' :
                              debt.interestScore === 'Medium Interest' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {debt.interestScore}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700">{debt.description}</p>
                        <p className="text-[11px] text-emerald-700 font-medium">➔ Khắc phục: {debt.mitigationPlan}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* MODULE 5 – PRODUCT HEALTH SCORE CALCULATOR (WITH HISTORICAL TREND TIMELINE) */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 5</div>
                    <Typography variant="h3" className="text-slate-900">Product Health Score Calculator & Timeline Trend</Typography>
                    <Typography variant="body-sm" className="text-slate-500">
                      Tính điểm sức khỏe sản phẩm có trọng số & theo dõi xu hướng phát triển theo thời gian (Historical Trend).
                    </Typography>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-md text-center shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-100">CURRENT HEALTH SCORE</span>
                    <span className="text-3xl font-black font-mono">96.4 / 100</span>
                    <span className="text-xs font-bold text-emerald-200 block mt-0.5">EXCELLENT STATUS</span>
                  </div>
                </div>

                {/* Historical Health Score Trend Line */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Lịch Sử & Mục Tiêu Điểm Sức Khỏe Qua Các Phiên Bản (Health Trend Timeline)</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    {lpepHealthTrends.map((tr, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                        <span className="text-[10px] text-slate-500 block">{tr.version}</span>
                        <span className="text-xl font-black text-emerald-600 block">{tr.score}</span>
                        <span className="text-[10px] font-bold text-slate-700 uppercase block">{tr.rating} ({tr.releaseDate})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <th className="p-3">Hạng Mục Đánh Giá</th>
                        <th className="p-3 text-center">Trọng Số (%)</th>
                        <th className="p-3 text-center">Điểm Thô (100)</th>
                        <th className="p-3 text-center">Điểm Quy Đổi</th>
                        <th className="p-3">Ghi Chú Thực Tế</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lpepHealthBreakdowns.map((hb, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{hb.category}</td>
                          <td className="p-3 text-center font-bold text-slate-600">{hb.weightPercentage}%</td>
                          <td className="p-3 text-center font-mono font-bold text-slate-800">{hb.rawScore}</td>
                          <td className="p-3 text-center font-mono font-black text-emerald-600 text-sm">{hb.weightedScore.toFixed(2)}</td>
                          <td className="p-3 text-slate-600">{hb.notes}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50 font-black text-emerald-950 border-t-2 border-emerald-300">
                        <td className="p-3">TỔNG ĐIỂM PRODUCT HEALTH SCORE</td>
                        <td className="p-3 text-center">100%</td>
                        <td className="p-3 text-center font-mono">–</td>
                        <td className="p-3 text-center font-mono text-base text-emerald-700">96.40</td>
                        <td className="p-3 text-emerald-800">KPI Đạt Chuẩn Xuất Sắc (Target ≥ 90.0)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MODULE 6 & MODULE 7 GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* MODULE 6 – VOICE OF CUSTOMER (VoC) & SENTIMENT ANALYSIS */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 6</div>
                      <Typography variant="h4" className="text-slate-900">Voice of Customer & Sentiment Analysis</Typography>
                    </div>
                    <MessageSquare size={18} className="text-rose-600" />
                  </div>

                  {/* Sentiment Bar */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>Chỉ Số Cảm Cảm Nhận Người Dùng (Sentiment)</span>
                      <span className="text-emerald-600 font-mono">72% Positive</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex text-[9px] font-bold text-white text-center">
                      <div style={{ width: `${lpepVocSentiment.positivePercent}%` }} className="bg-emerald-500 h-full flex items-center justify-center">72% Positive</div>
                      <div style={{ width: `${lpepVocSentiment.neutralPercent}%` }} className="bg-slate-400 h-full flex items-center justify-center">19% Neutral</div>
                      <div style={{ width: `${lpepVocSentiment.negativePercent}%` }} className="bg-rose-500 h-full flex items-center justify-center">9% Neg</div>
                    </div>
                    <div className="pt-1 text-[11px] text-slate-600 font-medium">
                      <strong>Top Pain Points:</strong> {lpepVocSentiment.topPainPoints.join(' | ')}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {lpepVocCategories.map((voc, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-900">{voc.category}</span>
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md text-[10px]">{voc.count} Phản Hồi</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-tight">{voc.aiClusterTrend}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 7 – RELEASE QUALITY INDEX (RQI) & RELEASE CONFIDENCE */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 7</div>
                      <Typography variant="h4" className="text-slate-900">Release Quality Index & Go/No-Go Decision</Typography>
                    </div>
                    <Award size={20} className="text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Chỉ số đo lường chất lượng thương mại & <strong>Release Confidence</strong> phục vụ cuộc họp Go/No-Go Meeting.
                  </p>

                  <div className="p-5 bg-gradient-to-r from-slate-900 to-rose-950 text-white rounded-2xl border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-2">
                      <span className="text-amber-300 font-bold">{lpepRqi.releaseVersion}</span>
                      <span className="px-2.5 py-0.5 bg-emerald-500 text-white rounded-md font-black">{lpepRqi.goNoGoStatus}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-slate-800/80 rounded-lg flex justify-between">
                        <span className="text-slate-400">Crash Rate Score:</span>
                        <span className="text-emerald-400 font-bold">{lpepRqi.crashScore}%</span>
                      </div>
                      <div className="p-2 bg-slate-800/80 rounded-lg flex justify-between">
                        <span className="text-slate-400">Performance:</span>
                        <span className="text-emerald-400 font-bold">{lpepRqi.performanceScore}%</span>
                      </div>
                      <div className="p-2 bg-slate-800/80 rounded-lg flex justify-between">
                        <span className="text-slate-400">UX Consistency:</span>
                        <span className="text-emerald-400 font-bold">{lpepRqi.uxScore}%</span>
                      </div>
                      <div className="p-2 bg-slate-800/80 rounded-lg flex justify-between">
                        <span className="text-slate-400">Release Confidence:</span>
                        <span className="text-amber-400 font-bold">{lpepRqi.releaseConfidencePercent}%</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">TỔNG ĐIỂM RQI INDEX</span>
                      <span className="text-2xl font-black font-mono text-amber-400">{lpepRqi.rqiTotalScore} / 100</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* MODULE 8 – CONTINUOUS IMPROVEMENT ENGINE */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 8</div>
                    <Typography variant="h3" className="text-slate-900">Continuous Improvement Engine Report</Typography>
                    <Typography variant="body-sm" className="text-slate-500">
                      Báo cáo định kỳ hàng tháng tự động tổng hợp Top 10 lỗi, yêu cầu & đề xuất cải tiến làm đầu vào Roadmap.
                    </Typography>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">Monthly Auto Generator</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Top Bugs */}
                  <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200/80 space-y-2">
                    <span className="font-bold text-rose-900 text-xs block border-b border-rose-200 pb-1">Top Lỗi Cần Vá</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      {lpepContinuousReport.top10Bugs.map((bug, idx) => (
                        <li key={idx} className="leading-tight">{bug}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Top Requests */}
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                    <span className="font-bold text-amber-900 text-xs block border-b border-amber-200 pb-1">Top Yêu Cầu Người Dùng</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      {lpepContinuousReport.top10Requests.map((req, idx) => (
                        <li key={idx} className="leading-tight">{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Top Underused */}
                  <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/80 space-y-2">
                    <span className="font-bold text-indigo-900 text-xs block border-b border-indigo-200 pb-1">Top Tính Năng Ít Dùng</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      {lpepContinuousReport.top10Underused.map((und, idx) => (
                        <li key={idx} className="leading-tight">{und}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Top Improvements */}
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2">
                    <span className="font-bold text-emerald-900 text-xs block border-b border-emerald-200 pb-1">Top Đề Xuất Cải Tiến</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-700">
                      {lpepContinuousReport.top10ProposedImprovements.map((imp, idx) => (
                        <li key={idx} className="leading-tight">{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* MODULE 9 & MODULE 10 GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* MODULE 9 – AI STUDIO DELIVERABLES (PRODUCT ENGINEERING PARTNER & STRATEGIC ADVISOR) */}
                <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Module 9</div>
                      <Typography variant="h4" className="text-white">AI Studio Product Engineering Deliverables</Typography>
                    </div>
                    <BrainCircuit size={20} className="text-amber-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    Trước mỗi phiên bản (1.0.1, 1.1, 1.2...), AI Studio tự động chuẩn bị 6 tài liệu chiến lược làm đối tác phát triển sản phẩm:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">1. Product Health Report</span>
                        <span className="text-[11px] text-slate-400">Báo cáo sức khỏe sản phẩm toàn diện</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">2. Risk Mitigation List</span>
                        <span className="text-[11px] text-slate-400">Danh sách rủi ro vận hành & bảo mật</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">3. Tech Debt Assessment</span>
                        <span className="text-[11px] text-slate-400">Đánh giá & phân bổ ngân sách 15-20% Tech Debt</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">4. VoC Sentiment Analysis</span>
                        <span className="text-[11px] text-slate-400">Phân tích phản hồi & xu hướng người dùng</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">5. Impact/Effort Priority Matrix</span>
                        <span className="text-[11px] text-slate-400">Ma trận ưu tiên RICE/Impact-Effort Score</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block">6. Release Quality Checklist</span>
                        <span className="text-[11px] text-slate-400">Bảng kiểm Quality Gates trước khi phát hành</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODULE 10 – DEFINITION OF DONE CHECKLIST */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 10</div>
                      <Typography variant="h4" className="text-slate-900">Definition of Done (Phase 4.1 Certification)</Typography>
                    </div>
                    <ShieldCheck size={20} className="text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Phase 4.1 được công nhận hoàn thành khi đạt đủ 6 tiêu chí bàn giao dưới đây:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 1. Có Executive Product Dashboard Quản Trị C-Level</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">COMPLETED</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 2. Mọi Tính Năng Mới Đều Qua Product Governance Flow</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">ENFORCED</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 3. Tích Hợp Product Intelligence Layer & Decision Log</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">ACTIVE</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 4. Quản Lý Ngân Sách Technical Debt & Interest Score (15-20%)</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">REGISTERED</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 5. Lập Roadmap Dựa Trên Dữ Liệu Thực Tế & AI Strategic Advisor</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">DATA-DRIVEN</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> 6. AI Studio Tự Động Báo Cáo Định Kỳ Cho Đội Phát Triển</span>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">AUTOMATED</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* LPEP PHASE 4.2 – PRODUCT INTELLIGENCE & STRATEGIC DECISION SYSTEM */}
              <div className="pt-10 border-t-2 border-rose-500/30 space-y-8">

                {/* PHASE 4.2 BANNER HEADER */}
                <div className="p-8 bg-gradient-to-br from-slate-950 via-rose-950 to-slate-900 text-white rounded-3xl border border-rose-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-1">
                        <BrainCircuit size={18} /> LoveNote Product Evolution Program (LPEP) • Phase 4.2
                      </div>
                      <Typography variant="h2" className="text-white font-mono tracking-tight">
                        Product Intelligence & Strategic Decision System
                      </Typography>
                      <Typography variant="body-sm" className="text-slate-300 mt-1 max-w-3xl">
                        Hệ thống &quot;bộ não quản trị&quot; giúp LoveNote tự phân tích dữ liệu, phát hiện xu hướng và hỗ trợ ra quyết định chiến lược dựa trên bằng chứng định lượng.
                      </Typography>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-rose-500/30 text-right shrink-0">
                      <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">PHASE STATUS</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">PHASE 4.2 ACTIVE</div>
                      <div className="text-[10px] text-slate-300">Data-Driven Governance</div>
                    </div>
                  </div>

                  {/* TERMINAL STATUS BAR */}
                  <div className="p-5 bg-slate-950/90 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-rose-400 font-bold">
                      <span className="flex items-center gap-2"><Terminal size={14} /> 📊 LoveNote Product Evolution Dashboard Terminal</span>
                      <span>Version: 1.0.1 Stable</span>
                    </div>
                    <div className="space-y-1.5 pt-1 text-slate-300 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Operational Excellence</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/30">
                        <span className="w-48 text-rose-300 font-bold flex items-center gap-1">Product Intelligence <span className="text-amber-400">◀ ACTIVE FOCUS</span></span>
                        <span className="text-rose-400 font-bold">███████░░░ 70%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Strategic Governance</span>
                        <span className="text-sky-400 font-bold">██████░░░░ 60%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Innovation Readiness</span>
                        <span className="text-purple-400 font-bold">█████░░░░░ 50%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Platform Evolution</span>
                        <span className="text-slate-500 font-bold">███░░░░░░░ 30%</span>
                      </div>
                    </div>
                  </div>

                  {/* PHILOSOPHY CALLOUT */}
                  <div className="p-4 bg-rose-950/50 rounded-2xl border border-rose-500/40 flex items-start gap-3 text-xs">
                    <Sparkles size={20} className="text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-rose-200 text-sm">Triết Lý Quản Trị Sản Phẩm Phase 4.2</div>
                      <p className="text-slate-300 mt-1">
                        Không phát triển vì chúng ta nghĩ người dùng cần. Mà phát triển vì: Dữ liệu đã chứng minh người dùng cần. Mọi quyết định tiến hóa sản phẩm đều dựa trên bằng chứng định lượng.
                      </p>
                    </div>
                  </div>
                </div>

                {/* MODULE 1 – EXECUTIVE PRODUCT DASHBOARD (EPD) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 1</div>
                      <Typography variant="h3" className="text-slate-900">Executive Product Dashboard (EPD) - C-Level & CEO View</Typography>
                    </div>
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-bold font-mono">15 Strategic KPIs</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lpepEpdMetrics.map((kpi, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-rose-300 transition-all space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">{kpi.metricName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            kpi.status === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                            kpi.status === 'High' ? 'bg-sky-100 text-sky-800' :
                            kpi.status === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                          }`}>{kpi.status}</span>
                        </div>
                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-xl font-bold font-mono text-slate-900">{kpi.value}</span>
                          <span className="text-xs font-bold font-mono text-emerald-600 flex items-center gap-0.5">
                            <TrendingUp size={12} /> {kpi.trend}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">{kpi.category}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 2 – PRODUCT INTELLIGENCE ENGINE (EXPLAINABILITY) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 2</div>
                      <Typography variant="h3" className="text-slate-900">Product Intelligence Engine (Explainability & Insights)</Typography>
                    </div>
                    <BrainCircuit size={20} className="text-rose-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    AI tự động phân tích hành vi người dùng hàng ngày. Không chỉ dừng lại ở số thống kê thô mà chủ động giải thích nguyên nhân (&quot;Why?&quot;) và đưa ra khuyến nghị hành động cụ thể kèm mức độ tin cậy.
                  </p>

                  <div className="space-y-3">
                    {lpepIntelligenceEngine.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded-lg">{item.featureMetric}</span>
                            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                              item.changeTrend.includes('↑') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>{item.changeTrend}</span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                            <span>Confidence Level:</span>
                            <span className="font-bold text-indigo-600">{item.confidencePercent}%</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                          <div>
                            <span className="font-bold text-slate-700 block mb-0.5">🔍 Lý Do Nguyên Nhân (Reasoning):</span>
                            <p className="text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100">{item.reason}</p>
                          </div>
                          <div>
                            <span className="font-bold text-rose-700 block mb-0.5">💡 Khuyến Nghị Hành Động (Recommendation):</span>
                            <p className="text-slate-800 font-medium bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">{item.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 3 – DECISION INTELLIGENCE REPOSITORY */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 3</div>
                      <Typography variant="h3" className="text-slate-900">Decision Intelligence Repository (Historical Learning Loop)</Typography>
                    </div>
                    <FileText size={20} className="text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Mọi quyết định sản phẩm đều được ghi nhận vào kho lưu trữ, đối chiếu giữa kết quả kỳ vọng và thực tế để AI học tập từ lịch sử quản trị.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Decision</th>
                          <th className="p-3">Reason</th>
                          <th className="p-3">Expected</th>
                          <th className="p-3">Actual Result</th>
                          <th className="p-3">AI Learning Note</th>
                          <th className="p-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lpepDecisionIntelligenceLogs.map((log) => (
                          <tr key={log.decisionId} className="hover:bg-slate-50/80">
                            <td className="p-3 font-bold text-slate-900 font-mono">{log.decisionTitle}</td>
                            <td className="p-3 text-slate-600">{log.reason}</td>
                            <td className="p-3 text-slate-600">{log.expectedResult}</td>
                            <td className="p-3 font-bold text-emerald-700 font-mono">{log.actualResult}</td>
                            <td className="p-3 text-slate-500 italic text-[11px]">{log.aiLearningNote}</td>
                            <td className="p-3 text-right">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">{log.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MODULE 4 & MODULE 5 – RISK RADAR & OPPORTUNITY DISCOVERY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* MODULE 4 – PRODUCT RISK RADAR */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 4</div>
                        <Typography variant="h3" className="text-slate-900">Product Risk Radar (Proactive Predictive Alerts)</Typography>
                      </div>
                      <AlertTriangle size={20} className="text-amber-600" />
                    </div>
                    <p className="text-xs text-slate-600">
                      AI chủ động cảnh báo các nguy cơ tiềm ẩn trước khi trở thành sự cố gián đoạn trải nghiệm.
                    </p>

                    <div className="space-y-3">
                      {lpepRiskRadar.map((risk, idx) => (
                        <div key={idx} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <AlertCircle size={14} className="text-amber-600" /> {risk.riskArea}
                            </span>
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] font-bold font-mono">{risk.currentMetric}</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <p className="text-slate-700"><strong>Dự Báo AI:</strong> {risk.predictedIssue}</p>
                            <p className="text-amber-900 font-medium"><strong>Khuyến Nghị Phòng Ngừa:</strong> {risk.proactiveRecommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE 5 – OPPORTUNITY DISCOVERY ENGINE */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 5</div>
                        <Typography variant="h3" className="text-slate-900">Opportunity Discovery Engine</Typography>
                      </div>
                      <Compass size={20} className="text-emerald-600" />
                    </div>
                    <p className="text-xs text-slate-600">
                      Tự động phát hiện các tập người dùng &amp; hành vi mới có tiềm năng tăng trưởng vượt bậc.
                    </p>

                    <div className="space-y-3">
                      {lpepOpportunities.map((opp, idx) => (
                        <div key={idx} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <Sparkles size={14} className="text-emerald-600" /> {opp.segmentOrPattern}
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 rounded text-[10px] font-bold font-mono">{opp.growthSignal}</span>
                          </div>
                          <div className="text-xs space-y-1">
                            <p className="text-slate-700"><strong>Phát Hiện Telemetry:</strong> {opp.insightDescription}</p>
                            <p className="text-emerald-900 font-medium"><strong>Cơ Hội Phát Triển:</strong> {opp.aiRecommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* MODULE 6 – COMPETITIVE BENCHMARK REGISTER */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 6</div>
                      <Typography variant="h3" className="text-slate-900">Competitive Benchmark Register (Market Tracking)</Typography>
                    </div>
                    <Target size={20} className="text-purple-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Theo dõi điểm mạnh, điểm yếu &amp; xu hướng đối thủ. Mọi đề xuất tiếp thu đều đánh giá phân loại rõ ràng (YES, NO, LATER) kèm lý do lập luận.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lpepCompetitors.map((comp, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-bold text-slate-900 text-sm font-mono">{comp.competitorName}</span>
                          <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                            comp.shouldAdopt === 'YES' ? 'bg-emerald-200 text-emerald-900' :
                            comp.shouldAdopt === 'NO' ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-900'
                          }`}>
                            ADOPT: {comp.shouldAdopt}
                          </span>
                        </div>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          <p><strong>Điểm mạnh:</strong> {comp.strengths}</p>
                          <p><strong>Điểm yếu:</strong> {comp.weaknesses}</p>
                          <p><strong>Xu hướng:</strong> {comp.marketTrend}</p>
                          <div className="pt-2 border-t border-slate-200 text-slate-800 font-medium">
                            <strong>Lý do đánh giá:</strong> {comp.adoptionReasoning}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 7 – INNOVATION PORTFOLIO MANAGER */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 7</div>
                      <Typography variant="h3" className="text-slate-900">Innovation Portfolio Manager (5-Stage Pipeline)</Typography>
                    </div>
                    <Layers size={20} className="text-sky-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Phân loại ý tưởng mới qua 5 giai đoạn thẩm định nghiêm ngặt trước khi chính thức phê duyệt vào Roadmap sản phẩm.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {lpepInnovationPortfolio.map((idea, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              idea.stage === 'Explore' ? 'bg-indigo-100 text-indigo-800' :
                              idea.stage === 'Prototype' ? 'bg-sky-100 text-sky-800' :
                              idea.stage === 'Validate' ? 'bg-amber-100 text-amber-800' :
                              idea.stage === 'Roadmap' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}>{idea.stage}</span>
                            <span className="text-[10px] font-mono text-slate-400">Fit: {idea.strategicFitScore}%</span>
                          </div>
                          <span className="font-bold text-slate-900 text-xs block pt-1">{idea.ideaTitle}</span>
                          <p className="text-[11px] text-slate-600">{idea.description}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 font-mono">
                          {idea.stageMeaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 8 & MODULE 9 – FORECAST & QBR REPORT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* MODULE 8 – PRODUCT FORECAST & TREND ANALYZER */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 8</div>
                        <Typography variant="h3" className="text-slate-900">Product Forecast & Trend Analyzer</Typography>
                      </div>
                      <TrendingUp size={20} className="text-emerald-600" />
                    </div>

                    <div className="space-y-3 text-xs">
                      {lpepForecasts.map((fc, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{fc.forecastArea}</span>
                            <span className="text-indigo-600 font-mono">{fc.confidencePercent}% Confidence</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div className="p-2 bg-white rounded-xl border border-slate-100">
                              <span className="text-slate-400 block text-[9px]">CURRENT</span>
                              <span className="font-bold text-slate-800">{fc.currentValue}</span>
                            </div>
                            <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                              <span className="text-emerald-600 block text-[9px]">FORECAST 6M</span>
                              <span className="font-bold text-emerald-800">{fc.sixMonthForecast}</span>
                            </div>
                          </div>
                          <p className="text-slate-600 text-[11px]"><strong>Hành Động:</strong> {fc.strategicActionNeeded}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE 9 – QUARTERLY BUSINESS REVIEW (QBR) GENERATOR */}
                  <div className="p-6 bg-slate-950 text-white rounded-3xl border border-rose-500/30 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-xs font-bold text-rose-400 uppercase tracking-widest">Module 9</div>
                        <Typography variant="h3" className="text-white font-mono">{lpepQbrReport.quarterTitle}</Typography>
                      </div>
                      <Award size={20} className="text-amber-400" />
                    </div>

                    <div className="space-y-2.5 text-xs font-mono">
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Product Health Score</span>
                        <span className="text-emerald-400 font-bold text-sm">{lpepQbrReport.productHealthSummary}</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">User Growth & Retention</span>
                        <span className="text-sky-300 font-bold">{lpepQbrReport.userGrowthMetrics}</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase">Release Quality & CSAT</span>
                        <span className="text-amber-300 font-bold">{lpepQbrReport.releaseQualityIndex} • {lpepQbrReport.customerFeedbackSummary}</span>
                      </div>
                      <div className="p-2.5 bg-rose-950/60 rounded-xl border border-rose-500/30">
                        <span className="text-rose-300 block text-[10px] uppercase font-bold">Strategic Roadmap Recommendation</span>
                        <span className="text-white font-bold">{lpepQbrReport.strategicRoadmapRecommendation}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* MODULE 10 – DEFINITION OF DONE (PHASE 4.2 DOD CERTIFICATION) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-rose-600 uppercase tracking-widest">Module 10</div>
                      <Typography variant="h3" className="text-slate-900">Definition of Done (Phase 4.2 Certification Checklist)</Typography>
                    </div>
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lpepPhase42Dod.map((dod) => (
                      <div key={dod.criterionId} className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {dod.title}
                          </span>
                          <p className="text-[11px] text-slate-700">{dod.description}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold font-mono shrink-0">
                          {dod.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* LPEP PHASE 4.3 – PRODUCT PORTFOLIO & INNOVATION MANAGEMENT */}
              <div className="pt-10 border-t-2 border-indigo-500/30 space-y-8">

                {/* PHASE 4.3 BANNER HEADER */}
                <div className="p-8 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
                        <Layers size={18} /> LoveNote Product Evolution Program (LPEP) • Phase 4.3
                      </div>
                      <Typography variant="h2" className="text-white font-mono tracking-tight">
                        Product Portfolio & Innovation Management
                      </Typography>
                      <Typography variant="body-sm" className="text-slate-300 mt-1 max-w-3xl">
                        Quản lý mọi ý tưởng, tính năng, sáng kiến và đầu tư phát triển như một danh mục chiến lược, bảo đảm LoveNote phát triển đúng hướng trong nhiều năm.
                      </Typography>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 text-right shrink-0">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">PHASE STATUS</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">PHASE 4.3 ACTIVE</div>
                      <div className="text-[10px] text-slate-300">Portfolio Governance</div>
                    </div>
                  </div>

                  {/* TERMINAL STATUS BAR */}
                  <div className="p-5 bg-slate-950/90 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-indigo-400 font-bold">
                      <span className="flex items-center gap-2"><Terminal size={14} /> 📊 LoveNote Product Evolution Dashboard Terminal</span>
                      <span>Version: 1.0.1 Stable</span>
                    </div>
                    <div className="space-y-1.5 pt-1 text-slate-300 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Operational Excellence</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Product Intelligence</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                        <span className="w-48 text-indigo-300 font-bold flex items-center gap-1">Portfolio Management <span className="text-amber-400">◀ ACTIVE FOCUS</span></span>
                        <span className="text-indigo-400 font-bold">███████░░░ 70%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Innovation Strategy</span>
                        <span className="text-sky-400 font-bold">██████░░░░ 60%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Future Platform</span>
                        <span className="text-purple-400 font-bold">████░░░░░░ 40%</span>
                      </div>
                    </div>
                  </div>

                  {/* PHILOSOPHY CALLOUT */}
                  <div className="p-4 bg-indigo-950/50 rounded-2xl border border-indigo-500/40 flex items-start gap-3 text-xs">
                    <Sparkles size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-indigo-200 text-sm">Triết Lý Danh Mục Sản Phẩm (Portfolio Philosophy)</div>
                      <p className="text-slate-300 mt-1">
                        Không phải mọi ý tưởng hay đều nên phát triển. Một sản phẩm trưởng thành phải biết: Ý tưởng nào cần làm ngay • Ý tưởng nào cần chờ • Ý tưởng nào nên loại bỏ.
                      </p>
                    </div>
                  </div>
                </div>

                {/* MODULE 1 – PRODUCT PORTFOLIO BOARD */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 1</div>
                      <Typography variant="h3" className="text-slate-900">Product Portfolio Board (8 Strategic Tracks)</Typography>
                    </div>
                    <Layers size={20} className="text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Tất cả sáng kiến được phân bổ và quản lý tập trung theo 8 danh mục chiến lược, xóa bỏ hoàn toàn danh sách ý tưởng rời rạc.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {lpepPortfolioTracks.map((track, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs font-mono">{track.trackName}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            track.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                            track.status === 'Expanding' ? 'bg-indigo-100 text-indigo-800' :
                            track.status === 'Research' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800'
                          }`}>{track.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{track.description}</p>
                        <div className="pt-1 text-[10px] font-bold text-slate-500 font-mono">
                          Initiatives: {track.initiativesCount} Active Projects
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 2 – STRATEGIC PRIORITIZATION MATRIX */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 2</div>
                      <Typography variant="h3" className="text-slate-900">Strategic Prioritization Matrix (Weighted Scoring Engine)</Typography>
                    </div>
                    <Sliders size={20} className="text-indigo-600" />
                  </div>
                  
                  {/* WEIGHT FORMULA BADGES */}
                  <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs flex flex-wrap items-center gap-2">
                    <span className="font-bold text-indigo-900">Trọng Số Ưu Tiên:</span>
                    <span className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] font-mono">Customer Value: 30%</span>
                    <span className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] font-mono">Business Impact: 25%</span>
                    <span className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] font-mono">Strategic Alignment: 20%</span>
                    <span className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] font-mono">Tech Complexity: 15%</span>
                    <span className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] font-mono">Dev Cost: 10%</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Initiative</th>
                          <th className="p-3">Track</th>
                          <th className="p-3 text-center">Cust Val (30%)</th>
                          <th className="p-3 text-center">Biz Impact (25%)</th>
                          <th className="p-3 text-center">Strat Align (20%)</th>
                          <th className="p-3 text-center">Strategic Score</th>
                          <th className="p-3 text-right">Priority</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lpepPrioritization.map((prio, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900 font-mono">{prio.initiativeTitle}</td>
                            <td className="p-3 text-slate-600">{prio.track}</td>
                            <td className="p-3 text-center font-mono">{prio.customerValueScore}</td>
                            <td className="p-3 text-center font-mono">{prio.businessImpactScore}</td>
                            <td className="p-3 text-center font-mono">{prio.strategicAlignmentScore}</td>
                            <td className="p-3 text-center font-mono font-bold text-indigo-700 text-sm">{prio.strategicScore}</td>
                            <td className="p-3 text-right">
                              <span className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono ${
                                prio.priority === 'HIGH' ? 'bg-emerald-100 text-emerald-800' :
                                prio.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                              }`}>{prio.priority}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* MODULE 3 – INNOVATION FUNNEL MANAGER */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 3</div>
                      <Typography variant="h3" className="text-slate-900">Innovation Funnel Manager (8-Stage Sieve)</Typography>
                    </div>
                    <Filter size={20} className="text-indigo-600" />
                  </div>
                  <p className="text-xs text-slate-600">
                    Sàng lọc qua 8 bước nghiêm ngặt: Idea ➔ Research ➔ Validation ➔ Prototype ➔ Pilot ➔ Roadmap ➔ Development ➔ Release. Không có ý tưởng nào nhảy thẳng vào Development.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {lpepFunnel.map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 font-mono">{item.initiativeName}</span>
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-bold">{item.stage}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">Lead: {item.leadOwner}</div>
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Stage Progress</span>
                            <span className="font-bold text-indigo-600">{item.stageProgress}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${item.stageProgress}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 4 & MODULE 5 – INVESTMENT ANALYTICS & FEATURE ROI TRACKER */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* MODULE 4 – INVESTMENT ANALYTICS */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 4</div>
                        <Typography variant="h3" className="text-slate-900">Investment Analytics (Resource Allocation)</Typography>
                      </div>
                      <BarChart2 size={20} className="text-emerald-600" />
                    </div>

                    <div className="space-y-3">
                      {lpepInvestments.map((inv, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-900">{inv.category}</span>
                            <span className="font-mono text-indigo-600">{inv.percentage}% Allocation ({inv.resourceHours} hrs)</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${inv.percentage}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-600 italic">{inv.strategicFocus}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE 5 – FEATURE ROI TRACKER */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 5</div>
                        <Typography variant="h3" className="text-slate-900">Feature ROI Tracker (Post-Release Evaluation)</Typography>
                      </div>
                      <TrendingUp size={20} className="text-indigo-600" />
                    </div>

                    <div className="space-y-3">
                      {lpepFeatureRois.map((roi, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 font-mono">{roi.featureName}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              roi.roiRating === 'Very High' ? 'bg-emerald-100 text-emerald-800' :
                              roi.roiRating === 'High' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                            }`}>ROI: {roi.roiRating}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-600">
                            <span>Cost: {roi.investmentHours} hrs</span>
                            <span>Usage: {roi.usagePercent}%</span>
                            <span>CSAT: {roi.csatScore} / 5</span>
                          </div>
                          <p className="text-slate-700 text-[11px]"><strong>Khuyến Nghị:</strong> {roi.actionRecommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* MODULE 6 & MODULE 7 – SUNSET MANAGEMENT & CAPABILITY MAP */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* MODULE 6 – SUNSET MANAGEMENT */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 6</div>
                        <Typography variant="h3" className="text-slate-900">Sunset Management (Graceful Feature Retirement)</Typography>
                      </div>
                      <Clock size={20} className="text-amber-600" />
                    </div>

                    <div className="space-y-3">
                      {lpepSunsetItems.map((sunset, idx) => (
                        <div key={idx} className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 font-mono">{sunset.featureName}</span>
                            <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] font-bold">{sunset.stage}</span>
                          </div>
                          <p className="text-slate-700"><strong>Lý do nghỉ hưu:</strong> {sunset.retirementReason}</p>
                          <p className="text-amber-900 font-medium"><strong>Thay thế bằng:</strong> {sunset.replacementAlternative}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE 7 – PRODUCT CAPABILITY MAP */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 7</div>
                        <Typography variant="h3" className="text-slate-900">Product Capability Map</Typography>
                      </div>
                      <Gauge size={20} className="text-sky-600" />
                    </div>

                    <div className="space-y-3">
                      {lpepCapabilities.map((cap, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900">{cap.capabilityName}</span>
                            <span className="font-mono text-indigo-600">{cap.levelPercent}% ({cap.status})</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${cap.levelPercent}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500">{cap.strategicAction}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* MODULE 8 – THREE HORIZONS ROADMAP */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 8</div>
                      <Typography variant="h3" className="text-slate-900">Three Horizons Roadmap (1 Year, 2 Years, 4 Years)</Typography>
                    </div>
                    <Compass size={20} className="text-indigo-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lpepHorizons.map((hz, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm font-mono">{hz.horizonTitle}</span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-bold">{hz.timeframe}</span>
                          </div>
                          <p className="text-xs text-indigo-900 font-medium bg-indigo-50 p-2 rounded-xl border border-indigo-100">{hz.focusGoal}</p>
                          <ul className="space-y-1 text-xs text-slate-700 pt-1">
                            {hz.keyInitiatives.map((init, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <ChevronRight size={12} className="text-indigo-500 shrink-0" /> {init}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 9 – EXECUTIVE REVIEW CYCLE */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 9</div>
                      <Typography variant="h3" className="text-slate-900">Executive Review Cycle Cadence</Typography>
                    </div>
                    <Clock size={20} className="text-indigo-600" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="p-3">Chu Kỳ</th>
                          <th className="p-3">Nội Dung Trọng Tâm</th>
                          <th className="p-3">Thành Phần Tham Gia</th>
                          <th className="p-3 text-right">Sản Phẩm Đầu Ra</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lpepReviewCycle.map((rev, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-indigo-900 font-mono">{rev.cadence}</td>
                            <td className="p-3 text-slate-700">{rev.contentFocus}</td>
                            <td className="p-3 text-slate-600">{rev.keyParticipants}</td>
                            <td className="p-3 text-right font-bold text-emerald-700 font-mono">{rev.deliverableOutput}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SPECIAL DESIGN GATE – LOVENOTE DESIGN COUNCIL QUALITY GATE */}
                <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                        <Award size={18} /> LoveNote Strategic Quality Gate
                      </div>
                      <Typography variant="h3" className="text-white font-mono mt-1">
                        LoveNote Design Council Quality Gate
                      </Typography>
                      <p className="text-xs text-slate-300 mt-1">
                        Cơ chế &quot;Người Gác Cổng&quot; giữ bản sắc LoveNote, thẩm định 5 câu hỏi cốt lõi trước khi bất kỳ tính năng lớn nào được đưa vào Roadmap.
                      </p>
                    </div>
                    <ShieldCheck size={28} className="text-indigo-400 shrink-0" />
                  </div>

                  {/* 5 CORE QUESTIONS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs font-mono">
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                      <span className="text-indigo-400 font-bold block mb-1">CÂU HỎI 1</span>
                      <span className="text-slate-200">Phù hợp triết lý LoveNote?</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                      <span className="text-indigo-400 font-bold block mb-1">CÂU HỎI 2</span>
                      <span className="text-slate-200">Giải quyết vấn đề thực?</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                      <span className="text-indigo-400 font-bold block mb-1">CÂU HỎI 3</span>
                      <span className="text-slate-200">Có làm giao diện rối?</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                      <span className="text-indigo-400 font-bold block mb-1">CÂU HỎI 4</span>
                      <span className="text-slate-200">Hiệu năng & Bảo mật?</span>
                    </div>
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-center">
                      <span className="text-indigo-400 font-bold block mb-1">CÂU HỎI 5</span>
                      <span className="text-slate-200">Giá trị lâu dài hay hype?</span>
                    </div>
                  </div>

                  {/* DESIGN COUNCIL EVALUATION CASES */}
                  <div className="space-y-4">
                    {lpepDesignCouncil.map((dc, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl border space-y-3 text-xs ${
                        dc.councilDecision === 'APPROVED FOR ROADMAP' ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-rose-950/40 border-rose-500/40'
                      }`}>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="font-bold text-sm font-mono text-white">{dc.initiativeTitle}</span>
                          <span className={`px-3 py-1 rounded text-xs font-bold font-mono ${
                            dc.councilDecision === 'APPROVED FOR ROADMAP' ? 'bg-emerald-200 text-emerald-950' : 'bg-rose-200 text-rose-950'
                          }`}>
                            COUNCIL DECISION: {dc.councilDecision}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
                          <div>• <strong>Triết Lý:</strong> {dc.philosophyVerdict}</div>
                          <div>• <strong>Vấn Đề Thực:</strong> {dc.problemVerdict}</div>
                          <div>• <strong>Giao Diện UI:</strong> {dc.uiVerdict}</div>
                          <div>• <strong>Kỹ Thuật & Performance:</strong> {dc.techVerdict}</div>
                        </div>
                        <div className="pt-2 border-t border-slate-800/80 text-white font-medium">
                          <strong>Giá Trị Lâu Dài:</strong> {dc.valueVerdict}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 10 – DEFINITION OF DONE (PHASE 4.3 DOD CERTIFICATION) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 10</div>
                      <Typography variant="h3" className="text-slate-900">Definition of Done (Phase 4.3 Certification Checklist)</Typography>
                    </div>
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lpepPhase43Dod.map((dod) => (
                      <div key={dod.criterionId} className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {dod.title}
                          </span>
                          <p className="text-[11px] text-slate-700">{dod.description}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold font-mono shrink-0">
                          {dod.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* LPEP PHASE 4.4 – EVOLUTION ARCHITECTURE & PLATFORM SUSTAINABILITY */}
              <div className="pt-10 border-t-2 border-indigo-500/30 space-y-8">

                {/* PHASE 4.4 BANNER HEADER */}
                <div className="p-8 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/40 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mb-1">
                        <Layers size={18} /> LoveNote Product Evolution Program (LPEP) • Phase 4.4
                      </div>
                      <Typography variant="h2" className="text-white font-mono tracking-tight">
                        Evolution Architecture & Platform Sustainability
                      </Typography>
                      <Typography variant="body-sm" className="text-slate-300 mt-1 max-w-3xl">
                        Đảm bảo LoveNote có thể phát triển trong 5–10 năm tới mà không phải viết lại từ đầu. Kiến trúc tốt phải dễ mở rộng, dễ thay đổi, dễ bảo trì và dễ thay thế công nghệ.
                      </Typography>
                    </div>

                    <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 text-right shrink-0">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">PHASE STATUS</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">PHASE 4.4 ACTIVE</div>
                      <div className="text-[10px] text-slate-300">Platform Sustainability</div>
                    </div>
                  </div>

                  {/* TERMINAL STATUS BAR */}
                  <div className="p-5 bg-slate-950/90 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-indigo-400 font-bold">
                      <span className="flex items-center gap-2"><Terminal size={14} /> 📊 LoveNote Product Evolution Dashboard Terminal</span>
                      <span>Version: 1.0.1 Stable</span>
                    </div>
                    <div className="space-y-1.5 pt-1 text-slate-300 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Operational Excellence</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Product Intelligence</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-slate-400">Portfolio Management</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-500/30">
                        <span className="w-48 text-indigo-300 font-bold flex items-center gap-1">Evolution Architecture <span className="text-amber-400">◀ ACTIVE FOCUS</span></span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="w-48 text-indigo-300 font-bold">Platform Sustainability</span>
                        <span className="text-emerald-400 font-bold">██████████ 100%</span>
                      </div>
                    </div>
                  </div>

                  {/* PHILOSOPHY CALLOUT */}
                  <div className="p-4 bg-indigo-950/50 rounded-2xl border border-indigo-500/40 flex items-start gap-3 text-xs">
                    <Sparkles size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-indigo-200 text-sm">Triết Lý Kiến Trúc Bền Vững (Evolutionary Architecture)</div>
                      <p className="text-slate-300 mt-1">
                        &quot;Một kiến trúc tốt không chỉ chạy nhanh hôm nay. Mà còn phải dễ mở rộng, dễ thay đổi, dễ bảo trì, dễ thay thế công nghệ.&quot;
                      </p>
                    </div>
                  </div>
                </div>

                {/* MODULE 1 – ARCHITECTURE GOVERNANCE */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 1</div>
                      <Typography variant="h3" className="text-slate-900">Architecture Governance Process</Typography>
                    </div>
                    <GitBranch size={20} className="text-indigo-600" />
                  </div>
                  
                  {/* WORKFLOW PIPELINE DIAGRAM */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                    <div className="text-indigo-400 font-bold text-[11px] uppercase tracking-wider">5-Step Architecture Approval Pipeline</div>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-center text-[11px]">
                      <div className="p-2.5 bg-indigo-950/80 rounded-xl border border-indigo-500/30 flex-1 min-w-[120px]">
                        <span className="text-indigo-300 font-bold block">1. Proposal</span>
                        <span className="text-[10px] text-slate-400">Architecture Proposal</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-500 hidden sm:block shrink-0" />
                      <div className="p-2.5 bg-indigo-950/80 rounded-xl border border-indigo-500/30 flex-1 min-w-[120px]">
                        <span className="text-indigo-300 font-bold block">2. Impact</span>
                        <span className="text-[10px] text-slate-400">Impact Analysis</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-500 hidden sm:block shrink-0" />
                      <div className="p-2.5 bg-indigo-950/80 rounded-xl border border-indigo-500/30 flex-1 min-w-[120px]">
                        <span className="text-indigo-300 font-bold block">3. Risk</span>
                        <span className="text-[10px] text-slate-400">Risk Assessment</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-500 hidden sm:block shrink-0" />
                      <div className="p-2.5 bg-indigo-950/80 rounded-xl border border-indigo-500/30 flex-1 min-w-[120px]">
                        <span className="text-indigo-300 font-bold block">4. Review</span>
                        <span className="text-[10px] text-slate-400">Review Board</span>
                      </div>
                      <ChevronRight size={16} className="text-indigo-500 hidden sm:block shrink-0" />
                      <div className="p-2.5 bg-emerald-950/80 rounded-xl border border-emerald-500/40 flex-1 min-w-[120px]">
                        <span className="text-emerald-300 font-bold block">5. Approval</span>
                        <span className="text-[10px] text-emerald-400">Approved / Rejected</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE PROPOSALS TABLE */}
                  <div className="space-y-3">
                    {lpepArchProposals.map((prop, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono font-bold text-[10px]">{prop.proposalId}</span>
                            <span className="font-bold text-slate-900 text-sm">{prop.title}</span>
                          </div>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            prop.reviewBoardStatus === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>{prop.reviewBoardStatus}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                          <div>• <strong>Scope:</strong> {prop.impactScope}</div>
                          <div>• <strong>Risk Assessment:</strong> <span className="font-bold text-slate-800">{prop.riskAssessment}</span></div>
                        </div>
                        <p className="text-slate-700 italic bg-white p-2.5 rounded-xl border border-slate-200">{prop.rationale}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 2 & MODULE 3 – DEPENDENCY HEALTH & PLUGIN COMPATIBILITY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* MODULE 2 – DEPENDENCY HEALTH CENTER */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 2</div>
                        <Typography variant="h3" className="text-slate-900">Dependency Health Center</Typography>
                      </div>
                      <Cpu size={20} className="text-indigo-600" />
                    </div>

                    {/* KPI CARDS */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                        <div className="text-[10px] font-bold text-emerald-800">HEALTHY</div>
                        <div className="text-xl font-black text-emerald-600">{lpepDepHealth.healthyPercent}%</div>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                        <div className="text-[10px] font-bold text-amber-800">DEPRECATED</div>
                        <div className="text-xl font-black text-amber-600">{lpepDepHealth.deprecatedCount}</div>
                      </div>
                      <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200">
                        <div className="text-[10px] font-bold text-sky-800">CRITICAL UPDATE</div>
                        <div className="text-xl font-black text-sky-600">{lpepDepHealth.criticalUpdateCount}</div>
                      </div>
                      <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200">
                        <div className="text-[10px] font-bold text-slate-700">LICENSE RISK</div>
                        <div className="text-xl font-black text-slate-800">{lpepDepHealth.licenseRiskCount}</div>
                      </div>
                    </div>

                    {/* MONITORED CATEGORIES LIST */}
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Theo Dõi 7 Nhóm Thư Viện Cốt Lõi:</div>
                      {lpepDepHealth.monitoredCategories.map((cat, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                          <span className="text-slate-800 font-mono text-[11px]">{cat}</span>
                          <span className="text-emerald-600 font-bold text-[10px]">HEALTHY ✅</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE 3 – PLUGIN COMPATIBILITY MATRIX */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 3</div>
                        <Typography variant="h3" className="text-slate-900">Plugin Compatibility Matrix</Typography>
                      </div>
                      <Code size={20} className="text-indigo-600" />
                    </div>

                    <div className="space-y-3">
                      {lpepPluginCompats.map((plugin, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                          <div className="font-bold text-slate-900 font-mono">{plugin.pluginName}</div>
                          
                          <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
                            <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded font-bold">LN 1.0 ✅</div>
                            <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded font-bold">LN 1.1 ✅</div>
                            <div className={`p-1.5 rounded font-bold ${
                              plugin.ln20Compat === 'COMPATIBLE' ? 'bg-emerald-100 text-emerald-900' :
                              plugin.ln20Compat === 'WARNING' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                            }`}>LN 2.0 {plugin.ln20Compat === 'COMPATIBLE' ? '✅' : plugin.ln20Compat === 'WARNING' ? '⚠' : '❌'}</div>
                            <div className="p-1.5 bg-indigo-100 text-indigo-900 rounded font-bold">Nightly {plugin.nightlyCompat ? '✅' : '❌'}</div>
                          </div>
                          
                          <p className="text-[11px] text-slate-600">{plugin.healthNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* MODULE 4 & MODULE 5 – API STABILITY & MODULARIZATION AUDIT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* MODULE 4 – API STABILITY INDEX */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 4</div>
                        <Typography variant="h3" className="text-slate-900">API Stability Index</Typography>
                      </div>
                      <Server size={20} className="text-indigo-600" />
                    </div>

                    <div className="p-4 bg-indigo-950 text-white rounded-2xl border border-indigo-900 space-y-3 font-mono">
                      <div className="flex items-center justify-between border-b border-indigo-800 pb-2">
                        <span className="text-xs text-indigo-300">Total Tracked Endpoints</span>
                        <span className="text-lg font-bold text-emerald-400">{lpepApiStability.totalEndpoints} Endpoints</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-emerald-300">Stable API</span>
                            <span className="font-bold text-emerald-400">{lpepApiStability.stablePercent}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${lpepApiStability.stablePercent}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-amber-300">Deprecated API</span>
                            <span className="font-bold text-amber-400">{lpepApiStability.deprecatedPercent}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${lpepApiStability.deprecatedPercent}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-sky-300">Experimental API</span>
                            <span className="font-bold text-sky-400">{lpepApiStability.experimentalPercent}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-sky-500 rounded-full" style={{ width: `${lpepApiStability.experimentalPercent}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <strong>Chính sách vòng đời:</strong> {lpepApiStability.lifecyclePolicyNote}
                    </p>
                  </div>

                  {/* MODULE 5 – MODULARIZATION AUDIT */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 5</div>
                        <Typography variant="h3" className="text-slate-900">Modularization Audit</Typography>
                      </div>
                      <Layers size={20} className="text-indigo-600" />
                    </div>

                    <div className="space-y-2.5">
                      {lpepModularAudits.map((mod, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 font-mono">{mod.moduleName}</span>
                            <span className="text-indigo-600 font-mono">{mod.independenceScore}% Independent ({mod.status})</span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${mod.independenceScore}%` }} />
                          </div>
                          <p className="text-[10px] text-slate-500">{mod.couplingRiskNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* MODULE 6 – SCALABILITY SIMULATION */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 6</div>
                      <Typography variant="h3" className="text-slate-900">Scalability Simulation Engine</Typography>
                    </div>
                    <Gauge size={20} className="text-indigo-600" />
                  </div>

                  {/* STRESS TARGET CHAIN */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2 font-mono text-center">
                    <div className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{lpepScalabilitySim.scenarioName}</div>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-200">
                      <span className="px-3 py-1 bg-indigo-950 rounded-xl border border-indigo-500/40 text-indigo-300">{lpepScalabilitySim.projectsCount}</span>
                      <ChevronRight size={16} className="text-indigo-500" />
                      <span className="px-3 py-1 bg-indigo-950 rounded-xl border border-indigo-500/40 text-indigo-300">{lpepScalabilitySim.assetsCount}</span>
                      <ChevronRight size={16} className="text-indigo-500" />
                      <span className="px-3 py-1 bg-indigo-950 rounded-xl border border-indigo-500/40 text-indigo-300">{lpepScalabilitySim.notesCount}</span>
                      <ChevronRight size={16} className="text-indigo-500" />
                      <span className="px-3 py-1 bg-emerald-950 rounded-xl border border-emerald-500/40 text-emerald-300">{lpepScalabilitySim.workspacesCount}</span>
                    </div>
                  </div>

                  {/* RESULTS METRICS GRID */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">STARTUP</div>
                      <div className="text-lg font-bold text-slate-900">{lpepScalabilitySim.startupLatencyMs}ms</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">SEARCH</div>
                      <div className="text-lg font-bold text-emerald-600">{lpepScalabilitySim.searchLatencyMs}ms</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">MEMORY</div>
                      <div className="text-lg font-bold text-indigo-600">{lpepScalabilitySim.memoryUsageMb}MB</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">EXPORT</div>
                      <div className="text-lg font-bold text-sky-600">{lpepScalabilitySim.exportTimeSec}s</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-slate-500 font-bold uppercase">SYNC</div>
                      <div className="text-lg font-bold text-emerald-600">{lpepScalabilitySim.syncStatus}</div>
                    </div>
                  </div>
                </div>

                {/* MODULE 7 & MODULE 8 – TECH READINESS & SUSTAINABILITY SCORE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* MODULE 7 – FUTURE TECHNOLOGY READINESS */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 7</div>
                        <Typography variant="h3" className="text-slate-900">Future Technology Readiness</Typography>
                      </div>
                      <Compass size={20} className="text-indigo-600" />
                    </div>

                    <div className="space-y-3">
                      {lpepTechWatch.map((tech, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-slate-900 font-mono">{tech.technologyName}</span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded text-[10px] font-bold">{tech.readinessStatus}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">Category: {tech.category}</div>
                          <p className="text-slate-700 text-[11px]">{tech.strategicNote}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MODULE 8 – SUSTAINABILITY SCORE */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 8</div>
                        <Typography variant="h3" className="text-slate-900">Sustainability Score Calculator</Typography>
                      </div>
                      <Award size={20} className="text-emerald-600" />
                    </div>

                    {/* SCORE HIGHLIGHT */}
                    <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white rounded-2xl border border-emerald-500/40 flex items-center justify-between font-mono">
                      <div>
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Architecture Sustainability</div>
                        <div className="text-2xl font-black text-emerald-400">{lpepSustainability.totalScore} / 100</div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-200 text-emerald-950 rounded-xl font-bold text-xs uppercase">
                        {lpepSustainability.ratingLabel}
                      </div>
                    </div>

                    {/* BREAKDOWN TABLE */}
                    <div className="space-y-2 font-mono text-xs">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-700">Maintainability (30%)</span>
                        <span className="font-bold text-indigo-700">{lpepSustainability.maintainability} / 100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-700">Extensibility (25%)</span>
                        <span className="font-bold text-indigo-700">{lpepSustainability.extensibility} / 100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-700">Testability (15%)</span>
                        <span className="font-bold text-indigo-700">{lpepSustainability.testability} / 100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-700">Scalability (20%)</span>
                        <span className="font-bold text-indigo-700">{lpepSustainability.scalability} / 100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-slate-700">Documentation (10%)</span>
                        <span className="font-bold text-indigo-700">{lpepSustainability.documentation} / 100</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* MODULE 9 – EVOLUTION ROADMAP */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 9</div>
                      <Typography variant="h3" className="text-slate-900">Architecture Evolution Roadmap (5-Layer Synergy)</Typography>
                    </div>
                    <GitBranch size={20} className="text-indigo-600" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {lpepArchRoadmap.map((road, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between text-xs">
                        <div className="space-y-1.5">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono font-bold text-[10px] block w-fit">{road.layer}</span>
                          <div className="font-bold text-slate-900">{road.horizonFocus}</div>
                          <ul className="space-y-1 text-[11px] text-slate-600 pt-1">
                            {road.keyUpgrades.map((upg, u) => (
                              <li key={u} className="flex items-center gap-1">
                                <ChevronRight size={12} className="text-indigo-500 shrink-0" /> {upg}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STRATEGIC PROPOSAL – LOVENOTE ENGINEERING CONSTITUTION */}
                <div className="p-6 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/40 shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                        <ShieldCheck size={18} /> Strategic Proposal • Engineering Governance
                      </div>
                      <Typography variant="h3" className="text-white font-mono mt-1">
                        LoveNote Engineering Constitution
                      </Typography>
                      <p className="text-xs text-slate-300 mt-1">
                        Bộ 7 nguyên tắc &quot;Hiến Pháp Kỹ Thuật&quot; bắt buộc — Kim chỉ nam bảo đảm chất lượng, hiệu năng và bản sắc LoveNote khi nhiều đội ngũ cùng tham gia phát triển.
                      </p>
                    </div>
                    <Award size={28} className="text-indigo-400 shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lpepConstitution.map((consti) => (
                      <div key={consti.pillarNumber} className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono font-bold text-[10px]">PILLAR {consti.pillarNumber}</span>
                          <span className="text-indigo-400 font-bold text-[11px] font-mono">{consti.englishTitle}</span>
                        </div>
                        <div className="font-bold text-white text-sm">{consti.title}</div>
                        <p className="text-slate-300 text-[11px] line-clamp-3">{consti.principleDescription}</p>
                        <div className="pt-2 border-t border-slate-800 text-[10px] text-indigo-300 font-mono">
                          <strong>Cơ chế giám sát:</strong> {consti.enforcementMechanism}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 10 – DEFINITION OF DONE (PHASE 4.4 DOD CERTIFICATION) */}
                <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Module 10</div>
                      <Typography variant="h3" className="text-slate-900">Definition of Done (Phase 4.4 Certification Checklist)</Typography>
                    </div>
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lpepPhase44Dod.map((dod) => (
                      <div key={dod.criterionId} className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> {dod.title}
                          </span>
                          <p className="text-[11px] text-slate-700">{dod.description}</p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-200 text-emerald-900 rounded-lg text-[10px] font-bold font-mono shrink-0">
                          {dod.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}
        {activeTab === 'ops_health' && (
          <motion.div key="ops_health_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Production Health Dashboard & Go-Live Checklist</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Giám sát thời gian thực các chỉ số sức khỏe hệ thống và bảng kiểm phê duyệt Go-Live 4 trụ cột.
                </Typography>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full shrink-0 flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-600 animate-pulse" /> Live Monitoring Active (99.98% Health)
              </span>
            </div>

            {/* Living Product Philosophy Banner */}
            <div className="p-6 bg-gradient-to-r from-rose-950 via-slate-950 to-slate-900 text-white rounded-3xl border border-rose-500/30 relative overflow-hidden space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Heart size={16} /> Triết Lý Phase 3.4 Vận Hành & Phát Triển Bền Vững
              </div>
              <p className="text-lg font-black text-slate-100">
                "Một dự án kết thúc khi phát hành. Một sản phẩm bắt đầu khi phát hành."
              </p>
              <p className="text-xs text-slate-300">
                Từ thời điểm Go-Live, LoveNote chuyển trạng thái chính thức từ <code className="text-rose-300 font-bold">Development Project</code> thành <code className="text-emerald-300 font-bold">Living Product</code> với chu trình bảo trì và cải tiến liên tục.
              </p>
            </div>

            {/* Health Dashboard Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthMetrics.map((hm) => (
                <div key={hm.metricKey} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-colors">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{hm.metricLabel}</span>
                    <div className="text-3xl font-black text-slate-900 tracking-tight">{hm.measuredValue}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium text-[11px]">Mục tiêu KPI: <strong className="text-slate-800">{hm.kpiTarget}</strong></span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-100 flex items-center gap-1">
                      <Check size={12} /> {hm.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Go-Live Verification Checklist 4-Pillars */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck size={18} className="text-rose-600" /> Bảng Kiểm Go-Live Phê Duyệt Phát Hành (Checklist 4 Trụ Cột)
                </h4>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                  20/20 Complete
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                {/* Product */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Product
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> UI thống nhất toàn bộ app</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> UX đạt chuẩn CSAT ≥4.8</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Responsive mobile/tablet/desktop</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> AI Assistant ổn định 100%</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Print Studio chính xác lề in</li>
                  </ul>
                </div>

                {/* Engineering */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Engineering
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> 0 Critical/Blocker Bug</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Performance FPS 60</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Security OWASP Certified</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Backup/Restore 100% data loss 0</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Service Worker / Auto Patch</li>
                  </ul>
                </div>

                {/* Documentation */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Documentation
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> User Guide hoàn chỉnh</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> FAQ & Troubleshooting</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Release Notes v1.0</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Privacy Policy & Terms</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Developer Plugin API SDK</li>
                  </ul>
                </div>

                {/* Operations */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" /> Operations
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Monitoring Health Active</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Crash Reporting Suite</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Support Ticket Workflow</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Issue Tracker Active</li>
                    <li className="flex items-center gap-1.5"><Check size={12} className="text-emerald-600" /> Daily Auto-Backup Schedule</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Opt-In Product Analytics Dashboard */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-white flex items-center gap-2">
                    <BarChart2 size={18} className="text-rose-400" /> Product Analytics Dashboard (Opt-In Privacy Mode)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">Chỉ thu thập khi người dùng đồng ý. 100% dữ liệu ẩn danh.</p>
                </div>
                <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-[10px] rounded-full">
                  User Opt-In Enforced
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Export Completion</div>
                  <div className="text-emerald-400 font-black text-xl">99.95%</div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">AI Assistant Usage</div>
                  <div className="text-rose-400 font-black text-xl">76.4%</div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Memory Album Creator</div>
                  <div className="text-amber-400 font-black text-xl">82.1%</div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                  <div className="text-[10px] text-slate-400 uppercase">Avg Session Duration</div>
                  <div className="text-sky-400 font-black text-xl">14m 30s</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: USER FEEDBACK LOOP & TICKET WORKFLOW */}
        {activeTab === 'feedback_loop' && (
          <motion.div key="feedback_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">User Feedback Loop & Customer Support Workflow</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Phân loại phản hồi tự động, không để thất lạc ticket, và quản lý trọn vẹn vòng đời sửa lỗi từ User Report đến Release.
                </Typography>
              </div>
            </div>

            {/* Lifecycle Pipeline Diagram */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-900 block">Quy Trình Xử Lý Support Ticket Tự Động (Customer Support Lifecycle):</span>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs font-bold">
                <div className="p-3 bg-rose-50 text-rose-900 rounded-2xl border border-rose-200">1. User Report</div>
                <div className="p-3 bg-slate-50 text-slate-800 rounded-2xl border border-slate-200">2. Ticket</div>
                <div className="p-3 bg-slate-50 text-slate-800 rounded-2xl border border-slate-200">3. Classification</div>
                <div className="p-3 bg-slate-50 text-slate-800 rounded-2xl border border-slate-200">4. Assign</div>
                <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl border border-amber-200">5. Fix</div>
                <div className="p-3 bg-slate-50 text-slate-800 rounded-2xl border border-slate-200">6. Verify</div>
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl border border-emerald-300">7. Release</div>
              </div>
            </div>

            {/* Category Taxonomy Pills */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold">
              <span className="text-slate-500 shrink-0">Phân Loại Phản Hồi:</span>
              {['All', 'Bug', 'UX', 'Feature Request', 'Performance', 'AI', 'Documentation'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setTicketCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    ticketCategoryFilter === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Support Tickets Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare size={18} className="text-rose-600" /> Bảng Theo Dõi Support Ticket Đang Xử Lý
              </h4>

              <div className="space-y-3">
                {supportTickets
                  .filter(t => ticketCategoryFilter === 'All' || t.category === ticketCategoryFilter)
                  .map((t) => (
                    <div key={t.ticketId} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{t.ticketId}</span>
                          <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-rose-100 text-rose-800">{t.category}</span>
                          <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                        </div>

                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                          {t.lifecycleStage}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                        <div><strong>Người báo cáo:</strong> {t.reportedBy}</div>
                        <div><strong>Kết quả / Ghi chú:</strong> {t.resolutionNote}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: RELEASE TRAIN & QUALITY GATES */}
        {activeTab === 'release_train' && (
          <motion.div key="release_train_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Release Train Pipeline & Post-Go-Live Quality Gates</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Thiết lập chu kỳ phát hành rõ ràng giúp người dùng biết khi nào nhận cập nhật và đảm bảo mọi bản build vượt qua 7 cổng kiểm soát.
                </Typography>
              </div>
            </div>

            {/* Release Train Cadences Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {releaseTrain.map((rt) => (
                <div key={rt.versionSeries} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-rose-300 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-white">
                        v{rt.versionSeries}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        {rt.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{rt.cycleName}</h4>
                    <p className="text-xs text-rose-600 font-semibold">{rt.frequency}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{rt.focusArea}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-600 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" /> Quality Gate Bắt Buộc Enforced
                  </div>
                </div>
              ))}
            </div>

            {/* Quality Gate Pipeline Sequence */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block">
                7 Cổng Kiểm Soát Chất Lượng Bắt Buộc Cho Mỗi Bản Patch (Quality Gate Pipeline):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs font-bold">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15">1. Build</div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15">2. Unit Test</div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15">3. Integration</div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15">4. UI Test</div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15">5. Performance</div>
                <div className="p-3 bg-white/10 rounded-2xl border border-white/15">6. Security Scan</div>
                <div className="p-3 bg-emerald-500 text-slate-950 font-black rounded-2xl">7. Release Candidate</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: TECHNICAL DEBT & INNOVATION BACKLOG */}
        {activeTab === 'tech_debt_backlog' && (
          <motion.div key="tech_debt_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Technical Debt Register & Innovation Backlog</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Dành 15–20% năng lực mỗi phiên bản để giảm "nợ kỹ thuật" và lưu trữ ý tưởng sáng tạo cho tương lai mà không làm phình tính năng hiện tại.
                </Typography>
              </div>
            </div>

            {/* Tech Debt Management */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Layers size={18} className="text-amber-600" /> Danh Sách Quản Lý Nợ Kỹ Thuật (Technical Debt Register)
                </h4>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 font-bold text-xs rounded-full">
                  15-20% Capacity Allocated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {technicalDebts.map((td, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded">
                        {td.debtCategory}
                      </span>
                      <span className="font-mono font-bold text-slate-700">{td.targetVersion}</span>
                    </div>

                    <h5 className="font-bold text-slate-900 text-sm">{td.title}</h5>
                    <p className="text-slate-600">{td.mitigationStrategy}</p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                      <span>Phân bổ năng lực: {td.allocatedCapacity}</span>
                      <span className="text-emerald-700 font-bold">{td.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Innovation Backlog */}
            <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-rose-400" /> Innovation Backlog (Ý Tưởng Đột Phá Tương Lai)
                </h4>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 font-bold text-xs rounded-full border border-rose-500/30">
                  Future Evaluation
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {innovationBacklog.map((ib) => (
                  <div key={ib.ideaId} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-bold text-[10px] rounded">
                        {ib.category}
                      </span>
                      <span className="text-emerald-400 font-bold">{ib.targetMajorRelease}</span>
                    </div>

                    <h5 className="font-bold text-white text-sm">{ib.title}</h5>
                    <p className="text-slate-300">{ib.valueProposition}</p>

                    <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>Khả thi: <strong className="text-white">{ib.feasibilityScore}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: DIGITAL PRODUCT ORGANIZATION & OPERATIONAL MATURITY (PHASE 4.5) */}
        {activeTab === 'p45_digital_org' && (
          <motion.div key="p45_digital_org_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {/* Header Philosophy Banner */}
            <div className="p-8 bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white rounded-3xl border border-rose-500/30 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest">
                  <Building2 size={16} className="text-amber-400 animate-pulse" />
                  <span>LoveNote Product Evolution Program • Phase 4.5</span>
                </div>
                <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
                  Digital Product Organization (Level 5 Operating Model)
                </span>
              </div>

              <div className="space-y-2 relative z-10">
                <Typography variant="h2" className="text-white tracking-tight">
                  LoveNote Digital Product Organization & Operational Maturity
                </Typography>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-amber-300 font-medium text-sm leading-relaxed italic">
                  "Không chỉ xây dựng một phần mềm. Mà xây dựng một hệ thống có thể liên tục tạo ra phần mềm chất lượng đỉnh cao — vận hành như các tổ chức công nghệ hàng đầu thế giới."
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl relative z-10">
                Biến LoveNote từ một sản phẩm đóng gói đơn thuần thành một <strong>Tổ chức Sản phẩm Kỹ thuật số (Digital Product Organization)</strong> có năng lực tự vận hành, tự học hỏi từ phản hồi thị trường, nâng cao chất lượng quyết định và phát triển bền vững dài hạn.
              </p>
            </div>

            {/* ASCII Terminal Status Dashboard */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-rose-500/30 font-mono text-xs text-slate-200 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-rose-400 font-bold">
                  <Terminal size={16} />
                  <span>📊 LoveNote Evolution Dashboard (LPEP Terminal)</span>
                </div>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">
                  v1.0.1 Stable • Active Focus
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] sm:text-xs leading-snug text-rose-300/90 font-mono overflow-x-auto">
                <pre className="text-emerald-400">LOVE NOTE PRODUCT EVOLUTION</pre>
                <pre className="text-slate-400">Version: 1.0.1 Stable</pre>
                <pre className="text-slate-600">──────────────────────────────────────────────</pre>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Operational Excellence</span>
                  <span className="text-emerald-400 font-bold">██████████ 100%</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Product Intelligence</span>
                  <span className="text-emerald-400 font-bold">██████████ 100%</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Portfolio Management</span>
                  <span className="text-emerald-400 font-bold">██████████ 100%</span>
                </div>
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-slate-300">Evolution Architecture</span>
                  <span className="text-emerald-400 font-bold">██████████ 100%</span>
                </div>
                <div className="flex justify-between items-center py-0.5 bg-rose-950/60 p-1.5 rounded border border-rose-500/40">
                  <span className="text-amber-300 font-bold">Digital Product Organization</span>
                  <span className="text-amber-400 font-bold">███████░░░ 70% ◀ (ACTIVE FOCUS)</span>
                </div>
                <pre className="text-slate-600">═══════════════════════════════════════════════</pre>
              </div>
            </div>

            {/* Strategic Tiering Framework (User Proposal) */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-rose-600" />
                    <Typography variant="h3" className="text-slate-900">Khung Phân Tầng Chiến Lược (Strategic Tiering Framework)</Typography>
                  </div>
                  <Typography variant="body-sm" className="text-slate-500">
                    Phân chia nguồn lực phát triển thành 3 tầng ưu tiên để luôn giữ tính thực tế, không ôm đồm và tăng trưởng bền vững.
                  </Typography>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
                  3 Investment Tiers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lpepStrategicTiers.map((tier) => (
                  <div 
                    key={tier.tierCode} 
                    className={`p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
                      tier.tierCode === 'Tier 1' 
                        ? 'bg-rose-50/60 border-rose-300 text-slate-900' 
                        : tier.tierCode === 'Tier 2' 
                        ? 'bg-amber-50/60 border-amber-300 text-slate-900' 
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                          tier.tierCode === 'Tier 1' ? 'bg-rose-600 text-white' : tier.tierCode === 'Tier 2' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-white'
                        }`}>
                          {tier.tierCode}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          {tier.tierCode === 'Tier 1' ? 'Mức Bắt Buộc (Core)' : tier.tierCode === 'Tier 2' ? 'Mức Nên Có (Growth)' : 'Mức Tầm Nhìn (Vision)'}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900">{tier.tierTitle}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{tier.strategicPurpose}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/60 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Các Module Bao Gồm</span>
                      <div className="flex flex-wrap gap-1.5">
                        {tier.includedModules.map((mod, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white text-slate-800 font-medium text-[11px] rounded-md border border-slate-200 shadow-2xs">
                            ✓ {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 1: Product Operating System (Product OS) */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow size={20} className="text-rose-400" />
                  <Typography variant="h3" className="text-white">Module 1 – Product Operating System (Product OS)</Typography>
                </div>
                <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full border border-rose-500/30">
                  Continuous Closed Loop
                </span>
              </div>

              <Typography variant="body-sm" className="text-slate-300">
                Vòng lặp vận hành sản phẩm liên tục, khép kín, đảm bảo mọi cải tiến mã nguồn đều bắt nguồn từ tầm nhìn chiến lược và phản hồi thực tế.
              </Typography>

              {/* Interactive Closed-Loop Diagram */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
                {lpepProductOsSteps.map((step) => (
                  <div key={step.sequence} className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-2 text-center relative group">
                    <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center justify-center mx-auto">
                      {step.sequence}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-white block">{step.stepName}</span>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{step.description}</p>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                      ACTIVE ↺
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 2 & 3: Strategy & OKR Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strategy Management */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass size={18} className="text-rose-600" />
                    <Typography variant="h4" className="text-slate-900">Module 2 – Strategy Management</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
                    Annual Direction
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 space-y-1">
                    <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Vision</span>
                    <p className="font-bold text-slate-900 text-sm">{lpepStrategyMgmt.vision}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Mission</span>
                    <p className="font-medium text-slate-800">{lpepStrategyMgmt.mission}</p>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Strategic Goals</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lpepStrategyMgmt.strategicGoals.map((goal, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-semibold flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* OKR Management */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target size={18} className="text-rose-600" />
                    <Typography variant="h4" className="text-slate-900">Module 3 – OKR Management</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Objective-Driven
                  </span>
                </div>

                <div className="space-y-3">
                  {lpepOkrItems.map((okr, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Objective #{idx + 1}: {okr.objective}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                          {okr.overallProgressPercent}% Achieved
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {okr.keyResults.map((kr, kIdx) => (
                          <div key={kIdx} className="p-2 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                            <span className="text-slate-700 font-medium">✓ {kr.krTitle}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500">Mục tiêu: {kr.targetVal}</span>
                              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Current: {kr.currentVal}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 4: Capability Maturity Model (CMM) */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={20} className="text-rose-600" />
                  <Typography variant="h3" className="text-slate-900">Module 4 – Capability Maturity Model (CMM Assessment)</Typography>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                  Org Maturity Audit
                </span>
              </div>

              <Typography variant="body-sm" className="text-slate-500">
                Đánh giá mức độ trưởng thành của LoveNote qua 7 lĩnh vực cốt lõi để xác định chính xác điểm cần đầu tư nâng cấp tiếp theo.
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {lpepCapabilityMaturity.map((cmm) => (
                  <div key={cmm.domain} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{cmm.domain} Domain</span>
                      <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] rounded-full">
                        Level {cmm.maturityLevel} / 5
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" 
                        style={{ width: `${(cmm.maturityLevel / 5) * 100}%` }}
                      />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">{cmm.strategicFocus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 5: Decision Quality System */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainCircuit size={20} className="text-rose-600" />
                  <Typography variant="h3" className="text-slate-900">Module 5 – Decision Quality System</Typography>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                  AI Decision Learning Engine
                </span>
              </div>

              <Typography variant="body-sm" className="text-slate-500">
                Đánh giá chất lượng quyết định dựa trên Bằng chứng (Evidence), Thực thi (Execution) & Kết quả (Result) để AI học hỏi từ lịch sử.
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {lpepDecisionQuality.map((dq, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                    <h5 className="font-bold text-xs text-slate-900">{dq.decisionTitle}</h5>

                    <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
                      <div className="p-1.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                        Evidence: {dq.evidenceQuality}
                      </div>
                      <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
                        Exec: {dq.executionRating}
                      </div>
                      <div className="p-1.5 bg-purple-50 text-purple-700 rounded border border-purple-200">
                        {dq.resultOutcome}
                      </div>
                    </div>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                      <strong className="text-rose-600 block mb-0.5">💡 AI Learning Insight:</strong>
                      {dq.aiLearningInsight}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 6 & 7: Knowledge Graph & Organizational Memory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Knowledge Graph */}
              <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network size={18} className="text-rose-400" />
                    <Typography variant="h4" className="text-white">Module 6 – Product Knowledge Graph</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 text-xs font-bold rounded-full border border-rose-500/30">
                    Full Traceability
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {lpepKnowledgeGraph.map((node) => (
                    <div key={node.nodeId} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-300">{node.nodeId}: {node.featureName}</span>
                        <span className="text-[10px] bg-slate-700 text-slate-200 px-2 py-0.5 rounded">{node.linkedReleaseVersion}</span>
                      </div>

                      <div className="p-2.5 bg-slate-950/70 rounded-xl text-[11px] text-slate-300 space-y-1 font-mono">
                        <div>Feature ➔ <span className="text-amber-300">{node.linkedDecision}</span></div>
                        <div>Requirement ➔ <span className="text-cyan-300">{node.linkedRequirement}</span></div>
                        <div>Code & Test ➔ <span className="text-emerald-300">{node.linkedCodeModule}</span> | <span className="text-indigo-300">{node.linkedTestSuite}</span></div>
                        <div>User Feedback ➔ <span className="text-pink-300">{node.userFeedbackSummary}</span></div>
                      </div>

                      <div className="text-[11px] text-emerald-400 font-medium">
                        ➔ Continuous Improvement: {node.continuousImprovement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizational Memory */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={18} className="text-rose-600" />
                    <Typography variant="h4" className="text-slate-900">Module 7 – Organizational Memory</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-200">
                    Knowledge Retention
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {lpepOrgMemory.map((mem, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{mem.title}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">{mem.memoryCategory}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{mem.recordSummary}</p>
                      <span className="text-[10px] text-emerald-700 font-semibold block">Retention Value: {mem.knowledgeRetentionValue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 8 & 9: Continuous Governance & Executive Organization Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Governance Automation */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-rose-600" />
                    <Typography variant="h4" className="text-slate-900">Module 8 – Continuous Governance</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Monthly Auto Audit
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {lpepContinuousGovernance.map((gov, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{gov.reviewDomain} Review ({gov.reviewCadence})</span>
                        <span className="text-[11px] text-slate-500">Artifact: {gov.generatedArtifact}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                        ✓ {gov.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizational Dashboard */}
              <div className="p-6 bg-gradient-to-br from-slate-900 via-rose-950 to-slate-950 text-white rounded-3xl border border-rose-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-amber-400" />
                    <Typography variant="h4" className="text-white">Module 9 – Executive Organization Dashboard</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                    Executive Health
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-emerald-400">{lpepOrgExecutiveDashboard.orgHealthPercent}%</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Org Health</div>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-rose-400">{lpepOrgExecutiveDashboard.decisionQualityPercent}%</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Decision Quality</div>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-amber-400">{lpepOrgExecutiveDashboard.innovationVelocityPercent}%</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Innovation Velocity</div>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-cyan-400">{lpepOrgExecutiveDashboard.technicalDebtPercent}%</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Technical Debt</div>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-indigo-400">{lpepOrgExecutiveDashboard.employeeKnowledgePercent}%</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Knowledge Retain</div>
                  </div>

                  <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-center">
                    <div className="text-2xl font-black text-purple-400">{lpepOrgExecutiveDashboard.releaseStabilityPercent}%</div>
                    <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mt-1">Release Stability</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 10: Definition of Done Certification Checklist */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={20} className="text-emerald-600" />
                  <Typography variant="h3" className="text-slate-900">Module 10 – Phase 4.5 Definition of Done (DOD Checklist)</Typography>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  6/6 Certified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lpepPhase45Dod.map((dod) => (
                  <div key={dod.criterionId} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{dod.title}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">{dod.criterionId}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{dod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 7: LOVENOTE DIGITAL EXCELLENCE FRAMEWORK (LDEF) - PHASE 5.1 BUSINESS & ECOSYSTEM */}
        {activeTab === 'ldef_business_org' && (
          <motion.div key="ldef_business_org_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {/* Header Philosophy Banner */}
            <div className="p-8 bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 text-white rounded-3xl border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                  <Award size={16} className="text-amber-400 animate-pulse" />
                  <span>LoveNote Digital Excellence Framework (LDEF v1.0) • Phase 5.1</span>
                </div>
                <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30">
                  Business & Ecosystem Strategy (Pillar 4: Business Excellence)
                </span>
              </div>

              <div className="space-y-2 relative z-10">
                <Typography variant="h2" className="text-white tracking-tight">
                  LoveNote Digital Excellence Framework (LDEF)
                </Typography>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-amber-300 font-medium text-sm leading-relaxed italic">
                  "LDEF không chỉ là một chương trình phát triển ngắn hạn. Đây là Framework quản trị toàn bộ vòng đời sản phẩm LoveNote — áp dụng đồng bộ cho LoveNote 1.x, 2.x, Enterprise, Education và Cloud."
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl relative z-10">
                LDEF định hình lại LoveNote như một hệ sinh thái sản phẩm bền vững có chiến lược kinh doanh thương mại rõ ràng, kiến trúc đối tác linh hoạt, kiểm soát thương hiệu tuyệt đối và khả năng phát triển dài hạn mà không phụ thuộc vào cá nhân.
              </p>
            </div>

            {/* ASCII Terminal Excellence Dashboard */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-amber-500/30 font-mono text-xs text-slate-200 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Terminal size={16} />
                  <span>📊 LoveNote Excellence Dashboard (LDEF Terminal)</span>
                </div>
                <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  LDEF v1.0 Locked Standard
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] sm:text-xs leading-snug font-mono overflow-x-auto">
                <pre className="text-amber-400 font-bold">LOVE NOTE DIGITAL EXCELLENCE</pre>
                <pre className="text-slate-600">──────────────────────────────────────────────</pre>
                {ldefPillars.map((p, idx) => (
                  <div key={idx} className={`flex justify-between items-center py-0.5 px-1.5 rounded ${
                    p.pillarName === 'Business Excellence' ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300' : 'text-slate-300'
                  }`}>
                    <span className="font-semibold">{p.pillarName}</span>
                    <span className={p.completionPercent === 100 ? 'text-emerald-400 font-bold' : p.completionPercent > 0 ? 'text-amber-400 font-bold' : 'text-slate-600'}>
                      {p.completionPercent === 100 ? '██████████ 100%' : p.completionPercent > 0 ? '███████░░░ 70% ◀' : '░░░░░░░░░░   0%'} ({p.statusLabel})
                    </span>
                  </div>
                ))}
                <pre className="text-slate-600">═══════════════════════════════════════════════</pre>
              </div>
            </div>

            {/* Framework Lock Announcement Card */}
            <div className="p-6 bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 rounded-3xl border border-amber-300 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-600 text-white rounded-2xl shadow-xs">
                  <Lock size={20} />
                </div>
                <div>
                  <Typography variant="h3" className="text-slate-900">🎯 Chính Thức "Khóa" Framework (LDEF v1.0 Playbook Standard)</Typography>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mọi phiên bản tương lai (1.1, 1.2, 2.0...), tính năng mới, quyết định kiến trúc & thay đổi UX từ nay đều tuân thủ nguyên tắc LDEF.
                  </p>
                </div>
              </div>
              <div className="p-3.5 bg-white/80 rounded-2xl border border-amber-200/80 text-xs text-slate-700 leading-relaxed">
                ✓ Thiết lập <strong>"Playbook" quản trị chuẩn</strong> giúp duy trì tính nhất quán, bảo đảm trải nghiệm cảm xúc lãng mạn & chất lượng kỹ thuật trong nhiều năm khi sản phẩm và quy mô người dùng lớn lên.
              </div>
            </div>

            {/* Module 1: Business Model Management */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase size={20} className="text-amber-600" />
                  <Typography variant="h3" className="text-slate-900">Module 1 – Business Model Management</Typography>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                  5 Commercial Options
                </span>
              </div>

              <Typography variant="body-sm" className="text-slate-500">
                Xác định rõ các mô hình kinh doanh tiềm năng hỗ trợ ứng dụng. Việc định hình sẵn giúp mọi thiết kế kỹ thuật sau này không vô tình chặn các hướng phát triển.
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {ldefBusinessModels.map((bm) => (
                  <div key={bm.modelType} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{bm.modelType}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          bm.status === 'ACTIVE_READY' ? 'bg-emerald-100 text-emerald-800' : bm.status === 'ROADMAP_PLANNED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                        }`}>
                          {bm.status === 'ACTIVE_READY' ? '✅ Ready' : bm.status === 'ROADMAP_PLANNED' ? '⏳ Planned' : '🔬 Research'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{bm.description}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 pt-2 border-t border-slate-200 block">
                      Target: {bm.targetSegment}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 2: Ecosystem Strategy Map */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network size={20} className="text-amber-400" />
                  <Typography variant="h3" className="text-white">Module 2 – Ecosystem Strategy Map</Typography>
                </div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                  8 Core Pillars
                </span>
              </div>

              <Typography variant="body-sm" className="text-slate-300">
                Bản đồ định nghĩa 8 thành phần hệ sinh thái sản phẩm LoveNote. Mỗi thành phần có lộ trình nâng cấp riêng nhưng đều tuân theo Product Governance chung.
              </Typography>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {ldefEcosystem.map((eco) => (
                  <div key={eco.componentName} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-amber-300">LoveNote {eco.componentName}</span>
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-300">{eco.readinessStatus}</p>
                    <span className="text-[9px] text-slate-400 font-mono block">Governance: {eco.governanceProtocol}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 3 & 4: Partnership Readiness & Sustainability Framework */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Partnership Readiness */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-amber-600" />
                    <Typography variant="h4" className="text-slate-900">Module 3 – Partnership Readiness</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Architected Ready
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {ldefPartnerships.map((p, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{p.partnerCategory}</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                          {p.readinessStatus}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{p.integrationSpec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sustainability Framework */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-amber-600" />
                    <Typography variant="h4" className="text-slate-900">Module 4 – Sustainability Framework</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Unit Cost Control
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {ldefSustainability.map((s, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{s.costCategory}</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                          {s.currentCostProjection}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">Strategy: {s.optimizationStrategy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 5 & 6: Brand Consistency & Community Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Brand Consistency Audit */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette size={18} className="text-amber-600" />
                    <Typography variant="h4" className="text-slate-900">Module 5 – Brand Consistency Audit</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    100% Unified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ldefBrandChecks.map((b, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{b.touchpoint}</span>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      </div>
                      <p className="text-slate-600 text-[11px]">{b.brandGuidelineSummary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Strategy */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-amber-600" />
                    <Typography variant="h4" className="text-slate-900">Module 6 – Community Strategy</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    5 Pillars
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {ldefCommunity.map((c, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                      <span className="font-bold text-slate-900 block">{c.pillarName}</span>
                      <p className="text-slate-600 text-[11px]">{c.strategyAction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 7 & 8: Success Metrics & Strategic Review Mechanism */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Success Metrics */}
              <div className="p-6 bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 text-white rounded-3xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-amber-400" />
                    <Typography variant="h4" className="text-white">Module 7 – Business Success Metrics</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                    Target Exceeded
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {ldefBusinessMetrics.map((m, idx) => (
                    <div key={idx} className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">{m.metricTitle}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-amber-300">{m.currentValue}</span>
                        <span className="text-[10px] text-slate-400">Target: {m.targetGoal}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Review */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass size={18} className="text-amber-600" />
                    <Typography variant="h4" className="text-slate-900">Module 8 – Strategic Review</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Bi-Annual Cadence
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {ldefStrategicReviews.map((r, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{r.domain} ({r.cadencedPeriod})</span>
                        <span className="text-[11px] text-slate-600">{r.reviewOutput}</span>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 9 & 10: Definition of Done Certification Checklist */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={20} className="text-emerald-600" />
                  <Typography variant="h3" className="text-slate-900">Module 9 & 10 – Phase 5.1 Definition of Done (DOD Checklist)</Typography>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  6/6 Certified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ldefPhase51Dod.map((dod) => (
                  <div key={dod.criterionId} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{dod.title}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">{dod.criterionId}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{dod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 8: LDEF PHASE 5.2 – CONTINUOUS PRODUCT EVOLUTION CYCLE (CPEC) & FRAMEWORK FREEZE */}
        {activeTab === 'ldef_cpec_evolution' && (
          <motion.div key="ldef_cpec_evolution_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            
            {/* Header Philosophy Banner */}
            <div className="p-8 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl border border-indigo-500/30 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest">
                  <RotateCcw size={16} className="text-indigo-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>LoveNote Digital Excellence Framework (LDEF v1.0) • Phase 5.2</span>
                </div>
                <span className="px-3.5 py-1.5 bg-indigo-500/20 text-indigo-300 font-bold text-xs rounded-full border border-indigo-500/30">
                  Continuous Product Evolution Cycle (CPEC) & Framework Freeze
                </span>
              </div>

              <div className="space-y-2 relative z-10">
                <Typography variant="h2" className="text-white tracking-tight">
                  Continuous Product Evolution Cycle (CPEC)
                </Typography>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-indigo-300 font-medium text-sm leading-relaxed italic">
                  "Không phát triển theo Sprint. Không phát triển theo cảm hứng. Mà phát triển theo chu trình khép kín: Observe → Analyze → Decide → Build → Validate → Release → Learn → Observe."
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl relative z-10">
                Đây là <span className="text-amber-300 font-bold">Phase cuối cùng của Framework</span>. Sau Phase 5.2, LDEF v1.0 sẽ được "khóa" (Freeze) thành chuẩn nội bộ chuẩn hóa, vận hành lâu dài trong 5–10 năm tới mà không cần mở rộng thêm Phase mới.
              </p>
            </div>

            {/* ASCII Terminal Excellence Dashboard */}
            <div className="p-6 bg-slate-950 rounded-3xl border border-indigo-500/30 font-mono text-xs text-slate-200 space-y-3 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Terminal size={16} />
                  <span>📊 LoveNote Excellence Dashboard (LDEF v1.0 Locked Standard)</span>
                </div>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  Framework Freeze Ready
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] sm:text-xs leading-snug font-mono overflow-x-auto">
                <pre className="text-indigo-400 font-bold">LOVE NOTE DIGITAL EXCELLENCE</pre>
                <pre className="text-slate-600">──────────────────────────────────────────────</pre>
                {ldefPillars.map((p, idx) => (
                  <div key={idx} className={`flex justify-between items-center py-0.5 px-1.5 rounded ${
                    p.pillarName === 'Continuous Evolution' ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-300' : 'text-slate-300'
                  }`}>
                    <span className="font-semibold">{p.pillarName}</span>
                    <span className={p.completionPercent === 100 ? 'text-emerald-400 font-bold' : p.completionPercent >= 80 ? 'text-indigo-400 font-bold' : 'text-slate-600'}>
                      {p.completionPercent === 100 ? '██████████ 100%' : '████████░░ 80% ◀'} ({p.statusLabel})
                    </span>
                  </div>
                ))}
                <pre className="text-slate-600">═══════════════════════════════════════════════</pre>
              </div>
            </div>

            {/* Framework Freeze Proposal Card */}
            <div className="p-6 bg-gradient-to-r from-amber-50 via-indigo-50 to-amber-50 rounded-3xl border border-amber-300 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xs">
                  <Lock size={22} />
                </div>
                <div>
                  <Typography variant="h3" className="text-slate-900">🎯 Đề Xuất Chiến Lược Cuối Cùng: "Framework Freeze" (LDEF v1.0)</Typography>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Khóa chuẩn nội bộ — không mở rộng thêm Phase 5.3, 5.4... Chuyển trọng tâm hoàn toàn sang tạo ra giá trị người dùng.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 bg-white rounded-2xl border border-indigo-200 space-y-1.5">
                  <span className="font-bold text-xs text-indigo-900 block">1. Ổn định (Stability)</span>
                  <p className="text-xs text-slate-600">Đội ngũ luôn làm việc theo một "luật chơi" thống nhất, minh bạch và nhất quán.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-indigo-200 space-y-1.5">
                  <span className="font-bold text-xs text-indigo-900 block">2. Khả năng mở rộng (Scalability)</span>
                  <p className="text-xs text-slate-600">Các phiên bản 1.1, 2.0, Education, Enterprise... đều dùng chung nền tảng quản trị.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl border border-indigo-200 space-y-1.5">
                  <span className="font-bold text-xs text-indigo-900 block">3. Chuyển giao (Handover)</span>
                  <p className="text-xs text-slate-600">Thành viên mới chỉ cần học duy nhất 1 Framework là có thể tham gia vận hành ngay lập tức.</p>
                </div>
              </div>
            </div>

            {/* CPEC 8-Step Evolution Cycle Grid */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw size={20} className="text-indigo-600" />
                  <Typography variant="h3" className="text-slate-900">Chu Trình Cải Tiến Liên Tục (8-Step CPEC Engine)</Typography>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                  Living Operating Heartbeat
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {cpecSteps.map((step) => (
                  <div key={step.sequence} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{step.sequence}. {step.stepName}</span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded">
                          {step.cadence}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules 1 & 2: Observe & Analyze */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 1: Observe */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 1 – Observe (Nguồn dữ liệu)</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    Active Listening
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {cpecObservations.map((obs, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{obs.sourceName}</span>
                        <span className="text-[11px] text-slate-600">{obs.dataSource}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded">
                        {obs.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 2: Analyze */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 2 – Analyze (AI Studio Insights)</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                    AI Automated
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {cpecAnalyses.map((ana, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-900">{ana.metricChange}</span>
                        <span className="text-[11px] text-slate-600">Nguyên nhân: {ana.reasonDetected}</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">💡 Gợi ý: {ana.aiRecommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules 3 & 4: Strategic Decision & Controlled Delivery */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 3: Strategic Decision */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 3 – Strategic Decision</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Governed Gate
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {cpecDecisions.map((dec, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{dec.criteria}</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded">
                          {dec.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{dec.evaluationMethod}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 4: Controlled Delivery */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 4 – Controlled Delivery</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                    5-Stage Pipeline
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {cpecDeliveries.map((del, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{idx + 1}. {del.stage}</span>
                        <span className="text-[11px] text-slate-600">{del.governanceAction}</span>
                      </div>
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules 5 & 6: Learning Loop & Knowledge Vault */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 5: Learning Loop */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 5 – Learning Loop</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                    Post-Release
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {cpecLearningLoops.map((loop, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded inline-block ${
                        loop.category === 'Success' ? 'bg-emerald-100 text-emerald-800' :
                        loop.category === 'Failure' ? 'bg-rose-100 text-rose-800' :
                        loop.category === 'Lessons Learned' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {loop.category}
                      </span>
                      <p className="text-xs text-slate-700 mt-1">{loop.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 6: Knowledge Vault */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 6 – Product Knowledge Vault</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                    Permanent Memory
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {cpecKnowledgeVaults.map((vault, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{vault.vaultSection}</span>
                        <span className="text-[11px] text-slate-600">{vault.retentionType}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 font-bold text-[10px] rounded">
                        {vault.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules 7 & 8: Annual Health & Long-Term Vision Review */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Module 7: Annual Health Review */}
              <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-indigo-400" />
                    <Typography variant="h4" className="text-white">Module 7 – Annual Product Health Review</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30">
                    Yearly Audit
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {cpecHealthReviews.map((rev, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-300">{rev.domain}</span>
                        <span className="text-emerald-400 font-bold font-mono text-sm">{rev.annualHealthScore}/100</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">{rev.auditConclusion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module 8: Long-term Vision Review */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Compass size={18} className="text-indigo-600" />
                    <Typography variant="h4" className="text-slate-900">Module 8 – Long-term Vision Review</Typography>
                  </div>
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-200">
                    Strategy Check
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {cpecVisions.map((vis, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="font-bold text-slate-900 block">❓ {vis.reviewQuestion}</span>
                      <p className="text-slate-700 text-[11px]">💡 Insight: {vis.strategicInsight}</p>
                      <p className="text-indigo-700 text-[11px] font-semibold">🚀 Action: {vis.actionTaken}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module 9 & 10: Definition of Done Certification Checklist */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare size={20} className="text-indigo-600" />
                  <Typography variant="h3" className="text-slate-900">Module 9 & 10 – Phase 5.2 Definition of Done (DOD Certification & Freeze)</Typography>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                  6/6 Certified (Framework Frozen)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cpecDod.map((dod) => (
                  <div key={dod.criterionId} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{dod.title}</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">{dod.criterionId}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{dod.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 5: ROADMAP & PRODUCT GOVERNANCE */}
        {activeTab === 'roadmap_governance' && (
          <motion.div key="roadmap_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Long-term Product Roadmap & Product Governance Model</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Chuyển từ mô hình Sprint phát triển sang mô hình Product Governance với các cuộc rà soát định kỳ hàng tuần, hàng tháng, hàng quý & hàng năm.
                </Typography>
              </div>
            </div>

            {/* Long-term Roadmap */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-900 block">Lộ Trình Phát Triển Dài Hạn (Long-term Product Roadmap):</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {longTermRoadmap.map((rm) => (
                  <div key={rm.phaseTag} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-rose-50 text-rose-700 font-mono font-bold text-xs rounded-full border border-rose-100">
                          {rm.phaseTag}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {rm.readinessState}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-slate-400">{rm.timelineHorizon}</div>
                      <h4 className="font-bold text-slate-900 text-sm">{rm.coreVision}</h4>

                      <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-bold text-slate-700 block">Mục tiêu chính:</span>
                        <ul className="space-y-1 text-slate-600 list-disc list-inside">
                          {rm.keyDeliverables.map((kd, idx) => <li key={idx}>{kd}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Governance Cadences Table */}
            <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Compass size={18} className="text-rose-400" /> Khung Rà Soát Định Kỳ Product Governance Cadence
                </h4>
                <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full">
                  Active Governance Model
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {productGovernance.map((pg) => (
                  <div key={pg.reviewCadence} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 font-bold text-[10px] rounded-full">
                      Hàng {pg.reviewCadence === 'Weekly' ? 'Tuần' : pg.reviewCadence === 'Monthly' ? 'Tháng' : pg.reviewCadence === 'Quarterly' ? 'Quý' : 'Năm'}
                    </span>

                    <h5 className="font-bold text-white text-sm">{pg.cadenceFocus}</h5>
                    
                    <div className="space-y-1 text-slate-300 text-[11px] pt-1">
                      <div><strong>Chỉ số xem xét:</strong> {pg.keyMetricsReviewed.join(', ')}</div>
                      <div><strong>Trách nhiệm:</strong> {pg.responsibleStakeholders}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: PILOT COHORTS & DEPLOYMENT PLAN */}
        {activeTab === 'uat_pilot' && (
          <motion.div key="uat_pilot_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Pilot Cohorts & Deployment Plan (6 Nhóm Người Dùng Thực Tế)</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Thử nghiệm thực tế với 580 người dùng đại diện cho các nhóm khác nhau: Học sinh, Giáo viên, Cá nhân, Gia đình, Văn phòng & Người lớn tuổi.
                </Typography>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full shrink-0 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> 6/6 Cohorts Certified (CSAT 4.86/5.0)
              </span>
            </div>

            {/* Philosophy Banner */}
            <div className="p-6 bg-rose-950 text-white rounded-3xl border border-rose-500/30 relative overflow-hidden space-y-2">
              <div className="text-xs font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <Heart size={16} /> Triết Lý Phase 3.3 UAT & Pilot
              </div>
              <p className="text-base font-bold text-slate-100">
                "Một sản phẩm chỉ thực sự hoàn thiện khi người dùng không cần giải thích vẫn sử dụng được."
              </p>
              <p className="text-xs text-slate-300">
                Chúng ta không hỏi <i>"Ứng dụng có đẹp không?"</i> — Chúng ta hỏi: <i>"Bạn có hoàn thành công việc của mình không?"</i>
              </p>
            </div>

            {/* Pilot Cohorts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pilotGroups.map((group) => (
                <div key={group.groupId} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-rose-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        {group.participantCount} Người Tham Gia
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                        <Check size={12} /> {group.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{group.groupName}</h4>
                    <p className="text-xs text-slate-500 font-medium">{group.targetAudience}</p>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
                      <span className="font-bold text-slate-700 text-[11px] block">Nhiệm vụ thực tế (Use Cases):</span>
                      <ul className="space-y-1 text-slate-600 list-disc list-inside">
                        {group.useCases.map((uc, idx) => <li key={idx}>{uc}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs font-bold">
                    <div className="p-2 bg-rose-50/60 rounded-xl border border-rose-100">
                      <div className="text-[10px] text-slate-400 uppercase">Tỉ Lệ Thành Công</div>
                      <div className="text-rose-600 font-black text-sm">{group.taskSuccessRate}%</div>
                    </div>
                    <div className="p-2 bg-amber-50/60 rounded-xl border border-amber-100">
                      <div className="text-[10px] text-slate-400 uppercase">Hài Lòng CSAT</div>
                      <div className="text-amber-700 font-black text-sm">{group.satisfactionScore} / 5.0</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 2: UAT TASK SCENARIOS & METRICS */}
        {activeTab === 'uat_scenarios' && (
          <motion.div key="uat_scenarios_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">UAT Test Scenarios & Quantitative Metrics</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Kiểm thử kịch bản nhiệm vụ thực tế từ đầu đến cuối và đo lường chỉ số thời gian, tỉ lệ hoàn thành task, mức hài lòng.
                </Typography>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {uatMetrics.map((m, idx) => (
                <div key={idx} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">{m.metricName}</span>
                    <div className="text-xl font-black text-slate-900">{m.actualMeasured}</div>
                    <div className="text-[10px] text-slate-500 font-semibold">Mục tiêu: {m.targetGoal}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><CheckCircle2 size={12} /> Đạt Target</span>
                  </div>
                </div>
              ))}
            </div>

            {/* UAT Scenarios List */}
            <div className="space-y-4">
              {uatScenarios.map((sc) => (
                <div key={sc.scenarioId} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded-full">
                        {sc.scenarioId}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{sc.title}</span>
                    </div>

                    <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                      {sc.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700">Quy trình thực hiện (Task Steps):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                      {sc.stepsSequence.map((step, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 font-medium flex items-center gap-2">
                          <span className="w-5 h-5 bg-rose-600 text-white rounded-full font-bold text-[10px] flex items-center justify-center shrink-0">{idx + 1}</span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                    <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                      <span className="font-bold text-rose-900 block mb-0.5">KPI Mục Tiêu (Target Goal):</span>
                      <span className="text-rose-950 font-mono font-bold">{sc.targetMetric}</span>
                    </div>
                    <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-0.5">Kết Quả Đo Lường Thực Tế (Actual Measured):</span>
                      <span className="text-emerald-950 font-mono font-bold">{sc.actualResult} (Thành công {sc.successRate}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: BUG TRIAGE & UX REFINEMENT */}
        {activeTab === 'bug_triage' && (
          <motion.div key="bug_triage_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Bug Triage Dashboard & UX Refinement Rules</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Phân loại mức độ sự cố Critical, Major, Minor và áp dụng nguyên tắc tối ưu UX/UI mà không làm phình tính năng.
                </Typography>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full shrink-0 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> 0 Critical Bugs | 0 Blockers
              </span>
            </div>

            {/* UX Refinement Principle Banner */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300">🛑 Nguyên Tắc Vàng UX Refinement Sau UAT:</span>
              <span className="text-rose-400">Chỉ sửa UX, UI, Performance, Stability • Tuyệt đối không thêm tính năng mới!</span>
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              {['All', 'Critical', 'Major', 'Minor'].map(sev => (
                <button
                  key={sev}
                  onClick={() => setBugSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all ${
                    bugSeverityFilter === sev ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* Bug Triage Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-6">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-600" /> Quản Lý Lỗi & Tiến Độ Sửa Lỗi Chi Tiết
              </div>

              <div className="space-y-3">
                {filteredBugs.map((b) => (
                  <div key={b.bugId} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{b.bugId}</span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          b.severity === 'Critical' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          b.severity === 'Major' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-200 text-slate-800'
                        }`}>{b.severity}</span>
                        <span className="font-bold text-slate-900 text-sm">{b.title}</span>
                      </div>

                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full flex items-center gap-1">
                        <Check size={12} /> {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                      <div><strong>Khu vực ảnh hưởng:</strong> {b.impactArea}</div>
                      <div><strong>Phụ trách:</strong> {b.assignedTo}</div>
                      <div><strong>Phiên bản đã sửa:</strong> <code className="text-rose-600 font-bold">{b.fixVersion}</code></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: RELEASE CANDIDATE PIPELINE */}
        {activeTab === 'release_candidates' && (
          <motion.div key="rc_pipeline_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Release Candidate (RC) Build Pipeline</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Quy trình đóng gói các bản dựng kiểm thử RC1, RC2 đến RC3 trước khi mở cổng Go-Live chính thức.
                </Typography>
              </div>
            </div>

            <div className="space-y-4">
              {releaseCandidates.map((rc) => (
                <div key={rc.versionTag} className={`p-6 rounded-3xl border shadow-xs space-y-4 ${
                  rc.status === 'Approved for Launch' ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white border-emerald-500/40' : 'bg-white text-slate-900 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-2xl ${rc.status === 'Approved for Launch' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-100 text-slate-600'}`}>
                        <Rocket size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{rc.versionTag}</h4>
                        <p className="text-xs text-slate-400">Ngày đóng gói build: {rc.buildDate}</p>
                      </div>
                    </div>

                    <span className={`px-3 py-1 font-bold text-xs rounded-full ${
                      rc.status === 'Approved for Launch' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {rc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Tỉ Lệ Đạt Test Cases</div>
                      <div className="text-emerald-400 font-black text-lg">{rc.passRatePercentage}%</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Lỗi Critical</div>
                      <div className="text-rose-400 font-black text-lg">{rc.criticalBugCount}</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
                      <div className="text-[10px] text-slate-400 uppercase">Lỗi Major</div>
                      <div className="text-amber-400 font-black text-lg">{rc.majorBugCount}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 5: LOVENOTE READINESS REVIEW (GO-LIVE GATE) */}
        {activeTab === 'readiness_review' && (
          <motion.div key="readiness_tab" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">LoveNote Readiness Review (Go-Live Gate Sign-Off)</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Bảng kiểm phê duyệt phát hành thương mại duy nhất bao phủ 4 trụ cột: Product, Engineering, Operations & Business.
                </Typography>
              </div>
              <span className="px-4 py-1.5 bg-emerald-600 text-white font-black text-xs rounded-full shrink-0 flex items-center gap-1.5 shadow-lg">
                <CheckCircle2 size={16} /> 100% Go-Live Approved
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {readinessChecklist.map((group) => (
                <div key={group.domain} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      <ShieldCheck size={18} className="text-rose-600" /> Trụ Cột: {group.domain}
                    </h4>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                      Certified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    {group.checkItems.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> {item.label}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{item.status}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] pl-5">{item.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Sign-Off Commercial Action Card */}
            <div className="p-8 bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 text-white rounded-3xl border border-rose-500/40 text-center space-y-4 shadow-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full font-bold text-xs border border-rose-500/30">
                <Award size={16} /> Commercial Launch Authorization
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                LoveNote 1.0 Ready For Production Commercial Launch
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Tất cả các tiêu chí UAT, Performance, Security, Accessibility, Documentation & Operational Runbooks đã được kiểm định thành công 100%. Sẵn sàng phục vụ người dùng thương mại chính thức.
              </p>
              <div className="pt-2 flex justify-center">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-3 rounded-2xl shadow-xl flex items-center gap-2">
                  <Rocket size={18} /> Xác Nhận Phát Hành LoveNote 1.0 Commercial Release
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: USER DOCUMENTATION CENTER */}
        {activeTab === 'user_guides' && (
          <motion.div key="ug_center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">User Documentation Center (&lt; 5 Phút Đọc)</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Trung tâm hướng dẫn trực quan chia nhỏ theo từng module chức năng, ngắn gọn, dễ hiểu cho mọi lứa tuổi.
                </Typography>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full shrink-0 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> 100% Modules Documented
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
              {['All', 'Getting Started', 'Projects', 'Editor', 'AI Assistant', 'Memory', 'Timeline', 'Export', 'Cloud Sync', 'FAQ'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGuideCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                    guideCategoryFilter === cat ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredGuides.map((guide) => (
                <div key={guide.id} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-rose-300 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                        {guide.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> {guide.readingTimeMinutes} phút đọc
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">{guide.title}</h4>
                    <p className="text-xs text-rose-600 font-semibold bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                      💡 {guide.keyTakeaway}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {guide.sectionContent}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedGuideForModal(guide)}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Đọc Chi Tiết Bài Viết <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Guide Detail Modal */}
            {selectedGuideForModal && (
              <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 font-bold text-[10px] rounded-full">
                        {selectedGuideForModal.category}
                      </span>
                      <span className="text-xs text-slate-400">Phiên bản: {selectedGuideForModal.docVersion}</span>
                    </div>
                    <button onClick={() => setSelectedGuideForModal(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 font-bold">✕</button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg">{selectedGuideForModal.title}</h3>
                  <div className="p-3 bg-rose-50 text-rose-900 rounded-2xl text-xs font-semibold">
                    🎯 Tóm tắt: {selectedGuideForModal.keyTakeaway}
                  </div>

                  <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                    <p>{selectedGuideForModal.sectionContent}</p>
                    <p>Hướng dẫn này tuân thủ chuẩn ngắn gọn dưới 5 phút, hỗ trợ phóng to phông chữ và có thể truy xuất qua trợ lý AI.</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setSelectedGuideForModal(null)}>Đóng Bài Viết</Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE TUTORIAL & CONTEXT HELP */}
        {activeTab === 'interactive_help' && (
          <motion.div key="inter_help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Interactive Tutorial & Context Help Onboarding</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Mô phỏng hướng dẫn tương tác từng bước ngay trên giao diện và nút `?` trợ giúp ngữ cảnh thông minh.
                </Typography>
              </div>
            </div>

            {/* Tutorial Walkthrough Simulator */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                    <PlayCircle size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-base text-slate-100">Mô Phỏng Trải Nghiệm Onboarding Tương Tác (In-App Step Tour)</div>
                    <div className="text-xs text-slate-400">Bước {currentTutorialStep + 1} / {tutorialSteps.length}: {tutorialSteps[currentTutorialStep].title}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentTutorialStep(prev => Math.max(0, prev - 1))}
                    disabled={currentTutorialStep === 0}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
                  >
                    Quay Lại
                  </button>
                  <button 
                    onClick={() => setCurrentTutorialStep(prev => (prev + 1) % tutorialSteps.length)}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500"
                  >
                    {currentTutorialStep === tutorialSteps.length - 1 ? 'Xem Bắt Đầu Lại' : 'Tiếp Theo'}
                  </button>
                </div>
              </div>

              {/* Step Card Visual Highlight */}
              <div className="p-6 bg-slate-800/90 rounded-2xl border border-rose-500/40 relative overflow-hidden space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
                  <Sparkles size={14} /> Element Highlight Target: {tutorialSteps[currentTutorialStep].targetUiElement}
                </div>
                <h4 className="font-bold text-white text-base">{tutorialSteps[currentTutorialStep].title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tutorialSteps[currentTutorialStep].instructionText}</p>
                
                <div className="pt-2 flex justify-end">
                  <span className="px-3 py-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl">
                    {tutorialSteps[currentTutorialStep].actionButtonLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Context Help Demo Button */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <QuestionIcon size={18} className="text-rose-600" /> Nút Trợ Giúp Ngữ Cảnh (Context Help `?`)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">Nhấn nút `?` ở bất kỳ màn hình nào để mở đúng tài liệu cho chức năng đó.</p>
                </div>

                <button 
                  onClick={() => setContextHelpOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors"
                >
                  <QuestionIcon size={16} /> Thử Nút Context Help (?)
                </button>
              </div>

              {contextHelpOpen && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-950 space-y-2">
                  <div className="flex items-center justify-between font-bold text-rose-900">
                    <span>📖 Context Help Modal Active: Screen [Memory Timeline Manager]</span>
                    <button onClick={() => setContextHelpOpen(false)} className="text-rose-700 hover:text-rose-950 font-bold">✕ Đóng</button>
                  </div>
                  <p className="text-slate-700">Tự động mở tài liệu: <strong>"Dòng Thời Gian Tương Tác & Lọc Sự Kiện"</strong>. Người dùng không phải tìm kiếm thủ công trong danh mục trợ giúp chung.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: AI KNOWLEDGE ASSISTANT SIMULATOR */}
        {activeTab === 'ai_assistant_sim' && (
          <motion.div key="ai_sim" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">AI Knowledge Assistant (In-App Action Guide)</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Trợ lý AI thông minh không chỉ trả lời văn bản suông mà trực tiếp mở màn hình, làm nổi bật nút bấm và hướng dẫn từng bước.
                </Typography>
              </div>
            </div>

            <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                  <Wand2 size={24} />
                </div>
                <div>
                  <div className="font-bold text-base text-slate-100">Trợ Lý AI Dẫn Đường & Kích Hoạt Nút Bấm Thực Tế</div>
                  <div className="text-xs text-slate-400">Nhập câu hỏi để thử nghiệm tính năng tự làm nổi bật giao diện</div>
                </div>
              </div>

              {/* Chat Prompt Box */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={aiUserQuery}
                    onChange={e => setAiUserQuery(e.target.value)}
                    placeholder="Ví dụ: Làm sao tạo thiệp sinh nhật?"
                    className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                  <button 
                    onClick={runAiAssistantSimulation}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shrink-0"
                  >
                    <Sparkles size={16} /> Gửi AI Yêu Cầu
                  </button>
                </div>

                {/* AI Response Box */}
                {aiResponseState !== 'idle' && (
                  <div className="p-5 bg-slate-800/90 rounded-2xl border border-rose-500/30 space-y-3 text-xs">
                    {aiResponseState === 'analyzing' ? (
                      <div className="flex items-center gap-2 text-rose-400 font-bold animate-pulse">
                        <RefreshCw size={14} className="animate-spin" /> AI đang định vị màn hình và công cụ tương ứng...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-rose-400 font-bold">
                          <span className="flex items-center gap-1.5"><CheckCircle2 size={16} /> AI đã tìm thấy công cụ phù hợp!</span>
                          <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">Screen Target: Export Studio</span>
                        </div>
                        <p className="text-slate-200">
                          Để tạo thiệp sinh nhật: <strong>Bước 1:</strong> Bấm vào nút <strong>"Export & Thiệp"</strong> ở thanh công cụ chính bên phải. <strong>Bước 2:</strong> Chọn Mẫu "Birthday Celebration".
                        </p>

                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
                          <span className="text-slate-400 text-[11px]">Nút công cụ đã được làm nổi bật trực tiếp:</span>
                          <button id="btn_export_card" className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${
                            highlightedUiButton === 'btn_export_card' ? 'bg-rose-600 text-white ring-4 ring-rose-500/50 scale-105 animate-bounce' : 'bg-slate-700 text-slate-300'
                          }`}>
                            ✨ Nút Export Thiệp Sinh Nhật (Highlighted)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: DEVELOPER PORTAL & API REFERENCE */}
        {activeTab === 'dev_portal' && (
          <motion.div key="dev_port" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Developer Portal & API Reference Standards</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Chuẩn hóa tài liệu API, Plugin SDK, Architecture, Database Schema & AI Pipeline cho lập trình viên mở rộng.
                </Typography>
              </div>
            </div>

            {/* API Reference Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4 p-6">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Code size={18} className="text-rose-600" /> API Reference Endpoint Specifications
              </div>

              <div className="space-y-4">
                {apiEndpoints.map((api, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          api.method === 'GET' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>{api.method}</span>
                        <span className="font-bold text-slate-900">{api.endpointPath}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-sans">{api.purpose}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-sans">
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-1">Input Parameters:</span>
                        <code className="text-rose-600 text-[10px]">{api.inputParams}</code>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-700 block mb-1">Output JSON Response:</span>
                        <code className="text-emerald-700 text-[10px]">{api.outputResponse}</code>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] flex justify-between items-center">
                      <span>Example: <code>{api.exampleSnippet}</code></span>
                      <span className="text-[10px] text-rose-400 font-sans font-bold">Errors: {api.errorCodes.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plugin SDK Guide Overview */}
            <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4">
              <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Layers size={18} className="text-rose-400" /> Plugin SDK Developer Specifications
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pluginTopics.map((pt, idx) => (
                  <div key={idx} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-2 text-xs">
                    <div className="font-bold text-rose-400 text-sm">{pt.topic}</div>
                    <div className="text-slate-300"><strong>Lifecycle:</strong> {pt.lifecyclePhase}</div>
                    <div className="text-slate-300"><strong>Permissions:</strong> {pt.permissions}</div>
                    <div className="p-2 bg-slate-950 rounded-xl font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      {pt.codeExample}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: ARCHITECTURE DECISION LOG (ADR) */}
        {activeTab === 'adr_decision_log' && (
          <motion.div key="adr_log" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Architecture Decision Records (ADR Decision Log)</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Nhật ký lưu giữ bối cảnh, lý do và tác động của các quyết định kiến trúc quan trọng xuyên suốt dự án.
                </Typography>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full shrink-0 flex items-center gap-1.5">
                <CheckCircle2 size={14} /> 4 Key ADRs Logged
              </span>
            </div>

            <div className="space-y-4">
              {adrRecords.map((adr) => (
                <div key={adr.adrId} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded-full">
                        {adr.adrId}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">Ghi nhận: {adr.decisionDate}</span>
                    </div>

                    <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                      {adr.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{adr.title}</h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-1">Bối Cảnh (Context):</span>
                      <p className="text-slate-600 leading-relaxed">{adr.context}</p>
                    </div>

                    <div className="p-3 bg-rose-50/60 rounded-2xl border border-rose-100">
                      <span className="font-bold text-rose-900 block mb-1">Quyết Định (Decision):</span>
                      <p className="text-rose-950 leading-relaxed font-medium">{adr.decision}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-1">Tác Động (Consequences):</span>
                      <p className="text-emerald-950 leading-relaxed font-medium">{adr.consequences}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 6: RELEASE NOTES CENTER */}
        {activeTab === 'release_notes' && (
          <motion.div key="rel_notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Release Notes Center</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Thông tin phát hành chi tiết tính năng mới, cải tiến hiệu năng, sửa lỗi và vấn đề tồn đọng cho từng phiên bản.
                </Typography>
              </div>
            </div>

            {releaseNotes.map((rn, idx) => (
              <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Rocket size={20} className="text-rose-600" /> {rn.versionNumber}
                  </h4>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{rn.releaseDate}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                    <span className="font-bold text-emerald-900 flex items-center gap-1"><Sparkles size={14} /> Tính Năng Mới</span>
                    <ul className="space-y-1 text-emerald-950 list-disc list-inside">
                      {rn.newFeatures.map((f, fIdx) => <li key={fIdx}>{f}</li>)}
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 space-y-2">
                    <span className="font-bold text-blue-900 flex items-center gap-1"><Zap size={14} /> Cải Tiến</span>
                    <ul className="space-y-1 text-blue-950 list-disc list-inside">
                      {rn.improvements.map((i, iIdx) => <li key={iIdx}>{i}</li>)}
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1"><CheckCircle2 size={14} /> Sửa Lỗi</span>
                    <ul className="space-y-1 text-slate-700 list-disc list-inside">
                      {rn.bugFixes.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                    <span className="font-bold text-amber-900 flex items-center gap-1"><AlertCircle size={14} /> Known Issues</span>
                    <ul className="space-y-1 text-amber-950 list-disc list-inside">
                      {rn.knownIssues.map((k, kIdx) => <li key={kIdx}>{k}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* TAB 7: PHASE 2 READINESS AUDIT REFERENCE */}
        {activeTab === 'a11y_perf_audit' && (
          <motion.div key="a11y_ref" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Phase 2 Audit Reference (Accessibility & Performance)</Typography>
                <Typography variant="body-sm" className="text-slate-500">
                  Kết quả kiểm định WCAG 2.2 AA, Keyboard Navigation, Font Scaling, Reduced Motion & Gate Framework.
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {a11yMetrics.map((metric, idx) => (
                <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{metric.domain}</span>
                      <span className="font-black text-rose-600 text-lg">{metric.scorePercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                      <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${metric.scorePercentage}%` }} />
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{metric.details}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                    <span>{metric.standardsRef}</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-0.5"><Check size={12} /> {metric.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`pb-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
      active ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MeterItem: React.FC<{ label: string, percentage: number, complete?: boolean, active?: boolean, warning?: boolean }> = ({ label, percentage, complete, active, warning }) => (
  <div className={`p-2 rounded-xl border flex flex-col justify-between ${
    active ? 'bg-rose-500/20 border-rose-400 text-white' : complete ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
  }`}>
    <div className="font-bold text-[9px] truncate">{label}</div>
    <div className="flex items-center justify-between mt-1">
      <span className="font-mono font-bold text-[11px]">{percentage}%</span>
      {complete && <CheckCircle2 size={12} className="text-emerald-400" />}
      {warning && <Clock size={12} className="text-amber-400" />}
    </div>
  </div>
);
