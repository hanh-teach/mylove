import React, { useState } from 'react';
import { FileText, RotateCcw, X, Check } from 'lucide-react';

interface DraftRecoveryCardProps {
  onRestore: () => void;
}

export const DraftRecoveryCard: React.FC<DraftRecoveryCardProps> = ({ onRestore }) => {
  const [dismissed, setDismissed] = useState(false);
  const [restored, setRestored] = useState(false);

  if (dismissed || restored) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-5 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
          <FileText size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-amber-950 text-sm">Unsaved Draft Recovered</h4>
            <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">Auto-saved</span>
          </div>
          <p className="text-xs text-amber-800 mt-0.5">Found unsaved changes from 3 minutes ago in your Writing Project.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => {
            setRestored(true);
            onRestore();
          }}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
        >
          <RotateCcw size={14} />
          <span>Restore</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-2 rounded-xl hover:bg-amber-100 text-amber-700 transition-colors"
          title="Discard Draft"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
