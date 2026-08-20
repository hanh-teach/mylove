import { KnowledgeItem } from './KnowledgeTypes';

export class KnowledgeValidator {
  /**
   * Performs deep data validation on Knowledge Items before persisting or indexing them.
   */
  public static validate(item: Partial<KnowledgeItem>): { isValid: boolean; error?: string } {
    if (!item.id) {
      return { isValid: false, error: 'Knowledge Item must have a unique identifier (id)' };
    }
    if (!item.title || item.title.trim() === '') {
      return { isValid: false, error: 'Knowledge Item must have a non-empty title' };
    }
    if (!item.type) {
      return { isValid: false, error: 'Knowledge Item must have a designated type' };
    }
    if (!item.content || item.content.trim() === '') {
      return { isValid: false, error: 'Knowledge Item must contain non-empty semantic text' };
    }
    if (!item.owner) {
      return { isValid: false, error: 'Knowledge Item must specify an owner' };
    }
    if (!item.source) {
      return { isValid: false, error: 'Knowledge Item must specify an source origin' };
    }

    // Ensure valid visibility levels
    const validVisibilities = ['private', 'shared', 'enterprise'];
    if (item.visibility && !validVisibilities.includes(item.visibility)) {
      return { isValid: false, error: `Invalid visibility configuration: ${item.visibility}` };
    }

    // Normalize scale ratings
    if (item.importance !== undefined && (item.importance < 1 || item.importance > 10)) {
      return { isValid: false, error: 'Knowledge Item importance rating must be between 1 and 10' };
    }

    return { isValid: true };
  }
}
