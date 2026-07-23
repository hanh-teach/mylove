
import { Relationship, Person, Place, EntityType } from './types';

class RelationshipService {
  private relationships: Relationship[] = [];
  private people: Person[] = [];
  private places: Place[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const savedRel = localStorage.getItem('lovenote_relationships');
    const savedPeople = localStorage.getItem('lovenote_people');
    const savedPlaces = localStorage.getItem('lovenote_places');

    if (savedRel) this.relationships = JSON.parse(savedRel);
    if (savedPeople) this.people = JSON.parse(savedPeople);
    if (savedPlaces) this.places = JSON.parse(savedPlaces);

    // Initial seed if empty
    if (this.people.length === 0) {
      this.people = [
        { id: 'p1', name: 'Nguyễn Văn A', role: 'Người thương', createdAt: Date.now(), tags: ['Gia đình'] }
      ];
      this.saveData();
    }
    if (this.places.length === 0) {
      this.places = [
        { id: 'pl1', name: 'Đà Lạt', description: 'Thành phố ngàn hoa', createdAt: Date.now(), tags: ['Du lịch'] }
      ];
      this.saveData();
    }
  }

  private saveData() {
    localStorage.setItem('lovenote_relationships', JSON.stringify(this.relationships));
    localStorage.setItem('lovenote_people', JSON.stringify(this.people));
    localStorage.setItem('lovenote_places', JSON.stringify(this.places));
  }

  // Relationship Methods
  addRelationship(sourceId: string, sourceType: EntityType, targetId: string, targetType: EntityType, type: string = 'related') {
    // Check if exists
    const exists = this.relationships.find(r => 
      (r.sourceId === sourceId && r.targetId === targetId) || 
      (r.sourceId === targetId && r.targetId === sourceId)
    );
    if (exists) return exists;

    const newRel: Relationship = {
      id: `rel-${Math.random().toString(36).substr(2, 9)}`,
      sourceId,
      sourceType,
      targetId,
      targetType,
      type,
      createdAt: Date.now()
    };
    this.relationships.push(newRel);
    this.saveData();
    return newRel;
  }

  getRelatedEntities(entityId: string) {
    const rels = this.relationships.filter(r => r.sourceId === entityId || r.targetId === entityId);
    return rels.map(r => ({
      id: r.sourceId === entityId ? r.targetId : r.sourceId,
      type: r.sourceId === entityId ? r.targetType : r.sourceType,
      relationshipType: r.type
    }));
  }

  removeRelationship(id: string) {
    this.relationships = this.relationships.filter(r => r.id !== id);
    this.saveData();
  }

  // People Methods
  getPeople() { return this.people; }
  addPerson(person: Omit<Person, 'id' | 'createdAt'>) {
    const newPerson: Person = {
      ...person,
      id: `per-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    this.people.push(newPerson);
    this.saveData();
    return newPerson;
  }

  // Places Methods
  getPlaces() { return this.places; }
  addPlace(place: Omit<Place, 'id' | 'createdAt'>) {
    const newPlace: Place = {
      ...place,
      id: `plc-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    this.places.push(newPlace);
    this.saveData();
    return newPlace;
  }

  // Smart Linking 2.0
  async suggestRelationshipsForContent(entityId: string, entityType: EntityType, content: string): Promise<Relationship[]> {
    const suggestions: Relationship[] = [];
    const lowerContent = content.toLowerCase();

    // Mock AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Suggest Places
    this.places.forEach(place => {
      if (lowerContent.includes(place.name.toLowerCase())) {
        suggestions.push({
          id: `suggest-${Math.random().toString(36).substr(2, 9)}`,
          sourceId: entityId,
          sourceType: entityType,
          targetId: place.id,
          targetType: 'place',
          type: 'mention',
          aiSuggested: true,
          confidence: 'high',
          createdAt: Date.now()
        });
      }
    });

    // Suggest People
    this.people.forEach(person => {
      if (lowerContent.includes(person.name.toLowerCase())) {
        suggestions.push({
          id: `suggest-${Math.random().toString(36).substr(2, 9)}`,
          sourceId: entityId,
          sourceType: entityType,
          targetId: person.id,
          targetType: 'person',
          type: 'mention',
          aiSuggested: true,
          confidence: 'high',
          createdAt: Date.now()
        });
      }
    });

    // Suggest Timeline (Mock logic)
    if (lowerContent.includes('2023') || lowerContent.includes('chuyến đi')) {
      suggestions.push({
        id: `suggest-${Math.random().toString(36).substr(2, 9)}`,
        sourceId: entityId,
        sourceType: entityType,
        targetId: 'timeline-2023',
        targetType: 'timeline_event',
        type: 'related',
        aiSuggested: true,
        confidence: 'medium',
        createdAt: Date.now()
      });
    }

    return suggestions;
  }

  confirmSuggestion(suggestion: Relationship) {
    const newRel = { ...suggestion, aiSuggested: false, id: `rel-${Math.random().toString(36).substr(2, 9)}` };
    this.relationships.push(newRel);
    this.saveData();
    return newRel;
  }
}

export const relationshipService = new RelationshipService();
