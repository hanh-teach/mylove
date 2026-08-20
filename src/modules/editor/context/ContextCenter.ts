import { EditorContextState, RelationshipProfile, TimelineMilestone } from './ContextTypes';
import { buildInitialContext, computeCompleteness } from './ContextBuilder';
import { ContextEvents, CONTEXT_EVENTS } from './ContextEvents';
import { IMemory } from '../../../modules/memory/MemoryTypes';
import { NoteDocument } from '../../../components/editor/DocumentModel';
import { projectService } from '../../../modules/workspace/ProjectService';
import { relationshipService } from '../../../modules/relationship/RelationshipService';
import { timelineStore } from '../../../modules/timeline/TimelineStore';
import { MemoryService } from '../../../modules/memory/MemoryService';
import { ToastService } from '../../../modules/ui/ToastService';

class ContextCenterClass {
  private state: EditorContextState = buildInitialContext();

  constructor() {
    setTimeout(() => {
      try {
        projectService.subscribe(() => {
          this.syncWithActiveProject();
        });
        this.syncWithActiveProject();
      } catch (err) {
        console.warn('ContextCenter constructor delay error:', err);
      }
    }, 100);
  }

  getState(): EditorContextState {
    return { ...this.state };
  }

  syncWithActiveProject() {
    try {
      const activeProject = projectService.getActiveProject();
      if (!activeProject) return;

      const title = activeProject.title || '';
      const message = activeProject.content?.message || '';

      let partnerName = '';
      let userName = localStorage.getItem('lovenote_user_name') || 'Bạn';
      let nickname = '';

      if (activeProject.metadata?.partnerName) {
        partnerName = activeProject.metadata.partnerName;
      }
      if (activeProject.metadata?.userName) {
        userName = activeProject.metadata.userName;
      }
      if (activeProject.metadata?.nickname) {
        nickname = activeProject.metadata.nickname;
      }

      if (!partnerName) {
        const greetings = [
          /kính gửi\s+([^,\n\.\!\?]+)/i,
          /thương gửi\s+([^,\n\.\!\?]+)/i,
          /thân gửi\s+([^,\n\.\!\?]+)/i,
          /thân yêu gửi\s+([^,\n\.\!\?]+)/i,
          /gửi\s+([^,\n\.\!\?]+)/i,
          /dành cho\s+([^,\n\.\!\?]+)/i,
          /dear\s+([^,\n\.\!\?]+)/i,
          /to:\s+([^,\n\.\!\?]+)/i
        ];

        for (const regex of greetings) {
          const match = message.match(regex);
          if (match && match[1]) {
            const nameCandidate = match[1].trim();
            if (nameCandidate.length > 0 && nameCandidate.length < 40) {
              partnerName = nameCandidate;
              break;
            }
          }
        }
      }

      if (!partnerName) {
        const coupleMatch = title.match(/([^\s&]+)\s*&\s*([^\s&]+)/);
        if (coupleMatch) {
          userName = coupleMatch[1].trim();
          partnerName = coupleMatch[2].trim();
        }
      }

      if (!partnerName) {
        const people = relationshipService.getPeople();
        if (people && people.length > 0) {
          partnerName = people[0].name;
          nickname = people[0].role || 'Người thương';
        } else {
          partnerName = 'Người thương';
          nickname = 'Bé Heo';
        }
      }

      if (!nickname) {
        nickname = 'Người thương';
      }

      const anniversaryDate = activeProject.metadata?.anniversary || 
        new Date(activeProject.createdAt).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

      const relationship: RelationshipProfile = {
        partnerName,
        userName,
        nickname,
        anniversary: anniversaryDate,
        favoriteFlower: activeProject.metadata?.favoriteFlower || 'Hoa hồng',
        isConfigured: true
      };

      const pTimeline = timelineStore.getOrCreateTimeline(activeProject.id, activeProject.title, activeProject.template);
      const steps = timelineStore.getTimelineItems(pTimeline.id);
      const activeStep = steps.find(s => !s.completed) || steps[steps.length - 1] || null;

      let timelineMilestone: TimelineMilestone | null = null;
      if (activeStep) {
        timelineMilestone = {
          id: activeStep.id,
          title: activeStep.title,
          date: activeStep.updatedAt ? new Date(activeStep.updatedAt).toLocaleDateString('vi-VN') : anniversaryDate,
          location: activeProject.metadata?.location || 'Studio',
          category: 'Milestone'
        };
      }

      const mood = activeProject.content?.textColor === '#f43f5e' || activeProject.content?.textColor === '#be123c' ? 'romantic' : 'warm';
      const occasion = activeProject.category || 'Kỷ niệm';

      const attachedImages = activeProject.content?.placedItems?.filter((item: any) => item.type === 'image').map((item: any) => item.url) || [];
      const attachedMusic = activeProject.content?.musicTrack ? [activeProject.content.musicTrack.title || 'Music'] : [];

      const allMemories = MemoryService.getMemories();
      const enabledIds = activeProject.metadata?.enabledMemoryIds || [];
      const selectedMemories = allMemories.filter(m => enabledIds.includes(m.id));
      const selectedMemory = selectedMemories.length > 0 ? selectedMemories[0] : null;

      this.state = {
        ...this.state,
        relationship,
        timeline: timelineMilestone,
        mood,
        occasion,
        attachedImages,
        attachedMusic,
        selectedMemory,
        memories: selectedMemories
      };

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
    } catch (err) {
      console.warn('Failed to sync active project in ContextCenter:', err);
    }
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
    this.syncWithActiveProject();
    ToastService.success("Đã đồng bộ thông tin ngữ cảnh thực tế từ tấm thiệp!");
  }
}

export const ContextCenter = new ContextCenterClass();
