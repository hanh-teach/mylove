import React from 'react';
import { useEditorContext } from './ContextProvider';
import { formatContextAsJSON } from './ContextSelectors';
import { X, Code, Copy, Check, Database } from 'lucide-react';

interface ContextInspectorModalProps {
  onClose: () => void;
}

export const ContextInspectorModal: React.FC<ContextInspectorModalProps> = ({ onClose }) => {
  const { state } = useEditorContext();
  const [copied, setCopied] = React.useState(false);

  const jsonString = formatContextAsJSON(state);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-rose-50/70 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-950 font-serif font-bold text-base">
            <Database size={18} className="text-rose-600" />
            <span>Context Center Inspector (Sprint 55)</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-900 text-slate-100 font-mono text-xs rounded-b-xl leading-relaxed">
          <div className="flex items-center justify-between text-rose-400 font-bold mb-1">
            <span># Active EditorContext JSON Snapshot:</span>
            <span className="text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800 text-[11px]">
              Completeness: {state.completenessScore}%
            </span>
          </div>
          <pre className="whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
            {jsonString}
          </pre>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic">Read-only Context Center Pipeline Data</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
