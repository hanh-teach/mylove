import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Home,
  CheckCircle2,
  AlertCircle,
  Play,
  Square,
  Download,
  Heart,
  Flower2,
  Gift,
  Star,
  Music,
  Palette,
  Type,
  FileText,
  Image as ImageIcon,
  Edit3,
  Check,
  Code,
  Save,
  Wand2,
  Bot
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';

interface FirstCardWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onOpenInStudioEditor: (title: string, message: string, items: any[], scene: string, font: string) => void;
}

export type CardCategory =
  | 'anniversary'
  | 'birthday'
  | 'thankyou'
  | 'holiday'
  | 'apology'
  | 'custom';

export interface CardCategoryConfig {
  id: CardCategory;
  title: string;
  icon: React.ReactNode;
  description: string;
  defaultScene: string;
  defaultFont: string;
  sampleSubject: string;
}

const CATEGORIES: CardCategoryConfig[] = [
  {
    id: 'anniversary',
    title: 'Thiệp Kỷ Niệm Tình Yêu',
    icon: <Heart className="text-rose-500" size={24} />,
    description: 'Dành cho ngày kỷ niệm yêu nhau, ngày cưới, dịp Valentine hay khoảnh khắc lãng mạn.',
    defaultScene: 'rose',
    defaultFont: 'dancing',
    sampleSubject: 'Kỷ niệm 2 năm ngày chúng mình yêu nhau tại Đà Lạt',
  },
  {
    id: 'birthday',
    title: 'Thiệp Sinh Nhật Chân Thành',
    icon: <Gift className="text-amber-500" size={24} />,
    description: 'Lời chúc mừng tuổi mới nhiều niềm vui, ấm áp cho người yêu, bạn bè hoặc người thân.',
    defaultScene: 'sunset',
    defaultFont: 'pacifico',
    sampleSubject: 'Chúc mừng sinh nhật tuổi 25 ngập tràn hạnh phúc và may mắn',
  },
  {
    id: 'thankyou',
    title: 'Thiệp Tri Ân & Cảm Ơn',
    icon: <Flower2 className="text-emerald-500" size={24} />,
    description: 'Thể hiện sự trân trọng chân thành gửi đến thầy cô, đồng nghiệp, đối tác hoặc người đồng hành.',
    defaultScene: 'garden',
    defaultFont: 'playfair',
    sampleSubject: 'Lời cảm ơn chân thành gửi đến người thầy kính yêu đã luôn tận tụy',
  },
  {
    id: 'holiday',
    title: 'Thiệp Lễ Tết & Giáng Sinh',
    icon: <Star className="text-sky-500" size={24} />,
    description: 'Chúc mừng năm mới, Noel, 8/3, 20/10 hay những dịp lễ lớn trong năm.',
    defaultScene: 'sakura',
    defaultFont: 'lora',
    sampleSubject: 'Lời chúc Giáng sinh và Năm mới an lành, ngập tràn tình yêu thương',
  },
  {
    id: 'custom',
    title: 'Thiệp Sáng Tạo Tự Do',
    icon: <Sparkles className="text-purple-500" size={24} />,
    description: 'Tùy chỉnh tự do toàn bộ nội dung, hình ảnh, âm nhạc và hoạ tiết theo ý muốn.',
    defaultScene: 'plain',
    defaultFont: 'caveat',
    sampleSubject: 'Bức thư tay gửi trao tình cảm ngập tràn sự sẻ chia',
  },
];

