import React, { useState } from 'react';
import { useEditorContext, ContextInspectorModal } from '../context';
import { 
  Heart, Calendar, Sparkles, Smile, FileText, ChevronDown, ChevronUp, X, CheckCircle2, RefreshCw, Database, Image as ImageIcon, Music, AlertCircle 
} from 'lucide-react';

interface AIContextBarProps {
  onOpenPromptPreview: () => void;
}

export const AIContextBar: React.FC<AIContextBarProps> = ({ onOpenPromptPreview }) => {
  const { state, refreshContext, setSelectedMemory } = useEditorContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showInspector, setShowInspector] = useState(false);

  const wordCount = state.selectedText.trim() ? state.selectedText.trim().split(/\s+/).length : 0;
  const selectionLabel = wordCount > 0 ? `Selected: ${wordCount} words` : 'Entire Document';

  return (
    <div className="bg-gradient-to-r from-rose-50/95 via-pink-50/80 to-rose-50/95 border border-rose-200/90 rounded-2xl p-3.5 shadow-xs space-y-3">
      {/* Header bar / Mobile toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center text-xs shadow-xs">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-rose-950">AI Context Center</span>
              <span className="text-[10px] bg-rose-200/80 text-rose-900 px-2 py-0.5 rounded-full font-bold">
                {state.completenessScore}% Ready
              </span>
            </div>
            <p className="text-[10px] text-rose-500">Unified Pipeline (Sprint 55)</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => refreshContext()}
            className="p-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all shadow-2xs"
            title="Refresh Context"
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={() => setShowInspector(true)}
            className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-[11px] transition-all flex items-center gap-1 shadow-2xs"
            title="Context Inspector JSON"
          >
            <Database size={12} />
            <span className="hidden sm:inline">Inspector</span>
          </button>
          <button
            onClick={onOpenPromptPreview}
            className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] transition-all shadow-2xs"
            title="Prompt Preview"
          >
            Prompt Preview
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="md:hidden p-1.5 rounded-lg bg-rose-100 text-rose-800 transition-colors"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Context Chips (Always visible on Desktop, collapsible Accordion on Mobile) */}
      <div className={`flex flex-wrap gap-1.5 items-center pt-1 ${isExpanded ? 'flex' : 'hidden md:flex'}`}>
        {/* Relationship Chip */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-200 rounded-full text-[11px] font-medium text-rose-900 shadow-2xs">
          <Heart size={12} className="text-rose-600" fill="currentColor" />
          <span>{state.relationship.partnerName} & {state.relationship.userName} ({state.relationship.nickname})</span>
        </div>

        {/* Timeline Chip */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-200 rounded-full text-[11px] font-medium text-rose-900 shadow-2xs">
          <Calendar size={12} className="text-rose-500" />
          <span>{state.timeline ? state.timeline.title : 'No Timeline Selected'}</span>
        </div>

        {/* Memory Chip */}
        {state.selectedMemory ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 border border-rose-300 rounded-full text-[11px] font-bold text-rose-950 shadow-2xs">
            <Sparkles size={12} className="text-rose-600" />
            <span className="truncate max-w-[130px]">{state.selectedMemory.title}</span>
            <button
              onClick={() => setSelectedMemory(null)}
              className="p-0.5 hover:bg-rose-200 rounded-full text-rose-600 transition-colors ml-0.5"
              title="Remove memory context"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/70 border border-dashed border-rose-300 rounded-full text-[11px] text-amber-700">
            <AlertCircle size={12} className="text-amber-500" />
            <span>Memory: None</span>
          </div>
        )}

        {/* Mood Chip */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-200 rounded-full text-[11px] font-medium text-rose-900 shadow-2xs">
          <Smile size={12} className="text-pink-500" />
          <span className="capitalize">{state.mood}</span>
        </div>

        {/* Selection Chip */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-rose-200 rounded-full text-[11px] font-medium text-slate-700 shadow-2xs">
          <FileText size={12} className="text-slate-500" />
          <span>{selectionLabel}</span>
        </div>

        {/* Attached Assets Chips if any */}
        {(state.attachedImages.length > 0 || state.attachedMusic.length > 0) && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-100 border border-pink-200 rounded-full text-[11px] font-medium text-pink-900 shadow-2xs">
            <ImageIcon size={12} />
            <span>{state.attachedImages.length} Images</span>
            <Music size={12} className="ml-1" />
            <span>{state.attachedMusic.length} Music</span>
          </div>
        )}
      </div>

      {/* AI Status checklist summary */}
      <div className={`pt-2 border-t border-rose-200/70 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2 ${isExpanded ? 'flex' : 'hidden md:flex'}`}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 size={12} /> Relationship
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 size={12} /> Timeline
          </span>
          <span className={`flex items-center gap-1 font-medium ${state.selectedMemory ? 'text-emerald-700' : 'text-amber-600'}`}>
            <CheckCircle2 size={12} /> {state.selectedMemory ? 'Memory Active' : 'Memory Optional'}
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle2 size={12} /> Mood ({state.mood})
          </span>
        </div>
        <div className="flex items-center gap-1 text-rose-900 font-bold">
          <span>Context Score:</span>
          <span className="bg-rose-200/80 px-2 py-0.5 rounded text-[11px]">{state.completenessScore}%</span>
        </div>
      </div>

      {/* Context Inspector Modal */}
      {showInspector && (
        <ContextInspectorModal onClose={() => setShowInspector(false)} />
      )}
    </div>
  );
};
