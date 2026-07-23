import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NoteDocument, NoteBlock, BlockType, DocumentModel } from './DocumentModel';
import { DocumentHistory } from './DocumentHistory';
import { AIWritingPanel } from '../../modules/editor/assistant/AIWritingPanel';
import { RichToolbar } from './toolbar/RichToolbar';
import { FloatingToolbar } from './toolbar/FloatingToolbar';
import { MemoryPanel, MemoryChip } from '../../modules/editor/memory';
import { WorkflowSidebar } from '../../modules/editor/workflow';
import { EditorContextProvider } from '../../modules/editor/context';
import { IMemory } from '../../modules/memory/MemoryTypes';
import { 
  DraftStorage, VersionManager, RecoveryService, SaveStatus, VersionHistoryPanel, DraftRecoveryModal 
} from '../../modules/editor/autosave';
import { 
  Plus, Trash2, Sparkles, Wand2, Clock, CheckCircle2, RefreshCw, FileText, ChevronUp, ChevronDown, X, History, Heart, Layers, BookOpen 
} from 'lucide-react';

interface RichTextEditorProps {
  initialDocument?: NoteDocument;
  onOpenAIAssistant?: () => void;
  onSyncToCard?: (title: string, fullContent: string) => void;
}

const RichTextEditorContent: React.FC<RichTextEditorProps> = ({
  initialDocument,
  onOpenAIAssistant,
  onSyncToCard,
}) => {
  const [doc, setDoc] = useState<NoteDocument>(() => {
    return initialDocument || DocumentModel.createDefaultDocument();
  });

  const historyRef = useRef<DocumentHistory>(new DocumentHistory(doc));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved' | 'error'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [recoveredDraft, setRecoveredDraft] = useState<{ document: NoteDocument; timestamp: number } | null>(null);
  const [selectedMemoryForAI, setSelectedMemoryForAI] = useState<IMemory | null>(null);
  const [isMemoryPanelOpen, setIsMemoryPanelOpen] = useState(true);
  const [isMobileMemoryDrawerOpen, setIsMobileMemoryDrawerOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(true);
  const [isMobileWorkflowDrawerOpen, setIsMobileWorkflowDrawerOpen] = useState(false);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const versionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update history and autosave when doc changes
  const updateDocument = useCallback((newDoc: NoteDocument, recordHistory = true) => {
    if (recordHistory) {
      historyRef.current.push(newDoc);
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
    }
    setDoc(newDoc);
    setSaveStatus('unsaved');

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // Auto save draft after 1000ms
    saveTimerRef.current = setTimeout(async () => {
      try {
        setSaveStatus('saving');
        await DraftStorage.saveDraft(newDoc);
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        setSaveStatus('error');
      }
    }, 1000);

    // Debounced automatic version snapshot every 2 minutes of changes
    if (!versionTimerRef.current) {
      versionTimerRef.current = setTimeout(async () => {
        try {
          await VersionManager.createVersion(newDoc, 'Automatic');
        } catch (e) {}
        versionTimerRef.current = null;
      }, 120000);
    }
  }, []);

  // Check for recovery draft on mount
  useEffect(() => {
    RecoveryService.checkForRecovery().then(draft => {
      if (draft && JSON.stringify(draft.document) !== JSON.stringify(doc)) {
        setRecoveredDraft(draft);
      }
    });
  }, []);

  // Listen to external version restores (e.g. from the Right Inspector Sidebar)
  useEffect(() => {
    const handleRestoreEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ document: NoteDocument; versionNumber: number }>;
      if (customEvent.detail && customEvent.detail.document) {
        updateDocument(customEvent.detail.document);
        VersionManager.createVersion(customEvent.detail.document, 'Restored', `Restored from Version #${customEvent.detail.versionNumber}`);
      }
    };
    window.addEventListener('restore-version', handleRestoreEvent);
    return () => window.removeEventListener('restore-version', handleRestoreEvent);
  }, [updateDocument]);

  // Keyboard undo/redo shortcuts & formatting shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
          e.preventDefault();
          handleRedo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
          e.preventDefault();
          handleToggleFormat('bold');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
          e.preventDefault();
          handleToggleFormat('italic');
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
          e.preventDefault();
          handleToggleFormat('underline');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, doc]);

  const handleUndo = () => {
    const prev = historyRef.current.undo();
    if (prev) {
      setDoc(prev);
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
    }
  };

  const handleRedo = () => {
    const next = historyRef.current.redo();
    if (next) {
      setDoc(next);
      setCanUndo(historyRef.current.canUndo());
      setCanRedo(historyRef.current.canRedo());
    }
  };

  // Block handlers
  const handleTitleChange = (newTitle: string) => {
    const updated = { ...doc, title: newTitle, updatedAt: Date.now() };
    updateDocument(updated);
  };

  const handleBlockContentChange = (id: string, content: string) => {
    const blocks = doc.blocks.map((b) => (b.id === id ? { ...b, content } : b));
    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated, false);
  };

  const handleBlockBlur = () => {
    historyRef.current.push(doc);
    setCanUndo(historyRef.current.canUndo());
    setCanRedo(historyRef.current.canRedo());
  };

  const addBlock = (type: BlockType, afterIndex?: number) => {
    const newBlock: NoteBlock = {
      id: 'block_' + Date.now(),
      type,
      content: type === 'divider' ? '---' : type === 'heading' ? 'Tiêu đề mới' : type === 'checklist' ? '☐ Việc cần làm' : '',
    };

    const blocks = [...doc.blocks];
    if (typeof afterIndex === 'number') {
      blocks.splice(afterIndex + 1, 0, newBlock);
    } else {
      blocks.push(newBlock);
    }

    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated);
    setSelectedBlockId(newBlock.id);
  };

  const removeBlock = (id: string) => {
    if (doc.blocks.length <= 1) return;
    const blocks = doc.blocks.filter((b) => b.id !== id);
    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= doc.blocks.length) return;
    const blocks = [...doc.blocks];
    const temp = blocks[index];
    blocks[index] = blocks[targetIdx];
    blocks[targetIdx] = temp;
    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated);
  };

  const toggleBlockType = (id: string, type: BlockType) => {
    const blocks = doc.blocks.map((b) => (b.id === id ? { ...b, type } : b));
    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated);
  };

  // Rich Formatting handlers
  const handleToggleFormat = (format: 'bold' | 'italic' | 'underline') => {
    if (!selectedBlockId) return;
    const block = doc.blocks.find(b => b.id === selectedBlockId);
    if (!block) return;

    let decorated = block.content;
    if (format === 'bold') decorated = `**${block.content}**`;
    if (format === 'italic') decorated = `*${block.content}*`;
    if (format === 'underline') decorated = `__${block.content}__`;

    handleBlockContentChange(selectedBlockId, decorated);
  };

  const handleSetBlockType = (type: BlockType, level?: number) => {
    if (!selectedBlockId) {
      addBlock(type);
      return;
    }
    const blocks = doc.blocks.map(b => b.id === selectedBlockId ? { ...b, type } : b);
    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated);
  };

  const handleAddList = (listType: 'bullet' | 'number' | 'checklist') => {
    const prefix = listType === 'bullet' ? '• ' : listType === 'number' ? '1. ' : '☐ ';
    const newBlock: NoteBlock = {
      id: 'block_' + Date.now(),
      type: listType === 'checklist' ? 'checklist' : 'paragraph',
      content: prefix + 'Mục mới...',
    };
    const updated = { ...doc, blocks: [...doc.blocks, newBlock], updatedAt: Date.now() };
    updateDocument(updated);
    setSelectedBlockId(newBlock.id);
  };

  const handleInsertEmoji = (emoji: string) => {
    if (selectedBlockId) {
      const block = doc.blocks.find(b => b.id === selectedBlockId);
      if (block) {
        handleBlockContentChange(selectedBlockId, block.content + ' ' + emoji);
      }
    } else {
      addBlock('paragraph');
    }
  };

  const handleInsertSticker = (sticker: string) => {
    if (selectedBlockId) {
      const block = doc.blocks.find(b => b.id === selectedBlockId);
      if (block) {
        handleBlockContentChange(selectedBlockId, block.content + ` [${sticker}]`);
      }
    } else {
      addBlock('paragraph');
    }
  };

  const handleInsertImage = () => {
    const newBlock: NoteBlock = {
      id: 'block_' + Date.now(),
      type: 'image',
      content: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
    };
    const updated = { ...doc, blocks: [...doc.blocks, newBlock], updatedAt: Date.now() };
    updateDocument(updated);
  };

  const handleInsertMemory = (memory: IMemory) => {
    const newBlock: NoteBlock = {
      id: 'block_' + Date.now(),
      type: memory.type === 'image' ? 'image' : 'paragraph',
      content: memory.coverImage || memory.content || memory.title,
    };
    const updated = { ...doc, blocks: [...doc.blocks, newBlock], updatedAt: Date.now() };
    updateDocument(updated);
    setSelectedMemoryForAI(memory);
  };

  // Get selected text for AI assistant
  const getSelectedText = () => {
    if (selectedBlockId) {
      const b = doc.blocks.find(x => x.id === selectedBlockId);
      if (b) return b.content;
    }
    return doc.blocks[0]?.content || '';
  };

  const handleReplaceSelection = (newText: string) => {
    if (selectedBlockId) {
      const blocks = doc.blocks.map(b => b.id === selectedBlockId ? { ...b, content: newText } : b);
      const updated = { ...doc, blocks, updatedAt: Date.now() };
      updateDocument(updated);
    } else if (doc.blocks.length > 0) {
      const blocks = [...doc.blocks];
      blocks[0].content = newText;
      const updated = { ...doc, blocks, updatedAt: Date.now() };
      updateDocument(updated);
    }
  };

  const handleInsertBelow = (newText: string) => {
    const targetIdx = selectedBlockId ? doc.blocks.findIndex(b => b.id === selectedBlockId) : 0;
    const newBlock: NoteBlock = {
      id: 'block_' + Date.now(),
      type: 'paragraph',
      content: newText,
    };
    const blocks = [...doc.blocks];
    blocks.splice(targetIdx >= 0 ? targetIdx + 1 : blocks.length, 0, newBlock);
    const updated = { ...doc, blocks, updatedAt: Date.now() };
    updateDocument(updated);
  };

  // Statistics calculation
  const fullText = doc.blocks.map((b) => b.content).join(' ');
  const wordCount = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
  const charCount = fullText.length;
  const paragraphCount = doc.blocks.filter((b) => b.type === 'paragraph' || b.type === 'heading').length;
  const readingTime = Math.ceil(wordCount / 200) || 1;

  const handleSync = () => {
    if (onSyncToCard) {
      onSyncToCard(doc.title, fullText);
    }
  };

  return (
    <div className="w-full max-w-[1300px] mx-auto flex flex-col lg:flex-row gap-6 items-start relative my-6 px-4">
      {/* Main Editor Column */}
      <div className="flex-1 w-full bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 flex flex-col relative overflow-hidden">
        
        {/* Floating Toolbar when text is selected / block is active */}
        {selectedBlockId && (
          <FloatingToolbar
            onToggleFormat={handleToggleFormat}
            onOpenAI={() => setIsAIPanelOpen(true)}
            onInsertHeart={() => handleInsertEmoji('❤️')}
          />
        )}

        {/* Rich Toolbar & Dock Panels Bar (Sprint 57A) */}
        <div className="flex flex-col bg-rose-50/70 border-b border-rose-100">
          <div className="flex items-center justify-between">
            <div className="flex-1 overflow-x-auto">
              <RichToolbar
                onToggleFormat={handleToggleFormat}
                onSetBlockType={handleSetBlockType}
                onAddList={handleAddList}
                onInsertEmoji={handleInsertEmoji}
                onInsertSticker={handleInsertSticker}
                onInsertImage={handleInsertImage}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
                onOpenAI={() => setIsAIPanelOpen(!isAIPanelOpen)}
              />
            </div>
            <div className="px-3 flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsVersionHistoryOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all min-h-[36px]"
                title="Version History"
              >
                <History size={14} />
                <span className="hidden sm:inline">History</span>
              </button>
            </div>
          </div>

          {/* Dock Layout Panels Control Bar */}
          <div className="bg-slate-100/90 border-t border-rose-100/60 px-4 py-1.5 flex items-center justify-between text-xs text-slate-600 gap-2 overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers size={13} /> View Panels:
              </span>
              <button
                onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                  isAIPanelOpen ? 'bg-rose-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sparkles size={12} /> AI Writer {isAIPanelOpen ? '✓' : ''}
              </button>
              <button
                onClick={() => setIsMemoryPanelOpen(!isMemoryPanelOpen)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                  isMemoryPanelOpen ? 'bg-pink-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <BookOpen size={12} /> Memory Collection {isMemoryPanelOpen ? '✓' : ''}
              </button>
              <button
                onClick={() => setIsWorkflowOpen(!isWorkflowOpen)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                  isWorkflowOpen ? 'bg-purple-600 text-white shadow-2xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Wand2 size={12} /> Workflow {isWorkflowOpen ? '✓' : ''}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 hidden md:inline">Click panel × or buttons above to dock/undock</span>
          </div>
        </div>

        {/* 2. Editor Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-4">
          {/* Document Title */}
          <div className="mb-2">
            <input
              type="text"
              value={doc.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Tiêu đề bài viết..."
              className="w-full text-2xl sm:text-3xl font-bold font-serif text-rose-950 placeholder:text-rose-300 bg-transparent border-b border-rose-200 pb-2 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          {/* Blocks List */}
          <div className="space-y-3">
            {doc.blocks.map((block, index) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`group relative rounded-xl transition-all border p-3 ${
                    isSelected ? 'border-rose-500 bg-rose-50/30 shadow-xs' : 'border-transparent hover:border-rose-200 bg-white'
                  }`}
                >
                  {/* Block Actions Toolbar on Hover/Select */}
                  <div className="absolute right-2 -top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-rose-200 rounded-lg shadow-sm px-1.5 py-0.5 flex items-center gap-1 z-10">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-rose-50 rounded text-slate-600 disabled:opacity-30"
                      title="Chuyển lên"
                    >
                      <ChevronUp size={13} />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === doc.blocks.length - 1}
                      className="p-1 hover:bg-rose-50 rounded text-slate-600 disabled:opacity-30"
                      title="Chuyển xuống"
                    >
                      <ChevronDown size={13} />
                    </button>
                    <div className="h-3 w-[1px] bg-rose-200"></div>
                    <button
                      onClick={() => toggleBlockType(block.id, block.type === 'heading' ? 'paragraph' : 'heading')}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
                    >
                      {block.type === 'heading' ? 'P' : 'H1'}
                    </button>
                    <button
                      onClick={() => removeBlock(block.id)}
                      disabled={doc.blocks.length <= 1}
                      className="p-1 hover:bg-rose-100 rounded text-rose-600 disabled:opacity-30"
                      title="Xóa block"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* AI Block Action bar */}
                  <div className="absolute left-2 -bottom-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-rose-200 rounded-lg shadow-xs px-2 py-0.5 flex items-center gap-2 text-[10px] font-semibold text-rose-600 z-10">
                    <span 
                      className="flex items-center gap-1 cursor-pointer hover:text-rose-800" 
                      onClick={() => {
                        setSelectedBlockId(block.id);
                        setIsAIPanelOpen(true);
                      }}
                    >
                      <Sparkles size={11} /> ✨ Improve
                    </span>
                    <span className="text-slate-300">|</span>
                    <span 
                      className="flex items-center gap-1 cursor-pointer hover:text-rose-800" 
                      onClick={() => {
                        setSelectedBlockId(block.id);
                        setIsAIPanelOpen(true);
                      }}
                    >
                      ✨ Rewrite
                    </span>
                  </div>

                  {/* Render Block Content */}
                  {block.type === 'divider' ? (
                    <div className="py-2 flex items-center justify-center">
                      <div className="w-24 h-1 bg-rose-200 rounded-full"></div>
                    </div>
                  ) : block.type === 'image' ? (
                    <div className="relative rounded-xl overflow-hidden border border-rose-200 my-2 shadow-sm">
                      <img src={block.content} alt="Love Note Photo" className="w-full h-48 object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">Ảnh kỷ niệm</div>
                    </div>
                  ) : block.type === 'heading' ? (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      onBlur={handleBlockBlur}
                      placeholder="Tiêu đề đoạn..."
                      className="w-full text-xl font-bold font-serif text-rose-900 bg-transparent focus:outline-none placeholder:text-rose-300"
                    />
                  ) : block.type === 'quote' ? (
                    <textarea
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      onBlur={handleBlockBlur}
                      placeholder="Nhập câu trích dẫn..."
                      rows={2}
                      className="w-full font-serif italic text-rose-800 bg-rose-50/50 p-3 rounded-lg border-l-4 border-rose-400 focus:outline-none resize-none"
                    />
                  ) : block.type === 'checklist' ? (
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4 text-rose-600 rounded border-rose-300 focus:ring-rose-500" />
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                        onBlur={handleBlockBlur}
                        className="w-full font-serif text-slate-800 bg-transparent focus:outline-none text-base"
                      />
                    </div>
                  ) : (
                    <textarea
                      value={block.content}
                      onChange={(e) => handleBlockContentChange(block.id, e.target.value)}
                      onBlur={handleBlockBlur}
                      placeholder="Viết nội dung đoạn văn..."
                      rows={Math.max(2, block.content.split('\n').length)}
                      className="w-full font-serif text-slate-800 bg-transparent focus:outline-none leading-relaxed resize-none placeholder:text-rose-300 text-base"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Add block footer button */}
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => addBlock('paragraph')}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center gap-1.5 shadow-xs min-h-[40px]"
            >
              <Plus size={15} />
              <span>Đoạn văn</span>
            </button>
            <button
              onClick={() => handleAddList('checklist')}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center gap-1.5 shadow-xs min-h-[40px]"
            >
              <Plus size={15} />
              <span>Checklist</span>
            </button>
            <button
              onClick={handleInsertImage}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all flex items-center gap-1.5 shadow-xs min-h-[40px]"
            >
              <Plus size={15} />
              <span>Ảnh</span>
            </button>
          </div>
        </div>

        {/* 3. Status Bar */}
        <div className="bg-slate-50 border-t border-rose-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <FileText size={14} className="text-rose-500" />
              <span>Words: <strong className="text-slate-800 font-bold">{wordCount}</strong></span>
            </div>
            <div>
              <span>Chars: <strong className="text-slate-800 font-bold">{charCount}</strong></span>
            </div>
            <div>
              <span>Paragraphs: <strong className="text-slate-800 font-bold">{paragraphCount}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-rose-500" />
              <span>Reading: <strong className="text-slate-800 font-bold">{readingTime} phút</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SaveStatus
              status={saveStatus}
              lastSavedTime={lastSavedTime}
              onRetry={async () => {
                try {
                  setSaveStatus('saving');
                  await DraftStorage.saveDraft(doc);
                  setSaveStatus('saved');
                } catch (e) {
                  setSaveStatus('error');
                }
              }}
            />

            {onSyncToCard && (
              <button
                onClick={handleSync}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all min-h-[36px]"
              >
                Áp dụng lên Thiệp
              </button>
            )}
          </div>
        </div>
      </div>

      {/* AI Writing Assistant Side Panel */}
      {isAIPanelOpen && (
        <div className="w-full lg:w-[360px] shrink-0 sticky top-4 z-30">
          <AIWritingPanel
            selectedText={getSelectedText()}
            onReplaceSelection={handleReplaceSelection}
            onInsertBelow={handleInsertBelow}
            selectedMemory={selectedMemoryForAI}
            onClearMemory={() => setSelectedMemoryForAI(null)}
            onClose={() => setIsAIPanelOpen(false)}
          />
        </div>
      )}

      {/* Memory Panel Sidebar (Desktop) */}
      {isMemoryPanelOpen && (
        <div className="hidden lg:block w-[320px] shrink-0 sticky top-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 overflow-hidden h-[calc(100vh-80px)]">
          <MemoryPanel
            onInsertMemory={handleInsertMemory}
            onSelectForAI={setSelectedMemoryForAI}
            selectedMemoryForAI={selectedMemoryForAI}
            onClose={() => setIsMemoryPanelOpen(false)}
          />
        </div>
      )}

      {/* Workflow Sidebar (Desktop) */}
      {isWorkflowOpen && (
        <div className="hidden xl:block w-[340px] shrink-0 sticky top-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-rose-100 overflow-hidden h-[calc(100vh-80px)]">
          <WorkflowSidebar onClose={() => setIsWorkflowOpen(false)} />
        </div>
      )}

      {/* Mobile Memory / Workflow Toggles */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40 flex flex-col gap-2">
        <button
          onClick={() => setIsMobileWorkflowDrawerOpen(true)}
          className="px-4 py-3 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-xl flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Workflow</span>
        </button>
        <button
          onClick={() => setIsMobileMemoryDrawerOpen(true)}
          className="px-4 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xl flex items-center gap-2"
        >
          <Heart size={16} fill="currentColor" />
          <span>Memories</span>
        </button>
      </div>

      {/* Mobile Workflow Drawer */}
      {isMobileWorkflowDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center xl:hidden animate-fadeIn">
          <WorkflowSidebar onClose={() => setIsMobileWorkflowDrawerOpen(false)} isMobileDrawer={true} />
        </div>
      )}

      {/* Mobile Memory Drawer */}
      {isMobileMemoryDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-end justify-center lg:hidden animate-fadeIn">
          <div className="w-full bg-white rounded-t-3xl overflow-hidden max-h-[85vh] flex flex-col">
            <MemoryPanel
              onInsertMemory={handleInsertMemory}
              onSelectForAI={setSelectedMemoryForAI}
              selectedMemoryForAI={selectedMemoryForAI}
              onClose={() => setIsMobileMemoryDrawerOpen(false)}
              isMobileDrawer={true}
            />
          </div>
        </div>
      )}

      {/* Version History Panel */}
      {isVersionHistoryOpen && (
        <VersionHistoryPanel
          currentDoc={doc}
          onRestore={async (restoredDoc, versionNum) => {
            updateDocument(restoredDoc);
            await VersionManager.createVersion(restoredDoc, 'Restored', `Restored from Version #${versionNum}`);
            setIsVersionHistoryOpen(false);
          }}
          onClose={() => setIsVersionHistoryOpen(false)}
        />
      )}

      {/* Draft Recovery Modal */}
      {recoveredDraft && (
        <DraftRecoveryModal
          draft={recoveredDraft}
          onRestore={async () => {
            setDoc(recoveredDraft.document);
            updateDocument(recoveredDraft.document, false);
            await VersionManager.createVersion(recoveredDraft.document, 'Recovered Draft', 'Recovered from unsaved session draft');
            setRecoveredDraft(null);
            await RecoveryService.clearRecovery();
          }}
          onDiscard={async () => {
            setRecoveredDraft(null);
            await RecoveryService.clearRecovery();
          }}
        />
      )}
    </div>
  );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = (props) => {
  return (
    <EditorContextProvider>
      <RichTextEditorContent {...props} />
    </EditorContextProvider>
  );
};



