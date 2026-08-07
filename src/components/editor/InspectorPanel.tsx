import React, { useState } from 'react';
import { 
  Sliders, 
  Type, 
  Sparkles, 
  Palette, 
  Move, 
  RotateCw, 
  Eye, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Maximize2,
  ChevronDown,
  ChevronRight,
  Sun,
  Wand2,
  Layers,
  Square,
  History,
  LayoutTemplate,
  Paintbrush,
  Clock,
  Check
} from 'lucide-react';
import { ILayer } from '../../modules/editor/LayerTypes';
import { ThemeRegistry } from '../../modules/theme/ThemeRegistry';
import { FONT_REGISTRY, FontRegistry } from '../../modules/style/FontRegistry';
import { COLOR_PALETTE_REGISTRY, ColorPaletteRegistry } from '../../modules/style/ColorPaletteRegistry';
import { BACKGROUND_REGISTRY, BackgroundRegistry } from '../../modules/style/BackgroundRegistry';
import { BORDER_REGISTRY, BorderRegistry } from '../../modules/style/BorderRegistry';

import { TYPOGRAPHY_REGISTRY, TypographyRegistry } from '../../modules/style/TypographyRegistry';

export interface HistoryItem {
  id: string;
  action: string;
  timestamp: string;
  snapshot: any;
}

interface InspectorPanelProps {
  selectedLayers: ILayer[];
  canvasConfig: {
    scene: string;
    bgStyle: string;
    fontStyle: string;
    textColor: string;
    textSize: number;
    themeId?: string;
  };
  onUpdateLayer: (id: string, updates: Partial<ILayer>) => void;
  onUpdateCanvasConfig: (key: string, value: any) => void;
  onApplyTheme?: (themeId: string) => void;
  onAIRewrite?: () => void;
  historyStack?: HistoryItem[];
  historyIndex?: number;
  onSelectHistoryStep?: (index: number) => void;
}

