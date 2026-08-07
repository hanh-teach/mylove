import React from 'react';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { AssetCard } from './AssetCard';
import { FolderOpen, Plus, Trash2, RotateCcw } from 'lucide-react';

interface AssetGridProps {
  assets: ProjectAsset[];
  onPreview: (asset: ProjectAsset) => void;
  onRename: (asset: ProjectAsset) => void;
  onSelect?: (asset: ProjectAsset) => void;
  selectedAssetId?: string;
  onOpenUpload?: () => void;
  isTrashView?: boolean;
  onGoToAllCategory?: () => void;
  onRestoreAsset?: (asset: ProjectAsset) => void;
  onDeletePermanentlyRequest?: (asset: ProjectAsset) => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  onPreview,
  onRename,
  onSelect,
  selectedAssetId,
  onOpenUpload,
  isTrashView = false,
  onGoToAllCategory,
  onRestoreAsset,
  onDeletePermanentlyRequest,
}) => {
  if (assets.length === 0) {
    if (isTrashView) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 my-12">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200 shadow-2xs">
            <Trash2 size={32} />
          </div>
          <h3 className="font-bold text-slate-700 text-sm mb-1">Thùng rác rỗng</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Chưa có tài nguyên nào trong Thùng rác. Các tệp bạn xóa sẽ xuất hiện tại đây và có thể khôi phục bất cứ lúc nào.
          </p>
          {onGoToAllCategory && (
            <button
              onClick={onGoToAllCategory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors border border-slate-200 shadow-xs active:scale-95"
            >
              <FolderOpen size={15} />
              <span>Xem tất cả tài nguyên</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 my-12">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-400 mb-3 border border-rose-100 shadow-2xs">
          <FolderOpen size={32} />
        </div>
        <h3 className="font-bold text-slate-700 text-sm mb-1">Chưa có tài nguyên nào</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          Tải ảnh, video, âm thanh hoặc tạo AI Assets cho dự án hiện tại của bạn.
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs transition-all shadow-sm active:scale-95"
          >
            <Plus size={15} />
            <span>Tải lên tài nguyên đầu tiên</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 p-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onPreview={onPreview}
          onRename={onRename}
          onSelect={onSelect}
          isSelected={selectedAssetId === asset.id}
          onRestore={onRestoreAsset}
          onDeletePermanentlyRequest={onDeletePermanentlyRequest}
        />
      ))}
    </div>
  );
};