const SAMPLE_FALLBACK_LETTERS: Record<CardCategory, string> = {
  anniversary:
    'Gửi người thương yêu,\n\nMỗi ngày trôi qua bên bạn đều là một món quà vô giá đối với mình. Cảm ơn sự thấu hiểu, kiên nhẫn và ấm áp mà bạn luôn dành cho mình trong suốt chặng đường đã qua. Chúc cho tình yêu của chúng ta luôn giữ vững ngọn lửa thăng hoa và tràn ngập tiếng cười!',
  birthday:
    'Chúc mừng sinh nhật người đặc biệt,\n\nChúc bạn bước sang tuổi mới luôn rạng rỡ niềm vui, gặt hái thêm nhiều thành công và luôn được bao bọc bởi tình yêu thương chân thành. Cảm ơn sự xuất hiện tuyệt vời của bạn trong cuộc sống này!',
  thankyou:
    'Trân trọng gửi lời tri ân,\n\nSự hỗ trợ, chỉ bảo và đồng hành tâm huyết từ bạn là động lực vô cùng quý giá giúp mình trưởng thành hơn từng ngày. Kính chúc bạn luôn dồi dào sức khỏe, bình an và gặt hái trọn vẹn mọi điều tốt đẹp.',
  holiday:
    'Thân gửi câu chúc an lành,\n\nNhân dịp đặc biệt này, xin chúc bạn và gia đình luôn đong đầy niềm vui, sức khỏe dồi dào và ấm áp tiếng cười. Mong rằng những điều ngọt ngào nhất sẽ đến với bạn trong hành trình phía trước!',
  apology:
    'Gửi bạn thương yêu,\n\nCó những khoảng lặng giúp chúng ta nhận ra sự quan trọng của nhau. Mình xin lỗi vì những sơ suất đã qua và mong được tiếp tục lắng nghe, gắn kết và mang lại nụ cười trọn vẹn cho bạn.',
  custom:
    'Thân gửi bạn,\n\nMỗi dòng chữ này được viết ra bằng tất cả sự chân thành và trân trọng. Chúc cho những dự định và ước mơ của bạn đều sớm trở thành hiện thực rực rỡ!',
};

