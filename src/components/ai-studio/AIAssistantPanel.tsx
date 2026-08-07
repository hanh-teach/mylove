import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertTriangle, Zap, Clock, ShieldCheck, HeartHandshake, Copy, Check, FileText, Send } from 'lucide-react';
import { WritingService } from '../../modules/ai-engine/writing/WritingService';
import { cleanAIGeneratedText } from '../../utils/textCleaner';

interface AIAssistantPanelProps {
  promptText?: string;
  creativeType?: string;
  compiledPrompt?: string;
  onRefine?: (suggestion: string) => void;
  onOpenInEditor?: (text: string) => void;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ 
  promptText = '', 
  creativeType = 'general', 
  compiledPrompt = '',
  onRefine,
  onOpenInEditor
}) => {
  const [inputText, setInputText] = useState(promptText || compiledPrompt || '');
  const [action, setAction] = useState<'improve' | 'rewrite' | 'shorten' | 'expand' | 'grammar'>('improve');
  const [tone, setTone] = useState<'romantic' | 'cute' | 'formal' | 'funny' | 'emotional'>('romantic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Synchronize initial prop
  useEffect(() => {
    if (promptText || compiledPrompt) {
      setInputText(promptText || compiledPrompt);
    }
  }, [promptText, compiledPrompt]);

  const handleCopy = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcess = async () => {
    if (!inputText.trim()) {
      setErrorMsg('Vui lòng nhập nội dung bản nháp hoặc câu lệnh trước.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');
    setAiResult('');

    try {
      const res = await WritingService.processWriting({
        action,
        text: inputText,
        tone,
        language: 'Vietnamese',
      });

      if (res.success && res.result) {
        const cleaned = cleanAIGeneratedText(res.result);
        setAiResult(cleaned);
        if (onRefine) onRefine(cleaned);
      } else {
        setErrorMsg(res.error || 'Có lỗi xảy ra khi gọi AI xử lý. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMsg('Không thể kết nối đến máy chủ AI. Vui lòng thử lại sau.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Compute real-time feedback metrics based on prompt length and keywords
  const actualPrompt = inputText;
  const promptLength = actualPrompt.length;
  
  let score = 50;
  if (promptLength > 20) score += 15;
  if (promptLength > 50) score += 15;
  if (promptLength > 120) score += 10;
  if (actualPrompt.includes('kỷ niệm') || actualPrompt.includes('tri ân') || actualPrompt.includes('yêu') || actualPrompt.includes('sáng tạo')) {
    score += 8;
  }
  score = Math.min(score, 98);

  const estimatedTokens = Math.max(120, Math.floor(promptLength * 1.8 + 150));
  const estimatedDuration = (1.2 + (promptLength / 250)).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10">
          <Brain size={200} />
        </div>
        <div className="max-w-lg space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase text-indigo-300 border border-white/5">
            <Sparkles size={12} />
            <span>AI Writing Coach</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight leading-none">CỐ VẤN & TRỢ LÝ SÁNG TẠO NỘI DUNG</h2>
          <p className="text-xs text-slate-300 font-medium">
            Hãy nhập ý tưởng thô, lời chúc ngắn hoặc chọn một phong cách để AI tối ưu hóa ngôn từ, thổi bùng cảm xúc lãng mạn và trau chuốt từng câu văn.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor & Options */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Bản nháp hoặc Prompt thô của bạn
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ví dụ: Viết lời chúc kỷ niệm 1 năm chặng đường đồng hành, lãng mạn ngọt ngào, nhắc về quán cafe cũ tại Đà Lạt..."
              rows={6}
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Hành động của AI
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="improve">✨ Đánh bóng & Làm mượt</option>
                <option value="rewrite">✍️ Viết lại lãng mạn</option>
                <option value="expand">📝 Mở rộng & Thêm cảm xúc</option>
                <option value="shorten">✂️ Rút gọn súc tích</option>
                <option value="grammar">🛠️ Sửa lỗi chính tả & từ</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Cảm xúc chủ đạo
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="romantic">💖 Lãng mạn, Sâu sắc</option>
                <option value="cute">🌸 Đáng yêu, Ngọt ngào</option>
                <option value="formal">👔 Trang trọng, Chân thành</option>
                <option value="funny">😜 Hài hước, Dí dỏm</option>
                <option value="emotional">🥺 Từ trái tim xúc động</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 text-xs text-rose-600 bg-rose-50 rounded-xl border border-rose-100 font-medium">
              {errorMsg}
            </div>
          )}

          <button
            onClick={handleProcess}
            disabled={isGenerating}
            className="w-full py-3 px-6 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang xử lý cùng Gemini...</span>
              </>
            ) : (
              <>
                <Brain size={16} />
                <span>Phân tích & Tối ưu ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: AI Analysis & Response */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl bg-indigo-500 text-white">
                  <Brain size={16} />
                </span>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Đánh giá Prompt</h3>
                  <p className="text-[10px] text-slate-500">Chỉ số tối ưu cảm xúc</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                <Sparkles size={13} className="text-indigo-600 animate-pulse" />
                <span className="text-xs font-black text-indigo-700">{score}/100</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Zap size={14} className="text-amber-500 shrink-0" />
                <div>
                  <div className="text-[9px] text-slate-400 font-medium">Dự kiến Token</div>
                  <div className="font-extrabold text-slate-800">~{estimatedTokens}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                <Clock size={14} className="text-blue-500 shrink-0" />
                <div>
                  <div className="text-[9px] text-slate-400 font-medium">Thời gian ước tính</div>
                  <div className="font-extrabold text-slate-800">~{estimatedDuration}s</div>
                </div>
              </div>
            </div>

            {/* Suggestions & Guidance */}
            <div className="space-y-2 text-[11px]">
              <div className="font-extrabold text-slate-700 flex items-center gap-1.5">
                <HeartHandshake size={14} className="text-rose-500" />
                <span>Gợi ý tối ưu cảm xúc:</span>
              </div>

              <ul className="space-y-1.5 text-slate-600">
                {promptLength < 30 ? (
                  <li className="flex items-start gap-1.5 text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                    <span>Nội dung khá ngắn. Hãy thêm các địa điểm cụ thể hoặc kỷ niệm riêng tư để đoạn văn giàu chất thơ hơn.</span>
                  </li>
                ) : (
                  <li className="flex items-start gap-1.5 text-emerald-700 bg-emerald-50/50 p-2 rounded-xl border border-emerald-200">
                    <ShieldCheck size={13} className="shrink-0 mt-0.5" />
                    <span>Độ dài rất tốt! Thông tin ngữ cảnh dồi dào sẽ giúp Gemini tạo bài viết rất sâu sắc.</span>
                  </li>
                )}

                <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                  <span>Sử dụng <strong>Gemini 2.5 Flash</strong> để đảm bảo tốc độ phản hồi tối ưu nhất.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* AI Result Container */}
          {(aiResult || isGenerating) && (
            <div className="bg-gradient-to-br from-rose-50 to-pink-50/40 rounded-3xl border border-rose-100 p-5 space-y-3 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-rose-800 uppercase tracking-wider">
                  <Sparkles size={14} className="text-rose-600" />
                  <span>Đề xuất từ AI Coach</span>
                </div>
                {aiResult && (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-rose-100 rounded-lg text-rose-700 transition-colors"
                    title="Sao chép kết quả"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="space-y-2 py-4">
                  <div className="h-3 bg-rose-200/60 rounded-full animate-pulse w-3/4" />
                  <div className="h-3 bg-rose-200/60 rounded-full animate-pulse w-full" />
                  <div className="h-3 bg-rose-200/60 rounded-full animate-pulse w-5/6" />
                </div>
              ) : (
                <div className="text-xs text-slate-800 leading-relaxed bg-white/70 backdrop-blur-xs p-3.5 rounded-2xl border border-rose-100/60 shadow-2xs max-h-64 overflow-y-auto whitespace-pre-wrap font-medium">
                  {aiResult}
                </div>
              )}

              {aiResult && !isGenerating && onOpenInEditor && (
                <button
                  onClick={() => onOpenInEditor(cleanAIGeneratedText(aiResult))}
                  className="w-full py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Send size={12} />
                  <span>Đưa kết quả này vào Trình soạn thảo</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
