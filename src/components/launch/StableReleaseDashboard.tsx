import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Sparkles, Heart, ShieldCheck, Activity, Globe, HelpCircle, 
  RefreshCw, Lock, Award, BookOpen, Layers, CheckCircle2, AlertTriangle, 
  Smartphone, Monitor, Server, FileText, Download, Share2, Compass, Key, 
  BarChart3, Settings, ExternalLink, Zap, Users, Play, ShieldAlert, Cpu
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { launchService } from '../../modules/launch/LaunchService';
import { LicenseEditionType, PrivacyConfig } from '../../modules/launch/types';
import { WelcomeWizardModal } from './WelcomeWizardModal';

export const StableReleaseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'learning' | 'support' | 'privacy' | 'licenses' | 'playbook' | 'council'>('overview');
  const [showWelcomeWizard, setShowWelcomeWizard] = useState(false);

  const releaseInfo = launchService.getReleaseInfo();
  const releaseNotes = launchService.getReleaseNotes();
  const licenses = launchService.getLicenses();
  const healthMetrics = launchService.getHealthMetrics();
  const supportArticles = launchService.getSupportArticles();
  const [privacyConfig, setPrivacyConfig] = useState<PrivacyConfig>(launchService.getPrivacyConfig());
  const playbooks = launchService.getPlaybooks();
  const councilGoals = launchService.getCouncilGoals();
  const [updateMode, setUpdateMode] = useState<'auto' | 'notify' | 'manual'>(launchService.getUpdateMode());
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateCheckedMsg, setUpdateCheckedMsg] = useState('');

  const handleSelectEdition = (edition: LicenseEditionType) => {
    launchService.setEdition(edition);
  };

  const handleTogglePrivacy = (key: keyof PrivacyConfig) => {
    if (typeof privacyConfig[key] === 'boolean') {
      const updated = { [key]: !privacyConfig[key] };
      launchService.updatePrivacyConfig(updated);
      setPrivacyConfig({ ...privacyConfig, ...updated });
    }
  };

  const handleCheckUpdate = () => {
    setCheckingUpdate(true);
    setUpdateCheckedMsg('');
    setTimeout(() => {
      setCheckingUpdate(false);
      setUpdateCheckedMsg('Bạn đang sử dụng phiên bản mới nhất: LoveNote v1.0.0 Stable (Build 1000).');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Welcome Wizard Modal */}
      <WelcomeWizardModal isOpen={showWelcomeWizard} onClose={() => setShowWelcomeWizard(false)} />

      {/* Main Release Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 rounded-3xl p-8 border border-rose-500/30 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-80" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-widest mb-2">
              <Rocket size={16} />
              <span>Official Stable Release • Sprint 93</span>
            </div>
            <Typography variant="h2" className="text-white tracking-tighter">
              LoveNote 1.0.0 Stable Release
            </Typography>
            <Typography variant="body" className="text-slate-300 mt-2 max-w-2xl">
              Chính thức phát hành nền tảng sáng tạo kỷ niệm cá nhân & viết thư tình thông minh. Sẵn sàng vận hành thực tế trên Windows, Android và Web.
            </Typography>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowWelcomeWizard(true)}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 w-full sm:w-auto"
            >
              <Play size={16} /> Welcome Wizard
            </Button>
            <Button 
              variant="primary"
              onClick={handleCheckUpdate}
              className="bg-rose-500 hover:bg-rose-600 text-white gap-2 w-full sm:w-auto shadow-lg shadow-rose-500/30"
            >
              <RefreshCw size={16} className={checkingUpdate ? 'animate-spin' : ''} /> Kiểm tra cập nhật
            </Button>
          </div>
        </div>

        {/* Quick Info bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Phiên bản</div>
            <div className="font-bold text-white text-sm">v1.0.0 Stable</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Build Number</div>
            <div className="font-bold text-white text-sm">#1000</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Ngày phát hành</div>
            <div className="font-bold text-white text-sm">{releaseInfo.releaseDate}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Chế độ vận hành</div>
            <div className="font-bold text-emerald-400 text-sm flex items-center gap-1">
              <ShieldCheck size={14} /> Product Lifecycle (PLM)
            </div>
          </div>
        </div>
      </div>

      {updateCheckedMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} /> {updateCheckedMsg}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-slate-200 hide-scrollbar items-center justify-between">
        <div className="flex">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Release Notes" icon={<FileText size={16} />} />
          <TabButton active={activeTab === 'health'} onClick={() => setActiveTab('health')} label="Product Health SLA" icon={<Activity size={16} />} />
          <TabButton active={activeTab === 'learning'} onClick={() => setActiveTab('learning')} label="Learning Center" icon={<BookOpen size={16} />} />
          <TabButton active={activeTab === 'support'} onClick={() => setActiveTab('support')} label="Support Center" icon={<HelpCircle size={16} />} />
          <TabButton active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} label="Privacy & Data Center" icon={<Lock size={16} />} />
          <TabButton active={activeTab === 'licenses'} onClick={() => setActiveTab('licenses')} label="License & Editions" icon={<Key size={16} />} />
          <TabButton active={activeTab === 'playbook'} onClick={() => setActiveTab('playbook')} label="Operational Playbook" icon={<ShieldAlert size={16} />} />
          <TabButton active={activeTab === 'council'} onClick={() => setActiveTab('council')} label="Product Council (PLM)" icon={<Users size={16} />} />
        </div>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* 1. OVERVIEW & RELEASE NOTES */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-2">Thông tin phát hành LoveNote 1.0 (Release Notes)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">
                  Tổng hợp các điểm nhấn nổi bật, cải tiến hiệu năng và bản sửa lỗi trong cột mốc v1.0.
                </Typography>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Highlights */}
                  <div className="p-5 bg-rose-50/50 rounded-2xl border border-rose-100 space-y-3">
                    <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
                      <Sparkles size={16} className="text-rose-500" /> Điểm nhấn tính năng
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {releaseNotes.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bug Fixes */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-500" /> Lỗi đã khắc phục
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {releaseNotes.bugFixes.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Performance */}
                  <div className="p-5 bg-cyan-50/50 rounded-2xl border border-cyan-100 space-y-3">
                    <div className="font-bold text-cyan-900 text-sm flex items-center gap-2">
                      <Zap size={16} className="text-cyan-500" /> Tối ưu hiệu năng
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {releaseNotes.performanceGains.map((p, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-cyan-500 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Official Store & Distribution Packages */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <Typography variant="h3" className="text-slate-900">Website & Kênh phân phối chính thức</Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor size={24} className="text-blue-600" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Windows Edition</div>
                        <div className="text-xs text-slate-500">LoveNote-1.0.0-Setup.exe</div>
                      </div>
                    </div>
                    <Button variant="outline" className="text-xs bg-white">Download</Button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone size={24} className="text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Android App Bundle</div>
                        <div className="text-xs text-slate-500">LoveNote-release.aab</div>
                      </div>
                    </div>
                    <Button variant="outline" className="text-xs bg-white">Play Store</Button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe size={24} className="text-indigo-600" />
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Web SaaS Cloud</div>
                        <div className="text-xs text-slate-500">app.lovenote.io</div>
                      </div>
                    </div>
                    <Button variant="outline" className="text-xs bg-white">Mở Web</Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. PRODUCT HEALTH TELEMETRY */}
          {activeTab === 'health' && (
            <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Product Health Telemetry & Operating SLA</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Bảng theo dõi trực tiếp sức khỏe vận hành ứng dụng trong môi trường thực tế.</Typography>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {healthMetrics.map(hm => (
                  <div key={hm.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500">{hm.name}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {hm.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-3xl font-black text-slate-900">{hm.value}</span>
                      <span className="text-xs font-bold text-slate-500">{hm.unit}</span>
                    </div>

                    <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-200/60 flex justify-between">
                      <span>Ngưỡng an toàn SLA: {hm.threshold}</span>
                      <span className="text-emerald-600 font-bold">Tối ưu</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 3. IN-APP LEARNING CENTER */}
          {activeTab === 'learning' && (
            <motion.div key="learning" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">In-app Learning Center & Tutorials</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Trung tâm hướng dẫn tương tác giúp người dùng nhanh chóng làm chủ mọi tính năng.</Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {supportArticles.map(art => (
                  <div key={art.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full">
                        {art.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-3">{art.title}</h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{art.summary}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200/60 text-slate-400">
                      <span>{art.helpfulCount} người thấy hữu ích</span>
                      <Button variant="outline" className="text-[10px] bg-white h-7 px-2">Đọc tiếp</Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 4. SUPPORT CENTER */}
          {activeTab === 'support' && (
            <motion.div key="support" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-4 w-full md:w-2/3">
                  <Typography variant="h3" className="text-slate-900">Support Center & FAQ</Typography>
                  <Typography variant="body-sm" className="text-slate-500">Mọi câu hỏi thường gặp và kênh trợ giúp trực tiếp cho người dùng LoveNote.</Typography>

                  <div className="space-y-3 pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="font-bold text-slate-900 text-sm">LoveNote có lưu dữ liệu riêng tư của tôi lên máy chủ không?</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Không. LoveNote hoạt động theo nguyên tắc Local-First. Toàn bộ thư tình và ảnh của bạn được lưu trực tiếp trên thiết bị, trừ khi bạn chủ động bật đồng bộ hóa Cloud mã hóa.
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="font-bold text-slate-900 text-sm">Làm thế nào để xuất file PDF in ấn kỷ niệm chất lượng cao?</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Mở dự án trong Studio Editor → Nhấp vào nút Xuất File (Export) trên thanh công cụ → Chọn định dạng PDF Vector 300DPI.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Box */}
                <div className="w-full md:w-1/3 bg-rose-50/60 p-6 rounded-2xl border border-rose-100 space-y-4">
                  <Typography variant="h4" className="text-rose-900">Liên hệ Hỗ trợ Trực tiếp</Typography>
                  <p className="text-xs text-rose-700">Đội ngũ kỹ thuật LoveNote luôn lắng nghe mọi phản hồi của bạn.</p>

                  <Button variant="primary" className="w-full bg-rose-500 hover:bg-rose-600 text-white gap-2 text-xs">
                    <HelpCircle size={14} /> Gửi yêu cầu hỗ trợ
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. PRIVACY CENTER */}
          {activeTab === 'privacy' && (
            <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Privacy & Data Governance Center</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Minh bạch tuyệt đối trong việc quản lý quyền riêng tư và dữ liệu cá nhân.</Typography>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Tổng dung lượng kỷ niệm đã lưu trữ</div>
                    <div className="text-xs text-slate-500">Mã hóa AES-256 trên bộ nhớ cục bộ thiết bị.</div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-base">{privacyConfig.totalDataSizeMB} MB</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Cách ly dữ liệu Plugin (Plugin Sandbox)</div>
                    <div className="text-xs text-slate-500">Ngăn các plugin bên ngoài truy cập bộ nhớ khi chưa được cấp quyền.</div>
                  </div>
                  <button 
                    onClick={() => handleTogglePrivacy('pluginDataIsolation')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${privacyConfig.pluginDataIsolation ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${privacyConfig.pluginDataIsolation ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Chia sẻ dữ liệu ẩn danh cho Gemini AI</div>
                    <div className="text-xs text-slate-500">Cho phép AI học ngữ cảnh câu văn để đưa ra gợi ý cảm xúc tốt hơn.</div>
                  </div>
                  <button 
                    onClick={() => handleTogglePrivacy('aiContextTraining')}
                    className={`w-12 h-6 rounded-full transition-colors relative ${privacyConfig.aiContextTraining ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${privacyConfig.aiContextTraining ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 6. LICENSE & EDITIONS */}
          {activeTab === 'licenses' && (
            <motion.div key="licenses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Khung Gói Cước & Bản quyền (License Framework)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Lựa chọn gói bản quyền phù hợp với nhu cầu cá nhân hoặc tổ chức của bạn.</Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {licenses.map(lic => (
                  <div 
                    key={lic.edition}
                    className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                      lic.active ? 'bg-rose-50/60 border-rose-500 shadow-md ring-2 ring-rose-500/20' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-slate-900 text-base">{lic.displayName}</span>
                        {lic.active && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-2.5 py-0.5 rounded-full">
                            Đang dùng
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-black text-slate-900 mb-4">{lic.price}</div>

                      <ul className="space-y-2 text-xs text-slate-600 mb-6">
                        <li className="flex items-center gap-2">✓ {lic.maxProjects}</li>
                        <li className="flex items-center gap-2">✓ {lic.aiMonthlyQuota}</li>
                        <li className="flex items-center gap-2">✓ Cloud Sync: {lic.cloudSyncEnabled ? 'Có' : 'Không'}</li>
                      </ul>
                    </div>

                    <Button 
                      variant={lic.active ? 'primary' : 'outline'}
                      onClick={() => handleSelectEdition(lic.edition)}
                      className={lic.active ? 'bg-rose-500 hover:bg-rose-600 text-white w-full' : 'bg-white w-full'}
                    >
                      {lic.active ? 'Gói hiện tại' : 'Chuyển sang gói này'}
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 7. OPERATIONAL PLAYBOOK */}
          {activeTab === 'playbook' && (
            <motion.div key="playbook" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Sổ tay Vận hành Nội bộ (Operational Playbook)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Hướng dẫn tiêu chuẩn xử lý sự cố và quy trình nâng cấp cho đội ngũ kỹ thuật.</Typography>
              </div>

              <div className="space-y-4">
                {playbooks.map(pb => (
                  <div key={pb.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                    <h4 className="font-bold text-slate-900 text-base">{pb.title}</h4>
                    <p className="text-xs text-slate-500">{pb.summary}</p>
                    <div className="pt-2 border-t border-slate-200/60 space-y-1">
                      {pb.steps.map((st, idx) => (
                        <div key={idx} className="text-xs font-mono text-slate-700">{st}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 8. PRODUCT COUNCIL & PLM ROADMAP */}
          {activeTab === 'council' && (
            <motion.div key="council" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div>
                <Typography variant="h3" className="text-slate-900 mb-1">Mô hình Quản trị Sản phẩm (Product Council & PLM)</Typography>
                <Typography variant="body-sm" className="text-slate-500 mb-6">Lộ trình phát triển bền vững dựa trên phản hồi thực tế của người dùng sau bản 1.0 Stable.</Typography>
              </div>

              <div className="space-y-4">
                {councilGoals.map(cg => (
                  <div key={cg.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{cg.quarter}</span>
                        <span className="font-bold text-slate-900 text-sm">{cg.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{cg.description}</p>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full uppercase">
                      {cg.status}
                    </span>
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
      active ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);
