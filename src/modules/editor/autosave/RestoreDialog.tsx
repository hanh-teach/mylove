import React from 'react';
import { VersionMetadata } from './VersionDiff';
import { History, RotateCcw, X, Trash2, Eye } from 'lucide-react';

interface RestoreDialogProps {
  version: VersionMetadata;
  onConfirmRestore: () => void;
  onClose: () => void;
}

export const RestoreDialog: React.FC<RestoreDialogProps> = ({
  version,
  onConfirmRestore,
  onClose,
}) => {
  const timeStr = new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = new Date(version.timestamp).toLocaleDateString();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-md w-full p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
          <div className="flex items-center gap-2 text-rose-800 font-serif font-bold text-lg">
            <RotateCcw size={20} className="text-rose-600" />
            <span>Restore this version?</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100 flex flex-col gap-2 text-sm text-slate-700">
          <div className="flex justify-between font-semibold text-rose-900">
            <span>Version #{version.versionNumber} ({version.type})</span>
            <span>{dateStr} {timeStr}</span>
          </div>
          <p className="text-xs text-slate-600 italic">"{version.summary}"</p>
          <div className="mt-1 pt-2 border-t border-rose-200/60 text-xs text-slate-500">
            Title: <strong className="text-rose-950">{version.document.title || 'Untitled'}</strong>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Restoring will create a new version based on this snapshot. Your current edits will not be lost and will remain in version history.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmRestore}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Restore</span>
          </button>
        </div>
      </div>
    </div>
  );
};
