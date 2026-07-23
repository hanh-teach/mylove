import React, { useState, useEffect } from 'react';
import { useWritingAssistant } from './useWritingAssistant';
import { WritingActionCard } from './WritingActionCard';
import { WritingResult } from './WritingResult';
import { AIContextBar } from './AIContextBar';
import { PromptPreviewModal } from './PromptPreviewModal';
import { useEditorContext } from '../context';
import { ToneType, WritingActionType } from '../../ai-engine/writing/WritingRequest';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { Sparkles, Wand2, Scissors, Expand, CheckCheck, Languages, X, Heart, Code } from 'lucide-react';

interface AIWritingPanelProps {
  selectedText: string;
  onReplaceSelection: (newText: string) => void;
  onInsertBelow: (newText: string) => void;
  selectedMemory?: IMemory | null;
  onClearMemory?: () => void;
  onClose?: () => void;
}

export const AIWritingPanel: React.FC<AIWritingPanelProps> = ({
  selectedText,
  onReplaceSelection,
  onInsertBelow,
  selectedMemory,
  onClearMemory,
  onClose,
}) => {
  const { state, setSelectedMemory, setMood, setSelectedText } = useEditorContext();
  const [selectedPreset, setSelectedPreset] = useState<string>('Letter');

  // Sync props into ContextCenter
  useEffect(() => {
    if (selectedMemory !== undefined) {
      setSelectedMemory(selectedMemory);
    }
  }, [selectedMemory, setSelectedMemory]);

  useEffect(() => {
    if (selectedText !== undefined) {
      setSelectedText(selectedText);
    }
  }, [selectedText, setSelectedText]);

  const {
    isGenerating,
    resultText,
    errorMsg,
    tone,
    setTone,
    language,
    setLanguage,
    runAction,
  } = useWritingAssistant();

  // Sync tone with mood in ContextCenter
  useEffect(() => {
    setMood(tone);
  }, [tone]);

  const [showPromptPreview, setShowPromptPreview] = useState(false);

  const tones: { id: ToneType; label: string }[] = [
    { id: 'romantic', label: 'Romantic' },
    { id: 'cute', label: 'Cute' },
    { id: 'formal', label: 'Formal' },
    { id: 'funny', label: 'Funny' },
    { id: 'emotional', label: 'Emotional' },
  ];

  const actions: { id: WritingActionType; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: 'improve', label: 'Improve Writing', desc: 'Enhance clarity & emotion', icon: <Sparkles size={16} /> },
    { id: 'rewrite', label: 'Rewrite', desc: 'Transform with richer style', icon: <Wand2 size={16} /> },
    { id: 'shorten', label: 'Shorten', desc: 'Condense into concise phrasing', icon: <Scissors size={16} /> },
    { id: 'expand', label: 'Expand', desc: 'Add depth & poetic imagery', icon: <Expand size={16} /> },
    { id: 'grammar', label: 'Fix Grammar', desc: 'Correct spelling & punctuation', icon: <CheckCheck size={16} /> },
    { id: 'translate', label: 'Translate', desc: language === 'Vietnamese' ? 'Translate to English' : 'Translate to Vietnamese', icon: <Languages size={16} /> },
  ];

  const getDefaultTextForPreset = (preset: string) => {
    switch (preset) {
      case 'Teacher': return 'Kính gửi thầy/cô kính yêu, nhân ngày nhà giáo em xin gửi lời tri ân sâu sắc nhất...';
      case 'Birthday': return 'Chúc mừng sinh nhật! Chúc bạn tuổi mới tràn ngập niềm vui, sức khỏe và thành công...';
      case 'Family': return 'Kính gửi cha mẹ kính yêu, cảm ơn cha mẹ đã luôn là chỗ dựa vững chắc cho con...';
      case 'Graduation': return 'Hôm nay đánh dấu một cột mốc đáng nhớ trên hành trình học tập và trưởng thành...';
      case 'Thank You': return 'Xin gửi lời cảm ơn chân thành nhất đến bạn vì đã luôn đồng hành và hỗ trợ...';
      case 'Speech': return 'Kính chào toàn thể quý vị đại biểu và các vị khách quý có mặt ngày hôm nay...';
      case 'Story': return 'Ngày hôm đó, khi hành trình bắt đầu, tất cả chúng tôi đều tràn đầy kỳ vọng...';
      default: return 'Kính gửi bạn thân yêu, xin gửi những lời chúc tốt đẹp nhất và thông điệp ý nghĩa này...';
    }
  };

  const handleActionClick = (actionId: WritingActionType) => {
    let contextPayload = `[Preset: ${selectedPreset}]\n`;
    if (state.relationship && state.relationship.partnerName) {
      contextPayload += `[Author & Target: ${state.relationship.userName || 'Author'} -> ${state.relationship.partnerName}]\n`;
    }
    if (state.timeline) {
      contextPayload += `[Timeline: ${state.timeline.title} - ${state.timeline.date} at ${state.timeline.location}]\n`;
    }
    if (state.selectedMemory) {
      contextPayload += `[Active Memory: "${state.selectedMemory.title}" - ${state.selectedMemory.content}]\n`;
    }
    contextPayload += `[Target Text: ${state.selectedText || getDefaultTextForPreset(selectedPreset)}]`;

    runAction(actionId, contextPayload);
  };

  const presets = [
    'Greeting Card', 'Birthday', 'Teacher', 'Friend', 'Family', 'Thank You', 
    'Invitation', 'Diary', 'Wedding', 'Anniversary', 'Proposal', 'Condolence', 
    'Graduation', 'Speech', 'Story', 'Letter', 'Poetry', 'Lyrics', 'Social Post', 'Email', 'Custom'
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-rose-100 p-5 flex flex-col gap-4 relative overflow-y-auto max-h-[88vh]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-xs">
            ✨
          </div>
          <div>
            <h3 className="font-bold text-rose-950 text-sm sm:text-base">AI Writer</h3>
            <p className="text-[11px] text-rose-500">Emotional Content & Story Generator</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowPromptPreview(true)}
            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
            title="Prompt Preview (Developer Mode)"
          >
            <Code size={18} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* AI Context Bar (Sprint 54) */}
      <AIContextBar
        selectedMemory={selectedMemory}
        selectedText={selectedText}
        mood={tone}
        onClearMemory={onClearMemory || (() => {})}
        onOpenPromptPreview={() => setShowPromptPreview(true)}
      />

      {/* Content Preset Selector */}
      <div>
        <label className="text-xs font-bold text-rose-950 block mb-1.5">Content Type Preset</label>
        <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200 scrollbar-thin">
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setSelectedPreset(preset)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                selectedPreset === preset
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-rose-100 border border-slate-200'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div>
        <label className="text-xs font-bold text-rose-950 block mb-1.5">Tone giọng (Tone)</label>
        <div className="flex flex-wrap gap-1.5">
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
                tone === t.id
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-rose-50/60 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-rose-950 block mb-1">Hành động AI (Actions)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {actions.map((act) => (
            <WritingActionCard
              key={act.id}
              action={act.id}
              label={act.label}
              description={act.desc}
              icon={act.icon}
              onClick={() => handleActionClick(act.id)}
              disabled={isGenerating}
            />
          ))}
        </div>
      </div>

      {/* Result Section */}
      <WritingResult
        isGenerating={isGenerating}
        resultText={resultText}
        errorMsg={errorMsg}
        onReplace={() => {
          onReplaceSelection(resultText);
          if (onClose) onClose();
        }}
        onInsertBelow={() => {
          onInsertBelow(resultText);
          if (onClose) onClose();
        }}
        onRetry={() => handleActionClick('improve')}
      />

      {/* Prompt Preview Modal */}
      {showPromptPreview && (
        <PromptPreviewModal
          selectedMemory={selectedMemory}
          selectedText={selectedText}
          tone={tone}
          onClose={() => setShowPromptPreview(false)}
        />
      )}
    </div>
  );
};

