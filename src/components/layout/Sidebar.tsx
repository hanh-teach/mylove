import React from 'react';
import { NavigationConfig } from '../shell/NavigationConfig';
import { AppTabType } from '../../types';
import { Typography } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Heart } from 'lucide-react';

interface SidebarProps {
  activeTab: AppTabType;
  onSelectTab: (tab: AppTabType) => void;
  isDrawer?: boolean;
  isAssetsPanelOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab, 
  isDrawer = false,
  isAssetsPanelOpen = false
}) => {
  return (
    <div className={`flex flex-col h-full bg-white overflow-hidden ${isDrawer ? 'w-full' : 'w-16'}`}>
      <div className={`flex-1 p-2 space-y-6 overflow-y-auto overflow-x-hidden ${isDrawer ? 'p-4' : ''}`}>
        {NavigationConfig.map((sectionGroup) => (
          <div key={sectionGroup.section} className="space-y-1">
            {isDrawer && (
              <Typography variant="label" className="px-3 mb-2">
                {sectionGroup.section}
              </Typography>
            )}
            <div className="space-y-0.5">
              {sectionGroup.items.map((item) => {
                const isAssetsTab = item.tabType === 'assets';
                const isCurrent = isAssetsTab ? isAssetsPanelOpen : activeTab === item.tabType;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => item.tabType && onSelectTab(item.tabType)}
                    className={`group relative w-full flex items-center p-2 rounded-xl transition-all duration-200 ${
                      isCurrent
                        ? 'bg-rose-50 text-rose-600 shadow-sm'
                        : 'text-text-muted hover:bg-surface-elevated hover:text-text-main'
                    } ${isDrawer ? 'justify-between px-3 py-2.5' : 'justify-center'}`}
                    title={!isDrawer ? item.label : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-colors ${isCurrent ? 'bg-rose-100 text-rose-600' : 'bg-transparent text-text-muted'}`}>
                        {React.cloneElement(item.icon as React.ReactElement<{ size?: number; fill?: string }>, { 
                          size: 18,
                          fill: isCurrent ? 'currentColor' : 'none'
                        })}
                      </div>
                      {isDrawer && (
                        <Typography variant="body-sm" className={isCurrent ? 'font-bold' : 'font-medium'}>
                          {item.label}
                        </Typography>
                      )}
                    </div>
                    
                    {/* Tooltip for narrow sidebar */}
                    {!isDrawer && (
                      <div className="absolute left-14 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}

                    {isDrawer && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className={`p-2 border-t border-border-subtle bg-surface-elevated ${isDrawer ? 'p-4' : ''}`}>
        {isDrawer ? (
          <Card variant="flat" padding="sm" className="bg-rose-50 border-rose-100 border">
            <Typography variant="label" className="text-rose-600 mb-1">Dùng thử Premium</Typography>
            <Typography variant="body-sm" className="text-rose-700 font-medium mb-3">Mở khóa tính năng AI nâng cao</Typography>
            <button className="w-full py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 transition-colors">
              Nâng cấp ngay
            </button>
          </Card>
        ) : (
          <button className="w-10 h-10 mx-auto rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 hover:bg-rose-100 transition-colors">
            <Heart size={18} fill="currentColor" />
          </button>
        )}
      </div>
    </div>
  );
};

