import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Sparkles,
  FolderPlus,
  FileText,
  Clock,
  Settings,
  HelpCircle,
  FileDown,
  History,
  CornerDownLeft,
  Command,
  Plus,
  Play,
  Pause,
  X,
  Layers,
  Wand2,
  BookOpen,
  Image as ImageIcon,
  Check,
  ChevronRight,
  Folder,
  Sliders,
  Database,
  Eye,
  Trash2,
  Archive,
  Volume2
} from 'lucide-react';
import { CommandRegistry, CommandDefinition } from '../../modules/command/CommandRegistry';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { MemoryService } from '../../modules/memory/MemoryService';
import { timelineStore } from '../../modules/timeline/TimelineStore';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: any) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceType, setDeviceType] = useState<'desktop' | 'android' | 'ios'>('desktop');
  const [recentCommandIds, setRecentCommandIds] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const { projects, activeProject, selectProject } = useProjectWorkspace();

  // Detect device type for responsive layouts
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) {
      setDeviceType('android');
    } else if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType('ios');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  // Fetch recent commands from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('love_note_recent_commands');
      if (stored) {
        setRecentCommandIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  const addRecentCommand = (id: string) => {
    const updated = [id, ...recentCommandIds.filter(x => x !== id)].slice(0, 5);
    setRecentCommandIds(updated);
    try {
      localStorage.setItem('love_note_recent_commands', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Register default commands on mount if not already present
  useEffect(() => {
    const defaultCommands: CommandDefinition[] = [
      // 1. Quick Actions
      {
        id: 'new-project',
        title: 'Tạo dự án mới (New Project)',
        description: 'Tạo một dự án câu chuyện tình yêu hay thiệp chúc mừng mới',
        category: 'Quick Actions',
        icon: 'FolderPlus',
        shortcut: ['N'],
        action: () => {
          window.dispatchEvent(new CustomEvent('trigger-new-project-dialog'));
          onClose();
        }
      },
      {
        id: 'new-document',
        title: 'Viết tài liệu mới (New Document)',
        description: 'Mở trình soạn thảo với tài liệu trống',
        category: 'Quick Actions',
        icon: 'FileText',
        shortcut: ['D'],
        action: () => {
          onSelectTab('editor');
          onClose();
        }
      },
      {
        id: 'new-memory',
        title: 'Thêm kỷ niệm mới (New Memory)',
        description: 'Lưu trữ một khoảnh khắc, hình ảnh hoặc lá thư kỷ niệm mới',
        category: 'Quick Actions',
        icon: 'BookOpen',
        shortcut: ['M'],
        action: () => {
          onSelectTab('memory');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-new-memory-dialog'));
          }, 100);
          onClose();
        }
      },
      {
        id: 'new-timeline',
        title: 'Thêm sự kiện dòng thời gian (New Timeline Event)',
        description: 'Thêm một mốc thời gian ý nghĩa vào chặng đường',
        category: 'Quick Actions',
        icon: 'Clock',
        shortcut: ['T'],
        action: () => {
          onSelectTab('timeline');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-new-timeline-dialog'));
          }, 100);
          onClose();
        }
      },
      // 2. AI Commands
      {
        id: 'ai-improve',
        title: 'AI Tối ưu hóa câu chữ (AI Improve Writing)',
        description: 'Cải thiện văn phong và lỗi chính tả bằng AI',
        category: 'AI Commands',
        icon: 'Wand2',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-ai-action', { detail: { type: 'improve' } }));
          }, 100);
          onClose();
        }
      },
      {
        id: 'ai-rewrite',
        title: 'AI Viết lại nội dung (AI Rewrite)',
        description: 'Thay đổi tông giọng hoặc viết lại một đoạn văn khác',
        category: 'AI Commands',
        icon: 'Wand2',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-ai-action', { detail: { type: 'rewrite' } }));
          }, 100);
          onClose();
        }
      },
      {
        id: 'ai-translate',
        title: 'AI Dịch văn bản (AI Translate)',
        description: 'Dịch văn bản sang tiếng Anh, Hàn, Nhật, Trung...',
        category: 'AI Commands',
        icon: 'Wand2',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-ai-action', { detail: { type: 'translate' } }));
          }, 100);
          onClose();
        }
      },
      {
        id: 'ai-summarize',
        title: 'AI Tóm tắt kỷ niệm (AI Summarize)',
        description: 'Tạo một bản tóm tắt ngắn gọn và lãng mạn từ câu chuyện',
        category: 'AI Commands',
        icon: 'Wand2',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-ai-action', { detail: { type: 'summarize' } }));
          }, 100);
          onClose();
        }
      },
      {
        id: 'ai-gen-image',
        title: 'AI Tạo ảnh minh họa (AI Generate Image)',
        description: 'Sử dụng AI vẽ bức tranh lãng mạn cho thiệp',
        category: 'AI Commands',
        icon: 'ImageIcon',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-ai-action', { detail: { type: 'generate-image' } }));
          }, 100);
          onClose();
        }
      },
      {
        id: 'ai-gen-speech',
        title: 'AI Tạo giọng đọc ngọt ngào (AI Generate Speech)',
        description: 'Chuyển văn bản thành giọng đọc truyền cảm lồng nhạc nền',
        category: 'AI Commands',
        icon: 'Volume2',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-ai-action', { detail: { type: 'generate-speech' } }));
          }, 100);
          onClose();
        }
      },
      // 3. Workflow Commands
      {
        id: 'wf-create',
        title: 'Khởi tạo Workflow thiết kế (Create Workflow)',
        description: 'Tự động tạo ra quy trình các bước hoàn thiện thiệp kỷ niệm',
        category: 'Workflow Commands',
        icon: 'Layers',
        action: () => {
          onSelectTab('aistudio');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-workflow-action', { detail: { action: 'create' } }));
          }, 100);
          onClose();
        }
      },
      {
        id: 'wf-pause',
        title: 'Tạm dừng Workflow (Pause Workflow)',
        description: 'Tạm dừng quy trình chạy tự động hiện tại',
        category: 'Workflow Commands',
        icon: 'Pause',
        action: () => {
          window.dispatchEvent(new CustomEvent('trigger-workflow-action', { detail: { action: 'pause' } }));
          onClose();
        }
      },
      {
        id: 'wf-resume',
        title: 'Tiếp tục Workflow (Resume Workflow)',
        description: 'Tiếp tục tiến trình thiết kế dở dang',
        category: 'Workflow Commands',
        icon: 'Play',
        action: () => {
          window.dispatchEvent(new CustomEvent('trigger-workflow-action', { detail: { action: 'resume' } }));
          onClose();
        }
      },
      {
        id: 'wf-cancel',
        title: 'Hủy bỏ tiến trình Workflow (Cancel Workflow)',
        description: 'Hủy bỏ tiến trình hiện tại để làm quy trình mới',
        category: 'Workflow Commands',
        icon: 'X',
        action: () => {
          window.dispatchEvent(new CustomEvent('trigger-workflow-action', { detail: { action: 'cancel' } }));
          onClose();
        }
      },
      {
        id: 'wf-runtime',
        title: 'Xem tiến trình Runtime (View Runtime)',
        description: 'Kiểm tra log thực thi và trạng thái hoạt động của AI',
        category: 'Workflow Commands',
        icon: 'Sliders',
        action: () => {
          onSelectTab('aistudio');
          onClose();
        }
      },
      {
        id: 'wf-history',
        title: 'Lịch sử thiết kế tự động (Workflow History)',
        description: 'Xem các tác vụ và workflow đã hoàn thành trước đó',
        category: 'Workflow Commands',
        icon: 'History',
        action: () => {
          onSelectTab('aistudio');
          onClose();
        }
      },
      // 4. Memory Commands
      {
        id: 'mem-add',
        title: 'Thêm kỷ niệm nhanh (Add Memory)',
        description: 'Tạo một bài viết nhật ký kỷ niệm nhanh chóng',
        category: 'Memory Commands',
        icon: 'Plus',
        action: () => {
          onSelectTab('memory');
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('trigger-new-memory-dialog'));
          }, 100);
          onClose();
        }
      },
      {
        id: 'mem-search',
        title: 'Tìm kiếm nâng cao kỷ niệm (Search Memory)',
        description: 'Lọc kỷ niệm theo cảm xúc, thẻ, vị trí địa lý',
        category: 'Memory Commands',
        icon: 'Search',
        action: () => {
          onSelectTab('memory');
          onClose();
        }
      },
      {
        id: 'mem-import-photo',
        title: 'Nhập kho ảnh kỷ niệm (Import Photos)',
        description: 'Tải nhiều hình ảnh lên Media Library cùng lúc',
        category: 'Memory Commands',
        icon: 'ImageIcon',
        action: () => {
          onSelectTab('assets');
          onClose();
        }
      },
      // 5. Navigation Commands
      {
        id: 'nav-dashboard',
        title: 'Đi đến Workspace Dashboard',
        description: 'Xem tổng quan tất cả dự án, kỷ niệm và dòng thời gian',
        category: 'Navigation',
        icon: 'Database',
        action: () => {
          onSelectTab('home');
          onClose();
        }
      },
      {
        id: 'nav-editor',
        title: 'Mở trình soạn thảo (Open Editor)',
        description: 'Đi tới AI Writer Studio thiết kế thiệp và story card',
        category: 'Navigation',
        icon: 'FileText',
        action: () => {
          onSelectTab('editor');
          onClose();
        }
      },
      {
        id: 'nav-memory',
        title: 'Mở Bộ sưu tập kỷ niệm (Open Memory Collection)',
        description: 'Xem tất cả kỷ niệm lưu giữ của hai bạn',
        category: 'Navigation',
        icon: 'BookOpen',
        action: () => {
          onSelectTab('memory');
          onClose();
        }
      },
      {
        id: 'nav-timeline',
        title: 'Mở Dòng thời gian tình yêu (Open Life Timeline 2.0)',
        description: 'Xem các sự kiện cột mốc lãng mạn qua thời gian',
        category: 'Navigation',
        icon: 'Clock',
        action: () => {
          onSelectTab('timeline');
          onClose();
        }
      },
      {
        id: 'nav-aistudio',
        title: 'Mở AI Studio & Workflow',
        description: 'Sử dụng các trợ lý AI thông minh nâng cao',
        category: 'Navigation',
        icon: 'Wand2',
        action: () => {
          onSelectTab('aistudio');
          onClose();
        }
      },
      {
        id: 'nav-settings',
        title: 'Mở Cấu hình cài đặt (Settings)',
        description: 'Quản lý các API keys và thông tin cá nhân',
        category: 'Navigation',
        icon: 'Settings',
        action: () => {
          window.dispatchEvent(new CustomEvent('trigger-settings'));
          onClose();
        }
      }
    ];

    const currentCommands = CommandRegistry.getCommands();
    defaultCommands.forEach(cmd => {
      if (!currentCommands.some(c => c.id === cmd.id)) {
        CommandRegistry.register(cmd);
      }
    });
  }, [onSelectTab, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        setQuery('');
        setSelectedIndex(0);
      }, 150);
    }
  }, [isOpen]);

  // Search Logic
  const results = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim();
    const commandList = CommandRegistry.getCommands();

    // 1. Filter Commands
    const filteredCommands = commandList.filter(cmd => 
      cmd.title.toLowerCase().includes(lowerQuery) || 
      cmd.category.toLowerCase().includes(lowerQuery) ||
      (cmd.description && cmd.description.toLowerCase().includes(lowerQuery))
    );

    // 2. Fetch & Filter Projects
    const filteredProjects = projects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery))
    );

    // 3. Fetch & Filter Memories
    let memoriesList = [];
    try {
      memoriesList = MemoryService.getMemories();
    } catch (e) {
      console.error(e);
    }
    const filteredMemories = memoriesList.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) || 
      (m.content && m.content.toLowerCase().includes(lowerQuery)) ||
      (m.location && m.location.toLowerCase().includes(lowerQuery))
    );

    // 4. Fetch & Filter Timeline Items
    let timelineItemsList: any[] = [];
    if (activeProject) {
      try {
        const activeTimeline = timelineStore.getOrCreateTimeline(activeProject.id);
        timelineItemsList = timelineStore.getTimelineItems(activeTimeline.id);
      } catch (e) {
        console.error(e);
      }
    }
    const filteredTimelineItems = timelineItemsList.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      (t.description && t.description.toLowerCase().includes(lowerQuery))
    );

    // Construct unified list
    const sections: {
      type: 'command' | 'project' | 'memory' | 'timeline';
      title: string;
      items: any[];
    }[] = [];

    if (lowerQuery === '') {
      // If query is empty, show Recent Commands first
      const recents = recentCommandIds
        .map(id => commandList.find(c => c.id === id))
        .filter(Boolean) as CommandDefinition[];

      if (recents.length > 0) {
        sections.push({
          type: 'command',
          title: 'Lệnh sử dụng gần đây (Recent Commands)',
          items: recents
        });
      }

      // Group default commands by Category for beautiful display
      const categories = ['Quick Actions', 'AI Commands', 'Workflow Commands', 'Memory Commands', 'Navigation'];
      categories.forEach(cat => {
        const catCmds = commandList.filter(c => c.category === cat);
        if (catCmds.length > 0) {
          sections.push({
            type: 'command',
            title: cat,
            items: catCmds
          });
        }
      });
    } else {
      // If query exists, group results by type
      if (filteredCommands.length > 0) {
        sections.push({
          type: 'command',
          title: 'Commands',
          items: filteredCommands
        });
      }
      if (filteredProjects.length > 0) {
        sections.push({
          type: 'project',
          title: 'Projects',
          items: filteredProjects
        });
      }
      if (filteredMemories.length > 0) {
        sections.push({
          type: 'memory',
          title: 'Memories',
          items: filteredMemories
        });
      }
      if (filteredTimelineItems.length > 0) {
        sections.push({
          type: 'timeline',
          title: 'Timeline Events',
          items: filteredTimelineItems
        });
      }
    }

    // Flatten results for flat keyboard navigation index
    const flatList: {
      type: 'command' | 'project' | 'memory' | 'timeline';
      data: any;
    }[] = [];

    sections.forEach(sec => {
      sec.items.forEach(item => {
        flatList.push({ type: sec.type, data: item });
      });
    });

    return { sections, flatList };
  }, [query, projects, activeProject, recentCommandIds]);

  // Keep index in range
  useEffect(() => {
    if (selectedIndex >= results.flatList.length) {
      setSelectedIndex(0);
    }
  }, [results, selectedIndex]);

  // Handle keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, results.flatList.length));
        setTimeout(scrollSelectedIntoView, 10);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.flatList.length) % Math.max(1, results.flatList.length));
        setTimeout(scrollSelectedIntoView, 10);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.flatList[selectedIndex]) {
          handleSelect(results.flatList[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  const scrollSelectedIntoView = () => {
    const activeEl = scrollableRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  };

  const handleSelect = (item: { type: 'command' | 'project' | 'memory' | 'timeline'; data: any }) => {
    if (item.type === 'command') {
      const cmd = item.data as CommandDefinition;
      addRecentCommand(cmd.id);
      cmd.action();
    } else if (item.type === 'project') {
      selectProject(item.data.id);
      onSelectTab('editor');
      onClose();
    } else if (item.type === 'memory') {
      onSelectTab('memory');
      // Set query or filter in memory dashboard if desired
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('focus-memory-item', { detail: item.data.id }));
      }, 150);
      onClose();
    } else if (item.type === 'timeline') {
      onSelectTab('timeline');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('focus-timeline-item', { detail: item.data.id }));
      }, 150);
      onClose();
    }
  };

  // Helper to render lucide icon dynamically
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'FolderPlus': return <FolderPlus size={16} />;
      case 'FileText': return <FileText size={16} />;
      case 'BookOpen': return <BookOpen size={16} />;
      case 'Clock': return <Clock size={16} />;
      case 'Wand2': return <Wand2 size={16} />;
      case 'ImageIcon': return <ImageIcon size={16} />;
      case 'Volume2': return <Volume2 size={16} />;
      case 'Layers': return <Layers size={16} />;
      case 'Pause': return <Pause size={16} />;
      case 'Play': return <Play size={16} />;
      case 'X': return <X size={16} />;
      case 'Sliders': return <Sliders size={16} />;
      case 'History': return <History size={16} />;
      case 'Plus': return <Plus size={16} />;
      case 'Search': return <Search size={16} />;
      case 'Settings': return <Settings size={16} />;
      case 'Database': return <Database size={16} />;
      default: return <Command size={16} />;
    }
  };

  if (!isOpen) return null;

  // Let's compute flattened index offset
  let itemCounter = 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 overflow-hidden">
        {/* Backdrop with elegant blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs"
        />

        {/* Command Palette Card Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative bg-slate-900 border border-slate-800 text-slate-100 flex flex-col z-10 shadow-2xl overflow-hidden
            ${deviceType === 'ios' 
              ? 'w-full max-w-lg rounded-3xl h-[70vh] mt-4' 
              : deviceType === 'android'
                ? 'w-full max-w-md rounded-t-3xl h-[65vh] fixed bottom-0 left-0 right-0 pt-2'
                : 'w-full max-w-2xl rounded-2xl max-h-[60vh]'
            }`}
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Search Field */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/50">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                deviceType === 'ios'
                  ? "Tìm kiếm dự án, kỷ niệm, lệnh..."
                  : "Gõ tìm kiếm dự án, kỷ niệm, lệnh, workflow..."
              }
              className="w-full bg-transparent text-sm border-none focus:outline-none focus:ring-0 text-slate-100 placeholder-slate-400 font-medium"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <X size={14} />
              </button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono flex items-center gap-1">
                <Command size={10} /> Esc
              </span>
            </div>
          </div>

          {/* Results Scroller */}
          <div 
            ref={scrollableRef}
            className="flex-1 overflow-y-auto py-2 divide-y divide-slate-800/20 max-h-[45vh]"
          >
            {results.sections.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center text-slate-300 border border-slate-800">
                  <Search size={20} />
                </div>
                <div className="text-sm font-semibold text-slate-300">Không tìm thấy kết quả nào</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  Thử tìm kiếm với từ khóa khác như "birthday", "travel", "ai", "memory"...
                </p>
              </div>
            ) : (
              results.sections.map((sec) => (
                <div key={sec.title} className="py-2 first:pt-1">
                  {/* Category Header */}
                  <div className="px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-rose-400/80 flex items-center justify-between">
                    <span>{sec.title}</span>
                    <span className="text-slate-500 font-mono font-medium">{sec.items.length}</span>
                  </div>

                  {/* Category Items */}
                  <div className="mt-1 space-y-0.5">
                    {sec.items.map((item) => {
                      const globalIndex = itemCounter;
                      itemCounter++;
                      const isSelected = globalIndex === selectedIndex;

                      // Category specific renderings
                      let titleStr = '';
                      let descStr = '';
                      let iconEl = null;
                      let tagBadge = null;

                      if (sec.type === 'command') {
                        titleStr = item.title;
                        descStr = item.description || '';
                        iconEl = renderIcon(item.icon);
                        tagBadge = (
                          <span className="text-[9px] font-bold bg-rose-950/50 border border-rose-900/50 text-rose-400 px-2 py-0.5 rounded-full">
                            Command
                          </span>
                        );
                      } else if (sec.type === 'project') {
                        titleStr = `${item.icon || '📁'} ${item.title}`;
                        descStr = item.description || 'Dự án Love Note';
                        iconEl = <Folder className="text-slate-400" size={16} />;
                        tagBadge = (
                          <span className="text-[9px] font-bold bg-indigo-950/50 border border-indigo-900/50 text-indigo-400 px-2 py-0.5 rounded-full">
                            Project
                          </span>
                        );
                      } else if (sec.type === 'memory') {
                        titleStr = item.title;
                        descStr = item.content || '';
                        iconEl = <BookOpen className="text-rose-400" size={16} />;
                        tagBadge = (
                          <span className="text-[9px] font-bold bg-emerald-950/50 border border-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full">
                            Memory
                          </span>
                        );
                      } else if (sec.type === 'timeline') {
                        titleStr = item.title;
                        descStr = item.description || '';
                        iconEl = <Clock className="text-amber-400" size={16} />;
                        tagBadge = (
                          <span className="text-[9px] font-bold bg-amber-950/50 border border-amber-900/50 text-amber-400 px-2 py-0.5 rounded-full">
                            Timeline
                          </span>
                        );
                      }

                      return (
                        <button
                          key={item.id || globalIndex}
                          data-active={isSelected}
                          onClick={() => handleSelect({ type: sec.type, data: item })}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full text-left px-4 py-2 flex items-center justify-between gap-3 transition-all duration-150 relative border-l-2
                            ${isSelected 
                              ? 'bg-slate-800/80 text-white border-rose-500' 
                              : 'text-slate-300 hover:text-white border-transparent hover:bg-slate-800/30'
                            }`}
                        >
                          <div className="flex items-center gap-3 truncate min-w-0">
                            <div className={`shrink-0 p-1.5 rounded-xl transition-colors
                              ${isSelected ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800/50 text-slate-400'}`}
                            >
                              {iconEl}
                            </div>
                            <div className="truncate text-left">
                              <div className="text-xs font-bold leading-tight flex items-center gap-2">
                                <span className="truncate">{titleStr}</span>
                                {item.shortcut && (
                                  <span className="hidden sm:inline-block text-[9px] bg-slate-800 px-1 py-0.1 font-mono rounded text-slate-400">
                                    {item.shortcut.join('+')}
                                  </span>
                                )}
                              </div>
                              {descStr && (
                                <div className={`text-[11px] leading-normal truncate mt-0.5
                                  ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}
                                >
                                  {descStr}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            {tagBadge}
                            {isSelected && <ChevronRight size={14} className="text-rose-400" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/90 text-[10px] text-slate-400 flex items-center justify-between font-medium shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1 py-0.2 rounded font-mono font-bold text-slate-300">↑↓</kbd> Di chuyển
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-slate-800 px-1 py-0.2 rounded font-mono font-bold text-slate-300">Enter</kbd> Chọn
              </span>
            </div>
            <div className="flex items-center gap-1 text-rose-400">
              <Sparkles size={11} />
              <span>Love Note 4.0 Studio</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
