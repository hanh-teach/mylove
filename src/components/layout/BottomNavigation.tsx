import React from 'react';
import { NavigationConfig } from '../shell/NavigationConfig';
import { AppTabType } from '../../types';
import { Typography } from '../ui/Typography';
import { Plus } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  isAssetsPanelOpen?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab, 
  onSelectTab,
  isAssetsPanelOpen = false
}) => {
  // Select essential items for bottom navigation
  const bottomItems = [
    NavigationConfig[0].items[0], // Home
    NavigationConfig[0].items[2], // Projects
    null, // Placeholder for Create button
    NavigationConfig[0].items[1], // Assets (previously index 4 was AI, but image 3 shows Assets in bottom nav)
    NavigationConfig[1].items[0], // Settings
  ];

  return (
    <div className="2xl:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-border-base flex items-center justify-around z-40 pb-safe">
      {bottomItems.map((item, index) => {
        if (!item) {
          return (
            <button
              key="create-fab"
              className="w-12 h-12 -mt-6 bg-primary text-white rounded-2xl shadow-level-2 flex items-center justify-center active:scale-95 transition-transform"
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
            onClick={() => item.tabType && onSelectTab(item.tabType)}
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
            <Typography variant="label" className={`mt-0.5 lowercase ${isCurrent ? 'text-primary' : 'text-text-muted'}`}>
              {item.label.split(' ')[0]}
            </Typography>
          </button>
        );
      })}
    </div>
  );
};

