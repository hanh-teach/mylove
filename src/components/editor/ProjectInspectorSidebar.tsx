import React, { useState, useEffect } from 'react';
import { 
  X, 
  Pin, 
  Info, 
  Tag, 
  Sparkles, 
  BrainCircuit, 
  Milestone, 
  History, 
  Trash2, 
  Plus, 
  Check, 
  Play,
  RotateCcw,
  User,
  FolderOpen,
  Calendar,
  Clock,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useProjectWorkspace } from '../../modules/workspace/WorkspaceContext';
import { MemoryService } from '../../modules/memory/MemoryService';
import { DraftStorage } from '../../modules/editor/autosave/DraftStorage';
import { VersionMetadata } from '../../modules/editor/autosave/VersionDiff';
import { IMemory } from '../../modules/memory/MemoryTypes';

interface ProjectInspectorSidebarProps {
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  isMobileBottomSheet?: boolean;
}

const PRESET_TAGS = [
  'Birthday', 'Speech', 'Teacher', 'Journal', 'Family', 
  'Friend', 'Graduation', 'Anniversary', 'Thank You', 'Love'
];

export const ProjectInspectorSidebar: React.FC<ProjectInspectorSidebarProps> = ({
  onClose,
  isPinned,
  onTogglePin,
  isMobileBottomSheet = false,
}) => {
  const { activeProject, updateActiveProject } = useProjectWorkspace();

  // Accordion panel open states
  const [sections, setSections] = useState<Record<string, boolean>>({
    info: true,
    tags: true,
    aiContext: true,
    memories: true,
    workflow: true,
    versions: true,
  });

  // Local component states
  const [newTagInput, setNewTagInput] = useState('');
  const [allMemories, setAllMemories] = useState<IMemory[]>([]);
  const [versions, setVersions] = useState<VersionMetadata[]>([]);
  const [isRunningStep, setIsRunningStep] = useState<string | null>(null);

  // Load memories and versions on mount
  useEffect(() => {
    // Get real memories from MemoryService
    const list = MemoryService.getMemories();
    setAllMemories(list);

    // Get real draft versions from DraftStorage
    DraftStorage.getVersions().then(vers => {
      setVersions(vers);
    });
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="p-6 text-center text-slate-500">
        <Info className="mx-auto mb-2 text-slate-400" />
        <span>Vui lòng chọn một dự án để xem thuộc tính</span>
      </div>
    );
  }

  // Fallback structures for project metadata
  const metadata = activeProject.metadata || {};
  const aiContext = metadata.aiContext || {
    style: 'Formal',
    audience: 'Teacher',
    emotion: 'Respect',
    language: 'Vietnamese',
    length: 'Medium'
  };

  const enabledMemoryIds = metadata.enabledMemoryIds || allMemories.map(m => m.id);

  // Workflow steps with custom fallback values
  const workflowStatus = metadata.workflowStatus || {
    planning: 'Completed',
    writing: 'Completed',
    images: 'Running',
    reflection: 'Pending',
    export: 'Pending'
  };

  const toggleSection = (key: string) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 1. PROJECT INFO ACTIONS
  const handleUpdateField = (key: string, value: any) => {
    updateActiveProject({ [key]: value });
  };

  const handleUpdateMetadata = (key: string, value: any) => {
    updateActiveProject({
      metadata: {
        ...metadata,
        [key]: value
      }
    });
  };

  // 2. TAG ACTIONS
  const handleAddTag = (tagText: string) => {
    const trimmed = tagText.trim();
    if (!trimmed) return;
    
    const currentTags = activeProject.tags || [];
    if (!currentTags.includes(trimmed)) {
      updateActiveProject({
        tags: [...currentTags, trimmed]
      });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = activeProject.tags || [];
    updateActiveProject({
      tags: currentTags.filter(t => t !== tagToRemove)
    });
  };

  // 3. AI CONTEXT ACTIONS
  const handleUpdateAIContext = (field: string, value: string) => {
    const currentAI = { ...aiContext, [field]: value };
    handleUpdateMetadata('aiContext', currentAI);
  };

  // 4. MEMORY TOGGLE ACTIONS
  const handleToggleMemory = (memoryId: string) => {
    let nextEnabled: string[];
    if (enabledMemoryIds.includes(memoryId)) {
      nextEnabled = enabledMemoryIds.filter((id: string) => id !== memoryId);
    } else {
      nextEnabled = [...enabledMemoryIds, memoryId];
    }
    handleUpdateMetadata('enabledMemoryIds', nextEnabled);
  };

  const handleToggleAllMemories = (enable: boolean) => {
    const nextEnabled = enable ? allMemories.map(m => m.id) : [];
    handleUpdateMetadata('enabledMemoryIds', nextEnabled);
  };

  // 5. WORKFLOW SIMULATION ACTIONS
  const handleSimulateWorkflowStep = (stepKey: string) => {
    setIsRunningStep(stepKey);
    // Set step to Running
    const nextWorkflow = { ...workflowStatus, [stepKey]: 'Running' };
    handleUpdateMetadata('workflowStatus', nextWorkflow);

    setTimeout(() => {
      setIsRunningStep(null);
      const updatedWorkflow = { ...nextWorkflow, [stepKey]: 'Completed' };
      handleUpdateMetadata('workflowStatus', updatedWorkflow);
      
      // Auto increment progress metric slightly
      const currentProgress = activeProject.progress || 0;
      handleUpdateField('progress', Math.min(100, currentProgress + 15));
    }, 2000);
  };

  // 6. VERSION RESTORE ACTION
  const handleRestoreVersion = (ver: VersionMetadata) => {
    // Save draft in DraftStorage then fire custom event to let editor listen
    DraftStorage.saveDraft(ver.document).then(() => {
      const event = new CustomEvent('restore-version', {
        detail: {
          document: ver.document,
          versionNumber: ver.versionNumber
        }
      });
      window.dispatchEvent(event);
    });
  };

  // Formatting utilities
  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Chưa rõ';
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderSectionHeader = (key: string, title: string, icon: React.ReactNode, count?: number) => {
    const isOpen = sections[key];
    return (
      <button
        onClick={() => toggleSection(key)}
        className="w-full py-2.5 px-3 hover:bg-rose-50/50 flex items-center justify-between font-bold text-slate-800 border-b border-rose-100/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-rose-500">{icon}</span>
          <span className="text-xs tracking-wide uppercase">{title}</span>
          {count !== undefined && (
            <span className="ml-1 bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {count}
            </span>
          )}
        </div>
        <span className="text-slate-400 font-mono text-sm leading-none transition-transform duration-200">
          {isOpen ? '−' : '+'}
        </span>
      </button>
    );
  };

  return (
    <div className={`h-full flex flex-col bg-white border-l border-rose-100 shadow-2xl relative select-none ${
      isMobileBottomSheet ? 'w-full' : 'w-full max-w-full sm:w-[320px] md:w-[320px]'
    }`}>
      {/* Header Panel */}
      <div className="bg-rose-50/80 px-4 py-3 border-b border-rose-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Info size={16} className="text-rose-600" />
          <span className="font-serif font-bold text-slate-900 text-sm">Project Inspector</span>
        </div>

        <div className="flex items-center gap-1">
          {!isMobileBottomSheet && (
            <button
              onClick={onTogglePin}
              className={`p-1.5 rounded-lg hover:bg-rose-100 transition-colors ${
                isPinned ? 'text-rose-600 bg-rose-100/50' : 'text-slate-400'
              }`}
              title={isPinned ? "Bỏ ghim (Unpin)" : "Ghim Sidebar (Pin)"}
            >
              <Pin size={14} className={isPinned ? 'rotate-45' : ''} />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Đóng bảng"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Accordion Panels (Scrollable Area) */}
      <div className="flex-1 overflow-y-auto divide-y divide-rose-100/65 custom-scrollbar">
        
        {/* 1. PROJECT INFO SECTION */}
        <div className="bg-white">
          {renderSectionHeader('info', 'Project Information', <Info size={14} />)}
          {sections.info && (
            <div className="p-3.5 space-y-3.5 text-[11px]">
              {/* Project Name */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Project Name</label>
                <input
                  type="text"
                  value={activeProject.title}
                  onChange={(e) => handleUpdateField('title', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:border-rose-400 focus:ring-1 focus:ring-rose-400/30 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Category</label>
                <select
                  value={activeProject.category || 'General'}
                  onChange={(e) => handleUpdateField('category', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-800 font-medium focus:border-rose-400 focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Journal">Journal</option>
                  <option value="Family">Family</option>
                  <option value="Friend">Friend</option>
                  <option value="Graduation">Graduation</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Status</label>
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                  {['draft', 'published', 'archived'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateField('status', st)}
                      className={`flex-1 py-1 text-center font-bold rounded transition-colors text-[10px] capitalize ${
                        activeProject.status === st
                          ? 'bg-white text-rose-600 shadow-xs border border-rose-100'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100/55">
                <div>
                  <span className="text-slate-400 font-medium block mb-0.5">Created Date</span>
                  <span className="font-mono text-slate-700 block">{formatDate(activeProject.createdAt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block mb-0.5">Modified Date</span>
                  <span className="font-mono text-slate-700 block">{formatDate(activeProject.updatedAt)}</span>
                </div>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100/55 text-slate-600">
                <User size={12} className="text-rose-400" />
                <span className="font-semibold text-slate-500">Owner:</span>
                <span className="font-mono text-slate-800 font-medium truncate flex-1">phonghoc3.nvx@gmail.com</span>
              </div>
            </div>
          )}
        </div>

        {/* 2. TAGS SECTION */}
        <div className="bg-white">
          {renderSectionHeader('tags', 'Tags', <Tag size={14} />, activeProject.tags?.length || 0)}
          {sections.tags && (
            <div className="p-3.5 space-y-3">
              {/* Tag Badges list */}
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags && activeProject.tags.length > 0 ? (
                  activeProject.tags.map((tg) => (
                    <span 
                      key={tg} 
                      className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-100/60 flex items-center gap-1 group"
                    >
                      <span>{tg}</span>
                      <button 
                        onClick={() => handleRemoveTag(tg)}
                        className="text-slate-400 hover:text-rose-600 transition-colors leading-none"
                        title="Delete tag"
                      >
                        &times;
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[10px] py-1">Chưa gắn thẻ tag nào cho dự án</span>
                )}
              </div>

              {/* Tag Quick Preset Add */}
              <div>
                <label className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Quick presets</label>
                <div className="flex flex-wrap gap-1 max-h-[50px] overflow-y-auto pr-1">
                  {PRESET_TAGS.filter(t => !activeProject.tags?.includes(t)).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleAddTag(t)}
                      className="bg-slate-50 text-slate-600 text-[9px] font-medium px-1.5 py-0.2 rounded hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all border border-slate-200/50"
                    >
                      + {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Input */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Thêm tag tự do..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(newTagInput);
                    }
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] focus:border-rose-400 focus:outline-none"
                />
                <button
                  onClick={() => handleAddTag(newTagInput)}
                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-2.5 flex items-center justify-center transition-colors shadow-xs"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. AI CONTEXT SECTION */}
        <div className="bg-white">
          {renderSectionHeader('aiContext', 'AI Context', <Sparkles size={14} />)}
          {sections.aiContext && (
            <div className="p-3.5 space-y-3 text-[11px]">
              <p className="text-[10px] text-slate-400 italic">Configure tone of voice & generation settings directly. No more black box AI.</p>
              
              {/* Style */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Writing Style</label>
                <select
                  value={aiContext.style}
                  onChange={(e) => handleUpdateAIContext('style', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:border-rose-400 focus:outline-none"
                >
                  <option value="Formal">Formal (Trang trọng)</option>
                  <option value="Casual">Casual (Thân mật)</option>
                  <option value="Poetic">Poetic (Thơ mộng)</option>
                  <option value="Humorous">Humorous (Hài hước)</option>
                  <option value="Academic">Academic (Học thuật)</option>
                </select>
              </div>

              {/* Audience */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Audience</label>
                <select
                  value={aiContext.audience}
                  onChange={(e) => handleUpdateAIContext('audience', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:border-rose-400 focus:outline-none"
                >
                  <option value="Teacher">Teacher (Thầy cô)</option>
                  <option value="Parent">Parent (Cha mẹ)</option>
                  <option value="Friend">Friend (Bạn bè)</option>
                  <option value="Lover">Lover (Người yêu)</option>
                  <option value="Colleague">Colleague (Đồng nghiệp)</option>
                </select>
              </div>

              {/* Emotion */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Emotion</label>
                <select
                  value={aiContext.emotion}
                  onChange={(e) => handleUpdateAIContext('emotion', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:border-rose-400 focus:outline-none"
                >
                  <option value="Respect">Respect (Tôn kính)</option>
                  <option value="Respectful">Respectful (Kính trọng)</option>
                  <option value="Deep">Deep (Sâu lắng)</option>
                  <option value="Warm">Warm (Ấm áp)</option>
                  <option value="Playful">Playful (Tinh nghịch)</option>
                  <option value="Emotional">Emotional (Cảm động)</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Language</label>
                <select
                  value={aiContext.language}
                  onChange={(e) => handleUpdateAIContext('language', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:border-rose-400 focus:outline-none"
                >
                  <option value="Vietnamese">Vietnamese (Tiếng Việt)</option>
                  <option value="English">English (Tiếng Anh)</option>
                  <option value="Bilingual">Bilingual (Song ngữ)</option>
                </select>
              </div>

              {/* Length */}
              <div>
                <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Length</label>
                <select
                  value={aiContext.length}
                  onChange={(e) => handleUpdateAIContext('length', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-medium focus:border-rose-400 focus:outline-none"
                >
                  <option value="Short">Short (Ngắn gọn)</option>
                  <option value="Medium">Medium (Trung bình)</option>
                  <option value="Long">Long (Chi tiết)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 4. MEMORY SOURCES SECTION */}
        <div className="bg-white">
          {renderSectionHeader('memories', 'Memory Sources Used', <BrainCircuit size={14} />, enabledMemoryIds.length)}
          {sections.memories && (
            <div className="p-3.5 space-y-2.5 text-[11px]">
              <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">
                <span>Select active memories</span>
                <div className="flex gap-2">
                  <button onClick={() => handleToggleAllMemories(true)} className="text-rose-600 hover:underline">All</button>
                  <span>•</span>
                  <button onClick={() => handleToggleAllMemories(false)} className="text-slate-500 hover:underline">None</button>
                </div>
              </div>

              {/* Memory checkboxes list */}
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {allMemories.length > 0 ? (
                  allMemories.map((m) => {
                    const isChecked = enabledMemoryIds.includes(m.id);
                    return (
                      <div 
                        key={m.id}
                        onClick={() => handleToggleMemory(m.id)}
                        className={`flex items-start gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-rose-50/50 border-rose-200' 
                            : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // Handle on parent div click
                          className="mt-0.5 accent-rose-600 pointer-events-none"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-bold block truncate text-[11px] ${isChecked ? 'text-rose-950' : 'text-slate-600'}`}>
                              {m.title}
                            </span>
                            <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded uppercase shrink-0">
                              {m.type}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 block truncate">{m.date} | {m.location}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-slate-400 italic">No memories discovered yet</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 5. WORKFLOW STATUS SECTION */}
        <div className="bg-white">
          {renderSectionHeader('workflow', 'Workflow Pipeline', <Milestone size={14} />)}
          {sections.workflow && (
            <div className="p-3.5 space-y-3 text-[11px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Step status & trigger</span>
                <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded font-bold">
                  Progress: {activeProject.progress || 0}%
                </span>
              </div>

              {/* Steps visual track */}
              <div className="space-y-2">
                {[
                  { key: 'planning', label: '1. Planning', desc: 'Sắp xếp dàn ý câu chuyện' },
                  { key: 'writing', label: '2. Writing', desc: 'Soạn thảo văn thơ tự động' },
                  { key: 'images', label: '3. Images', desc: 'Tạo hình ảnh minh họa' },
                  { key: 'reflection', label: '4. Reflection', desc: 'Tinh chỉnh cảm xúc' },
                  { key: 'export', label: '5. Export', desc: 'Xuất thiệp & Đồng bộ' },
                ].map((step) => {
                  const status = workflowStatus[step.key] || 'Pending';
                  const isRunning = isRunningStep === step.key || status === 'Running';
                  
                  return (
                    <div 
                      key={step.key}
                      className="bg-slate-50/70 border border-slate-100/80 rounded-xl p-2 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800 text-[11px]">{step.label}</span>
                          <span className={`text-[8px] px-1 rounded-sm font-bold tracking-wider shrink-0 uppercase ${
                            status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            status === 'Running' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-200 text-slate-500'
                          }`}>
                            {status}
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-400 block">{step.desc}</span>
                      </div>

                      <button
                        onClick={() => handleSimulateWorkflowStep(step.key)}
                        disabled={isRunning}
                        className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                          isRunning 
                            ? 'bg-purple-50 border-purple-200 text-purple-600 cursor-not-allowed'
                            : status === 'Completed'
                              ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-100 text-emerald-600'
                              : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500'
                        }`}
                        title="Chạy bước này"
                      >
                        {isRunning ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : status === 'Completed' ? (
                          <Check size={12} />
                        ) : (
                          <Play size={12} />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 6. VERSION HISTORY SECTION */}
        <div className="bg-white">
          {renderSectionHeader('versions', 'Version History', <History size={14} />, versions.length)}
          {sections.versions && (
            <div className="p-3.5 space-y-2.5 text-[11px]">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                <span>Select a version to restore</span>
              </div>

              {/* Version History items */}
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {versions.length > 0 ? (
                  versions.map((ver) => (
                    <div 
                      key={ver.id}
                      className="bg-slate-50/60 hover:bg-rose-50/20 border border-slate-100/80 hover:border-rose-100 rounded-xl p-2.5 flex items-start justify-between gap-1.5 transition-all"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-bold text-slate-800 text-[11px]">v{ver.versionNumber}</span>
                          <span className="text-[8px] bg-slate-200/60 text-slate-500 px-1 rounded-sm capitalize">
                            {ver.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 truncate max-w-[170px]">{ver.summary}</p>
                        <span className="text-[9px] text-slate-400 block font-mono">
                          {new Date(ver.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRestoreVersion(ver)}
                        className="bg-white hover:bg-rose-600 text-slate-500 hover:text-white p-1.5 rounded-lg border border-slate-200 hover:border-rose-600 transition-all flex items-center justify-center shrink-0"
                        title="Khôi phục phiên bản này"
                      >
                        <RotateCcw size={11} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-400 italic">No historical snapshots yet</div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
