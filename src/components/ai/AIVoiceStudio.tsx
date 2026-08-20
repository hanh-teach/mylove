import React, { useState, useEffect } from 'react';
import { Mic, Play, Pause, Volume2, Sparkles, Check, Plus, RefreshCw, Wand2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface AIVoiceStudioProps {
  initialText?: string;
  onAddVoiceToTimeline?: (voiceData: { text: string; voice: string; audioUrl?: string; duration: number }) => void;
}

export const AIVoiceStudio: React.FC<AIVoiceStudioProps> = ({
  initialText = 'Gửi em, tình yêu lớn nhất cuộc đời anh. Cảm ơn em vì đã đến và làm cho mỗi ngày trôi qua đều là những ngày hạnh phúc nhất.',
  onAddVoiceToTimeline
}) => {
  const [text, setText] = useState(initialText);
  const [voice, setVoice] = useState<'female-romantic' | 'female-warm' | 'male-romantic' | 'male-deep'>('female-romantic');
  const [emotion, setEmotion] = useState<'sweet' | 'emotional' | 'deep'>('sweet');
  const [speed, setSpeed] = useState<number>(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlayPreview = async () => {
    if (!text.trim()) {
      showToast('⚠️ Vui lòng nhập nội dung văn bản cần tạo giọng đọc');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsGenerating(true);

    try {
      // Call backend AI TTS API to validate or fetch parameters
      const res = await fetch('/api/ai/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, emotion, speed })
      });
      const data = await res.json();

      setIsGenerating(false);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Stop any previous speech

        const utterance = new SpeechSynthesisUtterance(data.text || text);
        utterance.rate = (data.rate || 0.95) * speed;
        utterance.pitch = data.pitch || 1.1;

        // Try to match Vietnamese voice if available
        const voices = window.speechSynthesis.getVoices();
        const viVoice = voices.find(v => v.lang.startsWith('vi') || v.name.includes('Vietnamese'));
        if (viVoice) {
          utterance.voice = viVoice;
        }

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        setSpeechInstance(utterance);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        showToast('🎙️ Đang phát giọng đọc AI lãng mạn...');
      } else {
        showToast('⚠️ Trình duyệt của bạn chưa hỗ trợ phát audio trực tiếp.');
      }
    } catch (err) {
      setIsGenerating(false);
      showToast('⚠️ Lỗi kết nối dịch vụ TTS, vui lòng thử lại.');
    }
  };

  const handleAddToTimeline = () => {
    if (!text.trim()) return;
    const estDuration = Math.max(4, Math.ceil(text.length / 12));

    if (onAddVoiceToTimeline) {
      onAddVoiceToTimeline({
        text,
        voice,
        duration: estDuration
      });
    }

    showToast('🎉 Đã chèn giọng đọc AI vào Timeline thiệp thành công!');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md">
            <Mic size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>Studio Giọng đọc AI</span>
              <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-[10px] uppercase font-black">
                Text-To-Speech v1.2
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Chuyển lời chúc thành giọng đọc truyền cảm lồng vào video thiệp.
            </p>
          </div>
        </div>
      </div>

      {/* Text Area */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
          <span>Nội dung lời chúc cần tạo giọng đọc:</span>
          <span className="text-[10px] text-slate-400 font-mono">{text.length} ký tự</span>
        </label>
        <textarea
          rows={3}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Nhập câu chúc lãng mạn muốn AI đọc..."
          className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all leading-relaxed"
        />

        {/* Quick Wish Samples */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[10px] text-slate-400 font-bold self-center mr-1">Mẫu lời chúc:</span>
          {[
            'Cảm ơn em vì đã luôn dịu dàng bên anh.',
            'Mỗi ngày có em là một món quà vô giá.',
            'Chúc em tuổi mới luôn rực rỡ và bình yên.',
            'Yêu em hôm nay nhiều hơn hôm qua.'
          ].map((sample, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setText(sample)}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Audio Waveform Visualizer when Playing */}
      {isPlaying && (
        <div className="p-3 bg-pink-50/80 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-pink-600 animate-pulse" />
            <span className="text-xs font-bold text-pink-700 dark:text-pink-300">Đang phát audio preview...</span>
          </div>
          <div className="flex items-center gap-1 h-5">
            {[0.4, 0.8, 1.0, 0.5, 0.9, 0.3, 0.7, 1.0, 0.6, 0.2].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-pink-500 rounded-full animate-pulse"
                style={{
                  height: `${h * 100}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '0.6s'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Voice Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Voice Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Chọn chất giọng AI:
          </label>
          <div className="space-y-2">
            {[
              { id: 'female-romantic', name: '🎀 Giọng Nữ Ngọt Ngào', desc: 'Sâu lắng, truyền cảm' },
              { id: 'female-warm', name: '🌺 Giọng Nữ Ấm Áp', desc: 'Thỏ thẻ, tâm tình' },
              { id: 'male-romantic', name: '🎙️ Giọng Nam Lãng Mạn', desc: 'Trầm ấm, nam tính' },
              { id: 'male-deep', name: '📻 Giọng Nam Sâu Lắng', desc: 'Truyền cảm, dạt dào' },
            ].map(v => (
              <button
                type="button"
                key={v.id}
                onClick={() => setVoice(v.id as any)}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  voice === v.id
                    ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-pink-200'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">{v.name}</div>
                  <div className="text-[10px] text-slate-400">{v.desc}</div>
                </div>
                {voice === v.id && <Check size={16} className="text-pink-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Emotion & Speed */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Sắc thái Cảm xúc:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sweet', label: '🌸 Ngọt ngào' },
                { id: 'emotional', label: '💖 Cảm động' },
                { id: 'deep', label: '🌙 Sâu lắng' },
              ].map(e => (
                <button
                  type="button"
                  key={e.id}
                  onClick={() => setEmotion(e.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    emotion === e.id
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tốc độ đọc: {speed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
              <span>Chậm rãi</span>
              <span>Bình thường</span>
              <span>Nhanh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="button"
          variant="outlined"
          onClick={handlePlayPreview}
          disabled={isGenerating}
          className="flex-1 border-pink-200 text-pink-700 hover:bg-pink-50 dark:border-pink-900 dark:text-pink-300 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <RefreshCw size={16} className="animate-spin text-pink-600" />
          ) : isPlaying ? (
            <Pause size={16} className="text-pink-600" />
          ) : (
            <Play size={16} className="text-pink-600" />
          )}
          <span>{isPlaying ? 'Tạm dừng' : 'Nghe thử Giọng đọc AI'}</span>
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleAddToTimeline}
          className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white flex items-center justify-center gap-2 font-bold px-6 shadow-md"
        >
          <Plus size={16} />
          <span>Chèn vào Timeline</span>
        </Button>
      </div>
    </div>
  );
};
