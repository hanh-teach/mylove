
import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Plus, Search, Filter, MoreVertical, Compass } from 'lucide-react';
import { relationshipService } from '../../modules/relationship/RelationshipService';

export const PlacesView: React.FC = () => {
  const places = relationshipService.getPlaces();

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Địa điểm</h2>
          <p className="text-slate-500 font-medium">Những nơi lưu giữ khoảnh khắc đặc biệt</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg">
          <Plus size={18} />
          Thêm địa điểm
        </button>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm max-w-xl">
        <div className="pl-3 text-slate-400"><Search size={18} /></div>
        <input 
          type="text" 
          placeholder="Tìm kiếm địa điểm..." 
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-2"
        />
        <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><Filter size={18} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {places.map((place) => (
          <motion.div 
            key={place.id}
            whileHover={{ y: -4 }}
            className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all group"
          >
            <div className="h-40 bg-slate-200 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 right-4">
                <button className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white hover:bg-white/40"><MoreVertical size={20} /></button>
              </div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <Compass size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{place.tags[0] || 'Địa điểm'}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-slate-900 mb-2">{place.name}</h3>
              <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-2">{place.description || 'Không có mô tả'}</p>
              
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-lg font-black text-slate-900">18</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kỷ niệm</div>
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900">72</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hình ảnh</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <MapPin size={20} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
