import React, { useState, useEffect, useCallback, useRef } from 'react';
import html2canvas from 'html2canvas';
import { LayerPanel } from './LayerPanel';
import { InspectorPanel, HistoryItem } from './InspectorPanel';
// import { HistoryPanel } from './HistoryPanel';
import { EditorToolbar } from './EditorToolbar';
import { CanvasViewport } from './CanvasViewport';
import { AssetBrowser } from './AssetBrowser';
import { ShortcutsModal } from './ShortcutsModal';
import { LoveNoteEditorMVP } from './LoveNoteEditorMVP';
import { ZoomControls } from '../../modules/editor/ZoomControls';
import { MiniMap } from './MiniMap';
import { DraftRecoveryModal } from './DraftRecoveryModal';
import { EditorWorkflowPanel } from './EditorWorkflowPanel';
import { EditorMemoryPanel } from './EditorMemoryPanel';
import { TimelineStudio } from './TimelineStudio';
import { ExportStudioModal } from './export/ExportStudioModal';
import { PrintStudioModal } from './print/PrintStudioModal';
import { ProjectInspectorSidebar } from './ProjectInspectorSidebar';
import { ILayer } from '../../modules/editor/LayerTypes';
import { LayerModel } from '../../modules/editor/LayerModel';
import { ArrangeService } from '../../modules/editor/ArrangeService';
import { ViewportTransform, calculateFitTransform } from '../../modules/editor/ZoomEngine';
import { Sparkles, Layers, History, Sliders, X, Check, Eye, Grid, Keyboard, Package, Wand2, Activity, ChevronUp, ChevronDown, Heart, FileText, Folder, CalendarRange } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { ThemeRegistry } from '../../modules/theme/ThemeRegistry';
import { ThemeService } from '../../modules/theme/ThemeService';

const DRAFT_STORAGE_KEY = 'love_note_editor_draft_v4';

