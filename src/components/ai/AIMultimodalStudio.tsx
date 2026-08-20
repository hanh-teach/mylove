import React, { useState } from 'react';
import { Sparkles, Image, Mic, Heart, BookOpen, Wand2, RefreshCw, Download, Check, Plus, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';
import { AIVoiceStudio } from './AIVoiceStudio';
import { BeatParticleCanvas } from '../audio/BeatParticleCanvas';

export const AIMultimodalStudio: React.FC<{ onApplyImage?: (url: string) => void }> = ({ onApplyImage }) => {
  const [activeTab, setActiveTab] = useState<'image' | 'voice' | 'poem' | 'particles'>('image');

  // AI Image Studio State
  const [imagePrompt, setImagePrompt] = useState('Đôi lứa nắm tay nhau dạo bước dưới cơn mưa hoa đào hoàng hôn');
  const [stylePreset, setStylePreset] = useState('romantic-sunset');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  // AI Poem Generator State
  const [sender, setSender] = useState('Anh');
  const [receiver, setReceiver] = useState('Em');
  const [category, setCategory] = useState('anniversary');
  const [poemType, setPoemType] = useState('luc-bat');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<string | null>(null);

  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, stylePreset })
      });
      const data = await res.json();
      setIsGeneratingImage(false);
      if (data.success) {
        setGeneratedImageUrl(data.imageUrl);
        showToast('✨ Đã tạo hình ảnh thiệp AI lãng mạn thành công!');
      }
    } catch (e) {
      setIsGeneratingImage(false);
      showToast('⚠️ Không thể tạo ảnh lúc này. Vui lòng thử lại.');
    }
  };

  const handleGeneratePoem = async () => {
    setIsGeneratingPoem(true);
    try {
      const res = await fetch('/api/ai/generate-poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, receiver, category, poemType })
      });
      const data = await res.json();
      setIsGeneratingPoem(false);
      if (data.success) {
        setGeneratedPoem(data.poem);
        showToast('📜 Đã sáng tác bài thơ tình cảm xúc thành công!');
      }
    } catch (e) {
      setIsGeneratingPoem(false);
      showToast('⚠️ Không thể tạo bài thơ lúc này');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold text-xs uppercase tracking-widest mb-1">
            <Wand2 size={16} />
            <span>AI Multimodal Studio v1.2</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Trí tuệ Nhân tạo AI Đa phương tiện
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tạo hình ảnh lãng mạn, giọng đọc AI truyền cảm, thơ tình & hiệu ứng hạt đập theo nhạc.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl gap-1">
          {[
            { id: 'image', label: 'Tạo Ảnh AI', icon: <Image size={15} /> },
            { id: 'voice', label: 'Giọng đọc AI', icon: <Mic size={15} /> },
            { id: 'poem', label: 'Thơ Tình AI', icon: <BookOpen size={15} /> },
            { id: 'particles', label: 'Nhạc & Hạt', icon: <Heart size={15} /> },
          ].map(tab => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: AI IMAGE STUDIO */}
      {activeTab === 'image' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Mô tả khung cảnh tình yêu (Prompt tiếng Việt):
                </label>
                <textarea
                  rows={3}
                  value={imagePrompt}
                  onChange={e => setImagePrompt(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  placeholder="Nhập ý tưởng khung cảnh lãng mạn..."
                />
                
                {/* Prompt Quick Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold self-center mr-1">Gợi ý nhanh:</span>
                  {[
                    '🌸 Hoa đào rơi hoàng hôn',
                    '🌌 Bầu trời sao nguyện ước',
                    '💌 Bức thư tình cổ điển',
                    '🎆 Pháo hoa kỉ niệm ngày cưới',
                    '🌊 Bờ biển hoàng hôn hai người'
                  ].map((presetText, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setImagePrompt(presetText)}
                      className="px-2 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 text-[10px] text-pink-700 dark:text-pink-300 font-medium hover:bg-pink-100 transition-colors"
                    >
                      {presetText}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Phong cách Nghệ thuật (Style Preset):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'romantic-sunset', label: '🌅 Hoàng hôn Lãng mạn' },
                    { id: 'watercolor-love', label: '🎨 Màu nước Mộng mơ' },
                    { id: 'anime-romance', label: '✨ Anime Shinkai' },
                    { id: 'neon-cyber-love', label: '🌆 Neon Cyber Love' },
                    { id: 'vintage-film', label: '📷 Phim Hoài niệm' },
                  ].map(p => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setStylePreset(p.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                        stylePreset === p.id
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleGenerateImage}
                disabled={isGeneratingImage}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
                <span>{isGeneratingImage ? 'Đang tạo ảnh AI...' : 'Tạo hình ảnh thiệp AI'}</span>
              </Button>
            </div>

            {/* Preview Box */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-4 min-h-[260px] bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
              {generatedImageUrl ? (
                <div className="space-y-3 w-full">
                  <img
                    src={generatedImageUrl}
                    alt="AI Generated Romantic Card"
                    className="w-full h-52 object-cover rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        if (onApplyImage && generatedImageUrl) onApplyImage(generatedImageUrl);
                        showToast('🎉 Đã áp dụng ảnh AI vào mẫu thiệp!');
                      }}
                      className="flex-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-2 rounded-xl"
                    >
                      Dùng làm nền thiệp
                    </Button>
                    <a
                      href={generatedImageUrl}
                      download="romantic_ai_card.jpg"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 text-slate-400">
                  <Image className="w-12 h-12 mx-auto opacity-30" />
                  <p className="text-xs font-bold">Chưa có hình ảnh được tạo</p>
                  <p className="text-[11px]">Nhấn "Tạo hình ảnh thiệp AI" để bắt đầu sáng tạo</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI VOICE STUDIO */}
      {activeTab === 'voice' && (
        <AIVoiceStudio
          onAddVoiceToTimeline={() => showToast('🎉 Đã chèn giọng đọc AI vào Timeline thiệp!')}
        />
      )}

      {/* TAB 3: AI POEM & WISH GENERATOR */}
      {activeTab === 'poem' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Người gửi (Danh xưng):
                  </label>
                  <input
                    type="text"
                    value={sender}
                    onChange={e => setSender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Người nhận (Danh xưng):
                  </label>
                  <input
                    type="text"
                    value={receiver}
                    onChange={e => setReceiver(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Dịp kỉ niệm đặc biệt:
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                >
                  <option value="anniversary">💍 Kỉ niệm Ngày cưới / Yêu nhau</option>
                  <option value="love-confession">💘 Tỏ tình Lãng mạn</option>
                  <option value="birthday">🎂 Sinh nhật Người yêu</option>
                  <option value="valentine">🌹 Lễ Tình nhân Valentine</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Thể loại Thơ / Lời chúc:
                </label>
                <select
                  value={poemType}
                  onChange={e => setPoemType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                >
                  <option value="luc-bat">📜 Thơ Lục bát Dân gian (Ngọt ngào, Dễ thuộc)</option>
                  <option value="song-that">✒️ Thơ Song thất lục bát (Truyền cảm, Sâu lắng)</option>
                  <option value="free">✨ Thơ Tự do 4 câu (Hiện đại, Bay bổng)</option>
                </select>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleGeneratePoem}
                disabled={isGeneratingPoem}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                {isGeneratingPoem ? <RefreshCw size={16} className="animate-spin" /> : <BookOpen size={16} />}
                <span>{isGeneratingPoem ? 'Đang sáng tác thơ...' : 'Sáng tác Thơ tình AI'}</span>
              </Button>
            </div>

            {/* Result Box */}
            <div className="bg-amber-50/50 dark:bg-slate-950 border border-amber-200/60 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-3">
                  <Sparkles size={16} />
                  <span>Kết quả Sáng tác Thơ AI:</span>
                </div>
                {generatedPoem ? (
                  <p className="text-slate-800 dark:text-slate-200 font-serif italic text-sm leading-relaxed whitespace-pre-line p-3 bg-white/80 dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800">
                    {generatedPoem}
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Nhấn "Sáng tác Thơ tình AI" để tạo bài thơ độc bản lồng vào thiệp.
                  </p>
                )}
              </div>

              {generatedPoem && (
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPoem);
                    showToast('📋 Đã sao chép thơ vào bộ nhớ tạm!');
                  }}
                  className="mt-4 border-amber-300 text-amber-800 hover:bg-amber-100 text-xs py-2"
                >
                  Sao chép nội dung bài thơ
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BEAT PARTICLE ANIMATION */}
      {activeTab === 'particles' && (
        <div className="space-y-4">
          <BeatParticleCanvas
            interactiveControls={true}
            className="w-full max-w-2xl mx-auto"
          />
        </div>
      )}
    </div>
  );
};
