import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AICreativeType, IPromptBuilderState } from './types';
import { Sparkles, Sliders, Play, RefreshCw, Save, Check, Command, Heart, Users, MapPin, Clock } from 'lucide-react';

interface PromptBuilderProps {
  creativeType: AICreativeType;
  onCreativeTypeChange: (type: AICreativeType) => void;
  onGenerate: (compiledPrompt: string, builderState: IPromptBuilderState) => void;
  isGenerating: boolean;
  initialPromptText?: string;
}

const DRAFT_STORAGE_KEY = 'lovenote_ai_studio_draft';

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  creativeType,
  onCreativeTypeChange,
  onGenerate,
  isGenerating,
  initialPromptText
}) => {
  // Builder State
  const [occasion, setOccasion] = useState('Kỷ niệm ngày đặc biệt');
  const [mood, setMood] = useState('Trân trọng & Tri ân');
  const [style, setStyle] = useState('Thư tay chân thành');
  const [length, setLength] = useState('Vừa phải (250 từ)');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [audience, setAudience] = useState('Cho Bạn bè / Đồng nghiệp');
  const [aiModel, setAiModel] = useState('Gemini 1.5 Pro');
  const [customNotes, setCustomNotes] = useState('');
  const [compiledPrompt, setCompiledPrompt] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Load Draft from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.occasion) setOccasion(parsed.occasion);
        if (parsed.mood) setMood(parsed.mood);
        if (parsed.style) setStyle(parsed.style);
        if (parsed.length) setLength(parsed.length);
        if (parsed.language) setLanguage(parsed.language);
        if (parsed.audience) setAudience(parsed.audience);
        if (parsed.aiModel) setAiModel(parsed.aiModel);
        if (parsed.customNotes) setCustomNotes(parsed.customNotes);
      }
    } catch (e) {
      console.warn('Failed to load prompt draft:', e);
    }
  }, []);

  // Update when initialPromptText passes in from Prompt Library
  useEffect(() => {
    if (initialPromptText) {
      setCustomNotes(initialPromptText);
    }
  }, [initialPromptText]);

  // Auto compile prompt from fields
  const buildFullPrompt = useCallback(() => {
    let typeLabel = 'Bức thư & Bài viết tri ân';
    if (creativeType === 'romantic_image') typeLabel = 'Ảnh / Tranh vẽ minh hoạ nghệ thuật';
    if (creativeType === 'memory_video') typeLabel = 'Kịch bản Video slide câu chuyện kỷ niệm';
    if (creativeType === 'playlist') typeLabel = 'Danh sách nhạc & Giai điệu tuyển chọn';
    if (creativeType === 'story') typeLabel = 'Câu chuyện truyền cảm hứng';
    if (creativeType === 'anniversary_card') typeLabel = 'Lời chúc & Thiệp mừng sự kiện';
    if (creativeType === 'relationship_advice') typeLabel = 'Gợi ý ý tưởng sáng tạo & kết nối';

    const compiled = `Hãy sáng tạo [${typeLabel}] dành cho [${audience}] vào dịp [${occasion}].
- Cảm xúc chủ đạo: ${mood}
- Phong cách thể hiện: ${style}
- Độ dài mong muốn: ${length}
- Ngôn ngữ: ${language}
- Chi tiết bổ sung từ người dùng: ${customNotes || 'Tập trung thể hiện sự chân thành, ấm áp và ý nghĩa.'}`;

    return compiled;
  }, [creativeType, audience, occasion, mood, style, length, language, customNotes]);

  useEffect(() => {
    setCompiledPrompt(buildFullPrompt());
  }, [buildFullPrompt]);

  // Save Draft to LocalStorage
  const handleSaveDraft = useCallback(() => {
    const draftData = {
      occasion,
      mood,
      style,
      length,
      language,
      audience,
      aiModel,
      customNotes,
      compiledPrompt
    };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
    setIsDraftSaved(true);
    setTimeout(() => setIsDraftSaved(false), 2000);
  }, [occasion, mood, style, length, language, audience, aiModel, customNotes, compiledPrompt]);

  // Keyboard shortcut Ctrl/Cmd + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating) {
          onGenerate(compiledPrompt, {
            occasion,
            mood,
            style,
            length,
            language,
            audience,
            aiModel,
            customNotes
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [compiledPrompt, isGenerating, onGenerate, occasion, mood, style, length, language, audience, aiModel, customNotes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveDraft();
    onGenerate(compiledPrompt, {
      occasion,
      mood,
      style,
      length,
      language,
      audience,
      aiModel,
      customNotes
    });
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100/90 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-2xl bg-rose-500 text-white shadow-xs">
            <Sliders size={18} />
          </span>
          <div>
            <h3 className="text-sm font-black text-slate-800">Bộ tạo Prompt thông minh (Prompt Builder)</h3>
            <p className="text-[11px] text-slate-500">Tự động ghép ngữ cảnh sáng tạo mà không cần nhớ cú pháp prompt</p>
          </div>
        </div>

        <button
          onClick={handleSaveDraft}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          title="Tự động lưu bản nháp"
        >
          {isDraftSaved ? <Check size={14} className="text-emerald-600" /> : <Save size={14} />}
          <span>{isDraftSaved ? 'Đã lưu nháp' : 'Lưu nháp'}</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Row 1: Occasion & Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Dịp kỷ niệm (Occasion)</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Kỷ niệm ngày đặc biệt">🎉 Kỷ niệm ngày đặc biệt</option>
              <option value="Sinh nhật bạn bè/người thân">🎂 Sinh nhật người thân yêu</option>
              <option value="Lễ kỷ niệm & Tri ân">💐 Lễ kỷ niệm & Tri ân</option>
              <option value="Cột mốc mới">✨ Cột mốc mới trong hành trình</option>
              <option value="Gắn kết bạn bè">🤝 Gắn kết bạn bè & Đồng nghiệp</option>
              <option value="Lời cảm ơn sâu sắc">💌 Lời cảm ơn sâu sắc</option>
              <option value="Lời chia sẻ chân thành">🕊️ Lời chia sẻ chân thành</option>
              <option value="Ngày thường ấm áp">☕ Ngày thường ấm áp</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Đối tượng (Audience)</label>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Cho Thầy cô / Người hướng dẫn">👨‍🏫 Cho Thầy cô / Người hướng dẫn</option>
              <option value="Cho Bạn bè / Đồng nghiệp">🤝 Cho Bạn bè / Đồng nghiệp</option>
              <option value="Cho Gia đình / Người thân">🏡 Cho Gia đình / Người thân</option>
              <option value="Cho Đối tác / Khách hàng">💼 Cho Đối tác / Khách hàng</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Cảm xúc chủ đạo (Mood)</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Trân trọng & Tri ân">💐 Trân trọng & Tri ân</option>
              <option value="Sâu sắc & Xúc động">🥺 Sâu sắc & Xúc động</option>
              <option value="Hào hứng & Vui vẻ">🎉 Hào hứng & Vui vẻ</option>
              <option value="Hóm hỉnh & Đáng yêu">😜 Hóm hỉnh & Đáng yêu</option>
              <option value="Nhẹ nhàng & Tinh tế">🌸 Nhẹ nhàng & Tinh tế</option>
              <option value="Ấm áp & Bình yên">☕ Ấm áp & Bình yên</option>
            </select>
          </div>
        </div>

        {/* Row 2: Writing Style, Length, Language, Model */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Phong cách (Style)</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Thư tay chân thành">✍️ Thư tay chân thành</option>
              <option value="Thơ ca vần điệu">📜 Thơ ca vần điệu</option>
              <option value="Hiện đại tinh tế">✨ Hiện đại tinh tế</option>
              <option value="Trang trọng & Lịch sự">👔 Trang trọng & Lịch sự</option>
              <option value="Kịch bản truyền cảm hứng">🎬 Kịch bản truyền cảm hứng</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Độ dài (Length)</label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Ngắn gọn (100 từ)">Ngắn gọn (~100 từ)</option>
              <option value="Vừa phải (250 từ)">Vừa phải (~250 từ)</option>
              <option value="Sâu sắc (500 từ)">Sâu sắc (~500 từ)</option>
              <option value="Chi tiết (1000 từ)">Chi tiết (~1000 từ)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Ngôn ngữ</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Tiếng Việt">🇻🇳 Tiếng Việt</option>
              <option value="English">🇺🇸 English</option>
              <option value="French">🇫🇷 French</option>
              <option value="Japanese">🇯🇵 Japanese</option>
              <option value="Korean">🇰🇷 Korean</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô hình AI Model</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Nâng cao)</option>
              <option value="Gemini Flash 2.0">Gemini Flash 2.0 (Siêu tốc)</option>
              <option value="LoveNote Creative Agent">LoveNote Creative Agent</option>
            </select>
          </div>
        </div>

        {/* AI Context Engine 2.0: Context Ingredients */}
        <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={12} className="text-amber-500" />
              AI Context Engine 2.0 Ingredients
            </h4>
            <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md uppercase">Active</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <ContextTag icon={<Heart size={10} />} label="Kỷ niệm liên quan" count={3} />
            <ContextTag icon={<Users size={10} />} label="Nhân vật: Nguyễn Văn A" />
            <ContextTag icon={<MapPin size={10} />} label="Địa điểm: Đà Lạt" />
            <ContextTag icon={<Clock size={10} />} label="Sự kiện Timeline" count={1} />
          </div>
          <p className="text-[10px] text-slate-400 italic">
            AI đang tự động đọc thêm dữ liệu liên kết để làm phong phú văn phong của bạn.
          </p>
        </div>

        {/* Custom Notes & Assembled Prompt Preview */}
        <div>
          <label className="block font-bold text-slate-700 mb-1">Ghi chú & Chi tiết riêng tư</label>
          <textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Nhập kỷ niệm riêng, tên gọi thân mật, quán cà phê kỷ niệm..."
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 font-medium h-16 focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        {/* Full Compiled Prompt Output Display */}
        <div className="p-3 rounded-2xl bg-rose-50/40 border border-rose-100 text-[11px]">
          <div className="font-extrabold text-rose-800 mb-1 flex items-center justify-between">
            <span>Prompt tổng hợp hoàn chỉnh gửi AI:</span>
            <span className="text-[10px] text-slate-400 font-normal">Tự động biên dịch từ cấu hình trên</span>
          </div>
          <p className="text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">
            {compiledPrompt}
          </p>
        </div>

        {/* Action Button & Shortcut Hint */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Command size={13} />
            <span>Phím tắt: Mẹo nhấn <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border text-slate-700 font-bold">Cmd/Ctrl + Enter</kbd> để tạo AI ngay lập tức</span>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Đang xử lý sáng tạo AI...</span>
              </>
            ) : (
              <>
                <Play size={16} className="fill-white" />
                <span>Bắt đầu Sinh Nội Dung (Generate)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const ContextTag: React.FC<{ icon: React.ReactNode, label: string, count?: number }> = ({ icon, label, count }) => (
  <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg shadow-xs">
    <div className="text-slate-400">{icon}</div>
    <span className="text-[10px] font-bold text-slate-600">{label}</span>
    {count !== undefined && (
      <span className="ml-1 px-1 bg-rose-50 text-rose-500 rounded text-[8px] font-black">{count}</span>
    )}
  </div>
);
