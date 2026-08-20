import React from 'react';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { X, Calendar, MapPin, Star, Sparkles, Image as ImageIcon } from 'lucide-react';

interface MemoryPreviewProps {
  memory: IMemory;
  onClose: () => void;
  onSelectForAI: () => void;
  isSelectedForAI: boolean;
}

export const MemoryPreview: React.FC<MemoryPreviewProps> = ({
  memory,
  onClose,
  onSelectForAI,
  isSelectedForAI,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-rose-50/70 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-900 font-serif font-bold text-base">
            <Sparkles size={18} className="text-rose-600" />
            <span className="truncate">{memory.title}</span>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-rose-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {memory.coverImage && (
            <div className="rounded-xl overflow-hidden h-52 bg-rose-100">
              <img src={memory.coverImage} alt={memory.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1 font-medium">
              <Calendar size={14} className="text-rose-500" />
              {memory.date}
            </span>
            {memory.location && (
              <span className="flex items-center gap-1 font-medium">
                <MapPin size={14} className="text-rose-500" />
                {memory.location}
              </span>
            )}
            <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
              {memory.mood || 'Memory'}
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">Story</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-serif bg-rose-50/30 p-3.5 rounded-xl border border-rose-100">
              {memory.content}
            </p>
          </div>

          {memory.aiSummary && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">AI Summary</h4>
              <p className="text-xs text-slate-600 italic bg-amber-50/50 p-3.5 rounded-xl border border-amber-100">
                "{memory.aiSummary}"
              </p>
            </div>
          )}

          {memory.mediaUrls && memory.mediaUrls.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">Photos ({memory.mediaUrls.length})</h4>
              <div className="grid grid-cols-3 gap-2">
                {memory.mediaUrls.map((url, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden h-20 bg-rose-100">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-all"
          >
            Close
          </button>
          <button
            onClick={() => { onSelectForAI(); onClose(); }}
            className={`px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 ${
              isSelectedForAI 
                ? 'bg-rose-700 text-white' 
                : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>{isSelectedForAI ? 'Selected for AI Writing' : 'Use in AI Writing'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
