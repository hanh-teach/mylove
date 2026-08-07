import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { assetManager } from '../../modules/asset/AssetManager';
import {
  X,
  Star,
  Download,
  Copy,
  Edit2,
  Trash2,
  Sparkles,
  Calendar,
  HardDrive,
  Maximize2,
  Check,
  Tag,
  Info,
  Link,
  FolderOpen
} from 'lucide-react';

interface PreviewDialogProps {
  asset: ProjectAsset | null;
  onClose: () => void;
  onRename?: (asset: ProjectAsset) => void;
}

export const PreviewDialog: React.FC<PreviewDialogProps> = ({
  asset,
  onClose,
  onRename,
}) => {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left/Top Media Viewer Area */}
        <div className="flex-1 bg-black/60 flex items-center justify-center p-4 min-h-[300px] lg:min-h-[480px] relative overflow-hidden">
          {asset.type === 'image' || asset.type === 'ai' ? (
            <img
              src={asset.url}
              alt={asset.title}
              className="max-w-full max-h-[60vh] lg:max-h-[75vh] object-contain rounded-xl shadow-2xl"
            />
          ) : asset.type === 'video' ? (
            <video
              src={asset.url}
              controls
              autoPlay
              className="max-w-full max-h-[60vh] lg:max-h-[75vh] rounded-xl shadow-2xl"
            />
          ) : asset.type === 'audio' ? (
            <div className="w-full max-w-md p-6 bg-slate-800/90 rounded-3xl border border-slate-700 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                🎵
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{asset.title}</h4>
                <p className="text-xs text-slate-400">{formatFileSize(asset.size)}</p>
              </div>
              <audio src={asset.url} controls className="w-full mt-2" />
            </div>
          ) : (
            <div className="p-8 bg-slate-800/90 rounded-3xl border border-slate-700 text-center space-y-3 max-w-md">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-2xl">
                📄
              </div>
              <h4 className="font-bold text-sm text-slate-100">{asset.title}</h4>
              <p className="text-xs text-slate-400">Định dạng file đính kèm văn bản / tài liệu</p>
              <a
                href={asset.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                <Download size={14} />
                <span>Mở / Tải file</span>
              </a>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Right Sidebar: Details & Metadata */}
        <div className="w-full lg:w-80 bg-slate-900 p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800 overflow-y-auto">
          <div className="space-y-4">
            {/* Title & Favorite */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  {asset.type} • V{asset.version}
                </span>
                <h3 className="font-bold text-slate-100 text-sm leading-snug break-words">
                  {asset.title}
                </h3>
              </div>
              <button
                onClick={() => assetManager.toggleFavorite(asset.id)}
                className={`p-2 rounded-xl transition-colors shrink-0 ${
                  asset.favorite
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Đánh dấu yêu thích"
              >
                <Star size={16} className={asset.favorite ? 'fill-white' : ''} />
              </button>
            </div>

            {asset.description && (
              <p className="text-xs text-slate-400 bg-slate-800/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
                {asset.description}
              </p>
            )}

            {/* Metadata Specs Grid */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Thông số kĩ thuật
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Kích thước</span>
                  <span className="font-bold text-slate-200">{formatFileSize(asset.size)}</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Nguồn cấp</span>
                  <span className="font-bold text-slate-200 capitalize">{asset.provider}</span>
                </div>
                {asset.width && asset.height && (
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Độ phân giải</span>
                    <span className="font-bold text-slate-200">{asset.width} × {asset.height}</span>
                  </div>
                )}
                {asset.duration && (
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Thời lượng</span>
                    <span className="font-bold text-slate-200">{asset.duration}s</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Calendar size={13} className="text-slate-500 shrink-0" />
                <span>Tạo lúc: {formatDate(asset.createdAt)}</span>
              </div>
            </div>

            {/* AI Banner if AI generated */}
            {asset.aiGenerated && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl text-emerald-300 text-xs flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold">AI Generated Asset</p>
                  <p className="text-[10px] text-emerald-400/80">
                    Tài nguyên được sinh tự động bởi Gemini & AI Studio.
                  </p>
                </div>
              </div>
            )}

            {/* Tags, Collections, Usage */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              {/* Tags */}
              {asset.tags && asset.tags.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Tag size={12} />
                    <span>Thẻ Tag</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Collections */}
              {asset.collections && asset.collections.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <FolderOpen size={12} />
                    <span>Collections</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.collections.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Used */}
              {asset.projectsUsed && asset.projectsUsed.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Link size={12} />
                    <span>Đang dùng tại</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {asset.projectsUsed.map((p) => (
                      <span
                        key={p}
                        className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <button
              onClick={handleCopy}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép URL!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Sao chép Đường dẫn</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              {onRename && (
                <button
                  onClick={() => onRename(asset)}
                  className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 size={13} />
                  <span>Đổi tên</span>
                </button>
              )}
              <a
                href={asset.url}
                download={asset.title}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={13} />
                <span>Tải xuống</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