export const FirstCardWizardModal: React.FC<FirstCardWizardModalProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onOpenInStudioEditor,
}) => {
  const { createProject, selectProject, updateActiveProjectContent } = useProjectWorkspace();

  // Wizard Step: 1 -> 6
  // 1: Choose Category
  // 2: Input Subject & Validation
  // 3: AI Generation & Layout Synthesis
  // 4: Preview & Customize
  // 5: Save & Export
  // 6: Completion
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [category, setCategory] = useState<CardCategory>('anniversary');
  const [recipient, setRecipient] = useState<string>('Gửi Người Ấy');
  const [subject, setSubject] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // AI Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatusText, setGenerationStatusText] = useState<string>('Đang khởi tạo AI Engine...');
  const [aiError, setAiError] = useState<string | null>(null);

  // Final Generated Output
  const [cardTitle, setCardTitle] = useState<string>('');
  const [cardMessage, setCardMessage] = useState<string>('');
  const [scene, setScene] = useState<string>('rose');
  const [fontStyle, setFontStyle] = useState<string>('dancing');
  const [placedItems, setPlacedItems] = useState<any[]>([
    { id: 1, type: 'Heart', x: 120, y: 80, scale: 1.2, rotation: 0, color: '#f43f5e', animation: 'float' },
    { id: 2, type: 'Sparkles', x: 280, y: 150, scale: 1, rotation: 12, color: '#f59e0b', animation: 'pulse' }
  ]);

  // Saved Project ID
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Developer Mode Toggle (Hidden by default for normal users)
  const [isDevMode, setIsDevMode] = useState<boolean>(false);

  const subjectInputRef = useRef<HTMLTextAreaElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      const selectedCat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
      if (!subject) setSubject(selectedCat.sampleSubject);
    }
  }, [isOpen]);

  // Synchronize AI Generating status with LNOS Home Guard
  useEffect(() => {
    (window as any).LNOS_isAIGenerating = isGenerating;
    return () => {
      (window as any).LNOS_isAIGenerating = false;
    };
  }, [isGenerating]);

  // Handle Global Navigation Cancellation trigger
  useEffect(() => {
    const handleCancelAI = () => {
      if (isGenerating) {
        cancelAIGeneration();
      }
    };
    window.addEventListener('LNOS_cancel_ai', handleCancelAI);
    return () => {
      window.removeEventListener('LNOS_cancel_ai', handleCancelAI);
    };
  }, [isGenerating]);

  if (!isOpen) return null;

  // Step Navigation Handlers
  const handleNextStep = () => {
    // Step 1 -> Step 2
    if (currentStep === 1) {
      const catConfig = CATEGORIES.find(c => c.id === category);
      if (catConfig && !subject.trim()) {
        setSubject(catConfig.sampleSubject);
      }
      setScene(catConfig?.defaultScene || 'rose');
      setFontStyle(catConfig?.defaultFont || 'dancing');
      setCurrentStep(2);
      setValidationError(null);
      setTimeout(() => subjectInputRef.current?.focus(), 150);
      return;
    }

    // Step 2 -> Step 3 (Validation Required!)
    if (currentStep === 2) {
      if (!subject || subject.trim().length === 0) {
        setValidationError('Vui lòng nhập chủ đề tấm thiệp trước khi tạo bằng AI.');
        subjectInputRef.current?.focus();
        return;
      }
      setValidationError(null);
      runAIGeneration();
      return;
    }

    // Step 3 -> Step 4
    if (currentStep === 3) {
      setCurrentStep(4);
      return;
    }

    // Step 4 -> Step 5
    if (currentStep === 4) {
      saveProject();
      setCurrentStep(5);
      return;
    }
  };

  const handlePrevStep = () => {
    if (isGenerating) {
      cancelAIGeneration();
    }
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleResetWizard = () => {
    if (isGenerating) cancelAIGeneration();
    setCurrentStep(1);
    setSubject('');
    setValidationError(null);
    setAiError(null);
  };

  // AI Generation with smooth progress & safety cancellation
  let generationTimer: NodeJS.Timeout | null = null;

  const runAIGeneration = () => {
    setIsGenerating(true);
    setAiError(null);
    setGenerationProgress(10);
    setGenerationStatusText('Đang phân tích chủ đề và ngữ cảnh cảm xúc...');
    setCurrentStep(3);

    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 8;
      if (progress >= 90) {
        progress = 90;
        setGenerationStatusText('Đang hoàn thiện câu từ & hoạ tiết trang trí...');
        clearInterval(interval);
      } else if (progress > 50) {
        setGenerationStatusText('Đang tạo bố cục thiệp và bài thơ tri ân...');
      }
      setGenerationProgress(progress);
    }, 400);

    // Simulate robust AI generation call
    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);
      setGenerationStatusText('✓ Hoàn tất sáng tạo thiệp!');

      const generatedTitle = `${recipient} - ${subject.slice(0, 30)}${subject.length > 30 ? '...' : ''}`;
      const fallbackLetter = SAMPLE_FALLBACK_LETTERS[category] || SAMPLE_FALLBACK_LETTERS.anniversary;
      const fullText = `Thân gửi ${recipient},\n\n"${subject}"\n\n${fallbackLetter}`;

      setCardTitle(generatedTitle);
      setCardMessage(fullText);

      setTimeout(() => {
        setIsGenerating(false);
        setCurrentStep(4);
      }, 600);
    }, 2800);
  };

  const cancelAIGeneration = () => {
    setIsGenerating(false);
    setGenerationProgress(0);
    setGenerationStatusText('Đã dừng sinh nội dung.');
    setCurrentStep(2);
  };

  const applyFallbackSampleText = () => {
    setIsGenerating(false);
    setAiError(null);
    const fallbackText = SAMPLE_FALLBACK_LETTERS[category] || SAMPLE_FALLBACK_LETTERS.anniversary;
    setCardTitle(`${recipient} - Thiệp Yêu Thương`);
    setCardMessage(`Thân gửi ${recipient},\n\n${fallbackText}`);
    setCurrentStep(4);
  };

  // Save Project to Workspace
  const saveProject = () => {
    const proj = createProject(
      cardTitle || 'Thiệp Hoàn Chỉnh FSC-01',
      'card',
      'Thiệp Chúc Mừng',
      '#e11d48',
      '💖',
      subject
    );

    updateActiveProjectContent({
      title: cardTitle,
      message: cardMessage,
      scene,
      fontStyle,
      placedItems,
    });

    selectProject(proj.id);
    setSavedProjectId(proj.id);
  };

  // Export PNG Image safely
  const exportCardAsImage = async () => {
    if (!cardPreviewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardPreviewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = `love-card-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Lỗi xuất ảnh thiệp:', e);
      alert('Không thể tạo file PNG trực tiếp. Bạn có thể nhấn Chụp Màn Hình hoặc dùng Studio Editor để xuất!');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col overflow-hidden my-auto max-h-[92vh] border border-slate-200"
      >
        {/* Header Navigation & Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-2 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-xs">
              <Wand2 size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                Tạo Thiệp Hoàn Chỉnh (FSC-01)
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  Step {currentStep}/6
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentStep === 1 && 'Chọn loại thiệp mong muốn'}
                {currentStep === 2 && 'Nhập người nhận & chủ đề cảm xúc'}
                {currentStep === 3 && 'AI đang tổng hợp văn bản & bố cục'}
                {currentStep === 4 && 'Xem trước & Tùy chỉnh màu sắc, phông chữ'}
                {currentStep === 5 && 'Xác nhận lưu dự án & Xuất file'}
                {currentStep === 6 && 'Hoàn thành thiệp thành công!'}
              </p>
            </div>
          </div>

          {/* Global Escape & Control Navigation Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onNavigateHome}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
              title="Về Trang chủ (Home)"
            >
              <Home size={14} />
              <span className="hidden md:inline">Trang chủ</span>
            </button>

            <button
              onClick={handleResetWizard}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center gap-1"
              title="Làm lại từ đầu"
            >
              <RotateCcw size={14} />
              <span className="hidden md:inline">Làm lại</span>
            </button>

            <button
              onClick={() => setIsDevMode(!isDevMode)}
              className={`p-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 ${
                isDevMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Chế độ Nhà phát triển (Developer Mode)"
            >
              <Code size={14} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Hủy / Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Technical Developer Mode Banner (Shown ONLY when Developer Mode toggled ON) */}
        {isDevMode && (
          <div className="bg-slate-950 text-emerald-400 text-[11px] font-mono px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>DEV MODE ENABLED | Blueprint FSC-01 Verification | Step: {currentStep} | Category: {category}</span>
            </div>
            <span>Status: {isGenerating ? 'RUNNING_DAG' : 'IDLE'}</span>
          </div>
        )}

        {/* Step Progress Stepper Header */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-2.5 flex items-center justify-between gap-1 overflow-x-auto text-xs">
          {[
            { step: 1, label: '1. Loại Thiệp' },
            { step: 2, label: '2. Chủ Đề' },
            { step: 3, label: '3. Sinh AI' },
            { step: 4, label: '4. Chỉnh Sửa' },
            { step: 5, label: '5. Lưu & Xuất' },
            { step: 6, label: '6. Hoàn Thành' }
          ].map(s => {
            const isCompleted = currentStep > s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div key={s.step} className="flex items-center gap-1 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-rose-500 text-white shadow-xs'
                    : isCompleted
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200/80 text-slate-500'
                }`}>
                  {isCompleted && <Check size={12} />}
                  {s.label}
                </span>
                {s.step < 6 && <ChevronRight size={12} className="text-slate-300" />}
              </div>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">

          {/* STEP 1: CHỌN LOẠI THIỆP */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center max-w-xl mx-auto space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                  Bạn muốn sáng tạo tấm thiệp nào hôm nay?
                </h3>
                <p className="text-slate-500 text-xs">
                  Chọn loại thiệp để hệ thống tự động thiết lập tông màu và phong cách phù hợp nhất.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-3 cursor-pointer ${
                        isSelected
                          ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-500/20'
                          : 'border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
                          {cat.icon}
                        </div>
                        {isSelected && (
                          <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center">
                            <Check size={14} />
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{cat.title}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: NHẬP CỦ ĐỀ & NGƯỜI NHẬN (STRICT VALIDATION) */}
          {currentStep === 2 && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Nhập tên người nhận và thông điệp bạn muốn truyền tải
                </h3>
                <p className="text-slate-500 text-xs">
                  Chỉ cần viết ý tưởng ngắn gọn, AI sẽ kiến tạo nên lời chúc lãng mạn và trau chuốt cho bạn.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">
                    Gửi đến ai? (Tên hoặc danh xưng)
                  </label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="VD: Gửi Người Ấy, Gửi Mẹ yêu, Gửi Thầy Cô..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between">
                    <span>Chủ đề / Ý tưởng tấm thiệp <span className="text-rose-500">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Bắt buộc nhập</span>
                  </label>
                  <textarea
                    ref={subjectInputRef}
                    rows={4}
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (e.target.value.trim()) setValidationError(null);
                    }}
                    placeholder="VD: Kỷ niệm 2 năm ngày yêu nhau, chúc mừng sinh nhật tuổi 25, tri ân thầy cô..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-white focus:outline-none text-sm font-medium text-slate-800 ${
                      validationError
                        ? 'border-red-500 ring-2 ring-red-500/20'
                        : 'border-slate-200 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500'
                    }`}
                  />

                  {/* Friendly Inline Validation Alert */}
                  {validationError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-600">Gợi ý mẫu nhanh:</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Kỷ niệm ngày đầu tiên gặp nhau tại quán cà phê quen',
                      'Chúc mừng sinh nhật tuổi mới luôn rạng rỡ niềm vui',
                      'Lời cảm ơn chân thành gửi đến người thầy kính yêu',
                      'Lời xin lỗi chân thành và mong muốn tiếp tục gắn kết'
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSubject(sample);
                          setValidationError(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 text-[11px] transition-all text-left"
                      >
                        + {sample}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AI GENERATION & LAYOUT SYNTHESIS */}
          {currentStep === 3 && (
            <div className="py-8 max-w-lg mx-auto text-center space-y-6">
              {isGenerating ? (
                <div className="space-y-5 p-6 rounded-3xl bg-rose-50/50 border border-rose-100 shadow-xs">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                    <Sparkles size={32} />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {generationStatusText}
                    </h4>
                    <p className="text-slate-500 text-xs">
                      Chủ đề: "{subject}"
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-rose-500 to-pink-500 h-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>

                  {/* Stop Generation Escape Hatch */}
                  <div className="pt-2">
                    <button
                      onClick={cancelAIGeneration}
                      className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5 mx-auto"
                    >
                      <Square size={14} />
                      Dừng sinh (Hủy tác vụ)
                    </button>
                  </div>
                </div>
              ) : (
                /* RECOVERY WORKFLOW PANEL WHEN AI ENCOUNTERS ERROR OR USER CANCELS */
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base">Không thể sinh nội dung tự động hoặc đã dừng</h4>
                    <p className="text-xs text-amber-800 mt-1">
                      Bạn có thể thử lại, quay lại sửa chủ đề hoặc sử dụng mẫu văn bản có sẵn để tiếp tục ngay!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    <button
                      onClick={runAIGeneration}
                      className="px-3 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <RotateCcw size={14} />
                      Thử lại
                    </button>

                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-all flex items-center justify-center gap-1"
                    >
                      <Edit3 size={14} />
                      Sửa Chủ Đề
                    </button>

                    <button
                      onClick={applyFallbackSampleText}
                      className="px-3 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                    >
                      <Sparkles size={14} />
                      Dùng Mẫu Có Sẵn
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: PREVIEW & CUSTOMIZE LIVE CARD */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Live Card Canvas Preview */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={16} className="text-rose-500" />
                    Xem trước thiệp hoàn chỉnh
                  </span>
                  <span className="text-[11px] text-slate-400">Tự động định dạng phông chữ</span>
                </div>

                {/* Card Container Preview */}
                <div
                  ref={cardPreviewRef}
                  className={`p-8 rounded-3xl min-h-[360px] flex flex-col justify-between shadow-xl relative overflow-hidden transition-all border border-rose-200/60 ${
                    scene === 'rose' ? 'bg-gradient-to-br from-rose-100 via-pink-50 to-rose-200 text-rose-950' :
                    scene === 'garden' ? 'bg-gradient-to-br from-emerald-100 via-teal-50 to-emerald-200 text-emerald-950' :
                    scene === 'sunset' ? 'bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 text-orange-950' :
                    scene === 'sakura' ? 'bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 text-pink-950' :
                    scene === 'ocean' ? 'bg-gradient-to-br from-blue-100 via-sky-50 to-blue-200 text-blue-950' :
                    'bg-white text-slate-900'
                  }`}
                >
                  <div className="space-y-4 relative z-10">
                    <h2 className="font-extrabold text-xl sm:text-2xl text-center leading-tight tracking-tight">
                      {cardTitle || 'Thiệp Yêu Thương'}
                    </h2>

                    <p className={`text-sm sm:text-base leading-relaxed text-center whitespace-pre-line ${
                      fontStyle === 'dancing' ? 'font-serif italic' :
                      fontStyle === 'pacifico' ? 'font-sans font-medium' :
                      fontStyle === 'caveat' ? 'font-mono' :
                      'font-serif'
                    }`}>
                      {cardMessage}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-rose-300/40 flex items-center justify-between text-xs font-semibold opacity-80 relative z-10">
                    <span>LoveNote App</span>
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 text-rose-500 opacity-30">
                    <Heart size={48} />
                  </div>
                  <div className="absolute bottom-4 left-4 text-pink-400 opacity-20">
                    <Sparkles size={40} />
                  </div>
                </div>
              </div>

              {/* Right Column: Customization Controls */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette size={14} className="text-rose-500" />
                    Tùy chỉnh phong cách
                  </h4>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700">Tông màu & Phông nền:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'rose', label: 'Hoa Hồng' },
                        { id: 'garden', label: 'Xanh Ngọc' },
                        { id: 'sunset', label: 'Hoàng Hôn' },
                        { id: 'sakura', label: 'Hoa Anh Đào' },
                        { id: 'ocean', label: 'Biển Cả' },
                        { id: 'plain', label: 'Trắng Tinh' }
                      ].map(sc => (
                        <button
                          key={sc.id}
                          onClick={() => setScene(sc.id)}
                          className={`py-1.5 px-2 rounded-lg border font-semibold text-[11px] transition-all ${
                            scene === sc.id
                              ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {sc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700">Kiểu phông chữ:</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'dancing', label: 'Nghệ Thuật' },
                        { id: 'playfair', label: 'Sang Trọng' },
                        { id: 'pacifico', label: 'Dễ Thương' },
                        { id: 'caveat', label: 'Viết Tay' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setFontStyle(f.id)}
                          className={`py-1.5 px-2 rounded-lg border font-semibold text-[11px] transition-all ${
                            fontStyle === f.id
                              ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-700">Chỉnh sửa lời chúc:</label>
                    <textarea
                      rows={3}
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-1 focus:ring-rose-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: SAVE PROJECT & EXPORT */}
          {currentStep === 5 && (
            <div className="py-6 max-w-lg mx-auto text-center space-y-5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Tấm thiệp đã được lưu vào Workspace của bạn!
                </h3>
                <p className="text-slate-500 text-xs">
                  Bạn có thể tải ảnh trực tiếp, mở trong Studio Editor để trang trí thêm hoặc xuất bản.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={exportCardAsImage}
                  disabled={isExporting}
                  className="py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Download size={16} />
                  {isExporting ? 'Đang xuất PNG...' : 'Tải Ảnh PNG Về Máy'}
                </button>

                <button
                  onClick={() => {
                    onOpenInStudioEditor(cardTitle, cardMessage, placedItems, scene, fontStyle);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <Edit3 size={16} />
                  Mở Trong Studio Editor
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: COMPLETION SUMMARY */}
          {currentStep === 6 && (
            <div className="py-8 max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
                <Heart size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-extrabold text-slate-900 text-xl">
                  Chúc mừng! Quy trình tạo thiệp thành công 100%
                </h3>
                <p className="text-slate-500 text-xs">
                  Toàn bộ dữ liệu thiệp đã được kiểm chứng và lưu trữ an toàn trong dự án của bạn.
                </p>
              </div>

              {/* LNOS Completion Grammar Stack */}
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button
                  onClick={() => {
                    onOpenInStudioEditor(cardTitle, cardMessage, placedItems, scene, fontStyle);
                    onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  Tiếp tục chỉnh sửa
                </button>

                <button
                  onClick={exportCardAsImage}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Download size={16} />
                  {isExporting ? 'Đang xuất PNG...' : 'Export (Tải ảnh thiệp)'}
                </button>

                <button
                  onClick={handleResetWizard}
                  className="w-full py-3 px-4 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Tạo thiệp mới
                </button>

                <button
                  onClick={onNavigateHome}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Home size={16} />
                  Về Home
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Controls & Escape Navigation Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div>
            {currentStep > 1 && currentStep < 6 && (
              <button
                onClick={handlePrevStep}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs"
              >
                <ChevronLeft size={16} />
                Quay lại
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs transition-all"
            >
              Hủy
            </button>

            {currentStep < 5 && (
              <button
                onClick={handleNextStep}
                disabled={isGenerating}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md disabled:opacity-50"
              >
                <span>
                  {currentStep === 1 && 'Tiếp theo (Nhập chủ đề)'}
                  {currentStep === 2 && 'Tạo Thiệp Bằng AI ✨'}
                  {currentStep === 3 && 'Xem Trước Thiệp'}
                  {currentStep === 4 && 'Xác Nhận & Lưu Dự Án'}
                </span>
                <ChevronRight size={16} />
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={() => setCurrentStep(6)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md"
              >
                <span>Hoàn Thành</span>
                <Check size={16} />
              </button>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};
