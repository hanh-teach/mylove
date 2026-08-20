import { KnowledgeItem } from './KnowledgeTypes';
import { IMemory } from '../../memory/MemoryTypes';
import { Person } from '../../relationship/types';

export interface GraphNode {
  id: string;
  type: string;
  item?: KnowledgeItem;
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
  relation: string;
  weight: number;
}

export interface MemoryDuplicateCandidate {
  pairId: string;
  memoryA: IMemory;
  memoryB: IMemory;
  similarityScore: number;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export interface MemoryRelationshipSuggestion {
  id: string;
  memoryId: string;
  memoryTitle: string;
  personName: string;
  existingPersonId?: string;
  confidence: 'high' | 'medium' | 'low';
  contextSnippet: string;
}

/**
 * Merges two duplicate memory candidates into a single memory data structure.
 * Pure function that calculates combined tags, timeline events, and merged content.
 */
export function mergeMemoryCandidate(
  candidate: MemoryDuplicateCandidate,
  keepMemoryId: string
): {
  keepMemoryId: string;
  updates: Partial<IMemory>;
  deleteMemoryId: string;
} {
  const { memoryA, memoryB } = candidate;
  const keepMem = keepMemoryId === memoryA.id ? memoryA : memoryB;
  const deleteMem = keepMemoryId === memoryA.id ? memoryB : memoryA;

  // Combine tags
  const combinedTags = Array.from(
    new Set([...(keepMem.tags || []), ...(deleteMem.tags || [])])
  );

  // Combine timeline events
  const combinedEvents = [
    ...(keepMem.timelineEvents || []),
    ...(deleteMem.timelineEvents || []),
  ];

  // Combine content if distinct
  let updatedContent = keepMem.content || '';
  if (deleteMem.content && !updatedContent.includes(deleteMem.content)) {
    updatedContent += `\n\n[Nội dung gộp từ bản sao]: ${deleteMem.content}`;
  }

  return {
    keepMemoryId: keepMem.id,
    updates: {
      tags: combinedTags,
      content: updatedContent,
      timelineEvents: combinedEvents,
    },
    deleteMemoryId: deleteMem.id,
  };
}

/**
 * Normalizes Vietnamese text by removing diacritics, punctuation, and extra whitespace.
 */
export function normalizeVietnameseText(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Levenshtein distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Calculates title similarity using a hybrid Levenshtein distance + Token Jaccard index.
 */
export function calculateTitleSimilarity(titleA: string, titleB: string): number {
  const normA = normalizeVietnameseText(titleA);
  const normB = normalizeVietnameseText(titleB);

  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0;

  const maxLen = Math.max(normA.length, normB.length);
  const levDist = levenshteinDistance(normA, normB);
  const levSim = 1 - levDist / maxLen;

  const tokensA = new Set(normA.split(' ').filter(Boolean));
  const tokensB = new Set(normB.split(' ').filter(Boolean));
  let intersection = 0;
  tokensA.forEach(t => {
    if (tokensB.has(t)) intersection++;
  });
  const union = new Set([...tokensA, ...tokensB]).size;
  const tokenSim = union > 0 ? intersection / union : 0;

  return Math.max(levSim, tokenSim, levSim * 0.4 + tokenSim * 0.6);
}

/**
 * Real Duplicate Detection algorithm comparing memory entries based on title similarity & date proximity.
 */
export function findDuplicateMemories(
  memories: IMemory[],
  dismissedPairIds: string[] = []
): MemoryDuplicateCandidate[] {
  const candidates: MemoryDuplicateCandidate[] = [];
  const dismissedSet = new Set(dismissedPairIds);

  for (let i = 0; i < memories.length; i++) {
    for (let j = i + 1; j < memories.length; j++) {
      const memA = memories[i];
      const memB = memories[j];

      const pairId = [memA.id, memB.id].sort().join('_');
      if (dismissedSet.has(pairId)) continue;

      const titleSim = calculateTitleSimilarity(memA.title, memB.title);

      let dateDiffDays = 999;
      if (memA.date && memB.date) {
        const timeA = new Date(memA.date).getTime();
        const timeB = new Date(memB.date).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) {
          dateDiffDays = Math.abs(timeA - timeB) / (1000 * 60 * 60 * 24);
        }
      }

      const sameMonth =
        memA.date &&
        memB.date &&
        memA.date.substring(0, 7) === memB.date.substring(0, 7);

      let isCandidate = false;
      let confidence: 'high' | 'medium' | 'low' = 'low';

      if (titleSim >= 0.82) {
        isCandidate = true;
        confidence = 'high';
      } else if (titleSim >= 0.65) {
        isCandidate = true;
        confidence = dateDiffDays <= 30 ? 'high' : 'medium';
      } else if (titleSim >= 0.55 && (dateDiffDays <= 14 || sameMonth)) {
        isCandidate = true;
        confidence = 'medium';
      }

      if (isCandidate) {
        let reason = `Tiêu đề tương đồng (${Math.round(titleSim * 100)}%)`;
        if (dateDiffDays === 0) {
          reason += `, cùng ngày (${memA.date})`;
        } else if (dateDiffDays <= 30) {
          reason += `, ngày gần nhau (${Math.round(dateDiffDays)} ngày)`;
        }

        candidates.push({
          pairId,
          memoryA: memA,
          memoryB: memB,
          similarityScore: titleSim,
          confidence,
          reason,
        });
      }
    }
  }

  return candidates.sort((a, b) => b.similarityScore - a.similarityScore);
}

const COMMON_EXCLUDED_WORDS = new Set([
  'đà lạt', 'hồ chí minh', 'phú quốc', 'hà nội', 'việt nam', 'sài gòn',
  'mộc châu', 'nha trang', 'đà nẵng', 'quảng ninh', 'huế', 'thành phố',
  'bức thư', 'nhật ký', 'chuyến đi', 'kỷ niệm', 'tốt nghiệp', 'giao thừa',
  'sinh nhật', 'ngày cưới', 'cà phê', 'thước phim', 'dòng thời gian', 'love note',
  'lặn biển', 'phú quốc đi', 'lạt chuy', 'nguyễn văn'
]);

const NON_NAME_FIRST_OR_LAST_WORDS = new Set([
  'đi', 'bơi', 'lặn', 'ngắm', 'chuyến', 'ngày', 'sinh', 'bức', 'bản', 'thư',
  'nhật', 'kỷ', 'niệm', 'quán', 'nhà', 'phim', 'thước', 'đà', 'lạt', 'phú', 'quốc'
]);

/**
 * Real Relationship Extraction algorithm scanning memory entries for person mentions.
 */
export function findRelationshipSuggestions(
  memories: IMemory[],
  knownPeople: Person[],
  existingRelationships: { memoryId: string; targetId: string }[],
  dismissedSuggestionIds: string[] = []
): MemoryRelationshipSuggestion[] {
  const suggestions: MemoryRelationshipSuggestion[] = [];
  const dismissedSet = new Set(dismissedSuggestionIds);

  const existingRelSet = new Set(
    existingRelationships.map(r => `${r.memoryId}_${r.targetId}`)
  );

  memories.forEach(mem => {
    // 1. Match known contacts in content/notes/title
    const fullText = `${mem.title} ${mem.content} ${mem.notes || ''}`;
    const normText = normalizeVietnameseText(fullText);

    knownPeople.forEach(person => {
      const normPersonName = normalizeVietnameseText(person.name);
      if (normPersonName.length >= 2 && normText.includes(normPersonName)) {
        const linkKey = `${mem.id}_${person.id}`;
        if (!existingRelSet.has(linkKey)) {
          const sugId = `sug_${mem.id}_${person.id}`;
          if (!dismissedSet.has(sugId)) {
            let snippet = `Nhắc đến "${person.name}" trong kỷ niệm "${mem.title}".`;
            const idx = fullText.toLowerCase().indexOf(person.name.toLowerCase());
            if (idx !== -1) {
              const start = Math.max(0, idx - 20);
              const end = Math.min(fullText.length, idx + person.name.length + 30);
              snippet = `"...${fullText.slice(start, end).trim()}..."`;
            }

            suggestions.push({
              id: sugId,
              memoryId: mem.id,
              memoryTitle: mem.title,
              personName: person.name,
              existingPersonId: person.id,
              confidence: 'high',
              contextSnippet: snippet,
            });
          }
        }
      }
    });

    // 2. Regex scan content ONLY for potential new Vietnamese names (2-3 capitalized words)
    const contentText = `${mem.content || ''} ${mem.notes || ''}`;
    const nameRegex = /\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ][a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầuẩẫậnắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵýỷỹ]+(?:\s+[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴÝỶỸ][a-zàáâãèéêìíòóôõùúăđĩũơưăạảấầuẩẫậnắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵýỷỹ]+){1,2})\b/g;

    let match: RegExpExecArray | null;
    while ((match = nameRegex.exec(contentText)) !== null) {
      const extractedName = match[1].trim();
      const normExtracted = normalizeVietnameseText(extractedName);

      if (COMMON_EXCLUDED_WORDS.has(normExtracted)) continue;

      const words = normExtracted.split(' ');
      if (words.some(w => NON_NAME_FIRST_OR_LAST_WORDS.has(w))) continue;

      const isKnown = knownPeople.some(p => {
        const normP = normalizeVietnameseText(p.name);
        return normP === normExtracted || normP.includes(normExtracted);
      });
      if (isKnown) continue;

      const sugId = `sug_raw_${mem.id}_${normExtracted.replace(/\s+/g, '_')}`;
      if (dismissedSet.has(sugId)) continue;

      if (suggestions.some(s => s.memoryId === mem.id && normalizeVietnameseText(s.personName) === normExtracted)) {
        continue;
      }

      const idx = match.index;
      const start = Math.max(0, idx - 15);
      const end = Math.min(contentText.length, idx + extractedName.length + 25);
      const snippet = `"...${contentText.slice(start, end).trim()}..."`;

      suggestions.push({
        id: sugId,
        memoryId: mem.id,
        memoryTitle: mem.title,
        personName: extractedName,
        confidence: 'medium',
        contextSnippet: snippet,
      });
    }
  });

  return suggestions;
}

export class KnowledgeGraph {
  private static nodes = new Map<string, GraphNode>();
  private static edges: GraphEdge[] = [];

  public static addNode(node: GraphNode): void {
    this.nodes.set(node.id, node);
  }

  public static addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  public static traverse(startId: string, maxDepth: number = 2): GraphNode[] {
    const visited = new Set<string>();
    const result: GraphNode[] = [];
    
    const queue: { id: string, depth: number }[] = [{ id: startId, depth: 0 }];
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;

      const { id, depth } = current;
      if (!visited.has(id)) {
        visited.add(id);
        const node = this.nodes.get(id);
        if (node) result.push(node);
        
        if (depth < maxDepth) {
          const neighbors = this.edges.filter(e => e.sourceId === id).map(e => e.targetId);
          neighbors.forEach(nId => {
            if (!visited.has(nId)) {
              queue.push({ id: nId, depth: depth + 1 });
            }
          });
        }
      }
    }
    
    return result;
  }

  public static clear(): void {
    this.nodes.clear();
    this.edges = [];
  }
}

