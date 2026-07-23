import React, { useState, useEffect, useMemo } from 'react';
import { X, Printer, Settings, CheckCircle2, AlertCircle, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { PrintSettings, PaperSize, Orientation, MarginSize, ValidationResult } from '../../../modules/print/PrintTypes';
import { PrintProfileRegistry } from '../../../modules/print/PrintProfileRegistry';
import { LayoutValidator } from '../../../modules/print/LayoutValidator';
import { PrintService } from '../../../modules/print/PrintService';

interface PrintStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: {
    layers: any[];
    canvasConfig: any;
  };
}

export const PrintStudioModal: React.FC<PrintStudioModalProps> = ({ isOpen, onClose, projectData }) => {
  const [activeProfileId, setActiveProfileId] = useState<string>('default');
  
  // Settings
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [marginType, setMarginType] = useState<MarginSize>('normal');
  const [header, setHeader] = useState(false);
  const [footer, setFooter] = useState(false);
  const [pageNumbers, setPageNumbers] = useState(true);
  const [watermark, setWatermark] = useState('');
  const [showBleed, setShowBleed] = useState(false);
  const [duplex, setDuplex] = useState(false);
  const [scale, setScale] = useState(1);
  const [previewZoom, setPreviewZoom] = useState(0.5);

  const [validation, setValidation] = useState<ValidationResult | null>(null);

  // Load profile when changed
  useEffect(() => {
    const profile = PrintProfileRegistry.get(activeProfileId);
    if (profile) {
      setPaperSize(profile.paper.size);
      setOrientation(profile.paper.orientation);
      setMarginType(profile.margins.type);
      setShowBleed(profile.showBleed);
      setDuplex(profile.duplex);
    }
  }, [activeProfileId]);

  const currentSettings: PrintSettings = useMemo(() => ({
    paper: { size: paperSize, orientation },
    margins: { type: marginType, top: 25, bottom: 25, left: 25, right: 25 },
    header,
    footer,
    pageNumbers,
    watermark,
    showBleed,
    duplex,
    scale
  }), [paperSize, orientation, marginType, header, footer, pageNumbers, watermark, showBleed, duplex, scale]);

  // Run validation when settings or data changes
  useEffect(() => {
    if (isOpen) {
      const result = LayoutValidator.validate(projectData.layers, currentSettings);
      setValidation(result);
    }
  }, [isOpen, projectData.layers, currentSettings]);

  if (!isOpen) return null;

  const handlePrint = async () => {
    await PrintService.print(currentSettings);
  };

  const profiles = PrintProfileRegistry.getAll();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-white w-full max-w-6xl h-full max-h-[850px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Preview Panel */}
        <div className="flex-1 bg-slate-100 p-6 flex flex-col border-b md:border-b-0 md:border-r border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-slate-600">Print Preview</h4>
            <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm items-center gap-1">
              <button 
                onClick={() => setPreviewZoom(Math.max(0.25, previewZoom - 0.25))}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs font-mono w-12 text-center">{Math.round(previewZoom * 100)}%</span>
              <button 
                onClick={() => setPreviewZoom(Math.min(2, previewZoom + 0.25))}
                className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto flex items-center justify-center p-8">
            <div 
              className={`bg-white shadow-xl transition-all duration-300 relative
                ${orientation === 'portrait' ? 'w-[210mm] h-[297mm]' : 'w-[297mm] h-[210mm]'}
              `}
              style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'center center'
              }}
            >
              {/* Paper Content Mockup */}
              <div className="absolute inset-0 p-[25.4mm]">
                {/* Safe Area & Margins Visualization */}
                <div className="w-full h-full border border-dashed border-rose-300/50 relative">
                  <span className="absolute -top-6 left-0 text-[10px] text-rose-400 font-mono">Printable Area</span>
                  
                  {/* Mock content */}
                  <div className="h-full bg-slate-50/50 flex flex-col p-8 items-center justify-center border border-slate-100">
                     <h1 className="text-4xl font-playfair text-slate-800 mb-6 text-center">Print Document</h1>
                     <div className="w-full max-w-sm space-y-4">
                       <div className="h-4 bg-slate-200 rounded w-full"></div>
                       <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                       <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Overlays */}
              {showBleed && (
                <div className="absolute -inset-[3mm] border border-red-500/50 border-dashed pointer-events-none">
                  <span className="absolute -top-5 -left-5 text-[10px] text-red-500 bg-white px-1">Bleed 3mm</span>
                </div>
              )}

              {header && (
                <div className="absolute top-2 left-0 right-0 text-center text-xs text-slate-400 font-mono">
                  Document Header • {new Date().toLocaleDateString()}
                </div>
              )}

              {footer && (
                <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-slate-400 font-mono">
                  Confidential Document
                </div>
              )}

              {pageNumbers && (
                <div className="absolute bottom-8 right-8 text-sm font-bold text-slate-500">
                  1 / 1
                </div>
              )}

              {watermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className="text-[120px] font-black text-slate-900 opacity-5 rotate-45 whitespace-nowrap">
                    {watermark.toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Settings Panel */}
        <div className="w-full md:w-[400px] bg-white flex flex-col h-full overflow-hidden shrink-0">
          
          <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Printer size={20} className="text-slate-500" />
              Print Studio
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Print Profiles */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Print Profile</label>
              <select 
                value={activeProfileId}
                onChange={(e) => setActiveProfileId(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                {profiles.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Layout Validation Checklist */}
            {validation && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Pre-print Validation</h4>
                <div className="space-y-2">
                  {validation.issues.map(issue => (
                    <div key={issue.id} className="flex items-start gap-2">
                      {issue.status === 'ok' ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      ) : issue.status === 'warning' ? (
                        <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <X size={16} className="text-red-500 shrink-0 mt-0.5 bg-red-100 rounded-full" />
                      )}
                      <span className={`text-sm ${issue.status === 'ok' ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
                        {issue.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paper Settings */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Paper & Layout</h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select 
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value as PaperSize)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="a4">A4 (210 x 297mm)</option>
                    <option value="a5">A5 (148 x 210mm)</option>
                    <option value="letter">Letter (8.5 x 11")</option>
                    <option value="legal">Legal (8.5 x 14")</option>
                  </select>
                  <select 
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as Orientation)}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-slate-600 block mb-1">Margins</label>
                  <select 
                    value={marginType}
                    onChange={(e) => setMarginType(e.target.value as MarginSize)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
                  >
                    <option value="normal">Normal (25.4mm)</option>
                    <option value="narrow">Narrow (12.7mm)</option>
                    <option value="wide">Wide (50.8mm)</option>
                    <option value="none">None (Borderless)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Options */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Options</h4>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                  <span className="text-sm text-slate-700">Header</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={footer} onChange={(e) => setFooter(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                  <span className="text-sm text-slate-700">Footer</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={pageNumbers} onChange={(e) => setPageNumbers(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                  <span className="text-sm text-slate-700">Page Numbers</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showBleed} onChange={(e) => setShowBleed(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                  <span className="text-sm text-slate-700">Show Bleed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={duplex} onChange={(e) => setDuplex(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500" />
                  <span className="text-sm text-slate-700">Two-Sided</span>
                </label>
              </div>
            </div>

            {/* Watermark */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Watermark</label>
              <input 
                type="text" 
                value={watermark}
                onChange={(e) => setWatermark(e.target.value)}
                placeholder="e.g. DRAFT"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
            </div>

          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0">
            <button 
              onClick={handlePrint}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]"
            >
              <Printer size={20} />
              PRINT DOCUMENT
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
