import React, { useState, useRef, useEffect } from 'react';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { assetManager } from '../../modules/asset/AssetManager';
import {
  MoreVertical,
  Eye,
  Edit2,
  Star,
  Download,
  Copy,
  Trash2,
  RotateCcw,
  Check
} from 'lucide-react';

interface AssetMenuProps {
  asset: ProjectAsset;
  onPreview: () => void;
  onRename: () => void;
}

export const AssetMenu: React.FC<AssetMenuProps> = ({
  asset,
  onPreview,
  onRename,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const isTrash = asset.status === 'trash';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(asset.url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        title="Tùy chọn"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-2xl bg-white border border-slate-200 shadow-xl text-xs py-1 z-30 divide-y divide-slate-100">
          {!isTrash ? (
            <>
              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onPreview();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Eye size={14} className="text-slate-400" />
                  <span>Xem trước</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    onRename();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Edit2 size={14} className="text-slate-400" />
                  <span>Đổi tên</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    assetManager.toggleFavorite(asset.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Star
                    size={14}
                    className={asset.favorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}
                  />
                  <span>{asset.favorite ? 'Bỏ yêu thích' : 'Yêu thích'}</span>
                </button>
              </div>

              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyLink();
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-500" />
                      <span className="text-emerald-600 font-bold">Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="text-slate-400" />
                      <span>Sao chép URL</span>
                    </>
                  )}
                </button>
                <a
                  href={asset.url}
                  download={asset.title}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <Download size={14} className="text-slate-400" />
                  <span>Tải file xuống</span>
                </a>
              </div>

              <div className="py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    assetManager.moveToTrash(asset.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <Trash2 size={14} />
                  <span>Chuyển Thùng rác</span>
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  assetManager.restoreAsset(asset.id);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-medium"
              >
                <RotateCcw size={14} />
                <span>Khôi phục tài nguyên</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Bạn có chắc muốn xóa vĩnh viễn "${asset.title}"?`)) {
                    assetManager.deletePermanently(asset.id);
                  }
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
              >
                <Trash2 size={14} />
                <span>Xóa vĩnh viễn</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