interface StudioEditorProps {
  initialTitle: string;
  initialMessage: string;
  initialPlacedItems: any[];
  scene: string;
  bgStyle: string;
  fontStyle: string;
  textColor: string;
  onClose?: () => void;
  onSyncToCard?: (title: string, message: string, items: any[]) => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  initialTitle,
  initialMessage,
  initialPlacedItems,
  scene,
  bgStyle,
  fontStyle,
  textColor,
  onClose,
  onSyncToCard,
}) => {
  const { activeProject } = useProjectWorkspace();

  // 1. Initial Default Layers Creation
  const createDefaultLayers = (): ILayer[] => {
    if (activeProject?.metadata?.layers && activeProject.metadata.layers.length > 0) {
      return activeProject.metadata.layers.map((l: any) => new LayerModel(l));
    }
    const layers: ILayer[] = [
      new LayerModel({
        id: 'layer_title',
        type: 'text',
        name: 'Tiêu đề (Title)',
        x: 100,
        y: 120,
        width: 800,
        height: 100,
        zIndex: 1,
        metadata: {
          text: initialTitle || 'Nhập chủ đề...',
          fontStyle: fontStyle || 'playfair',
          color: '#881337',
          align: 'center',
        },
      }),
      new LayerModel({
        id: 'layer_message',
        type: 'text',
        name: 'Lời chúc (Message)',
        x: 150,
        y: 250,
        width: 700,
        height: 180,
        zIndex: 2,
        metadata: {
          text: initialMessage || 'Vào Tùy chỉnh để thiết lập nhé!',
          fontStyle: fontStyle || 'playfair',
          color: '#9f1239',
          align: 'center',
        },
      }),
    ];

    if (initialPlacedItems && initialPlacedItems.length > 0) {
      initialPlacedItems.forEach((item, index) => {
        layers.push(
          new LayerModel({
            id: `layer_decor_${item.id || index}`,
            type: 'decor',
            name: `Decor - ${item.type}`,
            x: Math.round(item.x) + 300,
            y: Math.round(item.y) + 200,
            width: Math.round(80 * (item.scale || 1)),
            height: Math.round(80 * (item.scale || 1)),
            rotation: item.rotation || 0,
            zIndex: 10 + index,
            metadata: {
              decorType: item.type,
              color: item.color || '#f43f5e',
              animation: item.animation || 'none',
            },
          })
        );
      });
    } else {
      layers.push(
        new LayerModel({
          id: 'layer_decor_heart',
          type: 'decor',
          name: 'Decor - Heart',
          x: 450,
          y: 460,
          width: 100,
          height: 100,
          zIndex: 10,
          metadata: { decorType: 'Heart', color: '#f43f5e', animation: 'pulse' },
        })
      );
    }

    return layers;
  };

  const [layers, setLayers] = useState<ILayer[]>(createDefaultLayers);
  const [selectedLayerIds, setSelectedLayerIds] = useState<string[]>(['layer_title']);
  const [clipboardLayers, setClipboardLayers] = useState<ILayer[]>([]);

  // Toggles & Settings
  const [gridEnabled, setGridEnabled] = useState<boolean>(false);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  // Viewport Transform State
  const [viewport, setViewport] = useState<ViewportTransform>({
    zoom: 0.85,
    panX: 120,
    panY: 80,
  });

  // Canvas Global Config
  const [canvasConfig, setCanvasConfig] = useState(() => {
    const templateThemeId = activeProject?.metadata?.themeId;
    if (templateThemeId) {
      const theme = ThemeRegistry.getById(templateThemeId);
      return {
        scene: theme.scene,
        bgStyle: theme.bgStyle,
        fontStyle: theme.fontStyle,
        textColor: textColor || 'default',
        textSize: 1,
        themeId: theme.id,
      };
    }
    return {
      scene: scene || 'rose',
      bgStyle: bgStyle || 'floating',
      fontStyle: fontStyle || 'playfair',
      textColor: textColor || 'default',
      textSize: 1,
      themeId: '',
    };
  });

  // Sidebar Toggles
  const [activeTab, setActiveTab] = useState<'workflow' | 'assets' | 'layers' | 'inspector' | 'lovenote-mvp' | 'timeline'>('lovenote-mvp');
  const [isRightWorkflowOpen, setIsRightWorkflowOpen] = useState<boolean>(false);
  const [isMobileWorkflowOpen, setIsMobileWorkflowOpen] = useState<boolean>(false);
  const [isRightInspectorOpen, setIsRightInspectorOpen] = useState<boolean>(true);
  const [isRightInspectorPinned, setIsRightInspectorPinned] = useState<boolean>(true);

  // Apply workflow generated result to Canvas
  const handleApplyWorkflowToCanvas = (generatedText: string, decorType?: string) => {
    setLayers((prev) => {
      const msgLayer = prev.find((l) => l.id === 'layer_message');
      if (msgLayer) {
        return prev.map((l) =>
          l.id === 'layer_message'
            ? { ...l, metadata: { ...l.metadata, text: generatedText } }
            : l
        );
      } else {
        return prev;
      }
    });

    if (decorType) {
      handleAddDecorLayer(decorType);
    }

    pushHistorySnapshot('Áp dụng kết quả từ AI Workflow', layers);
  };

  // Apply memory to Canvas
  const handleApplyMemoryToCanvas = (memoryTitle: string, memoryContent: string) => {
    setLayers((prev) => {
      let updated = [...prev];
      const titleLayer = updated.find((l) => l.id === 'layer_title');
      const msgLayer = updated.find((l) => l.id === 'layer_message');
      if (titleLayer) {
        updated = updated.map((l) => l.id === 'layer_title' ? { ...l, metadata: { ...l.metadata, text: memoryTitle } } : l);
      }
      if (msgLayer) {
        updated = updated.map((l) => l.id === 'layer_message' ? { ...l, metadata: { ...l.metadata, text: memoryContent } } : l);
      }
      return updated;
    });
    pushHistorySnapshot('Áp dụng kỷ niệm từ Memory Workspace', layers);
  };

  // History Engine Stacks
  const [historyStack, setHistoryStack] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Draft Recovery State
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);

  // Push state snapshot to history stack
  const pushHistorySnapshot = useCallback(
    (actionName: string, currentLayers: ILayer[]) => {
      const timestamp = new Date().toLocaleTimeString([], { hour12: false });
      const snapshot = JSON.parse(JSON.stringify(currentLayers));

      setHistoryStack((prevStack) => {
        const newStack = prevStack.slice(0, historyIndex + 1);
        const newItem: HistoryItem = {
          id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          action: actionName,
          timestamp,
          snapshot,
        };
        return [...newStack, newItem];
      });

      setHistoryIndex((prevIndex) => prevIndex + 1);
    },
    [historyIndex]
  );

  // Initial history snapshot on load
  useEffect(() => {
    if (historyStack.length === 0) {
      const initialSnapshot = JSON.parse(JSON.stringify(layers));
      setHistoryStack([
        {
          id: `hist_init`,
          action: 'Khởi tạo Canvas',
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          snapshot: initialSnapshot,
        },
      ]);
      setHistoryIndex(0);
    }
  }, []);

  // 2. Draft Auto Save Engine
  useEffect(() => {
    const autoSaveTimer = setInterval(() => {
      try {
        const payload = {
          timestamp: new Date().toLocaleTimeString([], { hour12: false }),
          layers,
          canvasConfig,
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.error('Lỗi khi tự động lưu nháp:', e);
      }
    }, 10000);

    return () => clearInterval(autoSaveTimer);
  }, [layers, canvasConfig]);

  // Check draft on mount
  useEffect(() => {
    try {
      const savedDraftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraftRaw) {
        const parsed = JSON.parse(savedDraftRaw);
        if (parsed && parsed.layers && parsed.layers.length > 0) {
          setDraftSavedTime(parsed.timestamp || 'Gần đây');
          setIsDraftModalOpen(true);
        }
      }
    } catch (e) {
      console.error('Lỗi kiểm tra bản nháp:', e);
    }
  }, []);

  const handleRestoreDraft = () => {
    try {
      const savedDraftRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraftRaw) {
        const parsed = JSON.parse(savedDraftRaw);
        if (parsed.layers) {
          setLayers(parsed.layers);
          if (parsed.canvasConfig) setCanvasConfig(parsed.canvasConfig);
          pushHistorySnapshot('Khôi phục bản nháp tự động', parsed.layers);
        }
      }
    } catch (e) {
      console.error('Không thể khôi phục bản nháp:', e);
    } finally {
      setIsDraftModalOpen(false);
    }
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setIsDraftModalOpen(false);
  };

  // 3. Layer Operations & Helper Handlers
  const handleUpdateLayer = (id: string, updates: Partial<ILayer>) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        return {
          ...layer,
          ...updates,
          metadata: {
            ...layer.metadata,
            ...(updates.metadata || {}),
          },
        };
      })
    );
  };

  const handleSelectLayer = (id: string, isMulti: boolean) => {
    if (isMulti) {
      setSelectedLayerIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setSelectedLayerIds([id]);
    }
  };

  const handleSelectMultipleLayers = (ids: string[]) => {
    setSelectedLayerIds(ids);
  };

  const handleSelectAll = () => {
    setSelectedLayerIds(layers.map((l) => l.id));
  };

  const handleClearSelection = () => {
    setSelectedLayerIds([]);
  };

  const handleRenameLayer = (id: string, newName: string) => {
    handleUpdateLayer(id, { name: newName });
    pushHistorySnapshot(`Đổi tên layer '${newName}'`, layers);
  };

  const handleDuplicateLayer = (id?: string) => {
    const targetIds = id ? [id] : selectedLayerIds;
    if (targetIds.length === 0) return;

    const clones: ILayer[] = [];
    targetIds.forEach((targetId) => {
      const target = layers.find((l) => l.id === targetId);
      if (target) {
        const clone = LayerModel.duplicate(target, target.parentId);
        clone.x += 20;
        clone.y += 20;
        clones.push(clone);
      }
    });

    setLayers((prev) => [...prev, ...clones]);
    setSelectedLayerIds(clones.map((c) => c.id));
    pushHistorySnapshot(`Nhân bản ${clones.length} layer`, [...layers, ...clones]);
  };

  const handleDeleteLayer = (id?: string) => {
    const idsToDelete = id ? [id] : selectedLayerIds;
    if (idsToDelete.length === 0) return;

    const remaining = layers.filter((l) => !idsToDelete.includes(l.id));
    setLayers(remaining);
    setSelectedLayerIds([]);
    pushHistorySnapshot(`Xóa ${idsToDelete.length} layer`, remaining);
  };

  const handleToggleLock = (id?: string) => {
    const targetIds = id ? [id] : selectedLayerIds;
    if (targetIds.length === 0) return;

    setLayers((prev) =>
      prev.map((l) => (targetIds.includes(l.id) ? { ...l, locked: !l.locked } : l))
    );
  };

  const handleToggleVisibility = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: l.visible === false ? true : false } : l))
    );
  };

  const handleMoveLayerOrder = (id: string, direction: 'up' | 'down') => {
    setLayers((prev) => {
      const sorted = [...prev].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
      const idx = sorted.findIndex((l) => l.id === id);
      if (idx === -1) return prev;

      if (direction === 'up' && idx < sorted.length - 1) {
        const target = sorted[idx + 1];
        const tempZ = sorted[idx].zIndex || 0;
        sorted[idx].zIndex = target.zIndex || 0;
        target.zIndex = tempZ;
      } else if (direction === 'down' && idx > 0) {
        const target = sorted[idx - 1];
        const tempZ = sorted[idx].zIndex || 0;
        sorted[idx].zIndex = target.zIndex || 0;
        target.zIndex = tempZ;
      }

      return [...sorted];
    });
  };

  const handleBringToFront = (id?: string) => {
    const targetIds = id ? [id] : selectedLayerIds;
    if (targetIds.length === 0) return;

    const maxZ = Math.max(...layers.map((l) => l.zIndex || 0), 0);
    setLayers((prev) =>
      prev.map((l) => (targetIds.includes(l.id) ? { ...l, zIndex: maxZ + 1 } : l))
    );
    pushHistorySnapshot('Lên trên cùng', layers);
  };

  const handleSendToBack = (id?: string) => {
    const targetIds = id ? [id] : selectedLayerIds;
    if (targetIds.length === 0) return;

    const minZ = Math.min(...layers.map((l) => l.zIndex || 0), 0);
    setLayers((prev) =>
      prev.map((l) => (targetIds.includes(l.id) ? { ...l, zIndex: minZ - 1 } : l))
    );
    pushHistorySnapshot('Xuống dưới cùng', layers);
  };

  // Alignment Helpers
  const handleAlign = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedLayerIds.length === 0) return;
    const updated = ArrangeService.alignLayers(layers, selectedLayerIds, alignment);
    setLayers(updated);
    pushHistorySnapshot(`Căn lề ${alignment}`, updated);
  };

  // Grouping
  const handleGroup = () => {
    if (selectedLayerIds.length < 2) return;
    const { newLayers, groupId } = ArrangeService.groupLayers(layers, selectedLayerIds);
    setLayers(newLayers);
    if (groupId) setSelectedLayerIds([groupId]);
    pushHistorySnapshot('Gộp nhóm layers', newLayers);
  };

  const handleUngroup = () => {
    if (selectedLayerIds.length === 0) return;
    const primary = layers.find((l) => selectedLayerIds.includes(l.id));
    if (!primary || primary.type !== 'group') return;

    const updated = ArrangeService.ungroupLayers(layers, primary.id);
    setLayers(updated);
    setSelectedLayerIds([]);
    pushHistorySnapshot('Rã nhóm layer', updated);
  };

  // Quick Layer Additions
  const handleAddTextLayer = (customText?: string) => {
    const newTextLayer = new LayerModel({
      id: `layer_text_${Date.now()}`,
      type: 'text',
      name: 'Chữ mới',
      x: 350,
      y: 280,
      width: 400,
      height: 80,
      zIndex: layers.length + 10,
      metadata: {
        text: customText || 'Nhập nội dung mới...',
        fontStyle: canvasConfig.fontStyle || 'playfair',
        color: '#881337',
        align: 'center',
      },
    });

    setLayers((prev) => [...prev, newTextLayer]);
    setSelectedLayerIds([newTextLayer.id]);
    pushHistorySnapshot('Thêm chữ mới', [...layers, newTextLayer]);
  };

  const handleAddDecorLayer = (decorType = 'Heart') => {
    const newDecorLayer = new LayerModel({
      id: `layer_decor_${Date.now()}`,
      type: 'decor',
      name: `Decor - ${decorType}`,
      x: 450,
      y: 300,
      width: 90,
      height: 90,
      zIndex: layers.length + 10,
      metadata: { decorType, color: '#f43f5e', animation: 'pulse' },
    });

    setLayers((prev) => [...prev, newDecorLayer]);
    setSelectedLayerIds([newDecorLayer.id]);
    pushHistorySnapshot(`Thêm decor ${decorType}`, [...layers, newDecorLayer]);
  };

  const handleAddLayerFromDrop = (assetData: any) => {
    let newLayer: ILayer;

    if (assetData.type === 'insert-asset' && assetData.asset) {
      const asset = assetData.asset;
      newLayer = new LayerModel({
        id: `layer_asset_${Date.now()}`,
        type: 'image',
        name: asset.title,
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: asset.type === 'icon' || asset.type === 'sticker' ? 100 : 320,
        height: asset.type === 'icon' || asset.type === 'sticker' ? 100 : 250,
        zIndex: layers.length + 10,
        metadata: {
          imageUrl: asset.url,
          decorType: asset.type === 'icon' ? 'Sparkles' : undefined,
          color: '#f43f5e',
          size: 250,
        },
      });
    } else if (assetData.type === 'text') {
      newLayer = new LayerModel({
        id: `layer_text_${Date.now()}`,
        type: 'text',
        name: assetData.text || 'Văn bản thả',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 380,
        height: 80,
        zIndex: layers.length + 10,
        metadata: {
          text: assetData.text || 'Nội dung mới...',
          fontStyle: assetData.fontStyle || 'playfair',
          color: '#881337',
          align: 'center',
        },
      });
    } else if (assetData.type === 'image') {
      newLayer = new LayerModel({
        id: `layer_image_${Date.now()}`,
        type: 'image',
        name: assetData.name || 'Ảnh kỷ niệm',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 320,
        height: 250,
        zIndex: layers.length + 10,
        metadata: {
          imageUrl: assetData.imageUrl || assetData.url || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80',
          caption: assetData.caption || 'Một khoảnh khắc bên nhau',
          borderRadius: 16,
          borderStyle: 'solid',
          borderColor: '#fda4af',
          borderWidth: 2,
          rotation: 0
        }
      });
    } else if (assetData.type === 'shape') {
      newLayer = new LayerModel({
        id: `layer_shape_${Date.now()}`,
        type: 'shape',
        name: `Hình học: ${assetData.shapeType || 'rect'}`,
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 120,
        height: 120,
        zIndex: layers.length + 10,
        metadata: {
          shapeType: assetData.shapeType || 'rect',
          fillColor: assetData.fillColor || '#fda4af',
          strokeColor: assetData.strokeColor || '#f43f5e',
          strokeWidth: 2,
          opacity: 1
        }
      });
    } else if (assetData.type === 'divider') {
      newLayer = new LayerModel({
        id: `layer_divider_${Date.now()}`,
        type: 'divider',
        name: 'Đường phân cách',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 400,
        height: 20,
        zIndex: layers.length + 10,
        metadata: {
          dividerStyle: assetData.dividerStyle || 'dashed',
          color: assetData.color || '#fda4af',
          height: 2
        }
      });
    } else if (assetData.type === 'quote') {
      newLayer = new LayerModel({
        id: `layer_quote_${Date.now()}`,
        type: 'quote',
        name: 'Trích dẫn',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 380,
        height: 110,
        zIndex: layers.length + 10,
        metadata: {
          quoteText: assetData.quoteText || '"Khi yêu, trái tim tự vẽ nên con đường ngọt ngào nhất."',
          quoteAuthor: assetData.quoteAuthor || 'Khuyết danh',
          color: '#4c1d95',
          borderColor: '#8b5cf6'
        }
      });
    } else if (assetData.type === 'checklist') {
      newLayer = new LayerModel({
        id: `layer_checklist_${Date.now()}`,
        type: 'checklist',
        name: 'Danh sách việc cần làm',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 280,
        height: 200,
        zIndex: layers.length + 10,
        metadata: {
          color: '#0f766e',
          items: assetData.items || [
            { id: '1', text: 'Cùng ngắm hoàng hôn Phú Quốc', checked: true },
            { id: '2', text: 'Tự tay nấu bữa tối lãng mạn', checked: false },
            { id: '3', text: 'Gửi thư tay viết tay bất ngờ', checked: false }
          ]
        }
      });
    } else if (assetData.type === 'table') {
      newLayer = new LayerModel({
        id: `layer_table_${Date.now()}`,
        type: 'table',
        name: 'Bảng kỷ niệm',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 380,
        height: 180,
        zIndex: layers.length + 10,
        metadata: {
          color: '#1e3a8a',
          headers: ['Thời gian', 'Địa điểm', 'Ghi chú'],
          rows: [
            ['14/02/2024', 'Đà Lạt', 'Kỷ niệm 1 năm'],
            ['24/12/2024', 'Sapa', 'Giáng sinh ngọt ngào'],
            ['01/01/2025', 'Hà Nội', 'Chào năm mới']
          ]
        }
      });
    } else if (assetData.type === 'timeline_block') {
      newLayer = new LayerModel({
        id: `layer_timeline_${Date.now()}`,
        type: 'timeline_block',
        name: 'Dòng thời gian',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 320,
        height: 260,
        zIndex: layers.length + 10,
        metadata: {
          color: '#0369a1',
          events: [
            { id: 'e1', time: '2023', title: 'Gặp gỡ lần đầu', desc: 'Ngày đầu tiên gặp mặt dưới cơn mưa nhẹ tại góc quán cà phê nhỏ.' },
            { id: 'e2', time: '2024', title: 'Chuyến đi đầu tiên', desc: 'Cùng nhau đi qua những cung đường tuyệt đẹp ở vùng cao Tây Bắc.' },
            { id: 'e3', time: '2025', title: 'Lời hứa trọn đời', desc: 'Dưới ánh hoàng hôn, lời đồng ý ngọt ngào khởi đầu cho hạnh phúc mãi mãi.' }
          ]
        }
      });
    } else if (assetData.type === 'memory' || assetData.type === 'memory_block') {
      newLayer = new LayerModel({
        id: `layer_memory_${Date.now()}`,
        type: 'memory_block',
        name: `Kỷ niệm: ${assetData.title || 'Mới'}`,
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 350,
        height: 280,
        zIndex: layers.length + 10,
        metadata: {
          memoryId: assetData.memoryId || assetData.id || `mem_${Date.now()}`,
          title: assetData.title || 'Tiêu Đề Kỷ Niệm',
          content: assetData.content || 'Nội dung kỷ niệm ngọt ngào...',
          coverImage: assetData.coverImage || assetData.imageUrl || 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=600&q=80',
          mood: assetData.mood || 'Romantic',
          date: assetData.date || '2024-02-14'
        }
      });
    } else if (assetData.type === 'ai_block') {
      newLayer = new LayerModel({
        id: `layer_ai_${Date.now()}`,
        type: 'ai_block',
        name: 'Hộp AI Agnes',
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 360,
        height: 280,
        zIndex: layers.length + 10,
        metadata: {
          prompt: assetData.prompt || 'Gợi ý lời chúc kỷ niệm ngày yêu nhau',
          suggestion: 'Bấm nút "Tạo Gợi Ý AI" để sáng tạo lời chúc ngọt ngào nhất...',
          status: 'idle'
        }
      });
    } else {
      newLayer = new LayerModel({
        id: `layer_decor_${Date.now()}`,
        type: 'decor',
        name: `Decor - ${assetData.decorType || 'Heart'}`,
        x: assetData.x || 300,
        y: assetData.y || 200,
        width: 90,
        height: 90,
        zIndex: layers.length + 10,
        metadata: {
          decorType: assetData.decorType || 'Heart',
          color: assetData.color || '#f43f5e',
          animation: 'pulse',
        },
      });
    }

    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerIds([newLayer.id]);
    pushHistorySnapshot(`Thả ${newLayer.name} vào Canvas`, [...layers, newLayer]);
  };

  // AI Rewrite Handler
  const handleAIRewrite = () => {
    const textLayer = layers.find((l) => selectedLayerIds.includes(l.id) && l.type === 'text');
    if (!textLayer) return;

    const original = textLayer.metadata?.text || '';
    const rewrites = [
      'Gửi trao những lời nhắn chân thành và sâu sắc nhất...',
      'Mỗi khoảnh khắc đáng nhớ đều là món quà quý giá trên hành trình...',
      'Chúc cho tình bạn và sự gắn kết luôn trọn vẹn và đong đầy niềm vui...',
    ];
    const randomChoice = rewrites[Math.floor(Math.random() * rewrites.length)];

    handleUpdateLayer(textLayer.id, {
      metadata: { ...textLayer.metadata, text: randomChoice },
    });
    pushHistorySnapshot('AI Rewrite nội dung', layers);
  };

  // Theme Applying Handler
  const handleApplyTheme = (themeId: string) => {
    const result = ThemeService.applyTheme(themeId, canvasConfig, layers);
    setCanvasConfig(result.canvasConfig);
    setLayers(result.layers);
    pushHistorySnapshot(`Áp dụng Theme "${ThemeRegistry.getById(themeId).name}"`, result.layers);
  };

  // 4. Undo / Redo Engine
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetSnapshot = historyStack[prevIndex].snapshot;
      setLayers(JSON.parse(JSON.stringify(targetSnapshot)));
      setHistoryIndex(prevIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetSnapshot = historyStack[nextIndex].snapshot;
      setLayers(JSON.parse(JSON.stringify(targetSnapshot)));
      setHistoryIndex(nextIndex);
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          if (e.shiftKey) handleRedo();
          else handleUndo();
          e.preventDefault();
        } else if (e.key === 'y') {
          handleRedo();
          e.preventDefault();
        } else if (e.key === 'c') {
          // Copy selected layers
          const targets = layers.filter((l) => selectedLayerIds.includes(l.id));
          if (targets.length > 0) setClipboardLayers(targets);
          e.preventDefault();
        } else if (e.key === 'v') {
          // Paste clipboard layers
          if (clipboardLayers.length > 0) {
            const clones = clipboardLayers.map((target) => {
              const clone = LayerModel.duplicate(target, target.parentId);
              clone.x += 30;
              clone.y += 30;
              return clone;
            });
            setLayers((prev) => [...prev, ...clones]);
            setSelectedLayerIds(clones.map((c) => c.id));
            pushHistorySnapshot('Dán layers từ clipboard', [...layers, ...clones]);
          }
          e.preventDefault();
        } else if (e.key === 'd') {
          handleDuplicateLayer();
          e.preventDefault();
        } else if (e.key === 'g') {
          if (e.shiftKey) handleUngroup();
          else handleGroup();
          e.preventDefault();
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteLayer();
        e.preventDefault();
      } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        // Nudge layer position
        if (selectedLayerIds.length > 0) {
          const step = e.shiftKey ? 10 : 1;
          const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
          const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;

          selectedLayerIds.forEach((id) => {
            const layer = layers.find((l) => l.id === id);
            if (layer) {
              handleUpdateLayer(id, { x: layer.x + dx, y: layer.y + dy });
            }
          });
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerIds, layers, clipboardLayers, historyIndex, historyStack]);

  // Sync to Card & Exit
  const handleSyncAndClose = () => {
    const titleLayer = layers.find((l) => l.id === 'layer_title' || l.name.includes('Title'));
    const messageLayer = layers.find((l) => l.id === 'layer_message' || l.name.includes('Message'));
    const decorLayers = layers.filter((l) => l.type === 'decor' || l.type === 'image');

    const syncedTitle = titleLayer?.metadata?.text || initialTitle;
    const syncedMessage = messageLayer?.metadata?.text || initialMessage;

    const syncedItems = decorLayers.map((l, index) => ({
      id: l.id,
      type: l.metadata?.decorType || 'Heart',
      x: l.x - 300,
      y: l.y - 200,
      scale: (l.width / 80) || 1,
      rotation: l.rotation || 0,
      color: l.metadata?.color || '#f43f5e',
      animation: l.metadata?.animation || 'none',
    }));

    if (onSyncToCard) {
      onSyncToCard(syncedTitle, syncedMessage, syncedItems);
    } else if (onClose) {
      onClose();
    }
  };

  const primarySelected = layers.find((l) => selectedLayerIds.includes(l.id));

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex flex-col overflow-hidden text-slate-800 select-none animate-in fade-in duration-200">
      {/* Studio Top Navigation Bar */}
      <header className="h-14 bg-white/95 border-b border-rose-100/80 px-4 flex items-center justify-between shadow-xs z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-md shadow-rose-500/30">
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span>Studio 4.0</span>
              {activeProject && (
                <span className="text-[11px] bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                  <span>{activeProject.icon}</span>
                  <span className="max-w-[150px] truncate">{activeProject.title}</span>
                </span>
              )}
            </h1>
            <p className="text-[10px] text-slate-400">Workspace Multi-Document Editor</p>
          </div>
        </div>

        {/* Center Main Toolbar */}
        <div className="hidden md:flex items-center justify-center">
          <EditorToolbar
            hasSelection={selectedLayerIds.length > 0}
            selectedCount={selectedLayerIds.length}
            isLocked={primarySelected?.locked || false}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < historyStack.length - 1}
            gridEnabled={gridEnabled}
            snapToGrid={snapToGrid}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onDuplicate={() => handleDuplicateLayer()}
            onDelete={() => handleDeleteLayer()}
            onToggleLock={() => handleToggleLock()}
            onToggleGrid={() => setGridEnabled((prev) => !prev)}
            onToggleSnapToGrid={() => setSnapToGrid((prev) => !prev)}
            onAlignLeft={() => handleAlign('left')}
            onAlignCenter={() => handleAlign('center')}
            onAlignRight={() => handleAlign('right')}
            onAlignTop={() => handleAlign('top')}
            onAlignMiddle={() => handleAlign('middle')}
            onAlignBottom={() => handleAlign('bottom')}
            onBringToFront={() => handleBringToFront()}
            onSendToBack={() => handleSendToBack()}
            onGroup={handleGroup}
            onUngroup={handleUngroup}
            onOpenExport={() => setIsExportOpen(true)}
            onOpenPrint={() => setIsPrintOpen(true)}
            onQuickExport={handleSyncAndClose}
            onAddText={() => handleAddTextLayer()}
            onAddDecor={() => handleAddDecorLayer()}
            onShowShortcuts={() => setIsShortcutsModalOpen(true)}
            onToggleWorkflow={() => setIsRightWorkflowOpen(!isRightWorkflowOpen)}
          />
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRightInspectorOpen(!isRightInspectorOpen)}
            className={`px-3 py-1.5 rounded-2xl transition-all text-xs flex items-center gap-1.5 font-bold border ${
              isRightInspectorOpen 
                ? 'bg-rose-500 text-white border-rose-500 hover:bg-rose-600 shadow-md shadow-rose-500/10' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
            }`}
            title="Bật/Tắt Inspector"
          >
            <span>☰ Inspector</span>
          </button>

          <button
            onClick={() => setIsShortcutsModalOpen(true)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-colors text-xs flex items-center gap-1 font-medium"
            title="Xem Phím Tắt"
          >
            <Keyboard size={16} />
            <span className="hidden sm:inline">Phím tắt</span>
          </button>

          <button
            onClick={handleSyncAndClose}
            className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs rounded-2xl transition-all shadow-md shadow-rose-500/25 flex items-center gap-1.5"
          >
            <Check size={16} />
            <span>Đồng bộ Thiệp</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-rose-50 rounded-2xl transition-colors"
              title="Đóng Studio"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>

      {/* Main Studio Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar Tab Navigation & Panel Drawer */}
        <div className="flex z-40">
          {/* Vertical Icon Rail */}
          <div className="w-14 bg-white/95 border-r border-rose-100/80 flex flex-col items-center py-3 gap-3 shadow-xs">
            <button
                onClick={() => setActiveTab('memory')}
                className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                  activeTab === 'memory'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                }`}
                title="Memory Workspace"
              >
                <Heart size={18} />
                <span>Memory</span>
              </button>

              <button
                onClick={() => setActiveTab('assets')}
                className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                  activeTab === 'assets'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                    : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
                }`}
                title="Thư viện Assets"
              >
                <Package size={18} />
                <span>Assets</span>
              </button>

            <button
              onClick={() => setActiveTab('layers')}
              className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                activeTab === 'layers'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title="Danh sách Layers"
            >
              <Layers size={18} />
              <span>Layers</span>
            </button>

            <button
              onClick={() => setActiveTab('inspector')}
              className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                activeTab === 'inspector'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title="Inspector Thuộc tính"
            >
              <Sliders size={18} />
              <span>Thuộc tính</span>
            </button>

            <button
              onClick={() => setActiveTab('lovenote-mvp')}
              className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                activeTab === 'lovenote-mvp'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title="Writing & Letter Editor"
            >
              <FileText size={18} />
              <span>Writer</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                activeTab === 'timeline'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title="Timeline Studio"
            >
              <CalendarRange size={18} />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab('workflow')}
              className={`p-2.5 rounded-2xl transition-all flex flex-col items-center gap-1 text-[10px] font-semibold ${
                activeTab === 'workflow'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-500 hover:bg-rose-50 hover:text-rose-600'
              }`}
              title="AI Workflow Panel"
            >
              <Wand2 size={18} />
              <span>Workflow</span>
            </button>
          </div>

          {/* Active Drawer Panel Container */}
          <div className="h-full p-2">
            {activeTab === 'memory' && (
              <div className="w-84 h-full bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden flex flex-col">
                <EditorMemoryPanel
                  onApplyToCanvas={handleApplyMemoryToCanvas}
                  onClose={() => setActiveTab('assets')}
                />
              </div>
            )}
            {activeTab === 'workflow' && (
              <div className="w-80 h-full bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden flex flex-col">
                <EditorWorkflowPanel
                  onApplyToCanvas={handleApplyWorkflowToCanvas}
                  onClose={() => setActiveTab('assets')}
                />
              </div>
            )}
            {activeTab === 'assets' && (
              <AssetBrowser
                onAddText={handleAddTextLayer}
                onAddDecor={handleAddDecorLayer}
                onAddShape={(type) => handleAddDecorLayer('Gift')}
                onInsertProjectAsset={(asset) => {
                  const newLayer = new LayerModel({
                    id: `layer_asset_${Date.now()}`,
                    type: 'image',
                    name: asset.title,
                    x: 200,
                    y: 150,
                    width: 250,
                    height: 200,
                    zIndex: layers.length + 10,
                    metadata: {
                      imageUrl: asset.url,
                      decorType: 'Sparkles',
                      color: '#f43f5e',
                      size: 250,
                    },
                  });
                  setLayers((prev) => [...prev, newLayer]);
                  setSelectedLayerIds([newLayer.id]);
                  pushHistorySnapshot(`Chèn Asset "${asset.title}" từ Media Library`, [...layers, newLayer]);
                }}
              />
            )}

            {activeTab === 'layers' && (
              <LayerPanel
                layers={layers}
                selectedLayerIds={selectedLayerIds}
                onSelectLayer={handleSelectLayer}
                onSelectAll={handleSelectAll}
                onClearSelection={handleClearSelection}
                onRenameLayer={handleRenameLayer}
                onDuplicateLayer={(id) => handleDuplicateLayer(id)}
                onDeleteLayer={(id) => handleDeleteLayer(id)}
                onToggleLock={(id) => handleToggleLock(id)}
                onToggleVisibility={handleToggleVisibility}
                onMoveUp={(id) => handleMoveLayerOrder(id, 'up')}
                onMoveDown={(id) => handleMoveLayerOrder(id, 'down')}
                onReorderLayers={(draggedId, targetId) => {
                  const targetLayer = layers.find((l) => l.id === targetId);
                  if (targetLayer) {
                    handleUpdateLayer(draggedId, { zIndex: (targetLayer.zIndex || 0) + 1 });
                  }
                }}
                onAddTextLayer={() => handleAddTextLayer()}
                onAddDecorLayer={() => handleAddDecorLayer()}
              />
            )}

            {activeTab === 'inspector' && (
              <InspectorPanel
                selectedLayers={layers.filter((l) => selectedLayerIds.includes(l.id))}
                canvasConfig={canvasConfig}
                onUpdateLayer={handleUpdateLayer}
                onUpdateCanvasConfig={(key, val) =>
                  setCanvasConfig((prev) => ({ ...prev, [key]: val }))
                }
                onApplyTheme={handleApplyTheme}
                onAIRewrite={handleAIRewrite}
                historyStack={historyStack}
                historyIndex={historyIndex}
                onSelectHistoryStep={(index) => {
                  setHistoryIndex(index);
                  setLayers(JSON.parse(JSON.stringify(historyStack[index].snapshot)));
                }}
              />
            )}
          </div>
        </div>

        {/* Center Canvas / Editor Viewport */}
        <main className={`flex-1 h-full relative overflow-y-auto ${
          activeTab === 'lovenote-mvp' 
            ? 'bg-gradient-to-br from-rose-50/50 via-slate-50 to-pink-50/40 p-4 sm:p-8 flex items-center justify-center' 
            : activeTab === 'timeline'
              ? 'bg-slate-50'
              : 'overflow-hidden bg-slate-100'
        }`}>
          {activeTab === 'lovenote-mvp' ? (
            <LoveNoteEditorMVP
              onOpenAIAssistant={() => setIsRightWorkflowOpen(true)}
              onSyncToCard={(newTitle, newMsg) => {
                handleApplyWorkflowToCanvas(newMsg);
                setActiveTab('assets');
              }}
            />
          ) : activeTab === 'timeline' ? (
            <TimelineStudio
              currentEditorTitle={layers.find((l) => l.id === 'layer_title')?.metadata?.text || ''}
              currentEditorMessage={layers.find((l) => l.id === 'layer_message')?.metadata?.text || ''}
              onApplyDraftToEditor={(title, msg) => {
                setLayers((prev) =>
                  prev.map((l) => {
                    if (l.id === 'layer_title') {
                      return { ...l, metadata: { ...l.metadata, text: title } };
                    }
                    if (l.id === 'layer_message') {
                      return { ...l, metadata: { ...l.metadata, text: msg } };
                    }
                    return l;
                  })
                );
              }}
              onOpenAIAssistant={() => {
                setActiveTab('workflow');
              }}
            />
          ) : (
            <CanvasViewport
              layers={layers}
              selectedLayerIds={selectedLayerIds}
              viewport={viewport}
              canvasConfig={canvasConfig}
              gridEnabled={gridEnabled}
              snapToGrid={snapToGrid}
              onViewportChange={setViewport}
              onSelectLayer={handleSelectLayer}
              onSelectMultipleLayers={handleSelectMultipleLayers}
              onClearSelection={handleClearSelection}
              onUpdateLayer={handleUpdateLayer}
              onAddTextLayer={handleAddTextLayer}
              onAddDecorLayer={handleAddDecorLayer}
              onAddLayerFromDrop={handleAddLayerFromDrop}
              onCopy={() => {
                const targets = layers.filter((l) => selectedLayerIds.includes(l.id));
                if (targets.length > 0) setClipboardLayers(targets);
              }}
              onPaste={() => {
                if (clipboardLayers.length > 0) {
                  const clones = clipboardLayers.map((target) => {
                    const clone = LayerModel.duplicate(target, target.parentId);
                    clone.x += 30;
                    clone.y += 30;
                    return clone;
                  });
                  setLayers((prev) => [...prev, ...clones]);
                  setSelectedLayerIds(clones.map((c) => c.id));
                  pushHistorySnapshot('Dán layers từ clipboard', [...layers, ...clones]);
                }
              }}
              onDuplicate={() => handleDuplicateLayer()}
              onDelete={() => handleDeleteLayer()}
              onToggleLock={(id) => handleToggleLock(id)}
              onToggleVisibility={handleToggleVisibility}
              onBringToFront={(id) => handleBringToFront(id)}
              onSendToBack={(id) => handleSendToBack(id)}
              onGroup={handleGroup}
              onUngroup={handleUngroup}
              onAIRewrite={handleAIRewrite}
            />
          )}

          {/* Bottom Right Floating Zoom Controls & MiniMap */}
          <div className="absolute bottom-4 right-4 flex items-center gap-3 z-50">
            <MiniMap
              layers={layers}
              selectedLayerIds={selectedLayerIds}
              viewport={viewport}
              containerWidth={1000}
              containerHeight={650}
            />
            <ZoomControls
              currentZoom={viewport.zoom}
              onZoomChange={(zoom) => setViewport(prev => ({ ...prev, zoom }))}
              onFitScreen={() => {
                const fit = calculateFitTransform(window.innerWidth - 400, window.innerHeight - 100, 1000, 650, 'screen');
                setViewport(fit);
              }}
              onFitWidth={() => {
                const fit = calculateFitTransform(window.innerWidth - 400, window.innerHeight - 100, 1000, 650, 'width');
                setViewport(fit);
              }}
              onFitHeight={() => {
                const fit = calculateFitTransform(window.innerWidth - 400, window.innerHeight - 100, 1000, 650, 'height');
                setViewport(fit);
              }}
              onResetPan={() => setViewport(prev => ({ ...prev, panX: 0, panY: 0 }))}
            />
          </div>
        </main>

        {/* Right Collapsible Workflow Panel (Desktop / Tablet) */}
        <AnimatePresence>
          {isRightWorkflowOpen && (
            <motion.aside
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="hidden sm:flex flex-col w-84 h-full bg-white border-l border-rose-100 shadow-2xl z-50 relative"
            >
              <EditorWorkflowPanel
                onApplyToCanvas={handleApplyWorkflowToCanvas}
                onClose={() => setIsRightWorkflowOpen(false)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile / Android Bottom Sheet Workflow Panel */}
        <AnimatePresence>
          {isRightWorkflowOpen && (
            <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-full max-h-[85vh] bg-white rounded-t-3xl shadow-2xl border-t border-rose-200 overflow-hidden flex flex-col"
              >
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0"></div>
                <div className="flex-1 overflow-y-auto">
                  <EditorWorkflowPanel
                    onApplyToCanvas={(text, decor) => {
                      handleApplyWorkflowToCanvas(text, decor);
                      setIsRightWorkflowOpen(false);
                    }}
                    onClose={() => setIsRightWorkflowOpen(false)}
                    isMobileBottomSheet={true}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Right Collapsible Project Inspector Sidebar (Desktop / Tablet) */}
        <AnimatePresence>
          {isRightInspectorOpen && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className={`${
                isRightInspectorPinned ? 'relative' : 'absolute right-0 top-0 bottom-0 z-50 shadow-2xl'
              } hidden sm:flex flex-col h-full bg-white border-l border-rose-100 shrink-0`}
            >
              <ProjectInspectorSidebar
                onClose={() => setIsRightInspectorOpen(false)}
                isPinned={isRightInspectorPinned}
                onTogglePin={() => setIsRightInspectorPinned(!isRightInspectorPinned)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Mobile / Android Bottom Sheet Project Inspector Sidebar */}
        <AnimatePresence>
          {isRightInspectorOpen && (
            <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/40 backdrop-blur-xs">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-full max-h-[80vh] bg-white rounded-t-3xl shadow-2xl border-t border-rose-200 overflow-hidden flex flex-col"
              >
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-2 shrink-0"></div>
                <div className="flex-1 overflow-y-auto">
                  <ProjectInspectorSidebar
                    onClose={() => setIsRightInspectorOpen(false)}
                    isPinned={false}
                    onTogglePin={() => {}}
                    isMobileBottomSheet={true}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Draft Recovery Modal */}
      <DraftRecoveryModal
        isOpen={isDraftModalOpen}
        savedTime={draftSavedTime || ''}
        onRestore={handleRestoreDraft}
        onDiscard={handleDiscardDraft}
      />

      {/* Shortcuts Help Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <ExportStudioModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectData={{ layers, canvasConfig }}
      />

      <PrintStudioModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        projectData={{ layers, canvasConfig }}
      />
    </div>
  );
};
