import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radio, Bug, MessageSquare, ToggleLeft, Gauge, Eye, Languages, 
  CheckCircle2, AlertTriangle, Send, Sparkles, ShieldCheck, ThumbsUp,
  Activity, Zap, Paperclip, Terminal, Cpu, RefreshCw, Layers, Globe,
  FileCheck, Shield, ChevronRight, HelpCircle, HeartHandshake
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { releaseService } from '../../modules/release/ReleaseService';
import { ReleaseChannel, FeatureFlag, FeedbackEntry, PerformanceMetric, ReleaseReadinessItem, KnownIssue, BetaRoadmapItem } from '../../modules/release/types';

export const BetaPortalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'channels' | 'feedback' | 'performance' | 'a11y' | 'community' | 'readiness'>('channels');
  
  const [channel, setChannel] = useState<ReleaseChannel>(releaseService.getChannel());
  const [language, setLanguage] = useState(releaseService.getLanguage());
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>(releaseService.getFeatureFlags());
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>(releaseService.getFeedback());
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(releaseService.getPerformanceMetrics());
  const [knownIssues, setKnownIssues] = useState<KnownIssue[]>(releaseService.getKnownIssues());
  const [roadmap, setRoadmap] = useState<BetaRoadmapItem[]>(releaseService.getBetaRoadmap());
  const [readinessItems, setReadinessItems] = useState<ReleaseReadinessItem[]>(releaseService.getReadinessItems());

  // Form State for Feedback
  const [fbType, setFbType] = useState<'bug' | 'feature' | 'experience' | 'general'>('bug');
  const [fbTitle, setFbTitle] = useState('');
  const [fbDesc, setFbDesc] = useState('');
  const [includeLogs, setIncludeLogs] = useState(true);
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [fbSubmitted, setFbSubmitted] = useState(false);

  // Crash Dialog state
  const [showCrashModal, setShowCrashModal] = useState(false);
  const [crashReportSent, setCrashReportSent] = useState(false);

  const handleChannelChange = (newChan: ReleaseChannel) => {
    releaseService.setChannel(newChan);
    setChannel(newChan);
  };

  const handleToggleFlag = (id: string) => {
    releaseService.toggleFeatureFlag(id);
    setFeatureFlags([...releaseService.getFeatureFlags()]);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbTitle.trim()) return;

    releaseService.addFeedback({
      type: fbType,
      title: fbTitle,
      description: fbDesc,
      includeLogs,
      includeScreenshot
    });

    setFeedbackList([...releaseService.getFeedback()]);
    setFbTitle('');
    setFbDesc('');
    setFbSubmitted(true);

    setTimeout(() => setFbSubmitted(false), 3000);
  };

  const handleVoteRoadmap = (id: string) => {
    releaseService.voteRoadmap(id);
    setRoadmap([...releaseService.getBetaRoadmap()]);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Radio size={16} />
              <span>Release Engineering • Sprint 91</span>
            </div>
            <Typography variant="h2" className="text-slate-900 tracking-tighter">
              Public Beta & Product Validation
            </Typography>
            <Typography variant="body" className="text-slate-500 mt-2 max-w-xl">
              Thử nghiệm phiên bản sớm, đóng góp ý kiến, kiểm tra hiệu năng và theo dõi mức độ sẵn sàng phát hành.
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-100 text-cyan-600 font-bold text-sm">
              Beta
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                LoveNote v0.91.0
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Kênh hiện tại: <span className="text-cyan-600 font-bold capitalize">{channel}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setActiveTab('channels')}
              className="ml-2 bg-white"
            >
              Đổi kênh
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 hide-scrollbar items-center justify-between">
        <div className="flex">
          <TabButton active={activeTab === 'channels'} onClick={() => setActiveTab('channels')} label="Beta Channels & Flags" icon={<Radio size={16} />} />
          <TabButton active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} label="Feedback Center" icon={<MessageSquare size={16} />} />
          <TabButton active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} label="Performance & Crash" icon={<Gauge size={16} />} />
          <TabButton active={activeTab === 'a11y'} onClick={() => setActiveTab('a11y')} label="Accessibility & i18n" icon={<Languages size={16} />} />
          <TabButton active={activeTab === 'community'} onClick={() => setActiveTab('community')} label="Beta Community" icon={<HeartHandshake size={16} />} />
          <TabButton active={activeTab === 'readiness'} onClick={() => setActiveTab('readiness')} label="Release Readiness" icon={<FileCheck size={16} />} />
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* 1. CHANNELS & FEATURE FLAGS */}
          {activeTab === 'channels' && (
            <motion.div key="channels" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              {/* Release Channel Selector */}
              <div>
                <Typography variant="h3" className="text-slate-900 mb-2">Chọn kênh phát hành (Release Channels)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">
                  Bạn có thể chuyển đổi linh hoạt giữa các kênh phát hành để thử nghiệm trước các tính năng mới.
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    onClick={() => handleChannelChange('stable')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      channel === 'stable' ? 'bg-emerald-50/50 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">Stable</span>
                      {channel === 'stable' && <CheckCircle2 size={18} className="text-emerald-600" />}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">Phiên bản ổn định</h4>
                    <p className="text-xs text-slate-500 mt-1">Được kiểm thử kỹ lưỡng, phù hợp cho nhu cầu lưu trữ kỷ niệm hàng ngày.</p>
                  </div>

                  <div 
                    onClick={() => handleChannelChange('beta')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      channel === 'beta' ? 'bg-cyan-50/50 border-cyan-500 shadow-sm ring-2 ring-cyan-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full">Public Beta</span>
                      {channel === 'beta' && <CheckCircle2 size={18} className="text-cyan-600" />}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">Phiên bản Beta</h4>
                    <p className="text-xs text-slate-500 mt-1">Trải nghiệm tính năng mới sớm hơn 2 tuần và đóng góp phản hồi.</p>
                  </div>

                  <div 
                    onClick={() => handleChannelChange('nightly')}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      channel === 'nightly' ? 'bg-purple-50/50 border-purple-500 shadow-sm ring-2 ring-purple-500/20' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">Nightly</span>
                      {channel === 'nightly' && <CheckCircle2 size={18} className="text-purple-600" />}
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">Cập nhật mỗi ngày</h4>
                    <p className="text-xs text-slate-500 mt-1">Dành cho nhà phát triển & tester. Có thể xuất hiện lỗi thử nghiệm.</p>
                  </div>
                </div>
              </div>

              {/* Feature Flags Section */}
              <div className="pt-6 border-t border-slate-100">
                <Typography variant="h3" className="text-slate-900 mb-2">Quản lý Feature Flags (Bật/tắt thử nghiệm)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">
                  Cho phép bạn dùng thử hoặc vô hiệu hóa từng tính năng thử nghiệm mà không làm ảnh hưởng toàn bộ ứng dụng.
                </Typography>

                <div className="space-y-3">
                  {featureFlags.map(flag => (
                    <div key={flag.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{flag.name}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            flag.status === 'enabled' ? 'bg-emerald-100 text-emerald-700' :
                            flag.status === 'beta' ? 'bg-cyan-100 text-cyan-700' :
                            flag.status === 'experimental' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {flag.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{flag.description}</p>
                      </div>

                      <button
                        onClick={() => handleToggleFlag(flag.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${flag.status === 'enabled' ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${flag.status === 'enabled' ? 'translate-x-7' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. FEEDBACK CENTER */}
          {activeTab === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Form */}
                <div className="w-full md:w-1/2 space-y-4">
                  <Typography variant="h3" className="text-slate-900">Gửi phản hồi cho đội ngũ phát triển</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Ý kiến của bạn trực tiếp giúp LoveNote hoàn thiện hơn mỗi ngày.</Typography>

                  <form onSubmit={handleSubmitFeedback} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Loại phản hồi</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['bug', 'feature', 'experience', 'general'] as const).map(type => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFbType(type)}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all capitalize ${
                              fbType === type ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {type === 'bug' ? '🐛 Báo lỗi' : type === 'feature' ? '✨ Tính năng' : type === 'experience' ? '🎨 Trải nghiệm' : '💬 Chung'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Tóm tắt ngắn gọn vấn đề hoặc ý tưởng..."
                        value={fbTitle}
                        onChange={e => setFbTitle(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả chi tiết</label>
                      <textarea 
                        rows={4}
                        placeholder="Chi tiết cách tái hiện lỗi hoặc lý do tính năng này hữu ích..."
                        value={fbDesc}
                        onChange={e => setFbDesc(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={includeLogs} onChange={e => setIncludeLogs(e.target.checked)} className="rounded text-cyan-600 focus:ring-cyan-500" />
                        <span>Kèm theo nhật ký ẩn danh hệ thống (Anonymized System Logs)</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                        <input type="checkbox" checked={includeScreenshot} onChange={e => setIncludeScreenshot(e.target.checked)} className="rounded text-cyan-600 focus:ring-cyan-500" />
                        <span>Đính kèm ảnh chụp màn hình hiện tại</span>
                      </label>
                    </div>

                    <Button type="submit" variant="primary" className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2">
                      <Send size={16} /> Gửi phản hồi
                    </Button>

                    {fbSubmitted && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} /> Cảm ơn bạn! Phản hồi đã được ghi nhận.
                      </div>
                    )}
                  </form>
                </div>

                {/* Feedback Submitted History */}
                <div className="w-full md:w-1/2 border-l border-slate-100 pl-0 md:pl-8 space-y-4">
                  <Typography variant="h3" className="text-slate-900">Phản hồi đã gửi gần đây</Typography>
                  <div className="space-y-3">
                    {feedbackList.map(fb => (
                      <div key={fb.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 text-sm">{fb.title}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            fb.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                            fb.status === 'under_review' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {fb.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{fb.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{new Date(fb.timestamp).toLocaleString()}</span>
                          <span className="font-mono">Logs: {fb.includeLogs ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. PERFORMANCE & CRASH METRICS */}
          {activeTab === 'performance' && (
            <motion.div key="performance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="text-slate-900">Performance Dashboard & Health Metrics</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Giám sát tốc độ phản hồi và tài nguyên phần cứng theo thời gian thực.</Typography>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCrashModal(true)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-2"
                >
                  <AlertTriangle size={16} /> Thử nghiệm Crash Handler
                </Button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map(m => (
                  <div key={m.name} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-slate-500">{m.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Good
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-3xl font-black text-slate-900">{m.value}</span>
                      <span className="text-xs font-bold text-slate-500">{m.unit}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 flex justify-between">
                      <span>Ngưỡng tối đa: {m.threshold}{m.unit}</span>
                      <span className="text-emerald-600 font-bold">Tối ưu</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Crash Handler Modal Simulation */}
              {showCrashModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">Ứng dụng vừa gặp sự cố không mong muốn</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        LoveNote đã tự động khôi phục dữ liệu gần nhất. Bạn có muốn gửi báo cáo ẩn danh cho đội ngũ kỹ thuật?
                      </p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl font-mono text-[10px] text-rose-400 overflow-x-auto">
                      Uncaught ReferenceError: RenderBoundaryFailed at App.tsx:892
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCrashModal(false)}
                        className="flex-1"
                      >
                        Khởi động lại
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => {
                          setCrashReportSent(true);
                          setTimeout(() => {
                            setCrashReportSent(false);
                            setShowCrashModal(false);
                          }, 1500);
                        }}
                        className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                      >
                        {crashReportSent ? 'Đã gửi báo cáo!' : 'Gửi báo cáo'}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}

          {/* 4. ACCESSIBILITY & LOCALIZATION */}
          {activeTab === 'a11y' && (
            <motion.div key="a11y" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-2">Đa ngôn ngữ (Localization Framework)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">
                  LoveNote chuẩn bị phát hành toàn cầu với sự hỗ trợ đa ngôn ngữ hoàn chỉnh.
                </Typography>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
                    { code: 'en', label: 'English', flag: '🇺🇸' },
                    { code: 'ja', label: '日本語', flag: '🇯🇵' },
                    { code: 'ko', label: '한국어', flag: '🇰🇷' }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as any)}
                      className={`p-4 rounded-2xl border flex items-center justify-between font-bold text-sm transition-all ${
                        language === lang.code ? 'bg-slate-900 text-white border-slate-900 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <CheckCircle2 size={16} className="text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <Typography variant="h3" className="text-slate-900">Kiểm tra Trợ năng (Accessibility Audit - WCAG 2.1 AA)</Typography>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Keyboard Navigation</div>
                      <div className="text-xs text-slate-500">Cho phép dùng phím Tab và phím mũi tên toàn ứng dụng.</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">Passed</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">Screen Reader Compatibility</div>
                      <div className="text-xs text-slate-500">Đầy đủ thuộc tính aria-label cho trình đọc màn hình.</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">Passed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. BETA COMMUNITY & ROADMAP */}
          {activeTab === 'community' && (
            <motion.div key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Voting Roadmap */}
                <div className="w-full md:w-2/3 space-y-4">
                  <Typography variant="h3" className="text-slate-900">Lộ trình cộng đồng & Bình chọn tính năng</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Bình chọn để ưu tiên tính năng bạn muốn thấy trong phiên bản LoveNote 1.0 chính thức.</Typography>

                  <div className="space-y-3">
                    {roadmap.map(item => (
                      <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                        </div>

                        <button
                          onClick={() => handleVoteRoadmap(item.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-xs border transition-all shrink-0 ${
                            item.voted ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ThumbsUp size={14} />
                          <span>{item.votes}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Known Issues */}
                <div className="w-full md:w-1/3 border-l border-slate-100 pl-0 md:pl-8 space-y-4">
                  <Typography variant="h3" className="text-slate-900">Sự cố đang xử lý (Known Issues)</Typography>
                  <div className="space-y-3">
                    {knownIssues.map(issue => (
                      <div key={issue.id} className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
                        <div className="font-bold text-slate-900 text-xs">{issue.title}</div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2">
                          <span className="capitalize text-amber-700 font-bold">Status: {issue.status}</span>
                          <span>{issue.affectedVersions.join(', ')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. RELEASE READINESS */}
          {activeTab === 'readiness' && (
            <motion.div key="readiness" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="h3" className="text-slate-900">Release Readiness Dashboard (Cột mốc v1.0)</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Đánh giá tổng thể độ sẵn sàng để phát hành LoveNote 1.0 Stable.</Typography>
                </div>
                <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 size={16} /> 100% Ready
                </div>
              </div>

              <div className="space-y-3">
                {readinessItems.map(item => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500">{item.description}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600">{item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-5 py-3 flex items-center gap-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
      active ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);
