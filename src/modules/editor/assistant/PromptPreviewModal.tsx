import React from 'react';
import { useEditorContext } from '../context';
import { X, Code, Copy, Check } from 'lucide-react';

interface PromptPreviewModalProps {
  onClose: () => void;
}

export const PromptPreviewModal: React.FC<PromptPreviewModalProps> = ({
  onClose,
}) => {
  const { state } = useEditorContext();
  const [copied, setCopied] = React.useState(false);

  const systemPrompt = `You are AI Writer Studio, an expert creative AI writing assistant specializing in meaningful letters, greeting cards, speeches, stories, and personal memories. Always maintain an authentic, expressive, and high-quality tone matched to the context.`;
  
  const relationshipContext = `Author Name: ${state.relationship.userName || 'Author'} | Target Recipient: ${state.relationship.partnerName || 'Recipient'} | Context Tag: ${state.relationship.nickname || 'General'}.`;
  const timelineContext = state.timeline ? `Active Milestone: ${state.timeline.title} (${state.timeline.date} at ${state.timeline.location})` : `Active Milestone: None.`;
  const memoryContext = state.selectedMemory 
    ? `Selected Memory: "${state.selectedMemory.title}" (${state.selectedMemory.date}, ${state.selectedMemory.location}) - ${state.selectedMemory.content}`
    : `Selected Memory: None (Using general relationship warmth).`;
  const selectionContext = state.selectedText 
    ? `Target Selection (${state.selectedText.split(/\s+/).length} words): "${state.selectedText}"`
    : `Target Selection: Entire Document (Default starting prompt).`;
  
  const fullPromptPreview = `--- SYSTEM PROMPT ---\n${systemPrompt}\n\n--- RELATIONSHIP CONTEXT ---\n${relationshipContext}\n\n--- TIMELINE CONTEXT ---\n${timelineContext}\n\n--- MEMORY CONTEXT ---\n${memoryContext}\n\n--- TARGET SELECTION ---\n${selectionContext}\n\n--- SELECTED MOOD ---\n${state.mood.toUpperCase()} (Completeness Score: ${state.completenessScore}%)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullPromptPreview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-rose-50/70 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-900 font-serif font-bold text-base">
            <Code size={18} className="text-rose-600" />
            <span>Prompt Preview (Developer Mode)</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-900 text-slate-100 font-mono text-xs rounded-b-xl leading-relaxed">
          <div className="text-rose-400 font-bold mb-1"># Complete Context-Aware Prompt Payload sent to AI:</div>
          <pre className="whitespace-pre-wrap bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300">
            {fullPromptPreview}
          </pre>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic">Read-only diagnostic payload</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Payload'}</span>
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
