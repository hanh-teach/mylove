import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectAsset } from '../../modules/asset/AssetModel';
import { MediaLibraryPanel } from './MediaLibraryPanel';
import { X, Check } from 'lucide-react';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: ProjectAsset) => void;
  title?: string;
  allowedTypes?: string[];
}

export const AssetPickerModal: React.FC<AssetPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
  title = 'Chọn tài nguyên từ Media Library',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-3 sm:p-6">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <h3 className="font-bold text-sm tracking-wide">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Media Library Container */}
        <div className="flex-1 flex overflow-hidden">
          <MediaLibraryPanel
            onSelectAssetForInsert={(asset) => {
              onSelectAsset(asset);
              onClose();
            }}
            isModalPicker={true}
          />
        </div>
      </motion.div>
    </div>
  );
};
