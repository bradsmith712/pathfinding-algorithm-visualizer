import { astar } from './astar';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { greedy } from './greedy';
import type { Algorithm, AlgorithmId } from './types';

export interface AlgorithmEntry {
  id: AlgorithmId;
  name: string;
  run: Algorithm;
}

/** All algorithms in display order. Learn-page content lives in src/data/algorithms.ts. */
export const ALGORITHMS: readonly AlgorithmEntry[] = [
  { id: 'astar', name: 'A* (A Star)', run: astar },
  { id: 'dijkstra', name: "Dijkstra's Algorithm", run: dijkstra },
  { id: 'bfs', name: 'Breadth-First Search (BFS)', run: bfs },
  { id: 'dfs', name: 'Depth-First Search (DFS)', run: dfs },
  { id: 'greedy', name: 'Greedy Best-First Search', run: greedy },
];

export const DEFAULT_ALGORITHM_ID: AlgorithmId = 'astar';

export function getAlgorithm(id: AlgorithmId): AlgorithmEntry {
  const entry = ALGORITHMS.find((a) => a.id === id);
  if (!entry) throw new Error(`Unknown algorithm: ${id}`);
  return entry;
}

export function isAlgorithmId(value: string): value is AlgorithmId {
  return ALGORITHMS.some((a) => a.id === value);
}

export type { Algorithm, AlgorithmId, AlgorithmInput, CellType, Pos, StepEvent } from './types';
