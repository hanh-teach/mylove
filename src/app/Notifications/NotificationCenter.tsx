import React, { useRef, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, X, CheckCircle2 } from 'lucide-react';
import { useNotifications, AppNotification } from '../../modules/workspace/notifications/NotificationService';
import { Typography } from '../../components/ui/Typography';
import { Card } from '../../components/ui/Card';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <XCircle size={16} className="text-red-500" />;
      case 'info':
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 60000);
    if (diff < 1) return 'Vừa xong';
    if (diff < 60) return `${diff} phút trước`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  return (
    <Card 
      ref={panelRef} 
      className="w-80 sm:w-96 flex flex-col max-h-[500px] overflow-hidden"
      padding="none"
      variant="elevated"
    >
      <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-elevated">
        <Typography variant="title" className="flex items-center gap-2">
          <Bell size={18} className="text-text-muted" />
          Thông báo
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {unreadCount}
            </span>
          )}
        </Typography>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="p-1.5 text-text-muted hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Check size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-text-muted opacity-50">
            <Bell size={32} className="mb-3" />
            <Typography variant="body-sm">Không có thông báo nào</Typography>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-3 rounded-xl flex gap-3 transition-colors cursor-pointer group
                  ${notification.read ? 'hover:bg-surface-elevated' : 'bg-rose-50/30 hover:bg-rose-50/50'}
                `}
              >
                <div className="shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <Typography variant="body-sm" className={`truncate ${notification.read ? '' : 'font-bold'}`}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" className="whitespace-nowrap shrink-0 mt-0.5">
                      {getTimeAgo(notification.timestamp)}
                    </Typography>
                  </div>
                  {notification.message && (
                    <Typography variant="caption" className="line-clamp-2">
                      {notification.message}
                    </Typography>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-2 border-t border-border-subtle">
          <button 
            onClick={clearAll}
            className="w-full py-2 text-xs font-semibold text-text-muted hover:text-text-main hover:bg-surface-elevated rounded-lg transition-colors"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </Card>
  );
};
