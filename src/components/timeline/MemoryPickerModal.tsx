import React, { useState } from 'react';
import { MemoryService } from '../../modules/memory/MemoryService';
import { IMemory } from '../../modules/memory/MemoryTypes';
import { Search, X, Calendar, MapPin, Heart } from 'lucide-react';

interface MemoryPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMemory: (memory: IMemory) => void;
}

export const MemoryPickerModal: React.FC<MemoryPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectMemory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;

  const memories = MemoryService.getMemories();
  const filtered = memories.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-rose-50 flex items-center justify-between bg-rose-50/20">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Heart size={16} className="text-rose-500 fill-rose-500" />
              <span>Liên kết kỷ niệm (Memory)</span>
            </h3>
            <p className="text-xs text-slate-500">Chọn một cột mốc kỷ niệm để đính kèm vào bước này</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Tìm kiếm kỷ niệm theo tên hoặc nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-1 focus:ring-rose-400 focus:border-rose-400"
            />
          </div>
        </div>

        {/* Memories List */}
        <div className="p-3 overflow-y-auto flex-1 space-y-2 max-h-[50vh]">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Không tìm thấy kỷ niệm nào phù hợp.
            </div>
          ) : (
            filtered.map((memory) => (
              <div 
                key={memory.id}
                onClick={() => {
                  onSelectMemory(memory);
                  onClose();
                }}
                className="p-3 rounded-2xl border border-slate-100 hover:border-rose-200 hover:bg-rose-50/20 cursor-pointer transition-all flex gap-3 group"
              >
                {memory.coverImage && (
                  <img 
                    src={memory.coverImage} 
                    alt={memory.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-rose-600 transition-colors">
                      {memory.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 shrink-0">
                      {memory.mood}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {memory.content}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {memory.date}
                    </span>
                    <span className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin size={10} />
                      {memory.location}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 font-semibold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
