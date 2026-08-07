import React, { useState, useEffect } from 'react';
import { Sparkles, BookOpen, Clock, Users, Camera, Mail } from 'lucide-react';
import { MemoryService } from '../memory/MemoryService';
import { relationshipService } from '../relationship/RelationshipService';

export const StatisticsCard: React.FC = () => {
  const [counts, setCounts] = useState({
    memories: 0,
    timelineEvents: 0,
    peopleAndPlaces: 0,
    photos: 0,
    letters: 0,
    collections: 0,
  });

  useEffect(() => {
    const memories = MemoryService.getMemories();
    const stats = MemoryService.calculateStats(memories);
    const collections = MemoryService.getCollections();
    const people = relationshipService.getPeople();
    const places = relationshipService.getPlaces();

    setCounts({
      memories: stats.total,
      timelineEvents: stats.timelineEvents,
      peopleAndPlaces: people.length + places.length,
      photos: stats.photos,
      letters: stats.letters,
      collections: collections.length,
    });
  }, []);

  const stats = [
    { label: 'Kỷ niệm đã lưu', value: `${counts.memories}`, icon: <BookOpen size={16} className="text-pink-600" />, bg: 'bg-pink-50' },
    { label: 'Bộ sưu tập', value: `${counts.collections}`, icon: <Sparkles size={16} className="text-rose-600" />, bg: 'bg-rose-50' },
    { label: 'Mốc thời gian', value: `${counts.timelineEvents}`, icon: <Clock size={16} className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Nhân vật & Địa điểm', value: `${counts.peopleAndPlaces}`, icon: <Users size={16} className="text-emerald-600" />, bg: 'bg-emerald-50' },
    { label: 'Hình ảnh Kỷ niệm', value: `${counts.photos}`, icon: <Camera size={16} className="text-indigo-600" />, bg: 'bg-indigo-50' },
    { label: 'Bức thư & Lời nhắn', value: `${counts.letters}`, icon: <Mail size={16} className="text-amber-600" />, bg: 'bg-amber-50' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-rose-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-serif font-bold text-slate-900 text-base">Workspace Statistics</h4>
        <span className="text-xs text-slate-400">Hoạt động dữ liệu thật</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${stat.bg} shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">{stat.label}</span>
              <span className="font-serif font-bold text-slate-900 text-base">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

