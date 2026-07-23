import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Sparkles, Languages, Palette, FolderPlus, ShieldCheck, 
  CheckCircle2, ArrowRight, ArrowLeft, Star, Radio
} from 'lucide-react';
import { Button } from '../ui/Button';

interface WelcomeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeWizardModal: React.FC<WelcomeWizardModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [theme, setTheme] = useState<'romantic' | 'light' | 'dark'>('romantic');
  const [projectName, setProjectName] = useState('Kỷ niệm Tình yêu 2026');
  const [aiEnabled, setAiEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-rose-100 relative overflow-hidden"
      >
        {/* Top Decorative Graphic */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-100/60 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
              {step}/5
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {step === 1 ? 'Chào mừng' : step === 2 ? 'Ngôn ngữ' : step === 3 ? 'Giao diện' : step === 4 ? 'Khởi tạo' : 'Hoàn tất'}
            </span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map(s => (
              <div 
                key={s} 
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-rose-500' : s < step ? 'w-2 bg-rose-300' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Steps */}
        <div className="min-h-[280px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Welcome */}
            {step === 1 && (
              <motion.div key="st1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center mx-auto shadow-xs">
                  <Heart size={32} className="fill-rose-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Chào mừng đến với LoveNote 1.0 Stable!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Nền tảng kỷ niệm cá nhân & viết thư tình thông minh. Hãy cùng thiết lập các tùy chọn cá nhân hóa để bắt đầu hành trình lưu giữ cảm xúc.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-full">
                  <Sparkles size={14} /> Trải nghiệm mượt mà • An toàn riêng tư 100%
                </div>
              </motion.div>
            )}

            {/* Step 2: Language */}
            {step === 2 && (
              <motion.div key="st2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <Languages size={16} /> Bước 2: Chọn ngôn ngữ
                </div>
                <h3 className="text-lg font-bold text-slate-900">Ngôn ngữ hiển thị ưu tiên của bạn?</h3>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={() => setLanguage('vi')}
                    className={`p-5 rounded-2xl border flex flex-col items-center gap-2 font-bold text-sm transition-all ${
                      language === 'vi' ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl">🇻🇳</span>
                    <span>Tiếng Việt</span>
                  </button>

                  <button
                    onClick={() => setLanguage('en')}
                    className={`p-5 rounded-2xl border flex flex-col items-center gap-2 font-bold text-sm transition-all ${
                      language === 'en' ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl">🇺🇸</span>
                    <span>English</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Theme */}
            {step === 3 && (
              <motion.div key="st3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <Palette size={16} /> Bước 3: Phong cách giao diện
                </div>
                <h3 className="text-lg font-bold text-slate-900">Chọn chủ đề cảm xúc bạn yêu thích</h3>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { id: 'romantic', name: 'Warm Romantic', desc: 'Ấm áp, lãng mạn', color: 'bg-rose-100 text-rose-800 border-rose-300' },
                    { id: 'light', name: 'Clean Light', desc: 'Tinh tế, hiện đại', color: 'bg-slate-100 text-slate-800 border-slate-300' },
                    { id: 'dark', name: 'Twilight Dark', desc: 'Sâu lắng, màn đêm', color: 'bg-slate-900 text-white border-slate-700' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={`p-4 rounded-2xl border text-left font-bold text-xs transition-all ${t.color} ${
                        theme === t.id ? 'ring-2 ring-rose-500 ring-offset-2' : 'opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div>{t.name}</div>
                      <div className="text-[10px] font-normal opacity-70 mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: First Project */}
            {step === 4 && (
              <motion.div key="st4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <FolderPlus size={16} /> Bước 4: Tạo dự án đầu tiên
                </div>
                <h3 className="text-lg font-bold text-slate-900">Đặt tên cho Không gian Kỷ niệm của bạn</h3>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên dự án</label>
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span>Dữ liệu dự án này được lưu trữ hoàn toàn an toàn trên thiết bị của bạn.</span>
                </div>
              </motion.div>
            )}

            {/* Step 5: Complete */}
            {step === 5 && (
              <motion.div key="st5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Mọi thứ đã sẵn sàng!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Không gian kỷ niệm <span className="font-bold text-slate-900">"{projectName}"</span> đã được khởi tạo thành công. Bắt đầu sáng tạo ngay bây giờ!
                </p>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="gap-2"
              >
                <ArrowLeft size={16} /> Quay lại
              </Button>
            ) : <div />}

            {step < 5 ? (
              <Button 
                variant="primary" 
                onClick={() => setStep(step + 1)}
                className="bg-rose-500 hover:bg-rose-600 text-white gap-2"
              >
                Tiếp tục <ArrowRight size={16} />
              </Button>
            ) : (
              <Button 
                variant="primary" 
                onClick={onClose}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
              >
                Khám phá ngay <Sparkles size={16} />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
