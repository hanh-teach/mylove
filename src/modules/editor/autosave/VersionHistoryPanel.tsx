import React, { useState, useEffect } from 'react';
import { VersionMetadata } from './VersionDiff';
import { DraftStorage } from './DraftStorage';
import { RestoreDialog } from './RestoreDialog';
import { NoteDocument } from '../../../components/editor/DocumentModel';
import { History, X, RotateCcw, Trash2, Eye, Calendar, Sparkles } from 'lucide-react';

interface VersionHistoryPanelProps {
  currentDoc: NoteDocument;
  onRestore: (doc: NoteDocument, versionNumber: number) => void;
  onClose: () => void;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  currentDoc,
  onRestore,
  onClose,
}) => {
  const [versions, setVersions] = useState<VersionMetadata[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<VersionMetadata | null>(null);
  const [previewVersion, setPreviewVersion] = useState<VersionMetadata | null>(null);
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);

  useEffect(() => {
    loadVersions();
  }, []);

  const loadVersions = async () => {
    const list = await DraftStorage.getVersions();
    setVersions(list);
    if (list.length > 0 && !previewVersion) {
      setPreviewVersion(list[0]);
    }
  };

  const handleDeleteVersion = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await DraftStorage.deleteVersion(id);
    await loadVersions();
    if (previewVersion?.id === id) {
      setPreviewVersion(versions.length > 1 ? versions[0] : null);
    }
  };

  // Group versions by Today / Yesterday / Earlier
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const todayList = versions.filter(v => new Date(v.timestamp).toDateString() === today);
  const yesterdayList = versions.filter(v => new Date(v.timestamp).toDateString() === yesterday);
  const earlierList = versions.filter(v => {
    const d = new Date(v.timestamp).toDateString();
    return d !== today && d !== yesterday;
  });

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white/98 backdrop-blur-md shadow-2xl border-l border-rose-100 flex flex-col z-50 animate-slideLeft">
      {/* Header */}
      <div className="bg-rose-50/70 border-b border-rose-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-rose-900 font-serif font-bold text-lg">
          <History size={20} className="text-rose-600" />
          <span>Version History</span>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-rose-100/60 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Versions List */}
        <div className="w-full lg:w-1/2 border-r border-rose-100 overflow-y-auto p-4 space-y-4">
          {versions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No version history yet. Keep typing and versions will be saved automatically!
            </div>
          ) : (
            <>
              {todayList.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-2">Today</div>
                  <div className="space-y-2">
                    {todayList.map(v => (
                      <VersionItem 
                        key={v.id} 
                        version={v} 
                        isSelected={previewVersion?.id === v.id}
                        onSelect={() => setPreviewVersion(v)}
                        onDelete={(e) => handleDeleteVersion(v.id, e)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {yesterdayList.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-2 mt-4">Yesterday</div>
                  <div className="space-y-2">
                    {yesterdayList.map(v => (
                      <VersionItem 
                        key={v.id} 
                        version={v} 
                        isSelected={previewVersion?.id === v.id}
                        onSelect={() => setPreviewVersion(v)}
                        onDelete={(e) => handleDeleteVersion(v.id, e)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {earlierList.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-2 mt-4">Earlier</div>
                  <div className="space-y-2">
                    {earlierList.map(v => (
                      <VersionItem 
                        key={v.id} 
                        version={v} 
                        isSelected={previewVersion?.id === v.id}
                        onSelect={() => setPreviewVersion(v)}
                        onDelete={(e) => handleDeleteVersion(v.id, e)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Version Preview Pane */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-50/50 p-4 overflow-y-auto">
          {previewVersion ? (
            <div className="flex flex-col h-full justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200">
                  <span className="text-xs font-bold text-rose-900">Preview v{previewVersion.versionNumber}</span>
                  <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                    {previewVersion.type}
                  </span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100 shadow-xs space-y-3 font-serif">
                  <h3 className="text-base font-bold text-rose-950 border-b border-rose-100 pb-1">
                    {previewVersion.document.title || 'Untitled'}
                  </h3>
                  <div className="space-y-2 text-xs text-slate-700 max-h-[220px] overflow-y-auto pr-1">
                    {previewVersion.document.blocks.map(b => (
                      <p key={b.id} className="leading-relaxed">
                        {b.type === 'heading' ? <strong>{b.content}</strong> : b.content}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-[11px] text-slate-500 italic">
                  Summary: {previewVersion.summary}
                </div>
              </div>

              <div>
                <button
                  onClick={() => { setSelectedVersion(previewVersion); setIsRestoreOpen(true); }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 min-h-[40px]"
                >
                  <RotateCcw size={14} />
                  <span>Restore Version</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-400">
              Select a version to preview
            </div>
          )}
        </div>
      </div>

      {isRestoreOpen && selectedVersion && (
        <RestoreDialog
          version={selectedVersion}
          onConfirmRestore={() => {
            onRestore(selectedVersion.document, selectedVersion.versionNumber);
            setIsRestoreOpen(false);
            onClose();
          }}
          onClose={() => setIsRestoreOpen(false)}
        />
      )}
    </div>
  );
};

interface VersionItemProps {
  version: VersionMetadata;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const VersionItem: React.FC<VersionItemProps> = ({ version, isSelected, onSelect, onDelete }) => {
  const timeStr = new Date(version.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
        isSelected ? 'bg-rose-50 border-rose-500 shadow-xs' : 'bg-white border-rose-100 hover:border-rose-300'
      }`}
    >
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-950">v{version.versionNumber} ({timeStr})</span>
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded font-medium">
            {version.type}
          </span>
        </div>
        <p className="text-[11px] text-slate-600 truncate max-w-[200px]">{version.summary}</p>
      </div>
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-100 rounded-lg text-rose-500 transition-opacity"
        title="Delete version"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
};
