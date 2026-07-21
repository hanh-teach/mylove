import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Move, ArrowRightLeft, ArrowUpDown } from 'lucide-react';
import { ZOOM_LEVELS } from './ZoomEngine';

interface ZoomControlsProps {
  currentZoom: number;
  onZoomChange: (newZoom: number) => void;
  onFitWidth: () => void;
  onFitHeight: () => void;
  onFitScreen: () => void;
  onResetPan: () => void;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  currentZoom,
  onZoomChange,
  onFitWidth,
  onFitHeight,
  onFitScreen,
  onResetPan,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleZoomIn = () => {
    // Find next zoom level or increment by 25%
    const currentPercent = Math.round(currentZoom * 100);
    const nextLevel = ZOOM_LEVELS.find((z) => Math.round(z * 100) > currentPercent);
    if (nextLevel) {
      onZoomChange(nextLevel);
    } else {
      onZoomChange(Math.min(4.0, currentZoom + 0.25));
    }
  };

  const handleZoomOut = () => {
    const currentPercent = Math.round(currentZoom * 100);
    const reversedLevels = [...ZOOM_LEVELS].reverse();
    const prevLevel = reversedLevels.find((z) => Math.round(z * 100) < currentPercent);
    if (prevLevel) {
      onZoomChange(prevLevel);
    } else {
      onZoomChange(Math.max(0.1, currentZoom - 0.25));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-4 right-20 z-40 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-xl border border-rose-100 select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      {/* Zoom Out Button */}
      <button
        onClick={handleZoomOut}
        disabled={currentZoom <= 0.1}
        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        title="Thu nhỏ (-)"
      >
        <ZoomOut size={16} />
      </button>

      {/* Percentage / Custom Dropdown Toggle */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="px-2 py-1 rounded-xl hover:bg-rose-50 text-rose-900 font-mono font-semibold text-xs min-w-[56px] text-center flex items-center justify-center gap-1 transition-colors"
          title="Chọn tỉ lệ thu phóng"
        >
          {Math.round(currentZoom * 100)}%
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-xl border border-rose-50 p-2 flex flex-col gap-1 w-32 z-50 animate-in fade-in slide-in-from-bottom-1 duration-150">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => {
                  onZoomChange(level);
                  setDropdownOpen(false);
                }}
                className={`text-left px-2.5 py-1 text-xs rounded-lg font-mono transition-colors ${
                  Math.abs(currentZoom - level) < 0.01
                    ? 'bg-rose-100 text-rose-800 font-bold'
                    : 'hover:bg-rose-50 text-gray-700'
                }`}
              >
                {Math.round(level * 100)}%
              </button>
            ))}
            
            <div className="border-t border-rose-50 my-1" />
            
            {/* Fit Controls */}
            <button
              onClick={() => {
                onFitScreen();
                setDropdownOpen(false);
              }}
              className="text-left px-2.5 py-1 text-xs rounded-lg hover:bg-rose-50 text-gray-700 flex items-center gap-1.5"
            >
              <Maximize2 size={12} className="text-rose-500" />
              Tự vừa màn hình
            </button>
            <button
              onClick={() => {
                onFitWidth();
                setDropdownOpen(false);
              }}
              className="text-left px-2.5 py-1 text-xs rounded-lg hover:bg-rose-50 text-gray-700 flex items-center gap-1.5"
            >
              <ArrowRightLeft size={12} className="text-rose-500" />
              Tự vừa chiều ngang
            </button>
            <button
              onClick={() => {
                onFitHeight();
                setDropdownOpen(false);
              }}
              className="text-left px-2.5 py-1 text-xs rounded-lg hover:bg-rose-50 text-gray-700 flex items-center gap-1.5"
            >
              <ArrowUpDown size={12} className="text-rose-500" />
              Tự vừa chiều dọc
            </button>
          </div>
        )}
      </div>

      {/* Zoom In Button */}
      <button
        onClick={handleZoomIn}
        disabled={currentZoom >= 4.0}
        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        title="Phóng to (+)"
      >
        <ZoomIn size={16} />
      </button>

      <div className="h-4 border-l border-rose-100 mx-1" />

      {/* Fit Shortcut Icons for Quick Toggle */}
      <button
        onClick={onFitScreen}
        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
        title="Vừa màn hình (Fit Screen)"
      >
        <Maximize2 size={15} />
      </button>

      <button
        onClick={onResetPan}
        className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors"
        title="Đặt lại góc nhìn (Reset View)"
      >
        <Minimize2 size={15} />
      </button>
    </div>
  );
};
