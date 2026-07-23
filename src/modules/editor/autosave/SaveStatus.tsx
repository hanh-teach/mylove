import React from 'react';
import { CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';

interface SaveStatusProps {
  status: 'saved' | 'saving' | 'unsaved' | 'error';
  lastSavedTime: string;
  onRetry?: () => void;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({
  status,
  lastSavedTime,
  onRetry,
}) => {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {status === 'saving' && (
        <>
          <RefreshCw size={13} className="text-amber-500 animate-spin" />
          <span className="text-amber-600 font-medium">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span className="text-emerald-600 font-medium">✓ Saved {lastSavedTime}</span>
        </>
      )}
      {status === 'unsaved' && (
        <span className="text-slate-400 font-medium">Unsaved changes</span>
      )}
      {status === 'error' && (
        <>
          <AlertTriangle size={13} className="text-rose-500" />
          <span className="text-rose-600 font-medium">⚠ Save failed</span>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="ml-1 underline text-rose-700 hover:text-rose-900 font-bold"
            >
              Retry
            </button>
          )}
        </>
      )}
    </div>
  );
};
