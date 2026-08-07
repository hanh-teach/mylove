import { useState, useCallback, useEffect } from 'react';
import { WritingService } from '../../ai-engine/writing/WritingService';
import { WritingActionType, ToneType } from '../../ai-engine/writing/WritingRequest';
import { useLanguage } from '../../../components/shell/LanguageContext';

export function useWritingAssistant() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultText, setResultText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [tone, setTone] = useState<ToneType>('romantic');
  const { language: appLang } = useLanguage();
  
  // Map app language to AI prompt language name
  const [language, setLanguage] = useState(appLang === 'vi' ? 'Vietnamese' : 'English');

  // Sync when app language changes
  useEffect(() => {
    setLanguage(appLang === 'vi' ? 'Vietnamese' : 'English');
  }, [appLang]);

  const runAction = useCallback(async (action: WritingActionType, text: string) => {
    if (!text.trim()) {
      setErrorMsg('Vui lòng nhập hoặc chọn văn bản trước khi nhờ AI hỗ trợ.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setResultText('');
    setIsSimulated(false);

    const res = await WritingService.processWriting({
      action,
      text,
      tone,
      language,
    });

    setIsGenerating(false);
    if (res.success) {
      setResultText(res.result);
      setIsSimulated(!!res.isSimulated);
    } else {
      setErrorMsg(res.error || 'Không thể cải thiện văn bản. Vui lòng thử lại.');
    }
  }, [tone, language]);

  return {
    isGenerating,
    resultText,
    setResultText,
    errorMsg,
    isSimulated,
    tone,
    setTone,
    language,
    setLanguage,
    runAction,
  };
}
