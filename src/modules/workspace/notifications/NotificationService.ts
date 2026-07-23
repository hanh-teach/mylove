import { useState, useEffect } from 'react';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

type Subscriber = (notifications: AppNotification[]) => void;

class NotificationServiceManager {
  private notifications: AppNotification[] = [];
  private subscribers: Set<Subscriber> = new Set();

  constructor() {
    // Add some initial mock notifications
    this.add({
      type: 'success',
      title: 'Auto Save thành công',
      message: 'Birthday Card đã được lưu.',
    });
    this.add({
      type: 'info',
      title: 'Có phiên bản mới',
      message: 'LoveNote v4.1 đã sẵn sàng.',
    });
  }

  public subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    callback(this.notifications);
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach(cb => cb([...this.notifications]));
  }

  public add(notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      read: false,
    };
    this.notifications = [newNotification, ...this.notifications];
    this.notify();
  }

  public markAsRead(id: string) {
    this.notifications = this.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notify();
  }

  public markAllAsRead() {
    this.notifications = this.notifications.map(n => ({ ...n, read: true }));
    this.notify();
  }

  public clearAll() {
    this.notifications = [];
    this.notify();
  }

  public getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }
}

export const NotificationService = new NotificationServiceManager();

// Hook
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    return NotificationService.subscribe(setNotifications);
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead: (id: string) => NotificationService.markAsRead(id),
    markAllAsRead: () => NotificationService.markAllAsRead(),
    clearAll: () => NotificationService.clearAll(),
  };
}
