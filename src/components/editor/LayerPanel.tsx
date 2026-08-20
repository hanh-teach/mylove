import React, { useState, useRef, useEffect } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  Edit3, 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  Type, 
  Image, 
  Sparkles, 
  Square, 
  Folder,
  ChevronRight
} from 'lucide-react';
import { ILayer } from '../../modules/editor/LayerTypes';

interface LayerPanelProps {
  layers: ILayer[];
  selectedLayerIds: string[];
  onSelectLayer: (id: string, isMulti: boolean) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onRenameLayer: (id: string, newName: string) => void;
  onDuplicateLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onReorderLayers: (draggedId: string, targetId: string) => void;
  onAddTextLayer: () => void;
  onAddDecorLayer: () => void;
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  selectedLayerIds,
  onSelectLayer,
  onSelectAll,
  onClearSelection,
  onRenameLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onToggleLock,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onReorderLayers,
  onAddTextLayer,
  onAddDecorLayer,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const handleStartRename = (layer: ILayer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(layer.id);
    setEditingName(layer.name);
  };

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      onRenameLayer(id, editingName.trim());
    }
    setEditingId(null);
  };

  const toggleGroupCollapse = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type size={14} className="text-blue-500 shrink-0" />;
      case 'image':
        return <Image size={14} className="text-emerald-500 shrink-0" />;
      case 'decor':
        return <Sparkles size={14} className="text-rose-500 shrink-0" />;
      case 'shape':
        return <Square size={14} className="text-amber-500 shrink-0" />;
      case 'group':
        return <Folder size={14} className="text-indigo-500 shrink-0" />;
      default:
        return <Layers size={14} className="text-slate-400 shrink-0" />;
    }
  };

  // Sort layers by zIndex descending for display (top layer at top of list)
  const sortedLayers = [...layers].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <div className="w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 flex flex-col h-full select-none overflow-hidden text-xs">
      {/* Header */}
      <div className="p-3 border-b border-rose-100/80 flex items-center justify-between bg-rose-50/40">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Layers size={16} className="text-rose-600" />
          <span>Danh sách Layers ({layers.length})</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onAddTextLayer}
            className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors flex items-center gap-1"
            title="Thêm Chữ mới"
          >
            <Plus size={14} />
            <Type size={12} />
          </button>
          <button
            onClick={onAddDecorLayer}
            className="p-1.5 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors flex items-center gap-1"
            title="Thêm Decor"
          >
            <Plus size={14} />
            <Sparkles size={12} />
          </button>
        </div>
      </div>

      {/* Layer List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedLayers.length === 0 ? (
          <div className="text-center py-8 text-slate-400 italic">
            Chưa có layer nào trên Canvas.
          </div>
        ) : (
          sortedLayers.map((layer) => {
            const isSelected = selectedLayerIds.includes(layer.id);
            const isEditing = editingId === layer.id;
            const isGroup = layer.type === 'group';
            const isCollapsed = collapsedGroups[layer.id];

            return (
              <div
                key={layer.id}
                draggable
                onDragStart={() => setDraggedId(layer.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedId && draggedId !== layer.id) {
                    onReorderLayers(draggedId, layer.id);
                    setDraggedId(null);
                  }
                }}
                onClick={(e) => {
                  const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
                  onSelectLayer(layer.id, isMulti);
                }}
                className={`group px-2.5 py-2 rounded-xl flex items-center justify-between border transition-all ${
                  isSelected
                    ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold shadow-2xs'
                    : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                } ${layer.locked ? 'opacity-70' : ''}`}
              >
                {/* Left drag handle & name */}
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <GripVertical
                    size={14}
                    className="text-slate-300 group-hover:text-slate-500 cursor-grab shrink-0"
                  />

                  {isGroup && (
                    <button
                      onClick={(e) => toggleGroupCollapse(layer.id, e)}
                      className="p-0.5 hover:bg-slate-200 rounded text-slate-500"
                    >
                      {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}

                  {getLayerIcon(layer.type)}

                  {isEditing ? (
                    <input
                      ref={inputRef}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => handleSaveRename(layer.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(layer.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="bg-white border border-rose-400 rounded px-1 py-0.5 text-xs text-slate-900 w-full focus:outline-none"
                    />
                  ) : (
                    <span
                      onDoubleClick={(e) => handleStartRename(layer, e)}
                      className="truncate text-xs cursor-pointer select-none"
                      title="Bấm đúp để đổi tên"
                    >
                      {layer.name}
                    </span>
                  )}
                </div>

                {/* Right Quick Action Icons (Lock, Hide, Rename, Delete) */}
                <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                  {/* Visibility toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleVisibility(layer.id);
                    }}
                    className="p-1 hover:bg-rose-100/80 rounded-md transition-colors text-slate-500 hover:text-slate-800"
                    title={layer.visible !== false ? 'Ẩn layer' : 'Hiện layer'}
                  >
                    {layer.visible !== false ? <Eye size={13} /> : <EyeOff size={13} className="text-slate-300" />}
                  </button>

                  {/* Lock toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(layer.id);
                    }}
                    className="p-1 hover:bg-rose-100/80 rounded-md transition-colors text-slate-500 hover:text-slate-800"
                    title={layer.locked ? 'Mở khóa' : 'Khóa layer'}
                  >
                    {layer.locked ? <Lock size={13} className="text-amber-500" /> : <Unlock size={13} />}
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateLayer(layer.id);
                    }}
                    className="p-1 hover:bg-rose-100/80 rounded-md transition-colors text-slate-500 hover:text-slate-800"
                    title="Nhân bản"
                  >
                    <Copy size={13} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteLayer(layer.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-md transition-colors text-red-500"
                    title="Xóa layer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Select All / Clear Selection Bar */}
      <div className="p-2.5 border-t border-rose-100/80 bg-rose-50/30 flex items-center justify-between text-[11px]">
        <button
          onClick={onSelectAll}
          className="text-slate-600 hover:text-rose-700 font-medium transition-colors"
        >
          Chọn tất cả ({layers.length})
        </button>
        {selectedLayerIds.length > 0 && (
          <button
            onClick={onClearSelection}
            className="text-rose-600 hover:text-rose-800 font-semibold transition-colors"
          >
            Bỏ chọn ({selectedLayerIds.length})
          </button>
        )}
      </div>
    </div>
  );
};
