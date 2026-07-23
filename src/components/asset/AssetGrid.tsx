import React from 'react';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { AssetCard } from './AssetCard';
import { FolderOpen, Plus, Sparkles } from 'lucide-react';

interface AssetGridProps {
  assets: ProjectAsset[];
  onPreview: (asset: ProjectAsset) => void;
  onRename: (asset: ProjectAsset) => void;
  onSelect?: (asset: ProjectAsset) => void;
  selectedAssetId?: string;
  onOpenUpload?: () => void;
}

export const AssetGrid: React.FC<AssetGridProps> = ({
  assets,
  onPreview,
  onRename,
  onSelect,
  selectedAssetId,
  onOpenUpload,
}) => {
  if (assets.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 my-12">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-400 mb-3 border border-rose-100">
          <FolderOpen size={32} />
        </div>
        <h3 className="font-bold text-slate-700 text-sm mb-1">Chưa có tài nguyên nào</h3>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          Tải ảnh, video, âm thanh hoặc tạo AI Assets cho dự án hiện tại của bạn.
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
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
        />
      ))}
    </div>
  );
};
