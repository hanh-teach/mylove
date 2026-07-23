import React from 'react';
import { Sparkles, Check, ArrowDown, RefreshCw } from 'lucide-react';

interface WritingResultProps {
  isGenerating: boolean;
  resultText: string;
  errorMsg: string | null;
  onReplace: () => void;
  onInsertBelow: () => void;
  onRetry: () => void;
}

export const WritingResult: React.FC<WritingResultProps> = ({
  isGenerating,
  resultText,
  errorMsg,
  onReplace,
  onInsertBelow,
  onRetry,
}) => {
  if (!isGenerating && !resultText && !errorMsg) {
    return null;
  }

  return (
    <div className="mt-4 p-4 rounded-xl bg-rose-50/50 border border-rose-200 flex flex-col gap-3 animate-fadeIn">
      <div className="flex items-center justify-between">
        <span className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
          <Sparkles size={14} className="text-rose-500" />
          <span>AI Writing Result</span>
        </span>
        {isGenerating && (
          <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
            <RefreshCw size={12} className="animate-spin" />
            <span>Generating...</span>
          </span>
        )}
      </div>

      {isGenerating && (
        <div className="space-y-2 py-2">
          <div className="w-full bg-rose-200/60 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full w-2/3 animate-pulse rounded-full"></div>
          </div>
          <p className="text-[11px] text-rose-600 italic text-center">AI đang tinh chỉnh câu từ...</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex flex-col gap-2">
          <p>{errorMsg}</p>
          <button
            onClick={onRetry}
            className="self-start px-2.5 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 transition-colors text-[11px]"
          >
            Thử lại
          </button>
        </div>
      )}

      {!isGenerating && resultText && (
        <>
          <div className="p-3 bg-white border border-rose-200 rounded-lg font-serif text-slate-800 text-sm leading-relaxed max-h-48 overflow-y-auto shadow-xs">
            {resultText}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onReplace}
              className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[36px]"
            >
              <Check size={14} />
              <span>Replace</span>
            </button>
            <button
              onClick={onInsertBelow}
              className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[36px]"
            >
              <ArrowDown size={14} />
              <span>Insert Below</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
