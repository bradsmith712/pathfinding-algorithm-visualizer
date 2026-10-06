import type { AlgorithmId } from '../algorithms/types';

/**
 * Learn content for each algorithm. Phase 5 extends this with intro, feature
 * cards, step descriptions, pseudo-code, key concepts, complexity and use cases.
 */
export interface AlgorithmInfo {
  /** One-line subtitle for the Learn list. */
  subtitle: string;
  /** Short description shown under the Visualize dropdown. */
  summary: string;
}

export const ALGORITHM_INFO: Record<AlgorithmId, AlgorithmInfo> = {
  astar: {
    subtitle: 'Heuristic search (recommended)',
    summary: 'A* uses heuristics to find the shortest path efficiently.',
  },
  dijkstra: {
    subtitle: 'Shortest path (no heuristic)',
    summary: "Dijkstra's explores outward by distance and always finds the shortest path.",
  },
  bfs: {
    subtitle: 'Shortest path (unweighted)',
    summary: 'BFS explores level by level and finds the shortest path on an unweighted grid.',
  },
  dfs: {
    subtitle: 'Explores deeply',
    summary: 'DFS dives down one branch before backtracking. The path it finds can be long.',
  },
  greedy: {
    subtitle: 'Heuristic search (faster, not optimal)',
    summary: 'Greedy Best-First heads straight for the goal. Fast, but not always the shortest.',
  },
};
