import React from 'react';
import { NavigationConfig } from '../shell/NavigationConfig';
import { AppTabType } from '../../types';
import { Typography } from '../ui/Typography';
import { Plus, LayoutDashboard, Folder, ImageIcon, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  isAssetsPanelOpen?: boolean;
  onCreateNew?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onSelectTab,
  isAssetsPanelOpen = false,
  onCreateNew
}) => {
  // Select essential items for bottom navigation dynamically to be robust
  const allNavItems = NavigationConfig.flatMap(section => section.items);
  const homeItem = allNavItems.find(item => item.id === 'home') || { id: 'home', label: 'Dashboard', icon: <LayoutDashboard size={16} />, tabType: 'home' };
  const projectsItem = allNavItems.find(item => item.id === 'projects') || { id: 'projects', label: 'Dự án', icon: <Folder size={16} />, tabType: 'project-dashboard' };
  const assetsItem = allNavItems.find(item => item.id === 'assets') || { id: 'assets', label: 'Thư viện', icon: <ImageIcon size={16} />, tabType: 'assets' };
  const settingsItem = allNavItems.find(item => item.id === 'settings') || { id: 'settings', label: 'Cài đặt', icon: <Settings size={16} />, tabType: 'settings' };

  const bottomItems = [
    { ...homeItem, id: 'nav-home' },
    { ...projectsItem, id: 'nav-projects' },
    { id: 'nav-create', label: 'Tạo mới', icon: <Plus />, isAction: true, tabType: undefined as any }, // Create button
    { ...assetsItem, id: 'nav-assets' },
    { ...settingsItem, id: 'nav-settings' },
  ];

  return (
    <div className="2xl:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-border-base flex items-center justify-around z-40 pb-safe">
      {bottomItems.map((item) => {
        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={() => onCreateNew ? onCreateNew() : onSelectTab('editor')}
              title={item.label}
              aria-label={item.label}
              className="w-12 h-12 -mt-6 bg-rose-600 text-white rounded-2xl shadow-lg flex items-center justify-center active:scale-95 transition-all hover:bg-rose-700 hover:shadow-rose-200"
            >
              <Plus size={24} />
            </button>
          );
        }

        const isAssetsTab = item.tabType === 'assets';
        const isCurrent = isAssetsTab ? isAssetsPanelOpen : activeTab === item.tabType;
        
        return (
          <button
            key={item.id}
            id={item.id}
            onClick={() => {
              if (item.tabType) {
                if (isCurrent) {
                  onSelectTab('editor'); // Tắt tab hiện tại, quay về editor
                } else {
                  onSelectTab(item.tabType);
                }
              }
            }}
            title={item.label}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              isCurrent ? 'text-primary' : 'text-text-muted hover:text-text-main'
            }`}
          >
            <div className={`p-1 rounded-lg ${isCurrent ? 'bg-rose-50' : 'bg-transparent'}`}>
              {React.cloneElement(item.icon as React.ReactElement<{ size?: number; fill?: string }>, { 
                size: 20,
                fill: isCurrent ? 'currentColor' : 'none'
              })}
            </div>
            <Typography variant="label" className={`mt-0.5 text-[9px] uppercase tracking-wide font-bold hidden sm:block ${isCurrent ? 'text-primary' : 'text-text-muted'}`}>
              {item.label}
            </Typography>
          </button>
        );
      })}
    </div>
  );
};

