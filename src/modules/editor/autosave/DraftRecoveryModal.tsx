import React from 'react';
import { NoteDocument } from '../../../components/editor/DocumentModel';
import { RefreshCw, Check } from 'lucide-react';

interface DraftRecoveryModalProps {
  draft: { document: NoteDocument; timestamp: number };
  onRestore: () => void;
  onDiscard: () => void;
}

export const DraftRecoveryModal: React.FC<DraftRecoveryModalProps> = ({
  draft,
  onRestore,
  onDiscard,
}) => {
  const timeAgo = Math.round((Date.now() - draft.timestamp) / 60000);
  const timeStr = timeAgo < 1 ? 'Just now' : `${timeAgo} minutes ago`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-md w-full p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-rose-100 pb-3">
          <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600">
            <RefreshCw size={22} className="animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-rose-950">Recovered draft found</h3>
            <p className="text-xs text-slate-500">Last edited {timeStr}</p>
          </div>
        </div>

        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 space-y-2">
          <div className="text-xs font-semibold text-rose-900">Document Title:</div>
          <div className="text-sm font-serif font-bold text-rose-950">
            {draft.document.title || 'Untitled Love Note'}
          </div>
          <p className="text-xs text-slate-600 line-clamp-3">
            {draft.document.blocks.map(b => b.content).join(' ')}
          </p>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          We found an unsaved draft from your previous session. Would you like to restore it or start fresh?
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onDiscard}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all"
          >
            Discard
          </button>
          <button
            onClick={onRestore}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Restore Draft</span>
          </button>
        </div>
      </div>
    </div>
  );
};
