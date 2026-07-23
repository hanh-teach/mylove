import { KnowledgeItem } from './KnowledgeTypes';

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
