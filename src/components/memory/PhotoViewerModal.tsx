import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PhotoViewerModalProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const PhotoViewerModal: React.FC<PhotoViewerModalProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setZoomLevel(1);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setZoomLevel(1);
  }, [images.length]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `love-note-photo-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between text-white z-10">
            <div>
              <h3 className="text-sm sm:text-base font-bold truncate max-w-xs sm:max-w-md">
                {title || 'Ảnh kỷ niệm Fullscreen'}
              </h3>
              <p className="text-xs text-white/60">
                Ảnh {currentIndex + 1} / {images.length}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Thu nhỏ"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-xs font-mono w-12 text-center text-white/80">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Phóng to"
              >
                <ZoomIn size={18} />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Đặt lại zoom"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={handleDownload}
                className="p-2.5 rounded-full bg-white/10 hover:bg-emerald-500/80 text-white transition-colors ml-2"
                title="Tải ảnh về"
              >
                <Download size={18} />
              </button>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white transition-colors ml-2"
                title="Đóng (ESC)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main Image Stage */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all shadow-lg"
                title="Ảnh trước (Mũi tên Trái)"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <motion.div
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: zoomLevel, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full flex items-center justify-center"
            >
              <img
                src={currentImage}
                alt={`Photo ${currentIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl transition-transform duration-150"
              />
            </motion.div>

            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all shadow-lg"
                title="Ảnh tiếp theo (Mũi tên Phải)"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Navigation */}
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 max-w-xl mx-auto scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setZoomLevel(1);
                  }}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    currentIndex === idx
                      ? 'border-rose-500 scale-105 shadow-md'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
