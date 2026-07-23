import React, { useRef, useState, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle, X, CheckCircle2 } from 'lucide-react';
import { useNotifications, AppNotification } from '../../../modules/workspace/notifications/NotificationService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
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

  if (!isOpen) return null;

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
    const diff = Math.floor((Date.now() - timestamp) / 60000); // in minutes
    if (diff < 1) return 'Vừa xong';
    if (diff < 60) return `${diff} phút trước`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  return (
    <div 
      ref={panelRef} 
      className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[500px] animate-in fade-in slide-in-from-top-4 duration-200"
    >
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Bell size={18} className="text-slate-500" />
          Thông báo
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {unreadCount} mới
            </span>
          )}
        </h3>
        <div className="flex gap-1">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              title="Đánh dấu tất cả đã đọc"
            >
              <Check size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notifications.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <Bell size={32} className="mb-3 opacity-20" />
            <p className="text-sm">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-3 rounded-xl flex gap-3 transition-colors cursor-pointer group
                  ${notification.read ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'}
                `}
              >
                <div className="shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h4 className={`text-sm truncate ${notification.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0 mt-0.5">
                      {getTimeAgo(notification.timestamp)}
                    </span>
                  </div>
                  {notification.message && (
                    <p className={`text-xs line-clamp-2 ${notification.read ? 'text-slate-500' : 'text-slate-600'}`}>
                      {notification.message}
                    </p>
                  )}
                </div>
                {!notification.read && (
                  <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-2 border-t border-slate-100 shrink-0">
          <button 
            onClick={clearAll}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
};
