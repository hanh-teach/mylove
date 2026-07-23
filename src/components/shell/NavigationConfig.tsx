import React from 'react';
import { AppTabType, NavigationSection } from '../../types';
import { 
  Sparkles, ImageIcon, Heart, PenTool, BookOpen, Clock, Wand2, Settings, Info,
  Folder, LayoutDashboard, Download, Printer, Plus, Star, Database, Zap, Store, Terminal, Radio, ShieldCheck, Rocket, Award
} from 'lucide-react';

export const NavigationConfig: NavigationSection[] = [
  {
    section: 'Workspace',
    items: [
      { id: 'home', label: 'Dashboard', icon: <LayoutDashboard size={16} />, tabType: 'home' },
      { id: 'knowledge', label: 'Knowledge', icon: <Database size={16} />, tabType: 'knowledge' },
      { id: 'automation', label: 'Automation', icon: <Zap size={16} />, tabType: 'automation' },
      { id: 'create', label: 'Tạo mới', icon: <Plus size={16} />, tabType: 'editor' },
      { id: 'projects', label: 'Dự án', icon: <Folder size={16} />, tabType: 'home' },
      { id: 'favorites', label: 'Yêu thích', icon: <Heart size={16} />, tabType: 'home' },
      { id: 'important', label: 'Quan trọng', icon: <Star size={16} />, tabType: 'home' },
      { id: 'assets', label: 'Thư viện', icon: <ImageIcon size={16} />, tabType: 'assets' },
      { id: 'assistant', label: 'AI Assistant', icon: <Wand2 size={16} />, tabType: 'aistudio' },
      { id: 'timeline', label: 'Dòng thời gian', icon: <Clock size={16} />, tabType: 'timeline' },
      { id: 'memory', label: 'Ký ức', icon: <BookOpen size={16} />, tabType: 'memory' },
      { id: 'people', label: 'Nhân vật', icon: <Folder size={16} />, tabType: 'people' },
      { id: 'places', label: 'Địa điểm', icon: <Folder size={16} />, tabType: 'places' },
      { id: 'graph', label: 'Content Graph', icon: <Sparkles size={16} />, tabType: 'graph' },
    ]
  },
  {
    section: 'Hệ sinh thái',
    items: [
      { id: 'marketplace', label: 'Marketplace', icon: <Store size={16} />, tabType: 'marketplace' },
      { id: 'plugins', label: 'Plugins', icon: <Sparkles size={16} />, tabType: 'plugins' },
    ]
  },
  {
    section: 'Hệ thống',
    items: [
      { id: 'completion', label: 'Production Completion', icon: <ShieldCheck size={16} />, tabType: 'completion', badge: 'LPCP' },
      { id: 'mps', label: 'Master Spec (MPS)', icon: <Award size={16} />, tabType: 'mps', badge: 'MPS v1.0' },
      { id: 'stable', label: 'LoveNote 1.0 Stable', icon: <Rocket size={16} />, tabType: 'stable', badge: 'v1.0' },
      { id: 'sync', label: 'Cloud & Sync', icon: <Database size={16} />, tabType: 'sync' },
      { id: 'developer', label: 'Developer Portal', icon: <Terminal size={16} />, tabType: 'developer' },
      { id: 'rc', label: 'Release Candidate (RC)', icon: <ShieldCheck size={16} />, tabType: 'rc', badge: 'Sprint 92' },
      { id: 'release', label: 'Public Beta Portal', icon: <Radio size={16} />, tabType: 'release', badge: 'Beta' },
      { id: 'settings', label: 'Cài đặt', icon: <Settings size={16} />, tabType: 'card' },
      { id: 'design-system', label: 'Design System', icon: <Sparkles size={16} />, tabType: 'design-system' },
      { id: 'help', label: 'Hỗ trợ', icon: <Info size={16} />, tabType: 'card' },
    ]
  }
];
