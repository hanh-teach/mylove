import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Settings, History, List, Monitor, Smartphone, Tablet } from 'lucide-react';
import { ExportFormat, ExportOptions, ExportQuality, PageSize, PageOrientation } from '../../../modules/export/ExportTypes';
import { ExportRegistry } from '../../../modules/export/ExportRegistry';
import { ExportService } from '../../../modules/export/ExportService';
import { ExportHistoryRecord, ExportTask } from '../../../modules/export/ExportTypes';

interface ExportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
}

export const ExportStudioModal: React.FC<ExportStudioModalProps> = ({ isOpen, onClose, projectData }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'queue' | 'history'>('export');
  
  // Settings state
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [quality, setQuality] = useState<ExportQuality>('standard');
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('portrait');
  const [filename, setFilename] = useState('LoveNoteProject');
  
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

  if (!isOpen) return null;

  const handleExport = () => {
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
    };
    
    ExportService.export('project-1', projectData, options);
    setActiveTab('queue');
  };

  const exporters = ExportRegistry.getAll();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
      <div className="bg-white w-full max-w-6xl h-full max-h-[800px] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Side: Sidebar / Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Export Studio</h2>
            <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:bg-slate-200 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="p-4 flex flex-col gap-2 flex-1">
            <button 
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'export' ? 'bg-rose-100 text-rose-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Settings size={18} />
              <span>Cấu hình & Xuất</span>
            </button>
            <button 
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'queue' ? 'bg-rose-100 text-rose-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
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
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-rose-100 text-rose-700 font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <History size={18} />
              <span>Lịch sử Xuất</span>
            </button>
          </div>
        </div>

        {/* Right Side: Content Area */}
        <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
          
          {/* Header */}
          <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 hidden md:flex">
            <h3 className="text-lg font-bold text-slate-800">
              {activeTab === 'export' && 'Cấu hình Xuất tài liệu'}
              {activeTab === 'queue' && 'Tiến trình đang xuất'}
              {activeTab === 'history' && 'Lịch sử đã xuất'}
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'export' && (
              <div className="flex flex-col lg:flex-row h-full">
                {/* Live Preview Pane */}
                <div className="flex-1 bg-slate-100 p-6 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-slate-600">Live Preview</h4>
                    <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                      <button onClick={() => setPreviewDevice('desktop')} className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`} title="Desktop View"><Monitor size={16} /></button>
                      <button onClick={() => setPreviewDevice('tablet')} className={`p-1.5 rounded ${previewDevice === 'tablet' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`} title="Tablet View"><Tablet size={16} /></button>
                      <button onClick={() => setPreviewDevice('phone')} className={`p-1.5 rounded ${previewDevice === 'phone' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`} title="Phone View"><Smartphone size={16} /></button>
                      <button onClick={() => setPreviewDevice('a4')} className={`p-1.5 rounded ${previewDevice === 'a4' ? 'bg-slate-100 text-slate-800' : 'text-slate-400'}`} title="A4 Print View"><FileText size={16} /></button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden flex items-center justify-center relative">
                    <div className={`bg-white shadow-xl border border-slate-200 transition-all duration-300 relative overflow-hidden flex items-center justify-center
                      ${previewDevice === 'desktop' ? 'w-full h-full rounded-lg' : ''}
                      ${previewDevice === 'tablet' ? 'w-[768px] h-[1024px] max-w-[90%] max-h-[90%] rounded-2xl border-8 border-slate-800 scale-[0.6]' : ''}
                      ${previewDevice === 'phone' ? 'w-[375px] h-[812px] max-w-[90%] max-h-[90%] rounded-[2.5rem] border-[12px] border-slate-800 scale-[0.8]' : ''}
                      ${previewDevice === 'a4' ? 'w-[210mm] h-[297mm] max-w-[90%] max-h-[90%] scale-[0.4] origin-center' : ''}
                    `}>
                       {/* Preview Mockup */}
                       <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-pink-50 p-8 flex flex-col items-center">
                          <h1 className="text-3xl font-bold text-rose-800 font-playfair mb-4">Sample Preview</h1>
                          <p className="text-slate-600 text-center max-w-sm">
                            Đây là bản xem trước cách tài liệu của bạn sẽ hiển thị trên định dạng {format.toUpperCase()} 
                            {pageSize ? ` khổ ${pageSize.toUpperCase()}` : ''}.
                          </p>
                          {includeWatermark && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none rotate-45">
                              <span className="text-8xl font-black text-slate-900 whitespace-nowrap">{watermarkText || 'WATERMARK'}</span>
                            </div>
                          )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Configuration Settings */}
                <div className="w-full lg:w-96 bg-white p-6 overflow-y-auto flex flex-col gap-8">
                  {/* Filename */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Tên file</label>
                    <input 
                      type="text" 
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>

                  {/* Format */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Định dạng (Format)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {exporters.map(exp => (
                        <button
                          key={exp.id}
                          onClick={() => setFormat(exp.id)}
                          className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all
                            ${format === exp.id ? 'border-rose-500 bg-rose-50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}
                          `}
                        >
                          <span className={`font-semibold text-sm ${format === exp.id ? 'text-rose-700' : 'text-slate-700'}`}>{exp.name}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1" title={exp.description}>{exp.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Chất lượng (Quality)</label>
                    <select 
                      value={quality}
                      onChange={(e) => setQuality(e.target.value as ExportQuality)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
                      <label className="text-sm font-semibold text-slate-700 block mb-2">Thiết lập trang (Page Settings)</label>
                      <div className="flex gap-2 mb-2">
                        <select 
                          value={pageSize}
                          onChange={(e) => setPageSize(e.target.value as PageSize)}
                          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="a4">Khổ A4</option>
                          <option value="a5">Khổ A5</option>
                          <option value="letter">Letter</option>
                        </select>
                        <select 
                          value={orientation}
                          onChange={(e) => setOrientation(e.target.value as PageOrientation)}
                          className="flex-1 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        >
                          <option value="portrait">Dọc (Portrait)</option>
                          <option value="landscape">Ngang (Landscape)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Include Options */}
                  <div>
                    <label className="text-sm font-semibold text-slate-700 block mb-3">Tùy chọn đính kèm (Include Options)</label>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Bao gồm Hình ảnh</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeTimeline} onChange={(e) => setIncludeTimeline(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Bao gồm Timeline</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeMetadata} onChange={(e) => setIncludeMetadata(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Bao gồm Siêu dữ liệu (Metadata)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeVersionInfo} onChange={(e) => setIncludeVersionInfo(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Thông tin Phiên bản</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" checked={includeWatermark} onChange={(e) => setIncludeWatermark(e.target.checked)} className="w-4 h-4 text-rose-500 rounded border-slate-300 focus:ring-rose-500" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Dấu bản quyền (Watermark)</span>
                      </label>
                    </div>
                  </div>

                  {/* Watermark Details */}
                  {includeWatermark && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Nội dung Watermark</label>
                      <select 
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500"
                      >
                        <option value="Draft">Draft (Bản nháp)</option>
                        <option value="Confidential">Confidential (Bảo mật)</option>
                        <option value="Do Not Copy">Do Not Copy</option>
                        <option value="LoveNote">LoveNote Signature</option>
                      </select>
                    </div>
                  )}

                  {/* Share Phase 1 */}
                  <div className="pt-4 border-t border-slate-200">
                     <p className="text-xs text-slate-500 mb-3 italic">Tùy chọn chia sẻ nhanh:</p>
                     <div className="flex gap-2">
                        <button className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors">Copy</button>
                        <button className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors">Print</button>
                     </div>
                  </div>

                  {/* Action */}
                  <div className="pt-4 sticky bottom-0 bg-white">
                    <button 
                      onClick={handleExport}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-rose-500/30 active:scale-[0.98]"
                    >
                      <Download size={20} />
                      XUẤT {format.toUpperCase()}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'queue' && (
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 md:hidden">Tiến trình (Queue)</h3>
                {queue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <List size={48} className="mb-4 opacity-20" />
                    <p>Chưa có tác vụ xuất nào.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {queue.map(task => (
                      <div key={task.id} className="border border-slate-200 rounded-xl p-4 flex items-center gap-4 bg-white shadow-sm">
                        <div className={`p-3 rounded-xl flex items-center justify-center shrink-0
                          ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : ''}
                          ${task.status === 'failed' ? 'bg-red-100 text-red-600' : ''}
                          ${task.status === 'running' ? 'bg-blue-100 text-blue-600' : ''}
                          ${task.status === 'waiting' ? 'bg-slate-100 text-slate-600' : ''}
                        `}>
                          <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 truncate">{task.filename}</h4>
                          <p className="text-xs text-slate-500">Định dạng: {task.format.toUpperCase()} • Bắt đầu: {new Date(task.createdAt).toLocaleTimeString()}</p>
                          {task.status === 'running' && (
                            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${task.progress}%` }}></div>
                            </div>
                          )}
                          {task.status === 'failed' && <p className="text-xs text-red-500 mt-1">{task.result?.error}</p>}
                        </div>
                        <div className="shrink-0 flex items-center">
                          {task.status === 'completed' && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Hoàn thành</span>}
                          {task.status === 'failed' && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">Thất bại</span>}
                          {task.status === 'running' && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded animate-pulse">Đang xử lý...</span>}
                          {task.status === 'waiting' && <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded">Đang đợi</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-6 md:hidden">Lịch sử (History)</h3>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <History size={48} className="mb-4 opacity-20" />
                    <p>Chưa có lịch sử xuất tài liệu.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {history.map(record => (
                      <div key={record.id} className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 truncate">{record.filename}</h4>
                          <p className="text-xs text-slate-500">
                            {record.format.toUpperCase()} • {new Date(record.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          {record.url && (
                            <a 
                              href={record.url} 
                              download={record.filename}
                              className="px-3 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
                            >
                              <Download size={14} /> Tải lại
                            </a>
                          )}
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
