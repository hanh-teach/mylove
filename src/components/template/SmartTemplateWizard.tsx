import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Monitor, Tablet, Smartphone, CheckCircle, PlusCircle, MinusCircle, LayoutTemplate, Layers, CheckSquare, Clock, Image as ImageIcon, FileText, ChevronRight, ChevronLeft } from 'lucide-react';
import { templateService } from '../../modules/templates/TemplateService';
import type { TemplateCategory, TemplateStyle, ISmartTemplate, ITemplateWizardAnswers } from '../../modules/templates/TemplateService';
import { projectService } from '../../modules/workspace/ProjectService';

interface SmartTemplateWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (projectId: string) => void;
}

export const SmartTemplateWizard: React.FC<SmartTemplateWizardProps> = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<ITemplateWizardAnswers>({
    enabledModules: {
      timeline: true,
      gallery: true,
      checklist: true,
      aiAssistant: true,
    }
  });

  const [recommendedTemplate, setRecommendedTemplate] = useState<ISmartTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTitle, setCustomTitle] = useState('');

  // Step 1: Category
  const categories: { id: TemplateCategory, label: string, icon: React.ReactNode, desc: string }[] = [
    { id: 'personal', label: 'Cá nhân & Nhật ký', icon: <FileText size={20} />, desc: 'Nhật ký, sổ tay, kế hoạch cá nhân' },
    { id: 'family', label: 'Gia đình & Kỷ niệm', icon: <ImageIcon size={20} />, desc: 'Sinh nhật, album gia đình, gia phả' },
    { id: 'education', label: 'Học tập & Tri ân', icon: <LayoutTemplate size={20} />, desc: 'Thiệp thầy cô, kỷ yếu, báo cáo' },
    { id: 'work', label: 'Công việc', icon: <CheckSquare size={20} />, desc: 'Báo cáo, dự án, thuyết trình' },
    { id: 'event', label: 'Sự kiện', icon: <Sparkles size={20} />, desc: 'Đám cưới, tiệc tùng, team building' },
  ];

  // Step 2: Audience
  const audiences = ['Bản thân', 'Bạn bè', 'Gia đình', 'Giáo viên', 'Đồng nghiệp', 'Khách hàng', 'Khác'];

  // Step 3: Style
  const styles: { id: TemplateStyle, label: string }[] = [
    { id: 'formal', label: 'Trang trọng' },
    { id: 'warm', label: 'Ấm áp & Chân thành' },
    { id: 'humorous', label: 'Hài hước & Vui vẻ' },
    { id: 'touching', label: 'Cảm động & Sâu lắng' },
    { id: 'creative', label: 'Sáng tạo & Độc đáo' },
  ];

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleGenerateTemplate = () => {
    setIsGenerating(true);
    setStep(4);
    setTimeout(() => {
      const tmpl = templateService.recommendTemplate(answers);
      setRecommendedTemplate(tmpl);
      setCustomTitle(`Dự án ${tmpl.title} của tôi`);
      setIsGenerating(false);
    }, 1500); // Simulate AI generation delay
  };

  const toggleModule = (mod: keyof NonNullable<ITemplateWizardAnswers['enabledModules']>) => {
    setAnswers(prev => ({
      ...prev,
      enabledModules: {
        ...prev.enabledModules!,
        [mod]: !prev.enabledModules![mod]
      }
    }));
  };

  useEffect(() => {
    if (recommendedTemplate) {
      const tmpl = templateService.recommendTemplate(answers);
      setRecommendedTemplate(tmpl);
    }
  }, [answers.enabledModules]);

  const handleCreate = () => {
    if (!recommendedTemplate) return;

    // Use project service to create a project based on Smart Template
    const project = projectService.createProject(
      customTitle || recommendedTemplate.title,
      'custom', 
      recommendedTemplate.category,
      'bg-slate-900', // default accent
      '✨',
      recommendedTemplate.description
    );

    // Save SmartTemplate configuration into project metadata
    const updatedContent = {
       ...project.content,
       title: customTitle || recommendedTemplate.title,
       message: recommendedTemplate.description,
    };

    projectService.updateActiveProjectContent(updatedContent);
    
    projectService.updateActiveProject({
      metadata: {
        smartTemplate: recommendedTemplate
      },
      checklist: recommendedTemplate.structure.hasChecklist ? [
        { id: '1', label: 'Xác định đối tượng', completed: false, required: true },
        { id: '2', label: 'Bổ sung nội dung', completed: false, required: true },
        { id: '3', label: 'Review và Xuất bản', completed: false }
      ] : []
    });

    onCreated(project.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles size={20} />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">Smart Template Wizard</h2>
                <p className="text-xs text-slate-500 font-medium">Khởi tạo không gian dự án hoàn chỉnh bằng AI</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Bạn muốn tạo gì hôm nay?</h3>
                    <p className="text-slate-500 font-medium text-sm">Chọn một danh mục để AI chuẩn bị cấu trúc tốt nhất.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setAnswers({ ...answers, category: cat.id }); handleNext(); }}
                        className="p-6 rounded-2xl border-2 border-slate-100 hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/10 text-left transition-all bg-white group flex items-start gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-rose-50 text-slate-400 group-hover:text-rose-500 flex items-center justify-center shrink-0 transition-colors">
                          {cat.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base mb-1">{cat.label}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{cat.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Dự án này dành cho ai?</h3>
                    <p className="text-slate-500 font-medium text-sm">Điều này giúp AI tinh chỉnh văn phong và bố cục.</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                    {audiences.map(aud => (
                      <button
                        key={aud}
                        onClick={() => { setAnswers({ ...answers, targetAudience: aud }); handleNext(); }}
                        className="px-6 py-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold transition-all"
                      >
                        {aud}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-2">Phong cách bạn mong muốn?</h3>
                    <p className="text-slate-500 font-medium text-sm">Quyết định màu sắc, ngôn từ và cấu trúc thiết kế.</p>
                  </div>
                  <div className="flex flex-col gap-3 max-w-xl mx-auto">
                    {styles.map(sty => (
                      <button
                        key={sty.id}
                        onClick={() => { setAnswers({ ...answers, style: sty.id }); handleGenerateTemplate(); }}
                        className="w-full px-6 py-4 rounded-xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold transition-all flex items-center justify-between"
                      >
                        <span>{sty.label}</span>
                        <ChevronRight size={18} className="opacity-50" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="w-16 h-16 relative flex items-center justify-center">
                        <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-ping opacity-75"></div>
                        <Sparkles size={32} className="text-rose-500 relative z-10 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">AI đang kiến tạo không gian...</h3>
                      <p className="text-sm text-slate-500 font-medium">Lắp ráp cấu trúc, quy trình và module phù hợp.</p>
                    </div>
                  ) : recommendedTemplate ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                      {/* Left: Customizer & Details */}
                      <div className="space-y-6">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
                            <CheckCircle size={12} />
                            <span>AI Đề xuất</span>
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">{recommendedTemplate.title}</h3>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed">{recommendedTemplate.description}</p>
                        </div>

                        <div className="space-y-4">
                          <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest">Tên Dự Án Của Bạn</label>
                          <input 
                            type="text" 
                            value={customTitle}
                            onChange={(e) => setCustomTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-semibold text-slate-900"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center justify-between">
                            <span>Tùy chỉnh Modules (Configuration)</span>
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => toggleModule('timeline')} className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${answers.enabledModules?.timeline ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 opacity-60'}`}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${answers.enabledModules?.timeline ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Clock size={16} /></div>
                              <span className="text-xs font-bold text-slate-900">Timeline<br/><span className="text-[9px] font-medium text-slate-500">Mốc thời gian</span></span>
                            </button>
                            <button onClick={() => toggleModule('gallery')} className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${answers.enabledModules?.gallery ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 opacity-60'}`}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${answers.enabledModules?.gallery ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}><ImageIcon size={16} /></div>
                              <span className="text-xs font-bold text-slate-900">Gallery<br/><span className="text-[9px] font-medium text-slate-500">Thư viện ảnh</span></span>
                            </button>
                            <button onClick={() => toggleModule('checklist')} className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${answers.enabledModules?.checklist ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 opacity-60'}`}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${answers.enabledModules?.checklist ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}><CheckSquare size={16} /></div>
                              <span className="text-xs font-bold text-slate-900">Checklist<br/><span className="text-[9px] font-medium text-slate-500">Việc cần làm</span></span>
                            </button>
                            <button onClick={() => toggleModule('aiAssistant')} className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all ${answers.enabledModules?.aiAssistant ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200 opacity-60'}`}>
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${answers.enabledModules?.aiAssistant ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'}`}><Sparkles size={16} /></div>
                              <span className="text-xs font-bold text-slate-900">AI Prompt<br/><span className="text-[9px] font-medium text-slate-500">Hỗ trợ viết</span></span>
                            </button>
                          </div>
                        </div>

                      </div>

                      {/* Right: Architecture Preview */}
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
                          <Layers size={14} /> Kiến trúc Dự án (Preview)
                        </h4>
                        
                        <div className="flex-1 space-y-2 relative z-10">
                          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                            <LayoutTemplate size={16} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-700">Trang Bìa / Mở Đầu</span>
                          </div>
                          
                          {recommendedTemplate.structure.hasTimeline && (
                            <div className="flex flex-col items-center">
                              <div className="w-px h-3 bg-slate-300"></div>
                              <div className="w-full p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                <Clock size={16} className="text-indigo-400" />
                                <span className="text-xs font-bold text-slate-700">Dòng thời gian (Timeline)</span>
                              </div>
                            </div>
                          )}

                          {recommendedTemplate.structure.hasGallery && (
                            <div className="flex flex-col items-center">
                              <div className="w-px h-3 bg-slate-300"></div>
                              <div className="w-full p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                                <ImageIcon size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold text-slate-700">Thư viện Ảnh (Gallery)</span>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col items-center">
                            <div className="w-px h-3 bg-slate-300"></div>
                            <div className="w-full p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                              <FileText size={16} className="text-rose-400" />
                              <div className="flex-1">
                                <span className="text-xs font-bold text-slate-700 block">Nội dung chính</span>
                                {recommendedTemplate.structure.hasDraftWriter && (
                                  <span className="text-[9px] font-medium text-rose-500 mt-0.5 flex items-center gap-1">
                                    <Sparkles size={10} /> AI Agent: {recommendedTemplate.aiPromptConfig.tone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {recommendedTemplate.structure.hasExportPreset && (
                            <div className="flex flex-col items-center">
                              <div className="w-px h-3 bg-slate-300"></div>
                              <div className="w-full p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-sm flex items-center gap-3">
                                <Monitor size={16} className="text-slate-300" />
                                <span className="text-xs font-bold text-white">Xuất bản: {recommendedTemplate.exportPreset.format.toUpperCase()}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            {step > 1 && step < 4 ? (
              <button onClick={handlePrev} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1">
                <ChevronLeft size={14} /> Quay lại
              </button>
            ) : (
              <div></div> // spacer
            )}
            
            {step === 4 && recommendedTemplate && (
              <button
                onClick={handleCreate}
                className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-black flex items-center gap-2 shadow-lg transition-all"
              >
                <Sparkles size={16} /> Tạo Dự Án
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
