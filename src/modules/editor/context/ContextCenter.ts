import { EditorContextState, RelationshipProfile, TimelineMilestone } from './ContextTypes';
import { buildInitialContext, computeCompleteness } from './ContextBuilder';
import { ContextEvents, CONTEXT_EVENTS } from './ContextEvents';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { NoteDocument } from '../../../components/editor/DocumentModel';

class ContextCenterClass {
  private state: EditorContextState = buildInitialContext();

  getState(): EditorContextState {
    return { ...this.state };
  }

  updateState(updater: Partial<EditorContextState>) {
    this.state = { ...this.state, ...updater };
    
    // Recompute completeness score
    const { score, breakdown } = computeCompleteness(
      this.state.relationship,
      this.state.timeline,
      this.state.selectedMemory,
      this.state.mood,
      this.state.selectedText
    );
    this.state.completenessScore = score;
    this.state.completenessBreakdown = breakdown;

    ContextEvents.emit(CONTEXT_EVENTS.CONTEXT_UPDATED, this.state);
  }

  setRelationship(relationship: RelationshipProfile) {
    this.updateState({ relationship });
  }

  setTimeline(timeline: TimelineMilestone | null) {
    this.updateState({ timeline });
    ContextEvents.emit(CONTEXT_EVENTS.TIMELINE_CHANGED, timeline);
  }

  setSelectedMemory(memory: IMemory | null) {
    this.updateState({ selectedMemory: memory });
    ContextEvents.emit(CONTEXT_EVENTS.MEMORY_SELECTED, memory);
  }

  setSelectedText(text: string) {
    this.updateState({ selectedText: text });
    ContextEvents.emit(CONTEXT_EVENTS.SELECTION_CHANGED, text);
  }

  setMood(mood: string) {
    this.updateState({ mood });
    ContextEvents.emit(CONTEXT_EVENTS.MOOD_CHANGED, mood);
  }

  setDocument(document: NoteDocument | null) {
    this.updateState({ document });
    ContextEvents.emit(CONTEXT_EVENTS.DOCUMENT_CHANGED, document);
  }

  refreshContext() {
    // Trigger update broadcast
    this.updateState({});
  }
}

export const ContextCenter = new ContextCenterClass();
