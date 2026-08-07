import React, { createContext, useContext, useEffect, useState } from 'react';
import { EditorContextState, RelationshipProfile, TimelineMilestone } from './ContextTypes';
import { ContextCenter } from './ContextCenter';
import { ContextEvents, CONTEXT_EVENTS } from './ContextEvents';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { NoteDocument } from '../../../components/editor/DocumentModel';

interface ContextProviderValue {
  state: EditorContextState;
  setRelationship: (rel: RelationshipProfile) => void;
  setTimeline: (tm: TimelineMilestone | null) => void;
  setSelectedMemory: (memory: IMemory | null) => void;
  setSelectedText: (text: string) => void;
  setMood: (mood: string) => void;
  setDocument: (doc: NoteDocument | null) => void;
  refreshContext: () => void;
}

const EditorContextInstance = createContext<ContextProviderValue | undefined>(undefined);

export const EditorContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EditorContextState>(ContextCenter.getState());

  useEffect(() => {
    const unsubscribe = ContextEvents.on(CONTEXT_EVENTS.CONTEXT_UPDATED, (newState) => {
      setState({ ...newState });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const value: ContextProviderValue = {
    state,
    setRelationship: (rel) => ContextCenter.setRelationship(rel),
    setTimeline: (tm) => ContextCenter.setTimeline(tm),
    setSelectedMemory: (mem) => ContextCenter.setSelectedMemory(mem),
    setSelectedText: (txt) => ContextCenter.setSelectedText(txt),
    setMood: (mood) => ContextCenter.setMood(mood),
    setDocument: (doc) => ContextCenter.setDocument(doc),
    refreshContext: () => ContextCenter.refreshContext(),
  };

  return (
    <EditorContextInstance.Provider value={value}>
      {children}
    </EditorContextInstance.Provider>
  );
};

export const useEditorContext = (): ContextProviderValue => {
  const context = useContext(EditorContextInstance);
  if (!context) {
    throw new Error('useEditorContext must be used within an EditorContextProvider');
  }
  return context;
};
