import { useState, useCallback } from 'react';
import { WritingService } from '../../ai-engine/writing/WritingService';
import { WritingActionType, ToneType } from '../../ai-engine/writing/WritingRequest';

export function useWritingAssistant() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tone, setTone] = useState<ToneType>('romantic');
  const [language, setLanguage] = useState('Vietnamese');

  const runAction = useCallback(async (action: WritingActionType, text: string) => {
    if (!text.trim()) {
      setErrorMsg('Vui lòng nhập hoặc chọn văn bản trước khi nhờ AI hỗ trợ.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setResultText('');

    const res = await WritingService.processWriting({
      action,
      text,
      tone,
      language,
    });

    setIsGenerating(false);
    if (res.success) {
      setResultText(res.result);
    } else {
      setErrorMsg(res.error || 'Không thể cải thiện văn bản. Vui lòng thử lại.');
    }
  }, [tone, language]);

  return {
    isGenerating,
    resultText,
    setResultText,
    errorMsg,
    tone,
    setTone,
    language,
    setLanguage,
    runAction,
  };
}
