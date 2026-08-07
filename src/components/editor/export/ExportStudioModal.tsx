import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Settings, History, List, Monitor, Smartphone, Tablet, Heart, Trash2, Share2, Loader2, Lock } from 'lucide-react';
import { ExportFormat, ExportOptions, ExportQuality, PageSize, PageOrientation } from '../../../modules/export/ExportTypes';
import { ExportRegistry } from '../../../modules/export/ExportRegistry';
import { ExportService } from '../../../modules/export/ExportService';
import { ExportHistoryRecord, ExportTask } from '../../../modules/export/ExportTypes';
import { fontRegistry, decorRegistry, sceneConfig } from '../../../shared/constants';
import { getFrameStyle, FrameShapeType } from '../../../shared/constants/frameShapes';
import { shareFile } from '../../../modules/export/downloadUtils';
import { useCurrentUser } from '../../../modules/workspace/WorkspaceZustandStore';
import { hasVideoExportPermission } from '../../../shared/utils/authPermissions';
import { SUPPORT_CONTACT_EMAILS } from '../../../config/contact';

interface ExportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
  initialTab?: 'export' | 'queue' | 'history';
  mainCardRef?: React.RefObject<HTMLDivElement>;
}

export const ExportStudioModal: React.FC<ExportStudioModalProps> = ({ isOpen, onClose, projectData, initialTab = 'export', mainCardRef }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'queue' | 'history'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);
  
  // Settings state
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState<ExportQuality>('standard');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [filename, setFilename] = useState('NoteMeProject');
  
  const [includeImages, setIncludeImages] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeVersionInfo, setIncludeVersionInfo] = useState(false);
  const [includeWatermark, setIncludeWatermark] = useState(false);
  const [includeComments, setIncludeComments] = useState(false);
  
  const [watermarkText, setWatermarkText] = useState('Draft');
  
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'phone' | 'a4'>('a4');

  const [queue, setQueue] = useState<ExportTask[]>([]);
  const [history, setHistory] = useState<ExportHistoryRecord[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const previewArtboardRef = React.useRef<HTMLDivElement>(null);

  // Project Card Properties
  const title = projectData?.title || projectData?.layers?.find((l: any) => l.id === 'layer_title')?.metadata?.text || 'NoteMe Project';
  const message = projectData?.message || projectData?.layers?.find((l: any) => l.id === 'layer_message')?.metadata?.text || 'Chưa có nội dung lời chúc.';
  const fontStyle = projectData?.fontStyle || 'playfair';
  const fontClass = fontRegistry[fontStyle as keyof typeof fontRegistry]?.class || 'font-playfair';
  const scene = (projectData?.scene || 'rose') as keyof typeof sceneConfig;
  const sceneInfo = sceneConfig[scene] || sceneConfig.rose;
  const placedItems: any[] = projectData?.placedItems || [];


  useEffect(() => {
    const unsubQueue = ExportService.queue.subscribe(setQueue);
    const unsubHistory = ExportService.history.subscribe(setHistory);
    setQueue(ExportService.queue.getTasks());
    setHistory(ExportService.history.getRecords());
    return () => {
      unsubQueue();
      unsubHistory();
    };
  }, []);

  const handleDeleteRecord = (id: string) => {
    ExportService.history.deleteRecord(id);
  };

  const currentUser = useCurrentUser();

  if (!isOpen) return null;

  const handleExport = () => {
    if ((format as string) === 'mp4' || (format as string) === 'gif') {
      const huggingKey = localStorage.getItem('lovenote_huggingface_api_key');
      if (!hasVideoExportPermission(currentUser?.email, huggingKey)) {
        window.dispatchEvent(new CustomEvent('open-auth-modal'));
        alert(`Tài khoản người dùng chuẩn bị giới hạn quyền "Xuất Video Animation". Vui lòng nhập API Key Hugging Face của bạn hoặc liên hệ Tài khoản chủ (${SUPPORT_CONTACT_EMAILS[0]}) để mở khóa toàn bộ quyền.`);
        return;
      }
    }

    const options: ExportOptions = {
      format,
      quality,
      pageSize,
      orientation,
      filename: format === 'json' ? `${filename}.ln4` : `${filename}.${format}`,
      includeImages,
      includeTimeline,
      includeMetadata,
      includeVersionInfo,
      includeWatermark,
      includeComments,
      watermarkText: includeWatermark ? watermarkText : '',
      // IMPORTANT: mainCardRef (when supplied by the caller — e.g. the actual greeting-card
      // editor in App.tsx) points at the REAL rendered card: full background image, layout,
      // every decoration exactly as the person designed it. previewArtboardRef only points at
      // this modal's own simplified internal mock-up (title + message box + icon stickers,
      // no background image/photo, no real layout) and exists purely so the "Live Preview" pane
      // has something to show for callers that don't have a real card DOM to point at (e.g. the
      // plain document/notes editor in StudioEditor.tsx, which never passes mainCardRef).
      // Previously this checked previewArtboardRef FIRST, which is always non-null once the
      // modal is open — so the real card was never captured, and every export silently fell back
      // to the generic mock-up. mainCardRef must win whenever it's available.
      targetElement: mainCardRef?.current || previewArtboardRef.current || undefined,
    };
    
    ExportService.export('project-1', projectData, options);
    setActiveTab('queue');
  };

  const handleShare = async () => {
    const options: ExportOptions = {
      format,
      quality,
      pageSize,
      orientation,
      filename: format === 'json' ? `${filename}.ln4` : `${filename}.${format}`,
      includeImages,
      includeTimeline,
      includeMetadata,
      includeVersionInfo,
      includeWatermark,
      includeComments,
      watermarkText: includeWatermark ? watermarkText : '',
      // See the matching comment in handleExport above — mainCardRef (the real card) must take
      // priority over previewArtboardRef (this modal's own simplified mock-up).
      targetElement: mainCardRef?.current || previewArtboardRef.current || undefined,
    };

    setIsSharing(true);
    try {
      const exporter = ExportRegistry.get(options.format);
      if (!exporter) {
        alert('Không tìm thấy định dạng xuất này.');
        return;
      }
      const result = await exporter.export(projectData, options);
      if (!result.success || (!result.blob && !result.url)) {
        alert(result.error || 'Lỗi khi chuẩn bị file để chia sẻ.');
        return;
      }
      const shared = await shareFile(result.blob || result.url!, options.filename, {
        title: filename,
        text: 'Mình gửi bạn một tấm thiệp từ NoteMe!',
      });
      if (!shared) {
        alert('Trình duyệt của bạn chưa hỗ trợ chia sẻ trực tiếp. Đang chuyển sang xuất & tải về để bạn chia sẻ thủ công thay thế.');
        ExportService.export('project-1', projectData, options);
        setActiveTab('queue');
      }
    } catch (err: any) {
      console.error('[ExportStudioModal] Lỗi khi chia sẻ:', err);
      alert(err?.message || 'Lỗi không xác định khi chia sẻ file.');
    } finally {
      setIsSharing(false);
    }
  };

  const exporters = ExportRegistry.getAll();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
      <div className="bg-surface w-full max-w-6xl h-full max-h-[800px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Sidebar / Tabs */}
        <div className="w-full md:w-64 bg-surface-elevated border-r border-border-base flex flex-col shrink-0">
          <div className="p-6 border-b border-border-base flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-main">Export Studio</h2>
            <button onClick={onClose} className="md:hidden p-2 text-text-muted hover:bg-surface rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <button 
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'export' ? 'bg-rose-100 text-rose-700 font-semibold shadow-sm' : 'text-text-muted hover:bg-surface'}`}
            >
              <Settings size={18} />
              <span>Cấu hình & Xuất</span>
            </button>
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'queue' ? 'bg-rose-100 text-rose-700 font-semibold shadow-sm' : 'text-text-muted hover:bg-surface'}`}
            >
              <List size={18} />
              <div className="flex-1 text-left">Tiến trình (Queue)</div>
              {queue.filter(q => q.status === 'running' || q.status === 'waiting').length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {queue.filter(q => q.status === 'running' || q.status === 'waiting').length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-rose-100 text-rose-700 font-semibold shadow-sm' : 'text-text-muted hover:bg-surface'}`}
            >
              <History size={18} />
              <span>Lịch sử Xuất</span>
            </button>
          </div>
        </div>

        {/* Right Side: Content Area */}
        <div className="flex-1 flex flex-col h-full bg-surface overflow-hidden">
          
          {/* Header */}
          <div className="h-16 border-b border-border-base flex items-center justify-between px-6 shrink-0 hidden md:flex">
            <h3 className="text-lg font-bold text-text-main">
              {activeTab === 'export' && 'Cấu hình Xuất tài liệu'}
              {activeTab === 'queue' && 'Tiến trình đang xuất'}
              {activeTab === 'history' && 'Lịch sử đã xuất'}
            </h3>
            <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main hover:bg-surface-elevated rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className={activeTab === 'export' ? 'flex flex-col lg:flex-row h-full' : 'hidden'}>
              {/* Live Preview Pane */}
              <div className="flex-1 bg-surface-elevated p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-border-base">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-text-muted">Live Preview</h4>
                    <div className="flex bg-surface rounded-lg p-1 border border-border-base shadow-sm">
                      <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-surface-elevated text-text-main' : 'text-text-muted'}`} title="Desktop View"><Monitor size={16} /></button>
                      <button onClick={() => setPreviewDevice('tablet')} className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-surface-elevated text-text-main' : 'text-text-muted'}`} title="Tablet View"><Tablet size={16} /></button>
                      <button onClick={() => setPreviewDevice('phone')} className={`p-1.5 rounded ${previewDevice === 'phone' ? 'bg-surface-elevated text-text-main' : 'text-text-muted'}`} title="Phone View"><Smartphone size={16} /></button>
                      <button onClick={() => setPreviewDevice('a4')} className={`p-1.5 rounded ${previewDevice === 'a4' ? 'bg-surface-elevated text-text-main' : 'text-text-muted'}`} title="A4 Print View"><FileText size={16} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden flex items-center justify-center relative">
                    <div className={`bg-white shadow-xl border border-slate-200 transition-all duration-300 relative overflow-hidden flex items-center justify-center
                      ${previewDevice === 'desktop' ? 'w-full h-full rounded-lg' : ''}
                      ${previewDevice === 'tablet' ? 'w-[768px] h-[1024px] max-w-[90%] max-h-[90%] rounded-2xl border-8 border-slate-800 scale-[0.6]' : ''}
                      ${previewDevice === 'phone' ? 'w-[375px] h-[812px] max-w-[90%] max-h-[90%] rounded-[2.5rem] border-[12px] border-slate-800 scale-[0.8]' : ''}
                      ${previewDevice === 'a4' ? 'w-[210mm] h-[297mm] max-w-[90%] max-h-[90%] scale-[0.4] origin-center' : ''}
                    `}>
                       {/* Preview Mockup with Full Card Styling and Stickers */}
                       <div 
                         id="card-preview-artboard"
                         ref={previewArtboardRef}
                         className={`absolute inset-0 p-8 flex flex-col items-center justify-center overflow-hidden relative select-none ${sceneInfo.bg} ${sceneInfo.text}`}
                       >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 pointer-events-none opacity-20" 
                               style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                          </div>

                          <div className="w-full text-center mb-4 z-10">
                            <span data-html2canvas-ignore="true" className="text-[10px] uppercase tracking-wider font-semibold text-rose-600 bg-rose-100/90 border border-rose-200 px-3 py-1 rounded-full shadow-xs">
                              Bản xem trước Xuất {format.toUpperCase()} {pageSize ? `(${pageSize.toUpperCase()})` : ''}
                            </span>
                            <h1 className={`text-3xl sm:text-5xl font-bold mt-4 leading-snug drop-shadow-sm ${fontClass} ${sceneInfo.text}`}>
                              {title}
                            </h1>
                          </div>

                          <div className={`w-full max-w-lg p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs text-center z-10`}>
                            <p className={`text-lg sm:text-2xl leading-relaxed whitespace-pre-wrap ${fontClass} ${sceneInfo.secondary}`}>
                              {message}
                            </p>
                          </div>

                          {/* Render Placed Decor Items / Stickers */}
                          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                            {placedItems.map((item: any) => {
                              const decor = decorRegistry[item.type as keyof typeof decorRegistry];
                              const customUrl = item.url || item.imageUrl;
                              if (!decor && !customUrl) return null;
                              return (
                                <div
                                  key={item.id}
                                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform"
                                  style={{
                                    left: `${item.x}px`,
                                    top: `${item.y}px`,
                                    transform: `translate(-50%, -50%) scale(${item.scale || 1}) rotate(${item.rotation || 0}deg)`,
                                    color: item.color || '#e11d48'
                                  }}
                                >
                                  {customUrl ? (
                                    <img 
                                      src={customUrl} 
                                      alt="photo" 
                                      className="w-20 h-20 object-cover border-2 border-white shadow-md transition-all duration-300" 
                                      style={getFrameStyle((item as any).frameShape as FrameShapeType)}
                                      crossOrigin="anonymous" 
                                    />
                                  ) : decor?.type === 'icon' ? (
                                    <decor.content size={42} />
                                  ) : decor?.content ? (
                                    <img src={decor.content} alt="sticker" className="w-12 h-12 object-contain" crossOrigin="anonymous" />
                                  ) : (
                                    <Heart size={42} fill="currentColor" />
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {includeWatermark && (
                            <div className="absolute inset-0 z-30 flex items-center justify-center opacity-10 pointer-events-none rotate-45">
                              <span className="text-7xl font-black text-slate-900 whitespace-nowrap">{watermarkText || 'LOVENOTE'}</span>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Settings */}
                <div className="w-full lg:w-96 bg-surface p-6 overflow-y-auto flex flex-col gap-8">
                  {/* Filename */}
                  <div>
                    <label className="text-sm font-semibold text-text-main block mb-2">Tên file</label>
                    <input 
                      type="text" 
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full bg-surface-elevated text-text-main border border-border-strong rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="text-sm font-semibold text-text-main block mb-2">Định dạng (Format)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {exporters.map(exp => (
                        <button
                          key={exp.id}
                          onClick={() => setFormat(exp.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all
                            ${format === exp.id ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-border-base hover:border-border-strong'}
                          `}
                        >
                          <span className={`font-semibold text-sm ${format === exp.id ? 'text-rose-700' : 'text-text-main'}`}>{exp.name}</span>
                          <span className="text-[10px] text-text-muted line-clamp-1" title={exp.description}>{exp.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="text-sm font-semibold text-text-main block mb-2">Chất lượng (Quality)</label>
                    <select 
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as ExportQuality)}
                      className="w-full bg-surface text-text-main border border-border-strong rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="draft">Nháp (Draft - Kích thước nhỏ)</option>
                      <option value="standard">Tiêu chuẩn (Standard - Tối ưu cho Web)</option>
                      <option value="high">Cao (High - Chia sẻ)</option>
                      <option value="print">In ấn (Print - DPI cao, không nén)</option>
                    </select>
                  </div>

                  {/* Page Settings (for PDF/DOCX) */}
                  {['pdf', 'docx'].includes(format) && (
                    <div>
                      <label className="text-sm font-semibold text-text-main block mb-2">Thiết lập trang (Page Settings)</label>
                      <div className="flex gap-2 mb-2">
                        <select 
                          value={pageSize}
                          onChange={(e) => setPageSize(e.target.value as PageSize)}
                          className="flex-1 bg-surface text-text-main border border-border-strong rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="a4">Khổ A4</option>
                          <option value="a5">Khổ A5</option>
                          <option value="letter">Letter</option>
                        </select>
                        <select 
                          value={orientation}
                          onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                          className="flex-1 bg-surface text-text-main border border-border-strong rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="portrait">Dọc (Portrait)</option>
                          <option value="landscape">Ngang (Landscape)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Include Options */}
                  <div>
                    <label className="text-sm font-semibold text-text-main block mb-3">Tùy chọn đính kèm (Include Options)</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-border-strong bg-surface focus:ring-rose-500" />
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Bao gồm Hình ảnh</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeTimeline} onChange={(e) => setIncludeTimeline(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-border-strong bg-surface focus:ring-rose-500" />
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Bao gồm Timeline</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeMetadata} onChange={(e) => setIncludeMetadata(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-border-strong bg-surface focus:ring-rose-500" />
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Bao gồm Siêu dữ liệu (Metadata)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeVersionInfo} onChange={(e) => setIncludeVersionInfo(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-border-strong bg-surface focus:ring-rose-500" />
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Thông tin Phiên bản</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeWatermark} onChange={(e) => setIncludeWatermark(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-border-strong bg-surface focus:ring-rose-500" />
                        <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">Dấu bản quyền (Watermark)</span>
                      </label>
                    </div>
                  </div>

                  {/* Watermark Details */}
                  {includeWatermark && (
                    <div className="bg-surface-elevated p-4 rounded-xl border border-border-base">
                      <label className="text-xs font-semibold text-text-muted block mb-1">Nội dung Watermark</label>
                      <select 
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full bg-surface text-text-main border border-border-strong rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
                        <option value="Draft">Draft (Bản nháp)</option>
                        <option value="Confidential">Confidential (Bảo mật)</option>
                        <option value="Do Not Copy">Do Not Copy</option>
                        <option value="NoteMe">NoteMe Signature</option>
                      </select>
                    </div>
                  )}

                  {/* Quick Share */}
                  <div className="pt-4 border-t border-border-base">
                     <p className="text-xs text-text-muted mb-3 italic">Tùy chọn chia sẻ nhanh:</p>
                     <button
                        onClick={handleShare}
                        disabled={isSharing}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border-strong text-text-main hover:bg-surface-elevated text-sm font-semibold transition-colors disabled:opacity-60"
                     >
                        {isSharing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Đang chuẩn bị...
                          </>
                        ) : (
                          <>
                            <Share2 size={16} />
                            Chia sẻ
                          </>
                        )}
                     </button>
                  </div>

                  {/* Action */}
                  <div className="pt-4 sticky bottom-0 bg-surface flex flex-col gap-2">
                    <button 
                      onClick={handleExport}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/30 active:scale-[0.98]"
                    >
                      <Download size={20} />
                      XUẤT {format.toUpperCase()} & TẢI VỀ MÁY
                    </button>
                    <p className="text-[11px] text-text-muted text-center leading-tight">
                      💡 Tệp sau khi xuất sẽ được tự động tải xuống thư mục <b>Download</b> của bạn và lưu vào <b>Lịch sử Xuất bản</b>.
                    </p>
                    <div className="mt-1 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/50 p-2.5 rounded-lg text-[10px] text-amber-800 dark:text-amber-300">
                      📱 <b>Mẹo Di Động/Máy Tính Bảng:</b> Trình duyệt di động trong iframe có thể chặn tải xuống tự động. Nếu không tải được, vui lòng mở tab <b>Tiến trình (Queue)</b> hoặc <b>Lịch sử</b> bên trái rồi nhấn trực tiếp nút <b>Tải về</b> để lưu tệp!
                    </div>
                  </div>

                </div>
              </div>

            {activeTab === 'queue' && (
              <div className="p-6">
                <h3 className="text-lg font-bold text-text-main mb-6 md:hidden">Tiến trình (Queue)</h3>
                {queue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-text-muted">
                    <List size={48} className="mb-4 opacity-20" />
                    <p>Chưa có tác vụ xuất nào.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {queue.map(task => (
                      <div key={task.id} className="border border-border-base rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-surface shadow-sm">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-3 rounded-xl flex items-center justify-center shrink-0
                            ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : ''}
                            ${task.status === 'failed' ? 'bg-red-100 text-red-600' : ''}
                            ${task.status === 'running' ? 'bg-blue-100 text-blue-600' : ''}
                            ${task.status === 'waiting' ? 'bg-surface-elevated text-text-muted' : ''}
                          `}>
                            <FileText size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-text-main truncate text-sm">{task.filename}</h4>
                            <p className="text-xs text-text-muted">Định dạng: {task.format.toUpperCase()} • Bắt đầu: {new Date(task.createdAt).toLocaleTimeString()}</p>
                            {task.status === 'running' && (
                              <div className="w-full bg-surface-elevated h-1.5 rounded-full mt-2 overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                              </div>
                            )}
                            {task.status === 'failed' && <p className="text-xs text-red-500 mt-1">{task.result?.error}</p>}
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-3">
                          {task.status === 'completed' && (
                            <div className="flex items-center gap-2">
                              {task.result?.url && (
                                <a
                                  href={task.result.url}
                                  download={task.filename}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                                >
                                  <Download size={12} /> Tải về máy
                                </a>
                              )}
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Hoàn thành</span>
                            </div>
                          )}
                          {task.status === 'failed' && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Thất bại</span>}
                          {task.status === 'running' && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded animate-pulse">Đang xử lý...</span>}
                          {task.status === 'waiting' && <span className="text-xs font-bold text-text-muted bg-surface-elevated px-2 py-1 rounded">Đang đợi</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-main">Lịch sử Xuất bản ({history.length})</h3>
                    <p className="text-xs text-text-muted">Danh sách các tệp đã xuất thành công từ dự án của bạn.</p>
                  </div>
                  {history.length > 0 && (
                    <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                      Đã lưu trữ an toàn
                    </span>
                  )}
                </div>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-text-muted bg-surface-elevated rounded-2xl border border-dashed border-border-base">
                    <History size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-sm">Chưa có lịch sử xuất tài liệu nào.</p>
                    <p className="text-xs text-text-muted mt-1">Hãy thực hiện xuất tệp ở tab Cấu hình & Xuất để lưu lại lịch sử.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {history.map(record => (
                      <div key={record.id} className="border border-border-base rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-surface hover:bg-surface-elevated transition-colors shadow-xs">
                        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                          {record.format}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-text-main truncate">{record.filename}</h4>
                          <p className="text-xs text-text-muted mt-0.5">
                            Định dạng: <span className="font-medium text-text-main">{record.format.toUpperCase()}</span> • Thời gian: {new Date(record.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0 items-center">
                          {record.url ? (
                            <a 
                              href={record.url} 
                              download={record.filename}
                              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <Download size={14} /> Tải lại tệp
                            </a>
                          ) : (
                            <span className="text-xs text-text-muted italic">Không có sẵn URL</span>
                          )}
                          <button
                            onClick={() => handleDeleteRecord(record.id)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Xóa khỏi lịch sử"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
