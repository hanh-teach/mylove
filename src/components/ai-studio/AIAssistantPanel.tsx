import React from 'react';
import { Brain, Sparkles, AlertTriangle, Zap, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

interface AIAssistantPanelProps {
  promptText: string;
  creativeType: string;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ promptText, creativeType }) => {
  // Compute real-time feedback metrics based on prompt length and keywords
  const promptLength = promptText.length;
  
  let score = 75;
  if (promptLength > 50) score += 10;
  if (promptLength > 120) score += 10;
  if (promptText.includes('kỷ niệm') || promptText.includes('tri ân') || promptText.includes('sáng tạo')) score += 5;
  score = Math.min(score, 98);

  const estimatedTokens = Math.max(120, Math.floor(promptLength * 1.8 + 150));
  const estimatedDuration = (1.5 + (promptLength / 250)).toFixed(1);

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-indigo-500 text-white shadow-xs">
            <Brain size={18} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Cố vấn AI (AI Assistant)</h3>
            <p className="text-[11px] text-slate-500">Phân tích Prompt & Dự đoán chất lượng</p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          <Sparkles size={13} className="text-indigo-600" />
          <span className="text-xs font-black text-indigo-700">{score}/100</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
          <Zap size={16} className="text-amber-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Dự kiến Token</div>
            <div className="font-extrabold text-slate-800">~{estimatedTokens} tokens</div>
          </div>
        </div>

        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2">
          <Clock size={16} className="text-blue-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Thời gian ước tính</div>
            <div className="font-extrabold text-slate-800">~{estimatedDuration}s</div>
          </div>
        </div>
      </div>

      {/* Suggestions & Guidance */}
      <div className="space-y-2 text-xs">
        <div className="font-extrabold text-slate-700 flex items-center gap-1.5">
          <HeartHandshake size={14} className="text-rose-500" />
          <span>Gợi ý tối ưu cảm xúc:</span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-slate-600">
          {promptLength < 40 && (
            <li className="flex items-start gap-1.5 text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              <span>Prompt khá ngắn. Hãy thêm địa điểm kỷ niệm hoặc tên gọi thân mật để bài viết đong đầy tình cảm hơn.</span>
            </li>
          )}

          <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
            <span>Mô hình <strong>Gemini 1.5 Pro</strong> có khả năng thấu hiểu ngữ cảnh tình cảm sâu sắc.</span>
          </li>

          <li className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <Sparkles size={13} className="text-rose-500 shrink-0" />
            <span>Kết quả sẽ được tự động định dạng đẹp mắt để xuất thiệp hoặc lưu vào kỷ niệm.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
