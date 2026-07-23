import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Store, Search, Star, Download, ShieldCheck, 
  Puzzle, Palette, LayoutTemplate, Sparkles, FolderHeart,
  ChevronRight, Filter, BookOpen, Briefcase, GraduationCap, PartyPopper, CheckCircle2
} from 'lucide-react';
import { Typography } from '../ui/Typography';
import { Button } from '../ui/Button';
import { marketplaceService } from '../../modules/marketplace/MarketplaceService';
import { MarketplaceItem, UserMarketplaceData, MarketplaceCategory } from '../../modules/marketplace/types';

export const MarketplaceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MarketplaceCategory | 'discover' | 'installed'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  
  const [items, setItems] = useState<MarketplaceItem[]>(marketplaceService.getItems());
  const [userData, setUserData] = useState<UserMarketplaceData>(marketplaceService.getUserData());
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateItems(activeTab, activeTag, query);
  };
  
  const handleTabChange = (tab: MarketplaceCategory | 'discover' | 'installed') => {
    setActiveTab(tab);
    updateItems(tab, activeTag, searchQuery);
  };
  
  const handleTagChange = (tag: string) => {
    setActiveTag(tag);
    updateItems(activeTab, tag, searchQuery);
  };
  
  const updateItems = (tab: string, tag: string, query: string) => {
    if (tab === 'installed') {
      const allItems = marketplaceService.getItems({ search: query });
      setItems(allItems.filter(item => userData.installedItemIds.includes(item.id)));
    } else {
      const category = tab === 'discover' ? 'all' : tab;
      setItems(marketplaceService.getItems({ category, tag, search: query }));
    }
  };

  const handleInstall = (id: string) => {
    marketplaceService.installItem(id);
    setUserData({ ...marketplaceService.getUserData() });
    updateItems(activeTab, activeTag, searchQuery);
  };
  
  const handleUninstall = (id: string) => {
    marketplaceService.uninstallItem(id);
    setUserData({ ...marketplaceService.getUserData() });
    updateItems(activeTab, activeTag, searchQuery);
  };

  const handleToggleFavorite = (id: string) => {
    marketplaceService.toggleFavorite(id);
    setUserData({ ...marketplaceService.getUserData() });
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Store size={16} />
              <span>Ecosystem</span>
            </div>
            <Typography variant="h2" className="text-slate-900 tracking-tighter">
              Marketplace Hub
            </Typography>
            <Typography variant="body" className="text-slate-500 mt-2 max-w-xl">
              Khám phá hàng ngàn templates, plugins, AI packs và themes từ cộng đồng LoveNote.
            </Typography>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-100 text-amber-600">
              <Download size={24} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                {userData.installedItemIds.length} Đã cài
              </div>
              <div className="text-xs text-amber-600 font-bold">
                {userData.updatesAvailable.length} Bản cập nhật
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => handleTabChange('installed')}
              className="ml-4 bg-white"
            >
              Quản lý
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar gap-2">
          <TabButton active={activeTab === 'discover'} onClick={() => handleTabChange('discover')} label="Khám phá" icon={<Star size={16} />} />
          <TabButton active={activeTab === 'template'} onClick={() => handleTabChange('template')} label="Templates" icon={<LayoutTemplate size={16} />} />
          <TabButton active={activeTab === 'plugin'} onClick={() => handleTabChange('plugin')} label="Plugins" icon={<Puzzle size={16} />} />
          <TabButton active={activeTab === 'theme'} onClick={() => handleTabChange('theme')} label="Themes" icon={<Palette size={16} />} />
          <TabButton active={activeTab === 'aipack'} onClick={() => handleTabChange('aipack')} label="AI Packs" icon={<Sparkles size={16} />} />
          <TabButton active={activeTab === 'collection'} onClick={() => handleTabChange('collection')} label="Collections" icon={<FolderHeart size={16} />} />
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm kiếm..." 
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
        </div>
      </div>

      {/* Categories Filter (Only on discover tab) */}
      {activeTab === 'discover' && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <FilterChip active={activeTag === 'all'} onClick={() => handleTagChange('all')} label="Tất cả" />
          <FilterChip active={activeTag === 'featured'} onClick={() => handleTagChange('featured')} label="Nổi bật" icon={<Star size={14} />} />
          <FilterChip active={activeTag === 'education'} onClick={() => handleTagChange('education')} label="Giáo dục" icon={<GraduationCap size={14} />} />
          <FilterChip active={activeTag === 'family'} onClick={() => handleTagChange('family')} label="Gia đình" icon={<FolderHeart size={14} />} />
          <FilterChip active={activeTag === 'work'} onClick={() => handleTagChange('work')} label="Công việc" icon={<Briefcase size={14} />} />
          <FilterChip active={activeTag === 'event'} onClick={() => handleTagChange('event')} label="Sự kiện" icon={<PartyPopper size={14} />} />
        </div>
      )}

      {/* Content Grid */}
      <div className="min-h-[400px]">
        {items.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-slate-200 border-dashed">
            <Search size={32} className="text-slate-300 mb-4" />
            <Typography variant="h4" className="text-slate-900 mb-2">Không tìm thấy kết quả</Typography>
            <Typography variant="body-sm" className="text-slate-500">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <MarketplaceItemCard 
                key={item.id} 
                item={item} 
                isInstalled={userData.installedItemIds.includes(item.id)}
                isFavorite={userData.favoriteItemIds.includes(item.id)}
                hasUpdate={userData.updatesAvailable.some(u => u.itemId === item.id)}
                onInstall={() => handleInstall(item.id)}
                onUninstall={() => handleUninstall(item.id)}
                onToggleFavorite={() => handleToggleFavorite(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MarketplaceItemCard: React.FC<{ 
  item: MarketplaceItem, 
  isInstalled: boolean, 
  isFavorite: boolean,
  hasUpdate: boolean,
  onInstall: () => void,
  onUninstall: () => void,
  onToggleFavorite: () => void
}> = ({ item, isInstalled, isFavorite, hasUpdate, onInstall, onUninstall, onToggleFavorite }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:border-amber-200 transition-all flex flex-col overflow-hidden group">
      {/* Card Header & Icon */}
      <div className="p-5 flex items-start justify-between border-b border-slate-50 bg-slate-50/50">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
          item.type === 'template' ? 'bg-blue-50 text-blue-600' :
          item.type === 'plugin' ? 'bg-indigo-50 text-indigo-600' :
          item.type === 'theme' ? 'bg-rose-50 text-rose-600' :
          item.type === 'aipack' ? 'bg-purple-50 text-purple-600' :
          'bg-amber-50 text-amber-600'
        }`}>
          {item.type === 'template' ? <LayoutTemplate size={24} /> :
           item.type === 'plugin' ? <Puzzle size={24} /> :
           item.type === 'theme' ? <Palette size={24} /> :
           item.type === 'aipack' ? <Sparkles size={24} /> :
           <FolderHeart size={24} />}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-1 rounded-lg shadow-xs border border-slate-100">
            {item.type}
          </span>
          <button 
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'text-rose-500 bg-rose-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-bold text-slate-900 text-base line-clamp-1">{item.name}</h4>
        </div>
        
        <div className="text-[11px] text-slate-500 font-medium mb-3 flex items-center gap-1">
          <span>By</span>
          <span className="text-slate-700 font-bold hover:text-amber-600 cursor-pointer">{item.authorName}</span>
          {item.authorId === 'auth_1' && <ShieldCheck size={12} className="text-emerald-500" title="Verified Publisher" />}
        </div>
        
        <Typography variant="body-sm" className="text-slate-600 mb-4 line-clamp-2 flex-1">
          {item.description}
        </Typography>
        
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-400" fill="currentColor" />
            <span>{item.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download size={14} />
            <span>{(item.downloads / 1000).toFixed(1)}k</span>
          </div>
          <div className="flex items-center gap-1 text-[10px]">
            v{item.version}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
          {isInstalled ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onUninstall}
                className="flex-1 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                Gỡ cài đặt
              </Button>
              {hasUpdate ? (
                <Button variant="primary" size="sm" onClick={onInstall} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white shadow-none">
                  Cập nhật
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1 bg-emerald-50 text-emerald-700 border-emerald-200 pointer-events-none">
                  <CheckCircle2 size={16} className="mr-1.5" /> Đã cài
                </Button>
              )}
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={onInstall} className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-none">
              {item.price === 0 ? 'Miễn phí' : `$${item.price}`} • Cài đặt
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 flex items-center gap-2 text-sm font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
      active ? 'bg-amber-100 text-amber-700' : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

const FilterChip: React.FC<{ active: boolean, onClick: () => void, label: string, icon?: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
      active ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    {label}
  </button>
);
