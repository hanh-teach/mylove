import { EditorContextState } from './ContextTypes';

export function formatContextAsJSON(state: EditorContextState): string {
  return JSON.stringify(
    {
      relationship: {
        partner: state.relationship.partnerName,
        user: state.relationship.userName,
        nickname: state.relationship.nickname,
        anniversary: state.relationship.anniversary,
        favoriteFlower: state.relationship.favoriteFlower,
      },
      timeline: state.timeline ? { title: state.timeline.title, date: state.timeline.date, location: state.timeline.location } : null,
      memory: state.selectedMemory ? { title: state.selectedMemory.title, category: state.selectedMemory.category, content: state.selectedMemory.content } : null,
      selection: state.selectedText ? `${state.selectedText.split(/\s+/).length} words` : 'Entire Document',
      mood: state.mood,
      occasion: state.occasion,
      completenessScore: `${state.completenessScore}%`,
    },
    null,
    2
  );
}

export function compileAIPromptPayload(state: EditorContextState): string {
  const rel = state.relationship;
  return `--- SYSTEM CONTEXT (CENTRAL PIPELINE) ---
Partner: ${rel.partnerName} | User: ${rel.userName} | Nickname: ${rel.nickname} | Anniversary: ${rel.anniversary} | Favorite Flower: ${rel.favoriteFlower}
Timeline: ${state.timeline ? `${state.timeline.title} (${state.timeline.date} at ${state.timeline.location})` : 'None'}
Memory: ${state.selectedMemory ? `[${state.selectedMemory.title}] ${state.selectedMemory.content}` : 'None'}
Mood: ${state.mood} | Occasion: ${state.occasion}
Selection: ${state.selectedText ? `"${state.selectedText}"` : 'Entire Document'}
-------------------------------------------`;
}
