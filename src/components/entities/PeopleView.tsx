
import React from 'react';
import { motion } from 'motion/react';
import { User, Plus, Search, Filter, MoreVertical, Heart } from 'lucide-react';
import { relationshipService } from '../../modules/relationship/RelationshipService';

export const PeopleView: React.FC = () => {
  const people = relationshipService.getPeople();

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Nhân vật</h2>
          <p className="text-slate-500 font-medium">Những người xuất hiện trong câu chuyện của bạn</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
          <Plus size={18} />
          Thêm nhân vật
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
        <div className="pl-3 text-slate-400"><Search size={18} /></div>
        <input 
          type="text" 
          placeholder="Tìm kiếm nhân vật..." 
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-2"
        />
        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><Filter size={18} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {people.map((person) => (
          <motion.div 
            key={person.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[32px] p-6 border border-slate-200 shadow-xs hover:shadow-xl transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:border-rose-100 group-hover:bg-rose-50 transition-colors">
                <User size={32} />
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-600"><MoreVertical size={20} /></button>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">{person.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{person.role || 'Nhân vật'}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {person.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg">{tag}</span>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">12</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kỷ niệm</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-black text-slate-900">28</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hình ảnh</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
