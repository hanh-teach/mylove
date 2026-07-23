import React, { useState, useMemo } from 'react';
import { IMemory, ITag } from '../../modules/memory/MemoryTypes';
import { MapPin, Navigation, Compass, Heart, Sparkles, ExternalLink, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RelationshipMapViewProps {
  memories: IMemory[];
  allTags: ITag[];
  onOpenMemory: (memory: IMemory) => void;
}

interface LocationMarker {
  id: string;
  cityName: string;
  fullLocation: string;
  latitude: number;
  longitude: number;
  memories: IMemory[];
  topImage?: string;
}

// Preset approximate coordinates for Vietnam & global romantic spots for clean visual layout
const KNOWN_COORDS: Record<string, { lat: number; lng: number }> = {
  'Đà Lạt': { lat: 11.9404, lng: 108.4583 },
  'TP. Hồ Chí Minh': { lat: 10.8231, lng: 106.6297 },
  'Thảo Điền': { lat: 10.8031, lng: 106.732 },
  'Hà Nội': { lat: 21.0285, lng: 105.8542 },
  'Phú Quốc': { lat: 10.2899, lng: 103.984 },
  'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
  'Mộc Châu': { lat: 20.8407, lng: 104.6366 },
  'Paris': { lat: 48.8566, lng: 2.3522 },
};

export const RelationshipMapView: React.FC<RelationshipMapViewProps> = ({
  memories,
  onOpenMemory,
}) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [mapSearch, setMapSearch] = useState('');

  // Group memories by location city
  const locationMarkers = useMemo(() => {
    const map = new Map<string, IMemory[]>();

    memories.forEach((mem) => {
      const loc = mem.location ? mem.location.split(',')[0].trim() : 'Địa điểm chưa rõ';
      if (!map.has(loc)) {
        map.set(loc, []);
      }
      map.get(loc)!.push(mem);
    });

    const list: LocationMarker[] = [];
    map.forEach((mList, cityName) => {
      const coords = KNOWN_COORDS[cityName] || {
        lat: 10 + Math.random() * 10,
        lng: 105 + Math.random() * 5,
      };
      const topImg = mList.find((m) => m.coverImage)?.coverImage || mList[0]?.mediaUrls?.[0];

      list.push({
        id: `loc-${cityName}`,
        cityName,
        fullLocation: mList[0]?.location || cityName,
        latitude: coords.lat,
        longitude: coords.lng,
        memories: mList,
        topImage: topImg,
      });
    });

    return list;
  }, [memories]);

  // Filtered location list
  const filteredMarkers = useMemo(() => {
    if (!mapSearch.trim()) return locationMarkers;
    const q = mapSearch.toLowerCase();
    return locationMarkers.filter((m) => m.cityName.toLowerCase().includes(q));
  }, [locationMarkers, mapSearch]);

  const activeMarkerData = useMemo(() => {
    if (!selectedCity) return locationMarkers[0] || null;
    return locationMarkers.find((m) => m.cityName === selectedCity) || null;
  }, [selectedCity, locationMarkers]);

  return (
    <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-rose-100/90 shadow-xs space-y-6">
      {/* Top Map Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
              <Navigation size={18} />
            </span>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Bản đồ hành trình cuộc sống (Journey Map)
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Khám phá những điểm đến, địa danh và cột mốc đáng nhớ trong hành trình
          </p>
        </div>

        {/* Map Search input */}
        <div className="relative w-full md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            placeholder="Tìm kiếm thành phố..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Main Map Stage + Side Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Placeholder Map Canvas (2 cols) */}
        <div className="lg:col-span-2 relative min-h-[400px] sm:min-h-[480px] bg-gradient-to-br from-sky-100 via-rose-50/50 to-amber-50/40 rounded-3xl border-2 border-slate-200 overflow-hidden shadow-inner p-6 flex flex-col justify-between">
          {/* Map Vector Graphic Decorator */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Map Compass */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-slate-700 shadow-xs border border-slate-200 flex items-center gap-1.5">
              <Compass size={14} className="text-rose-500 animate-spin-slow" />
              Bản đồ trực quan (Standalone Pin Grid)
            </span>

            <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-3 py-1 rounded-full">
              {locationMarkers.length} địa danh
            </span>
          </div>

          {/* Visual Marker Pin Grid Display */}
          <div className="relative z-10 my-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMarkers.map((marker) => {
              const isSelected = selectedCity === marker.cityName || (!selectedCity && marker === locationMarkers[0]);

              return (
                <motion.div
                  key={marker.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedCity(marker.cityName)}
                  className={`p-3.5 rounded-2xl cursor-pointer border-2 transition-all shadow-md flex items-center gap-3 ${
                    isSelected
                      ? 'bg-rose-500 text-white border-rose-600 shadow-lg scale-105'
                      : 'bg-white/90 hover:bg-white text-slate-800 border-slate-200/90'
                  }`}
                >
                  <span
                    className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    <MapPin size={18} />
                  </span>

                  <div className="truncate">
                    <div className="text-xs font-extrabold truncate">{marker.cityName}</div>
                    <div
                      className={`text-[10px] font-semibold ${
                        isSelected ? 'text-white/80' : 'text-slate-500'
                      }`}
                    >
                      {marker.memories.length} kỷ niệm
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Map Footnote */}
          <div className="relative z-10 text-center text-[11px] text-slate-500 font-medium bg-white/70 backdrop-blur-xs p-2.5 rounded-2xl border border-slate-200/60">
            💡 Nhấp vào từng địa danh để lọc danh sách các kỷ niệm diễn ra tại thành phố đó.
          </div>
        </div>

        {/* Selected City Memory Details Drawer (1 col) */}
        <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200/80 flex flex-col justify-between">
          {activeMarkerData ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-rose-500 text-white shadow-xs">
                  <MapPin size={20} />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-800">{activeMarkerData.cityName}</h3>
                  <p className="text-xs text-slate-500">{activeMarkerData.fullLocation}</p>
                </div>
              </div>

              {activeMarkerData.topImage && (
                <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative">
                  <img
                    src={activeMarkerData.topImage}
                    alt={activeMarkerData.cityName}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-black/60 text-white">
                    {activeMarkerData.memories.length} khoảnh khắc
                  </span>
                </div>
              )}

              <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Kỷ niệm tại đây:
                </h4>

                {activeMarkerData.memories.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onOpenMemory(m)}
                    className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{m.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} />
                        {m.date}
                      </div>
                    </div>
                    <ExternalLink size={14} className="text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-xs text-slate-400">
              Chọn một địa danh trên bản đồ để xem kỷ niệm.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
