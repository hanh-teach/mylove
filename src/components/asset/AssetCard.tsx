import React from 'react';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { assetManager } from '../../modules/asset/AssetManager';
import {
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Sparkles,
  Star,
  MoreVertical,
  Play,
  Download,
  Trash2,
  RotateCcw,
  Eye,
  Edit2
} from 'lucide-react';
import { AssetMenu } from './AssetMenu';

interface AssetCardProps {
  asset: ProjectAsset;
  onPreview: (asset: ProjectAsset) => void;
  onRename: (asset: ProjectAsset) => void;
  onSelect?: (asset: ProjectAsset) => void;
  isSelected?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onPreview,
  onRename,
  onSelect,
  isSelected = false,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderIconForType = () => {
    switch (asset.type) {
      case 'image':
        return <ImageIcon size={20} className="text-rose-500" />;
      case 'video':
        return <Video size={20} className="text-purple-500" />;
      case 'audio':
        return <Music size={20} className="text-amber-500" />;
      case 'document':
        return <FileText size={20} className="text-blue-500" />;
      case 'ai':
        return <Sparkles size={20} className="text-emerald-500" />;
      default:
        return <ImageIcon size={20} className="text-slate-500" />;
    }
  };

  const isTrash = asset.status === 'trash';

  return (
    <div
      onClick={() => onSelect ? onSelect(asset) : onPreview(asset)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/json', JSON.stringify({ type: 'insert-asset', asset }));
      }}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer flex flex-col hover:shadow-lg ${
        isSelected
          ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Media Preview Thumbnail Area */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {asset.type === 'image' || asset.type === 'ai' ? (
          <img
            src={asset.url}
            alt={asset.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : asset.type === 'video' ? (
          <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
            <video src={asset.url} className="w-full h-full object-cover opacity-80" muted />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Play size={18} className="fill-white ml-0.5" />
              </div>
            </div>
            {asset.duration && (
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-white font-mono text-[10px]">
                {formatDuration(asset.duration)}
              </span>
            )}
          </div>
        ) : asset.type === 'audio' ? (
          <div className="w-full h-full bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4 text-amber-700">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <Music size={24} className="text-amber-600" />
            </div>
            {asset.duration && (
              <span className="text-[11px] font-mono font-semibold text-amber-800">
                {formatDuration(asset.duration)}
              </span>
            )}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex flex-col items-center justify-center p-4 text-blue-700">
            <FileText size={32} className="text-blue-500 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600/80">
              {asset.mimeType?.split('/')[1] || 'DOC'}
            </span>
          </div>
        )}

        {/* Favorite Button Overlay */}
        {!isTrash && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              assetManager.toggleFavorite(asset.id);
            }}
            className={`absolute top-2 left-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
              asset.favorite
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-black/20 hover:bg-black/40 text-white opacity-0 group-hover:opacity-100'
            }`}
            title={asset.favorite ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
          >
            <Star size={14} className={asset.favorite ? 'fill-white' : ''} />
          </button>
        )}

        {/* AI Badge Overlay */}
        {asset.aiGenerated && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
            <Sparkles size={10} />
            AI
          </span>
        )}
      </div>

      {/* Card Info Footer */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <h4
              className="text-xs font-bold text-slate-800 truncate leading-snug flex-1"
              title={asset.title}
            >
              {asset.title}
            </h4>
            <div onClick={(e) => e.stopPropagation()}>
              <AssetMenu
                asset={asset}
                onPreview={() => onPreview(asset)}
                onRename={() => onRename(asset)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            <span className="capitalize flex items-center gap-1">
              {renderIconForType()}
              <span className="truncate max-w-[70px]">{asset.type}</span>
            </span>
            <span>•</span>
            <span>{formatFileSize(asset.size)}</span>
          </div>
        </div>

        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <div className="flex items-center gap-1 mt-2.5 flex-wrap">
            {asset.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
            {asset.tags.length > 2 && (
              <span className="text-[9px] text-slate-400">+{asset.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