const FONT_OPTIONS = [
  { id: 'playfair', label: 'Playfair (Sang trọng)' },
  { id: 'dancing', label: 'Dancing Script (Nghệ thuật)' },
  { id: 'pacifico', label: 'Pacifico (Dễ thương)' },
  { id: 'caveat', label: 'Caveat (Viết tay)' },
  { id: 'lora', label: 'Lora (Cổ điển)' },
  { id: 'nunito', label: 'Nunito (Hiện đại)' }
];

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedLayers,
  canvasConfig,
  onUpdateLayer,
  onUpdateCanvasConfig,
  onApplyTheme,
  onAIRewrite,
  historyStack = [],
  historyIndex = 0,
  onSelectHistoryStep = (index: number) => {}
}) => {
  const activeLayer = selectedLayers[0];

  // Tab State
  const [activeTab, setActiveTab] = useState<'properties' | 'styles' | 'animation' | 'history'>('properties');

  // Accordion Section Open States for Properties
  const [sections, setSections] = useState<Record<string, boolean>>({
    transform: true,
    typography: true,
    appearance: true,
    ai: true,
  });

  const toggleSection = (key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-72 bg-surface/95 backdrop-blur-md rounded-2xl shadow-xl border border-border-subtle flex flex-col h-full select-none overflow-hidden text-xs">
      {/* Header & Tabs */}
      <div className="border-b border-border-subtle bg-surface-elevated">
        <div className="p-3 flex items-center gap-2 font-bold text-text-main">
          <Sliders size={16} className="text-rose-600" />
          <span>Inspector</span>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-t border-border-subtle bg-surface">
          <button 
            onClick={() => setActiveTab('properties')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'properties' ? 'border-rose-500 text-rose-600' : 'border-transparent text-text-muted hover:text-text-main'}`}
          >
            Props
          </button>
          <button 
            onClick={() => setActiveTab('styles')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center justify-center gap-1 ${activeTab === 'styles' ? 'border-rose-500 text-rose-600' : 'border-transparent text-text-muted hover:text-text-main'}`}
          >
            <Paintbrush size={10} />
            Styles
          </button>
          <button 
            onClick={() => setActiveTab('animation')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'animation' ? 'border-rose-500 text-rose-600' : 'border-transparent text-text-muted hover:text-text-main'}`}
          >
            Anim
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'history' ? 'border-rose-500 text-rose-600' : 'border-transparent text-text-muted hover:text-text-main'}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        
        {/* ===================== TAB: PROPERTIES ===================== */}
        {activeTab === 'properties' && (
          <>
            {activeLayer ? (
              <>
                {/* Layer Info Header */}
                <div className="bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-text-main block truncate">{activeLayer.name}</span>
                    <span className="text-[10px] text-text-muted capitalize">{activeLayer.type} layer</span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-600 bg-surface px-2 py-0.5 rounded border border-border-base">
                    z: {activeLayer.zIndex || 0}
                  </span>
                </div>

                {/* TRANSFORM SECTION */}
                <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface shadow-2xs">
                  <button
                    onClick={() => toggleSection('transform')}
                    className="w-full p-2.5 bg-surface-elevated hover:bg-surface-hover flex items-center justify-between font-semibold text-text-main transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Move size={14} className="text-rose-500" />
                      <span>Transform</span>
                    </div>
                    {sections.transform ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {sections.transform && (
                    <div className="p-2.5 space-y-2.5 border-t border-border-subtle">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">X (px)</label>
                          <input
                            type="number"
                            value={Math.round(activeLayer.x)}
                            onChange={(e) => onUpdateLayer(activeLayer.id, { x: Number(e.target.value) })}
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-1.5 text-text-main font-mono focus:border-rose-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">Y (px)</label>
                          <input
                            type="number"
                            value={Math.round(activeLayer.y)}
                            onChange={(e) => onUpdateLayer(activeLayer.id, { y: Number(e.target.value) })}
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-1.5 text-text-main font-mono focus:border-rose-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">W (px)</label>
                          <input
                            type="number"
                            value={Math.round(activeLayer.width)}
                            onChange={(e) =>
                              onUpdateLayer(activeLayer.id, { width: Math.max(10, Number(e.target.value)) })
                            }
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-1.5 text-text-main font-mono focus:border-rose-400 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">H (px)</label>
                          <input
                            type="number"
                            value={Math.round(activeLayer.height)}
                            onChange={(e) =>
                              onUpdateLayer(activeLayer.id, { height: Math.max(10, Number(e.target.value)) })
                            }
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-1.5 text-text-main font-mono focus:border-rose-400 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Rotation & Opacity */}
                      <div>
                        <div className="flex justify-between text-[10px] text-text-muted mb-1">
                          <span>Xoay góc</span>
                          <span className="font-mono">{Math.round(activeLayer.rotation || 0)}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          value={Math.round(activeLayer.rotation || 0)}
                          onChange={(e) => onUpdateLayer(activeLayer.id, { rotation: Number(e.target.value) })}
                          className="w-full accent-rose-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-text-muted mb-1">
                          <span>Độ trong suốt</span>
                          <span className="font-mono">{Math.round((activeLayer.opacity ?? 1) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={activeLayer.opacity ?? 1}
                          onChange={(e) => onUpdateLayer(activeLayer.id, { opacity: Number(e.target.value) })}
                          className="w-full accent-rose-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* TYPOGRAPHY SECTION */}
                {activeLayer.type === 'text' && (
                  <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface shadow-2xs">
                    <button
                      onClick={() => toggleSection('typography')}
                      className="w-full p-2.5 bg-surface-elevated hover:bg-surface-hover flex items-center justify-between font-semibold text-text-main transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Type size={14} className="text-blue-500" />
                        <span>Typography</span>
                      </div>
                      {sections.typography ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {sections.typography && (
                      <div className="p-2.5 space-y-2.5 border-t border-border-subtle">
                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">Nội dung text</label>
                          <textarea
                            value={activeLayer.metadata?.text || ''}
                            onChange={(e) =>
                              onUpdateLayer(activeLayer.id, {
                                metadata: { ...activeLayer.metadata, text: e.target.value },
                              })
                            }
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-2 text-text-main focus:border-rose-400 focus:outline-none resize-y min-h-[60px]"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">Ghi đè font cho block này</label>
                          <select
                            value={activeLayer.metadata?.fontStyle || 'playfair'}
                            onChange={(e) =>
                              onUpdateLayer(activeLayer.id, {
                                metadata: { ...activeLayer.metadata, fontStyle: e.target.value },
                              })
                            }
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-1.5 text-text-main focus:border-rose-400 focus:outline-none mb-2"
                          >
                            {FontRegistry.getAll().map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-[10px] text-text-muted block mb-1">Kiểu chữ (Typography Preset)</label>
                          <select
                            value={activeLayer.metadata?.typography || 'heading'}
                            onChange={(e) =>
                              onUpdateLayer(activeLayer.id, {
                                metadata: { ...activeLayer.metadata, typography: e.target.value },
                              })
                            }
                            className="w-full bg-surface-elevated border border-border-base rounded-lg p-1.5 text-text-main focus:border-rose-400 focus:outline-none"
                          >
                            {TypographyRegistry.getAll().map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <label className="text-[10px] text-text-muted block mb-1">Căn lề</label>
                            <div className="flex border border-border-base rounded-lg overflow-hidden bg-surface-elevated p-0.5">
                              {['left', 'center', 'right'].map((align) => (
                                <button
                                  key={align}
                                  onClick={() =>
                                    onUpdateLayer(activeLayer.id, {
                                      metadata: { ...activeLayer.metadata, align },
                                    })
                                  }
                                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors ${
                                    activeLayer.metadata?.align === align
                                      ? 'bg-surface text-rose-600 shadow-xs'
                                      : 'text-text-muted hover:text-text-main'
                                  }`}
                                >
                                  {align === 'left' && <AlignLeft size={12} />}
                                  {align === 'center' && <AlignCenter size={12} />}
                                  {align === 'right' && <AlignRight size={12} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* APPEARANCE SECTION */}
                <div className="border border-border-subtle rounded-xl overflow-hidden bg-surface shadow-2xs">
                  <button
                    onClick={() => toggleSection('appearance')}
                    className="w-full p-2.5 bg-surface-elevated hover:bg-surface-hover flex items-center justify-between font-semibold text-text-main transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Palette size={14} className="text-emerald-500" />
                      <span>Appearance</span>
                    </div>
                    {sections.appearance ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {sections.appearance && (
                    <div className="p-2.5 space-y-2.5 border-t border-border-subtle">
                      <div>
                        <label className="text-[10px] text-text-muted block mb-1">Màu chủ đạo (Color)</label>
                        <input
                          type="color"
                          value={activeLayer.metadata?.color || '#f43f5e'}
                          onChange={(e) =>
                            onUpdateLayer(activeLayer.id, {
                              metadata: { ...activeLayer.metadata, color: e.target.value },
                            })
                          }
                          className="w-full h-8 rounded-lg cursor-pointer border-0 p-0"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* AI ASSISTANT SECTION */}
                <div className="border border-rose-500/20 rounded-xl overflow-hidden bg-rose-500/10 shadow-2xs">
                  <button
                    onClick={() => toggleSection('ai')}
                    className="w-full p-2.5 bg-rose-500/20 hover:bg-rose-500/30 flex items-center justify-between font-semibold text-rose-900 dark:text-rose-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Wand2 size={14} className="text-rose-600" />
                      <span>AI Assistant</span>
                    </div>
                    {sections.ai ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {sections.ai && (
                    <div className="p-2.5 space-y-2 border-t border-rose-500/20">
                      {onAIRewrite && activeLayer.type === 'text' && (
                        <button
                          onClick={onAIRewrite}
                          className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all text-[11px]"
                        >
                          <Sparkles size={13} />
                          <span>AI Tự động viết lại nội dung</span>
                        </button>
                      )}
                      <p className="text-[10px] text-text-muted italic text-center">
                        Gợi ý phối màu & sắp xếp tự động dựa trên AI reasoning engine.
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-text-muted flex flex-col items-center">
                <Square size={24} className="mb-2 opacity-50" />
                <p>Chọn một block để xem thuộc tính</p>
              </div>
            )}
          </>
        )}

        {/* ===================== TAB: STYLES ===================== */}
        {activeTab === 'styles' && (
          <div className="space-y-4">
            
            {/* Theme Presets */}
            <div className="border border-border-subtle rounded-xl bg-surface shadow-2xs p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-text-main mb-2">
                <LayoutTemplate size={14} className="text-indigo-500" />
                <span>Theme Presets</span>
              </div>
              <select
                value={canvasConfig.themeId || ''}
                onChange={(e) => onApplyTheme && onApplyTheme(e.target.value)}
                className="w-full bg-surface-elevated border border-border-base rounded-lg p-2 text-text-main font-bold focus:border-rose-400 focus:outline-none"
              >
                <option value="" disabled>-- Chọn một Theme --</option>
                {ThemeRegistry.getAll().map((t) => (
                  <option key={t.id} value={t.id}>
                    ✨ {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Library */}
            <div className="border border-border-subtle rounded-xl bg-surface shadow-2xs p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-text-main mb-2">
                <Type size={14} className="text-blue-500" />
                <span>Font Library (Toàn cục)</span>
              </div>
              <select
                value={canvasConfig.fontStyle}
                onChange={(e) => onUpdateCanvasConfig('fontStyle', e.target.value)}
                className="w-full bg-surface-elevated border border-border-base rounded-lg p-2 text-text-main focus:border-rose-400 focus:outline-none"
              >
                {FontRegistry.getAll().map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Color Palette */}
            <div className="border border-border-subtle rounded-xl bg-surface shadow-2xs p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-text-main mb-2">
                <Palette size={14} className="text-emerald-500" />
                <span>Color Palette</span>
              </div>
              
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                {ColorPaletteRegistry.getAll().map(cp => (
                  <button 
                    key={cp.id}
                    onClick={() => {
                      if (activeLayer) {
                        onUpdateLayer(activeLayer.id, { 
                          metadata: { ...activeLayer.metadata, color: cp.colors.primary }
                        });
                      }
                    }}
                    className="flex flex-col gap-1 border border-border-base rounded-lg p-1.5 hover:bg-surface-hover"
                  >
                    <span className="text-[9px] font-bold text-text-muted truncate">{cp.name}</span>
                    <div className="flex w-full h-4 rounded overflow-hidden">
                      <div className="flex-1" style={{ backgroundColor: cp.colors.primary }} />
                      <div className="flex-1" style={{ backgroundColor: cp.colors.secondary }} />
                      <div className="flex-1" style={{ backgroundColor: cp.colors.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Background Library */}
            <div className="border border-border-subtle rounded-xl bg-surface shadow-2xs p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-text-main mb-2">
                <Sun size={14} className="text-amber-500" />
                <span>Background Library</span>
              </div>
              <select
                value={canvasConfig.bgStyle}
                onChange={(e) => onUpdateCanvasConfig('bgStyle', e.target.value)}
                className="w-full bg-surface-elevated border border-border-base rounded-lg p-2 text-text-main focus:border-rose-400 focus:outline-none capitalize mb-2"
              >
                {['solid', 'floating', 'hearts', 'grid', 'blobs'].map((b) => (
                  <option key={b} value={b}>
                    Scene: {b}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-text-muted mb-1">Canvas Background Pattern</p>
              <div className="grid grid-cols-2 gap-1.5">
                {BackgroundRegistry.getAll().slice(0, 4).map(bg => (
                  <button 
                    key={bg.id}
                    onClick={() => onUpdateCanvasConfig('bgStyle', bg.id)}
                    className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all group ${canvasConfig.bgStyle === bg.id ? 'border-rose-400 bg-rose-50' : 'border-border-base hover:border-rose-500'}`}
                  >
                    <div 
                      className="w-full h-8 rounded mb-1 border border-border-base shadow-sm"
                      style={{ background: bg.value }}
                    />
                    <span className="text-[9px] font-medium text-text-muted group-hover:text-rose-600">{bg.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Border & Shape Styles */}
            <div className="border border-border-subtle rounded-xl bg-surface shadow-2xs p-2.5">
              <div className="flex items-center gap-1.5 font-bold text-text-main mb-2">
                <Square size={14} className="text-pink-500" />
                <span>Border & Shape Styles</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {BorderRegistry.getAll().map(border => (
                  <button 
                    key={border.id}
                    onClick={() => {
                      if (activeLayer && activeLayer.type === 'image') {
                        onUpdateLayer(activeLayer.id, {
                          metadata: { 
                            ...activeLayer.metadata, 
                            borderStyle: border.borderStyle,
                            borderWidth: border.borderWidth,
                            borderRadius: border.borderRadius
                          }
                        });
                      }
                    }}
                    className="p-2 border border-border-base rounded-lg hover:bg-surface-hover flex flex-col items-center"
                  >
                    <div 
                      className="w-10 h-6 mb-1 bg-surface"
                      style={{
                        borderStyle: border.borderStyle,
                        borderWidth: `${border.borderWidth}px`,
                        borderColor: '#94a3b8',
                        borderRadius: `${border.borderRadius}px`,
                        boxShadow: border.boxShadow
                      }}
                    />
                    <span className="text-[9px] text-text-muted text-center">{border.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reusable Styles (Save Custom Style) */}
            <div className="border border-rose-500/20 rounded-xl bg-rose-500/10 shadow-2xs p-2.5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200">
                <Sparkles size={14} className="text-rose-500" />
                <span>Save Custom Style</span>
              </div>
              <p className="text-[10px] text-rose-700/80 dark:text-rose-300">Lưu cấu hình hiện tại thành Theme cá nhân để dùng lại sau này.</p>
              <div className="flex gap-1.5">
                <input 
                  type="text" 
                  placeholder="My Style Name" 
                  className="flex-1 bg-surface border border-border-base rounded-lg px-2 text-[11px] focus:border-rose-400 focus:outline-none text-text-main"
                />
                <button className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-3 rounded-lg text-[11px] transition-colors shadow-sm">
                  Save
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ===================== TAB: ANIMATION ===================== */}
        {activeTab === 'animation' && (
          <div className="space-y-4">
            {activeLayer ? (
              <div className="border border-border-subtle rounded-xl bg-surface shadow-2xs p-3">
                <label className="text-[11px] font-bold text-text-main block mb-2">Kiểu hiệu ứng động</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'Tĩnh (None)' },
                    { id: 'float', label: 'Bay lượn (Float)' },
                    { id: 'pulse', label: 'Nhịp đập (Pulse)' },
                    { id: 'spin', label: 'Xoay tròn (Spin)' }
                  ].map(anim => (
                    <button
                      key={anim.id}
                      onClick={() =>
                        onUpdateLayer(activeLayer.id, {
                          metadata: { ...activeLayer.metadata, animation: anim.id },
                        })
                      }
                      className={`p-2 rounded-lg border text-center transition-all ${
                        activeLayer.metadata?.animation === anim.id 
                          ? 'bg-rose-50 border-rose-400 text-rose-700 font-bold' 
                          : 'bg-surface border-border-base text-text-muted hover:border-rose-500'
                      }`}
                    >
                      {anim.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-text-muted flex flex-col items-center">
                <Sparkles size={24} className="mb-2 opacity-50" />
                <p>Chọn một layer để thêm hiệu ứng động</p>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: HISTORY ===================== */}
        {activeTab === 'history' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="font-bold text-text-main">Lịch sử thay đổi</span>
              <div className="flex gap-1">
                {/* We just use the list below for navigation */}
              </div>
            </div>

            {historyStack.length === 0 ? (
              <div className="py-10 text-center text-text-muted flex flex-col items-center gap-2">
                <Clock size={28} className="text-text-muted" />
                <p>Chưa có lịch sử thay đổi</p>
              </div>
            ) : (
              historyStack.map((item, index) => {
                const isActive = index === historyIndex;
                const isFuture = index > historyIndex;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectHistoryStep(index)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-center justify-between group ${
                      isActive
                        ? 'bg-rose-500 text-white font-medium border-rose-600 shadow-md'
                        : isFuture
                        ? 'opacity-40 hover:opacity-75 bg-surface-elevated border-transparent text-text-muted'
                        : 'hover:bg-surface-hover border-transparent text-text-main'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isActive ? 'bg-white animate-pulse' : 'bg-rose-300'
                        }`}
                      />
                      <div className="truncate">
                        <span className="block truncate text-xs font-semibold">{item.action}</span>
                        <span
                          className={`text-[9px] block font-mono ${
                            isActive ? 'text-rose-100' : 'text-text-muted'
                          }`}
                        >
                          {item.timestamp}
                        </span>
                      </div>
                    </div>

                    {isActive && <Check size={14} className="shrink-0 text-white" />}
                  </button>
                );
              })
            )}
            <div className="p-2.5 border-t border-border-subtle bg-surface-elevated/50 text-[10px] text-text-muted text-center mt-4 rounded-xl">
              Click vào thao tác để nhảy đến phiên bản đó (Time Travel)
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
