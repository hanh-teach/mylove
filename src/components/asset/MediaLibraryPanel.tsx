import React, { useState, useEffect } from 'react';
import { ProjectAsset, AssetCategory } from '../../modules/asset/AssetModel';
import { assetManager } from '../../modules/asset/AssetManager';
import { useAssets, useAssetZustandStore } from '../../modules/asset/AssetZustandStore';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';

import { AssetFilter, AssetFilterCategory } from './AssetFilter';
import { AssetToolbar } from './AssetToolbar';
import { AssetGrid } from './AssetGrid';
import { UploadDialog } from './UploadDialog';
import { PreviewDialog } from './PreviewDialog';

import { Plus, FolderOpen, Sparkles, X, Check, Filter, AlertTriangle, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaLibraryPanelProps {
  onSelectAssetForInsert?: (asset: ProjectAsset) => void;
  isModalPicker?: boolean;
}

export const MediaLibraryPanel: React.FC<MediaLibraryPanelProps> = ({
  onSelectAssetForInsert,
  isModalPicker = false,
}) => {
  const { activeProject } = useProjectWorkspace();
  const [activeCategory, setActiveCategory] = useState<AssetFilterCategory>(() => {
    const saved = sessionStorage.getItem('assets_active_category');
    return (saved as AssetFilterCategory) || 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>(() => {
    const saved = sessionStorage.getItem('assets_sort_by');
    return (saved as 'date' | 'name' | 'size') || 'date';
  });
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Confirmation modals & Toasts
  const [confirmClearTrashOpen, setConfirmClearTrashOpen] = useState(false);
  const [confirmDeleteAsset, setConfirmDeleteAsset] = useState<ProjectAsset | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  useEffect(() => {
    sessionStorage.setItem('assets_active_category', activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    sessionStorage.setItem('assets_sort_by', sortBy);
  }, [sortBy]);

  // Scroll Persistence
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('assets_scroll_pos');
    const container = document.getElementById('asset-grid-container');
    if (savedScroll && container) {
      setTimeout(() => {
        container.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
      }, 100);
    }

    const handleScroll = (e: any) => {
      if (e.target.id === 'asset-grid-container') {
        sessionStorage.setItem('assets_scroll_pos', e.target.scrollTop.toString());
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewAsset, setPreviewAsset] = useState<ProjectAsset | null>(null);
  
  // Rename Modal State
  const [renamingAsset, setRenamingAsset] = useState<ProjectAsset | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const allAssets = useAssets();

  const assets = React.useMemo(() => {
    if (!activeProject) return [];
    return assetManager.queryAssets({
      projectId: activeProject.id,
      category: activeCategory,
      searchQuery,
      sortBy,
      sortDirection,
    });
  }, [allAssets, activeProject?.id, activeCategory, searchQuery, sortBy, sortDirection]);

  // Calculate category counts
  const categoryCounts = React.useMemo(() => {
    if (!activeProject) return {};
    const allProjectAssets = allAssets.filter(a => a.projectId === activeProject.id);
    const activeAssets = allProjectAssets.filter(a => a.status === 'active');
    const trashAssets = allProjectAssets.filter(a => a.status === 'trash');

    const counts: Record<string, number> = {
      all: activeAssets.length,
      image: activeAssets.filter(a => a.type === 'image').length,
      video: activeAssets.filter(a => a.type === 'video').length,
      audio: activeAssets.filter(a => a.type === 'audio').length,
      document: activeAssets.filter(a => a.type === 'document').length,
      icon: activeAssets.filter(a => a.type === 'icon' || a.type === 'sticker').length,
      background: activeAssets.filter(a => a.type === 'background').length,
      template: activeAssets.filter(a => a.type === 'template').length,
      ai: activeAssets.filter(a => a.aiGenerated || a.type === 'ai').length,
      favorite: activeAssets.filter(a => a.favorite).length,
      recent: activeAssets.filter(a => a.createdAt >= Date.now() - 86400000 * 3).length,
      trash: trashAssets.length,
    };
    return counts;
  }, [activeProject?.id, allAssets]);

  const handleStartRename = (asset: ProjectAsset) => {
    setRenamingAsset(asset);
    setRenameInput(asset.title);
  };

  const handleSaveRename = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (renamingAsset && renameInput.trim()) {
      assetManager.renameAsset(renamingAsset.id, renameInput.trim());
      setRenamingAsset(null);
      showToast(`Đã đổi tên thành "${renameInput.trim()}"`);
    }
  };

  const handleRestoreAsset = (asset: ProjectAsset) => {
    assetManager.restoreAsset(asset.id);
    showToast(`Đã khôi phục "${asset.title}" thành công!`);
  };

  const handleRestoreAll = () => {
    if (!activeProject) return;
    assetManager.restoreAllFromTrash(activeProject.id);
    showToast('Đã khôi phục tất cả tài nguyên từ Thùng rác!');
  };

  const handleConfirmClearTrash = () => {
    if (!activeProject) return;
    useAssetZustandStore.getState().clearTrash(activeProject.id);
    setConfirmClearTrashOpen(false);
    showToast('Đã dọn sạch thùng rác thành công!');
  };

  const handleConfirmDeletePermanently = () => {
    if (confirmDeleteAsset) {
      const title = confirmDeleteAsset.title;
      assetManager.deletePermanently(confirmDeleteAsset.id);
      setConfirmDeleteAsset(null);
      showToast(`Đã xóa vĩnh viễn "${title}"!`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 w-full overflow-hidden relative">
      {/* Top Header / Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-bold shadow-md shadow-rose-500/20">
            📸
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-900 tracking-tight flex items-center gap-2">
              <span>Media Library & Asset Manager</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                Sprint 59
              </span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Kho lưu trữ hình ảnh, video, âm thanh và AI Assets cho dự án <b>{activeProject?.title}</b>
            </p>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5"
        >
          <Filter size={15} />
          <span>Lọc</span>
        </button>
      </div>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Filter Panel (Desktop) */}
        <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 p-4 space-y-4 shrink-0 overflow-y-auto">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Phân loại Assets
            </p>
            <AssetFilter
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              counts={categoryCounts}
            />
          </div>

          <div className="p-3 bg-rose-50/70 border border-rose-100 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-rose-700 font-bold">
              <Sparkles size={14} />
              <span>Tự động đồng bộ AI</span>
            </div>
            <p className="text-[11px] text-rose-800/80 leading-relaxed">
              Tất cả hình ảnh & media do AI Studio sinh ra sẽ tự động lưu vào kho Asset của dự án này.
            </p>
          </div>
        </aside>

        {/* Mobile Filter Sheet */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-40 lg:hidden flex">
              <div
                onClick={() => setMobileFilterOpen(false)}
                className="absolute inset-0 bg-black/50 backdrop-blur-xs"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="relative w-72 bg-white h-full shadow-2xl p-4 flex flex-col z-10"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">Bộ lọc Assets</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <AssetFilter
                  activeCategory={activeCategory}
                  onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  counts={categoryCounts}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Center Grid Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Asset Toolbar */}
          <AssetToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortDirection={sortDirection}
            onToggleSortDirection={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            onOpenUpload={() => setUploadOpen(true)}
            isTrashView={activeCategory === 'trash'}
            onClearTrash={() => setConfirmClearTrashOpen(true)}
            onRestoreAll={handleRestoreAll}
            totalAssetsCount={assets.length}
          />

          {/* Grid View */}
          <div id="asset-grid-container" className="flex-1 overflow-y-auto">
            <AssetGrid
              assets={assets}
              onPreview={setPreviewAsset}
              onRename={handleStartRename}
              onSelect={onSelectAssetForInsert}
              onOpenUpload={() => setUploadOpen(true)}
              isTrashView={activeCategory === 'trash'}
              onGoToAllCategory={() => setActiveCategory('all')}
              onRestoreAsset={handleRestoreAsset}
              onDeletePermanentlyRequest={(asset) => setConfirmDeleteAsset(asset)}
            />
          </div>
        </div>
      </div>

      {/* Floating Mobile FAB Upload Button */}
      {activeCategory !== 'trash' && (
        <button
          onClick={() => setUploadOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-xl shadow-rose-500/30 active:scale-95 transition-transform"
          title="Upload Asset"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 0.98, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-slate-700 backdrop-blur-md"
          >
            <Check size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      <UploadDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => {}}
      />

      <PreviewDialog
        asset={previewAsset}
        onClose={() => setPreviewAsset(null)}
        onRename={handleStartRename}
      />

      {/* Confirm Clear Trash Modal */}
      <AnimatePresence>
        {confirmClearTrashOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 text-xs"
            >
              <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Dọn sạch Thùng rác?</h3>
                  <p className="text-[11px] text-slate-500 font-normal">Cảnh báo hành động xóa vĩnh viễn dữ liệu</p>
                </div>
              </div>

              <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-3.5 text-slate-700 leading-relaxed text-xs">
                Bạn có chắc chắn muốn dọn sạch tất cả tài nguyên trong Thùng rác không? Khi đã dọn sạch, tất cả tệp sẽ bị <span className="font-extrabold text-rose-700">MẤT VĨNH VIỄN</span> và <span className="font-extrabold text-rose-700">KHÔNG THỂ KHÔI PHỤC</span>!
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmClearTrashOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors active:scale-95"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmClearTrash}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Xóa vĩnh viễn tất cả</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirm Delete Single Asset Modal */}
      <AnimatePresence>
        {confirmDeleteAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 text-xs"
            >
              <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0">
                  <Trash2 size={20} className="text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Xóa vĩnh viễn tài nguyên?</h3>
                  <p className="text-[11px] text-slate-500 font-normal">Hành động này không thể hoàn tác</p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Bạn có chắc chắn muốn xóa vĩnh viễn tài nguyên <span className="font-bold text-slate-900">"{confirmDeleteAsset.title}"</span> không?
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteAsset(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors active:scale-95"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeletePermanently}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-colors"
                >
                  <Trash2 size={14} />
                  <span>Xóa vĩnh viễn</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {renamingAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 w-full max-w-md space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-800 text-sm">Đổi tên Asset</h3>
                <button onClick={() => setRenamingAsset(null)}>
                  <X size={16} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSaveRename} className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên mới</label>
                  <input
                    type="text"
                    value={renameInput}
                    onChange={(e) => setRenameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-500 outline-none font-bold text-xs"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setRenamingAsset(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                  >
                    Lưu tên mới
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
