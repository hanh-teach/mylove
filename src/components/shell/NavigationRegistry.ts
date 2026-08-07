import React from 'react';
import { Heart, PenTool, BookOpen, Clock, Wand2, Sparkles, Download, Settings, Compass } from 'lucide-react';
import { AppTabType } from './ApplicationShell';

export interface ScreenDefinition {
  id: AppTabType | string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  category: 'Workspace' | 'AI' | 'Projects' | 'System';
  shortcut?: string;
}

export class NavigationRegistry {
  private static screens: Map<string, ScreenDefinition> = new Map([
    ['card', { id: 'card', title: 'Thiệp & Story Card', subtitle: 'Trang chủ thiết kế thiệp & nội dung', icon: React.createElement(Heart, { size: 16 }), category: 'Workspace', shortcut: 'Ctrl+1' }],
    ['editor', { id: 'editor', title: 'AI Writer Studio 4.0', subtitle: 'Trình soạn thảo văn bản & canvas', icon: React.createElement(PenTool, { size: 16 }), category: 'Workspace', shortcut: 'Ctrl+2' }],
    ['memory', { id: 'memory', title: 'Memory Collection', subtitle: 'Bộ sưu tập kỷ niệm & hình ảnh', icon: React.createElement(BookOpen, { size: 16 }), category: 'Workspace', shortcut: 'Ctrl+4' }],
    ['timeline', { id: 'timeline', title: 'Life Timeline 2.0', subtitle: 'Trục thời gian hành trình cuộc sống', icon: React.createElement(Clock, { size: 16 }), category: 'Workspace', shortcut: 'Ctrl+3' }],
    ['aistudio', { id: 'aistudio', title: 'AI Studio & Workflow', subtitle: 'Trung tâm AI và trợ lý thông minh', icon: React.createElement(Wand2, { size: 16 }), category: 'AI', shortcut: 'Ctrl+5' }],
    ['reflection', { id: 'reflection', title: 'AI Reflection', subtitle: 'Nhật ký cảm xúc thông minh', icon: React.createElement(Sparkles, { size: 16 }), category: 'AI' }],
    ['export', { id: 'export', title: 'Export & Share', subtitle: 'Xuất bản và chia sẻ kỷ niệm', icon: React.createElement(Download, { size: 16 }), category: 'Projects' }],
    ['settings', { id: 'settings', title: 'Settings & Secrets', subtitle: 'Cấu hình hệ thống và API', icon: React.createElement(Settings, { size: 16 }), category: 'System', shortcut: 'Ctrl+K' }]
  ]);

  public static register(id: string, definition: ScreenDefinition) {
    this.screens.set(id, definition);
  }

  public static unregister(id: string) {
    this.screens.delete(id);
  }

  public static resolve(id: string): ScreenDefinition | undefined {
    return this.screens.get(id);
  }

  public static getAllScreens(): ScreenDefinition[] {
    return Array.from(this.screens.values());
  }

  public static getScreensByCategory(category: string): ScreenDefinition[] {
    return this.getAllScreens().filter(s => s.category === category);
  }
}
