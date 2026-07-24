import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Wand2, 
  FileText, 
  RefreshCw, 
  ChevronRight, 
  Check, 
  Compass, 
  Feather
} from 'lucide-react';
import { Project } from '../../modules/workspace/Project';

interface AIStudioDashboardProps {
  project?: Project;
  onUpdateProject?: (updates: Partial<Project>) => void;
  onOpenInEditor?: (text: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AIStudioDashboard: React.FC<AIStudioDashboardProps> = ({
  project,
  onUpdateProject,
  onOpenInEditor,
  onNavigateTab
}) => {
  // If no project is provided, we can fallback to standard AI playground, but since this is workspace-centric,
  // we will optimize it fully for the active project!
  const [stage, setStage] = useState<'reading' | 'composing' | 'polishing' | 'done'>('reading');
  const [generatedText, setGeneratedText] = useState('');
  const [altTexts, setAltTexts] = useState<string[]>([]);
  const [selectedAltIndex, setSelectedAltIndex] = useState(0);

  // Auto-generate triggers on mount
  useEffect(() => {
    if (!project) return;
    
    // Set global generating flag for safety modal or loaders
    (window as any).LNOS_isAIGenerating = true;
    setStage('reading');

    // Step 1: reading -> composing after 1.5s
    const t1 = setTimeout(() => {
      setStage('composing');
    }, 1500);

    // Step 2: composing -> polishing after 3.5s
    const t2 = setTimeout(() => {
      setStage('polishing');
    }, 3500);

    // Step 3: polishing -> done after 5s
    const t3 = setTimeout(() => {
      // Sáng tạo nội dung dựa trên thông tin câu chuyện
      const story = project.description || '';
      const categoryType = project.category || 'Thiệp Cưới';
      const rcpt = project.content?.recipient || 'Người thương yêu';

      let options: string[] = [];
      if (categoryType === 'Thiệp Cưới') {
        options = [
          `Gửi ${rcpt},\n\nTrong những giây phút thiêng liêng nhất của cuộc đời, khi ánh nắng hoàng hôn dịu ngọt buông xuống, em nhận ra mình là người may mắn nhất thế gian vì có anh bên cạnh. Cảm ơn anh đã cùng em đi qua bao thăng trầm, dệt nên câu chuyện tình yêu mộc mạc và chân thành nhất. Kể từ hôm nay, chúng ta sẽ bắt đầu một chương mới đầy ắp tiếng cười, thấu hiểu và hạnh phúc vẹn tròn nhé!`,
          `Gửi ${rcpt},\n\nGiữa muôn vạn nhân duyên của cuộc đời, thật kỳ diệu khi chúng ta tìm thấy nhau và cùng chọn chung đôi bước đi trên một con đường. Chiếc thiệp cưới nhỏ bé này lưu giữ tình cảm nguyên sơ và chân thật nhất của chúng ta. Chúc cho tình yêu của hai ta mãi nồng nàn và vững bền như sóng đại dương, ấm áp như nắng chiều hoàng hôn...`,
          `Gửi thương yêu,\n\nĐám cưới của chúng mình sẽ thật giản dị, có tiếng sóng vỗ rì rào và có ánh mắt ấm áp anh trao. Cảm ơn em đã bước vào cuộc đời anh, biến những ngày bình thường nhất trở thành kỳ quan của hạnh phúc. Trọn đời này, anh nguyện che chở và nắm tay em đi qua mọi giông bão.`
        ];
      } else if (categoryType === 'Sinh Nhật') {
        options = [
          `Gửi ${rcpt},\n\nChúc mừng sinh nhật tuổi mới thật rực rỡ và đong đầy niềm vui! Mong rằng mỗi ngày trôi qua, nụ cười hạnh phúc luôn rạng ngời trên môi bạn, mọi giấc mơ hoài bão đều thành hiện thực. Cảm ơn bạn vì đã luôn là tia nắng ấm áp xua tan những ngày giông bão của tôi. Tuổi mới, chúc bạn luôn bình yên và yêu đời nhé!`,
          `Chúc mừng sinh nhật người bạn vô cùng đặc biệt!\n\nHy vọng tuổi mới sẽ mở ra cho cậu những chương sách rực rỡ nhất, ngập tràn may mắn và thăng tiến. Cảm ơn cậu đã luôn đồng hành, thấu hiểu và dành cho tớ những lời động viên ngọt ngào nhất. Hãy tận hưởng một ngày sinh nhật thật ý nghĩa nhé!`,
          `Gửi bạn yêu quý,\n\nThêm một tuổi mới là thêm một năm chúng ta cùng tích lũy những kỷ niệm đẹp đẽ bên nhau. Chúc cho cuộc sống của cậu luôn ngập tràn hương hoa và mật ngọt hạnh phúc. Sinh nhật vui vẻ!`
        ];
      } else if (categoryType === 'Kỷ Niệm') {
        options = [
          `Gửi ${rcpt},\n\nKỷ niệm không phải là những mốc thời gian trôi qua, mà là những khoảnh khắc thấu hiểu ta cùng lắng đọng bên nhau. Tròn một năm trôi qua kể từ ngày đầu tiên hẹn hò dưới tán cây cổ thụ ấy, cảm xúc của em vẫn vẹn nguyên sự bồi hồi và ngọt ngào. Cảm ơn anh đã luôn kiên nhẫn, yêu thương và che chở cho em mỗi ngày.`,
          `Gửi người bạn đời yêu quý,\n\nMỗi ngày được thức dậy bên cạnh em, nhìn thấy nụ cười của em là món quà vô giá nhất mà định mệnh đã ban tặng cho anh. Cảm ơn vì tất cả những sẻ chia lặng thầm, những thấu hiểu không cần lời nói trong suốt chặng đường đã qua. Mãi yêu em!`,
          `Kỷ niệm ngày đặc biệt của chúng ta,\n\nCảm ơn vì đã luôn là chỗ dựa vững chãi, là bến đỗ bình yên cho trái tim tớ. Chúc cho hành trình yêu thương của chúng mình mãi mãi đơm hoa kết trái.`
        ];
      } else {
        options = [
          `Gửi ${rcpt},\n\nLời chúc nhỏ bé này gửi gắm tất cả sự trân quý và tình cảm chân thành nhất từ sâu thẳm trái tim tôi. Cầu chúc cho bạn luôn gặp nhiều may mắn, tràn ngập năng lượng tích cực và luôn mỉm cười trước mọi thử thách của cuộc sống. Hãy luôn giữ vững niềm tin yêu nhé!`,
          `Gửi người thương yêu,\n\nMột ngày mới gõ cửa mang theo những cơ hội mới và những niềm vui bất ngờ. Mong rằng bạn sẽ đón nhận mọi điều bằng một trái tim mở rộng và tràn đầy hi vọng. Tôi luôn ở đây, sẵn sàng lắng nghe và đồng hành cùng bạn.`,
          `Gửi người tôi luôn trân quý,\n\nCảm ơn sự hiện diện vô giá của bạn trong cuộc đời tôi. Mong bạn luôn bình an, mạnh khỏe và đạt được mọi mong ước tốt đẹp nhất.`
        ];
      }

      // Customize draft based on user prompt if provided
      if (story) {
        options = options.map(opt => {
          return opt.replace("âu chuyện tình yêu mộc mạc", `câu chuyện "${story.substring(0, 40)}..."`);
        });
      }

      setAltTexts(options);
      setGeneratedText(options[0]);
      setSelectedAltIndex(0);
      setStage('done');
      (window as any).LNOS_isAIGenerating = false;
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      (window as any).LNOS_isAIGenerating = false;
    };
  }, [project?.id, project?.category, project?.description, project?.content?.recipient]);

  const handleAltSelect = (index: number) => {
    setSelectedAltIndex(index);
    setGeneratedText(altTexts[index]);
  };

  const handleApply = () => {
    if (onUpdateProject && project && onNavigateTab) {
      onUpdateProject({
        content: {
          ...project.content,
          message: generatedText
        }
      });
      // Navigates directly to Preview tab (which is 'card')
      onNavigateTab('card');
    }
  };

  const handleRegenerate = () => {
    setStage('reading');
    (window as any).LNOS_isAIGenerating = true;
    setTimeout(() => {
      setStage('composing');
    }, 1200);
    setTimeout(() => {
      setStage('polishing');
    }, 2500);
    setTimeout(() => {
      setStage('done');
      (window as any).LNOS_isAIGenerating = false;
    }, 4000);
  };

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
        <Compass className="text-slate-300 w-16 h-16 animate-spin duration-3000" />
        <h3 className="text-slate-600 font-bold mt-4">Vui lòng chọn hoặc tạo một dự án thiệp để bắt đầu</h3>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6 px-4 sm:px-6 select-none animate-in fade-in duration-300">
      
      {/* HEADER */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-serif font-black text-slate-900 flex items-center justify-center gap-2">
          <Wand2 className="text-rose-500 animate-bounce" size={24} />
          AI Sáng Tạo Lời Chúc
        </h2>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-black">
          Co-Pilot Sáng Tác Văn Bản Cảm Xúc
        </p>
      </div>

      {/* GENERATIVE LOADER BLOCK */}
      <AnimatePresence mode="wait">
        {stage !== 'done' ? (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[32px] border border-slate-200/80 p-10 flex flex-col items-center text-center space-y-8 shadow-xs"
          >
            {/* Spinning/pulsing animation graphic */}
            <div className="relative flex items-center justify-center w-24 h-24">
              <div className="absolute inset-0 rounded-full border-4 border-rose-50 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
              <Feather className="text-rose-500 animate-bounce" size={32} />
            </div>

            {/* Stage description text */}
            <div className="space-y-3 max-w-md">
              <h3 className="font-bold text-slate-800 text-lg">
                {stage === 'reading' && "🔍 Đang thấu cảm câu chuyện kỷ niệm..."}
                {stage === 'composing' && "✍️ Sáng tác văn bản nghệ thuật (Gemini)..."}
                {stage === 'polishing' && "✨ Hiệu đính cấu trúc và nhịp điệu từ ngữ..."}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Hệ thống AI đang tích hợp ngữ cảnh về chủ đề <strong className="text-slate-600">"{project.description?.substring(0, 45)}..."</strong>, phong cách <strong className="text-slate-600">"{project.content?.scene || 'rose'}"</strong> để tạo nên lời chúc độc bản tuyệt đẹp nhất.
              </p>
            </div>

            {/* Progressive status checklists */}
            <div className="w-full max-w-xs space-y-3.5 pt-4 text-left border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                  stage === 'reading' ? 'border-rose-500 text-rose-500 animate-pulse' : 'bg-emerald-500 border-emerald-500 text-white'
                }`}>
                  {stage !== 'reading' ? <Check size={10} /> : '1'}
                </div>
                <span className={`text-xs font-bold ${stage === 'reading' ? 'text-rose-600' : 'text-slate-400'}`}>Đọc dữ liệu nguồn kỷ niệm</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                  stage === 'composing' ? 'border-rose-500 text-rose-500 animate-pulse' : stage === 'polishing' || stage === 'done' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 text-slate-300'
                }`}>
                  {stage === 'polishing' || stage === 'done' ? <Check size={10} /> : '2'}
                </div>
                <span className={`text-xs font-bold ${stage === 'composing' ? 'text-rose-600' : 'text-slate-300'}`}>Sáng tác & lựa chọn từ vựng thơ ca</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${
                  stage === 'polishing' ? 'border-rose-500 text-rose-500 animate-pulse' : 'border-slate-200 text-slate-300'
                }`}>
                  '3'
                </div>
                <span className={`text-xs font-bold ${stage === 'polishing' ? 'text-rose-600' : 'text-slate-300'}`}>Tinh chỉnh nhạc tính & nhịp điệu từ ngữ</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Alt versions selection bar */}
            <div className="flex items-center justify-between px-2">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                Đã dệt xong 3 bản thảo
              </div>
              <div className="flex gap-2">
                {altTexts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleAltSelect(i)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                      selectedAltIndex === i
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                    }`}
                  >
                    #{i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Generated text content area */}
            <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-xs relative">
              <div className="absolute top-4 right-4 bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-rose-100 flex items-center gap-1">
                <Sparkles size={10} className="fill-rose-500" />
                Gemini Draft #{selectedAltIndex + 1}
              </div>
              
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={14} />
                Lời chúc đề xuất
              </div>

              {/* Directly editable generated message textarea */}
              <textarea
                value={generatedText}
                onChange={(e) => setGeneratedText(e.target.value)}
                rows={8}
                className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-6 text-sm text-slate-800 font-serif font-medium leading-relaxed focus:bg-white focus:border-rose-300 focus:ring-2 focus:ring-rose-100 transition-all outline-none resize-none"
              />
            </div>

            {/* Lower CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleRegenerate}
                className="flex-1 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-3xs flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Tạo Bản Thảo Khác
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="flex-1.5 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                Áp Dụng & Xem Thử (Preview)
                <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
